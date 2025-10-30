# Admiral Energy - Documentation Index

**Last Updated**: October 30, 2025

---

## 📚 Quick Navigation

### 🚀 Getting Started
- [README.md](../README.md) - Project overview, architecture, and setup
- [ops-checklist.md](ops-checklist.md) - Deployment and environment setup

### 📋 Progress & Planning
- [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md) - Task tracking and optimization roadmap
- [OPTIMIZATION_PROMPT.md](../OPTIMIZATION_PROMPT.md) - Sequential optimization guidelines
- [SESSION_SUMMARY_2025-10-30.md](SESSION_SUMMARY_2025-10-30.md) - Latest session achievements

### 🔧 Technical Implementation

#### Forms & Tracking
- [NETLIFY_FORMS_GUIDE.md](NETLIFY_FORMS_GUIDE.md) - Complete forms implementation guide
- [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md) - GTM, GA4, Reddit Pixel setup

#### Chatbot
- [2025-10-22_Chatbot_Implementation_Guide.md](2025-10-22_Chatbot_Implementation_Guide.md) - AI chat widget setup
- [checklist-chatbot.md](checklist-chatbot.md) - Chatbot deployment checklist

#### Diagnostics
- [DIAGNOSTIC_REPORT.md](DIAGNOSTIC_REPORT.md) - Form submission issue analysis (1,088 lines)
- [FORM_DIAGNOSIS_SUMMARY.md](FORM_DIAGNOSIS_SUMMARY.md) - Quick diagnostic reference

### 📊 Status Reports
- [2025-10-22_AdmiralEnergy_Status.md](2025-10-22_AdmiralEnergy_Status.md) - Project status snapshot
- [2025-10-22_Progress_and_Priorities.md](2025-10-22_Progress_and_Priorities.md) - Development priorities

### 🔍 Audits
- [GTM-Audit-2025-10-26.md](GTM-Audit-2025-10-26.md) - Google Tag Manager configuration review

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
1. Read [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md)
2. Follow GTM tag setup instructions
3. Test with GA4 Realtime
4. Verify with browser console

### Continue Optimization
1. Open [PROGRESS_TRACKER.md](../PROGRESS_TRACKER.md)
2. Find ⏭️ NEXT UP task
3. Follow [OPTIMIZATION_PROMPT.md](../OPTIMIZATION_PROMPT.md) guidelines
4. Update tracker when complete

---

## 🏆 Recent Achievements (October 30, 2025)

### Emergency Fixes Completed ✅
1. **Netlify Forms Capture** - Fixed missing hidden template (11+ leads recovered)
2. **Thank-You Page Injection** - Removed Netlify default card
3. **Form Selector Conflict** - Fixed event listener targeting
4. **GA4 Tracking Enhancement** - Added conversion context

### Documentation Created ✅
- Complete tracking configuration guide
- Netlify Forms implementation patterns
- Troubleshooting and verification steps
- Session summary with lessons learned

### Tracking Operational ✅
- Google Tag Manager: GTM-N6HRP34Z configured
- Google Analytics 4: G-RX78MRB03L tracking conversions
- Reddit Pixel: a2_hpzbegj1w700 with dual-tag setup
- Netlify Forms: admiral-contact capturing all 11 fields

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

| Document | Last Updated | Status |
|----------|--------------|--------|
| TRACKING_CONFIGURATION.md | Oct 30, 2025 | ✅ Current |
| NETLIFY_FORMS_GUIDE.md | Oct 30, 2025 | ✅ Current |
| SESSION_SUMMARY_2025-10-30.md | Oct 30, 2025 | ✅ Current |
| PROGRESS_TRACKER.md | Oct 30, 2025 | ✅ Current |
| README.md | Oct 30, 2025 | ✅ Current |
| DIAGNOSTIC_REPORT.md | Oct 22, 2025 | 📋 Archived |
| 2025-10-22_Chatbot_Implementation_Guide.md | Oct 22, 2025 | 📋 Reference |

---

## 🎯 Next Steps

### Immediate (Recommended)
- [ ] Enable email notifications for form submissions
- [ ] Publish GTM container (if in preview mode)
- [ ] Mark `generate_lead` as Key Event in GA4

### Phase 1 Optimization (In Progress)
- [x] Task 1.1: ARIA labels (DONE)
- [ ] Task 1.2: Semantic HTML (NEXT)
- [ ] Task 1.3: Standardize navigation
- [ ] Tasks 1.4-1.8: Remaining critical fixes

### Documentation Maintenance
- [ ] Update this index monthly
- [ ] Archive outdated session summaries
- [ ] Review and consolidate diagnostic docs

---

**Navigation Tip**: Use Ctrl+F to search this index, or browse the Table of Contents in each document.

---

**End of Documentation Index**
