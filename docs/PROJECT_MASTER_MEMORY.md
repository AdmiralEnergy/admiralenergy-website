# PROJECT MASTER MEMORY - ADMIRAL ENERGY WEBSITE

**Critical: Always read this file FIRST when working on this project**  
**Last Updated**: October 30, 2025 (Evening - Chat Enhancement)  
**Next Review**: November 15, 2025

---

## 🎯 CORE MISSION

**Primary Goal**: Generate quality leads for Admiral Energy's backup power solutions in North Carolina

**Value Proposition**: 
- Battery-first approach (backup power is the priority)
- Solar when it makes financial sense (math-first, not sales-first)
- Honest guidance over aggressive sales tactics
- Target: NC homeowners concerned about power reliability

**Success Metrics**:
1. Form submission rate (admiral-contact form)
2. GA4 generate_lead conversions
3. Lead quality (phone verified preferred)
4. Bounce rate reduction
5. Time on site increase

---

## 🏗️ CURRENT ARCHITECTURE

### Technology Stack
- **Frontend**: Pure HTML/CSS/JS + Tailwind CSS (CDN)
- **Backend**: Netlify Serverless Functions (Node.js 18)
- **Forms**: Netlify Forms with Twilio OTP verification
- **Chat**: OpenAI GPT-4o-mini with RAG (Retrieval-Augmented Generation) pattern
  - Knowledge Base: 9 Duke Energy topics (PowerPair, programs, territories, HOA rights, etc.)
  - Pattern: User query → keyword search → inject relevant knowledge → enhanced AI response
- **Tracking**: GTM → GA4 + Reddit Pixel
- **Hosting**: Netlify with continuous deployment from GitHub

### Key Design Decisions
1. **No Build Step**: Direct HTML editing for rapid iteration (trade-off: code duplication)
2. **Progressive Enhancement**: Core content works without JavaScript
3. **Static-First**: Serverless functions only for interactive features
4. **RAG for Chat**: Knowledge base provides factual grounding, reduces AI hallucinations
5. **Brand Colors**: Admiral Navy (#0C2F4A), Gold (#C9A648), White (#F7F5F2)

### Architecture Constraints
- **8 HTML Files**: All navigation/footer duplicated (no templating system)
- **Asset Path**: `/public/` directory for images/logos/scripts
- **Publish Root**: `.` (root directory, not `/public/`)
- **Cache Strategy**: Different headers for HTML vs static assets

---

## 📁 REPOSITORY STRUCTURE

```
admiralenergy-website/
├── index.html              # Homepage - Primary entry point
├── about.html              # Company story, David's background
├── services.html           # Battery-first services overview
├── powerpair.html          # PowerPair product landing page
├── case-studies.html       # Customer success stories
├── quote.html              # CRITICAL: Contact form (admiral-contact)
├── thank-you.html          # CRITICAL: Conversion tracking page
├── 404.html                # Error page
├── styles.css              # Global styles (cache-busted)
├── netlify.toml            # Deployment config, redirects, headers
├── package.json            # Node dependencies for functions
├── _headers                # Root-level caching rules
│
├── netlify/functions/      # Serverless backend
│   ├── admiral-chat.js     # AI chat (OpenAI GPT-4o-mini with RAG)
│   ├── knowledge-base.js   # Chat knowledge repository (9 Duke Energy topics)
│   ├── send-otp.js         # Twilio SMS verification
│   └── verify-otp.js       # OTP validation
│
├── public/                 # Static assets
│   ├── images/             # Page images
│   ├── logos/              # Brand assets, favicons
│   ├── icons/              # UI icons
│   ├── scripts/            # JS modules
│   │   ├── admiral-chat-ui.js      # Chat widget UI
│   │   ├── admiral-chat.js         # Chat business logic
│   │   └── analytics-helper.js     # Tracking utilities (not yet integrated)
│   └── _headers            # Asset-level caching rules
│
├── docs/                   # DOCUMENTATION HUB
│   ├── PROJECT_MASTER_MEMORY.md    # THIS FILE (always read first)
│   ├── INDEX.md                     # Documentation navigation
│   ├── TRACKING_CONFIGURATION.md   # GTM/GA4/Reddit setup
│   ├── NETLIFY_FORMS_GUIDE.md      # Form implementation patterns
│   ├── ops-checklist.md            # Deployment procedures
│   └── _archive/                    # Old session summaries
│
├── PROGRESS_TRACKER.md     # Task roadmap and status
├── README.md               # Project overview (public-facing)
├── QUICK_START.md          # Developer onboarding
└── check-deployment.ps1    # Automated deployment verification
```

---

## 🚨 CRITICAL SYSTEMS (DO NOT BREAK)

### 1. Netlify Forms Implementation

**Status**: ✅ OPERATIONAL (fixed Oct 30, 2025)

**Critical Pattern** (DO NOT MODIFY without understanding):

```html
<!-- HIDDEN TEMPLATE: Required for Netlify build bot -->
<form name="admiral-contact" netlify netlify-honeypot="bot-field" hidden>
  <!-- ALL 11 FIELDS MUST BE LISTED HERE -->
  <input type="text" name="Full Name" />
  <input type="email" name="Email" />
  <input type="tel" name="Phone" />
  <input type="text" name="Location" />
  <textarea name="Message"></textarea>
  <input type="hidden" name="phone_verified" />
  <input type="hidden" name="utm_source" />
  <input type="hidden" name="utm_medium" />
  <input type="hidden" name="utm_campaign" />
  <input type="hidden" name="utm_term" />
  <input type="hidden" name="utm_content" />
</form>

<!-- VISIBLE FORM: User-facing -->
<form id="admiral-contact-form" name="admiral-contact" 
      method="POST" data-netlify="true">
  <!-- NO action attribute! Prevents Netlify injection -->
  <!-- JavaScript handles submission -->
</form>
```

**Critical JavaScript** (quote.html):
```javascript
const form = document.getElementById('admiral-contact-form'); // ID, not name!
form.addEventListener('submit', function(e) {
  e.preventDefault(); // MUST prevent default
  fetch('/', {
    method: 'POST',
    body: new URLSearchParams(new FormData(form))
  }).then(() => {
    window.location.href = '/thank-you.html' + window.location.search;
  });
});
```

**Why This Architecture**:
1. Hidden form with `netlify` attribute = Build-time field detection
2. Visible form with `data-netlify="true"` = Runtime form processing
3. No `action` attribute = Prevents Netlify default thank-you card injection
4. JavaScript submission = Custom redirect with UTM preservation
5. ID selector (`getElementById`) = Avoids selecting hidden template

**Form ID**: 68f932529a29f700087ea861  
**Fields**: 11 (5 visible + 6 hidden tracking)  
**Submissions Dashboard**: https://app.netlify.com/sites/admiralenergy/forms

### 2. Conversion Tracking (GA4 + Reddit Pixel)

**Status**: ✅ OPERATIONAL (configured Oct 30, 2025)

**GTM Container**: GTM-N6HRP34Z  
**GA4 Property**: G-RX78MRB03L  
**Reddit Pixel**: a2_hpzbegj1w700

**Critical Event**: `generate_lead` (fires on thank-you.html)

```javascript
dataLayer.push({
  event: "generate_lead",
  conversion_data: {
    value: 0,
    currency: "USD",
    transaction_id: "lead_[timestamp]_[random]",
    method: "phone_verified" | "standard"
  },
  lead_context: {
    utm_source, utm_medium, utm_campaign, utm_term, utm_content,
    referrer, landing_page, page_url, page_title, event_id
  },
  ecommerce: { /* Reddit Pixel compatibility */ }
});
```

**GTM Tags**:
1. GA4 Configuration Tag → Initialization trigger (All Pages)
2. GA4 Event Tag → Custom Event trigger (generate_lead)
3. Reddit Pixel Tag 1 → generate_lead only (Lead conversion)
4. Reddit Pixel Tag 2 → All other events with {{Event Name}} variable

**Impact Assessment**: Any changes to thank-you.html must preserve this event structure.

### 3. Admiral Chat Widget

**Status**: ⚠️ ACTIVE (needs mobile positioning fix)

**Backend**: `netlify/functions/admiral-chat.js` (OpenAI GPT-4o-mini)  
**Frontend**: `public/scripts/admiral-chat-ui.js` + `admiral-chat.js`  
**Enabled On**: Pages with `<meta name="admiral-chat-enabled" content="true">`

**Current Issues**:
- Mobile positioning overlaps content
- Needs z-index adjustment
- Consider collapsible state on mobile

**Future Enhancement**: Replace with native chatbot (The Admiral GPT integration)

### 4. OTP Phone Verification

**Status**: ✅ OPERATIONAL (optional feature)

**Backend**: `netlify/functions/send-otp.js` + `verify-otp.js`  
**Provider**: Twilio Verify API  
**Graceful Degradation**: Form works even if OTP fails

**Trial Limitation**: Can only send to verified numbers in Twilio Console

---

## 🔄 DEVELOPMENT WORKFLOW

### Before Making ANY Changes

1. **Read this file (PROJECT_MASTER_MEMORY.md)**
2. **Check PROGRESS_TRACKER.md** for current task
3. **Review related documentation**:
   - Forms → NETLIFY_FORMS_GUIDE.md
   - Tracking → TRACKING_CONFIGURATION.md
   - Deployment → ops-checklist.md

### Impact Assessment Questions (ALWAYS ASK)

Before editing ANY file, ask yourself:

1. **Will this break Netlify Forms?**
   - Touching quote.html or form JavaScript?
   - Changing field names or structure?
   - Modifying submission handler?

2. **Will this break conversion tracking?**
   - Touching thank-you.html?
   - Changing dataLayer events?
   - Modifying GTM triggers?

3. **Will this affect multiple pages?**
   - Navigation changes = 8 files affected
   - Footer changes = 8 files affected
   - Style changes = Check impact on all pages

4. **Will this impact performance?**
   - Adding new CDN scripts?
   - Modifying caching headers?
   - Large images without optimization?

5. **Will this affect accessibility?**
   - Keyboard navigation still works?
   - Screen reader compatibility?
   - Color contrast maintained?

### Deployment Process

1. **Test locally**: `netlify dev` (if using functions)
2. **Verify changes**: Review in browser
3. **Check dependencies**: Are all files updated consistently?
4. **Commit with context**: Clear commit message with task reference
5. **Push to main**: Triggers Netlify deployment
6. **Wait 45 seconds**: Build + deploy time
7. **Verify with script**: `.\check-deployment.ps1`
8. **Test on live site**: Submit form, check tracking

### Verification Checklist

- [ ] Form still captures submissions (check Netlify dashboard)
- [ ] Thank-you page loads correctly (no Netlify injection)
- [ ] GA4 generate_lead event fires (check Realtime)
- [ ] Navigation works on all pages
- [ ] Mobile menu toggles correctly
- [ ] Chat widget functional (if enabled)
- [ ] No console errors

---

## 📋 ACTIVE ROADMAP

### Phase 1: Critical Fixes (In Progress)

**Status**: 2/8 complete

✅ 1.1: ARIA labels for mobile menu (DONE Oct 30)  
⏭️ 1.2: Semantic HTML + skip-to-main link (NEXT)  
⏸️ 1.3: Standardize navigation component  
⏸️ 1.4: Fix inconsistent spacing  
⏸️ 1.5: Validate HTML  
⏸️ 1.6: Fix mobile responsiveness  
⏸️ 1.7: Optimize images  
⏸️ 1.8: Add meta descriptions

**Priority**: Complete Phase 1 before moving to Phase 2

### Phase 2: Important Improvements

- Component-based navigation
- Enhanced accessibility
- Performance optimization
- SEO improvements
- Mobile UX refinements

### Phase 3: Advanced Features

- Native chatbot integration (The Admiral)
- Advanced analytics tracking
- A/B testing infrastructure
- Progressive Web App features
- Offline support

### Future: ChatGPT Integration

**Goal**: Replace OpenAI API chat with custom GPT embed

**Custom GPT URL**: https://chatgpt.com/g/g-68e9759437b8819199422ed61feba90b-the-admiral-your-solar-advisor

**Integration Plan**:
1. Research ChatGPT embed options (iframe vs API)
2. Evaluate vs current OpenAI function implementation
3. Design seamless UI integration on homepage
4. Test conversation quality and context retention
5. Deploy with feature flag for gradual rollout

**Considerations**:
- OpenAI Terms of Service for embedding
- User experience (popup vs inline)
- Mobile responsiveness
- Analytics tracking for chat interactions
- Fallback if GPT unavailable

---

## 🎓 LESSONS LEARNED (MUST REMEMBER)

### Forms

1. **Always use hidden template** with `netlify` attribute (not `data-netlify`)
2. **Never use `action` attribute** on Netlify Forms (causes injection)
3. **Use getElementById** not querySelector (avoids hidden form conflict)
4. **JavaScript submission required** for custom success pages
5. **All fields must be in hidden template** or they won't be captured

### Tracking

1. **Separate GTM tags** for conversions vs engagement (Reddit Pixel)
2. **Use {{Event Name}} variable** for dynamic event tracking
3. **Initialization trigger** for base GA4 tag (early loading)
4. **Custom Event triggers** more reliable than Page View for conversions
5. **Always preserve query params** in redirects (UTM tracking)

### Development

1. **No build step = manual updates** across 8 HTML files
2. **Test form submission** after ANY quote.html changes
3. **Clear browser cache** when testing (Ctrl+Shift+Delete)
4. **Check Netlify deploy logs** if build fails
5. **Use check-deployment.ps1** to verify everything works

### Architecture

1. **Static site trade-offs**: Simplicity vs DRY principle
2. **Progressive enhancement**: Core content must work without JS
3. **Mobile-first design**: Test on small screens first
4. **Accessibility is non-negotiable**: ARIA, semantic HTML, keyboard nav
5. **Performance matters**: Images, scripts, caching

---

## 🔧 COMMON MAINTENANCE TASKS

### Update Navigation (All 8 Pages)

1. Open all 8 HTML files
2. Find `<nav>` section (consistent across all)
3. Make identical changes to each
4. Update aria-labels if adding/removing items
5. Test mobile menu on all pages
6. Commit: `git commit -m "feat: update navigation on all pages"`

### Add New Tracking Event

1. Choose event name (lowercase_with_underscores)
2. Add dataLayer.push() in appropriate HTML file
3. Create Custom Event trigger in GTM
4. Create GA4 Event tag referencing trigger
5. Test in GTM Preview mode
6. Verify in GA4 DebugView
7. Publish GTM container
8. Document in TRACKING_CONFIGURATION.md

### Add Form Field

1. Update hidden template in quote.html (line ~72)
2. Update visible form in quote.html (line ~140+)
3. Ensure field names match exactly
4. Deploy and wait for build
5. Check Netlify Forms dashboard (field count should increase)
6. Test submission includes new field
7. Update NETLIFY_FORMS_GUIDE.md

### Optimize Images

1. Use WebP format for modern browsers
2. Include JPEG fallback for compatibility
3. Compress to <100KB for hero images
4. Use `loading="lazy"` for below-the-fold images
5. Include alt text (accessibility + SEO)
6. Update public/images/ directory
7. Test on mobile data connection

### Fix Accessibility Issue

1. Run WAVE accessibility tool
2. Identify specific WCAG violation
3. Research proper ARIA pattern
4. Implement fix across all affected pages
5. Test with keyboard navigation (Tab key)
6. Test with screen reader (NVDA/JAWS)
7. Re-run WAVE to verify fix
8. Update PROGRESS_TRACKER.md

---

## 📊 KEY PERFORMANCE INDICATORS

### Weekly Monitoring

- **Form Submissions**: Netlify Forms dashboard
- **Conversion Rate**: GA4 → Realtime → generate_lead count
- **Bounce Rate**: GA4 → Reports → Engagement
- **Mobile vs Desktop**: GA4 → Tech → Overview
- **Top Landing Pages**: GA4 → Acquisition → Traffic acquisition

### Monthly Review

- **Lead Quality**: Phone verified % (from form data)
- **UTM Attribution**: Which campaigns drive leads?
- **Page Performance**: Core Web Vitals (PageSpeed Insights)
- **Accessibility Score**: WAVE + Lighthouse audits
- **Chat Engagement**: OpenAI function usage stats

### Quarterly Goals

- Reduce bounce rate by 10%
- Increase form conversion rate by 15%
- Achieve 90+ Lighthouse accessibility score
- Integrate native Admiral chatbot on homepage
- Complete Phase 1 optimization tasks

---

## 🔒 SECURITY & COMPLIANCE

### Environment Variables (Netlify)

**Production Secrets** (never commit to Git):
- `OPENAI_API_KEY`: Admiral chat function
- `TWILIO_ACCOUNT_SID`: OTP verification
- `TWILIO_AUTH_TOKEN`: OTP verification
- `VERIFY_SERVICE_SID`: Twilio Verify service

**Set in**: Netlify Dashboard → Site Settings → Environment Variables

### PII Handling

- **Form Data**: Stored only in Netlify Forms (encrypted at rest)
- **Email/Phone**: NOT sent to GA4 or Reddit Pixel (privacy-first)
- **UTM Parameters**: Safe to track (no PII)
- **Chat Logs**: NOT stored (OpenAI API stateless calls)

### Security Headers

Configured in `_headers` files:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy: (to be enhanced)

---

## 🆘 TROUBLESHOOTING GUIDE

### Form Not Capturing Submissions

**Check**:
1. Hidden template exists with all 11 fields?
2. Field names match exactly (case-sensitive)?
3. Form registered in Netlify dashboard?
4. JavaScript submission handler using getElementById?
5. No `action` attribute on form?

**Fix**: See NETLIFY_FORMS_GUIDE.md → Troubleshooting

### Tracking Not Working

**Check**:
1. GTM container loads (view page source, search for GTM-N6HRP34Z)?
2. dataLayer.push() fires (console log shows event)?
3. GTM tags fire (use GTM Preview mode)?
4. GA4 receives events (check DebugView)?
5. GTM container published (not just preview)?

**Fix**: See TRACKING_CONFIGURATION.md → Debugging

### Netlify Injection Still Appearing

**Check**:
1. Form has NO `action` attribute?
2. JavaScript preventDefault called?
3. Form selector uses getElementById not querySelector?
4. Browser cache cleared?
5. Latest deployment active?

**Fix**: See docs/SESSION_SUMMARY_2025-10-30.md → Emergency Fix 2

### Chat Widget Not Loading

**Check**:
1. Meta tag `admiral-chat-enabled="true"` present?
2. Scripts load correctly (Network tab)?
3. OPENAI_API_KEY set in Netlify?
4. Function deployed (check Functions tab)?
5. Console errors?

**Fix**: See docs/2025-10-22_Chatbot_Implementation_Guide.md

---

## 📞 CONTACTS & RESOURCES

### Key People

- **Technical Owner**: David (david@admiralenergy.ai)
- **Repository**: AdmiralEnergy/admiralenergy-website
- **Hosting**: Netlify (admiralenergy site)

### External Services

- **Netlify**: https://app.netlify.com/sites/admiralenergy
- **GA4**: https://analytics.google.com/ (Property G-RX78MRB03L)
- **GTM**: https://tagmanager.google.com/ (Container GTM-N6HRP34Z)
- **Twilio**: https://console.twilio.com/
- **OpenAI**: https://platform.openai.com/

### Documentation

- **Main Hub**: docs/INDEX.md
- **Quick Start**: QUICK_START.md
- **Roadmap**: PROGRESS_TRACKER.md
- **This File**: docs/PROJECT_MASTER_MEMORY.md

---

## 🔄 MAINTENANCE SCHEDULE

### Daily (Automated)
- Netlify continuous deployment from Git
- Form submission capture
- GA4 data collection

### Weekly (Manual)
- Check form submission count (expect 5-15/week)
- Review GA4 conversion rate
- Check for console errors on live site
- Monitor Netlify function usage (stay within limits)

### Monthly (Manual)
- Review and archive old session summaries
- Update PROGRESS_TRACKER.md task status
- Audit TRACKING_CONFIGURATION.md accuracy
- Check for outdated dependencies (npm audit)
- Review Core Web Vitals (PageSpeed Insights)

### Quarterly (Manual)
- Comprehensive accessibility audit (WAVE + Lighthouse)
- Security review (update dependencies, review headers)
- Performance optimization (image compression, caching)
- Documentation consolidation (remove redundant files)
- Roadmap reassessment (reprioritize tasks)

### Yearly (Manual)
- Complete architecture review
- Consider migration to SSG (Astro/Next.js) if warranted
- Renew/update SSL certificates (auto-renewed by Netlify)
- Brand refresh assessment
- Competitive analysis

---

## 📝 DOCUMENTATION MAINTENANCE

### Active Documents (Keep Updated)

- **docs/PROJECT_MASTER_MEMORY.md** (this file) - Update with ANY architecture changes
- **PROGRESS_TRACKER.md** - Update after completing each task
- **docs/TRACKING_CONFIGURATION.md** - Update when GTM/GA4 changes
- **docs/NETLIFY_FORMS_GUIDE.md** - Update if form pattern changes
- **README.md** - Update for new features or major changes

### Archive Policy

**When to Archive**:
- Session summaries older than 3 months
- Diagnostic reports for resolved issues
- Status snapshots superseded by new ones
- Outdated implementation guides

**Archive Location**: `docs/_archive/YYYY-MM/`

**What to Archive**:
- `SESSION_SUMMARY_*.md` (after info merged into README)
- `DIAGNOSTIC_REPORT.md` (lessons learned documented in guides)
- `2025-10-22_*.md` (date-stamped status snapshots)
- Outdated checklists (after process improved)

### Consolidation Rules

**Eliminate Redundancy**:
- If content exists in 2+ files, keep in most authoritative source
- Delete duplicate checklists (ops-checklist.md vs checklist-chatbot.md)
- Merge similar guides (if overlap >50%)
- Single source of truth for each topic

**Authoritative Sources**:
- Architecture = PROJECT_MASTER_MEMORY.md
- Tasks = PROGRESS_TRACKER.md
- Tracking = docs/TRACKING_CONFIGURATION.md
- Forms = docs/NETLIFY_FORMS_GUIDE.md
- Deployment = docs/ops-checklist.md
- Overview = README.md

---

## 🚀 NEXT ACTIONS

### Immediate (This Session)
- [ ] Archive old diagnostic files to docs/_archive/
- [ ] Consolidate redundant checklists
- [ ] Update PROGRESS_TRACKER.md with ChatGPT integration goal
- [ ] Review OPTIMIZATION_PROMPT.md for relevance

### This Week
- [ ] Enable email notifications for form submissions
- [ ] Verify GTM container published (not preview)
- [ ] Start Task 1.2: Semantic HTML + skip-to-main link

### This Month
- [ ] Complete Phase 1 critical fixes (6 tasks remaining)
- [ ] Research ChatGPT embed options for homepage
- [ ] Integrate analytics-helper.js on all pages
- [ ] Mobile chat widget positioning fix

### This Quarter
- [ ] Native Admiral chatbot integration (replace OpenAI function)
- [ ] Complete Phase 2 improvements
- [ ] Accessibility score 90+
- [ ] Performance score 90+

---

## ✅ FILE STATUS CHECK

**Run this mental checklist before starting work**:

1. Did I read PROJECT_MASTER_MEMORY.md? (this file)
2. Did I check PROGRESS_TRACKER.md for current task?
3. Do I understand which files my changes will affect?
4. Did I ask the impact assessment questions?
5. Do I have a rollback plan if something breaks?
6. Am I ready to test thoroughly after changes?
7. Will I update documentation after completing work?

**If YES to all 7, proceed with confidence.**  
**If NO to any, STOP and review before continuing.**

---

**END OF PROJECT MASTER MEMORY**

**Remember**: This file is the single source of truth for project architecture, decisions, and processes. Update it whenever the architecture changes. Always read it first when returning to this project.

**Last Updated**: October 30, 2025  
**Next Review**: November 15, 2025  
**Version**: 1.0.0
