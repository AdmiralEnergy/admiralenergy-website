# Kings Mountain Growth MVP — Initial Technical Audit

**Audit date:** October 17, 2026
**Scope:** Repository and production behavior relevant to local discovery, lead capture, attribution, Netlify deployment, and checkout safety.
**Authority:** The current executable source is authoritative when older documentation disagrees.
**Deployment status:** No production deployment or Google Business Profile change was made as part of this work.

This document records the initial state found before the Kings Mountain MVP changes, the behavior that must be preserved, and the items that still require owner or dashboard verification. The repository was being reconciled with other SideKick work during implementation, so the final integrated branch must be tested again after conflicts are fully resolved.

## Executive summary

The site already had a solid Next.js/Netlify base: a focused SideKick product route, Stripe Checkout and signed webhooks, Netlify Forms discovery markup, server-rendered metadata and JSON-LD, canonical redirects, GTM/dataLayer tracking, a sitemap, and useful SEO/product audit scripts. The main growth gaps were a Kings Mountain-specific search landing page, locally focused homepage messaging, a qualified homeowner form with distinct consent choices, durable first-touch attribution, and an owner-operable lead workflow.

Code inspection alone cannot prove that Netlify is retaining submissions or sending notifications. Those are dashboard and deployed-preview acceptance tests. A returned HTTP 200 only proves that an HTTP request completed; it does not prove that a lead appears in the intended Netlify form, was not classified as spam, or triggered an email.

## Working behavior to preserve

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4 are the active application stack.
- The focused public journey uses `/sidekick`, `/home-backup`, `/resources`, `/about`, `/blog`, and policy pages, with old URLs permanently redirected to canonical destinations.
- SideKick remains the only active product entity. Its public offer is **$69.99 USD**, in stock, with the existing shipping, return, and warranty language.
- Checkout is created server-side through `create-checkout-session`; product input is allowlisted and quantity is bounded. Stripe webhook payloads are verified with `STRIPE_WEBHOOK_SECRET` before processing.
- `public/__forms.html` provides static Netlify Forms declarations, while visible React forms submit URL-encoded fields using matching form names.
- `GTM-N6HRP34Z`, `window.dataLayer`, and the existing analytics helper are active. Existing conversions distinguish lead types such as home backup, resilience list, and bulk inquiries.
- The production SEO and product-discovery audits passed during the initial live review. They verified canonical pages, structured-data boundaries, redirects, retired-product 404s, sitemap/robots behavior, product price, and product image availability.
- Production redirects preserved UTM query parameters during spot checks of `/quote.html` to `/home-backup` and `/shop/sidekick` to `/sidekick`.
- Production served `/__forms.html` successfully during the initial review. This confirms the registration file was reachable, but not that every form submission is retained or notified.

## Initial discrepancies and gaps

### Local positioning and search intent

- There was no `/kings-mountain/home-backup` page at the start of the audit.
- The homepage and regional home-backup page did not fully satisfy the distinct local search intent described in the mission. The local page should answer Kings Mountain/Cleveland County planning questions; `/home-backup` should remain the broader educational and assessment route.
- The project must not publish a private residential address, fabricated coordinates, ratings, reviews, projects, or unsupported installer/dealer claims. `Generac Aligned Contractor` is the approved designation.

### Lead capture and attribution

- The initial homeowner form did not include the requested consideration timeline, separate optional marketing consent, explicit partner-referral consent, or a complete first-touch attribution record.
- Any visible form fields added by the MVP must have exact corresponding names in `public/__forms.html`; otherwise Netlify may not register or store them as expected.
- Initial attribution must be preserved across navigation and copied to hidden form fields. Names, email addresses, phone numbers, ZIP codes, and notes must never be sent to GTM, GA4, advertising pixels, or URLs.
- Exactly one `generate_lead` event should fire only after a confirmed successful submission. Starts, validation errors, and transport errors should use non-conversion events.
- The legacy `capture-lead` function previously logged the full lead record to Netlify logs and returned a synthetic success/lead ID even though it had no durable storage or notification integration. It was unused by the current application and has been removed. Current lead capture uses Netlify Forms.

### Documentation drift

- `README.md` still describes Snipcart even though the active purchase path uses Stripe Checkout.
- `docs/NETLIFY_FORMS_GUIDE.md` and `docs/INDEX.md` describe the retired `admiral-contact`/`quote.html` form flow. Active forms are declared in `public/__forms.html` and implemented in current React components.
- Parts of `CODEX.md` describe earlier redirect destinations and older form behavior. Treat its business guardrails as important, but verify route and form details against executable source.
- Several historical architecture/session documents describe chat, OTP, and helper files as active or operational. Current application routes do not establish that those features are in use.

## Contact information requiring owner verification

Do not silently choose among these values:

- **Phone currently published by the active site:** `(984) 238-4187`
- **Phone shown in the supplied Facebook business-information screenshot:** `(704) 286-6303`
- **Older archived phone:** `(980) 209-2101`
- **Email variants in the repository:** `david@admiralenergy.ai`, `info@admiralenergy.ai`, and `contact@admiralenergy.ai`

The current working phone, `(984) 238-4187`, should remain in public output until David confirms the preferred number. The active application primarily uses `david@admiralenergy.ai`, while some SideKick success/bulk-order content uses `info@admiralenergy.ai`; the inactive legacy chat script names `contact@admiralenergy.ai`. The owner must confirm:

1. the canonical public phone number;
2. the canonical public support/contact email;
3. the mailbox that should receive Netlify notifications; and
4. whether sales, product support, privacy requests, and form notifications should use separate addresses.

The public contact record should remain centralized in application configuration. Notification recipients belong in Netlify dashboard settings, not public client variables.

## Netlify Forms and dashboard limits

The repository can establish form names, fields, honeypots, client behavior, and static discovery markup. It cannot establish the following without access to the deployed site and its Netlify dashboard:

- whether form detection is enabled for the site;
- whether a submission appears under the intended form in both **Verified submissions** and **Spam submissions**;
- whether all qualification, consent, and attribution fields are retained;
- whether email/webhook notifications are configured and reach the intended recipient;
- whether CSV export includes the expected column set;
- the site's current form quota, retention, notification, or abuse-control settings.

Preview acceptance testing should use an obviously labeled test lead and then verify the record in the dashboard, including spam. Delete or clearly mark test data according to the owner's retention policy. Confirm notification delivery separately. Do not use a real customer's information for testing.

`NOTIFICATION_EMAIL` was mentioned by the retired `capture-lead` function but was never implemented. Netlify Forms email notifications are configured in Netlify's UI unless a separate, reviewed notification integration is intentionally added.

## Functions and data-handling review

- `stripe-webhook` retains signature verification, but its initial implementation logged customer email, shipping details, metadata, session ID, and amount. Logging is now limited to non-identifying event type, live/test mode, and payment status. Signature errors now return and log generic messages rather than provider detail.
- The webhook currently acknowledges relevant events but does not itself establish fulfillment, customer notification, inventory decrement, or an order database. The owner needs a documented fulfillment/reconciliation process and Stripe dashboard monitoring.
- Netlify deploys supported source files in the configured `netlify/functions` directory as endpoints. `knowledge-base.js` and `nc-policy-data.js` were helper modules stored there and were exposed as broken public function routes.
- The current Next.js application did not reference `admiral-chat`, `capture-lead`, `send-otp`, or `verify-otp`; the only references found were retired static assets. Those dormant functions and their stale helper modules were removed so they cannot expose broken routes, accept PII, or create unmetered OpenAI/Twilio cost exposure.
- Restoring any chat or SMS verification service is a future reviewed feature: it requires a current product purpose, strict origin controls, request limits, validated payload bounds, safe errors, monitoring, accurate content, and an explicit privacy review.

## Environment configuration inventory

Required for the active public flow:

| Variable | Purpose | Exposure |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical metadata, sitemap/robots, allowed checkout origin, and Stripe return URLs | Public by design; must contain only the canonical origin |
| `STRIPE_SECRET_KEY` | Server-side checkout and success-session verification | Secret; server/Netlify only |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signature verification | Secret; Netlify function only |
| `STRIPE_PRICE_ID_SIDEKICK` | Optional server-side Stripe Price ID override | Server-side; optional |

No secret should use a `NEXT_PUBLIC_` prefix. `.env.example` intentionally documents the active Stripe/core variables; expand it only if the owner decides to retain a legacy integration.

## Build and dependency observations

- `.nvmrc` and Netlify specify Node 22. `.node-version` initially specified Node 18 and is now aligned to Node 22.
- Current package scripts include `lint`, `typecheck`, `build`, `audit:seo`, and `audit:product-discovery`.
- During the pre-integration audit, `npm audit` reported 22 total advisories and `npm audit --omit=dev` reported 6 production advisories, including a critical Next.js advisory.
- The integrated branch upgrades Next.js and `eslint-config-next` to `16.4.2`, the Netlify Next.js plugin to `5.16.2`, and the `minimatch` override floor to `10.2.6`. Node is consistently pinned to 22.
- `gray-matter` and its vulnerable YAML 3 dependency chain were removed. Blog metadata now uses a deliberately narrow, flat frontmatter parser that accepts only the seven fields used by the repository.
- Final `npm audit --omit=dev` reports **0 production vulnerabilities**. The full audit reports five high-severity advisories in the development-only `eslint-config-next → fast-glob → micromatch → braces` chain. npm offers only a forced downgrade to `eslint-config-next@14.2.35`, which is incompatible with the Next.js 16 stack, so no force fix was applied. Track the upstream lint dependency and keep untrusted glob patterns out of developer tooling.
- Next.js Turbopack repeatedly hit a Windows child-process panic while evaluating the Tailwind/PostCSS pipeline. The project build script now explicitly uses Next.js webpack, which completed the final production build and is also the command Netlify will run. Re-evaluate Turbopack after an upstream fix rather than accepting an environment-dependent release path.
- Historical project notes record a Windows-local Netlify post-build packaging problem. A Linux/Netlify deploy preview is the authoritative integration test for functions, forms, and the Next.js adapter.

## Initial production observations

The initial live review observed the following before these changes:

- SEO and product-discovery audit scripts passed against production.
- Canonical redirects preserved campaign query strings in sampled paths.
- `/__forms.html` returned HTTP 200.
- Helper filenames placed in `netlify/functions` were reachable as function URLs but failed as endpoints, confirming accidental exposure.
- Chat/OTP/lead legacy endpoints were deployed even though the active Next.js application did not reference them.

These observations are a baseline, not a post-change acceptance result. The local environment later lacked DNS access during a repeat probe, and no deployment was authorized.

## Final local verification — October 18, 2026

- `npm run typecheck` — pass.
- `npm run lint` — pass.
- `npm run build` — pass with Next.js 16.4.2 and the explicit webpack build path; 29 routes generated, including `/kings-mountain/home-backup`.
- `npm run audit:forms` — pass; five static Netlify form declarations have the exact expected field contracts and matching client fields.
- `npm run audit:seo -- http://127.0.0.1:3000` — pass; 17 canonical/indexable pages, schema boundaries, internal links, sitemap, robots, redirects, and private-route handling verified.
- `npm run audit:product-discovery -- http://127.0.0.1:3000` — pass; one SideKick Product entity, $69.99 offer, imagery, redirects, and retired-route behavior verified.
- `npm audit --omit=dev` — pass with zero production vulnerabilities.
- `git diff --cached --check` — pass; no unmerged paths or unstaged files remain.

No deployment, live form submission, Stripe payment, notification delivery, GTM/GA4 publication, Search Console action, or Google Business Profile change was performed. Those owner-controlled and credentialed tests remain the review checkpoint rather than being represented as locally verified.

## Owner decisions and launch risks

1. **Contact truth:** Confirm `(984) 238-4187` versus `(704) 286-6303`, and choose the monitored public and notification email addresses.
2. **Service area:** Confirm the truthful service area (including Cleveland and Gaston County communities) before publishing broad claims.
3. **Contractor/referral workflow:** Confirm how licensed professionals participate, who receives referred lead data, and the disclosure/consent language. Do not share leads without recorded opt-in.
4. **Lead operations:** Configure Netlify notification recipients, access controls, spam review, retention, export cadence, and the workflow `New → Contacted → Qualified → Partner Assessment → Won / Lost / Nurture`.
5. **Checkout operations:** Define order fulfillment, webhook monitoring, refunds, failed-payment handling, and customer support ownership.
6. **Claims and policies:** Reconfirm SideKick specifications, inventory, price, shipping, return, warranty, and Generac-related wording before production approval.
7. **Dependencies:** Review the final dependency-audit result and any documented parser exception after the upgrade/regression pass.
8. **Analytics:** Configure the successful qualified homeowner inquiry as the primary GA4 key event while ensuring no PII enters analytics.
9. **Release:** Review a deploy preview and dashboard evidence before promoting to production. No production deployment is authorized by this audit.

## Required verification after integration

Run with Node 22 from a clean install on the final conflict-free branch:

```text
npm ci
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

Then start or deploy the final build and run:

```text
npm run audit:seo -- <preview-or-local-base-url>
npm run audit:product-discovery -- <preview-or-local-base-url>
```

The audits must be extended or manually supplemented for `/kings-mountain/home-backup`, form behavior, attribution, and the `/__forms.html` noindex state. On a Netlify deploy preview, verify:

1. `/`, `/home-backup`, `/kings-mountain/home-backup`, `/sidekick`, checkout, and policy routes;
2. unique title, description, canonical, one H1, and truthful Service structured data on the local page;
3. static and visible form field-name parity;
4. one successful test submission in the correct Netlify form, with qualification, consent, and first-touch attribution fields intact;
5. notification receipt, dashboard spam review, and CSV export;
6. exactly one `generate_lead` event on success and no PII in dataLayer payloads;
7. UTM persistence across navigation and legacy redirects;
8. active function inventory contains checkout/webhook and no helper-module endpoints;
9. webhook signature rejection and successful Stripe test-mode event handling without PII in logs; and
10. no unsupported claims, private address, fabricated trust signals, or unverified contact value.

## Review checkpoint

The MVP is ready for production consideration only after the final diff is reviewed, merge conflicts are cleared, all repository checks pass, the deploy preview passes the tests above, and the owner completes the contact, Netlify, GA4/GTM, Google Business Profile, and Search Console decisions. Production deploys, paid advertising, billing changes, and live Google Business Profile edits remain owner-controlled actions.
