# Admiral Energy Website - Technical Architecture

**Last Updated:** October 30, 2025  
**Version:** 2.1.0  
**Status:** Production Ready

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [Analytics & Tracking](#analytics--tracking)
7. [Security & Performance](#security--performance)
8. [Deployment](#deployment)

---

## System Overview

### Technology Stack
```
Frontend:
- HTML5 + Tailwind CSS (CDN)
- Vanilla JavaScript (ES6+, IIFE pattern)
- No build process required

Backend:
- Netlify Serverless Functions (Node.js)
- OpenAI GPT-4o-mini API
- Twilio Verify API

Hosting:
- Netlify (Static hosting + Functions)
- Git-based deployment from GitHub

Analytics:
- Google Tag Manager (GTM-N6HRP34Z)
- Google Analytics 4 (G-RX78MRB03L)
```

### Core Features
1. **Marketing Website** - 6 pages (Home, About, Services, PowerPair, Case Studies, Quote)
2. **AI Chat Widget** - OpenAI-powered solar/battery advisor with lead capture
3. **Quote Form** - SMS verification via Twilio + Netlify Forms
4. **Analytics** - Comprehensive event tracking via GTM/GA4

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   HTML Pages │  │  Chat Widget │  │  GTM/GA4 Tracking    │  │
│  │  (Tailwind)  │  │   (IIFE JS)  │  │   (dataLayer)        │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────────┘  │
└─────────┼──────────────────┼─────────────────────────────────────┘
          │                  │
          │                  │ WebSocket-like fetch calls
          │                  │
┌─────────▼──────────────────▼─────────────────────────────────────┐
│                      NETLIFY PLATFORM                             │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Static Hosting                           │  │
│  │  - HTML/CSS/JS files                                       │  │
│  │  - CDN distribution                                        │  │
│  │  - HTTPS enforced                                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  Netlify Functions (Serverless)            │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐ │  │
│  │  │admiral-chat  │  │  send-otp    │  │  verify-otp     │ │  │
│  │  │   .js        │  │    .js       │  │     .js         │ │  │
│  │  └──────┬───────┘  └──────┬───────┘  └─────┬───────────┘ │  │
│  │         │                  │                 │             │  │
│  │         │                  │                 │             │  │
│  │  ┌──────▼──────────────────▼─────────────────▼───────────┐ │  │
│  │  │         knowledge-base.js (shared module)             │ │  │
│  │  └───────────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Netlify Forms                           │  │
│  │  - chat-lead-capture                                       │  │
│  │  - admiral-contact (quote form)                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────┬───────────────────────┘
                        │                  │
           ┌────────────▼─────┐   ┌────────▼─────────┐
           │  OpenAI API      │   │  Twilio Verify   │
           │  (GPT-4o-mini)   │   │  API (SMS OTP)   │
           └──────────────────┘   └──────────────────┘
```

---

## Frontend Architecture

### Page Structure
```
/
├── index.html              # Homepage
│   ├── Video placeholder section
│   ├── Trust pillars (3-column grid)
│   └── Quick comparison teaser
│
├── about.html              # Company information
├── services.html           # Service offerings
├── powerpair.html          # PowerPair product page
│   ├── How It Works section
│   ├── Battery vs Generator comparison (detailed)
│   └── Persona decision cards
│
├── case-studies.html       # Customer success stories
├── quote.html              # Lead capture form with SMS verification
└── thank-you.html          # Form submission confirmation
```

### Chat Widget Architecture
```javascript
// public/scripts/admiral-chat-ui.js (IIFE Pattern)

(function() {
  // Private variables
  const FN_URL = "/.netlify/functions/admiral-chat";
  const THREAD_KEY = "admiral_chat_thread_v1";
  let overlay, panel, logEl, inputEl;
  
  // Core functions
  buildFloatingButton()     // Creates chat trigger button
  buildPanel()              // Creates chat UI (header, messages, input)
  openPanel()               // Shows chat, tracks event
  closePanel()              // Hides chat, tracks event
  
  // Message handling
  onSubmit()                // Handles user message submission
  askTheAdmiral()           // Calls Netlify Function
  appendMessage()           // Adds message to chat log
  showTypingIndicator()     // Shows "..." while bot responds
  
  // Lead capture
  showContactButtons()      // Displays Yes/No buttons
  showLeadCaptureForm()     // Displays inline form
  getChatContext()          // Gets last 6 messages for context
  
  // Utilities
  pushEvent()               // Sends events to dataLayer
  loadThread()              // Loads chat history from localStorage
  saveThread()              // Saves chat history to localStorage
  scrollLog()               // Auto-scrolls to latest message
})();
```

### Key UI Patterns

#### Responsive Design
```css
/* Mobile-first approach with Tailwind */

Chat Button:
- Mobile: bottom-4 right-4 (fixed position)
- Desktop: sm:bottom-5 sm:right-5 (slightly larger)

Chat Panel:
- Mobile: w-full h-[100dvh] (fullscreen)
- Desktop: sm:w-[420px] sm:h-auto sm:max-h-[90vh] (card)

Chat Log:
- flex-1 min-h-0 (flexbox scrolling pattern)
- overflow-y-auto overflow-x-hidden
- scroll-smooth for better UX

Message Bubbles:
- max-w-[75%] (don't span full width)
- word-break: break-word (wrap long words)
- overflowWrap: break-word (wrap URLs)
```

#### Color Scheme
```css
/* Tailwind custom colors defined in HTML <style> */
--admiral-navy: #1e3a5f    /* Headers, primary brand */
--admiral-gold: #fbbf24    /* CTAs, accents */

/* Chat colors */
User messages: bg-blue-600 (blue bubbles)
Bot messages: bg-white border-gray-200 (white bubbles)
Avatar: bg-admiral-gold text-admiral-navy (gold circle)
```

---

## Backend Architecture

### Netlify Functions

#### 1. admiral-chat.js
**Purpose:** Main chat endpoint, integrates OpenAI with knowledge base

**Request:**
```javascript
POST /.netlify/functions/admiral-chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "What's the cost of PowerPair?" },
    // ... previous conversation
  ]
}
```

**Process:**
1. Extract last user message
2. Search knowledge base for relevant content (`searchKnowledge()`)
3. Enhance system prompt with knowledge base results
4. Call OpenAI API with last 8 messages (context window)
5. Return bot response

**Response:**
```javascript
{
  "reply": "The Duke PowerPair system costs around $15k installed..."
}
```

**System Prompt:** 
- Concise responses (2-4 sentences)
- Battery-first approach
- Honest ROI analysis
- Detects buying intent → sends `SHOW_CONTACT_BUTTONS` trigger

**Error Handling:**
- 500: Missing API key
- 400: Invalid request format
- OpenAI errors: Generic "server hiccup" message to user

#### 2. knowledge-base.js
**Purpose:** Shared module with Duke Energy knowledge base

**Structure:**
```javascript
const knowledgeBase = {
  'duke_powerpair_pricing': { /* facts */ },
  'duke_interconnection': { /* facts */ },
  'nc_solar_incentives': { /* facts */ },
  'battery_runtime': { /* facts */ },
  'solar_roi_nc': { /* facts */ },
  'net_metering_duke': { /* facts */ },
  'powerpair_specs': { /* facts */ },
  'installation_timeline': { /* facts */ },
  'backup_power_essentials': { /* facts */ }
}

function searchKnowledge(query) {
  // Keyword matching across topics
  // Returns concatenated relevant facts
}
```

**Topics:** 9 categories covering Duke Energy specifics, PowerPair details, NC incentives

#### 3. send-otp.js
**Purpose:** Send SMS verification code via Twilio

**Request:**
```javascript
POST /.netlify/functions/send-otp
Content-Type: application/json

{
  "phone": "+19195551234"
}
```

**Process:**
1. Validate phone format
2. Call Twilio Verify API (verification.create)
3. Return success/failure

**Note:** Twilio trial accounts only send to verified numbers

#### 4. verify-otp.js
**Purpose:** Verify SMS code entered by user

**Request:**
```javascript
POST /.netlify/functions/verify-otp
Content-Type: application/json

{
  "phone": "+19195551234",
  "code": "123456"
}
```

**Process:**
1. Call Twilio Verify API (verificationCheck.create)
2. Return approved/pending/failed status

#### 5. capture-lead.js (Optional, Not Currently Used)
**Purpose:** Alternative lead capture endpoint with custom processing

**Status:** Created for future enhancements (email notifications, CRM integration)

**Current Flow:** Chat leads go directly to Netlify Forms, not this function

---

## Data Flow

### Chat Conversation Flow
```
1. User types message
   ↓
2. admiral-chat-ui.js validates input
   ↓
3. appendMessage('user', text) - shows in chat
   ↓
4. showTypingIndicator() - shows "..."
   ↓
5. askTheAdmiral(text) - fetches to Netlify Function
   ↓
6. admiral-chat.js receives request
   ↓
7. searchKnowledge(text) - finds relevant info
   ↓
8. OpenAI API call with enhanced prompt
   ↓
9. Bot response returned to UI
   ↓
10. removeTypingIndicator()
    ↓
11. Check for triggers (SHOW_CONTACT_BUTTONS, SHOW_LEAD_FORM)
    ↓
12. appendMessage('assistant', reply) - shows in chat
    ↓
13. saveThread() - stores in localStorage
    ↓
14. pushEvent('admiral_chat_reply_received') - GA4 tracking
```

### Lead Capture Flow
```
1. User asks about pricing/timeline
   ↓
2. Bot detects buying intent keywords
   ↓
3. Bot responds with "SHOW_CONTACT_BUTTONS"
   ↓
4. showContactButtons() displays Yes/No buttons
   ↓
5a. User clicks "Yes, please!"
    ↓
    showLeadCaptureForm() displays inline form
    ↓
    User fills: name, email, phone (optional)
    ↓
    getChatContext() captures last 6 messages
    ↓
    Form submits to / (Netlify Forms endpoint)
    ↓
    Netlify Forms stores submission
    ↓
    pushEvent('generate_lead', { source: 'admiral_chat' })
    ↓
    Success message with green checkmark
    ↓
    Bot: "Anything else I can help with?"

5b. User clicks "Not right now"
    ↓
    Bot: "No problem! Feel free to keep exploring..."
```

### Quote Form Flow (quote.html)
```
1. User fills form fields (name, email, phone, etc.)
   ↓
2. User submits → send-otp.js called
   ↓
3. SMS sent to phone via Twilio
   ↓
4. User enters 6-digit code
   ↓
5. verify-otp.js validates code
   ↓
6. If valid: Form submits to Netlify Forms
   ↓
7. pushEvent('generate_lead', { form_name: 'admiral-contact' })
   ↓
8. Redirect to thank-you.html
```

---

## Analytics & Tracking

### Google Tag Manager Setup

**Container:** GTM-N6HRP34Z  
**Installation:** Script in `<head>` of all HTML pages  
**dataLayer:** Global variable for event tracking

### Event Tracking Implementation

All events use this pattern:
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'event_name',
  parameter1: 'value1',
  parameter2: 'value2'
});
```

### Chat Events Table

| Event Name | Trigger | File | Line | Parameters |
|-----------|---------|------|------|-----------|
| `chat_opened` | Float button clicked | admiral-chat-ui.js | ~435 | source, page |
| `chat_message_sent` | User sends message | admiral-chat-ui.js | ~164 | page |
| `admiral_chat_reply_received` | Bot responds | admiral-chat-ui.js | ~186 | page |
| `chat_closed` | Chat closed | admiral-chat-ui.js | ~443 | page |
| `generate_lead` | Chat form submitted | admiral-chat-ui.js | ~471 | source: 'admiral_chat', lead_type, page |

### Quote Form Events Table

| Event Name | Trigger | File | Line | Parameters |
|-----------|---------|------|------|-----------|
| `form_start` | First field focused | quote.html | ~366 | page_url |
| `phone_verified` | OTP verified | quote.html | ~526 | page_url, verification_method |
| `generate_lead` | Form submitted | quote.html | ~407 | form_name, page_url, utm_* |

### Recommended GTM Configuration

**Triggers:**
1. Custom Event: `chat_opened`
2. Custom Event: `chat_message_sent`
3. Custom Event: `admiral_chat_reply_received`
4. Custom Event: `chat_closed`
5. Custom Event: `generate_lead`
6. Custom Event: `phone_verified`
7. Custom Event: `form_start`
8. Custom Event: `exit_intent`

**Tags:**
1. GA4 Event - Chat Opened (fires on chat_opened trigger)
2. GA4 Event - Chat Message Sent (fires on chat_message_sent trigger)
3. GA4 Event - Bot Reply (fires on admiral_chat_reply_received trigger)
4. GA4 Event - Chat Closed (fires on chat_closed trigger)
5. GA4 Event - Lead Generated (fires on generate_lead trigger)
6. GA4 Event - Phone Verified (fires on phone_verified trigger)
7. GA4 Event - Form Started (fires on form_start trigger)

**Variables:**
- DLV - event (Built-in)
- DLV - source
- DLV - page
- DLV - lead_type
- DLV - form_name

### Conversion Tracking

**Primary Conversion:** `generate_lead` event  
**Sources:** 
- `admiral_chat` (chat widget)
- `admiral-contact` (quote form)

**Recommended GA4 Configuration:**
1. Mark `generate_lead` as key event
2. Create conversion funnel: form_start → generate_lead
3. Create audience: Users who triggered generate_lead
4. Set up conversion value (optional)

---

## Security & Performance

### Security Measures

**API Keys:**
- All stored in Netlify environment variables
- Never committed to repository
- Accessed via `process.env` in Functions

**CORS:**
```javascript
// In Netlify Functions
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};
```

**Form Security:**
- Netlify Forms includes honeypot field (`netlify-honeypot="bot-field"`)
- reCAPTCHA can be added (not currently enabled)
- Rate limiting via Netlify platform

**HTTPS:**
- Enforced on all pages
- Netlify provides SSL certificates automatically

**Data Privacy:**
- No sensitive data in localStorage (only chat history)
- Thread clears on page load (fresh session)
- Lead data transmitted via HTTPS only

### Performance Optimization

**Bundle Size:**
- No build step = no bundle
- Tailwind CSS: CDN-delivered (no bloat)
- JavaScript: ~15KB total (admiral-chat-ui.js)

**Caching:**
- Static assets cached by Netlify CDN
- HTML: No cache (always fresh)
- CSS/JS: Cache with query params for versioning

**API Efficiency:**
- OpenAI: Only last 8 messages sent (token optimization)
- Knowledge base: Client-side search before API call
- Netlify Functions: Cold start <500ms, warm <100ms

**Image Optimization:**
- WebP format where supported
- Lazy loading with `loading="lazy"`
- Responsive images with srcset

### Monitoring

**Netlify:**
- Function logs (real-time)
- Form submissions dashboard
- Deploy logs and previews

**GA4:**
- Real-time events
- User engagement metrics
- Conversion tracking

**OpenAI:**
- Usage dashboard
- Cost monitoring
- Rate limit tracking

---

## Deployment

### Git Workflow
```
main branch (production)
  ↓
  GitHub webhook
  ↓
  Netlify auto-build (currently paused until Nov 3)
  ↓
  Manual trigger via Netlify Dashboard
  ↓
  Build (~2 min)
  ↓
  Deploy to production
```

### Build Process
1. Netlify detects hidden forms (e.g., `chat-lead-capture`)
2. Creates form endpoints automatically
3. Deploys static files to CDN
4. Deploys serverless functions

### Environment Variables (Netlify)
```
OPENAI_API_KEY=sk-...
ADMIRAL_SYSTEM_PROMPT=(optional override)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
VERIFY_SERVICE_SID=VA...
```

### Deployment Checklist
- [ ] All changes committed to main branch
- [ ] Environment variables set in Netlify
- [ ] GTM container published
- [ ] Manual deploy triggered (auto-deploy paused)
- [ ] Hard refresh browser after deploy (Ctrl+Shift+R)
- [ ] Test chat functionality
- [ ] Test lead capture form
- [ ] Verify GA4 events in Realtime report
- [ ] Check Netlify Forms dashboard for submissions

### Rollback Process
1. Netlify Dashboard → Deploys
2. Find previous successful deploy
3. Click "Publish deploy"
4. Previous version goes live immediately

---

## File Structure

```
admiralenergy-website/
├── index.html (Homepage)
├── about.html
├── services.html
├── powerpair.html
├── case-studies.html
├── quote.html
├── thank-you.html
├── 404.html
├── styles.css (minimal, most styling via Tailwind CDN)
├── netlify.toml (Netlify configuration)
├── _headers (Security headers)
├── package.json (Dependencies for Netlify Functions)
│
├── docs/
│   ├── SESSION-LOG-2025-10-30.md (this session's work)
│   ├── ARCHITECTURE.md (this document)
│   ├── LEAD-CAPTURE-GUIDE.md (lead system docs)
│   ├── MOBILE-OPTIMIZATION-SUMMARY.md
│   ├── 2025-10-22_Chatbot_Implementation_Guide.md
│   ├── GTM-Audit-2025-10-26.md
│   └── ops-checklist.md
│
├── public/
│   ├── scripts/
│   │   ├── admiral-chat-ui.js (main chat widget, 555 lines)
│   │   └── admiral-chat.js (alternate/backup)
│   ├── images/
│   ├── icons/
│   └── logos/
│
├── netlify/
│   └── functions/
│       ├── admiral-chat.js (OpenAI integration, 118 lines)
│       ├── knowledge-base.js (Duke knowledge, shared module)
│       ├── capture-lead.js (optional endpoint, 107 lines)
│       ├── send-otp.js (Twilio SMS, 119 lines)
│       └── verify-otp.js (Twilio verify, 98 lines)
│
└── _archive/ (old files, not deployed)
```

---

## Dependencies

### Frontend
- **Tailwind CSS** (v3.x) - CDN
- **No build tools required**

### Backend (package.json)
```json
{
  "dependencies": {
    "openai": "^4.x",
    "twilio": "^4.x"
  }
}
```

### External Services
- **Netlify** - Hosting + Functions + Forms
- **OpenAI** - GPT-4o-mini API
- **Twilio** - Verify API for SMS OTP
- **Google Tag Manager** - Analytics container
- **Google Analytics 4** - Web analytics

---

## Contact & Maintenance

### Repository
- **GitHub:** AdmiralEnergy/admiralenergy-website
- **Branch:** main
- **Last Updated:** October 30, 2025

### Key Contacts
- **Development:** [Your contact]
- **Netlify Account:** [Owner]
- **OpenAI Account:** [Owner]
- **Twilio Account:** [Owner]

### Maintenance Schedule
- **Code Reviews:** As needed
- **Dependency Updates:** Quarterly
- **Security Audits:** Bi-annually
- **Performance Audits:** Monthly (Lighthouse)
- **Analytics Review:** Weekly

### Support Resources
- Netlify Docs: https://docs.netlify.com/
- OpenAI API Docs: https://platform.openai.com/docs/
- Twilio Docs: https://www.twilio.com/docs/
- GTM Docs: https://support.google.com/tagmanager/
- GA4 Docs: https://support.google.com/analytics/

---

**Document Version:** 2.1.0  
**Last Review:** October 30, 2025  
**Next Review:** November 30, 2025
