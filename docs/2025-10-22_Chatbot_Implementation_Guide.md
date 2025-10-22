# Chatbot Integration — Complete Implementation Guide

## Goal
Add an embedded "The Admiral" chatbot end-to-end using Netlify Functions (keeps the OpenAI key server-side) and a minimal front-end chat panel. Do not break layout. Keep changes additive and idempotent.

---

## A. Backend — Netlify Function (OpenAI relay)

### 1. Create folder structure
```bash
mkdir netlify/functions
```

### 2. Create `netlify/functions/admiral-chat.js`

```javascript
// netlify/functions/admiral-chat.js
exports.handler = async (event) => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: cors(), body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: cors(), body: 'Method Not Allowed' };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const systemPrompt =
      process.env.ADMIRAL_SYSTEM_PROMPT ||
      "You are The Admiral — an NC-focused solar & battery backup advisor. Be math-first, battery-first; reference Duke PowerPair and interconnection realities. Avoid hard pricing unless user provides usage/bill. Tone: calm, clear, non-pushy.";

    if (!apiKey) {
      return json(500, { error: 'Missing OPENAI_API_KEY' });
    }

    const { messages } = JSON.parse(event.body || '{}');
    if (!Array.isArray(messages) || messages.length === 0) {
      return json(400, { error: 'messages[] required' });
    }

    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "system", content: systemPrompt }, ...messages].slice(-24)
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const detail = await res.text();
      return json(res.status, { error: 'OpenAI error', status: res.status, detail });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || null;
    return json(200, { reply, usage });
  } catch (err) {
    return json(500, { error: 'Server error', detail: String(err?.message || err) });
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}

function json(status, body) {
  return { 
    statusCode: status, 
    headers: { ...cors(), "Content-Type": "application/json" }, 
    body: JSON.stringify(body) 
  };
}
```

### 3. Update `netlify.toml`

Add this section after the `[build.environment]` block:

```toml
[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

---

## B. Frontend — Chat UI (floating button + panel)

### Create `public/scripts/admiral-chat-ui.js`

```javascript
// public/scripts/admiral-chat-ui.js
(function () {
  const FN_URL = "/.netlify/functions/admiral-chat";
  const DEBUG = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

  function pushEvent(name, payload) {
    try { 
      window.dataLayer = window.dataLayer || []; 
      window.dataLayer.push({ event: name, ...(payload||{}) }); 
    } catch {}
  }

  const KEY = "admiral_chat_thread_v1";
  const load = () => { 
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } 
    catch { return []; } 
  };
  const save = (arr) => { 
    try { localStorage.setItem(KEY, JSON.stringify(arr.slice(-20))); } 
    catch {} 
  };

  let overlay, logEl, inputEl;

  function boot() {
    button(); 
    panel(); 
    enhanceInline();
  }

  function button() {
    if (document.getElementById('admiralFloatBtn')) return;
    const b = document.createElement('button');
    b.id = 'admiralFloatBtn';
    b.type = 'button';
    b.className = "fixed bottom-5 right-5 z-50 rounded-full shadow-lg ring-1 ring-black/10 bg-admiral-gold text-admiral-navy px-4 py-3 font-semibold hover:bg-yellow-400 transition";
    b.textContent = "💬 Chat with The Admiral";
    b.addEventListener('click', () => open('floating'));
    document.body.appendChild(b);
  }

  function panel() {
    if (document.getElementById('admiralOverlay')) return;
    overlay = document.createElement('div');
    overlay.id = 'admiralOverlay';
    overlay.className = "fixed inset-0 z-50 hidden";
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = "absolute inset-0 bg-black/40";
    backdrop.addEventListener('click', close);

    const card = document.createElement('div');
    card.className = "absolute bottom-6 right-6 w-[420px] max-w-[95vw] bg-white rounded-xl shadow-2xl ring-1 ring-black/10 flex flex-col";

    card.innerHTML = \`
      <div class="flex items-center justify-between px-4 pt-4">
        <h3 class="text-base font-bold text-admiral-navy">The Admiral — NC Solar & Backup Advisor</h3>
        <button type="button" aria-label="Close" class="text-gray-500 hover:text-gray-700" id="admiralCloseBtn">✕</button>
      </div>
      <div class="px-4 text-xs text-gray-500">Ask about PowerPair, battery sizing, outage coverage, or if solar pencils out for your usage.</div>
      <div id="admiralLog" class="mt-3 px-4 h-[320px] overflow-y-auto space-y-3"></div>
      <div class="p-4 border-t border-gray-200">
        <form id="admiralForm" class="flex items-end gap-2">
          <textarea id="admiralInput" rows="2" placeholder="Type your question…" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-admiral-gold/30"></textarea>
          <button id="admiralSend" type="submit" class="rounded-lg bg-admiral-gold text-admiral-navy font-semibold px-4 py-2 hover:bg-yellow-400 transition">Send</button>
        </form>
      </div>
    \`;

    overlay.append(backdrop, card); 
    document.body.appendChild(overlay);

    logEl = card.querySelector('#admiralLog'); 
    inputEl = card.querySelector('#admiralInput');
    card.querySelector('#admiralCloseBtn').addEventListener('click', close);
    card.querySelector('#admiralForm').addEventListener('submit', submit);

    // Hydrate from localStorage
    for (const m of load()) append(m.role, m.content);
    scroll();

    // Delegated inline openers
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest && e.target.closest('[data-admiral-chat]');
      if (t) { e.preventDefault(); open('inline'); }
    });
  }

  function enhanceInline() {
    const host = document.getElementById('faq-or-chat');
    const ph = host && host.querySelector('[data-admiral-placeholder]');
    if (!ph) return;
    ph.innerHTML = \`
      <div class="flex flex-col items-center text-center">
        <p class="text-gray-600">Have a quick question? Ask The Admiral right here.</p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <button type="button" data-admiral-chat
                  class="rounded-lg bg-admiral-gold text-admiral-navy px-5 py-2 font-semibold hover:bg-yellow-400 transition">
            Open Chat Panel
          </button>
        </div>
      </div>
    \`;
  }

  async function submit(e) {
    e.preventDefault();
    const text = (inputEl.value || "").trim();
    if (!text) return;
    append('user', text); 
    inputEl.value = ""; 
    scroll();
    pushEvent('admiral_chat_message_sent', { page: 'home' });

    const reply = await ask(text);
    append('assistant', reply || "…"); 
    scroll();
    pushEvent('admiral_chat_reply_received', { page: 'home' });
  }

  async function ask(userText) {
    const history = load().filter(m => m.role === 'user' || m.role === 'assistant');
    const messages = [...history.slice(-8), { role: 'user', content: userText }];
    try {
      const res = await fetch(FN_URL, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ messages }) 
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Function error', txt);
        return DEBUG ? \`Function error (\${res.status}): \${txt}\` : "I hit a server hiccup. Try again in a moment.";
      }
      const data = await res.json();
      return data.reply || "…";
    } catch (e) {
      console.error(e);
      return DEBUG ? \`Network error: \${String(e)}\` : "Network issue—try again.";
    }
  }

  function append(role, content) {
    const wrap = document.createElement('div');
    const me = role === 'user';
    wrap.className = me ? "flex justify-end" : "flex justify-start";
    const b = document.createElement('div');
    b.className = me ? "max-w-[85%] rounded-lg bg-admiral-navy text-white px-3 py-2"
                     : "max-w-[85%] rounded-lg bg-gray-100 text-gray-800 px-3 py-2";
    b.textContent = content;
    wrap.appendChild(b); 
    logEl.appendChild(wrap);

    const thread = load(); 
    thread.push({ role, content }); 
    save(thread);
  }

  function scroll(){ 
    try { logEl.scrollTop = logEl.scrollHeight; } 
    catch {} 
  }
  
  function open(source){ 
    pushEvent('admiral_chat_opened', { source: source||'unknown', page:'home' }); 
    overlay.classList.remove('hidden'); 
    setTimeout(scroll, 50); 
    inputEl && inputEl.focus(); 
  }
  
  function close(){ 
    overlay.classList.add('hidden'); 
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
```

---

## C. Wire it into the homepage

### Update `index.html`

1. **Add script tag before `</body>`:**

```html
<!-- Admiral Chatbot -->
<script defer src="/public/scripts/admiral-chat-ui.js"></script>
</body>
```

2. **Optional: Add kill switch in `<head>`:**

```html
<meta name="admiral-chat-enabled" content="true">
```

3. **Ensure FAQ section has placeholder:**

Make sure there's an element with `data-admiral-placeholder` where the chat button will be injected.

---

## D. Environment & Local Run

### 1. Create `.env` at repo root

```env
OPENAI_API_KEY=sk-REPLACE_WITH_YOUR_KEY
ADMIRAL_SYSTEM_PROMPT=You are The Admiral — an NC-focused solar & battery backup advisor. Battery-first. Math-first. No hard pricing without usage/bill.
```

### 2. Ensure `.gitignore` contains `.env`

```
.env
```

### 3. Start local server

```bash
netlify dev
```

Open http://localhost:8888

### 4. Test function directly (PowerShell)

```powershell
$body = @{ messages = @(@{ role="user"; content="Reply with only: Hello." }) } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8888/.netlify/functions/admiral-chat" -Method POST -ContentType "application/json" -Body $body
```

---

## E. Verification Checklist

- [ ] Page shows gold "💬 Chat with The Admiral" button
- [ ] "Quick Questions?" card shows "Open Chat Panel"; clicking opens modal
- [ ] Send "How does PowerPair affect battery sizing?" → see reply in panel
- [ ] Console: `dataLayer.slice(-3)` shows:
  - `admiral_chat_opened`
  - `admiral_chat_message_sent`
  - `admiral_chat_reply_received`

---

## F. Deployment

```bash
git add .
git commit -m "feat: add embedded Admiral chatbot with Netlify Function"
git push origin main
```

Netlify will auto-deploy. Make sure to add environment variables in Netlify dashboard:
- `OPENAI_API_KEY`
- `ADMIRAL_SYSTEM_PROMPT`

---

## Files Changed/Created

**New files:**
- `netlify/functions/admiral-chat.js`
- `public/scripts/admiral-chat-ui.js`
- `docs/2025-10-22_AdmiralEnergy_Status.md` (this file)
- `.env` (local only, not committed)

**Modified files:**
- `netlify.toml` (added `[functions]` section)
- `index.html` (added script tag for UI)
- `.gitignore` (ensure `.env` is excluded)
