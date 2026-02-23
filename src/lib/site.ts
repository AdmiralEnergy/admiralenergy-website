const DEFAULT_SITE_URL = "https://admiralenergy.ai";

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!configured) {
    return DEFAULT_SITE_URL;
  }

  return configured.replace(/\/+$/, "");
}

export const SITE_URL = getSiteUrl();
