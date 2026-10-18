import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const staticHtml = fs.readFileSync(path.join(root, "public", "__forms.html"), "utf8");

const contracts = {
  "resilience-list": [
    "bot-field",
    "email",
    "lead_created_at_client",
    "marketing_consent",
    "source",
  ],
  "home-backup-assessment": [
    "attribution_captured_at",
    "backup_priority",
    "bot-field",
    "consideration_timeline",
    "consent_version",
    "contact_consent",
    "email",
    "form_location",
    "homeowner_status",
    "initial_referrer",
    "landing_page",
    "lead_created_at_client",
    "lead_source",
    "marketing_opt_in",
    "name",
    "notes",
    "partner_referral_consent",
    "phone",
    "submission_page",
    "utm_campaign",
    "utm_content",
    "utm_medium",
    "utm_source",
    "zip_code",
  ],
  "bulk-order-inquiry": [
    "bot-field",
    "company",
    "email",
    "name",
    "notes",
    "phone",
    "quantity",
    "timeline",
  ],
  "sidekick-interest": ["bot-field", "reason", "session-id"],
  "sidekick-bulk-inquiry": [
    "bot-field",
    "company",
    "email",
    "estimated-quantity",
    "name",
    "notes",
    "phone",
    "timeline",
  ],
};

const clientSources = {
  "resilience-list": "src/components/LeadForms.tsx",
  "home-backup-assessment": "src/components/HomeBackupAssessmentForm.tsx",
  "bulk-order-inquiry": "src/components/LeadForms.tsx",
  "sidekick-interest": "src/components/PostPurchaseExperience.tsx",
  "sidekick-bulk-inquiry": "src/components/sidekick/SidekickBulkInquiry.tsx",
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function formBody(name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = staticHtml.match(
    new RegExp(`<form\\b(?=[^>]*\\bname=["']${escaped}["'])[^>]*>([\\s\\S]*?)<\\/form>`, "i"),
  );
  assert(match, `Static Netlify declaration is missing form ${name}`);
  return match[1];
}

function namedFields(source) {
  return [...source.matchAll(/<(?:input|select|textarea)\b[^>]*\bname=["']([^"']+)["']/gi)].map(
    (match) => match[1],
  );
}

for (const [formName, expectedFields] of Object.entries(contracts)) {
  const openingTag = staticHtml.match(
    new RegExp(`<form\\b(?=[^>]*\\bname=["']${formName}["'])[^>]*>`, "i"),
  )?.[0];
  assert(openingTag?.includes('data-netlify="true"'), `${formName} is missing data-netlify=true`);
  assert(openingTag?.includes('netlify-honeypot="bot-field"'), `${formName} is missing the honeypot`);

  const actual = [...new Set(namedFields(formBody(formName)))].sort();
  const expected = [...expectedFields].sort();
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${formName} static fields differ. Expected ${expected.join(", ")}; got ${actual.join(", ")}`,
  );

  const clientPath = path.join(root, clientSources[formName]);
  const clientSource = fs.readFileSync(clientPath, "utf8");
  assert(
    clientSource.includes('action="/__forms.html"'),
    `${formName} client form is missing the verified Netlify fallback action`,
  );
  assert(
    clientSource.includes('fetch("/__forms.html"'),
    `${formName} client submission is not using the verified Netlify handler`,
  );
  for (const field of expected) {
    const quotedName = new RegExp(`name=["']${field.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`);
    assert(quotedName.test(clientSource), `${formName} client source is missing field ${field}`);
  }
}

for (const staleName of ["homeowner-inquiry", "partner-inquiry", "admiral-contact"]) {
  assert(!staticHtml.includes(`name="${staleName}"`), `Static declarations include stale form ${staleName}`);
}

console.log("Netlify form contract audit passed");
console.log(`- ${Object.keys(contracts).length} static forms have exact expected field sets and honeypots`);
console.log("- every static field has a matching client-rendered source field");
console.log("- every client form posts to the verified /__forms.html handler");
