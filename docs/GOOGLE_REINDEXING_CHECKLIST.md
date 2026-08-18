# Google Reindexing & Post-Deployment Checklist

Last updated: August 17, 2026

Code changes make the current site clearer, but they cannot force Google to replace an old result immediately. Complete these owner actions after the production deployment is approved.

## Short owner checklist

- [ ] Confirm the production deployment is the intended commit and the site is healthy.
- [ ] Run `npm run audit:seo -- https://admiralenergy.ai` and `npm run audit:product-discovery -- https://admiralenergy.ai`.
- [ ] Submit `https://admiralenergy.ai/sitemap.xml` in Google Search Console.
- [ ] Request indexing for the homepage, `/sidekick`, `/resources`, and the three new emergency-charging guides.
- [ ] Inspect representative retired product URLs and confirm Google sees HTTP 404.
- [ ] Validate `/sidekick` with Google's Rich Results Test and Merchant Center diagnostics.
- [ ] Monitor Pages, Merchant listings, and Performance reports weekly until obsolete snippets recede.

## 1. Verify production before asking Google to crawl

Run:

```bash
npm run audit:seo -- https://admiralenergy.ai
npm run audit:product-discovery -- https://admiralenergy.ai
```

Also open the production homepage, SideKick, Resources, Blog, and Home Backup pages on desktop and mobile. Confirm that checkout, forms, navigation, policy links, images, and the mobile SideKick purchase bar still work.

## 2. Submit the sitemap

In Search Console:

1. Open the verified `admiralenergy.ai` property.
2. Open **Sitemaps**.
3. Submit `https://admiralenergy.ai/sitemap.xml`.
4. Confirm the sitemap succeeds and lists only canonical HTTP 200 pages.

Do not add redirects, 404 URLs, `/shop/success`, or private administration routes to the sitemap.

## 3. Request indexing for priority URLs

Use **URL Inspection** and request indexing in this order:

1. `https://admiralenergy.ai/`
2. `https://admiralenergy.ai/sidekick`
3. `https://admiralenergy.ai/resources`
4. `https://admiralenergy.ai/blog/how-solar-power-banks-work`
5. `https://admiralenergy.ai/blog/hand-crank-power-bank-guide`
6. `https://admiralenergy.ai/blog/keep-phone-charged-during-power-outage`
7. `https://admiralenergy.ai/blog/nc-storm-prep-checklist`
8. `https://admiralenergy.ai/blog/powerpair-solar-battery-explained`
9. `https://admiralenergy.ai/home-backup`
10. `https://admiralenergy.ai/about`

For each URL, check the live test first. The tested page should return HTTP 200, be allowed by robots, emit one self-referential canonical, and contain the expected raw HTML metadata.

## 4. Confirm legacy handling

Inspect at least these representative URLs:

- `https://admiralenergy.ai/shop` — permanent redirect to `/sidekick`
- `https://admiralenergy.ai/shop/sidekick` — permanent redirect to `/sidekick`
- `https://admiralenergy.ai/shop/generac-gb1000-portable-power-station` — HTTP 404
- `https://admiralenergy.ai/shop/admiral-200w-foldable-solar-panel` — HTTP 404
- `https://admiralenergy.ai/shop/storm-ready-kit` — HTTP 404
- `https://admiralenergy.ai/shop/retired-product` — HTTP 404

Use Search Console's temporary Removals tool only if an obsolete result presents an urgent customer or policy problem. A removal hides a result temporarily; the durable signal is the correct 404 response plus removal from sitemaps and internal links.

## 5. Validate structured data and merchant signals

For `/sidekick`:

- Run Google's Rich Results Test against the live URL.
- Confirm exactly one `Product` entity and one `Offer`.
- Confirm visible and structured name, price `$69.99`, currency `USD`, availability `InStock`, condition, shipping, and return terms agree.
- Confirm there are no unsupported ratings, reviews, identifiers, certifications, or capacity claims.
- In Merchant Center, check item diagnostics and website/product-source status after recrawl.

For the homepage, confirm one `WebSite` entity and the sitewide `Organization`. Other pages must not emit Product schema.

## 6. Monitor recrawl and snippet replacement

Review weekly for at least the first month:

- **Pages:** indexing state and Google-selected canonical for priority URLs.
- **Performance:** page/query impressions for SideKick and the new guides.
- **Merchant listings:** product eligibility and any mismatch warnings.
- **Manual checks:** branded searches for Admiral Energy and SideKick in a signed-out window.

Google may keep an old title or snippet until it recrawls and reprocesses a page, and it may rewrite snippets by query. Do not keep changing titles every few days. Record the deployment date, allow a stable observation period, and change copy only when Search Console evidence shows a real mismatch.

## 7. Evidence to retain

- Production commit and Netlify deploy URL.
- Audit command output.
- Rich Results Test result for `/sidekick`.
- Search Console URL Inspection screenshots for the homepage and SideKick.
- Sitemap submission date and status.
- Merchant Center diagnostic status before and after recrawl.
- A dated note when retired snippets stop appearing.
