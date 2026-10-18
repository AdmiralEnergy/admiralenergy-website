"use client";

import { useEffect } from "react";
import { getOrCreateAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";

const LANDING_EVENT_KEY = "admiral_landing_event_v1";

export default function AttributionTracker() {
  useEffect(() => {
    const attribution = getOrCreateAttribution();

    try {
      if (!window.sessionStorage.getItem(LANDING_EVENT_KEY)) {
        trackEvent("landing_page_view", {
          page_path: window.location.pathname,
          lead_source: attribution.lead_source,
        });
        window.sessionStorage.setItem(LANDING_EVENT_KEY, "1");
      }
    } catch {
      trackEvent("landing_page_view", {
        page_path: attribution.landing_page,
        lead_source: attribution.lead_source,
      });
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a");
      if (!anchor) return;

      const pagePath = window.location.pathname;
      if (anchor.href.startsWith("tel:")) {
        trackEvent("phone_click", { page_path: pagePath });
      } else if (anchor.href.startsWith("mailto:")) {
        trackEvent("email_click", { page_path: pagePath });
      }

      const analyticsEvent = anchor.dataset.analyticsEvent;
      if (analyticsEvent) {
        trackEvent(analyticsEvent, {
          page_path: pagePath,
          cta_location: anchor.dataset.analyticsLocation || "unspecified",
          destination_path: anchor.dataset.analyticsDestination || anchor.pathname,
        });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
