# Admiral Energy Website — Current Status (2025-10-22)

## Snapshot
- Repo: `admiralenergy-website`
- Deployment: Netlify (admiralenergy.netlify.app)
- Branch: `main`

## Verified Today (Actual State)
✅ Static HTML site (8+ pages)
✅ Tailwind via CDN + custom `styles.css`
✅ Google Tag Manager: `GTM-N6HRP34Z` added across pages
✅ Netlify Forms present (contact flow)
✅ Content updates: battery vs generator comparison made more balanced/accurate
✅ CSS pass: rewrites/cleanups applied
✅ Thank-you page fix (contact-success / thank-you)
❌ **No Netlify Functions directory**
❌ **No OpenAI integration**
❌ **No chatbot UI script**
❌ **No `.env` file**
❌ **No assistant/Responses API usage**
(Only a commented placeholder in `netlify.toml` references functions.)

## What Changed Today
- Installed GTM across pages
- Fixed broken emojis
- Rewrote/organized CSS
- Adjusted copy to be "math-first, no pitch"
- Confirmed there is *no* chatbot code in the repo

## Risks / Gotchas
- If we deploy "chat" UI that opens a new tab to chat.openai.com, it's not embedded; it's just a link.
- Without a function, any on-page chat will leak your OpenAI key if done client-side (don't do that).

## Decision
If we want a real **embedded** Admiral chatbot, add:
- `netlify/functions/admiral-chat.js` (serverless relay to OpenAI)
- `public/scripts/admiral-chat-ui.js` (floating launcher + panel)
- `.env` (OPENAI_API_KEY, ADMIRAL_SYSTEM_PROMPT)
- Script tag in `index.html` to load the UI

## Next Steps
1. Run the "Chatbot From Scratch" Copilot prompt (see handoff below).
2. Create `.env` locally with your OpenAI key.
3. `netlify dev` → confirm function replies.
4. Commit → push → Netlify autodeploy.
