export const BUSINESS = {
  name: "Admiral Energy LLC",
  shortName: "Admiral Energy",
  organizationId: "https://admiralenergy.ai/#organization",
  designation: "Generac Aligned Contractor",
  ownership: "Veteran-owned",
  base: {
    locality: "Kings Mountain",
    region: "NC",
    country: "US",
  },
  contact: {
    phoneDisplay: "(984) 238-4187",
    phoneE164: "+19842384187",
    phoneHref: "tel:+19842384187",
    email: "david@admiralenergy.ai",
    emailHref: "mailto:david@admiralenergy.ai",
  },
} as const;

/**
 * The current public number remains in use pending owner confirmation.
 * See docs/KINGS_MOUNTAIN_GROWTH_AUDIT.md before changing this record.
 */
export const CONTACT_VERIFICATION_REQUIRED = true;
