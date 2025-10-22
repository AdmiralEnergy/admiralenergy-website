// public/scripts/admiral-chat-ui.js
(function () {
  const ADMIRAL_DEBUG = (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  const FN_URL = "/.netlify/functions/admiral-chat";

  // Feature flag via meta
  const meta = document.querySelector('meta[name="admiral-chat-enabled"]');
  const CHAT_ENABLED = (meta ? (meta.getAttribute('content') || 'true') : 'true') !== 'false';

  if (!CHAT_ENABLED) return;

  function pushEvent(name, payload) {
    try { window.dataLayer = window.dataLayer || []; window.dataLayer.push(Object.assign({ event: name }, payload || {})); } catch (_) {}
  }

  // Thread state
  const THREAD_KEY = "admiral_chat_thread_v1";
  const loadThread = () => { try { return JSON.parse(localStorage.getItem(THREAD_KEY) || "[]"); } catch { return []; } };
  const saveThread = (arr) => { try { localStorage.setItem(THREAD_KEY, JSON.stringify(arr.slice(-20))); } catch {} };

  let overlay, panel, logEl, inputEl;

  function buildFloatingButton() {
    if (document.getElementById('admiralFloatBtn')) return; // idempotent
    const btn = document.createElement('button');
    btn.id = 'admiralFloatBtn';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Chat with The Admiral');
    btn.className = "fixed bottom-5 right-5 z-50 rounded-full shadow-lg ring-1 ring-black/10 bg-admiral-gold text-admiral-navy px-4 py-3 font-semibold hover:bg-yellow-400 transition";
    btn.textContent = "💬 Chat with The Admiral";
    btn.addEventListener('click', () => openPanel('floating'));
    document.body.appendChild(btn);
  }

  function buildPanel() {
    if (document.getElementById('admiralOverlay')) return; // idempotent
    overlay = document.createElement('div');
    overlay.id = 'admiralOverlay';
    overlay.className = "fixed inset-0 z-50 hidden";
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const backdrop = document.createElement('div');
    backdrop.className = "absolute inset-0 bg-black/40";
    backdrop.addEventListener('click', closePanel);

    panel = document.createElement('div');
    panel.className = "absolute bottom-6 right-6 w-[420px] max-w-[95vw] bg-white rounded-xl shadow-2xl ring-1 ring-black/10 flex flex-col";
    panel.innerHTML = `
      <div class="flex items-center justify-between px-4 pt-4">
        <h3 class="text-base font-bold text-admiral-navy">The Admiral — NC Solar & Backup Advisor</h3>
        <button type="button" aria-label="Close" class="text-gray-500 hover:text-gray-700" id="admiralCloseBtn">✕</button>
      </div>
      <div class="px-4 text-xs text-gray-500">Ask about PowerPair, battery sizing, outage coverage, interconnection steps, or ROI math.</div>
      <div id="admiralLog" class="mt-3 px-4 h-[320px] overflow-y-auto space-y-3"></div>
      <div class="p-4 border-t border-gray-200">
        <form id="admiralForm" class="flex items-end gap-2">
          <textarea id="admiralInput" rows="2" placeholder="Type your question…" class="flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-admiral-gold/30"></textarea>
          <button id="admiralSend" type="submit" class="rounded-lg bg-admiral-gold text-admiral-navy font-semibold px-4 py-2 hover:bg-yellow-400 transition">Send</button>
        </form>
      </div>
    `;

    overlay.appendChild(backdrop);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    logEl = panel.querySelector('#admiralLog');
    inputEl = panel.querySelector('#admiralInput');
    panel.querySelector('#admiralCloseBtn').addEventListener('click', closePanel);
    panel.querySelector('#admiralForm').addEventListener('submit', onSubmit);

    // Hydrate previous thread
    for (const m of loadThread()) appendMessage(m.role, m.content);
    scrollLog();

    // Delegated inline opener
    document.addEventListener('click', (e) => {
      const t = e.target && e.target.closest && e.target.closest('[data-admiral-chat]');
      if (t) { e.preventDefault(); openPanel('inline'); }
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const text = (inputEl.value || "").trim();
    if (!text) return;
    appendMessage('user', text);
    inputEl.value = "";
    scrollLog();
    pushEvent('admiral_chat_message_sent', { page: 'home' });

    const reply = await askTheAdmiral(text);
    appendMessage('assistant', reply || "…");
    scrollLog();
    pushEvent('admiral_chat_reply_received', { page: 'home' });
  }

  function appendMessage(role, content) {
    if (!logEl) return;
    const wrap = document.createElement('div');
    const me = role === 'user';
    wrap.className = me ? "flex justify-end" : "flex justify-start";
    const bubble = document.createElement('div');
    bubble.className = me ? "max-w-[85%] rounded-lg bg-admiral-navy text-white px-3 py-2"
                          : "max-w-[85%] rounded-lg bg-gray-100 text-gray-800 px-3 py-2";
    bubble.textContent = content;
    wrap.appendChild(bubble); logEl.appendChild(wrap);

    const thread = loadThread(); thread.push({ role, content }); saveThread(thread);
  }

  function scrollLog(){ try { logEl.scrollTop = logEl.scrollHeight; } catch {} }

  async function askTheAdmiral(userText) {
    const history = loadThread().filter(m => m.role === 'user' || m.role === 'assistant');
    const messages = [...history.slice(-8), { role: 'user', content: userText }];
    try {
      const res = await fetch(FN_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages }) });
      if (!res.ok) {
        const txt = await res.text();
        console.error('Function error', txt);
        return ADMIRAL_DEBUG
          ? `Function error (${res.status}): ${txt}`
          : "I hit a server hiccup. Try again in a moment.";
      }
      const data = await res.json();
      return data.reply || "…";
    } catch (e) { console.error(e); return "Network issue—try again."; }
  }

  function openPanel(source){ pushEvent('admiral_chat_opened', { source: source||'unknown', page:'home' }); overlay && overlay.classList.remove('hidden'); setTimeout(scrollLog, 50); inputEl && inputEl.focus(); }
  function closePanel(){ overlay && overlay.classList.add('hidden'); }

  function enhanceInlinePlaceholder() {
    const host = document.getElementById('faq-or-chat');
    if (!host) return;
    const ph = host.querySelector('[data-admiral-placeholder]');
    if (!ph) return;
    // Replace inner content only (keep container styles)
    ph.innerHTML = `
      <div class="flex flex-col items-center text-center">
        <p class="text-gray-600">Have a quick question? Ask The Admiral right here.</p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <button type="button" data-admiral-chat
                  class="rounded-lg bg-admiral-gold text-admiral-navy px-5 py-2 font-semibold hover:bg-yellow-400 transition">
            Open Chat Panel
          </button>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildFloatingButton();
    buildPanel();
    enhanceInlinePlaceholder();
  });
})();