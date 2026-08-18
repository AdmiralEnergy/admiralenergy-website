const baseUrl = (process.argv[2] || process.env.AUDIT_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const isNetlifyPreview = new URL(baseUrl).hostname.endsWith(".netlify.app");

const retiredTerms = [
  "Generac GB1000 Portable Power Station",
  "Admiral 200W Foldable Solar Panel",
  "40,000mAh",
  "40000mAh",
];

const sidekickRedirects = [
  "/shop",
  "/shop/sidekick",
  "/shop/hs-43-solar-power-bank",
  "/shop/solar-power-bank",
];

const retiredRoutes = [
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function getJsonLd(html) {
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

  const entityTypes = Array.isArray(value["@type"]) ? value["@type"] : [value["@type"]];
  if (entityTypes.includes(type)) matches.push(value);

  for (const nested of Object.values(value)) findTypedEntities(nested, type, matches);
  return matches;
}

function canonicalUrls(html) {
  return [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/gi)].map(
    (match) => match[1],
  );
}

async function fetchPage(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  return { response, html: await response.text() };
}

async function assertRedirect(path, expectedDestination) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert([301, 308].includes(response.status), `${path} returned ${response.status}, expected a permanent redirect`);
  const location = response.headers.get("location");
  assert(location, `${path} did not include a Location header`);
  const resolved = new URL(location, baseUrl);
  assert(resolved.pathname === expectedDestination, `${path} redirected to ${resolved.pathname}, expected ${expectedDestination}`);
}

const { response: sidekickResponse, html: sidekickHtml } = await fetchPage("/sidekick");
assert(sidekickResponse.status === 200, `/sidekick returned ${sidekickResponse.status}`);
if (!isNetlifyPreview) {
  assert(!/noindex|nofollow/i.test(sidekickResponse.headers.get("x-robots-tag") || ""), "/sidekick has a restrictive X-Robots-Tag");
}

const canonicals = canonicalUrls(sidekickHtml);
assert(canonicals.length === 1, `/sidekick emitted ${canonicals.length} canonical tags`);
assert(canonicals[0] === "https://admiralenergy.ai/sidekick", `Unexpected canonical: ${canonicals[0]}`);
assert(!/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*(noindex|nofollow)/i.test(sidekickHtml), "/sidekick has restrictive meta robots");

const jsonLd = getJsonLd(sidekickHtml);
const productEntities = jsonLd.flatMap((node) => findTypedEntities(node, "Product"));
assert(productEntities.length === 1, `/sidekick emitted ${productEntities.length} Product entities`);

const product = productEntities[0];
const offer = product.offers;
const renderedTextHtml = sidekickHtml.replace(/<!--\s*-->/g, "");
assert(product["@context"] === "https://schema.org", "Product @context is invalid");
assert(product.name === "SideKick PowerBank", `Unexpected Product name: ${product.name}`);
assert(typeof product.description === "string" && product.description.length > 40, "Product description is missing or too short");
assert(Array.isArray(product.image) && product.image.length > 0, "Product image array is missing");
assert(product.image.every((url) => url.startsWith("https://admiralenergy.ai/images/sidekick/")), "Product images are not absolute SideKick image URLs");
assert(product.brand?.name === "SideKick", "Product brand is invalid");
assert(product.sku === "AE-HS43-001", `Unexpected SKU: ${product.sku}`);
assert(product.url === "https://admiralenergy.ai/sidekick", `Unexpected Product URL: ${product.url}`);
assert(offer?.["@type"] === "Offer", "Product Offer is missing");
assert(String(offer.price) === "69.99", `Unexpected Offer price: ${offer.price}`);
assert(offer.priceCurrency === "USD", `Unexpected Offer currency: ${offer.priceCurrency}`);
assert(offer.availability === "https://schema.org/InStock", `Unexpected Offer availability: ${offer.availability}`);
assert(offer.itemCondition === "https://schema.org/NewCondition", `Unexpected Offer condition: ${offer.itemCondition}`);

for (const prohibited of ["aggregateRating", "review", "reviewCount", "gtin", "mpn", "certification"]) {
  assert(!(prohibited in product), `Product contains prohibited or unsupported field: ${prohibited}`);
}

assert(renderedTextHtml.includes("SideKick PowerBank"), "Visible product name is missing");
assert(renderedTextHtml.includes("$69.99 USD"), "Visible USD price is missing");
assert(renderedTextHtml.includes("In stock"), "Visible in-stock status is missing");

for (const term of retiredTerms) {
  assert(!sidekickHtml.toLowerCase().includes(term.toLowerCase()), `/sidekick contains retired or disputed text: ${term}`);
}

for (const imageUrl of product.image) {
  const response = await fetch(imageUrl, { method: "HEAD" });
  assert(response.status === 200, `${imageUrl} returned ${response.status}`);
  assert((response.headers.get("content-type") || "").startsWith("image/"), `${imageUrl} is not served as an image`);
  assert(!/noindex/i.test(response.headers.get("x-robots-tag") || ""), `${imageUrl} has a restrictive X-Robots-Tag`);
}

const { response: robotsResponse, html: robotsText } = await fetchPage("/robots.txt");
assert(robotsResponse.status === 200, `/robots.txt returned ${robotsResponse.status}`);
assert(!/Disallow:\s*\/sidekick/i.test(robotsText), "robots.txt blocks /sidekick");
assert(!/Disallow:\s*\/images/i.test(robotsText), "robots.txt blocks product images");
assert(robotsText.includes("https://admiralenergy.ai/sitemap.xml"), "robots.txt does not declare the canonical sitemap");

const { response: sitemapResponse, html: sitemapXml } = await fetchPage("/sitemap.xml");
assert(sitemapResponse.status === 200, `/sitemap.xml returned ${sitemapResponse.status}`);
assert(sitemapXml.includes("https://admiralenergy.ai/sidekick"), "Sitemap omits /sidekick");
assert(!/shop\/(gb1000|200w-solar-panel|100w-solar-panel|storm-ready-kit)/i.test(sitemapXml), "Sitemap contains a retired product URL");

const { html: homeHtml } = await fetchPage("/");
assert(/<a[^>]+href=["']\/sidekick(?:#buy)?["']/i.test(homeHtml), "Homepage does not contain a crawlable SideKick link");

for (const path of sidekickRedirects) await assertRedirect(path, "/sidekick");
for (const path of retiredRoutes) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  assert(response.status === 404, `${path} returned ${response.status}, expected 404`);
}

const unknownProduct = await fetch(`${baseUrl}/shop/retired-product`, { redirect: "manual" });
assert(unknownProduct.status === 404, `/shop/retired-product returned ${unknownProduct.status}, expected 404`);

for (const path of ["/", "/home-backup", "/resources", "/about", "/blog"]) {
  const { html } = await fetchPage(path);
  const products = getJsonLd(html).flatMap((node) => findTypedEntities(node, "Product"));
  assert(products.length === 0, `${path} emitted ${products.length} unintended Product entities`);
}

console.log(`Product discovery audit passed for ${baseUrl}`);
console.log("- exactly one Product entity: SideKick PowerBank");
console.log("- canonical, sitemap, robots, images, visible offer data, redirects, and retired-route 404s verified");
if (isNetlifyPreview) console.log("- intentional Netlify preview noindex header accepted; production remains strict");
