# Admiral Energy SEO Search-Intent Map

Last updated: October 17, 2026

## Current search architecture

Admiral Energy has one public retail product: SideKick PowerBank at `/sidekick`. The veteran-owned business is based in Kings Mountain, North Carolina and also provides home-backup education and preliminary homeowner planning conversations. Search signals should reinforce those legitimate business lines without recreating the retired multi-product catalog or implying that Admiral Energy independently performs licensed electrical installation.

The exact home-backup designation is **Generac Aligned Contractor**. Appropriately licensed professionals handle required final electrical design, permits, definitive proposals, and installation.

## Page-to-intent map

| Canonical URL | Primary intent | Representative queries | Page job | Primary internal links | Structured data owner |
|---|---|---|---|---|---|
| `/` | Brand + category navigation | Admiral Energy, portable power and home backup | Explain the two current paths and route visitors clearly | `/sidekick`, `/home-backup`, `/resources`, selected guides | `WebSite`; sitewide `Organization` |
| `/sidekick` | Transactional product research | solar power bank, emergency phone charger, power bank with built-in cables, hand-crank power bank | Present the sole product, price, availability, uses, limits, policies, and checkout | Charging guides, policies, `/home-backup` | Exactly one `Product` with one `Offer` |
| `/resources` | Informational research hub | emergency charging guide, power outage preparation, how backup power works | Answer early-stage questions and route readers to focused, people-first guides without turning every article into a service page | All published guides, `/sidekick`, `/home-backup`, contextually `/kings-mountain/home-backup` | No `Product` or `Service` |
| `/blog/how-solar-power-banks-work` | Informational product education | how do solar power banks work, do solar power banks charge in sunlight | Explain battery storage, wired-first charging, and realistic solar limits | `/sidekick`, phone-outage guide, `/home-backup` | `BlogPosting` |
| `/blog/hand-crank-power-bank-guide` | Informational product education | do hand-crank power banks work, emergency hand-crank charger | Explain last-resort use and avoid unsupported runtime promises | `/sidekick`, solar-bank guide, phone-outage guide | `BlogPosting` |
| `/blog/keep-phone-charged-during-power-outage` | Problem-solving preparedness | how to charge phone in power outage, emergency phone charging | Give a safe, layered preparation and conservation plan | `/sidekick`, storm checklist, `/home-backup` | `BlogPosting` |
| `/blog/nc-storm-prep-checklist` | Local preparedness | North Carolina storm prep checklist, NC power outage preparation | Provide an official-guidance-first household checklist | Phone-outage guide, `/sidekick`, `/home-backup` | `BlogPosting` |
| `/blog/powerpair-solar-battery-explained` | Whole-home education | does solar work in a power outage, solar battery backup | Explain grid shutdown, islanding, storage, and load planning | `/home-backup`, `/sidekick` for the smaller-use distinction | `BlogPosting` |
| `/home-backup` | Regional service inquiry | home standby generator assessment NC, whole-home backup North Carolina | Explain the regional assessment scope, common household priorities, and how a preliminary conversation works | `/sidekick`, `/about`, `/resources`, `/kings-mountain/home-backup` | Regional assessment `Service`; no `Product` |
| `/kings-mountain/home-backup` | Hyperlocal planning inquiry | backup generator planning Kings Mountain NC, standby generator consultation Kings Mountain, home backup Cleveland County | Give genuinely local planning value: well pumps, refrigeration, HVAC, communications, home offices, portable-versus-standby differences, automatic transfer switches, starting loads, pricing factors, and the licensed-professional next step | `/home-backup`, `/resources`, `/about`, relevant guides, assessment form anchor | Local planning/initial-assessment `Service`; no `Product` |
| `/about` | Trust + brand research | Admiral Energy North Carolina, Admiral Energy reviews/about | Establish real identity, service area, business model, and product relationship | `/sidekick`, `/home-backup`, policies | No page-specific commercial schema |
| `/policies/*` | Purchase reassurance | SideKick shipping, returns, warranty, privacy, terms | Publish verifiable offer and business terms | `/sidekick` where appropriate | No `Product` |

## Canonical and legacy URL rules

- `/shop`, `/shop/sidekick`, `/shop/hs-43-solar-power-bank`, and `/shop/solar-power-bank` permanently redirect to `/sidekick`. These are true aliases of the only current product.
- Retired product URLs for the former GB1000, panel products, and storm kit return HTTP 404. They do not soft-redirect to SideKick or to a generic resources page.
- General legacy content routes may redirect only when the destination is a real topical replacement, such as `/portable-power` to `/resources`.
- Unknown `/shop/*` paths return HTTP 404.
- Only canonical HTTP 200 pages appear in the XML sitemap.
- Private or post-transaction utility routes never appear in the sitemap and must be inaccessible or `noindex`.
- `/home-backup` and `/kings-mountain/home-backup` each use a self-referencing canonical. Do not cross-canonicalize either page to the other while each serves distinct intent and contains distinct content.
- Do not create near-duplicate city pages. Add another local page only when the business genuinely serves that place and the page can provide unique local value.

## Intent boundaries for the three backup-power destinations

| Page | Funnel stage | Must answer | Must not become |
|---|---|---|---|
| `/resources` | Informational / early research | How personal charging, portable batteries, outage preparation, solar limits, and household backup concepts work | A thin lead form, a Kings Mountain keyword page, or a duplicate product catalog |
| `/home-backup` | Regional consideration / assessment | Whether a homeowner should explore beyond personal power, which household priorities matter, and what the preliminary assessment process is across the owner-confirmed regional scope | A copy of the Kings Mountain landing page, a claim of statewide installation availability, or an installation proposal |
| `/kings-mountain/home-backup` | Hyperlocal high-intent planning | How Kings Mountain-area household loads, transfer equipment, sizing, site/fuel/permit factors, and a local preliminary consultation fit together | A copied regional page, a fabricated local outage report, or a claim that Admiral independently performs licensed electrical installation |

Content overlap is acceptable only where it helps a reader compare options. The local page should summarize and link to deeper educational resources rather than duplicating entire articles. The regional page should link to the Kings Mountain page with descriptive text such as “backup-generator planning in Kings Mountain,” and the local page should link back to the regional overview for readers outside the immediate area.

## Schema ownership

| Entity | Location | Rule |
|---|---|---|
| `Organization` | Root layout | One sitewide entity with stable `@id`; do not also declare `LocalBusiness` without a customer-facing physical storefront |
| `WebSite` | Homepage only | One entity that references the sitewide organization as publisher |
| `Product` | `/sidekick` only | One current SideKick entity; visible name, price, currency, availability, shipping, and return terms must match |
| `Service` | `/home-backup` and `/kings-mountain/home-backup` | Each page owns one distinct service node with its own URL and `@id`; each describes education, planning, or an initial assessment and references the sitewide organization as provider. Neither describes Admiral as the independent licensed installer. |
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
- Use **Generac Aligned Contractor** exactly. Do not substitute authorized dealer, authorized service dealer, electrician, licensed installer, or turnkey installer without verified documentation.
- State plainly that appropriately licensed professionals handle required final electrical design, permits, definitive proposals, and installation.
- Do not invent reviews, customers, installations, projects, certifications, local outage statistics, events, or service-area coverage.
- Do not publish a private residential address or fabricate a storefront in visible content or structured data.

## Internal-link model

The homepage and header create strong paths to `/sidekick`, `/home-backup`, and `/resources`. The homepage's local section, the regional home-backup page, and an appropriate footer or contextual link create discoverable paths to `/kings-mountain/home-backup` without displacing the regional navigation destination. The Resources hub links to every focused guide. Each guide links to its closest sibling answer and to the relevant next step. SideKick links back to the solar and hand-crank guides where it explains recharge methods.

Use descriptive anchors that reflect the destination's purpose:

- “Read practical outage-preparation guides” → `/resources`
- “Explore regional home-backup options” → `/home-backup`
- “Plan home backup in Kings Mountain” → `/kings-mountain/home-backup`

Do not use every anchor on every page. Link only when it helps the reader's next decision.

Internal links must use canonical URLs directly. Do not link to `/shop` aliases or retired routes.
