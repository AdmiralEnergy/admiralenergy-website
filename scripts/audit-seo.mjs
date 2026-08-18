const baseUrl = (process.argv[2] || process.env.AUDIT_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const canonicalOrigin = (process.env.AUDIT_CANONICAL_ORIGIN || "https://admiralenergy.ai").replace(/\/$/, "");
const isNetlifyPreview = new URL(baseUrl).hostname.endsWith(".netlify.app");

const pages = [
  { path: "/", schema: "WebSite", social: true },
  { path: "/sidekick", schema: "Product", social: true },
  { path: "/resources", social: true },
  { path: "/blog", social: true },
  { path: "/home-backup", schema: "Service", social: true },
  { path: "/about", social: true },
  { path: "/blog/how-solar-power-banks-work", schema: "BlogPosting" },
  { path: "/blog/hand-crank-power-bank-guide", schema: "BlogPosting" },
  { path: "/blog/keep-phone-charged-during-power-outage", schema: "BlogPosting" },
  { path: "/blog/nc-storm-prep-checklist", schema: "BlogPosting" },
  { path: "/blog/powerpair-solar-battery-explained", schema: "BlogPosting" },
  { path: "/policies/shipping" },
  { path: "/policies/returns" },
  { path: "/policies/warranty" },
  { path: "/policies/privacy" },
  { path: "/policies/terms" },
];

const sidekickAliases = [
  "/shop",
  "/shop/sidekick",
  "/shop/hs-43-solar-power-bank",
  "/shop/solar-power-bank",
];

const retiredProductPaths = [
  "/shop/gb1000",
  "/shop/generac-gb1000",
  "/shop/gb1000-portable-power-station",
  "/shop/generac-gb1000-portable-power-station",
  "/shop/200w-solar-panel",
  "/shop/admiral-200w-solar-panel",
  "/shop/200w-foldable-solar-panel",
  "/shop/admiral-200w-foldable-solar-panel",
  "/shop/100w-solar-panel",
  "/shop/storm-ready-kit",
];

const staleCatalogTerms = [
  "Generac GB1000 Portable Power Station",
  "Admiral 200W Foldable Solar Panel",
  "40,000mAh",
  "40000mAh",
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function decodeHtml(value = "") {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value = "") {
  return decodeHtml(value.replace(/<[^>]*>/g, " "));
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map((match) => match[0]);
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i"));
  return decodeHtml(match?.[1] ?? match?.[2] ?? "");
}

function metaContent(html, key) {
  const matches = tags(html, "meta").filter((tag) => {
    const identifier = attribute(tag, "name") || attribute(tag, "property");
    return identifier.toLowerCase() === key.toLowerCase();
  });
  assert(matches.length <= 1, `Found ${matches.length} ${key} meta tags`);
  return matches.length ? attribute(matches[0], "content") : "";
}

function canonicalUrls(html) {
  return tags(html, "link")
    .filter((tag) => attribute(tag, "rel").toLowerCase().split(/\s+/).includes("canonical"))
    .map((tag) => attribute(tag, "href"));
}

function titleText(html) {
  const titles = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)].map((match) => stripTags(match[1]));
  assert(titles.length === 1, `Found ${titles.length} title tags`);
  return titles[0];
}

function headingOnes(html) {
  return [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1]));
}

function jsonLdNodes(html) {
  return [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(
    (match) => JSON.parse(match[1]),
  );
}

function findTypedEntities(value, type, matches = []) {
  if (Array.isArray(value)) {
    for (const item of value) findTypedEntities(item, type, matches);
    return matches;
  }
  if (!value || typeof value !== "object") return matches;

  const types = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (types.includes(type)) matches.push(value);
  for (const nested of Object.values(value)) findTypedEntities(nested, type, matches);
  return matches;
}

function normalizedUrl(value) {
  const url = new URL(value, canonicalOrigin);
  url.hash = "";
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/$/, "");
  return url.toString().replace(/\/$/, "");
}

async function fetchManual(path) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  return { response, html: await response.text() };
}

async function assertPermanentRedirect(path, destination) {
  const { response } = await fetchManual(path);
  assert([301, 308].includes(response.status), `${path} returned ${response.status}, expected a permanent redirect`);
  const location = response.headers.get("location");
  assert(location, `${path} omitted its Location header`);
  assert(new URL(location, canonicalOrigin).pathname === destination, `${path} redirected to ${location}, expected ${destination}`);
}

const pageResults = [];
const titles = new Map();
const descriptions = new Map();

for (const page of pages) {
  const { response, html } = await fetchManual(page.path);
  assert(response.status === 200, `${page.path} returned ${response.status}`);
  if (!isNetlifyPreview) {
    assert(!/noindex|nofollow/i.test(response.headers.get("x-robots-tag") || ""), `${page.path} has a restrictive X-Robots-Tag`);
  }

  const title = titleText(html);
  const description = metaContent(html, "description");
  const canonical = canonicalUrls(html);
  const h1s = headingOnes(html);
  const robots = metaContent(html, "robots");

  assert(title.length >= 25 && title.length <= 90, `${page.path} title has ${title.length} characters`);
  assert(description.length >= 60 && description.length <= 180, `${page.path} description has ${description.length} characters`);
  assert(canonical.length === 1, `${page.path} emitted ${canonical.length} canonical tags`);
  assert(
    normalizedUrl(canonical[0]) === normalizedUrl(`${canonicalOrigin}${page.path}`),
    `${page.path} canonical is ${canonical[0]}`,
  );
  assert(h1s.length === 1, `${page.path} emitted ${h1s.length} H1 elements`);
  assert(!/noindex|nofollow/i.test(robots), `${page.path} has restrictive robots metadata: ${robots}`);
  assert(!metaContent(html, "keywords"), `${page.path} emitted a meta keywords tag`);

  const previousTitlePath = titles.get(title);
  assert(!previousTitlePath, `${page.path} and ${previousTitlePath} share the title "${title}"`);
  titles.set(title, page.path);

  const previousDescriptionPath = descriptions.get(description);
  assert(!previousDescriptionPath, `${page.path} and ${previousDescriptionPath} share a meta description`);
  descriptions.set(description, page.path);

  for (const term of staleCatalogTerms) {
    assert(!html.toLowerCase().includes(term.toLowerCase()), `${page.path} contains stale catalog text: ${term}`);
  }

  const structuredData = jsonLdNodes(html);
  const organizations = structuredData.flatMap((node) => findTypedEntities(node, "Organization"));
  const localBusinesses = structuredData.flatMap((node) => findTypedEntities(node, "LocalBusiness"));
  const products = structuredData.flatMap((node) => findTypedEntities(node, "Product"));
  assert(organizations.length === 1, `${page.path} emitted ${organizations.length} Organization entities`);
  assert(localBusinesses.length === 0, `${page.path} emitted a LocalBusiness entity without a public storefront`);
  assert(products.length === (page.path === "/sidekick" ? 1 : 0), `${page.path} emitted ${products.length} Product entities`);

  if (page.schema) {
    const expected = structuredData.flatMap((node) => findTypedEntities(node, page.schema));
    assert(expected.length === 1, `${page.path} emitted ${expected.length} ${page.schema} entities`);
  }

  if (page.social) {
    for (const key of ["og:title", "og:description", "og:url", "twitter:card", "twitter:title", "twitter:description"]) {
      assert(metaContent(html, key), `${page.path} is missing ${key}`);
    }
    assert(normalizedUrl(metaContent(html, "og:url")) === normalizedUrl(`${canonicalOrigin}${page.path}`), `${page.path} has an incorrect og:url`);
  }

  pageResults.push({ ...page, html, title, description });
}

for (const path of sidekickAliases) await assertPermanentRedirect(path, "/sidekick");
for (const path of retiredProductPaths) {
  const { response } = await fetchManual(path);
  assert(response.status === 404, `${path} returned ${response.status}, expected a real 404`);
}
for (const [path, destination] of [
  ["/portable-power", "/resources"],
  ["/case-studies", "/about"],
  ["/contact", "/home-backup"],
]) {
  await assertPermanentRedirect(path, destination);
}

const { response: robotsResponse, html: robotsText } = await fetchManual("/robots.txt");
assert(robotsResponse.status === 200, `/robots.txt returned ${robotsResponse.status}`);
assert(!/Disallow:\s*\/(?:sidekick|resources|blog|images)/i.test(robotsText), "robots.txt blocks an indexable content path");
assert(robotsText.includes(`${canonicalOrigin}/sitemap.xml`), "robots.txt does not declare the canonical sitemap");

const { response: sitemapResponse, html: sitemapXml } = await fetchManual("/sitemap.xml");
assert(sitemapResponse.status === 200, `/sitemap.xml returned ${sitemapResponse.status}`);
for (const page of pages) {
  assert(sitemapXml.includes(`${canonicalOrigin}${page.path === "/" ? "" : page.path}`), `Sitemap omits ${page.path}`);
}
for (const path of [...sidekickAliases, ...retiredProductPaths, "/admin/commerce", "/shop/success"]) {
  assert(!sitemapXml.includes(`<loc>${canonicalOrigin}${path}</loc>`), `Sitemap includes non-canonical URL ${path}`);
}
assert(!/shop\/(?:gb1000|generac-gb1000|200w|admiral-200w|100w|storm-ready)/i.test(sitemapXml), "Sitemap contains a retired product URL");

const sitemapBlocks = [...sitemapXml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => match[1]);
for (const block of sitemapBlocks) {
  const location = block.match(/<loc>(.*?)<\/loc>/i)?.[1] || "";
  if (!location.includes("/blog/")) {
    assert(!/<lastmod>/i.test(block), `Static sitemap entry fabricates lastmod: ${location}`);
  }
}

const internalPaths = new Set();
for (const page of pageResults) {
  for (const anchor of tags(page.html, "a")) {
    const href = attribute(anchor, "href");
    if (!href || href.startsWith("#") || /^(?:mailto:|tel:|javascript:)/i.test(href)) continue;
    const url = new URL(href, `${canonicalOrigin}${page.path}`);
    if (url.origin !== canonicalOrigin) continue;
    if (url.pathname.startsWith("/_next/") || url.pathname === "/shop/success") continue;
    internalPaths.add(url.pathname);
  }
}

for (const path of [...internalPaths].sort()) {
  const { response } = await fetchManual(path);
  assert(response.status === 200, `Internal link ${path} returned ${response.status} instead of a canonical 200 page`);
}

const { response: successResponse, html: successHtml } = await fetchManual("/shop/success");
assert(successResponse.status === 200, `/shop/success returned ${successResponse.status}`);
assert(/noindex/i.test(metaContent(successHtml, "robots")), "/shop/success is not marked noindex");

const { response: adminResponse, html: adminHtml } = await fetchManual("/admin/commerce");
if (adminResponse.status === 200) {
  assert(/noindex/i.test(metaContent(adminHtml, "robots")), "/admin/commerce is public but not marked noindex");
} else {
  assert([301, 302, 303, 307, 308, 401, 403, 404].includes(adminResponse.status), `/admin/commerce returned unexpected ${adminResponse.status}`);
}

console.log(`SEO audit passed for ${baseUrl}`);
console.log(`- ${pages.length} canonical, indexable pages have unique titles, descriptions, and one H1`);
console.log("- WebSite, Organization, Product, Service, and BlogPosting schema boundaries verified");
console.log(`- ${internalPaths.size} internal destinations return canonical HTTP 200 pages`);
console.log("- sitemap, robots, social metadata, redirects, retired-route 404s, and private-route handling verified");
if (isNetlifyPreview) console.log("- intentional Netlify preview noindex header accepted; production remains strict");
