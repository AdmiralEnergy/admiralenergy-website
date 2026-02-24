# AvantLink Verification (Temporary)

> **Remove immediately after successful verification.**

## Script Snippet

Added to `src/app/page.tsx` (homepage only, not in global layout):

```tsx
{/* TEMP: AvantLink site ownership verification — remove after verification. */}
<Script
  src="https://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=b4fccba6d8ff1139cd80f0add54cd84b5a17d636"
  strategy="afterInteractive"
/>
```

**Note:** The original email specified `http://` but since `admiralenergy.ai` is served
over HTTPS, browsers block mixed-content HTTP scripts. The AvantLink endpoint supports
HTTPS (verified 200 OK), so we use `https://` instead.

## Verification URL

<https://classic.avantlink.com/affiliate_app_confirm.php?mode=verify-js&application_id=1563845>

## Why Homepage-Only

The `<Script>` tag is in `src/app/page.tsx`, which is the Next.js App Router page for
the `/` route. It is NOT in `layout.tsx` (which applies to every page). This means the
script only loads when a visitor hits `https://admiralenergy.ai/`.

## How to Remove

1. Open `src/app/page.tsx`.
2. Delete the `{/* TEMP: AvantLink ... */}` comment and the `<Script ... />` block
   (approximately lines 8–13).
3. Delete this file (`docs/AVANTLINK_VERIFICATION.md`).
4. Commit and push to `main`:
   ```bash
   git add -A && git commit -m "chore: remove AvantLink verification script" && git push origin main
   ```
5. Netlify will auto-deploy. Verify the script is gone from the homepage.
