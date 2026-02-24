# Admiral Energy Website — Codex Context Document

> **Purpose:** Comprehensive reference for AI coding agents (GitHub Copilot Codex, Claude, etc.) to understand the full project architecture, patterns, conventions, and intent before making changes.
>
> **Repo:** `git@github.com:AdmiralEnergy/admiralenergy-website.git`
> **Local:** `C:\Users\Edwar\Coding\admiralenergy-website`
> **Deployed:** [https://admiralenergy.ai](https://admiralenergy.ai) (Netlify)
> **Last Updated:** February 24, 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Brand & Design System](#4-brand--design-system)
5. [Routing & Pages](#5-routing--pages)
6. [Components](#6-components)
7. [Data Layer](#7-data-layer)
8. [Blog / Content System](#8-blog--content-system)
9. [E-Commerce & Stripe Checkout](#9-e-commerce--stripe-checkout)
10. [Netlify Functions](#10-netlify-functions)
11. [SEO & Structured Data](#11-seo--structured-data)
12. [Environment Variables](#12-environment-variables)
13. [Netlify Configuration & Redirects](#13-netlify-configuration--redirects)
14. [Coding Conventions](#14-coding-conventions)
15. [What NOT to Change](#15-what-not-to-change)
16. [Known Patterns & Gotchas](#16-known-patterns--gotchas)
17. [Feature Roadmap / TODO](#17-feature-roadmap--todo)
18. [Security Audit Status](#18-security-audit-status)

---

## 1. Project Overview

**Admiral Energy** is a North Carolina-focused energy resilience brand. The website serves three audiences:

1. **Portable power buyers** — homeowners who want to purchase solar power banks and emergency kits *right now* (Shop)
2. **Resilience planners** — homeowners researching battery backup, hurricane prep, and NC-specific incentives
3. **Whole-home solar leads** — homeowners who need a full solar+battery install, referred to vetted REACH network partners

### Business Model
- **Direct e-commerce:** Portable products sold via Stripe Checkout (hosted by Netlify + Stripe)
- **Affiliate/referral:** Partner pages (EcoFlow, etc.) with potential affiliate links
- **Lead generation:** Contact form → advisory consultation → REACH partner installer referral

### Brand Voice
- **"No pitch. Just math."** — Honest, NC-local, trust-first
- Never pushy. Acknowledge when solar doesn't pencil out.
- Emphasize real backup math (wattage, runtime hours)
- NC-specific: Duke Energy PowerPair, Hurricane Helene, Piedmont Triad geography

### History
- Site was originally a static HTML/CSS site (archived in `_archive-static/`)
- Rebuilt February 2026 as a **Next.js 16 + Tailwind CSS v4 + TypeScript** app
- Deployed on **Netlify** using `@netlify/plugin-nextjs`

---

## 2. Tech Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| UI Library | React | 19.2.3 |
| Styling | Tailwind CSS v4 | ^4 |
| Language | TypeScript | ^5 |
| Blog Content | MDX via `next-mdx-remote` | ^6.0.0 |
| Blog Frontmatter | `gray-matter` | ^4.0.3 |
| Reading Time | `reading-time` | ^1.5.0 |
| Icons | `lucide-react` | ^0.575.0 |
| Fonts | Geist Sans + Geist Mono (Google) | via `next/font` |
| Payments | Stripe | ^20.3.1 |
| Serverless | Netlify Functions | ^5.1.2 |
| Deployment | Netlify + `@netlify/plugin-nextjs` | ^5.15.8 |
| Node Version | 22 (set in `.nvmrc` and `netlify.toml`) | 22 |
| Images | Next.js `<Image>` | — |

### Key Notes
- Uses **Next.js App Router** (not Pages Router). All routes are in `src/app/`.
- Tailwind v4 uses `@import "tailwindcss"` — **not** `@tailwind base/components/utilities`. Do not use the old syntax.
- Tailwind config is done via `@theme inline { }` blocks inside `globals.css`, not a `tailwind.config.ts` file.
- TypeScript strict mode — all components must be typed properly.

---

## 3. Directory Structure

```
admiralenergy-website/
├── src/
│   ├── app/                        # Next.js App Router — all pages live here
│   │   ├── layout.tsx              # Root layout (Header, Footer, GTM, JSON-LD)
│   │   ├── page.tsx                # Homepage (/)
│   │   ├── globals.css             # Tailwind + CSS custom properties (brand colors)
│   │   ├── favicon.ico
│   │   ├── robots.ts               # /robots.txt generation
│   │   ├── sitemap.ts              # /sitemap.xml generation
│   │   ├── about/page.tsx
│   │   ├── blog/
│   │   │   ├── page.tsx            # Blog listing
│   │   │   └── [slug]/page.tsx     # Individual blog post
│   │   ├── case-studies/page.tsx
│   │   ├── contact/
│   │   │   ├── layout.tsx          # Contact-specific layout (Netlify form hidden)
│   │   │   └── page.tsx
│   │   ├── home-resilience/page.tsx
│   │   ├── portable-power/page.tsx
│   │   ├── partners/
│   │   │   └── ecoflow/
│   │   │       └── delta-pro-ultra/page.tsx
│   │   ├── policies/
│   │   │   ├── affiliate-disclosure/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── returns/page.tsx
│   │   │   ├── shipping/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── warranty/page.tsx
│   │   └── shop/
│   │       ├── page.tsx            # Product listing
│   │       ├── [slug]/page.tsx     # Individual product page
│   │       └── success/page.tsx    # Post-checkout success page
│   ├── components/
│   │   ├── Header.tsx              # Sticky nav, mobile hamburger
│   │   ├── Footer.tsx              # Links, policies, contact info
│   │   └── BuyNowButton.tsx        # Stripe checkout trigger (client component)
│   ├── content/
│   │   └── blog/                   # MDX blog posts (frontmatter + content)
│   │       ├── nc-storm-prep-checklist.mdx
│   │       └── powerpair-solar-battery-explained.mdx
│   ├── data/
│   │   └── products.ts             # SSOT for all product data + Stripe prices
│   └── lib/
│       ├── blog.ts                 # getAllPosts() / getPostBySlug() utilities
│       └── site.ts                 # SITE_URL constant (reads NEXT_PUBLIC_SITE_URL)
├── netlify/
│   └── functions/
│       ├── create-checkout-session.ts  # Stripe checkout session creator
│       └── stripe-webhook.ts           # Stripe webhook handler
├── public/
│   ├── images/products/            # Product SVGs (solar-power-bank.svg, etc.)
│   ├── logos/                      # Brand logos, favicons, webmanifest
│   ├── icons/
│   ├── scripts/
│   └── __forms.html                # Hidden Netlify Forms registration page
├── docs/
│   ├── LAUNCH_CHECKLIST.md
│   └── ROLLBACK.md
├── _archive-static/                # OLD static HTML site — do not modify or deploy
├── netlify.toml                    # Build config + redirects
├── next.config.ts                  # Remote image patterns
├── tsconfig.json
├── postcss.config.mjs
├── eslint.config.mjs
├── .env.example                    # Required env vars reference
└── REBRAND_IMPLEMENTATION_GUIDE.md # Rebrand decisions and rationale
```

---

## 4. Brand & Design System

### Color Palette (defined in `src/app/globals.css`)

| Token | Hex | Usage |
|-------|-----|-------|
| `admiral-navy` | `#0c2f4a` | Primary backgrounds, headings, nav |
| `admiral-gold` | `#c9a648` | CTAs, accents, highlights |
| `admiral-white` | `#f7f5f2` | Page background (warm off-white) |
| `navy-light` | `#1a4a6e` | Hover states on navy |
| `gold-light` | `#d4b85c` | Hover states on gold |

### Tailwind Usage
```css
/* Available utility classes */
bg-admiral-navy      text-admiral-navy
bg-admiral-gold      text-admiral-gold
bg-admiral-white     text-admiral-white
bg-navy-light        text-navy-light
bg-gold-light        text-gold-light
```

### Typography
- **Body font:** Geist Sans (variable: `--font-geist-sans`)
- **Mono font:** Geist Mono (variable: `--font-geist-mono`)
- Both loaded via `next/font/google` in `layout.tsx`

### Prose Styles
`.prose` class is defined in `globals.css` for MDX/blog content rendering. Provides styled `h2`, `h3`, `p`, `ul`, `ol`, `a`, and `blockquote`. Blockquotes use a `admiral-gold` left border.

### Design Patterns
- Hero sections: `bg-gradient-to-br from-admiral-navy to-[#0a2540] text-white`
- Cards: `bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow`
- Primary CTA button: `bg-admiral-gold text-admiral-navy px-8 py-4 rounded-lg font-semibold hover:bg-gold-light`
- Secondary CTA button: `border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-admiral-navy`
- Max content width: `max-w-6xl mx-auto px-4 sm:px-6 lg:px-8`
- Section padding: `py-16` standard, `py-20 md:py-28` for hero

---

## 5. Routing & Pages

All routes use **Next.js App Router** (`src/app/`). Every `page.tsx` exports both a default component and optional `metadata`.

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Homepage — hero, 3 paths, featured product, FAQ, CTA |
| `/shop` | `app/shop/page.tsx` | Product grid from `products.ts` |
| `/shop/[slug]` | `app/shop/[slug]/page.tsx` | Individual product detail + `BuyNowButton` |
| `/shop/success` | `app/shop/success/page.tsx` | Post-checkout confirmation |
| `/portable-power` | `app/portable-power/page.tsx` | Portable power education page |
| `/home-resilience` | `app/home-resilience/page.tsx` | Home resilience planning guide |
| `/blog` | `app/blog/page.tsx` | Blog listing (reads from `src/content/blog/*.mdx`) |
| `/blog/[slug]` | `app/blog/[slug]/page.tsx` | MDX blog post rendered with `next-mdx-remote` |
| `/about` | `app/about/page.tsx` | About Admiral Energy / David Edwards |
| `/case-studies` | `app/case-studies/page.tsx` | Customer stories |
| `/contact` | `app/contact/page.tsx` | Contact form (Netlify Forms) |
| `/partners/ecoflow/delta-pro-ultra` | `app/partners/ecoflow/delta-pro-ultra/page.tsx` | EcoFlow partner/affiliate page |
| `/policies/privacy` | — | Privacy policy |
| `/policies/terms` | — | Terms of service |
| `/policies/returns` | — | Return policy |
| `/policies/shipping` | — | Shipping policy |
| `/policies/warranty` | — | Warranty policy |
| `/policies/affiliate-disclosure` | — | Affiliate disclosure |

### Redirects (from old static site)
All handled in `netlify.toml` with HTTP 301:
- `/services.html` → `/home-resilience`
- `/powerpair.html` → `/blog/powerpair-solar-battery-explained`
- `/quote.html` → `/contact`
- `/about.html` → `/about`
- `/case-studies.html` → `/case-studies`
- `/privacy.html` → `/policies/privacy`
- `/terms.html` → `/policies/terms`
- `/index.html` → `/`

---

## 6. Components

### `Header.tsx` — `src/components/Header.tsx`
- `'use client'` component (uses `useState` for mobile menu)
- Sticky nav (`sticky top-0 z-50`)
- Logo: `/logos/ae-logo-horiz-bg.png` rendered with `next/image`
- Nav links: Home, Shop, Portable Power, Home Resilience, Blog, About
- Contact CTA button (gold) always visible
- Mobile: hamburger toggle with slide-down menu
- Responsive breakpoint: `lg:` for desktop nav

### `Footer.tsx` — `src/components/Footer.tsx`
- Server component (no interactivity)
- Brand info, contact details, policy links
- Phone: `+1-984-238-4187` | Email: `info@admiralenergy.ai`
- Location: Kings Mountain, NC

### `BuyNowButton.tsx` — `src/components/BuyNowButton.tsx`
- `'use client'` component
- Props: `productId`, `productName`, `price`, `inStock`, `maxQty` (default: 5)
- Renders quantity selector (+ / − buttons, min 1, max `maxQty`)
- On click: `POST /.netlify/functions/create-checkout-session` with `{ productId, quantity }`
- Redirects to Stripe Checkout URL on success
- Shows inline error message on failure
- Shows `<Loader2>` spinner during checkout creation
- Only rendered for products with `stripeEnabled: true`

---

## 7. Data Layer

### `src/data/products.ts` — SINGLE SOURCE OF TRUTH for all products

**`Product` interface:**
```typescript
interface Product {
  id: string;             // unique ID, matches Netlify function PRODUCT_PRICES key
  name: string;
  slug: string;           // URL slug for /shop/[slug]
  price: number;          // display price in dollars
  priceCents: number;     // price in cents (must match Netlify function)
  description: string;    // long description (product page)
  shortDescription: string; // short description (shop grid)
  features: string[];
  specs: Record<string, string>;
  images: string[];       // paths relative to /public
  category: string;
  inStock: boolean;
  badge?: string;         // e.g. "Flagship" — shown on shop grid card
  model?: string;
  sku?: string;
  stripeEnabled?: boolean; // if true, BuyNowButton is rendered
}
```

**Current Products (3):**

| ID | Name | Slug | Price | Stripe |
|----|------|------|-------|--------|
| `hs-43-solar-power-bank` | Multifunctional Solar Power Bank | `hs-43-solar-power-bank` | $59.99 | ✅ |
| `solar-panel-100w` | 100W Portable Solar Panel | `100w-solar-panel` | $199.99 | ❌ |
| `emergency-kit-001` | Storm Ready Emergency Kit | `storm-ready-kit` | $79.99 | ❌ |

**⚠️ IMPORTANT:** When adding a new product with `stripeEnabled: true`, you **must** also add its entry to `PRODUCT_PRICES` in `netlify/functions/create-checkout-session.ts`. The `priceCents` values must match exactly.

**Helper functions:**
```typescript
getProductBySlug(slug: string): Product | undefined
getProductById(id: string): Product | undefined
```

---

## 8. Blog / Content System

### Adding a Blog Post
1. Create a new `.mdx` file in `src/content/blog/`
2. File name becomes the slug (e.g., `my-post.mdx` → `/blog/my-post`)
3. Required frontmatter:

```yaml
---
title: "Post Title Here"
date: "2026-02-24"          # ISO date string, used for sorting
excerpt: "One sentence description shown in blog listing."
author: "David Edwards"      # or "Admiral Energy Team"
category: "Preparedness"     # e.g., Preparedness, Education, Products, NC Grid
---
```

4. Content is standard MDX (Markdown + optional JSX). Uses `.prose` CSS class for styling.
5. Posts are automatically sorted newest-first by `date` field.

### Blog Infrastructure (`src/lib/blog.ts`)
- `getAllPosts()` — reads all `.mdx` from `src/content/blog/`, parses frontmatter with `gray-matter`, calculates reading time with `reading-time`
- `getPostBySlug(slug)` — returns single post
- Blog posts are rendered server-side with `next-mdx-remote/rsc`

### Existing Posts

| Slug | Title | Author | Category |
|------|-------|--------|----------|
| `nc-storm-prep-checklist` | NC Storm Prep Checklist: What to Do Before Hurricane Season | Admiral Energy Team | Preparedness |
| `powerpair-solar-battery-explained` | PowerPair: Solar + Battery Explained | David Edwards | Education |

---

## 9. E-Commerce & Stripe Checkout

### Flow
```
User clicks "Buy Now" on /shop/[slug]
    ↓
BuyNowButton.tsx (client)
POST /.netlify/functions/create-checkout-session
    { productId: "hs-43-solar-power-bank", quantity: 1 }
    ↓
create-checkout-session.ts (Netlify Function)
    → Validates productId against PRODUCT_PRICES
    → Creates Stripe Checkout Session
    → Returns { url: "https://checkout.stripe.com/..." }
    ↓
window.location.href = url   (redirect to hosted Stripe checkout)
    ↓
User completes payment on Stripe
    ↓
Stripe redirects to /shop/success?session_id={CHECKOUT_SESSION_ID}
```

### Stripe Configuration
- **Checkout mode:** `payment` (one-time, not subscription)
- **Success URL:** `${SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`
- **Cancel URL:** `${SITE_URL}/shop/${slug}`
- **Quantity limit:** 1–5 per checkout (enforced server-side)
- **Price source:** Either inline `price_data` OR a `STRIPE_PRICE_ID_HS43` env var (optional)

### Adding Stripe to a New Product
1. Add the product to `src/data/products.ts` with `stripeEnabled: true`
2. Add to `PRODUCT_PRICES` in `netlify/functions/create-checkout-session.ts`:
```typescript
"your-product-id": {
  name: "Product Display Name",
  priceCents: 9999,  // MUST match priceCents in products.ts
  description: "Short description shown in Stripe checkout",
},
```
3. Optionally create a `STRIPE_PRICE_ID_YOUR_PRODUCT` env var if using Stripe Price IDs instead of inline pricing

---

## 10. Netlify Functions

Located in `netlify/functions/`. TypeScript files compiled by Netlify at deploy time.

### `create-checkout-session.ts`
- **Endpoint:** `POST /.netlify/functions/create-checkout-session`
- **Auth:** None (public endpoint — product prices are validated server-side)
- **Body:** `{ productId?: string, quantity?: number }`
- **Returns:** `{ url: string }` (Stripe checkout URL) or `{ error: string }`
- **Validates:** productId exists in `PRODUCT_PRICES`, quantity between 1–5
- **Requires:** `STRIPE_SECRET_KEY` env var

### `stripe-webhook.ts`
- **Endpoint:** `POST /.netlify/functions/stripe-webhook`
- **Purpose:** Handle Stripe events (e.g., `checkout.session.completed`)
- **Auth:** Stripe webhook signature (`STRIPE_WEBHOOK_SECRET` env var)
- **Current handling:** `checkout.session.completed` → logs order details

---

## 11. SEO & Structured Data

### Metadata
- Defined per-page using Next.js `export const metadata: Metadata`
- Root layout in `layout.tsx` sets default `title`, `description`, `openGraph`, `twitter`, and `icons`
- Title template: `"%s | Admiral Energy"` (each page just sets the `title` field)

### JSON-LD Structured Data
Injected via `<script type="application/ld+json">` in `layout.tsx`:
1. **Organization** — name, url, logo, address (Kings Mountain, NC), contact
2. **ItemList** — all products in the shop with position + URL

Homepage (`page.tsx`) additionally injects:
3. **LocalBusiness** — address, areaServed (North Carolina)

Blog posts inject:
4. **Article** — title, author, datePublished, description

### Sitemap & Robots
- `src/app/sitemap.ts` — generates `/sitemap.xml` (static routes + all product slugs + blog slugs)
- `src/app/robots.ts` — generates `/robots.txt` (allow all, sitemap URL)

### Analytics
- **Google Tag Manager:** `GTM-N6HRP34Z` — injected in `<head>` via `next/script` with `strategy="afterInteractive"`
- GTM noscript fallback in `<body>`

---

## 12. Environment Variables

### Required for Production

| Variable | Description | Where Used |
|----------|-------------|-----------|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (`https://admiralenergy.ai`) | `src/lib/site.ts`, Netlify functions |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_live_...` or `sk_test_...`) | `create-checkout-session.ts` |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (`whsec_...`) | `stripe-webhook.ts` |

### Optional

| Variable | Description |
|----------|-------------|
| `STRIPE_PRICE_ID_HS43` | Stripe Price ID for HS-43 product (if using pre-created prices) |

### Notes
- `NEXT_PUBLIC_*` variables are exposed to the browser bundle
- Non-`NEXT_PUBLIC_*` variables are server-side only (Netlify Functions)
- `.env` is gitignored — use `.env.example` as reference
- Set in Netlify UI: **Site Settings → Environment Variables**

---

## 13. Netlify Configuration & Redirects

`netlify.toml` key settings:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"

[functions]
  directory = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### All Active Redirects (301 permanent)

| From | To |
|------|----|
| `/services.html`, `/services` | `/home-resilience` |
| `/powerpair.html`, `/powerpair` | `/blog/powerpair-solar-battery-explained` |
| `/quote.html`, `/quote` | `/contact` |
| `/about.html` | `/about` |
| `/case-studies.html` | `/case-studies` |
| `/privacy.html`, `/privacy` | `/policies/privacy` |
| `/terms.html`, `/terms` | `/policies/terms` |
| `/index.html` | `/` |

### Netlify Forms
- Contact form uses Netlify Forms (HTML form with `data-netlify="true"`)
- A hidden form registration page is at `public/__forms.html`
- The contact `layout.tsx` includes the hidden form for Netlify detection

---

## 14. Coding Conventions

### File & Export Patterns
- Page components: **default export**, named after the page (e.g., `export default function ShopPage()`)
- Server components by default — add `'use client'` only when needed (state, events, browser APIs)
- `BuyNowButton` and `Header` are `'use client'` — everything else is server components

### TypeScript
- All props must be typed with interfaces or inline types
- Use `satisfies` for object type assertions (see `blog.ts`)
- Prefer `type` for unions, `interface` for object shapes

### Tailwind
- Use design tokens (`admiral-navy`, `admiral-gold`) instead of raw hex values
- Responsive: mobile-first (`md:`, `lg:` breakpoints)
- No inline `style={}` for colors or spacing — use Tailwind classes

### Imports
- Use `@/` path alias for `src/` (configured in `tsconfig.json`)
  - `@/components/Header` → `src/components/Header.tsx`
  - `@/data/products` → `src/data/products.ts`
  - `@/lib/blog` → `src/lib/blog.ts`
  - `@/lib/site` → `src/lib/site.ts`

### Image Handling
- Always use `next/image` (`<Image>`) for images in `public/`
- External images must be allowlisted in `next.config.ts` under `remotePatterns`
- Currently allowlisted: `www.ecoflow.com`
- SVG product images are in `public/images/products/`

### Metadata
- Every page file should export `metadata` with at minimum `title` and `description`
- Use the template: `title` is just the page name (layout appends `| Admiral Energy`)

---

## 15. What NOT to Change

- **`_archive-static/`** — Old static site files. Do not touch. Do not deploy these.
- **`PRODUCT_PRICES` in `create-checkout-session.ts`** — Must stay in sync with `products.ts`. Never change one without the other.
- **GTM ID `GTM-N6HRP34Z`** — Do not alter. Connected to GA4 property for admiralenergy.ai.
- **Node version** — Pinned to 22 in `.nvmrc`, `.node-version`, and `netlify.toml`. Do not downgrade.
- **Tailwind v4 syntax** — Uses `@import "tailwindcss"` and `@theme inline {}`. Do not revert to v3 config patterns.

---

## 16. Known Patterns & Gotchas

### Product Page → Stripe Link
Only products with `stripeEnabled: true` in `products.ts` render the `BuyNowButton`. The `100w-solar-panel` and `storm-ready-kit` products are **not yet Stripe-enabled** — they show an "out of stock" or contact CTA instead. To enable checkout for them, add to both `products.ts` AND `PRODUCT_PRICES` in the Netlify function.

### Blog Posts Are Server-Rendered
`getAllPosts()` uses `fs.readFileSync` — this is a server-only call. Never import `blog.ts` in a client component.

### Contact Form (Netlify Forms)
Netlify Forms requires the form to be present in a **static HTML file** for detection. That's why `public/__forms.html` exists and mirrors the contact form's `name` attribute. The contact `layout.tsx` also renders a hidden version. Both are necessary for Netlify to register the form.

### `SITE_URL` Resolution
`src/lib/site.ts` reads `NEXT_PUBLIC_SITE_URL` env var and falls back to `https://admiralenergy.ai`. Always use this constant — never hardcode the domain.

### Image Paths
Product images are SVGs at `/images/products/`. They are rendered with `next/image` using `fill` + `object-contain` in the shop grid. New product images should follow the same pattern: place SVG in `public/images/products/` and reference as `/images/products/filename.svg`.

### Stripe Quantity Bounds
Quantity is clamped server-side: `Math.max(1, Math.min(5, parseInt(...)))`. The client `BuyNowButton` defaults `maxQty` to 5. These should stay in sync.

### Remote Image Domains
`next.config.ts` only allows `www.ecoflow.com` as a remote image domain. If you use external images from other domains, add them to `remotePatterns`.

---

## 17. Feature Roadmap / TODO

Based on `REBRAND_IMPLEMENTATION_GUIDE.md` and `docs/LAUNCH_CHECKLIST.md`:

### High Priority
- [ ] Add real product photography to replace SVG placeholders
- [ ] Enable Stripe for `100w-solar-panel` and `storm-ready-kit`
- [ ] Implement `stripe-webhook.ts` order fulfillment (email confirmation, order logging)
- [ ] Add more blog posts (NC energy tips, incentive guides, product comparisons)
- [ ] `/shop/success` page — fetch Stripe session details to show order summary

### Medium Priority
- [ ] Add `portable-power` page content (currently scaffolded)
- [ ] Add EcoFlow affiliate links to `/partners/ecoflow/delta-pro-ultra/`
- [ ] Add more partner pages (Bluetti, Jackery, Goal Zero)
- [ ] Implement email capture / newsletter (via Netlify Forms or third-party)
- [ ] Add product reviews/testimonials to shop pages

### Low Priority / Future
- [ ] Add a home resilience calculator (battery runtime math tool)
- [ ] Add Duke Energy PowerPair eligibility checker
- [ ] A/B test hero CTAs
- [ ] Add `next-sitemap` or enhance existing `sitemap.ts` for dynamic blog slugs

---

## 18. Security Audit Status

**Last updated:** 2026-02-24

### Completed
- Dependency security: `minimatch` override added in `package.json`; `npm install` and `npm audit` clean.
- Stripe checkout hardening (`netlify/functions/create-checkout-session.ts`): CORS validation, content-type guard, JSON parse error handling, input sanitization, and price sync guard against `src/data/products.ts`.
- Stripe webhook verified: signature enforcement uses raw body and `STRIPE_WEBHOOK_SECRET` guard.
- Environment guard audit: no server-only secrets referenced in client code.
- Security headers: `X-XSS-Protection` added to `netlify.toml` header block.
- App pages: `src/app/not-found.tsx`, `src/app/error.tsx`, and `src/app/shop/loading.tsx` added.
- Netlify forms: honeypot fields added in `src/app/contact/page.tsx` and `public/__forms.html`.
- SEO: sitemap now includes `lastModified` for static and product routes; blog uses post date.
- Lint scope: `.netlify/**` and `netlify/functions/**/*.js` are ignored to avoid generated/legacy JS noise.
- Cleanup: `.netlify/` ignored in `.gitignore`.
- Cleanup: unused imports removed from `src/app/partners/ecoflow/delta-pro-ultra/page.tsx`.
- Cleanup: `productName` prefixed with underscore in `src/components/BuyNowButton.tsx`.
- Cleanup: Footer logo converted to `next/image`.
- Cleanup: `public/scripts/admiral-chat-ui.js` empty catch updated.
- Verification: `npm run lint`, `npm run build`, and `npm audit` are clean; commit `5a7fc20` pushed to `origin/main`.
- Netlify deploy for commit `5a7fc20` confirmed live at admiralenergy.ai (2026-02-24).

### Remaining
- None. All audit tasks complete. Lint: 0 errors, 0 warnings.

### Recommendations
- Keep `.netlify/` ignored and avoid committing local build artifacts.
- Keep `PRODUCT_PRICES` and `products.ts` in sync for any Stripe-enabled product changes.

---

## Quick Reference

### Dev Commands
```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Run production build locally
npm run lint      # ESLint
```

### Add a Product (Checklist)
1. Add to `src/data/products.ts` (follow `Product` interface)
2. Add SVG image to `public/images/products/`
3. If Stripe-enabled: add to `PRODUCT_PRICES` in `netlify/functions/create-checkout-session.ts`
4. Test checkout locally with `stripe listen --forward-to localhost:8888/.netlify/functions/stripe-webhook`

### Add a Blog Post (Checklist)
1. Create `src/content/blog/your-slug.mdx`
2. Include required frontmatter (`title`, `date`, `excerpt`, `author`, `category`)
3. Write content in MDX
4. Test locally — post appears automatically on `/blog`

### Deploy
Push to `main` branch → Netlify auto-deploys via GitHub integration.

---

*Admiral Energy — "No pitch. Just math." | Kings Mountain, NC | info@admiralenergy.ai*
