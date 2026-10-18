export const commercePolicies = {
  shipping: {
    label: "Free standard shipping",
    summary: "Continental U.S. orders ship free.",
    processing: "1–2 business days",
    transit: "5–7 business days",
    href: "/policies/shipping",
  },
  returns: {
    label: "30-day returns",
    summary: "Eligible products may be returned within 30 days of delivery.",
    windowDays: 30,
    href: "/policies/returns",
  },
  sidekickWarranty: {
    label: "1-year limited warranty",
    summary: "SideKick includes a one-year limited warranty from Admiral Energy.",
    href: "/policies/warranty",
  },
} as const;
