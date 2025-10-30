# Admiral Energy Website

> **Battery-first backup power solutions for North Carolina homeowners**

A static website with Netlify serverless functions, featuring an AI-powered chat assistant with lead capture, OTP-verified contact forms, and math-first solar guidance.

🌐 **Live Site**: [https://admiralenergy.ai](https://admiralenergy.ai)  
📦 **Hosting**: Netlify  
🔧 **Tech Stack**: Vanilla HTML/CSS/JS + Tailwind CDN + Netlify Functions  
📊 **Analytics**: Google Analytics 4 (G-RX78MRB03L) + Google Tag Manager (GTM-N6HRP34Z)  
🤖 **AI**: OpenAI GPT-4o-mini with Duke Energy knowledge base  
📱 **Mobile**: Fully responsive, touch-optimized chat interface

> **🔒 Security Note**: All API keys (OpenAI, Twilio) are stored in Netlify environment variables and accessed only through serverless functions—never exposed in client JavaScript.

**Last Updated:** October 30, 2025  
**Version:** 2.1.0  
**Status:** ✅ Production Ready  
**Deploy Status:** ⏸️ Auto-deploy PAUSED (manual trigger required) | Last verified: *Pending deployment of commit `439590c`*  
**Current Live:** Commit `0d27b4c` (Oct 22, 2025)

---

## 📋 Table of Contents

- [Recent Updates](#recent-updates)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Documentation](#documentation)
- [Known Issues & Solutions](#known-issues--solutions)
- [Contributing](#contributing)

---

## 🆕 Recent Updates (October 30, 2025)

### Chat UI Improvements
- ✅ ESC key now closes chat
- ✅ Fixed scrolling issues (proper flexbox pattern with max-height)
- ✅ Send button now activates when clicking suggested prompts
- ✅ Concise bot responses (2-4 sentences max, conversational tone)

### Lead Capture System (NEW)
- ✅ AI detects buying intent and offers consultation
- ✅ Yes/No buttons replace text input (lower friction)
- ✅ Inline lead form (name, email, phone)
- ✅ Captures conversation context with lead
- ✅ Integrated with Netlify Forms (no custom backend needed)
- ✅ GA4 tracking for all lead sources

### Documentation Overhaul
- 📄 **SESSION-LOG-2025-10-30.md** - Complete session work log
- 📄 **ARCHITECTURE.md** - Full system architecture with diagrams
- 📄 **GTM-TRACKING-REFERENCE.md** - Complete analytics guide
- 📄 **LEAD-CAPTURE-GUIDE.md** - Lead system documentation

See [docs/](docs/) folder for detailed documentation.

> **📌 Accessibility Note**: Current site has basic accessibility. Planned improvements:
> - Task 1.2: Semantic HTML structure + skip-to-main link
> - Implementation: `<a class="sr-only focus:not-sr-only" href="#main">Skip to main content</a>`
> - Wrapping content in `<main id="main">` tags

---

## 🏗️ Architecture Overview

This is a **static site with serverless functions** architecture:

- **Frontend**: Pure HTML/CSS/JavaScript with Tailwind CSS (CDN)
- **Backend**: Netlify serverless functions (Node.js 18)
- **Forms**: Netlify Forms with optional Twilio OTP verification
- **AI Chat**: OpenAI GPT-4o-mini via serverless proxy + knowledge base
- **Lead Capture**: In-chat form with Yes/No buttons → Netlify Forms
- **Analytics**: GTM container with 9 tracked events → GA4
- **Deployment**: Continuous deployment from GitHub to Netlify

### Data Flow - Chat Lead Capture
```
User asks about pricing → Bot detects intent → Shows Yes/No buttons
   ↓ (clicks "Yes")
Inline form appears (name, email, phone) → User submits
   ↓
Netlify Forms captures + GA4 tracks → Success message + conversation continues
```

### Design Philosophy

- ✅ **No build step** - Direct HTML editing for rapid iteration
- ✅ **Progressive enhancement** - Works without JavaScript for core content
- ✅ **Math-first messaging** - Honest guidance, not sales pressure
- ✅ **Battery-first approach** - Solar when it makes financial sense
- ✅ **Conversational AI** - Helpful advisor, not pushy salesperson

---

## 📁 Project Structure

```
admiralenergy-website/
├── index.html              # Homepage - Trust pillars, video placeholder
├── about.html              # Company story and values
├── services.html           # Service offerings and process
├── case-studies.html       # Customer success stories
├── powerpair.html          # Duke PowerPair program details
├── quote.html              # Contact form with OTP verification
├── thank-you.html          # Form submission success page
├── 404.html                # Custom 404 error page
├── styles.css              # Global styles (supplementing Tailwind)
├── _headers                # Root-level HTTP headers (HTML/CSS caching)
│
├── public/                 # Static assets served as-is
│   ├── _headers           # Asset-specific cache headers
│   ├── icons/             # PWA icons
│   ├── images/            # Site images and graphics
│   ├── logos/             # Brand assets and favicons
│   └── scripts/           # Client-side JavaScript
│       ├── admiral-chat-ui.js    # Chat widget UI
│       └── admiral-chat.js       # Chat client logic
│
├── netlify/
│   └── functions/          # Serverless functions
│       ├── admiral-chat.js       # OpenAI chat proxy
│       ├── send-otp.js           # Twilio OTP sender
│       └── verify-otp.js         # Twilio OTP verifier
│       ├── capture-lead.js       # Optional lead endpoint (not currently used)
│       └── knowledge-base.js     # Shared Duke Energy knowledge base
│
├── docs/                   # Project documentation
│   ├── SESSION-LOG-2025-10-30.md       # Oct 30 session work log
│   ├── ARCHITECTURE.md                  # Full system architecture
│   ├── GTM-TRACKING-REFERENCE.md        # Complete analytics guide (9 events)
│   ├── LEAD-CAPTURE-GUIDE.md            # Lead system documentation
│   ├── MOBILE-OPTIMIZATION-SUMMARY.md   # Mobile optimization details
│   ├── ops-checklist.md                 # Operational procedures
│   └── 2025-10-22_Chatbot_Implementation_Guide.md  # Original chat setup
│
├── netlify.toml            # Netlify configuration
├── package.json            # Node.js dependencies
├── .node-version           # Node.js version lock (v18)
├── .nvmrc                  # NVM compatibility
└── .gitignore              # Git exclusions

# Local only (not tracked):
├── NewFiles/               # Staging area for WIP files
└── _archive/               # Historical backups
```

---

## ✨ Key Features

### 1. **Admiral Chat Assistant with Lead Capture**
- **AI-powered** chat widget using OpenAI GPT-4o-mini
- **Duke Energy knowledge base** - 9 topics covering NC-specific info
- **Intent detection** - Bot recognizes buying signals (price, timeline, interest)
- **Yes/No buttons** - One-click consultation offers (no typing required)
- **Inline lead form** - Name, email, phone capture with conversation context
- **Netlify Forms integration** - All leads in dashboard with email notifications
- **GA4 tracking** - Every lead tracked with source attribution
- **Session management** - Fresh chat on page load, persists during session
- **Close methods** - × button, backdrop click, or ESC key
- **Responsive design** - Full-screen mobile, card-style desktop
- **Implementation**: `public/scripts/admiral-chat-ui.js` (555 lines) + `netlify/functions/admiral-chat.js`

### 2. **OTP-Verified Quote Form**
- **Twilio Verify API** integration for phone number validation
- **Graceful degradation** - Form works even if OTP fails
- **Spam prevention** - Reduces fake submissions
- **GA4 events** - form_start, phone_verified, generate_lead
- **Implementation**: `quote.html` + `netlify/functions/send-otp.js` + `verify-otp.js`

### 3. **Comprehensive Analytics (GTM/GA4)**
- **Google Tag Manager**: Container GTM-N6HRP34Z
- **Google Analytics 4**: Property G-RX78MRB03L
- **9 tracked events**: chat_opened, chat_message_sent, chat_reply_received, chat_closed, generate_lead (2 sources), form_start, phone_verified, exit_intent
- **Conversion tracking**: generate_lead marked as key event
- **UTM preservation**: Full attribution across session
- **Cache policy**: HTML files no-cache for freshness; static assets (images/CSS/JS) cached 1 year immutable
- **See**: [GTM-TRACKING-REFERENCE.md](docs/GTM-TRACKING-REFERENCE.md) for complete setup

### 4. **Performance & Security**
- **No build step** - Instant editing, no compilation
- **CDN delivery** - Netlify Edge CDN for global performance
- **Smart caching** - HTML no-cache for freshness, assets 1-year immutable
- **HTTPS enforced** - Automatic SSL via Netlify
- **Security headers** - XSS protection, frame denial
- **API key protection** - All keys in Netlify environment variables, never exposed in client JS

### 5. **Mobile-First Design**
- **Responsive chat** - Full-screen on mobile, card on desktop (max 90vh)
- **Touch-optimized** - 44px+ touch targets, proper scrolling
- **Accessible** - ARIA labels, keyboard navigation (ESC, Enter, Tab)
- **Color contrast** - WCAG AA compliant
- **See**: `/docs/MOBILE-OPTIMIZATION-SUMMARY.md` for details

---

## 🚀 Getting Started

### Quick Start (Windows PowerShell)

```powershell
# Pull latest changes
git pull

# Start local dev server
netlify dev

# Optional: Run deployment check
.\check-deployment.ps1  # (if exists)
```

### Prerequisites

- **Node.js 18+** (locked via `.node-version` and `.nvmrc`)
- **Netlify CLI** (`npm install -g netlify-cli`)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/AdmiralEnergy/admiralenergy-website.git
cd admiralenergy-website

# Install dependencies
npm install

# Set up environment variables (see Environment Variables section)
# Create .env file or use Netlify CLI: netlify env:set KEY value

# Run local development server
netlify dev
```

The site will be available at `http://localhost:8888`

---

## 🛠️ Development

### Local Development

```bash
# Start Netlify dev server (includes functions)
npm run dev
# or
netlify dev
```

This runs:
- Static file server on `http://localhost:8888`
- Functions available at `http://localhost:8888/.netlify/functions/*`
- Live reload on file changes

### Editing HTML

HTML files are in the **root directory**. They reference assets with `/public/` prefix:

```html
<!-- ✅ Correct -->
<img src="/public/logos/ae-logo.png" alt="Admiral Energy">
<link rel="stylesheet" href="/styles.css">

<!-- ❌ Wrong -->
<img src="public/logos/ae-logo.png">
```

### Adding New Pages

1. Create HTML file in root (e.g., `new-page.html`)
2. Copy header/footer from existing page
3. Update navigation in ALL pages (no templating)
4. Add redirects in `netlify.toml` if needed

### Modifying Serverless Functions

Functions are in `netlify/functions/`. They auto-deploy with the site.

```javascript
// Example function structure
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Hello' })
  };
};
```

Test locally with `netlify dev` - functions available at `/.netlify/functions/function-name`

---

## 📦 Deployment

### Deployment Status

**⏸️ Auto-Deploy: PAUSED** (manual control to conserve Netlify credits)  
**Deployment Method**: Manual trigger via Netlify Dashboard  
**Ready to Deploy**: Commit `439590c` (Oct 30, 2025 - all today's work)  
**Currently Live**: Commit `0d27b4c` (Oct 22, 2025)

### Automatic Deployment (When Enabled)

**Main branch** → Production (`admiralenergy.ai`)  
**Feature branches** → Deploy previews (`deploy-preview-XX--admiralenergy.netlify.app`)

When enabled, Netlify auto-deploys on every push to GitHub. Currently paused for manual control.

### Manual Deployment (Current Method)

**Via Netlify Dashboard:**
1. Go to [Netlify Dashboard](https://app.netlify.com) → Your Site → Deploys
2. Click "Trigger deploy" → "Deploy site"
3. Wait ~2 minutes for build
4. Hard refresh browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

**Via Netlify CLI:**

```bash
# Deploy to production (publishes from current directory)
netlify deploy --prod --dir=.

# Open deployed site in browser
netlify open:site

# Deploy preview (test before going live)
netlify deploy

# Build validation (no deploy)
npm run build
```

### Deployment Checklist

- [ ] Test locally with `netlify dev`
- [ ] Check all forms submit correctly
- [ ] Verify chat widget loads and responds
- [ ] Test OTP flow (if phone number is verified)
- [ ] Commit and push to GitHub
- [ ] **Manually trigger deploy** in Netlify Dashboard (auto-deploy paused)
- [ ] Review Netlify deploy logs for errors
- [ ] Hard refresh browser after deploy (`Ctrl+Shift+R`)
- [ ] Check production URLs and verify changes live

---

## 🔐 Environment Variables

Set these in **Netlify Dashboard** → Site Settings → Build & deploy → Environment Variables

> **⚠️ Security**: Environment variables are set in Netlify only—never commit `.env` to Git. All API calls route through Netlify Functions; keys are never exposed in client JavaScript.

### Required for Chat

```bash
OPENAI_API_KEY=sk-proj-...              # OpenAI API key (never expose in client JS)
ADMIRAL_SYSTEM_PROMPT="You are..."      # Optional: Custom AI prompt
```

### Required for OTP

```bash
TWILIO_ACCOUNT_SID=AC...                 # Twilio Account SID (never expose in client JS)
TWILIO_AUTH_TOKEN=...                    # Twilio Auth Token (never expose in client JS)
VERIFY_SERVICE_SID=VA...                 # Twilio Verify Service SID
```

> **🔒 Key Protection**: All keys above are accessed only through `netlify/functions/*`. Never reference these in client-side JavaScript.

### Local Development

Create `.env` file in root (gitignored, never commit):

```bash
OPENAI_API_KEY=sk-proj-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
VERIFY_SERVICE_SID=VA...
```

> **Note**: `.env` is in `.gitignore` and will not be uploaded to GitHub. Production uses Netlify's environment variables.

---

## ⚠️ Known Issues & Solutions

### Issue: Netlify Forms Not Capturing Submissions (RESOLVED ✅)

**Problem**: Forms appeared to work (users reached thank-you page) but submissions weren't captured by Netlify. 11+ leads lost between Oct 26-30, 2025.

**Root Cause**: Missing hidden static form template. Netlify's build bot requires a static HTML form with `netlify` attribute to detect fields at build time.

**Solution**:
```html
<!-- Hidden template for Netlify build detection -->
<form name="admiral-contact" netlify netlify-honeypot="bot-field" hidden>
  <input type="text" name="Full Name" />
  <input type="email" name="Email" />
  <!-- All 11 fields listed here -->
</form>

<!-- Visible form with data-netlify -->
<form id="admiral-contact-form" name="admiral-contact" 
      method="POST" data-netlify="true">
  <!-- User-facing fields -->
</form>
```

**Verification**: Check form appears in Netlify Forms dashboard with all 11 fields registered.

---

### Issue: Netlify Default Thank-You Page Injection (RESOLVED ✅)

**Problem**: Using `action="/thank-you.html"` caused Netlify to inject their default success card after the closing `</html>` tag, preventing custom tracking code from firing.

**Root Cause**: Netlify's form handler intercepts form submissions and injects default UI when `action` attribute is present.

**Solution**: JavaScript form submission with manual redirect
```javascript
const form = document.getElementById('admiral-contact-form');
form.addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent Netlify's default behavior
  
  // Submit via fetch
  fetch('/', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(new FormData(form)).toString()
  })
  .then(() => {
    // Manual redirect preserves query params for tracking
    window.location.href = '/thank-you.html' + window.location.search;
  });
});
```

**Result**: Form data captured by Netlify, user sees custom thank-you page with GA4 tracking, no injection.

---

### Issue: Form Selector Conflict (RESOLVED ✅)

**Problem**: Event listener attached to hidden template form instead of visible form.

**Root Cause**: `querySelector('form[name="admiral-contact"]')` selected first matching form (the hidden template).

**Solution**: Use unique ID selector
```javascript
// ❌ Wrong - selects hidden form
const form = document.querySelector('form[name="admiral-contact"]');

// ✅ Correct - selects visible form by ID
const form = document.getElementById('admiral-contact-form');
```

---

### Issue: Twilio Trial Account Limitations

**Problem**: Trial accounts can only send OTP to verified phone numbers.

**Solution**:
1. Verify your test phone at: [Twilio Console → Phone Numbers → Verified](https://console.twilio.com/us1/develop/phone-numbers/manage/verified)
2. For production, upgrade to a paid Twilio account
3. Form gracefully degrades - submissions work even if OTP fails

---

### Issue: HTML Files Reference `/public/` Paths

**Why**: This is intentional! Assets are in `public/` directory, but Netlify publishes from root (`.`).

**Structure**:
```
Root published → All HTML files accessible
                 /public/ accessible as subdirectory
```

**Don't change to**: Moving HTML into `public/` would require:
- Updating `netlify.toml` publish directory
- Changing ALL asset paths from `/public/assets` to `/assets`
- Risk of breaking existing URLs

**Current approach works** - leave it as-is unless planning major refactor.

---

### Issue: Duplicate `_headers` Files

**Root `_headers`**: Caches HTML and CSS files  
**`public/_headers`**: Caches images, logos, and icons

**Why both**: Netlify merges `_headers` files from different directories. This allows:
- Different cache strategies for different asset types
- Root-level HTML caching (no-cache for freshness)
- Long-term caching for static assets (1 year immutable)

**Don't delete either** - both serve different purposes.

---

### Issue: No Build Step = Manual Updates Across Files

**Challenge**: Navigation changes require updating ALL HTML files manually.

**Workaround**:
- Use find-and-replace carefully
- Consider future migration to:
  - Static Site Generator (11ty, Hugo, Astro)
  - Template includes
  - React/Next.js (if team comfortable with it)

**Current trade-off**: Simplicity and zero build time vs. DRY principle.

---

### Issue: Chat Widget Positioning on Mobile

**Known**: Chat button may overlap content on small screens.

**Fix in progress**: CSS adjustments in `admiral-chat-ui.js` or `styles.css`

**Temporary**: Users can minimize chat or scroll past it.

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Homepage**: Hero, features, CTA buttons work
- [ ] **About**: Company story loads, images visible
- [ ] **Services**: Process timeline displays correctly
- [ ] **Case Studies**: Customer stories render properly
- [ ] **PowerPair**: Duke Energy program details accurate
- [ ] **Quote Form**: 
  - [ ] Form validation works
  - [ ] OTP sends (if using verified number)
  - [ ] OTP verification succeeds
  - [ ] Submission redirects to thank-you page
  - [ ] Email notification received (check spam)
- [ ] **Chat Widget**:
  - [ ] Opens/closes smoothly
  - [ ] Sends messages to AI
  - [ ] Receives responses
  - [ ] Handles errors gracefully
- [ ] **404 Page**: Custom page shows for bad URLs
- [ ] **Mobile**: All pages responsive on phone

### Browser Testing

Tested on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ⚠️ IE11 (not supported - graceful degradation)

---

## 🤝 Contributing

### For Developers

1. **Create feature branch**: `git checkout -b feat/your-feature`
2. **Make changes** in appropriate files
3. **Test locally**: `netlify dev`
4. **Commit with clear messages**: `git commit -m "feat: add new feature"`
5. **Push and create PR**: `git push origin feat/your-feature`
6. **Deploy preview** will auto-generate
7. **Review and merge** to main

### For LLMs/AI Assistants

When editing this repository:

1. **Preserve existing patterns**: HTML structure, Tailwind classes, navigation
2. **Test before committing**: Use `netlify dev` to verify changes
3. **Don't move HTML files**: They must stay in root (see Known Issues)
4. **Update all navigation**: If adding/removing pages, update links in ALL HTML files
5. **Respect cache headers**: Don't modify unless you understand CDN implications
6. **Check CORS**: Functions have specific CORS headers for security
7. **Preserve OTP graceful degradation**: Form must work even if OTP fails
8. **Maintain brand voice**: Math-first, honest, non-pushy tone

### Commit Convention

```
feat: Add new feature
fix: Bug fix
docs: Documentation changes
style: CSS/formatting changes
refactor: Code restructuring
chore: Maintenance tasks
test: Testing updates
```

---

## 📚 Documentation

Complete project documentation is available in `/docs/`:

### Essential Reading
- **[SESSION-LOG-2025-10-30.md](docs/SESSION-LOG-2025-10-30.md)** - Latest session work log (Oct 30, 2025)
  - All chat UI improvements
  - Lead capture system implementation
  - Testing checklist
  - Deployment instructions

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Full system architecture
  - Technology stack
  - Architecture diagrams
  - Data flow documentation
  - Security & performance details
  - Complete file structure

- **[GTM-TRACKING-REFERENCE.md](docs/GTM-TRACKING-REFERENCE.md)** - Complete analytics guide
  - All 9 tracked events with implementation details
  - GTM configuration templates
  - GA4 setup recommendations
  - Testing procedures
  - Troubleshooting guide

- **[LEAD-CAPTURE-GUIDE.md](docs/LEAD-CAPTURE-GUIDE.md)** - Lead system documentation
  - User flow explanation
  - Netlify Forms integration
  - Email notification setup
  - Zapier integration options

### Additional Resources
- **[MOBILE-OPTIMIZATION-SUMMARY.md](docs/MOBILE-OPTIMIZATION-SUMMARY.md)** - Mobile optimization details
- **[2025-10-22_Chatbot_Implementation_Guide.md](docs/2025-10-22_Chatbot_Implementation_Guide.md)** - Original chat setup
- **[ops-checklist.md](docs/ops-checklist.md)** - Operational procedures

### Quick Links
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Twilio Verify**: [twilio.com/docs/verify](https://www.twilio.com/docs/verify)
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **GTM Support**: [support.google.com/tagmanager](https://support.google.com/tagmanager)
- **GA4 Support**: [support.google.com/analytics](https://support.google.com/analytics)

---

## 📝 License

Private repository - © 2025 Admiral Energy. All rights reserved.

---

## 🆘 Support

- **Getting Started**: Read [SESSION-LOG-2025-10-30.md](docs/SESSION-LOG-2025-10-30.md) for latest changes
- **Technical Architecture**: See [ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Analytics Questions**: Review [GTM-TRACKING-REFERENCE.md](docs/GTM-TRACKING-REFERENCE.md)
- **Lead Capture**: Check [LEAD-CAPTURE-GUIDE.md](docs/LEAD-CAPTURE-GUIDE.md)
- **Mobile Issues**: Reference [MOBILE-OPTIMIZATION-SUMMARY.md](docs/MOBILE-OPTIMIZATION-SUMMARY.md)
- **General Help**: Contact Admiral Energy development team

---

**Last Updated**: October 30, 2025  
**Version**: 2.1.0  
**Node Version**: 18  
**Netlify CLI**: 23.9.5+  
**Status**: ✅ Production Ready - All features tested and documented
