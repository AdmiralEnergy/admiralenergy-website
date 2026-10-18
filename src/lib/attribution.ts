export interface LeadAttribution {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  landing_page: string;
  initial_referrer: string;
  lead_source: string;
  attribution_captured_at: string;
}

const STORAGE_KEY = "admiral_first_touch_v1";
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;
const MAX_VALUE_LENGTH = 160;

const EMPTY_ATTRIBUTION: LeadAttribution = {
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  landing_page: "",
  initial_referrer: "",
  lead_source: "direct",
  attribution_captured_at: "",
};

function clean(value: string | null, maxLength = MAX_VALUE_LENGTH) {
  return (value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function safePath(url: URL) {
  return clean(url.pathname, 240) || "/";
}

function safeReferrer(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return clean(`${url.origin}${url.pathname}`, 300);
  } catch {
    return "";
  }
}

function classifySource(source: string, medium: string, campaign: string, referrer: string) {
  const normalizedSource = source.toLowerCase();
  const normalizedMedium = medium.toLowerCase();
  const normalizedCampaign = campaign.toLowerCase();

  if (
    normalizedSource === "google" &&
    (normalizedCampaign.startsWith("gbp_") || normalizedCampaign.includes("business_profile"))
  ) {
    return "google_business_profile";
  }
  if (normalizedSource === "facebook") return "facebook";
  if (normalizedSource === "instagram") return "instagram";
  if (["cpc", "ppc", "paid", "paid_search", "paid_social"].includes(normalizedMedium)) {
    return "paid_campaign";
  }
  if (normalizedMedium === "organic") return "organic_search";

  const normalizedReferrer = referrer.toLowerCase();
  if (/facebook\.com|fb\.com/.test(normalizedReferrer)) return "facebook";
  if (/instagram\.com/.test(normalizedReferrer)) return "instagram";
  if (/google\.|bing\.|duckduckgo\.|yahoo\./.test(normalizedReferrer)) {
    return "organic_search";
  }
  if (source) return normalizedMedium === "social" ? "social" : "campaign";
  if (referrer) return "referral";
  return "direct";
}

function readStoredAttribution(): LeadAttribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as LeadAttribution;
    const capturedAt = Date.parse(stored.attribution_captured_at);
    if (!Number.isFinite(capturedAt) || Date.now() - capturedAt > ATTRIBUTION_TTL_MS) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const utmSource = clean(stored.utm_source);
    const utmMedium = clean(stored.utm_medium);
    const utmCampaign = clean(stored.utm_campaign);
    const initialReferrer = safeReferrer(stored.initial_referrer);
    return {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: clean(stored.utm_content),
      landing_page: clean(stored.landing_page, 240) || "/",
      initial_referrer: initialReferrer,
      lead_source: classifySource(utmSource, utmMedium, utmCampaign, initialReferrer),
      attribution_captured_at: new Date(capturedAt).toISOString(),
    };
  } catch {
    return null;
  }
}

export function getOrCreateAttribution(): LeadAttribution {
  if (typeof window === "undefined") return EMPTY_ATTRIBUTION;

  const stored = readStoredAttribution();
  if (stored) return stored;

  const url = new URL(window.location.href);
  const utmSource = clean(url.searchParams.get("utm_source"));
  const utmMedium = clean(url.searchParams.get("utm_medium"));
  const utmCampaign = clean(url.searchParams.get("utm_campaign"));
  const utmContent = clean(url.searchParams.get("utm_content"));
  const initialReferrer = safeReferrer(document.referrer);
  const attribution: LeadAttribution = {
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    utm_content: utmContent,
    landing_page: safePath(url),
    initial_referrer: initialReferrer,
    lead_source: classifySource(utmSource, utmMedium, utmCampaign, initialReferrer),
    attribution_captured_at: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage can be unavailable in strict privacy modes; the current-page
    // attribution still flows into the form submission.
  }

  return attribution;
}
