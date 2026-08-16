# Conversion tracking

Admiral Energy continues to use Google Tag Manager container `GTM-N6HRP34Z` and `window.dataLayer`.

## Commerce events

| Event | Trigger | Key data |
|---|---|---|
| `view_item` | SideKick page view | `ecommerce.currency`, `ecommerce.value`, SideKick item |
| `select_item` | SideKick buy button click | CTA location and SideKick item |
| `sidekick_buy_click` | SideKick buy button click | `cta_location`, product ID, price |
| `begin_checkout` | Stripe checkout session created | currency, value, SideKick item |
| `purchase` | Stripe success page with session ID | Stripe session ID as `transaction_id`, SideKick item |

Stripe's signed `checkout.session.completed` webhook remains the authoritative server-side purchase signal. The browser `purchase` event is deduplicated per session ID with `sessionStorage`.

## Lead events

All successful forms push `generate_lead` with a distinct `lead_type` and `form_name`:

- `resilience_list` / `resilience-list`
- `home_backup` / `home-backup-assessment`
- `bulk_order` / `bulk-order-inquiry`

The post-purchase reason form pushes `post_purchase_interest_submitted`.

## Contact events

The existing analytics helper tracks all `tel:` links as `phone_click` and all `mailto:` links as `email_click`. It also retains UTM, referrer, outbound-link, scroll-depth, and session tracking.

## GTM checklist

1. Confirm the GA4 event tag forwards the event names above.
2. Mark `purchase` and `generate_lead` as key events.
3. Create breakdowns by `lead_type` and `form_name`.
4. Verify events in GTM Preview and GA4 DebugView after deployment.
