# Admiral Energy SEO Search-Intent Map

Last updated: August 17, 2026

## Current search architecture

Admiral Energy has one public retail product: SideKick PowerBank at `/sidekick`. The site also offers North Carolina whole-home backup guidance and publishes practical outage-preparation education. Search signals should reinforce those two legitimate business lines without recreating the retired multi-product catalog.

## Page-to-intent map

| Canonical URL | Primary intent | Representative queries | Page job | Primary internal links | Structured data owner |
|---|---|---|---|---|---|
| `/` | Brand + category navigation | Admiral Energy, portable power and home backup | Explain the two current paths and route visitors clearly | `/sidekick`, `/home-backup`, `/resources`, selected guides | `WebSite`; sitewide `Organization` |
| `/sidekick` | Transactional product research | solar power bank, emergency phone charger, power bank with built-in cables, hand-crank power bank | Present the sole product, price, availability, uses, limits, policies, and checkout | Charging guides, policies, `/home-backup` | Exactly one `Product` with one `Offer` |
| `/resources` | Informational hub | emergency charging guide, power outage preparation, backup power resources | Route people to focused, people-first guides | All published guides, `/sidekick`, `/home-backup` | No `Product` |
| `/blog/how-solar-power-banks-work` | Informational product education | how do solar power banks work, do solar power banks charge in sunlight | Explain battery storage, wired-first charging, and realistic solar limits | `/sidekick`, phone-outage guide, `/home-backup` | `BlogPosting` |
| `/blog/hand-crank-power-bank-guide` | Informational product education | do hand-crank power banks work, emergency hand-crank charger | Explain last-resort use and avoid unsupported runtime promises | `/sidekick`, solar-bank guide, phone-outage guide | `BlogPosting` |
| `/blog/keep-phone-charged-during-power-outage` | Problem-solving preparedness | how to charge phone in power outage, emergency phone charging | Give a safe, layered preparation and conservation plan | `/sidekick`, storm checklist, `/home-backup` | `BlogPosting` |
| `/blog/nc-storm-prep-checklist` | Local preparedness | North Carolina storm prep checklist, NC power outage preparation | Provide an official-guidance-first household checklist | Phone-outage guide, `/sidekick`, `/home-backup` | `BlogPosting` |
| `/blog/powerpair-solar-battery-explained` | Whole-home education | does solar work in a power outage, solar battery backup | Explain grid shutdown, islanding, storage, and load planning | `/home-backup`, `/sidekick` for the smaller-use distinction | `BlogPosting` |
| `/home-backup` | Local service inquiry | home standby generator assessment NC, whole-home backup North Carolina | Explain service scope and collect a qualified assessment request | `/sidekick`, `/about`, `/resources` | `Service`; no `Product` |
| `/about` | Trust + brand research | Admiral Energy North Carolina, Admiral Energy reviews/about | Establish real identity, service area, business model, and product relationship | `/sidekick`, `/home-backup`, policies | No page-specific commercial schema |
| `/policies/*` | Purchase reassurance | SideKick shipping, returns, warranty, privacy, terms | Publish verifiable offer and business terms | `/sidekick` where appropriate | No `Product` |

## Canonical and legacy URL rules

- `/shop`, `/shop/sidekick`, `/shop/hs-43-solar-power-bank`, and `/shop/solar-power-bank` permanently redirect to `/sidekick`. These are true aliases of the only current product.
- Retired product URLs for the former GB1000, panel products, and storm kit return HTTP 404. They do not soft-redirect to SideKick or to a generic resources page.
- General legacy content routes may redirect only when the destination is a real topical replacement, such as `/portable-power` to `/resources`.
- Unknown `/shop/*` paths return HTTP 404.
- Only canonical HTTP 200 pages appear in the XML sitemap.
- Private or post-transaction utility routes never appear in the sitemap and must be inaccessible or `noindex`.

## Schema ownership

| Entity | Location | Rule |
|---|---|---|
| `Organization` | Root layout | One sitewide entity with stable `@id`; do not also declare `LocalBusiness` without a customer-facing physical storefront |
| `WebSite` | Homepage only | One entity that references the sitewide organization as publisher |
| `Product` | `/sidekick` only | One current SideKick entity; visible name, price, currency, availability, shipping, and return terms must match |
| `Service` | `/home-backup` only | Describes the assessment service and references the sitewide organization |
| `BlogPosting` | Each guide only | Uses the visible headline, excerpt, author, and real publication date |

Nested seller, provider, and publisher fields reference the organization `@id` instead of declaring duplicate organization nodes.

## Editorial rules

- Write for the question behind the query; do not repeat keyword variants mechanically.
- Put the direct answer near the start, then explain limits and next steps.
- Do not publish battery capacity, runtime, charge-rate, certification, rating, or review claims without source evidence for the exact product.
- Describe SideKick solar as supplemental and the hand crank as last-resort input. Wired USB is the primary recharge method.
- Distinguish a phone power bank from portable power stations, home batteries, and generators.
- Cite authoritative safety or technical guidance when advice could affect health, property, or emergency decisions.
- Do not use meta-keywords tags.

## Internal-link model

The homepage and header create strong paths to `/sidekick`, `/home-backup`, and `/resources`. The Resources hub links to every focused guide. Each guide links to its closest sibling answer and to the relevant commercial next step. SideKick links back to the solar and hand-crank guides where it explains recharge methods.

Internal links must use canonical URLs directly. Do not link to `/shop` aliases or retired routes.
