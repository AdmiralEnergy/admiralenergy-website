# Google Product Discovery Audit

Audit date: August 16, 2026

## Current SideKick URL

`https://admiralenergy.ai/sidekick`

SideKick PowerBank is the only retail product intentionally exposed by Admiral Energy. Home Backup remains a lead-generation service and emits `Service`, not `Product`, structured data.

## Product schema

The `/sidekick` server page emits one JSON-LD `Product` entity with these fields:

| Field | Emitted value |
|---|---|
| `@context` | `https://schema.org` |
| `@type` | `Product` |
| `@id` | `https://admiralenergy.ai/sidekick#product` |
| `name` | `SideKick PowerBank` |
| `description` | Authoritative description from `src/data/products.ts` |
| `image` | Six absolute URLs under `https://admiralenergy.ai/images/sidekick/` |
| `brand` | `Brand` named `SideKick` |
| `model` | `HS-43` |
| `sku` | `AE-HS43-001` |
| `url` | `https://admiralenergy.ai/sidekick` |
| `mainEntityOfPage` | `https://admiralenergy.ai/sidekick` |
| `offers.@type` | `Offer` |
| `offers.@id` | `https://admiralenergy.ai/sidekick#offer` |
| `offers.url` | `https://admiralenergy.ai/sidekick` |
| `offers.price` | `69.99` |
| `offers.priceCurrency` | `USD` |
| `offers.availability` | `https://schema.org/InStock` while `sidekickProduct.inStock` is `true`; otherwise `OutOfStock` |
| `offers.itemCondition` | `https://schema.org/NewCondition` |
| `offers.seller` | `Organization` named `Admiral Energy LLC` |
| `offers.shippingDetails` | Free US shipping, 1–2 day handling, 5–7 day transit |
| `offers.hasMerchantReturnPolicy` | US returns by mail within 30 days |

The markup deliberately omits reviews, `aggregateRating`, `reviewCount`, GTIN, MPN, certifications, and unverified battery-capacity claims. Google documents `price`, `priceCurrency`, `availability`, and `itemCondition` as the structured values used for Merchant Center automatic item updates: [Google Merchant Center structured data setup](https://support.google.com/merchants/answer/7331077).

## Legacy product cleanup

The historical catalog previously contained multiple retail records and generated Product pages from a shared product array. The active storefront now has one authoritative SideKick record and no catalog array.

Cleanup completed:

- Removed the dynamic `/shop/[slug]` product page so arbitrary retired slugs can no longer return HTTP 200 or inherit product behavior.
- Removed the unused legacy shop loading state and checkout button component tied to the old catalog architecture.
- Removed obsolete public placeholder images for the GB1000, 200W panel, 100W panel, generic solar power bank, and storm kit.
- Removed obsolete implementation plans that described the retired multi-product storefront.
- Updated active developer and launch documentation to identify `/sidekick` as the sole retail product route.
- Removed the generic exported product array and slug lookup; checkout now resolves only the SideKick product ID.
- Confirmed the active source and generated site contain no retired Product JSON-LD, Offer schema, fake ratings, or disputed `40,000mAh`/`148Wh` claims.

The retired names remain only where necessary to define permanent redirects, in the automated regression audit, and in this historical cleanup report. They are not emitted as product data.

## Sitemap status

The sitemap contains exactly one product URL:

- `https://admiralenergy.ai/sidekick`

It does not contain `/shop`, retired product paths, or generated catalog URLs. Blog, policy, company, resource, and service URLs remain ordinary non-product sitemap entries.

## Canonical status

`/sidekick` emits exactly one canonical tag:

`https://admiralenergy.ai/sidekick`

It does not emit localhost, Netlify preview, `/shop/sidekick`, or `/shop/hs-43-solar-power-bank` canonicals.

## Redirect status

Permanent redirects to SideKick:

| Legacy route | Destination |
|---|---|
| `/shop` | `/sidekick` |
| `/shop/sidekick` | `/sidekick` |
| `/shop/hs-43-solar-power-bank` | `/sidekick` |
| `/shop/solar-power-bank` | `/sidekick` |

Retired product URLs intentionally return a real HTTP 404 instead of redirecting to a loosely related page:

| Retired route family | Response |
|---|---|
| GB1000 route variants | HTTP 404 |
| 200W panel route variants | HTTP 404 |
| `/shop/100w-solar-panel` | HTTP 404 |
| `/shop/storm-ready-kit` | HTTP 404 |

Unknown shop slugs, such as `/shop/retired-product`, return HTTP 404. They do not soft-redirect to SideKick and do not emit Product schema.

## Indexability

- `/sidekick` returns HTTP 200.
- No `noindex` or `nofollow` meta directive is emitted.
- No restrictive `X-Robots-Tag` is emitted.
- `robots.txt` allows `/sidekick`, SideKick images, and required site assets.
- `robots.txt` declares `https://admiralenergy.ai/sitemap.xml`.
- Only API paths and the post-purchase success page are intentionally disallowed.
- The homepage, primary navigation, Home Backup page, Resources page, and footer use ordinary crawlable links to `/sidekick`.
- All six schema image URLs are absolute, public, and return HTTP 200 with an image content type. The primary image is a real SideKick product photo, not the Admiral Energy logo.

## Raw HTML verification

The optimized production build was started locally and `/sidekick` was fetched as raw HTML without browser execution.

Results:

- Two JSON-LD scripts were present in the initial response: the sitewide Admiral Energy `Organization` entity and one SideKick `Product` entity.
- The Product JSON parsed successfully.
- Exactly one `Product` entity and one nested `Offer` were present.
- Product name, `$69.99 USD` price, `In stock` availability, and new condition agree with the visible page.
- No client-side hydration is required to create the Product JSON-LD.
- Other representative active pages emitted zero Product entities.

The repeatable check is available as:

`npm run audit:product-discovery -- https://admiralenergy.ai`

## Likely previous discovery failure

The prior production version at commit `03a88d0` did not contain a `/sidekick` route. It generated a multi-product sitemap and Product JSON-LD under `/shop/[slug]`, including the retired GB1000 and panel records. Therefore, the URL submitted as the current SideKick page had no matching product page in that deployed version, while Google had clear crawlable signals for the old catalog instead.

After the focused storefront was first deployed, the remaining dynamic `/shop/[slug]` route still returned HTTP 200 for arbitrary legacy slugs before redirecting in application logic. That soft-redirect behavior could preserve ambiguous old URL signals while Google's systems recrawled the site.

The most likely cause was the combination of the old multi-product deployment, the new canonical route not yet existing when Google first scanned it, and soft legacy route handling—not malformed or client-only JSON-LD on the current SideKick page. Google explains that automatic product discovery scans product pages and extracts structured data from them: [Add products automatically from your online store](https://support.google.com/merchants/answer/12158480).

Google may retain previously discovered products until its systems recrawl and process the permanent redirects. The code cleanup creates an unambiguous crawl path, but it cannot force immediate deletion of Google's cached Merchant Center records.

## Production verification checklist

### Google Rich Results Test

1. Open the [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Test `https://admiralenergy.ai/sidekick` using the URL option.
3. Confirm one Product/merchant listing item is detected.
4. Confirm the detected offer shows `69.99`, `USD`, `InStock`, and `NewCondition`.
5. Review warnings without inventing ratings, GTINs, MPNs, or certifications to silence optional recommendations. Google's current merchant listing requirements are documented in [Merchant listing structured data](https://developers.google.com/search/docs/appearance/structured-data/merchant-listing).

### Google Search Console URL Inspection

1. Inspect `https://admiralenergy.ai/sidekick`.
2. Run **Test live URL**.
3. Confirm crawling is allowed, the user-declared canonical is `/sidekick`, and Google-selected canonical is not an old `/shop` URL.
4. Request indexing after the live test succeeds.
5. Resubmit `https://admiralenergy.ai/sitemap.xml` if Search Console still shows a stale sitemap state.

### Merchant Center website scan

1. Confirm `admiralenergy.ai` remains verified and claimed in Merchant Center.
2. Confirm the automatic website product data source is enabled.
3. Start a new website scan after the production deployment is fully live.
4. Confirm SideKick is discovered at `/sidekick` with price `69.99 USD` and in-stock availability.
5. Confirm retired items are no longer tied to live product landing pages.
6. If old automatically added items remain temporarily, allow time for redirect recrawling and re-run the scan; remove or exclude stale Merchant Center records only after confirming they are not fed by another data source.

Google notes that its website crawler reads structured data from product landing pages and that visible landing-page values must stay aligned with structured values: [Automatic item updates](https://support.google.com/merchants/answer/12157888).
