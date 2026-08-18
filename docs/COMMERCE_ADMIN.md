# Admiral Energy Commerce Operations

Last updated: August 17, 2026

This document is the operating and engineering guide for the private commerce dashboard at `/admin/commerce`.

## Architecture

The customer website remains a Next.js App Router application on Netlify. The internal dashboard extends that application without adding public navigation or changing the public product catalog.

- UI: server-rendered routes under `/admin/commerce`
- Mutations and exports: protected Next.js Route Handlers under `/api/admin/commerce`
- Checkout: existing Netlify Function at `/.netlify/functions/create-checkout-session`
- Payment ingestion: Netlify Function at `/.netlify/functions/stripe-webhook`
- Persistence: Netlify Database managed Postgres through `@netlify/database`
- Schema changes: additive SQL migrations in `netlify/database/migrations`
- Authentication: one server-configured administrator, bcrypt password verification, and a signed HTTP-only session cookie
- Business rules: isolated in `src/lib/commerce` and covered by `npm test`

Admin pages are `noindex`, absent from the sitemap, unlinked from the public site, and protected server-side. Public routes do not query the commerce database, so a database outage cannot take down the storefront.

## Admin routes

- `/admin/commerce` — period KPIs, data-quality warnings, trend, channel profitability, recent orders
- `/admin/commerce/orders` — server-side search, filters, pagination, and CSV export
- `/admin/commerce/orders/new` — manual Marketplace, D2D/local, wholesale, cash, or other order entry
- `/admin/commerce/orders/[id]` — sale, customer, source, payment, refunds, COGS, profit, lot allocations, and fulfillment
- `/admin/commerce/inventory` — current inventory, purchase lots, ledger corrections, and suppliers
- `/admin/commerce/products` — internal products; an internal record never publishes a public product automatically
- `/admin/commerce/products/[id]` — product performance, inventory, lots, suppliers, channels, and recent orders
- `/admin/commerce/channels` — Stripe health/manual reconciliation, unmatched queue, and future adapter status

## Data model

The initial migration creates these additive tables:

- `commerce_products`
- `commerce_suppliers`
- `commerce_inventory_lots`
- `commerce_inventory_movements`
- `commerce_orders`
- `commerce_order_items`
- `commerce_order_item_lot_allocations`
- `commerce_order_cost_adjustments`
- `commerce_external_transactions`
- `commerce_refunds`
- `commerce_processed_webhook_events`
- `commerce_channel_connections`
- `commerce_stripe_sync_runs`
- `commerce_unmatched_transactions`
- `commerce_admin_login_attempts`

Money is stored as integer cents. Timestamps are stored as `TIMESTAMPTZ` in UTC and displayed in `COMMERCE_TIMEZONE`, which defaults to `America/New_York`.

The schema preserves separate concepts for sales source, acquisition source, payment provider, fulfillment method, and inventory source. A Facebook Marketplace lead paid through Stripe and fulfilled from Admiral inventory can therefore be represented accurately.

## Environment variables

Set secrets in Netlify, never in committed files.

| Variable | Purpose |
| --- | --- |
| `COMMERCE_ADMIN_EMAIL` | Authorized administrator email, matched case-insensitively |
| `COMMERCE_ADMIN_PASSWORD_HASH` | Bcrypt hash of the administrator password |
| `COMMERCE_SESSION_SECRET` | At least 32 random characters used to sign eight-hour sessions |
| `COMMERCE_TIMEZONE` | Optional business display timezone; defaults to `America/New_York` |
| `STRIPE_SECRET_KEY` | Existing server-side checkout, reconciliation, and webhook API key |
| `STRIPE_WEBHOOK_SECRET` | Signature secret for the production Stripe webhook endpoint |
| `STRIPE_PRICE_ID_SIDEKICK` | Optional existing Stripe Price ID for SideKick |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin and Stripe return URL |

`NETLIFY_DB_URL` and the database driver variables are injected by Netlify Database. Do not create, copy, or commit them manually.

Generate the password hash locally:

```bash
npm run commerce:hash-password
```

The command reads the password interactively without echoing it and prints only the bcrypt hash. Use a separate random value for `COMMERCE_SESSION_SECRET`.

## Database

Netlify Database was selected because this repository already deploys on Netlify and no production database existed. Installing `@netlify/database` and deploying provisions the managed Postgres database for the linked Netlify project. Deploy Preview branches receive isolated database branches; production data is not copied into a preview by application code.

Local development:

```bash
npx netlify dev
npx netlify database migrations apply
npx netlify database status
```

Production and Deploy Preview migrations run before publishing. Never edit or delete a migration after it has been applied. Make later schema changes in a new additive migration.

The first migration seeds only the legitimate existing SideKick identity:

- Internal ID: `hs-43-solar-power-bank`
- SKU: `AE-HS43-001`
- Slug: `sidekick`
- Selling price: `6999` cents
- Currency: `USD`

It does not seed inventory, suppliers, purchase history, COGS, or sales history.

## Admin access and security

All three commerce auth variables must be present or login fails closed. Passwords are compared only on the server with bcrypt. Sessions use HS256 signing, an eight-hour lifetime, `HttpOnly`, `SameSite=Strict`, and `Secure` in HTTPS environments.

Login attempts are keyed by a one-way hash of email, client address, and the session secret. Five failures in a 15-minute window lock that key for 15 minutes. The database is required for login rate limiting; if it is unavailable, login fails safely.

Every state-changing route requires an authenticated session, validates structured input with Zod, uses parameterized SQL, and checks same-origin or browser Fetch Metadata. Notes and URLs are rendered as escaped text; tracking and supplier URLs must pass URL validation. CSV exports neutralize spreadsheet-formula prefixes.

## Stripe

Stripe remains the source of truth for website payments. Checkout still charges the existing SideKick price and redirects through the existing Stripe-hosted flow.

New Checkout Sessions and PaymentIntents carry:

- internal order reference
- product ID
- product slug
- SKU
- quantity
- source channel
- acquisition channel
- UTM source, medium, campaign, term, and content
- landing page
- referrer

The existing browser analytics helper supplies the first-party attribution already stored in session storage. No new fingerprinting or duplicate GA4 purchase event was added.

Configure the Stripe webhook endpoint as:

```text
https://admiralenergy.ai/.netlify/functions/stripe-webhook
```

Subscribe to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `refund.created`
- `refund.updated`
- `charge.refunded`

Webhook signatures are verified before processing. Event IDs are claimed in `commerce_processed_webhook_events`; processed duplicates are ignored, failed events can retry, and stale processing claims can recover after ten minutes. A database failure returns `503` so Stripe retries instead of silently dropping the sale.

Successful sessions are normalized into the shared order model. Stripe fees come from the expanded balance transaction when available. A session without a known exact product ID is placed in `commerce_unmatched_transactions`; the system never guesses a product from the dollar amount.

The protected **Sync Stripe** action checks completed sessions, repairs fee/payment information, imports webhook misses, and reconciles succeeded refunds. It is idempotent and read-only toward Stripe: it does not create charges, refunds, customers, or products. Each run examines up to 500 sessions to remain safe within a serverless request. Unknown sessions remain in the unmatched queue until the owner opens **Assign**, chooses the real product/source/quantity/cost facts, and creates the linked order; the payment amount is never used to guess those facts.

## SideKick tracking

The dashboard can now track:

- website and manually entered SideKick orders
- true sales source and payment provider
- first-party UTM/landing/referrer attribution for new website checkouts
- quantities, pricing, discounts, shipping charged, tax, and total charged
- refunds and Stripe fees
- purchase supplier, supplier order, purchase/receipt dates, and location
- unit purchase cost and landed unit cost
- exact/FIFO lot allocations and historical order COGS
- gross product sales, net product sales, gross profit/margin, contribution profit/margin
- fulfillment method, status, carrier, and tracking
- inventory on hand and costed inventory value
- channel profitability

## Inventory and COGS

Inventory is a ledger, not an editable counter. A received purchase lot creates both a lot and a positive receipt movement in one transaction. Manual corrections require a reason. Negative corrections consume costed lots FIFO when possible.

For inventory sent to Admiral first:

```text
(quantity received × unit purchase price
 + inbound supplier shipping
 + duties/import fees
 + other inbound landed costs)
÷ usable quantity received
= landed unit cost
```

Rounding occurs once to integer cents per unit. Outbound customer shipping and packaging remain order expenses, not inbound landed cost.

Stocked sales use an explicitly selected available lot when provided; otherwise they allocate FIFO. The allocation snapshots unit cost and total COGS on the order item, so a later supplier-price change does not rewrite historical profit. If insufficient costed inventory exists, the sale is retained with `missing_cost` and the missing quantity is explicit—no cost is invented.

Order detail includes a reason-required COGS correction. A correction writes an immutable before/after audit row and recalculates the order's gross and contribution profit; it does not rewrite the original lot allocation or silently alter inventory.

Dropship orders require the supplier unit cost. Supplier item cost becomes product COGS, while supplier shipping remains a fulfillment expense. Supplier purchase date, supplier order, supplier tracking, delivery notes, and return disposition can be recorded on the order. Refund ingestion changes financial status only and never silently restocks a physical unit; a physical restock must be recorded separately in the inventory ledger.

## Financial definitions

- Gross product sales: product subtotal before discounts/refunds, excluding tax and shipping
- Net product sales: gross product sales minus discounts and recorded refunds
- Product COGS: historical allocated landed cost or entered dropship item cost
- Gross profit: net product sales minus product COGS
- Gross margin: gross profit divided by net product sales
- Contribution profit: net product sales plus shipping collected, minus product COGS, processor fees, channel fees, customer shipping expense, supplier shipping, and packaging/fulfillment expense
- Total customer payments: product subtotal minus discount, plus shipping charged and tax

Taxes remain separate and are not represented as operating revenue. These are operational metrics, not formal accounting or tax records. Stripe refunds do not currently provide an item-level product/shipping/tax split, so the recorded refund total conservatively reduces net product sales.

## Channels

Working now:

- Stripe / Admiral website — webhook ingestion and manual reconciliation
- Manual — direct entry
- Facebook Marketplace — manual sales source
- D2D / local — manual sales source
- Wholesale / other — manual sales source

Future seams exist for TikTok Shop, Meta Shop, and other commerce APIs through `CommerceChannelAdapter`, normalized external IDs, external item identity fields, channel fees, connection state, and sync health. No speculative OAuth or unsupported marketplace API was added.

To add an adapter, implement the interface in `src/lib/commerce/channels.ts`, normalize external orders into the shared order shape, map products by stable external ID/SKU, preserve idempotency, add provider-specific webhook verification where supported, and document its environment variables.

## Adding a future product

Create the real internal product from **Products**. This creates only the operational record. Publishing a new public product is a separate reviewed change that must update public page content, checkout configuration, product data, canonical/structured data, Merchant Center inputs, tests, and the product-discovery audit. Never make an internal product automatically public.

## CSV exports

Authenticated exports are available for:

- filtered orders
- current inventory
- purchase lots

Exports use understandable headers, decimal USD values, UTC timestamps, a 10,000-row safety limit, private/no-store caching, and spreadsheet-formula protection.

## Deployment

1. Run `npm ci`.
2. Run `npm run lint`.
3. Run `npx tsc --noEmit`.
4. Run `npm test`.
5. Run `npm run build`.
6. Run the product-discovery audit against a local/preview deployment.
7. Deploy a non-production Netlify preview from the commerce branch.
8. Confirm the migration, login, admin routes, and public SideKick page in the preview.
9. Configure the production commerce auth variables and Stripe webhook secret.
10. Merge through the established GitHub-to-Netlify workflow only after preview verification.
11. Run **Sync Stripe** after production deployment and review unmatched items.
12. Enter the first real supplier/purchase lot manually. Do not infer physical stock from `InStock` storefront status.

## Recovery

- A code rollback can redeploy the prior Git commit; the additive commerce tables remain intact.
- Do not delete an applied migration to roll back code.
- Export orders, inventory, and lots before any material data correction.
- If Stripe is unavailable, existing commerce data remains readable and webhook delivery retries later.
- If the database is unavailable, public pages and checkout continue independently; admin data routes show a safe unavailable state.
- Failed Stripe sync runs retain a safe error summary and can be retried.
- Unmatched Stripe sessions remain queued until a legitimate product mapping exists.

## Known limitations

- No custom tax engine, accounting ledger, CRM, multi-warehouse reservation system, carrier API, or marketplace OAuth integration
- No automatic physical restock from a refund
- No item-level refund allocation beyond Stripe's available order-level refund amount
- Return disposition classification does not itself change inventory; a restock/damage/loss movement must be recorded explicitly
- Historical Stripe sessions without a recognized product ID remain unmatched by design
- Manual sync is capped at 500 sessions per run
