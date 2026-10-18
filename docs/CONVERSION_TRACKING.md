# Conversion tracking

Admiral Energy uses Google Tag Manager container `GTM-N6HRP34Z` and `window.dataLayer` as the browser measurement boundary. Netlify is the operational source of truth for form submissions, Stripe is the source of truth for paid orders, and GA4 is an analysis layer. A GA4 event is not proof that a lead or payment exists.

## Measurement rules

1. Send an event only after the action it describes has happened. In particular, `generate_lead` fires only after Netlify returns a successful response.
2. Never send form values or other personally identifiable information (PII) to GTM, GA4, advertising pixels, or analytics logs.
3. Keep event and parameter names stable. Change this document, the data-layer implementation, and GTM together.
4. Use one conversion path per outcome. Do not combine the site's success event with a second GTM form-submit event.
5. Treat browser events as measurement signals. Reconcile leads against Netlify and purchases against Stripe.

## Current event contract

### Acquisition and contact events

| Event | When it fires | Approved parameters |
|---|---|---|
| `landing_page_view` | Once per browser tab session, after first-touch attribution is available | `page_path`, classified `lead_source` |
| `home_backup_cta_click` | A tagged link to the Kings Mountain home-backup journey is clicked | `page_path`, `cta_location`, `destination_path` |
| `sidekick_referral_click` | A tagged link into the SideKick journey is clicked | `page_path`, `cta_location`, `destination_path` |
| `phone_click` | A `tel:` link is clicked | `page_path` |
| `email_click` | A `mailto:` link is clicked | `page_path` |

`lead_source` is a controlled classification such as `google_business_profile`, `facebook`, `instagram`, `organic_search`, `paid_campaign`, `social`, `campaign`, `referral`, or `direct`. It is not the raw referrer or a user-entered value.

### Lead events

| Event | Successful form or condition | Current approved parameters |
|---|---|---|
| `form_start` | First interaction with a non-hidden field in `home-backup-assessment` | `form_name`, `lead_type`, `page_path`, `form_location` |
| `form_error` | Home-backup validation or submission failure | `form_name`, `lead_type`, `error_type`, optional numeric `error_count`, `page_path`, `form_location` |
| `generate_lead` | `home-backup-assessment` succeeds | `lead_type=home_backup`, `form_name`, classified `lead_source`, `page_path`, `form_location` |
| `generate_lead` | `resilience-list` succeeds | `lead_type=resilience_list`, `form_name`, controlled component `source` |
| `generate_lead` | `bulk-order-inquiry` succeeds | `lead_type=bulk_order`, `form_name` |
| `generate_lead` | `sidekick-bulk-inquiry` succeeds | `lead_type=sidekick_bulk_inquiry`, `product_id`, enumerated `estimated_quantity` |
| `sidekick_bulk_inquiry_success` | `sidekick-bulk-inquiry` succeeds | No parameters |
| `post_purchase_interest_submitted` | `sidekick-interest` succeeds | `form_name` |

The SideKick bulk event currently identifies its form through `lead_type` and does not include `form_name`. GTM must not infer or attach any submitted field. If the implementation is later normalized to include `form_name=sidekick-bulk-inquiry`, update this table and test the new parameter before publishing.

### SideKick commerce and engagement events

| Event | When it fires | Approved parameters |
|---|---|---|
| `view_item` | SideKick product experience is viewed | GA4 `ecommerce` object containing the public catalog item |
| `sidekick_view` | Same product view, for product-journey reporting | `product_id`, `product_slug`, `price` |
| `sidekick_gallery_view` | Visitor selects another gallery asset | controlled `gallery_item` and `gallery_source` |
| `sidekick_buy_click` | A SideKick purchase CTA is pressed | `cta_location`, `product_id`, `price`, `quantity` |
| `begin_checkout` | Stripe returns a valid checkout destination | `cta_location` and GA4 `ecommerce` object |
| `sidekick_checkout_start` | Same successful checkout-session creation | `cta_location`, `product_id`, `price`, `quantity` |
| `purchase` | Stripe success state is rendered with a verified session identifier | GA4 `ecommerce.transaction_id`, `currency`, `value`, and public item data |

The signed Stripe `checkout.session.completed` webhook remains the authoritative purchase record. The browser `purchase` event must use the Stripe session identifier as `transaction_id` and must be emitted by only one active success component. Verify repeat loads do not create duplicate GA4 revenue.

## PII-safe parameter policy

Allowed analytics values are limited to controlled operational context:

- event, form, lead-type, CTA-location, product, and error-category identifiers;
- URL paths without query strings;
- classified lead source, never the raw referrer or raw campaign record;
- enumerated quantity/timeline categories when they cannot contain free text;
- public catalog data and a commerce transaction identifier needed for deduplication; and
- numeric counts, prices, quantities, and values.

Never place any of the following in `dataLayer`, a GA4 parameter, an advertising pixel, a public URL, or a console log:

- name, email address, phone number, postal code, street address, or company contact details;
- notes, messages, timelines entered as free text, form field values, or validation text that repeats a value;
- marketing choice, contact-consent text, partner-referral choice, or other consent record;
- full referrer, full landing URL, raw query string, or uncontrolled raw UTM value; or
- payment-card, shipping, authentication, or other sensitive data.

The analytics helper removes common top-level PII keys as a defense in depth. That filter is not permission to pass arbitrary objects: nested objects must contain only the approved commerce fields above, and GTM variables must use an explicit allowlist.

Campaign parameters are public URL data. Use short controlled codes and never put a person's name, email, phone number, account number, or other personal data in a UTM value.

## First-touch attribution

The browser stores one first-touch record in first-party `localStorage` under `admiral_first_touch_v1` for up to 90 days. When storage is unavailable, the current-page record is used without persistence.

The private record contains:

- `utm_source`, `utm_medium`, `utm_campaign`, and `utm_content`;
- the original landing path without its query string;
- a sanitized initial referrer containing origin and path but no query string;
- the controlled `lead_source` classification; and
- the capture timestamp.

The `home-backup-assessment` submission includes this record as hidden Netlify fields along with the submission path and client timestamp. These fields support private lead-source reconciliation; they are not GA4 event parameters. The browser only sends the classified `lead_source`, `page_path`, and other approved context through the data layer.

## GTM implementation

Use native GTM tag templates and the data layer rather than Custom HTML analytics code. Google's data-layer guidance is at [The data layer](https://developers.google.com/tag-platform/tag-manager/datalayer).

### Variables

Create Data Layer Variables only for the approved fields that are actually used:

- `lead_type`, `form_name`, `lead_source`, `source`;
- `page_path`, `form_location`, `cta_location`, `destination_path`;
- `error_type`, `error_count`;
- `product_id`, `product_slug`, `price`, `quantity`, `estimated_quantity`;
- `gallery_item`, `gallery_source`; and
- `ecommerce`.

Do not create variables for `name`, `email`, `phone`, `zip_code`, `notes`, consent fields, raw UTM fields, `initial_referrer`, or other submitted data.

### Triggers and tags

1. Keep the Google tag/GA4 configuration tag on all pages.
2. Create Custom Event triggers for the exact event names in the tables above. A tightly scoped regular expression trigger is acceptable if its values are reviewed as an allowlist.
3. Send the same event name to GA4 and map only the approved parameters for that event.
4. For `view_item`, `begin_checkout`, and `purchase`, enable the tag's data-layer ecommerce input rather than rebuilding the object from DOM text.
5. Do not create a separate GTM Form Submission trigger for these AJAX forms. It can fire before Netlify acceptance and can duplicate `generate_lead`.
6. Do not scrape link text, form values, or the DOM for analytics parameters.
7. Publish a named GTM version with a short note describing the event contract and test date.

## GA4 home-backup key event

`generate_lead` represents several different outcomes and must not be the primary key event for the local home-backup funnel. Create one GA4 derived/custom event:

- New event name: `home_backup_lead`
- Matching condition: `event_name` equals `generate_lead`
- Matching condition: `lead_type` equals `home_backup`
- Matching condition: `form_name` equals `home-backup-assessment`
- Copy parameters from the source event: enabled

Mark `home_backup_lead` as the primary GA4 key event. Leave generic `generate_lead` available for diagnostic and channel reporting, but do not mark it as the primary local-growth conversion. This prevents newsletter and bulk inquiries from inflating the home-backup result.

Create the derived event in GA4 or emit it in GTM, not both. The recommended implementation is GA4's event-creation feature so the site maintains one success event. See Google's [Create or modify events](https://support.google.com/analytics/answer/10085872) and [Mark events as key events](https://support.google.com/analytics/answer/13128484).

Register `lead_type`, `form_name`, `lead_source`, `form_location`, and `cta_location` as event-scoped custom dimensions only if the property needs those reporting breakdowns. Do not register PII or raw form fields.

## Tracked campaign URLs

Use these exact owner-managed URLs:

- Google Business Profile website: `https://admiralenergy.ai/?utm_source=google&utm_medium=organic&utm_campaign=gbp_profile`
- Google Business Profile post: `https://admiralenergy.ai/kings-mountain/home-backup?utm_source=google&utm_medium=organic&utm_campaign=gbp_post`
- Kings Mountain Facebook campaign: `https://admiralenergy.ai/kings-mountain/home-backup?utm_source=facebook&utm_medium=social&utm_campaign=kings_mountain_resilience`

If another platform is added, use the same lowercase naming convention and document it before publishing. Test every redirect with its query string intact; a redirect that drops UTM parameters breaks first-touch attribution.

## Release test

Use GTM Preview/Tag Assistant and GA4 DebugView on the production deployment or a deploy preview connected to a test GA property.

1. Start with clean site storage and open each tracked URL. Confirm the first-touch record has the expected controlled values and no query string in `landing_page`.
2. Navigate between pages. Confirm the original first touch persists and `landing_page_view` fires once per tab session.
3. Click each tagged home-backup CTA, `tel:` link, `mailto:` link, and SideKick referral. Confirm one expected event and no form or contact values.
4. Focus the home-backup form. Confirm one `form_start`.
5. Submit invalid data. Confirm `form_error` and no `generate_lead`.
6. Simulate or observe a failed Netlify response. Confirm `form_error` and no `generate_lead`.
7. Complete one marked test submission. Confirm exactly one `generate_lead` after the successful response, then confirm the same record in Netlify.
8. Confirm GA4 creates one `home_backup_lead` from that event and that unrelated `generate_lead` events do not create it.
9. Start a SideKick checkout. Confirm `begin_checkout` only after Stripe returns a destination. Complete a test-mode purchase and confirm one `purchase` with the correct transaction ID and value.
10. Inspect every data-layer message and GA4 event parameter for PII before publishing.

Analytics blockers, consent choices, network failure, and spam filtering can produce differences between GA4 and Netlify. Use Netlify's verified submission record for lead counts and Stripe's completed session/webhook for revenue reconciliation.

## Owner-only launch actions

- Publish the reviewed GTM container version and create `home_backup_lead` in the correct GA4 property.
- Mark only the intended key events and confirm the property's timezone/currency.
- Update Google Business Profile and Facebook with the tracked URLs above.
- Complete the release test and retain a dated screenshot or note of the GTM Preview, GA4 DebugView, Netlify record, and Stripe test result.
