# SideKick One Product Store SST Overhaul Report

Date: August 20, 2026
Canonical product route: `/sidekick`
Product: Admiral Energy SideKick (model HS-43, SKU AE-HS43-001)

## 1. Executive Summary

The SideKick product experience was rebuilt around the One Product Store SST and the supplied mission architecture. The result is a mobile-first, single-product conversion path with a clearer emergency-readiness promise, an authentic product gallery, benefit-led selling, quantity selection, centralized product and policy data, truthful structured data, bulk lead capture, and a separate whole-home pathway.

No ratings, reviews, scarcity, inventory counts, comparison claims, or certifications were invented. The site continues to use Stripe-hosted checkout and the existing Netlify architecture. The integrated October 2026 branch passes lint, typecheck, the webpack production build, the production-dependency audit, SEO audit, and product-discovery audit. A Netlify preview and credentialed checkout/form tests still require owner-authorized external configuration.

This is a design and implementation improvement, not evidence of a measured conversion-rate increase. Production impact should be evaluated after analytics mappings and the real checkout flow are validated.

## 2. SST Audit

The pre-overhaul audit scored **134/200**. The implemented experience is estimated at **172/200**, with authentic social proof intentionally left unresolved rather than fabricated.

| # | SST category | Before | Implemented | Notes |
|---:|---|---:|---:|---|
| 1 | Five-second clarity | 7 | 9 | Benefit, audience, product, and price are now immediately visible. |
| 2 | Problem recognition | 7 | 9 | Clear emergency-readiness problem without fear-based exaggeration. |
| 3 | Value proposition | 7 | 9 | One primary promise with direct support points. |
| 4 | Differentiation | 7 | 9 | Integrated cables, light, compass, level, and three recharge paths are explained in context. |
| 5 | Visual proof | 8 | 9 | Real product photos drive the gallery and demonstration sections. |
| 6 | Demonstration | 6 | 8 | Product functions are shown with real imagery; video remains a media opportunity. |
| 7 | Benefit translation | 7 | 9 | Features are consistently translated into benefit and outcome. |
| 8 | Recharge hierarchy | 6 | 9 | Wired charging is primary; solar and crank are clearly backup options. |
| 9 | Social proof | 2 | 4 | No authentic reviews or approved customer media were available. |
| 10 | Trust | 7 | 9 | Veteran-owned, North Carolina-based, seller identity, warranty, returns, and secure checkout are visible. |
| 11 | Offer strength | 6 | 9 | Price, quantity, total, shipping, returns, warranty, and checkout expectations are together. |
| 12 | Product detail | 8 | 9 | Included items, specifications, and usage guidance are scannable. |
| 13 | Objection handling | 7 | 9 | FAQ answers charging, capacity, flights, output, solar, crank, shipping, returns, and warranty. |
| 14 | Mobile UX | 7 | 9 | Mobile content order, swipe gallery, large tap targets, and contextual sticky CTA were validated. |
| 15 | Performance | 7 | 9 | The oversized client component was split; unnecessary reveal behavior was removed. |
| 16 | Checkout readiness | 7 | 8 | Session creation and error recovery are improved; live Stripe validation is still required. |
| 17 | SEO | 8 | 9 | Canonical route, redirects, metadata, sitemap, and truthful Product schema align. |
| 18 | Accessibility | 8 | 9 | Keyboard lightbox, focus handling, labels, headings, and target sizes were checked. |
| 19 | Funnel architecture | 7 | 9 | Consumer conversion completes before bulk and whole-home paths. |
| 20 | Analytics | 5 | 8 | Standard ecommerce events exist; GTM/GA4 mappings and live purchase observation remain gates. |

### Baseline weaknesses below 8

| Weakness | Likely impact | Resolution or recommendation |
|---|---|---|
| Generic work-centric opening and diluted promise | Visitors had to interpret who the product was for and why it mattered. | Replaced with a direct emergency-readiness thesis and visible price. |
| Static close-ups without a coherent demonstration sequence | Product utility and scale were harder to understand. | Added a swipeable 10-image gallery, lightbox, and real-image demonstration sections; add video next. |
| Feature-heavy copy | Hardware facts did not consistently become purchase reasons. | Rewrote sections as feature → benefit → practical outcome. |
| Solar/crank could be interpreted as primary charging | Higher risk of unrealistic expectations and dissatisfaction. | Explicitly made USB-C wired charging primary and solar/crank backup methods. |
| Trust and seller transparency were dispersed | Increased hesitation near checkout. | Added a concise trust section and colocated policies around the offer. |
| No authentic social proof | Trust remains weaker than it could be. | Do not fabricate it; collect approved reviews, usage stories, and customer photos. |
| Weak offer/value framing | Price was insufficiently justified and quantity behavior was absent. | Added a functional value stack, quantity selector, total, and fulfillment expectations. |
| Inconsistent canonical paths and thin ecommerce analytics | Split SEO signals and incomplete funnel diagnosis. | Consolidated on `/sidekick`, redirected legacy routes, and added standard ecommerce events. |

The only implemented score still below 8 is social proof. That gap can materially affect trust, but it requires authentic, permissioned customer evidence.

## 3. Page Architecture

1. Five-second hero: benefit, audience, authentic product visual, price, trust, and primary CTA.
2. Immediate value strip.
3. Problem insight: emergency gear only helps when it is actually with you.
4. Real-life use cases.
5. Product demonstration using existing product photography.
6. Convenience features expressed as benefit and outcome.
7. Wired / solar / crank recharge hierarchy.
8. Value justification based on included functions, without competitor or savings claims.
9. Included items and grouped technical specifications.
10. Admiral Energy trust and seller-transparency section.
11. Primary purchase module with quantity and total.
12. Objection-handling FAQ.
13. Final consumer CTA.
14. Bulk inquiry form.
15. Separate whole-home resilience pathway.

The consumer purchase funnel completes before the bulk and whole-home paths, so secondary intents do not interrupt the primary product decision.

## 4. Conversion Improvements

- Clearer above-the-fold promise and audience fit.
- Mobile content order is introduction → gallery → offer → proof, with a contextual sticky CTA.
- Authentic 10-image gallery with thumbnails, swipe navigation, keyboard-accessible lightbox, focus trap, and pagination.
- Benefits and outcomes replace raw feature enumeration.
- Recharge expectations distinguish primary wired charging from backup solar and crank charging.
- Quantity selector supports 1–5 units and calculates the displayed total from centralized price data.
- Trust, shipping, returns, warranty, and secure-checkout expectations appear near the decision point.
- Checkout errors preserve the page and provide a support recovery path.
- Bulk purchasing is captured after the consumer funnel through a Netlify-compatible form.
- Whole-home systems remain a clearly separate next step.

## 5. Public Product Facts Used

| Field | Value used |
|---|---|
| Product / model / SKU | Admiral Energy SideKick / HS-43 / AE-HS43-001 |
| Price | $69.99, from centralized product data |
| Recharge methods | Wired USB as primary; integrated solar and hand crank as supplemental/emergency inputs |
| Connections | Built-in USB-C, Micro-USB, and Lightning cables; USB-A and USB-C connections |
| Other visible features | Integrated dual-LED flashlight, compass, and bubble level |
| Intended use | Compatible phones and small USB-powered electronics; not appliances or household circuits |
| Warranty | One-year limited warranty, from centralized policy data |
| Availability | Displayed as in stock from site configuration; not a live inventory feed |

Earlier draft copy contained numeric battery, electrical, recharge-time, light-output, runtime, dimension, weight, and temperature specifications. Those values are not published by the current product component because the source manual/specification evidence still requires owner verification.

## 6. PRODUCT DATA REQUIRED FROM HUMAN

- Official manufacturer/legal brand attribution and a source manual or specification sheet.
- Complete package contents, including every cable, adapter, charger, manual, and accessory.
- Verified IP/water-resistance rating; no such claim is currently made.
- Certifications and compliance documentation.
- Materials, durability limits, care, storage, and long-term battery maintenance guidance.
- Live inventory source and acceptable low-stock / sold-out behavior.
- Legal approval and complete terms for the one-year limited warranty.
- Shipping rules for Alaska, Hawaii, US territories, PO boxes, and international orders.
- Tax behavior and the exact checkout-facing delivery estimate logic.
- COGS, margin thresholds, and approved multi-unit or bundle economics before introducing discounts.
- Permissioned customer reviews, usage stories, and customer media.

## 7. Media Gaps

The page uses only authentic repository imagery. No generated lifestyle image was introduced because none could truthfully depict documented product use.

Recommended future assets:

1. A true in-hand scale photograph.
2. A phone actively charging from the SideKick.
3. A vehicle emergency-kit lifestyle scene.
4. A work-bag or jobsite carry scene.
5. A low-light flashlight demonstration.
6. A complete package-contents flat lay.
7. A concise 30–45 second product demonstration video.
8. Customer-approved use photos after permission and claim review.

## 8. Analytics

Implemented data-layer events:

| Event | Trigger |
|---|---|
| `view_item` | Canonical SideKick page view |
| `sidekick_view` | SideKick page view compatibility event |
| `gallery_view` | Main gallery item changes |
| `sidekick_buy_click` | Checkout CTA activation |
| `begin_checkout` | Stripe checkout session is created successfully |
| `sidekick_checkout_start` | Checkout session compatibility event |
| `generate_lead` | Bulk inquiry submission succeeds |
| `sidekick_bulk_inquiry_success` | Bulk form compatibility event |
| `purchase` | Server-verified Stripe session is complete and paid on the success return |

`purchase` is deliberately not emitted for an absent or invalid `session_id`. Current purchase measurement depends on the browser returning to the success URL; a server-side GA4 event from the Stripe webhook would improve resilience. GTM container mappings, GA4 DebugView, consent behavior, and production event payloads must be validated by a human before launch.

## 9. SEO

- Added canonical `/sidekick` metadata with a unique title and description.
- Added Open Graph metadata using a real product image.
- Consolidated `/shop/sidekick`, `/shop/hs-43-solar-power-bank`, and `/shop/solar-power-bank` through permanent redirects.
- Updated internal links and sitemap to the canonical route.
- Added truthful `Product`, `Offer`, `MerchantReturnPolicy`, and `BreadcrumbList` structured data.
- Included seller, SKU, model, price, currency, availability, and condition without review or rating markup.
- Preserved semantic headings and descriptive image alternative text.

## 10. Technical Verification

Completed locally:

- `npm run lint` — pass.
- `npm run typecheck` — pass.
- `npm run build` with Next.js 16.4.2 using webpack — pass.
- `npm audit --omit=dev` — 0 vulnerabilities.
- `npm run audit:seo -- http://127.0.0.1:3000` — pass.
- `npm run audit:product-discovery -- http://127.0.0.1:3000` — pass.
- `npm run audit:forms` — pass.
- Core routes and policy pages — HTTP 200.
- Legacy SideKick routes — 308 locally to `/sidekick`; Netlify config uses 301.
- Sitemap — canonical SideKick URL appears once; no legacy product URL.
- Browser widths — 320, 390, 430, 768, 1280, and 1440 px with no horizontal overflow or broken images.
- Tap targets — no tested interactive target below 44 px.
- Gallery, lightbox arrows, Escape, focus wrap/return, quantity totals, FAQ, and contextual sticky CTA — pass.
- Metadata and JSON-LD inspection — pass; no review/rating schema.
- Invalid success-session state — does not claim confirmation and does not emit a purchase event.
- Browser console — no observed page errors during the audited flows.

Not completed because external credentials or production configuration are required:

- Real Stripe session creation, payment, webhook, success return, and refund flow.
- Netlify bulk-form receipt in the production account.
- GTM Preview and GA4 DebugView verification.
- Real device/browser matrix and assistive-technology regression testing.

## 11. Files Changed

- Canonical page and SEO: `src/app/sidekick/page.tsx`, `src/app/sitemap.ts`, `next.config.ts`, `netlify.toml`.
- Product experience: `src/components/SidekickProductExperience.tsx`, `src/components/sidekick/*`, `src/app/globals.css`, `src/components/Header.tsx`.
- Centralized commerce/product data: `src/data/products.ts`, `src/data/commerce.ts`, `src/data/sidekick.ts`.
- Checkout and confirmation: `netlify/functions/create-checkout-session.ts`, `src/app/shop/success/page.tsx`.
- Policy alignment: shipping and warranty pages.
- Internal links and schema: shop, home-resilience, layout, legacy product routing.
- Bulk capture: `public/__forms.html` and the SideKick bulk inquiry component.
- Toolchain and documentation: `package.json`, `package-lock.json`, `docs/LAUNCH_CHECKLIST.md`, and this report.

## 12. Human Gates

1. Resolve every item in **PRODUCT DATA REQUIRED FROM HUMAN**, with source documentation and legal approval where needed.
2. Verify the real Stripe checkout, taxes, shipping copy, successful return, failed/canceled state, webhook, email receipt, and refund path.
3. Map and validate all listed data-layer events in GTM and GA4, including consent behavior.
4. Submit and confirm a bulk inquiry in Netlify Forms and verify its notification/CRM destination.
5. Obtain permissioned reviews and customer media; do not add aggregate rating schema until the displayed evidence supports it.
6. Run a final real-device and assistive-technology check before production release.
7. Review the diff, approve the upgrade to Next.js 16.4.2 / Netlify Next Runtime 5.16.2, and authorize commit, push, and production deploy.

## 13. Deployment Status

**Local implementation: complete. Production: untouched. Draft preview: not created.**

Multiple draft-only `netlify deploy --build` attempts were made. The application compiled and generated all routes successfully. After a Windows-local symlink workaround, Netlify also bundled the Next server function and all repository functions. Its Next.js Runtime then failed in the `onPostBuild` static-content publishing hook with `Error: Failed publishing static content`, before a preview URL was issued.

Recommended next action: run a draft Netlify deploy from Linux/WSL or a CI preview build after the changes are committed to an approved preview branch. Do not use `--prod` until the human gates above are complete.
