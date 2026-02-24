# Codex Security & Quality Audit — Admiral Energy Website

> **How to use:** Paste this entire document as your prompt to GitHub Copilot Codex, Claude Code, or any AI coding agent with file-system access to this repository. The agent should read `CODEX.md` first, then execute each task below in order.

---

## Preamble — Read This First

You are an expert TypeScript/Next.js security engineer performing a full security and code quality audit on the Admiral Energy website.

**Before doing anything:**
1. Read `CODEX.md` in the project root. It is the canonical reference for this codebase — architecture, conventions, data flow, and constraints.
2. Read `.env.example` to understand what secrets are expected.
3. Review `netlify/functions/create-checkout-session.ts` and `netlify/functions/stripe-webhook.ts` — these handle real money and must be treated with the highest scrutiny.
4. Do NOT modify `_archive-static/` — it is dead code preserved for rollback reference only.
5. Do NOT remove or change the GTM ID `GTM-N6HRP34Z` in `src/app/layout.tsx`.
6. All edits must preserve existing functionality. No breaking changes.

---

## Audit Status (2026-02-24)

### Completed
- Task 12: `.gitignore` already covers `.env*`; `.env` not present in git history.
- Task 1: `minimatch` override added; `npm install` run; `npm audit` clean.
- Task 2: checkout endpoint hardened with CORS, content-type guard, JSON parse error handling, input sanitization, and price sync guard.
- Task 3: webhook signature verification confirmed (raw body + `STRIPE_WEBHOOK_SECRET` guard).
- Task 4: environment variable audit complete; no server secrets referenced in client code.
- Task 5: security headers updated (includes `X-XSS-Protection`).
- Task 6: `src/app/not-found.tsx` and `src/app/error.tsx` created.
- Task 7: external link audit complete; EcoFlow external anchor already uses `target="_blank"` and `rel="noopener noreferrer"`.
- Task 8: no `any`/`as any` found; `BuyNowButton` uses `unknown` catch; blog uses `satisfies BlogPost`.
- Task 9: `src/app/shop/loading.tsx` created.
- Task 10: robots and sitemap verified; sitemap now includes `lastModified` for static and product routes.
- Task 11: Netlify honeypot added in `src/app/contact/page.tsx` and `public/__forms.html`.
- Cleanup: `.netlify/` ignored in `.gitignore`.
- Cleanup: unused imports removed from `src/app/partners/ecoflow/delta-pro-ultra/page.tsx`.
- Cleanup: `productName` prefixed with underscore in `src/components/BuyNowButton.tsx`.
- Cleanup: Footer logo converted to `next/image`.
- Cleanup: `public/scripts/admiral-chat-ui.js` empty catch updated.

### Remaining
- None. All audit tasks complete.

### Verification (2026-02-24)
- `npm run lint`: 0 errors, 0 warnings.
- `npm run build`: compiled successfully.
- `npm audit`: 0 vulnerabilities.
- Commit `5a7fc20` pushed to `origin/main`.

### Recommendations
- Keep `PRODUCT_PRICES` and `products.ts` in sync for any Stripe-enabled product changes.
- Verify Netlify deploy for commit `5a7fc20`.
- Keep `.netlify/` ignored and avoid committing local build artifacts.

---

## Task 1 - Fix npm Dependency Vulnerabilities (devDependencies)

### Background
Running `npm audit` reveals **8 high severity vulnerabilities**, all tracing to a single root cause:

- **Package:** `minimatch < 10.2.1`
- **Advisory:** [GHSA-3ppc-4f35-3m26](https://github.com/advisories/GHSA-3ppc-4f35-3m26)
- **Type:** ReDoS (Regular Expression Denial of Service) via repeated wildcards
- **Affected packages:** `minimatch`, `@eslint/config-array`, `@eslint/eslintrc`, `eslint`, `eslint-config-next`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`
- **Context:** These are ALL `devDependencies` — ESLint toolchain only. The production bundle is not affected. However, it still must be resolved.

### Action
`npm audit fix` does not resolve these (the fix requires breaking changes in the ESLint chain). The safe approach is to add a `overrides` block to `package.json` to force `minimatch` to a safe version across all nested dependencies.

**Execute:**
1. Open `package.json`
2. Add an `overrides` field that forces `minimatch` to `>=10.2.1`:

```json
"overrides": {
  "minimatch": ">=10.2.1"
}
```

3. Run `npm install` to apply the override
4. Run `npm audit` to confirm 0 vulnerabilities remain
5. Run `npm run lint` to verify ESLint still functions correctly after the override
6. Run `npm run build` to confirm the production build still passes

> **Note:** If the `minimatch` override causes any ESLint plugin to fail with an incompatibility error, fall back to `"minimatch": "^9.0.5"` (the last stable v9, which patched ReDoS), and document why in a comment in `package.json`.

---

## Task 2 — Stripe Checkout Endpoint Security Hardening

**File:** `netlify/functions/create-checkout-session.ts`

### 2a — Add CORS headers
The endpoint currently returns no CORS headers. A malicious third-party site could trigger checkout sessions from your Stripe account. Add strict origin validation:

```typescript
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_SITE_URL || "https://admiralenergy.ai";

// In the handler, validate the origin header
const origin = event.headers["origin"] || event.headers["Origin"] || "";
if (origin && origin !== ALLOWED_ORIGIN) {
  return {
    statusCode: 403,
    body: JSON.stringify({ error: "Forbidden" }),
  };
}

// Add CORS headers to ALL responses
const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

Also handle the OPTIONS preflight request at the top of the handler.

### 2b — Add input sanitization
The `productId` and `quantity` fields from the request body are used directly. Add explicit type coercion and sanitization before use:
- Ensure `productId` is a string, strip non-alphanumeric characters except hyphens and underscores (slugs only)
- Ensure `quantity` is a finite integer before `Math.max/min` clamping
- If body parsing fails (malformed JSON), return 400 with a clear error

### 2c — Add a Content-Type header check
Reject requests that don't send `Content-Type: application/json`:

```typescript
const contentType = event.headers["content-type"] || "";
if (!contentType.includes("application/json")) {
  return { statusCode: 415, body: JSON.stringify({ error: "Unsupported Media Type" }) };
}
```

### 2d — Prevent price tampering risk
Currently `priceCents` is defined in two places: `src/data/products.ts` and `PRODUCT_PRICES` in the function. If they drift, a customer could be undercharged. Add a compile-time assertion comment and a runtime guard:

At the top of the Netlify function file, add a clear comment block:
```typescript
/**
 * PRICE SYNC REQUIRED
 * These prices MUST match priceCents in src/data/products.ts.
 * Discrepancy = wrong charge. Audit both files on every product change.
 * Last verified: [DATE]
 */
```

---

## Task 3 — Stripe Webhook Security

**File:** `netlify/functions/stripe-webhook.ts`

### 3a — Verify webhook signature is actually enforced
Open the file and confirm that:
1. `STRIPE_WEBHOOK_SECRET` is read from environment variables
2. `stripe.webhooks.constructEvent()` is called with the raw body, the signature header (`stripe-signature`), and the secret
3. If verification fails, the function returns `400` immediately — **never** processes the payload

If any of these are missing or incomplete, implement them. An unverified webhook endpoint means anyone can POST fake Stripe events (e.g., fake `checkout.session.completed`) to trigger fulfillment logic.

### 3b — Ensure raw body is used for signature verification
Netlify Functions receive the body as a string. The `stripe.webhooks.constructEvent()` call must use `event.body` (raw string), NOT `JSON.parse(event.body)`. Verify this is correct.

---

## Task 4 — Environment Variable Guards

**Files:** All files in `src/` and `netlify/functions/`

### 4a — Audit all `process.env` access
Scan every file for `process.env` usage. For each one:
- If it is a required variable (server would be broken without it), add a startup guard that throws a descriptive error if missing
- If it is optional, ensure there is a documented fallback

Required variables that should have guards:
- `STRIPE_SECRET_KEY` in `create-checkout-session.ts` ✅ (already guarded — verify the guard is before the Stripe instance is created)
- `STRIPE_WEBHOOK_SECRET` in `stripe-webhook.ts` — **add guard if missing**

### 4b — Confirm no secrets in client bundle
Verify that `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` are **never** referenced in any file under `src/app/` or `src/components/`. These are server-only. Only `NEXT_PUBLIC_*` vars should appear in client code.

---

## Task 5 — Security Headers

**File:** `netlify.toml`

Add a `[[headers]]` block with security headers for all pages. These protect against XSS, clickjacking, and MIME-sniffing:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

> Do NOT add a strict `Content-Security-Policy` header yet — this codebase uses inline scripts (GTM, JSON-LD) and would require `nonce` implementation to work correctly. Leave CSP for a dedicated future task.

---

## Task 6 — Missing `not-found.tsx` and `error.tsx`

**Directory:** `src/app/`

### 6a — Create `src/app/not-found.tsx`
Currently there is no custom 404 page. Next.js serves a generic one. Create a branded 404 page that:
- Matches the site's design (Admiral Navy header, gold accents)
- Has a clear message: "Page not found"
- Links back to `/` (Home) and `/shop` (Shop)
- Exports proper `metadata` with `title: "404 — Page Not Found"`

### 6b — Create `src/app/error.tsx`
Create a global error boundary for unhandled runtime errors:
- Must be a `'use client'` component (Next.js requirement for `error.tsx`)
- Props: `{ error: Error & { digest?: string }; reset: () => void }`
- Shows a friendly error message in brand style
- Includes a "Try Again" button that calls `reset()`
- Does NOT expose raw error messages or stack traces to the user

---

## Task 7 — External Link Safety

**Files:** All `.tsx` files under `src/`

Scan for any `<a href="...">` tags pointing to external domains (not `/` relative paths). Every external link must have:
```html
target="_blank" rel="noopener noreferrer"
```

The `rel="noopener noreferrer"` prevents the opened page from accessing `window.opener` (tabnapping attack).

> Note: `next/link` `<Link>` components do NOT open in new tabs by default, so this applies only to raw `<a>` tags. If you find `<Link>` components pointing to external `http://` or `https://` URLs, convert them to `<a>` tags with the proper attributes.

---

## Task 8 — Type Safety Audit

**Files:** All `.tsx` and `.ts` files under `src/`

### 8a — Eliminate `any` types
Run `grep -r ": any" src/` and `grep -r "as any" src/`. For each hit:
- Replace with the correct type or a proper `unknown` + type guard
- Document any cases where `any` genuinely cannot be avoided with an `// eslint-disable-next-line` comment and justification

### 8b — Verify `BuyNowButton` error handling
In `src/components/BuyNowButton.tsx`, the catch block uses:
```typescript
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : "Something went wrong";
```
This is correct. Confirm it exists as written. If it has been changed to `err: any`, revert it.

### 8c — Blog post type safety
In `src/lib/blog.ts`, verify the `satisfies BlogPost` assertion is present on the returned object in `getAllPosts()`. This prevents silent type drift if new fields are added to the interface.

---

## Task 9 — Missing `loading.tsx` for Shop Page

**File:** `src/app/shop/loading.tsx` (create if missing)

The shop page dynamically renders products. Create a loading skeleton UI:
- A `loading.tsx` file in `src/app/shop/` that Next.js automatically uses as the Suspense fallback
- Show 3 placeholder card skeletons matching the product card dimensions
- Use `animate-pulse` Tailwind class for skeleton shimmer effect
- No actual data fetching — purely visual placeholder

---

## Task 10 — `robots.ts` and `sitemap.ts` Completeness Audit

**Files:** `src/app/robots.ts`, `src/app/sitemap.ts`

### 10a — robots.ts
Open and verify:
- `User-agent: *` is allowed (not blocked)
- `Sitemap` field points to `${SITE_URL}/sitemap.xml` using the `SITE_URL` constant from `@/lib/site`

### 10b — sitemap.ts
Open and verify:
- Static routes are included: `/`, `/shop`, `/blog`, `/about`, `/contact`, `/home-resilience`, `/portable-power`, `/case-studies`
- Dynamic routes are included: all product slugs from `getProductBySlug` loop over `products`, all blog slugs from `getAllPosts()`
- Policy pages are included: `/policies/privacy`, `/policies/terms`, `/policies/returns`, `/policies/shipping`, `/policies/warranty`, `/policies/affiliate-disclosure`
- Partner pages are included: `/partners/ecoflow/delta-pro-ultra`
- Each URL has `lastModified`, `changeFrequency`, and `priority` set appropriately

If anything is missing, add it.

---

## Task 11 — Contact Form CSRF & Honeypot

**File:** `src/app/contact/page.tsx`

Netlify Forms are reasonably bot-resistant, but add a honeypot field for extra protection. Netlify supports this natively:

Add a hidden field to the form that real users will never fill in:
```html
<input type="text" name="bot-field" style={{ display: 'none' }} aria-hidden="true" />
```

Also ensure the form has `data-netlify-honeypot="bot-field"` attribute on the `<form>` element alongside `data-netlify="true"`.

Mirror this change in `public/__forms.html` as well (Netlify requires both to match).

---

## Task 12 — Verify `.gitignore` Protects Secrets

**File:** `.gitignore`

Open `.gitignore` and verify ALL of the following are present and will not be committed to the repo:
- `.env`
- `.env.local`
- `.env.*.local`
- `.env.production`
- `.env.production.local`

If any are missing, add them. Then run:
```bash
git status
```
Confirm `.env` (which exists in the repo root) is listed as untracked/ignored and NOT staged. If `.env` has already been committed at any point in git history, flag this prominently and recommend rotating the Stripe secret key immediately.

---

## Execution Order & Verification

Execute tasks in this order (dependencies):

```
Task 12 (gitignore)        — Check first. If .env was committed, stop and alert.
Task 1  (npm vulns)        — Fix dependencies, verify build passes
Task 2  (Stripe endpoint)  — Harden checkout function
Task 3  (Stripe webhook)   — Verify webhook signature enforcement
Task 4  (env var guards)   — Add missing guards
Task 5  (security headers) — Add to netlify.toml
Task 6  (404 + error)      — Create missing pages
Task 7  (external links)   — Patch anchor tags
Task 8  (type safety)      — Fix any types
Task 9  (loading.tsx)      — Add shop skeleton
Task 10 (SEO files)        — Audit sitemap/robots
Task 11 (contact form)     — Add honeypot
```

After ALL tasks are complete:
1. Run `npm run build` — must pass with 0 errors
2. Run `npm run lint` — must pass with 0 errors
3. Run `npm audit` — must show 0 high/critical vulnerabilities
4. Run `git diff --stat` — review all changed files before committing
5. Commit with message: `security: audit fixes — deps, headers, input validation, error pages`

---

## What NOT to Do

- Do NOT run `npm audit fix --force` without reviewing each breaking change first
- Do NOT add `Content-Security-Policy` headers (inline scripts will break GTM and JSON-LD)
- Do NOT modify `_archive-static/` in any way
- Do NOT change the GTM ID `GTM-N6HRP34Z`
- Do NOT change `priceCents` values without a corresponding Stripe dashboard update
- Do NOT add `console.log` statements that could expose sensitive data (cart totals, user input, Stripe session IDs) to logs
- Do NOT commit `.env` or any file containing real API keys

---

## Expected Outcome

After successful execution:
- `npm audit` → **0 vulnerabilities**
- `npm run build` → **✓ Compiled successfully**
- `npm run lint` → **✓ No ESLint errors**
- Checkout endpoint → CORS-protected, input-sanitized, typed correctly
- Webhook endpoint → Signature-verified, raw-body-safe
- Security headers → Active on all routes via `netlify.toml`
- 404 + error pages → Branded, functional
- Sitemap → Complete with all routes and slugs
- Git history → No secrets ever committed

---

*Prompt version: 1.0 | Project: admiralenergy-website | Date: February 24, 2026*
*Reference: CODEX.md (project root) | Repo: git@github.com:AdmiralEnergy/admiralenergy-website.git*
