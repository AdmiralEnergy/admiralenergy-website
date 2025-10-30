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
    btn.className = "fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50 rounded-full shadow-lg ring-1 ring-black/10 bg-admiral-gold text-admiral-navy px-3 py-2 sm:px-4 sm:py-3 font-semibold text-sm sm:text-base hover:bg-yellow-400 transition";
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
    panel.className = "absolute bottom-0 sm:bottom-6 right-0 sm:right-6 w-full sm:w-[420px] sm:max-w-[95vw] h-[100dvh] sm:h-auto sm:max-h-[90vh] bg-white sm:rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden";
    panel.innerHTML = `
      <!-- Header with Avatar -->
      <div class="flex items-center gap-3 px-4 pt-4 pb-3 bg-gradient-to-r from-admiral-navy to-blue-900 text-white flex-shrink-0">
        <div id="admiralAvatar" class="w-12 h-12 rounded-full bg-admiral-gold flex items-center justify-center text-2xl font-bold text-admiral-navy flex-shrink-0">
          ⚓
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold">The Admiral</h3>
          <p class="text-xs text-blue-200">NC Solar & Backup Power Advisor</p>
        </div>
        <button type="button" aria-label="Close" class="text-white/70 hover:text-white text-2xl leading-none transition-colors" id="admiralCloseBtn">×</button>
      </div>
      
      <!-- Chat Messages -->
      <div id="admiralLog" class="flex-1 min-h-0 px-4 py-4 overflow-y-auto overflow-x-hidden space-y-3 bg-gray-50 scroll-smooth"></div>
      
      <!-- Suggested Prompts -->
      <div id="admiralSuggestions" class="px-4 py-2 flex flex-wrap gap-2 bg-white border-t border-gray-100 flex-shrink-0"></div>
      
      <!-- Input Area -->
      <div class="p-3 bg-white border-t border-gray-200 flex-shrink-0">
        <form id="admiralForm" class="flex items-end gap-2">
          <div class="flex-1 relative">
            <textarea 
              id="admiralInput" 
              rows="1" 
              placeholder="Message The Admiral..." 
              class="w-full rounded-2xl border border-gray-300 px-4 py-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none overflow-hidden transition-all"
              style="max-height: 120px;"
            ></textarea>
            <div class="absolute right-2 bottom-3 text-xs text-gray-400">⏎</div>
          </div>
          <button 
            id="admiralSend" 
            type="submit" 
            class="rounded-full bg-blue-600 text-white font-semibold w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            title="Send message"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
            </svg>
          </button>
        </form>
        <div class="text-xs text-gray-400 mt-2 text-center">Press Enter to send • Shift+Enter for new line</div>
      </div>
    `;

    overlay.appendChild(backdrop);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    logEl = panel.querySelector('#admiralLog');
    inputEl = panel.querySelector('#admiralInput');
    const suggestionsEl = panel.querySelector('#admiralSuggestions');
    const sendBtn = panel.querySelector('#admiralSend');
    panel.querySelector('#admiralCloseBtn').addEventListener('click', closePanel);
    panel.querySelector('#admiralForm').addEventListener('submit', onSubmit);

    // Auto-resize textarea as user types
    inputEl.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 120) + 'px';
      // Enable/disable send button
      sendBtn.disabled = !this.value.trim();
    });

    // Enter to send, Shift+Enter for new line
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (this.value.trim()) {
          panel.querySelector('#admiralForm').requestSubmit();
        }
      }
    });

    // ESC key to close chat
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && overlay && !overlay.classList.contains('hidden')) {
        closePanel();
      }
    });

    // Initial button state
    sendBtn.disabled = true;

    // Clear chat history on page load - fresh start each visit
    localStorage.removeItem(THREAD_KEY);
    
    // Always show welcome message (fresh session)
    appendWelcomeMessage();
    showSuggestedPrompts(suggestionsEl);
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
    
    // Clear suggested prompts if visible
    const suggestionsEl = document.querySelector('#admiralSuggestions');
    if (suggestionsEl) suggestionsEl.innerHTML = '';
    
    appendMessage('user', text);
    inputEl.value = "";
    inputEl.style.height = 'auto'; // Reset textarea height
    const sendBtn = document.querySelector('#admiralSend');
    if (sendBtn) sendBtn.disabled = true; // Disable send button
    scrollLog();
    pushEvent('chat_message_sent', { page: window.location.pathname });

    // Show typing indicator
    const typingId = showTypingIndicator();

    const reply = await askTheAdmiral(text);
    
    // Remove typing indicator
    removeTypingIndicator(typingId);
    
    // Check if bot wants to show contact buttons
    if (reply && reply.includes('SHOW_CONTACT_BUTTONS')) {
      showContactButtons();
      return; // Don't append the trigger message
    }
    
    // Check if bot wants to show lead form
    if (reply && reply.includes('SHOW_LEAD_FORM')) {
      showLeadCaptureForm();
      return; // Don't append the trigger message
    }
    
    appendMessage('assistant', reply || "…");
    scrollLog();
    pushEvent('admiral_chat_reply_received', { page: window.location.pathname });
  }

  function appendMessage(role, content) {
    if (!logEl) return;
    const wrap = document.createElement('div');
    const me = role === 'user';
    wrap.className = me ? "flex justify-end items-end gap-2" : "flex justify-start items-end gap-2";
    
    // Add avatar for assistant messages
    if (!me) {
      const avatar = document.createElement('div');
      avatar.className = "w-8 h-8 rounded-full bg-admiral-gold flex items-center justify-center text-sm font-bold text-admiral-navy flex-shrink-0";
      avatar.textContent = "⚓";
      wrap.appendChild(avatar);
    }
    
    const bubble = document.createElement('div');
    bubble.className = me 
      ? "max-w-[75%] rounded-2xl rounded-br-md bg-blue-600 text-white px-4 py-2.5 shadow-sm" 
      : "max-w-[75%] rounded-2xl rounded-bl-md bg-white text-gray-800 px-4 py-2.5 shadow-sm border border-gray-200";
    
    // Preserve line breaks and format text with proper overflow handling
    bubble.style.whiteSpace = 'pre-wrap';
    bubble.style.wordBreak = 'break-word';
    bubble.style.overflowWrap = 'break-word';
    bubble.textContent = content;
    
    wrap.appendChild(bubble); 
    logEl.appendChild(wrap);

    const thread = loadThread(); thread.push({ role, content }); saveThread(thread);
  }

  function scrollLog(){ try { logEl.scrollTop = logEl.scrollHeight; } catch {} }

  function showTypingIndicator() {
    if (!logEl) return null;
    const id = 'typing-' + Date.now();
    const wrap = document.createElement('div');
    wrap.id = id;
    wrap.className = "flex justify-start items-end gap-2";
    
    // Add avatar
    const avatar = document.createElement('div');
    avatar.className = "w-8 h-8 rounded-full bg-admiral-gold flex items-center justify-center text-sm font-bold text-admiral-navy flex-shrink-0";
    avatar.textContent = "⚓";
    wrap.appendChild(avatar);
    
    const bubble = document.createElement('div');
    bubble.className = "rounded-2xl rounded-bl-md bg-white text-gray-800 px-4 py-3 shadow-sm border border-gray-200";
    bubble.innerHTML = '<div class="flex gap-1.5"><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></span><span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></span></div>';
    wrap.appendChild(bubble);
    logEl.appendChild(wrap);
    scrollLog();
    return id;
  }

  function removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function appendWelcomeMessage() {
    if (!logEl) return;
    const wrap = document.createElement('div');
    wrap.className = "flex justify-start items-end gap-2";
    
    // Add avatar
    const avatar = document.createElement('div');
    avatar.className = "w-8 h-8 rounded-full bg-admiral-gold flex items-center justify-center text-sm font-bold text-admiral-navy flex-shrink-0";
    avatar.textContent = "⚓";
    wrap.appendChild(avatar);
    
    const bubble = document.createElement('div');
    bubble.className = "max-w-[85%] rounded-2xl rounded-bl-md bg-white text-gray-800 px-4 py-3 shadow-sm border border-gray-200 text-sm leading-relaxed";
    bubble.innerHTML = `
      <div class="font-bold text-admiral-navy mb-2">👋 Welcome! I'm The Admiral</div>
      <div class="text-gray-700 mb-3">I'm here to help NC homeowners with honest, math-first guidance on:</div>
      <ul class="space-y-1.5 text-sm text-gray-600">
        <li class="flex items-start"><span class="text-blue-600 mr-2">•</span><span>Battery backup systems (Duke PowerPair)</span></li>
        <li class="flex items-start"><span class="text-blue-600 mr-2">•</span><span>Solar ROI calculations</span></li>
        <li class="flex items-start"><span class="text-blue-600 mr-2">•</span><span>Outage coverage planning</span></li>
        <li class="flex items-start"><span class="text-blue-600 mr-2">•</span><span>Duke Energy programs & timelines</span></li>
      </ul>
      <div class="mt-3 text-xs text-gray-500 italic">No pressure, just honest advice 💡</div>
    `;
    wrap.appendChild(bubble);
    logEl.appendChild(wrap);
  }

  function showSuggestedPrompts(container) {
    if (!container) return;
    const prompts = [
      "How much does PowerPair cost?",
      "Will solar save me money?",
      "What can a battery backup power?",
      "How long does Duke interconnection take?"
    ];
    
    prompts.forEach(prompt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = "text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full transition-colors";
      btn.textContent = prompt;
      btn.addEventListener('click', () => {
        inputEl.value = prompt;
        container.innerHTML = ''; // Clear suggestions after click
        inputEl.focus();
        // Trigger input event to enable send button
        inputEl.dispatchEvent(new Event('input', { bubbles: true }));
      });
      container.appendChild(btn);
    });
  }

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

  function showContactButtons() {
    // Create message with Yes/No buttons
    const buttonWrap = document.createElement('div');
    buttonWrap.className = "flex gap-2 items-start mx-4 my-3";
    
    // Add avatar
    const avatar = document.createElement('div');
    avatar.className = "w-8 h-8 rounded-full bg-admiral-gold flex items-center justify-center text-sm font-bold text-admiral-navy flex-shrink-0";
    avatar.textContent = "⚓";
    buttonWrap.appendChild(avatar);
    
    // Create button container
    const contentWrap = document.createElement('div');
    contentWrap.className = "flex-1";
    
    // Add message
    const message = document.createElement('div');
    message.className = "max-w-[75%] rounded-2xl rounded-bl-md bg-white text-gray-800 px-4 py-2.5 shadow-sm border border-gray-200 mb-2";
    message.textContent = "Would you like one of our energy experts to run the exact numbers for your home?";
    contentWrap.appendChild(message);
    
    // Add buttons
    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = "flex gap-2";
    
    const yesBtn = document.createElement('button');
    yesBtn.type = 'button';
    yesBtn.className = "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors text-sm";
    yesBtn.textContent = "Yes, please!";
    yesBtn.addEventListener('click', () => {
      // Remove buttons
      buttonWrap.remove();
      // Show user's response
      appendMessage('user', 'Yes, please!');
      scrollLog();
      // Show the lead form
      showLeadCaptureForm();
    });
    
    const noBtn = document.createElement('button');
    noBtn.type = 'button';
    noBtn.className = "bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-2 rounded-lg transition-colors text-sm";
    noBtn.textContent = "Not right now";
    noBtn.addEventListener('click', () => {
      // Remove buttons
      buttonWrap.remove();
      // Show user's response
      appendMessage('user', 'Not right now');
      scrollLog();
      // Show polite response
      appendMessage('assistant', "No problem! Feel free to keep exploring or ask me anything else. I'm here whenever you're ready.");
      scrollLog();
    });
    
    buttonsDiv.appendChild(yesBtn);
    buttonsDiv.appendChild(noBtn);
    contentWrap.appendChild(buttonsDiv);
    
    buttonWrap.appendChild(contentWrap);
    logEl.appendChild(buttonWrap);
    scrollLog();
  }

  function showLeadCaptureForm() {
    // Create form container
    const formWrap = document.createElement('div');
    formWrap.className = "mx-4 my-3 p-4 bg-white rounded-2xl border-2 border-blue-200 shadow-sm";
    formWrap.innerHTML = `
      <div class="flex items-start gap-3 mb-3">
        <div class="w-8 h-8 rounded-full bg-admiral-gold flex items-center justify-center text-sm font-bold text-admiral-navy flex-shrink-0">⚓</div>
        <div class="flex-1 text-sm text-gray-700">
          <p class="font-semibold text-gray-900 mb-1">Great! Let's get you a custom analysis.</p>
          <p class="text-xs text-gray-600">Our team will reach out within 24 hours.</p>
        </div>
      </div>
      <form id="chatLeadForm" name="chat-lead-capture" method="POST" data-netlify="true" class="space-y-3">
        <input type="hidden" name="form-name" value="chat-lead-capture" />
        <input type="hidden" name="source" value="Admiral Chat Widget" />
        <input type="hidden" name="page" id="chatLeadPage" />
        <input type="hidden" name="context" id="chatLeadContext" />
        <div>
          <input 
            type="text" 
            name="name" 
            placeholder="Your Name *" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <input 
            type="email" 
            name="email" 
            placeholder="Email Address *" 
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <div>
          <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number (optional)" 
            class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>
        <button 
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm"
        >
          Get My Custom Analysis
        </button>
        <p class="text-xs text-gray-500 text-center">No pressure, no spam—just honest advice.</p>
      </form>
    `;
    
    logEl.appendChild(formWrap);
    scrollLog();
    
    // Set hidden field values
    const pageField = formWrap.querySelector('#chatLeadPage');
    const contextField = formWrap.querySelector('#chatLeadContext');
    if (pageField) pageField.value = window.location.pathname;
    if (contextField) contextField.value = getChatContext();
    
    // Handle form submission
    const form = formWrap.querySelector('#chatLeadForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get user name for success message
      const userName = form.querySelector('input[name="name"]').value;
      
      // Disable form while submitting
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      
      try {
        // Submit to Netlify Forms
        const formData = new FormData(form);
        const res = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData).toString()
        });
        
        if (res.ok) {
          // Track lead in GA4
          pushEvent('generate_lead', {
            source: 'admiral_chat',
            lead_type: 'chat_contact_form',
            page: window.location.pathname
          });
          
          // Show success message
          formWrap.innerHTML = `
            <div class="flex items-start gap-3">
              <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-lg flex-shrink-0">✓</div>
              <div class="flex-1 text-sm">
                <p class="font-semibold text-gray-900 mb-1">Got it, ${userName}!</p>
                <p class="text-gray-600 text-xs">Check your email for next steps. Our team will be in touch within 24 hours.</p>
              </div>
            </div>
          `;
          scrollLog();
          
          // Add a friendly follow-up message after delay
          setTimeout(() => {
            appendMessage('assistant', "Anything else I can help you with while you're here?");
            scrollLog();
          }, 1500);
          
        } else {
          throw new Error('Failed to submit form');
        }
      } catch (error) {
        console.error('Lead capture error:', error);
        submitBtn.disabled = false;
        submitBtn.textContent = 'Get My Custom Analysis';
        alert('Oops! Something went wrong. Please try again or email us directly at contact@admiralenergy.ai');
      }
    });
  }
  
  function getChatContext() {
    // Get recent conversation context for lead
    const thread = loadThread();
    const recentMessages = thread.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    return recentMessages || 'User requested consultation from chat';
  }

  function openPanel(source){ 
    pushEvent('chat_opened', { source: source||'unknown', page: window.location.pathname }); 
    if (overlay) {
      overlay.classList.remove('hidden'); 
      setTimeout(scrollLog, 50); 
      if (inputEl) inputEl.focus();
    }
  }
  
  function closePanel(){ 
    if (overlay) {
      overlay.classList.add('hidden');
      pushEvent('chat_closed', { page: window.location.pathname });
    }
  }

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