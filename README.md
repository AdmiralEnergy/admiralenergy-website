# Admiral Energy Website

> **Battery-first backup power solutions for North Carolina homeowners**

A static website with Netlify serverless functions, featuring an AI-powered chat assistant, OTP-verified contact forms, and math-first solar guidance.

🌐 **Live Site**: [https://admiralenergy.ai](https://admiralenergy.ai)  
📦 **Hosting**: Netlify  
🔧 **Tech Stack**: Vanilla HTML/CSS/JS + Tailwind CDN + Netlify Functions

---

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Known Issues & Solutions](#known-issues--solutions)
- [Contributing](#contributing)

---

## 🏗️ Architecture Overview

This is a **static site with serverless functions** architecture:

- **Frontend**: Pure HTML/CSS/JavaScript with Tailwind CSS (CDN)
- **Backend**: Netlify serverless functions (Node.js 18)
- **Forms**: Netlify Forms with optional Twilio OTP verification
- **AI Chat**: OpenAI GPT-4o-mini via serverless proxy
- **Deployment**: Continuous deployment from GitHub to Netlify

### Design Philosophy

- ✅ **No build step** - Direct HTML editing for rapid iteration
- ✅ **Progressive enhancement** - Works without JavaScript for core content
- ✅ **Math-first messaging** - Honest guidance, not sales pressure
- ✅ **Battery-first approach** - Solar when it makes financial sense

---

## 📁 Project Structure

```
admiralenergy-website/
├── index.html              # Homepage - Core messaging
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
│
├── docs/                   # Project documentation
│   ├── ops-checklist.md          # Operational procedures
│   ├── checklist-chatbot.md      # Chat implementation guide
│   └── GTM-Audit-2025-10-26.md   # Analytics audit
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

### 1. **Admiral Chat Assistant**
- **AI-powered** chat widget using OpenAI GPT-4o-mini
- **North Carolina focused** - Duke Energy, interconnection timelines, local incentives
- **Math-first guidance** - Battery ROI calculations, avoiding solar overselling
- **Privacy-conscious** - No chat history stored, anonymous by default
- **Implementation**: `public/scripts/admiral-chat*.js` + `netlify/functions/admiral-chat.js`

### 2. **OTP-Verified Contact Form**
- **Twilio Verify API** integration for phone number validation
- **Graceful degradation** - Form works even if OTP fails
- **Spam prevention** - Reduces fake submissions
- **Trial account note**: Only sends to verified numbers in dev
- **Implementation**: `quote.html` + `netlify/functions/send-otp.js` + `verify-otp.js`

### 3. **Performance Optimizations**
- **Immutable asset caching** - 1 year cache for images/logos/icons
- **Security headers** - XSS protection, frame denial, CSP-ready
- **CDN delivery** - Netlify Edge CDN for global performance
- **Lazy loading** - Images load on scroll
- **Progressive Web App** - Manifest and service worker ready

### 4. **SEO & Analytics**
- **Google Tag Manager** integration (GTM-N6HRP34Z)
- **Open Graph** meta tags for social sharing
- **Semantic HTML** for accessibility and SEO
- **Custom 404** page with navigation
- **Sitemap-ready** structure

---

## 🚀 Getting Started

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

### Automatic Deployment

**Main branch** → Production (`admiralenergy.ai`)  
**Feature branches** → Deploy previews (`deploy-preview-XX--admiralenergy.netlify.app`)

Netlify auto-deploys on every push to GitHub.

### Manual Deployment

```bash
# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy

# Build without deploying (validation)
npm run build
```

### Deployment Checklist

- [ ] Test locally with `netlify dev`
- [ ] Check all forms submit correctly
- [ ] Verify chat widget loads and responds
- [ ] Test OTP flow (if phone number is verified)
- [ ] Review Netlify deploy logs
- [ ] Check production URLs after deploy

---

## 🔐 Environment Variables

Set these in **Netlify Dashboard** → Site Settings → Environment Variables

### Required for Chat

```bash
OPENAI_API_KEY=sk-proj-...              # OpenAI API key
ADMIRAL_SYSTEM_PROMPT="You are..."      # Optional: Custom AI prompt
```

### Required for OTP

```bash
TWILIO_ACCOUNT_SID=AC...                 # Twilio Account SID
TWILIO_AUTH_TOKEN=...                    # Twilio Auth Token
VERIFY_SERVICE_SID=VA...                 # Twilio Verify Service SID
```

### Local Development

Create `.env` file in root (gitignored):

```bash
OPENAI_API_KEY=sk-proj-...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
VERIFY_SERVICE_SID=VA...
```

---

## ⚠️ Known Issues & Solutions

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

## 📚 Additional Resources

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **Twilio Verify**: [twilio.com/docs/verify](https://www.twilio.com/docs/verify)
- **OpenAI API**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Tailwind CSS**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## 📝 License

Private repository - © 2025 Admiral Energy. All rights reserved.

---

## 🆘 Support

- **Technical Issues**: Check `docs/ops-checklist.md`
- **Chat Issues**: See `docs/checklist-chatbot.md`
- **Analytics**: Review `docs/GTM-Audit-2025-10-26.md`
- **Questions**: Contact Admiral Energy development team

---

**Last Updated**: October 30, 2025  
**Node Version**: 18  
**Netlify CLI**: 23.9.5+
