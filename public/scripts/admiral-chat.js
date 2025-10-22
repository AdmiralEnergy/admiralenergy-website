// public/scripts/admiral-chat.js
(function () {
  const GPT_URL = "https://chatgpt.com/g/g-68e9759437b8819199422ed61feba90b-the-admiral-your-solar-advisor";

  // Safe GTM push
  function pushEvent(name, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: name }, payload || {}));
    } catch (_) { /* noop */ }
  }

  // Create floating button
  function createFloatingButton() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Chat with The Admiral');
    btn.className = [
      "fixed", "bottom-5", "right-5", "z-50",
      "rounded-full", "shadow-lg", "ring-1", "ring-black/10",
      "bg-admiral-gold", "text-admiral-navy",
      "px-4", "py-3", "font-semibold", "hover:bg-yellow-400",
      "transition"
    ].join(' ');
    btn.innerHTML = "💬 Chat with The Admiral";
    btn.addEventListener('click', () => openPanel('floating'));
    document.body.appendChild(btn);
  }

  // Panel (simple, JS-rendered)
  let panel, overlay;
  function buildPanel() {
    overlay = document.createElement('div');
    overlay.className = "fixed inset-0 z-50 hidden";
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    // backdrop
    const backdrop = document.createElement('div');
    backdrop.className = "absolute inset-0 bg-black/40";
    backdrop.addEventListener('click', closePanel);

    // card
    panel = document.createElement('div');
    panel.className = [
      "absolute", "bottom-6", "right-6",
      "w-[360px]", "max-w-[92vw]",
      "bg-white", "rounded-xl", "shadow-2xl", "ring-1", "ring-black/10", "p-5"
    ].join(' ');

    panel.innerHTML = `
      <div class="flex items-start justify-between">
        <h3 class="text-lg font-bold text-admiral-navy">The Admiral — Your Solar & Backup Advisor</h3>
        <button type="button" aria-label="Close" class="ml-3 text-gray-500 hover:text-gray-700" id="admiralCloseBtn">✕</button>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Ask about PowerPair, batteries, backup runtime, interconnection timelines, or whether solar pencils out for your address.
      </p>
      <div class="mt-4 flex flex-col gap-2">
        <a id="admiralOpenLink" class="inline-flex items-center justify-center rounded-lg bg-admiral-gold text-admiral-navy px-4 py-2 font-semibold hover:bg-yellow-400 transition" target="_blank" rel="noopener">
          Open The Admiral
        </a>
        <a id="admiralPowerPairLink" class="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-50 transition" target="_blank" rel="noopener">
          PowerPair FAQ (in The Admiral)
        </a>
      </div>
      <p class="mt-3 text-[12px] text-gray-500">
        Opens in a new tab on chat.openai.com.
      </p>
    `;

    overlay.appendChild(backdrop);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    // wire buttons
    panel.querySelector('#admiralCloseBtn').addEventListener('click', closePanel);
    const open = panel.querySelector('#admiralOpenLink');
    const pp = panel.querySelector('#admiralPowerPairLink');
    open.href = GPT_URL;
    pp.href = GPT_URL;

    open.addEventListener('click', () => pushEvent('admiral_chat_open_link', { page: 'home', link: 'custom_gpt' }));
    pp.addEventListener('click', () => pushEvent('admiral_chat_open_link', { page: 'home', link: 'custom_gpt' }));
  }

  function openPanel(source) {
    pushEvent('admiral_chat_opened', { source: source || 'unknown', page: 'home' });
    overlay && overlay.classList.remove('hidden');
  }

  function closePanel() {
    overlay && overlay.classList.add('hidden');
  }

  // Enhance any inline triggers
  function wireInlineTriggers() {
    document.querySelectorAll('[data-admiral-chat]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        openPanel('inline');
      });
    });
  }

  // Replace placeholder in the FAQ/Chat section if present
  function enhanceInlinePlaceholder() {
    const host = document.getElementById('faq-or-chat');
    if (!host) return;
    const placeholder = host.querySelector('[data-admiral-placeholder]');
    if (!placeholder) return;
    placeholder.innerHTML = `
      <div class="flex flex-col items-center text-center">
        <p class="text-gray-600">Have a quick question? The Admiral can run the math or explain NC rules.</p>
        <div class="mt-4 flex flex-col sm:flex-row gap-3">
          <a href="${GPT_URL}" target="_blank" rel="noopener"
             class="rounded-lg bg-admiral-gold text-admiral-navy px-5 py-2 font-semibold hover:bg-yellow-400 transition"
             onclick="window.dataLayer && window.dataLayer.push({event:'admiral_chat_open_link', page:'home', link:'custom_gpt'})">
             Open The Admiral
          </a>
          <button type="button" data-admiral-chat
             class="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-800 hover:bg-gray-50 transition">
             Ask here (quick panel)
          </button>
        </div>
      </div>
    `;
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    buildPanel();
    createFloatingButton();
    wireInlineTriggers();
    enhanceInlinePlaceholder();
  });
})();