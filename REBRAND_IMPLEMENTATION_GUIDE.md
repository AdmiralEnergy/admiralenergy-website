# Admiral Energy — Portable Autonomy Rebrand: Implementation Guide

**Branch:** `feature/portable-autonomy-rebrand`  
**Date:** February 23, 2026  
**Commit:** `8ba71ad` — `feat: portable autonomy rebrand — Next.js App Router site`  
**Purpose:** Full review/debug reference for Codex  

---

## 1. What Changed (High-Level)

The entire Admiral Energy website was migrated from a **static HTML site** (Tailwind CDN, no build step) to a **Next.js 16 App Router** application with TypeScript, Tailwind CSS v4, Snipcart ecommerce, and MDX blog.

**Brand Pivot:** From "residential solar installer lead gen" → **"Portable Energy Autonomy + Home Resilience"** — selling portable power products, offering home resilience education, and affiliate-linking to EcoFlow.

| Before | After |
|--------|-------|
| Static `.html` files | Next.js 16 App Router (React 19) |
| Tailwind CDN | Tailwind CSS v4 (PostCSS, `@theme inline`) |
| No ecommerce | Snipcart ecommerce (CDN) |
| No blog | MDX blog with `next-mdx-remote` |
| 8 HTML pages | 25 routes (pages + dynamic) |
| `netlify.toml` (static) | `@netlify/plugin-nextjs` (SSR/SSG) |

---

## 2. Repository Structure (After Rebrand)

```
admiralenergy-website/
├── _archive-static/           # ← ALL original static files preserved here
│   ├── index.html
│   ├── about.html
│   ├── services.html
│   ├── powerpair.html
│   ├── case-studies.html
│   ├── quote.html
│   ├── privacy.html
│   ├── terms.html
│   ├── thank-you.html
│   ├── 404.html
│   ├── styles.css
│   ├── _headers
│   ├── check-deployment.ps1
│   ├── netlify.toml.bak
│   ├── package.json.bak
│   ├── package-lock.json
│   ├── README.md
│   ├── MOBILE-OPTIMIZATION-SUMMARY.md
│   ├── PRE_DEPLOYMENT_CHECKLIST.md
│   ├── PROGRESS_TRACKER.md
│   ├── QUICK_START.md
│   └── WEBSITE_OPTIMIZATION_ANALYSIS.md
│
├── public/                    # Static assets (merged: old + new)
│   ├── logos/                 # ae-logo-horiz-bg.png, favicons, etc. (FROM OLD SITE)
│   ├── images/                # (FROM OLD SITE)
│   ├── icons/                 # (FROM OLD SITE)
│   ├── scripts/               # admiral-chat-ui.js (FROM OLD SITE)
│   ├── file.svg, globe.svg, next.svg, vercel.svg, window.svg  # Next.js defaults
│   └── ...
│
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── globals.css        # Brand CSS + Tailwind v4 theme
│   │   ├── layout.tsx         # Root layout (fonts, meta, GTM, Snipcart, Header/Footer)
│   │   ├── page.tsx           # Homepage
│   │   ├── favicon.ico
│   │   ├── sitemap.ts         # Dynamic sitemap generator
│   │   ├── robots.ts          # robots.txt generator
│   │   │
│   │   ├── shop/
│   │   │   ├── page.tsx       # Product listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Product detail (dynamic route)
│   │   │
│   │   ├── portable-power/
│   │   │   └── page.tsx       # Portable power education page
│   │   │
│   │   ├── home-resilience/
│   │   │   └── page.tsx       # Home resilience education page
│   │   │
│   │   ├── blog/
│   │   │   ├── page.tsx       # Blog index
│   │   │   └── [slug]/
│   │   │       └── page.tsx   # Blog post template (dynamic)
│   │   │
│   │   ├── partners/
│   │   │   └── ecoflow/
│   │   │       └── delta-pro-ultra/
│   │   │           └── page.tsx  # EcoFlow affiliate page
│   │   │
│   │   ├── about/
│   │   │   └── page.tsx       # About / founder story
│   │   │
│   │   ├── contact/
│   │   │   ├── page.tsx       # Contact forms (client component)
│   │   │   └── layout.tsx     # Contact page metadata wrapper
│   │   │
│   │   ├── case-studies/
│   │   │   └── page.tsx       # Customer resilience stories
│   │   │
│   │   └── policies/
│   │       ├── shipping/page.tsx
│   │       ├── returns/page.tsx
│   │       ├── warranty/page.tsx
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── affiliate-disclosure/page.tsx
│   │
│   ├── components/
│   │   ├── Header.tsx         # Sticky responsive nav (client component)
│   │   └── Footer.tsx         # Site footer
│   │
│   ├── content/
│   │   └── blog/              # MDX blog posts
│   │       ├── powerpair-solar-battery-explained.mdx
│   │       └── nc-storm-prep-checklist.mdx
│   │
│   ├── data/
│   │   └── products.ts        # Product interface + 3 products + helper
│   │
│   └── lib/
│       └── blog.ts            # Blog utilities (getAllPosts, getPostBySlug)
│
├── docs/                      # Documentation (unchanged from old site)
├── dukeoutage/                # Duke outage tool (unchanged)
├── grid-resilience-quiz/      # Quiz tool (unchanged)
├── powerpaircalculator/       # Calculator tool (unchanged)
├── netlify/                   # Netlify functions (unchanged)
│
├── .gitignore
├── eslint.config.mjs
├── netlify.toml               # REWRITTEN for Next.js
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

---

## 3. Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.1.6 | App Router framework |
| **React** | 19.2.3 | UI library |
| **TypeScript** | ^5 | Type safety |
| **Tailwind CSS** | v4 | Styling (PostCSS, `@theme inline` syntax) |
| **Snipcart** | v3.7.1 | Ecommerce (CDN — no npm package) |
| **next-mdx-remote** | 6.0.0 | MDX rendering (RSC-compatible) |
| **gray-matter** | 4.0.3 | Frontmatter parsing for MDX |
| **reading-time** | 1.5.0 | Blog reading time calculation |
| **lucide-react** | 0.575.0 | Icons |
| **@netlify/plugin-nextjs** | 5.15.8 | Netlify deployment adapter |
| **Node** | 22 (set in netlify.toml) | Runtime |
| **Geist / Geist_Mono** | (next/font/google) | Typography |

### Important: Tailwind v4 Syntax

This uses Tailwind CSS **v4** which is different from v3:
- **No `tailwind.config.js`** — configuration is inline in CSS
- CSS uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`
- Custom colors defined via `@theme inline { --color-*: ...; }` in `globals.css`
- Colors used as `bg-admiral-navy`, `text-admiral-gold`, etc. (auto-generated from `--color-*`)
- PostCSS config: `postcss.config.mjs` with `@tailwindcss/postcss`

### Important: Snipcart Integration

Snipcart is loaded via CDN, **not an npm package** (`snipcart-nextjs-sdk` does not exist):
- **CSS:** `<link>` in `layout.tsx` `<head>`
- **JS:** `<Script>` tag at end of `<body>` in `layout.tsx`
- **Config div:** `<div hidden id="snipcart" data-api-key="YOUR_SNIPCART_PUBLIC_API_KEY" ...>`
- **Cart button:** `<button className="snipcart-checkout">` in Header.tsx
- **Add-to-cart:** Buttons with `data-item-id`, `data-item-name`, `data-item-price`, `data-item-url`, `data-item-description` attributes on shop pages
- **Z-index override:** `.snipcart-modal__container { z-index: 100000 !important; }` in globals.css

---

## 4. Brand Design Tokens

```css
--admiral-navy:   #0c2f4a   /* Primary — headers, nav, buttons */
--admiral-gold:   #c9a648   /* Accent — CTAs, highlights, badges */
--admiral-white:  #f7f5f2   /* Background — body, cards */
--navy-light:     #1a4a6e   /* Hover state for navy */
--gold-light:     #d4b85c   /* Hover state for gold */
```

Tailwind classes: `bg-admiral-navy`, `text-admiral-gold`, `bg-admiral-white`, `bg-navy-light`, `bg-gold-light`

---

## 5. File-by-File Details

### 5.1 Root Layout — `src/app/layout.tsx`

**Type:** Server Component  
**Purpose:** Wraps every page. Contains:
- `Geist` + `Geist_Mono` font loading via `next/font/google`
- Comprehensive `Metadata` export (title template, OG, Twitter, favicons, manifest)
- Google Tag Manager script (`GTM-N6HRP34Z`) via `next/script` (`afterInteractive`)
- GTM `<noscript>` iframe fallback
- Snipcart CSS `<link>` (preconnect + stylesheet)
- `<Header />` and `<Footer />` components wrapping `{children}`
- Snipcart `<div hidden id="snipcart">` with API key placeholder
- Snipcart JS `<Script>` tag

**⚠️ ACTION REQUIRED:** Replace `YOUR_SNIPCART_PUBLIC_API_KEY` on line ~92 with actual Snipcart API key.

**Potential Issues to Check:**
- OG image path `/logos/admiral-energy-share.png` — verify this file exists in `public/logos/`
- Favicon paths (`ae-favicon-16.png`, `ae-favicon-32.png`, `ae-apple-180.png`) — verify existence
- Manifest path `/logos/site.webmanifest` — verify existence
- `metadataBase: new URL("https://admiralenergy.ai")` — confirm this is the production URL

---

### 5.2 Header — `src/components/Header.tsx`

**Type:** Client Component (`'use client'`)  
**Purpose:** Sticky top nav, responsive with mobile hamburger menu.

**Nav Links:** Home, Shop, Portable Power, Home Resilience, Blog, About + Contact CTA + Snipcart cart icon

**Structure:**
- Desktop: horizontal nav links + gold "Contact" button + cart icon
- Mobile: hamburger `<Menu>` / `<X>` toggle, full-width dropdown panel
- Logo: `<Image src="/logos/ae-logo-horiz-bg.png">` — **verify this exists** in `public/logos/`

**Potential Issues to Check:**
- Logo image `ae-logo-horiz-bg.png` must exist at `public/logos/` or the Image component will error
- `snipcart-checkout` class on cart buttons — must match Snipcart's expected trigger class
- `snipcart-items-count` class for cart badge — auto-populated by Snipcart JS when loaded

---

### 5.3 Footer — `src/components/Footer.tsx`

**Type:** Server Component  
**Purpose:** Three-column footer (Explore links, Policies links, Contact info) + copyright

**Potential Issues to Check:**
- Email/phone links should match actual business contact info
- Policy links point to `/policies/*` routes

---

### 5.4 Homepage — `src/app/page.tsx`

**Type:** Server Component  
**Purpose:** Landing page with hero, three path cards (Buy/Plan/Refer), featured product, "Honest Approach" section, testimonial, FAQ accordion, CTA

**Features:**
- JSON-LD `LocalBusiness` structured data (hardcoded in `<script type="application/ld+json">`)
- FAQ section with expandable items (uses client `useState` via inline component? — **CHECK: if FAQ is interactive, page may need `'use client'` or the FAQ needs to be a separate client component**)

**Potential Issues to Check:**
- ⚠️ **FAQ accordion interactivity** — If `page.tsx` is a server component but has `useState` for FAQ toggles, it will fail. Verify the FAQ implementation.
- JSON-LD `telephone`, `email`, `address` should match real business data
- Featured product links to `/shop/solar-power-bank` — slug must match `products.ts`
- `/partners/ecoflow/delta-pro-ultra` link must resolve

---

### 5.5 Product Data — `src/data/products.ts`

**Type:** TypeScript module  
**Exports:** `Product` interface, `products` array (3 items), `getProductBySlug()` helper

**Products:**
| ID | Name | Slug | Price | Category |
|----|------|------|-------|----------|
| `solar-power-bank-001` | Admiral Solar Power Bank | `solar-power-bank` | $149.99 | Portable Power |
| `solar-panel-100w` | 100W Portable Solar Panel | `100w-solar-panel` | $199.99 | Solar Panels |
| `emergency-kit-001` | Storm Ready Emergency Kit | `storm-ready-kit` | $79.99 | Emergency Kits |

**⚠️ All three products have `images: []`** — empty arrays. The shop pages use a `<Battery>` icon as placeholder. Real product images need to be added to `public/images/products/` and the `images` arrays updated.

---

### 5.6 Shop Listing — `src/app/shop/page.tsx`

**Type:** Server Component  
**Purpose:** Grid of product cards with Snipcart add-to-cart buttons

**Each card has:**
- Product name, price, short description
- Snipcart `<button>` with `data-item-id`, `data-item-name`, `data-item-price`, `data-item-url="/shop/{slug}"`, `data-item-description`
- Link to `/shop/{slug}` detail page

**Potential Issues to Check:**
- `data-item-url` must be the **canonical URL path** for Snipcart's product validation (it crawls this URL to verify price). If the URL doesn't match the live route, checkout will fail.
- The `data-item-url` currently uses relative path `/shop/${product.slug}` — Snipcart requires a **full URL** in production. May need to be `https://admiralenergy.ai/shop/${product.slug}`.

---

### 5.7 Product Detail — `src/app/shop/[slug]/page.tsx`

**Type:** Server Component (with `generateStaticParams`)  
**Purpose:** Individual product page with specs, features, add-to-cart

**Static Generation:** `generateStaticParams()` returns all product slugs → fully static at build time

**Features:**
- Product JSON-LD structured data
- Snipcart add-to-cart button
- Features list, specs table
- Shipping/Returns/Warranty info badges

**Potential Issues to Check:**
- `generateMetadata()` uses `Promise<{ slug: string }>` for params — this is **Next.js 16 syntax** (params are now Promise-based in dynamic routes). Verify this compiles correctly.
- 404 behavior: uses `notFound()` from `next/navigation` if slug doesn't match
- `data-item-url` same concern as shop listing (may need full URL for Snipcart)

---

### 5.8 Portable Power — `src/app/portable-power/page.tsx`

**Type:** Server Component  
**Purpose:** Education page about portable power benefits for NC homeowners

**Sections:** Benefits grid (4), Use cases (4), Featured products from `products.ts`, free adviser CTA

---

### 5.9 Home Resilience — `src/app/home-resilience/page.tsx`

**Type:** Server Component  
**Purpose:** NC-specific threat education + resilience checklist

**Sections:** NC threat landscape (4 threats), 6-item resilience checklist with product links, DIY vs adviser comparison, consultation CTA

---

### 5.10 Blog System

#### `src/lib/blog.ts`
- Reads `.mdx` files from `src/content/blog/`
- Parses frontmatter with `gray-matter`
- Calculates reading time with `reading-time`
- Exports: `getAllPosts()`, `getPostBySlug()`

#### `src/content/blog/` (2 posts)
1. **`powerpair-solar-battery-explained.mdx`** — Solar + Battery pairing article
   - Frontmatter: title, date, excerpt, author, category
2. **`nc-storm-prep-checklist.mdx`** — NC storm preparation guide

#### `src/app/blog/page.tsx`
- Blog index with category badges, dates, reading times, excerpt previews
- Links to `/blog/{slug}`

#### `src/app/blog/[slug]/page.tsx`
- Dynamic blog post template
- `generateStaticParams()` generates routes for all posts
- Uses `MDXRemote` from `next-mdx-remote/rsc` for RSC-compatible MDX rendering
- BlogPosting JSON-LD structured data
- "Talk to an Adviser" CTA at bottom

**Potential Issues to Check:**
- `next-mdx-remote` v6 import is `next-mdx-remote/rsc` — verify import path
- MDX files must have valid frontmatter (title, date, excerpt, author, category)
- Blog directory (`src/content/blog/`) is read at build time — new posts require rebuild

---

### 5.11 EcoFlow Partner Page — `src/app/partners/ecoflow/delta-pro-ultra/page.tsx`

**Type:** Server Component  
**Purpose:** Affiliate product page for EcoFlow DELTA Pro Ultra

**Features:**
- Full spec table, 6 advantages, generator comparison table
- Affiliate disclosure banner at top (yellow)
- External links open in new tab (`target="_blank" rel="noopener noreferrer"`)
- "Honest Adviser" CTA (internal, not affiliate)

**Potential Issues to Check:**
- Affiliate links use `https://www.ecoflow.com/delta-pro-ultra` — verify this is correct/working
- `next.config.ts` has `images.remotePatterns` allowing `www.ecoflow.com` — only needed if using `<Image>` with EcoFlow URLs (currently not used, but configured for future use)

---

### 5.12 About Page — `src/app/about/page.tsx`

**Type:** Server Component  
**Purpose:** Founder story (David Edwards), timeline, core values

**Content:** Navy veteran → Intel analyst → Solar industry → Founded Admiral Energy. 4 core values. CTA.

---

### 5.13 Contact Page — `src/app/contact/page.tsx` + `layout.tsx`

**Type:** Client Component (`'use client'`) + Server Component layout  
**Purpose:** Two Netlify-compatible forms (homeowner inquiry, partner inquiry)

**Form Implementation:**
- `<form data-netlify="true" data-netlify-honeypot="bot-field" name="homeowner-inquiry">`
- Hidden `<input name="form-name" value="homeowner-inquiry">` for Netlify detection
- Honeypot `<input name="bot-field">` hidden with CSS
- Client-side `fetch` POST to `/contact` with `x-www-form-urlencoded` body
- Success/error states managed with React `useState`

**Potential Issues to Check:**
- ⚠️ **Netlify Forms with Next.js SSR** — Netlify Forms work by scanning the HTML at deploy time. With Next.js SSR/SSG, the forms need to be present in the **static HTML output**. Since this page is a client component, the form HTML may not be in the initial SSR output. You may need a **hidden static HTML form** for Netlify to detect it, or use Netlify's JavaScript form submission API.
- The `fetch("/contact", { method: "POST" })` sends to the same page URL — Netlify should intercept this for form submissions, but verify in deploy preview
- `layout.tsx` exports `metadata` for the contact page SEO

---

### 5.14 Case Studies — `src/app/case-studies/page.tsx`

**Type:** Server Component  
**Purpose:** 3 customer stories with quotes, events, products used, outcomes

**Stories:** Johnson Family (Raleigh), Mark & Linda (Wilmington), Sarah T. (Charlotte)

---

### 5.15 Policy Pages (6 pages under `/policies/`)

| Route | File | Content |
|-------|------|---------|
| `/policies/shipping` | `policies/shipping/page.tsx` | Free shipping, 2-5 day processing, damage policy |
| `/policies/returns` | `policies/returns/page.tsx` | 30-day satisfaction guarantee, conditions |
| `/policies/warranty` | `policies/warranty/page.tsx` | Product warranty table, claim process |
| `/policies/privacy` | `policies/privacy/page.tsx` | Privacy policy, data practices, cookie info |
| `/policies/terms` | `policies/terms/page.tsx` | Terms of service, liability, NC governing law |
| `/policies/affiliate-disclosure` | `policies/affiliate-disclosure/page.tsx` | Affiliate relationships, FTC compliance |

All are Server Components. All export `metadata` objects.

---

### 5.16 SEO Files

#### `src/app/sitemap.ts`
- Generates sitemap for all static pages + product slugs + blog slugs
- Base URL: `https://admiralenergy.ai`
- Imports `getAllPosts()` and `products` for dynamic entries

#### `src/app/robots.ts`
- Allows all crawlers
- Disallows `/api/`
- Links to sitemap at `https://admiralenergy.ai/sitemap.xml`

---

### 5.17 Netlify Configuration — `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "22"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**14 Redirect Rules (301):** Map all old `.html` URLs to new routes:
| Old URL | New Route |
|---------|-----------|
| `/services.html`, `/services` | `/home-resilience` |
| `/powerpair.html`, `/powerpair` | `/blog/powerpair-solar-battery-explained` |
| `/quote.html`, `/quote` | `/contact` |
| `/about.html` | `/about` |
| `/case-studies.html` | `/case-studies` |
| `/privacy.html`, `/privacy` | `/policies/privacy` |
| `/terms.html`, `/terms` | `/policies/terms` |
| `/index.html` | `/` |
| `/404.html` | `/404` |

**Security Headers:** X-Frame-Options (DENY), X-Content-Type-Options (nosniff), Referrer-Policy, Permissions-Policy

---

### 5.18 Next.js Config — `next.config.ts`

```typescript
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.ecoflow.com" },
    ],
  },
};
```

---

## 6. Build Output (Verified)

Build command: `npm run build`  
Result: **SUCCESS** — 25 routes generated in 7.9s, 0 errors

```
Route (app)                                    Size     First Load JS
┌ ○ /                                          19.3 kB  119 kB
├ ○ /_not-found                                977 B    101 kB
├ ○ /about                                     5.26 kB  105 kB
├ ● /blog/[slug]                               2.91 kB  103 kB
│   ├ /blog/powerpair-solar-battery-explained
│   └ /blog/nc-storm-prep-checklist
├ ○ /blog                                      2.49 kB  102 kB
├ ○ /case-studies                              5.1 kB   105 kB
├ ○ /contact                                   4.23 kB  104 kB
├ ○ /home-resilience                           8.64 kB  108 kB
├ ○ /partners/ecoflow/delta-pro-ultra          8.02 kB  108 kB
├ ○ /policies/affiliate-disclosure             2.46 kB  102 kB
├ ○ /policies/privacy                          4.08 kB  104 kB
├ ○ /policies/returns                          2.68 kB  102 kB
├ ○ /policies/shipping                         2.59 kB  102 kB
├ ○ /policies/terms                            4.01 kB  104 kB
├ ○ /policies/warranty                         2.68 kB  102 kB
├ ○ /portable-power                            7.07 kB  107 kB
├ ○ /robots.txt                                0 B      0 B
├ ○ /shop                                      3.61 kB  103 kB
├ ● /shop/[slug]                               4.6 kB   104 kB
│   ├ /shop/solar-power-bank
│   ├ /shop/100w-solar-panel
│   └ /shop/storm-ready-kit
└ ○ /sitemap.xml                               0 B      0 B

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
```

---

## 7. Known Issues & Action Items

### ⚠️ CRITICAL (Must fix before production)

| # | Issue | Location | Fix Required |
|---|-------|----------|-------------|
| 1 | **Snipcart API key is placeholder** | `src/app/layout.tsx:92` — `data-api-key="YOUR_SNIPCART_PUBLIC_API_KEY"` | Replace with real Snipcart public API key |
| 2 | **No product images** | `src/data/products.ts` — all `images: []` arrays are empty | Add product photos to `public/images/products/` and update arrays |
| 3 | **Snipcart `data-item-url` may need full URL** | `src/app/shop/page.tsx`, `src/app/shop/[slug]/page.tsx` | Snipcart validates prices by crawling the URL. Currently uses `/shop/{slug}` (relative). In production, may need `https://admiralenergy.ai/shop/{slug}`. Test in deploy preview. |
| 4 | **Netlify Forms may not detect forms** | `src/app/contact/page.tsx` | Client component — Netlify post-processes static HTML to find forms. SSR output may not include the form markup. May need a hidden static form in `public/` or use Netlify's JS submission API. Test in deploy preview. |

### ⚠️ VERIFY (Check in deploy preview)

| # | Item | Location |
|---|------|----------|
| 5 | OG share image exists | `public/logos/admiral-energy-share.png` |
| 6 | Logo image exists | `public/logos/ae-logo-horiz-bg.png` |
| 7 | Favicon files exist | `public/logos/ae-favicon-16.png`, `ae-favicon-32.png`, `ae-apple-180.png` |
| 8 | Web manifest exists | `public/logos/site.webmanifest` |
| 9 | Homepage FAQ interactivity | `src/app/page.tsx` — if FAQ uses `useState`, it needs `'use client'` or a separate client component |
| 10 | Blog MDX rendering | Verify MDX posts render correctly with `next-mdx-remote/rsc` |
| 11 | Old URL redirects work | Test `/services.html` → `/home-resilience`, etc. |
| 12 | Google Tag Manager fires | Check GTM `GTM-N6HRP34Z` loads on all pages |
| 13 | EcoFlow affiliate links | Verify `https://www.ecoflow.com/delta-pro-ultra` is correct URL |

### 📋 NICE TO HAVE (Post-launch)

| # | Item | Notes |
|---|------|-------|
| 14 | Product images w/ proper `<Image>` optimization | Replace Battery icon placeholders |
| 15 | More blog posts | Add MDX files to `src/content/blog/` |
| 16 | Thank-you page after form submission | Currently shows inline success message |
| 17 | 404 page customization | Currently uses Next.js default `_not-found` |
| 18 | Duke outage / quiz / calculator tools | Still in root dirs — may need Next.js integration or keep as static |
| 19 | `package.json` name is `"next-site"` | Rename to `"admiralenergy-website"` |

---

## 8. Dependencies

```json
{
  "dependencies": {
    "@netlify/plugin-nextjs": "^5.15.8",
    "gray-matter": "^4.0.3",
    "lucide-react": "^0.575.0",
    "next": "16.1.6",
    "next-mdx-remote": "^6.0.0",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "reading-time": "^1.5.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

---

## 9. Git History

```
Branch: feature/portable-autonomy-rebrand (from main)
Commit: 8ba71ad
Files changed: 65
Insertions: +12,917
Deletions: -1,181

Key changes:
- 25+ new files added (src/app/*, src/components/*, src/data/*, src/lib/*, src/content/*)
- 24 old static files renamed to _archive-static/
- package.json, netlify.toml, .gitignore, README.md modified
- New config files: next.config.ts, postcss.config.mjs, eslint.config.mjs, tsconfig.json
```

---

## 10. How to Run Locally

```bash
cd admiralenergy-website
npm install
npm run dev
# → http://localhost:3000
```

Build:
```bash
npm run build
npm run start
```

---

## 11. Deploy Preview

The branch is pushed to `origin/feature/portable-autonomy-rebrand`. If Netlify is connected to the GitHub repo with deploy previews enabled, it should automatically build a preview URL.

If not, create a PR: https://github.com/AdmiralEnergy/admiralenergy-website/pull/new/feature/portable-autonomy-rebrand

Netlify will build with:
- `npm run build` → outputs to `.next/`
- `@netlify/plugin-nextjs` handles SSR/SSG serving
- Redirects from `netlify.toml` applied

---

*Generated: February 23, 2026*
