# Launch Checklist — New Site (Portable Autonomy Rebrand)

> Flip the "launch switch" from old static site → new Next.js site on Netlify.

---

## 1. Netlify Environment Variables

Set these in **Netlify → Site Settings → Environment Variables** before deploy.

### Deploy Preview (Test)

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_test_...` (Stripe test-mode key) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (test webhook signing secret) |
| `NEXT_PUBLIC_SITE_URL` | `https://deploy-preview-XX--admiralenergy.netlify.app` |

### Production (Live)

| Variable | Value |
|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` (Stripe live-mode key) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` (production webhook signing secret) |
| `NEXT_PUBLIC_SITE_URL` | `https://admiralenergy.ai` |

> **Optional:** `STRIPE_PRICE_ID_HS43` — set if you created a Price object in Stripe Dashboard instead of using inline `price_data`.

---

## 2. Stripe Webhook Endpoints

Register these in **Stripe Dashboard → Developers → Webhooks**.

| Environment | Endpoint URL | Events |
|-------------|-------------|--------|
| **Test** | `https://deploy-preview-XX--admiralenergy.netlify.app/.netlify/functions/stripe-webhook` | `checkout.session.completed`, `checkout.session.expired` |
| **Production** | `https://admiralenergy.ai/.netlify/functions/stripe-webhook` | `checkout.session.completed`, `checkout.session.expired` |

After adding, copy the **Signing Secret** (`whsec_...`) into the matching `STRIPE_WEBHOOK_SECRET` env var.

---

## 3. Pre-Launch Build Validation

```bash
cd admiralenergy-website
npm install
npm run build          # must exit 0
```

If `npm run lint` fails on pre-existing warnings, note them — do not block launch for lint-only issues.

---

## 4. Click-by-Click Checkout Test Script

Perform on **Deploy Preview** first, then repeat on production.

### 4.1 Visit HS-43 Product Page

1. Navigate to `/shop/hs-43-solar-power-bank`
2. Confirm: product name, price ($59.99), images, and "Buy Now" button render.

### 4.2 Buy Now → Stripe Checkout

1. Click **"Buy Now"**.
2. Confirm redirect to Stripe Checkout page.
3. Verify: product name, price, free shipping, and quantity appear correctly.

### 4.3 Complete Test Payment

1. Use Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.
2. Enter a test email and shipping address.
3. Click **Pay**.

### 4.4 Success Page

1. Confirm redirect to `/shop/success?session_id=cs_test_...`
2. Verify: "Order Confirmed!" heading, next-steps list, and navigation links appear.

### 4.5 Confirm Webhook Fires

1. Open **Netlify → Functions → stripe-webhook** log.
2. Confirm `=== ORDER COMPLETED ===` log entry with:
   - Session ID
   - Customer email
   - Amount total ($59.99)
   - Payment status: `paid`
   - Shipping address

---

## 5. Post-Launch Validation List

Run immediately after production deploy.

### 5.1 Old-Link 404 Check (all should 301-redirect)

| Old URL | Expected Redirect |
|---------|------------------|
| `/services.html` | → `/home-resilience` |
| `/services` | → `/home-resilience` |
| `/powerpair.html` | → `/blog/powerpair-solar-battery-explained` |
| `/powerpair` | → `/blog/powerpair-solar-battery-explained` |
| `/quote.html` | → `/contact` |
| `/about.html` | → `/about` |
| `/case-studies.html` | → `/case-studies` |
| `/privacy.html` | → `/policies/privacy` |
| `/terms.html` | → `/policies/terms` |
| `/index.html` | → `/` |

### 5.2 Contact Form Submission

1. Navigate to `/contact`.
2. Fill in name, email, message.
3. Submit — confirm success feedback (Netlify Forms or configured handler).

### 5.3 Blog Page Loads

1. Navigate to `/blog`.
2. Confirm at least one blog post card renders.
3. Click into a post — confirm full content loads.

### 5.4 Page Speed Sanity Check

Run [PageSpeed Insights](https://pagespeed.web.dev/) on:
- Homepage (`/`)
- HS-43 product page (`/shop/hs-43-solar-power-bank`)
- Contact page (`/contact`)

**Target:** Performance ≥ 80, no critical CLS or LCP issues.

### 5.5 Core Pages Load

| Page | Route |
|------|-------|
| Homepage | `/` |
| About | `/about` |
| Home Resilience | `/home-resilience` |
| Case Studies | `/case-studies` |
| Shop | `/shop` |
| Blog | `/blog` |
| Contact | `/contact` |
| Privacy | `/policies/privacy` |
| Terms | `/policies/terms` |

---

## 6. Rollback Procedure

If anything is critically broken post-launch, see [ROLLBACK.md](./ROLLBACK.md) for a 3-step, < 5 minute rollback.

---

## 7. DNS / Domain Notes

- Primary domain: `admiralenergy.ai` (managed via Netlify DNS or external registrar)
- Netlify auto-provisions HTTPS via Let's Encrypt — no action needed.
- If using Cloudflare proxy, ensure SSL mode is "Full (strict)".
