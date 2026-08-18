# Admiral Energy SERP Targets

Last updated: August 17, 2026

These are target snippets, not promises about how Google will render or rank a page. Google may rewrite titles and descriptions based on the query. The implementation keeps the HTML title, meta description, visible H1, canonical, social metadata, and page content aligned so the intended interpretation is unambiguous.

## Core pages

| URL | Target title | Target meta description | Visible H1 direction | Primary intent |
|---|---|---|---|---|
| `/` | Admiral Energy \| Portable Power & Whole-Home Backup | Shop the SideKick portable power bank or explore professionally installed whole-home backup with Admiral Energy in North Carolina. | Power Starts Small. Resilience Goes Further. | Brand + category navigation |
| `/sidekick` | SideKick Solar Power Bank & Emergency Charger \| Admiral Energy | SideKick is a portable emergency power bank with built-in charging cables, a flashlight, supplemental solar charging, and a hand crank for last-resort power. | Portable Emergency Power You Actually Keep With You. | Transactional product research |
| `/resources` | Power Outage & Emergency Charging Resources \| Admiral Energy | Practical guides to emergency phone charging, solar power banks, hand-crank charging, storm preparation, and whole-home backup decisions. | Prepare with facts, not fear. | Informational hub |
| `/blog` | Emergency Power & Home Resilience Guides \| Admiral Energy | Practical guides to emergency phone charging, solar power banks, outage preparation, battery backup, and home standby power. | Emergency Power & Home Resilience Guides | Guide discovery |
| `/home-backup` | Home Standby Generator Assessment in North Carolina \| Admiral Energy | Explore professionally installed whole-home backup with Admiral Energy, a Generac Aligned Contractor serving the Charlotte and Kings Mountain, NC area. | When a Power Bank Isn’t Enough. | Local service inquiry |
| `/about` | About Admiral Energy \| Veteran-Owned Energy Resilience \| Admiral Energy | Meet Admiral Energy, a veteran-owned North Carolina home-energy resilience company built around honest education, practical products, and clear guidance. | Practical energy resilience. Honest guidance. | Brand trust |

## Supporting guide targets

| URL | Search theme | Content promise |
|---|---|---|
| `/blog/how-solar-power-banks-work` | how solar power banks work; solar charger limits | Explain the battery, wired input, integrated panel, environmental variables, and realistic use |
| `/blog/hand-crank-power-bank-guide` | do hand-crank power banks work; crank charger uses | Explain last-resort input without invented crank-to-runtime claims |
| `/blog/keep-phone-charged-during-power-outage` | charge phone during power outage | Give a layered preparation, conservation, and safety plan |
| `/blog/nc-storm-prep-checklist` | North Carolina storm preparation | Provide an official-guidance-first checklist with clear power-load distinctions |
| `/blog/powerpair-solar-battery-explained` | solar during power outage; solar battery backup | Explain grid disconnection, islanding, capacity versus power, and buyer questions |

## Non-targets

The site should not target or revive search demand for the former GB1000, retired solar-panel products, storm kit, disputed capacity claims, or a broad multi-product shop. Those URLs return 404 and stay out of navigation, metadata, structured data, and the sitemap.

`/shop` remains only as a permanent alias to `/sidekick` because SideKick is the sole current retail product. Public links should point directly to `/sidekick`.

## Measurement

Use Search Console to track clicks, impressions, average position, and query mix by canonical page. Compare branded traffic separately from non-branded discovery. Useful early indicators are:

- Google-selected canonical matches the declared canonical.
- New guide URLs move from discovered/crawled to indexed.
- Homepage and SideKick snippets stop showing retired catalog language.
- `/sidekick` begins receiving impressions for relevant portable charger and emergency power-bank queries.
- Informational guides earn impressions for their exact problem statements without cannibalizing `/sidekick` transactional queries.

Record the deployment date in Search Console annotations or the project log before comparing periods.
