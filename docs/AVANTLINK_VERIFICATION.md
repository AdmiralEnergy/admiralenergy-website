# AvantLink Verification (Temporary)

> **Remove immediately after successful verification.**

## Script Snippet

Added to `src/app/page.tsx` (homepage only, not in global layout):

```tsx
{/* TEMP: AvantLink site ownership verification — remove after verification.
    Uses raw <script> so the tag appears in static HTML for AvantLink's crawler.
    HTTP URL is intentional — AvantLink's verifier matches the exact URL.
    See docs/AVANTLINK_VERIFICATION.md for removal instructions. */}
<script
  type="text/javascript"
  src="http://classic.avantlink.com/affiliate_app_confirm.php?mode=js&authResponse=b4fccba6d8ff1139cd80f0add54cd84b5a17d636"
/>
```

**Note:** The URL uses `http://` exactly as AvantLink specified. On the live HTTPS site,
the browser will block the script from executing (mixed content), but AvantLink's server-side
crawler only needs to find the tag in the HTML source — it does not need client-side execution.

## Application Details

| Field | Value |
|-------|-------|
| Application ID | 1563845 |
| Applied URL | https://admiralenergy.ai/ |
| authResponse | b4fccba6d8ff1139cd80f0add54cd84b5a17d636 |

## Verification URL

<https://classic.avantlink.com/affiliate_app_confirm.php?mode=verify-js&application_id=1563845>

## Why Homepage-Only

The `<script>` tag is in `src/app/page.tsx`, which is the Next.js App Router page for
the `/` route. It is NOT in `layout.tsx` (which applies to every page). This means the
script only loads when a visitor hits `https://admiralenergy.ai/`.

## Known Issue: authResponse Expired on AvantLink's Side

AvantLink's own confirmation endpoint returns **"Error: Unable to locate specified affiliate application"**
when we fetch the script URL directly. This means the `authResponse` token may have expired.

**To fix:** Request a new verification email from AvantLink (the verification page has a
"click here to trigger a new email" link), then update the `authResponse=` value in the
`<script>` tag in `src/app/page.tsx`.

Alternatively, contact `affiliateapps@avantlink.com` with:
- Application ID: 1563845
- Website URL: https://admiralenergy.ai/
- Screenshot of the script in the page source

## How to Remove

1. Open `src/app/page.tsx`.
2. Delete the `{/* TEMP: AvantLink ... */}` comment and the `<script ... />` block
   (approximately lines 8–15).
3. Delete this file (`docs/AVANTLINK_VERIFICATION.md`).
4. Commit and push to `main`:
   ```bash
   git add -A && git commit -m "chore: remove AvantLink verification script" && git push origin main
   ```
5. Netlify will auto-deploy. Verify the script is gone from the homepage.
