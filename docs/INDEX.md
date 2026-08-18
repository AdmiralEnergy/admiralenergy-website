# Admiral Energy - Documentation Index

**Last Updated**: October 30, 2025  
**⚠️ CRITICAL: Always read [PROJECT_MASTER_MEMORY.md](PROJECT_MASTER_MEMORY.md) FIRST**

---

## 🎯 START HERE

### For Any Developer/LLM Working on This Project

**1. Read First** (MANDATORY):
- [� PROJECT_MASTER_MEMORY.md](PROJECT_MASTER_MEMORY.md) - Single source of truth for architecture

**2. Then Check**:
- [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md) - Current task and roadmap
- This INDEX.md - Find specific topic documentation

**3. Before Making Changes**:
- Run impact assessment questions (in PROJECT_MASTER_MEMORY.md)
- Review related documentation below
- Check if changes affect multiple files

---

## 📚 Core Documentation (Active)

### Search and Google indexing
- [SEO_SEARCH_INTENT_MAP.md](SEO_SEARCH_INTENT_MAP.md) - Canonical page, query, internal-link, and schema ownership map
- [SEO_SERP_TARGETS.md](SEO_SERP_TARGETS.md) - Target titles, descriptions, visible headings, and measurement plan
- [GOOGLE_REINDEXING_CHECKLIST.md](GOOGLE_REINDEXING_CHECKLIST.md) - Production verification and Search Console owner actions
- [GOOGLE_PRODUCT_DISCOVERY_AUDIT.md](GOOGLE_PRODUCT_DISCOVERY_AUDIT.md) - SideKick merchant and retired-catalog signal audit

### 🚀 Getting Started
- [PROJECT_MASTER_MEMORY.md](PROJECT_MASTER_MEMORY.md) - **READ THIS FIRST** - Architecture, patterns, lessons learned
- [README.md](../README.md) - Project overview and setup
- [QUICK_START.md](../QUICK_START.md) - Developer onboarding
- [ops-checklist.md](ops-checklist.md) - Deployment procedures

### 📋 Planning & Progress
- [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md) - Task roadmap and status
- [OPTIMIZATION_PROMPT.md](OPTIMIZATION_PROMPT.md) - Sequential optimization guidelines (reference)

### 🔧 Technical Implementation

- [COMMERCE_ADMIN.md](COMMERCE_ADMIN.md) - Internal commerce dashboard, Netlify Database, Stripe ingestion, inventory, COGS, and operations

#### **Critical Systems** (Change with Caution)
- [NETLIFY_FORMS_GUIDE.md](NETLIFY_FORMS_GUIDE.md) - Form implementation (hidden template pattern)
- [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md) - GTM/GA4/Reddit Pixel setup
- [GA4_TRACKING_IMPLEMENTATION.md](GA4_TRACKING_IMPLEMENTATION.md) - Analytics tracking system (9 core events currently active)

#### Chatbot & Features  
- [2025-10-22_Chatbot_Implementation_Guide.md](2025-10-22_Chatbot_Implementation_Guide.md) - Current OpenAI chat
- [checklist-chatbot.md](checklist-chatbot.md) - Chatbot deployment steps

### 📦 Archive
- [_archive/2025-10/](_archive/2025-10/) - Old session summaries, diagnostics, status reports

---

## 🎯 Common Tasks

### Deploy a Change
1. Make code changes
2. Run `.\check-deployment.ps1` to verify
3. Commit: `git add . && git commit -m "description"`
4. Push: `git push origin main`
5. Wait 45 seconds for Netlify deploy
6. Run `.\check-deployment.ps1` again to verify

### Fix Form Issues
1. Read [NETLIFY_FORMS_GUIDE.md](NETLIFY_FORMS_GUIDE.md)
2. Check troubleshooting section
3. Verify hidden template exists
4. Test with [check-deployment.ps1](../check-deployment.ps1)

### Configure Tracking
1. Read [GA4_TRACKING_IMPLEMENTATION.md](GA4_TRACKING_IMPLEMENTATION.md) for complete event overview
2. Reference [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md) for GTM setup details
3. Test with GA4 DebugView and GTM Preview mode
4. Verify with browser console for dataLayer events

### Continue Optimization
1. Open [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md)
2. Find ⏭️ NEXT UP task
3. Follow [OPTIMIZATION_PROMPT.md](../OPTIMIZATION_PROMPT.md) guidelines
4. Update tracker when complete

---

## 🏆 Recent Achievements (October 30, 2025)

### ✅ Emergency Fixes Completed
1. **Netlify Forms Capture** - Hidden template pattern (11+ leads recovered)
2. **Thank-You Page Injection** - JavaScript submission handler
3. **Form Selector Conflict** - getElementById fix
4. **GA4 Tracking Enhancement** - Rich conversion context

### ✅ Documentation Created
- **PROJECT_MASTER_MEMORY.md** - Master architecture document (single source of truth)
- **TRACKING_CONFIGURATION.md** - Complete tracking setup
- **NETLIFY_FORMS_GUIDE.md** - Implementation patterns
- **Consolidated & Archived** - Old reports moved to _archive/

### ✅ Systems Operational
- Google Tag Manager: GTM-N6HRP34Z ✅
- Google Analytics 4: G-RX78MRB03L ✅
- Reddit Pixel: a2_hpzbegj1w700 ✅
- Netlify Forms: admiral-contact (11 fields) ✅

### 🎯 Next Priority
- **Task 1.2**: Semantic HTML + skip-to-main link
- **Task 4.1**: Research ChatGPT integration for homepage

---

## 📞 Key Contacts & Resources

### Dashboards
- **Netlify**: https://app.netlify.com/sites/admiralenergy
- **GA4**: https://analytics.google.com/ (Property: G-RX78MRB03L)
- **GTM**: https://tagmanager.google.com/ (Container: GTM-N6HRP34Z)
- **GitHub**: https://github.com/AdmiralEnergy/admiralenergy-website

### Scripts
- **Deployment Check**: `.\check-deployment.ps1` (PowerShell)
- **Pre-Deployment**: [PRE_DEPLOYMENT_CHECKLIST.md](../PRE_DEPLOYMENT_CHECKLIST.md)

### Support
- **Technical Owner**: David (david@admiralenergy.ai)
- **Repository**: AdmiralEnergy/admiralenergy-website
- **Live Site**: https://admiralenergy.ai

---

## 🔄 Document Versions

| Document | Purpose | Last Updated | Status |
|----------|---------|--------------|--------|
| PROJECT_MASTER_MEMORY.md | **Architecture master** | Oct 30, 2025 | ✅ Active |
| TRACKING_CONFIGURATION.md | GTM/GA4/Reddit setup | Oct 30, 2025 | ✅ Active |
| NETLIFY_FORMS_GUIDE.md | Form implementation | Oct 30, 2025 | ✅ Active |
| PROGRESS_TRACKER.md | Task roadmap | Oct 30, 2025 | ✅ Active |
| README.md | Project overview | Oct 30, 2025 | ✅ Active |
| OPTIMIZATION_PROMPT.md | Guidelines (reference) | Oct 30, 2025 | 📋 Reference |
| 2025-10-22_Chatbot_Implementation_Guide.md | Chat setup | Oct 22, 2025 | 📋 Reference |
| _archive/2025-10/* | Old reports | Oct 22-30, 2025 | 📦 Archived |

---

## 🎯 Quick Actions

### Starting Work
1. **Read**: [PROJECT_MASTER_MEMORY.md](PROJECT_MASTER_MEMORY.md)
2. **Check**: [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md) → Find ⏭️ NEXT UP task
3. **Review**: Related documentation for that task

### Making Changes
1. **Ask**: Will this affect forms, tracking, or multiple pages?
2. **Check**: Impact assessment in PROJECT_MASTER_MEMORY.md
3. **Test**: After changes, run `.\check-deployment.ps1`
4. **Update**: Relevant documentation

### Troubleshooting
- **Forms**: See [NETLIFY_FORMS_GUIDE.md](NETLIFY_FORMS_GUIDE.md) → Troubleshooting
- **Tracking**: See [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md) → Debugging
- **Architecture**: See [PROJECT_MASTER_MEMORY.md](PROJECT_MASTER_MEMORY.md) → Troubleshooting Guide

---

**Navigation Tip**: Use Ctrl+F to search this index, or browse the Table of Contents in each document.

---

**End of Documentation Index**
