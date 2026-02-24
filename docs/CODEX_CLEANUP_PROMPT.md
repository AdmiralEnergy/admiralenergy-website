# Codex Cleanup Prompt — Admiral Energy Website (Post-Audit)

> **Context:** A security audit commit (`9f1dce9`) has been applied locally but not pushed. All 12 original audit tasks are complete. This prompt handles the remaining lint warnings, gitignore gap, and final commit/push to deploy.

---

## Preamble — Read These Files First

1. **`CODEX.md`** (project root) — Canonical architecture, conventions, constraints.
2. **`docs/CODEX_SECURITY_AUDIT_PROMPT.md`** — Section "Audit Status" → "Remaining" lists the exact lint warnings.
3. **`.gitignore`** — Verify coverage before committing.

---

## Hard Constraints

- Do NOT modify anything in `_archive-static/`.
- Do NOT change or remove GTM ID `GTM-N6HRP34Z` in `src/app/layout.tsx`.
- Do NOT change `priceCents` values in `src/data/products.ts` or `netlify/functions/create-checkout-session.ts`.
- All edits must preserve existing functionality. No breaking changes.
- After each file edit, verify the build still passes.

---

## Task 1 — Add `.netlify/` to `.gitignore`

**File:** `.gitignore`

The `.netlify/` directory contains local Netlify CLI build artifacts (functions-serve, blobs-serve, etc.). It is currently untracked but NOT ignored, meaning it could be accidentally committed.

**Action:**
1. Open `.gitignore`
2. Add `.netlify/` in the "dependencies / build output" section, near `node_modules` or `.next`:

```
# Netlify local artifacts
.netlify/
```

3. Confirm with `git status --short` that `.netlify/` no longer appears as untracked.

---

## Task 2 — Fix Unused Imports in EcoFlow Partner Page

**File:** `src/app/partners/ecoflow/delta-pro-ultra/page.tsx`

**Lint warning:** `Battery`, `Zap`, and `ShieldCheck` are imported from `lucide-react` but never used in the component.

**Action:**
Remove `Battery`, `Zap`, and `ShieldCheck` from the import statement on lines 3–11. Keep the other imports (`Home`, `CheckCircle`, `ArrowRight`, `AlertTriangle`) that ARE used.

The corrected import should be:
```tsx
import {
  Home,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
```

**Verify:** Run `npm run lint` and confirm this file no longer produces warnings.

---

## Task 3 — Fix Unused `productName` Prop in BuyNowButton

**File:** `src/components/BuyNowButton.tsx`
**Related caller:** `src/app/shop/[slug]/page.tsx` (line ~155)

**Lint warning:** `productName` is destructured in the component props but never referenced in the component body.

**Decision:** Keep `productName` in the interface (it is semantically useful and the caller passes it), but prefix the destructured variable with an underscore so ESLint treats it as intentionally unused.

**Action in `src/components/BuyNowButton.tsx`:**
Change the destructuring from:
```tsx
export default function BuyNowButton({
  productId,
  productName,
  price,
```
to:
```tsx
export default function BuyNowButton({
  productId,
  productName: _productName,
  price,
```

This keeps the prop contract intact (callers still pass `productName={product.name}`) and silences the lint warning without removing useful future metadata.

**Verify:** Run `npm run lint` and confirm this file no longer produces warnings.

---

## Task 4 — Convert Footer `<img>` to `next/image`

**File:** `src/components/Footer.tsx`

**Lint warning:** `@next/next/no-img-element` — Using `<img>` could result in slower LCP and higher bandwidth.

**Action:**
1. Add `import Image from 'next/image';` at the top of the file (after the existing `import Link from 'next/link';`).
2. Replace the `<img>` tag (around line 11):

**From:**
```tsx
<img
  src="/logos/ae-logo-horiz-bg.png"
  alt="Admiral Energy"
  className="h-7 w-auto rounded-md p-0.5 shadow-sm ring-1 ring-black/5"
/>
```

**To:**
```tsx
<Image
  src="/logos/ae-logo-horiz-bg.png"
  alt="Admiral Energy"
  width={140}
  height={28}
  className="h-7 w-auto rounded-md p-0.5 shadow-sm ring-1 ring-black/5"
/>
```

Notes:
- `width={140}` and `height={28}` match the approximate intrinsic size (the Header uses `width={140} height={36}` for the same logo at `h-8`; Footer uses `h-7` so height 28 is proportional).
- The `className` handles the visual sizing via `h-7 w-auto` — the width/height props are for the `<Image>` optimization hints.
- This is a server component (no `'use client'`), so `next/image` works directly.

**Verify:** Run `npm run lint` and confirm the `no-img-element` warning is gone. Run `npm run build` to confirm the image renders correctly.

---

## Task 5 — Suppress Lint Warning in Vanilla JS Chat Script

**File:** `public/scripts/admiral-chat-ui.js`

**Lint warning:** `_` is defined but never used (line 13).

**Context:** This is a standalone IIFE JavaScript file embedded in the old static site architecture and carried forward. The `_` is used as a discard variable in a `catch` clause:
```javascript
try { ... } catch (_) {}
```

**Action:**
This is an intentional discard pattern. The simplest fix is to remove the variable name entirely (empty catch is valid in modern JS):

Change (line 13):
```javascript
try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name }, payload || {})); } catch (_) {}
```
to:
```javascript
try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name }, payload || {})); } catch { }
```

**Verify:** Run `npm run lint` and confirm 0 warnings for this file.

---

## Task 6 — Update Documentation Status

**File:** `docs/CODEX_SECURITY_AUDIT_PROMPT.md`

After Tasks 1–5 are complete, update the "Audit Status" section:

Move the "Remaining" lint items to "Completed":
- `.netlify/` added to `.gitignore`
- Unused imports removed from EcoFlow partner page
- `productName` prefixed with underscore in BuyNowButton
- Footer `<img>` converted to `next/image`
- Chat UI script catch variable cleaned

Update "Remaining" to:
```markdown
### Remaining
- None. All audit tasks complete.
```

**File:** `CODEX.md`

Update Section 18 "Security Audit Status" → "Remaining" to:
```markdown
### Remaining
- None. All audit tasks complete. Lint: 0 errors, 0 warnings.
```

---

## Task 7 — Final Verification

Run all verification commands in order. ALL must pass cleanly before committing.

```bash
# 1. Lint — must show 0 errors AND 0 warnings
npm run lint

# 2. Build — must compile successfully with no errors
npm run build

# 3. Audit — must show 0 vulnerabilities
npm audit

# 4. Review what will be committed
git status --short
git diff --stat
```

**Expected output:**
- `npm run lint` → `✖ 0 problems (0 errors, 0 warnings)` (or silent success)
- `npm run build` → `✓ Compiled successfully` with all routes listed
- `npm audit` → `found 0 vulnerabilities`
- `git status` → modified and new files, NO `.netlify/` directory listed

---

## Task 8 — Commit and Push

Once all verifications pass:

```bash
# Stage all changes
git add -A

# Commit with descriptive message
git commit -m "chore: clean lint warnings, add .netlify to gitignore, update audit docs

- Remove unused imports (Battery, Zap, ShieldCheck) from EcoFlow partner page
- Prefix unused productName prop with underscore in BuyNowButton
- Convert Footer <img> to next/image for LCP optimization
- Remove unused catch variable in admiral-chat-ui.js
- Add .netlify/ to .gitignore (local build artifacts)
- Add CODEX.md project architecture document
- Update audit status to all-complete in docs"

# Push to origin/main (triggers Netlify deploy)
git push origin main
```

After push, verify Netlify deploy succeeds at: https://app.netlify.com/sites/admiralenergy/deploys

---

## Execution Order

```
Task 1  (.gitignore)         — Must be first to prevent accidental commits
Task 2  (EcoFlow imports)    — Quick fix, independent
Task 3  (BuyNowButton)       — Quick fix, independent
Task 4  (Footer image)       — Quick fix, independent
Task 5  (Chat script catch)  — Quick fix, independent
Task 6  (Update docs)        — After all fixes confirmed
Task 7  (Verify)             — After all edits
Task 8  (Commit + Push)      — Final step
```

Tasks 2–5 are independent and can be done in any order or in parallel.

---

## What NOT to Do

- Do NOT run `npm audit fix --force`
- Do NOT modify `_archive-static/`
- Do NOT change GTM ID `GTM-N6HRP34Z`
- Do NOT change product prices without updating both `products.ts` AND `create-checkout-session.ts`
- Do NOT add `console.log` that exposes sensitive data
- Do NOT commit `.env` or any file containing API keys
- Do NOT delete `productName` from the `BuyNowButtonProps` interface — it is passed by callers and may be used in future (e.g., for analytics event labels)

---

*Prompt version: 2.0 | Post-audit cleanup | Date: February 24, 2026*
*Reference: CODEX.md (root) | Audit: docs/CODEX_SECURITY_AUDIT_PROMPT.md*
*Repo: git@github.com:AdmiralEnergy/admiralenergy-website.git*
