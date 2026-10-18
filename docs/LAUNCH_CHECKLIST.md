# Kings Mountain Growth MVP — Review and Launch Checklist

No production deployment, paid advertising, billing change, or live Google Business Profile edit is authorized until David reviews the final diff and a deploy preview passes this checklist.

## 1. Owner decisions before preview

- [ ] Confirm the canonical public phone: current website `(984) 238-4187` versus Facebook `(704) 286-6303`.
- [ ] Confirm the public support email and the private Netlify notification mailbox.
- [ ] Confirm the truthful service area before expanding beyond Kings Mountain.
- [ ] Confirm the licensed-professional referral process and approve the separate referral-consent wording.
- [ ] Reconfirm SideKick price, inventory, shipping, returns, warranty, and any product specifications shown publicly.
- [ ] Confirm Google Business Profile eligibility based on real in-person customer contact. Do not create or edit a profile that is only a lead-generation or online business.

## 2. Environment variables

Set secrets in Netlify, never in source or a `NEXT_PUBLIC_*` variable.

| Variable | Preview | Production |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Exact deploy-preview origin | `https://admiralenergy.ai` |
| `STRIPE_SECRET_KEY` | Stripe test-mode secret | Stripe live-mode secret |
| `STRIPE_WEBHOOK_SECRET` | Preview/test endpoint signing secret | Production endpoint signing secret |
| `STRIPE_PRICE_ID_SIDEKICK` | Optional matching test Price | Optional matching live Price |

Use a preview-specific `NEXT_PUBLIC_SITE_URL`; otherwise checkout success/cancel URLs may cross environments.

## 3. Local quality gate

Use Node 22 and a clean dependency install:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

Start the production build locally, then run:

```bash
npm run start
npm run audit:seo -- http://localhost:3000
npm run audit:product-discovery -- http://localhost:3000
```

Review `git diff --check`, confirm no conflict markers remain, and inspect the complete branch diff before creating a pull request.

## 4. Deploy-preview route and content checks

- [ ] `/` returns 200 and the first viewport says veteran-owned and based in Kings Mountain, NC.
- [ ] `/kings-mountain/home-backup` returns 200 with a unique title, description, self-canonical, one H1, Service schema, and no unsupported installation claim.
- [ ] `/home-backup` returns 200 and remains the broader planning/assessment page.
- [ ] `/sidekick` returns 200 with the $69.99 offer, Product schema, real images, and working purchase CTA.
- [ ] `/resources`, `/about`, blog pages, and all policy routes remain usable.
- [ ] `/__forms.html` is reachable for Netlify detection but returns `X-Robots-Tag: noindex, nofollow`.
- [ ] Sitemap includes the local page; robots does not block indexable pages.
- [ ] Legacy redirects preserve UTM query parameters.
- [ ] No private address, fabricated review, unsupported dealer/installer claim, or unverified local statistic is present.
- [ ] Header, footer, tap targets, form controls, keyboard focus, and status messages work on mobile and desktop.

## 5. Netlify Forms acceptance test

Follow `docs/LOCAL_LEAD_MANAGEMENT.md`. An HTTP 200 is not proof of capture.

- [ ] Enable form detection and confirm all five form names are active.
- [ ] Configure form-specific owner email notifications in Netlify.
- [ ] Submit a uniquely marked owner-controlled test to `home-backup-assessment` from the tracked GBP URL.
- [ ] Check both Verified and Spam submissions.
- [ ] Confirm required, qualification, consent, attribution, form-location, and timestamp fields are present.
- [ ] Confirm the notification arrives only at the approved mailbox.
- [ ] Export CSV and verify the field structure.
- [ ] Delete or clearly retire test data under the approved retention procedure.

## 6. GTM and GA4 acceptance test

Use GTM Preview/Tag Assistant and GA4 DebugView. Follow `docs/CONVERSION_TRACKING.md`.

- [ ] First-touch UTM data persists after navigation and reaches the private Netlify record.
- [ ] `landing_page_view` fires once per tab session.
- [ ] Home-backup CTA, SideKick referral, phone, and email clicks fire once per click.
- [ ] Home-backup `form_start` fires on first field interaction.
- [ ] Validation/transport failures emit `form_error`, never `generate_lead`.
- [ ] A successful Netlify response emits exactly one `generate_lead` with `lead_type=home_backup`.
- [ ] No name, email, phone, ZIP, note, consent value, raw referrer, or raw form field appears in `dataLayer` or GA4.
- [ ] Create `home_backup_lead` from the documented `generate_lead` conditions and mark that derived event as the primary GA4 key event.

## 7. Stripe regression test

- [ ] Register preview and production webhook endpoints for `checkout.session.completed` and `checkout.session.expired`.
- [ ] Complete one Stripe test-mode SideKick checkout from the preview.
- [ ] Confirm the success page rejects an absent/invalid session and confirms only a Stripe-verified paid session.
- [ ] Confirm one `purchase` event per transaction after repeat-load testing.
- [ ] Confirm webhook signature rejection and successful test-event handling.
- [ ] Confirm function logs contain no customer email, phone, shipping address, or form content.
- [ ] Confirm the documented order fulfillment, refund, failed-payment, and support owner workflow.

## 8. Owner-managed growth channels

- [ ] Apply the exact tracked website/post URLs in `docs/GOOGLE_BUSINESS_GROWTH_PLAYBOOK.md` only after eligibility review.
- [ ] Select GBP categories from Google's live picker based only on current eligible activities.
- [ ] Hide a private residential address; do not imply a storefront.
- [ ] Add authentic business/product images supplied by David.
- [ ] Use the eight editable post drafts in `docs/KINGS_MOUNTAIN_CONTENT_PLAN.md`; do not invent events, storms, projects, or testimonials.
- [ ] Request genuine reviews without incentives or review gating.
- [ ] Update Facebook with the documented tracked local URL.

## 9. Search Console and release

- [ ] Inspect `/`, `/kings-mountain/home-backup`, `/home-backup`, and `/sidekick` in the URL Inspection tool after production release.
- [ ] Submit `https://admiralenergy.ai/sitemap.xml` and monitor indexing/canonical reports.
- [ ] Record the release commit, Netlify deploy ID, test evidence, owner approvals, and rollback point.
- [ ] Promote the reviewed preview to production only after all blocking checks pass.
- [ ] If a critical regression appears, use `docs/ROLLBACK.md` and preserve evidence for follow-up.

## 10. First-week operating checks

- [ ] Check Netlify Verified and Spam submissions each business day.
- [ ] Move every valid lead through `New → Contacted → Qualified → Partner Assessment → Won / Lost / Nurture`.
- [ ] Reconcile Netlify leads against GA4 without treating analytics as the lead source of truth.
- [ ] Check Stripe webhook health and unfulfilled paid sessions.
- [ ] Review Search Console indexing and GBP website/call/form results using the weekly reporting template.
