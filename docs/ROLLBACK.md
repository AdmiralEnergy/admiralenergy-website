# Rollback Guide — Admiral Energy Website

> **Purpose:** Restore the old static HTML production site in under 5 minutes.

## Snapshot References

| Ref | Type | Commit | Description |
|-----|------|--------|-------------|
| `old-site-v1` | Tag (annotated) | `5a395f9` | Frozen snapshot of last production deploy |
| `production-legacy-v1` | Branch | `5a395f9` | Same commit, deployable branch |

Both point to the same commit: the static HTML site that was live on Netlify
before the Next.js "Portable Autonomy" rebrand.

---

## Emergency 3-Step Rollback

**Time estimate:** < 5 minutes (mostly waiting for Netlify build).

### Step 1 — Reset `main` to the old site

```bash
git checkout main
git reset --hard old-site-v1      # or: git reset --hard production-legacy-v1
git push --force-with-lease origin main
```

### Step 2 — Verify Netlify redeploys

1. Open [Netlify Dashboard → Deploys](https://app.netlify.com)
2. Confirm a new deploy starts automatically from `main`.
3. Wait for "Published" status (≈ 30–60 s for the static site).

### Step 3 — Smoke-test production

- Visit `https://admiralenergy.ai` — should show old homepage.
- Visit `https://admiralenergy.ai/services.html` — should load.
- Visit `https://admiralenergy.ai/quote.html` — should load.

---

## Alternative: Deploy Legacy Branch Directly

If you don't want to touch `main`, you can point Netlify at the legacy branch:

1. Netlify → Site Settings → Build & Deploy → Branch to deploy
2. Change from `main` to `production-legacy-v1`
3. Trigger deploy

To revert this, change the branch back to `main`.

---

## Restoring the New Site After Rollback

```bash
git checkout main
git reset --hard feature/portable-autonomy-rebrand
git push --force-with-lease origin main
```

Then verify Netlify redeploys the Next.js site.

---

## Notes

- The tag `old-site-v1` is immutable — it cannot be accidentally moved.
- The branch `production-legacy-v1` is a safety net; do not push new commits to it.
- No old-site code was deleted; the `_archive-static/` folder also contains the original HTML files.
