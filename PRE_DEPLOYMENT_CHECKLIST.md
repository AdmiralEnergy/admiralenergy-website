# Pre-Deployment Checklist
**Date:** October 30, 2025  
**Changes Ready:** Form fix + GTM optimization + Accessibility improvements

---

## ✅ Code Changes Summary

### 1. **Form Submission Fix** (CRITICAL)
- **File:** `quote.html`
- **Change:** Added hidden static form template for Netlify build bot detection
- **Impact:** Fixes missing form submissions (11+ leads lost Oct 26-30)
- **Status:** ✅ Code complete, tested locally

### 2. **GTM & Reddit Pixel Optimization**
- **File:** `thank-you.html`
- **Changes:**
  - Enhanced `generate_lead` event with conversion data
  - Added referrer and landing page tracking
  - Improved debug logging
  - Consolidated event scripts
- **Impact:** Better tracking, cleaner data for GA4 and Reddit
- **Status:** ✅ Code complete

### 3. **Accessibility Improvements** (Task 1.1)
- **Files:** All 8 HTML files (index, about, services, powerpair, case-studies, quote, thank-you, 404)
- **Changes:**
  - Added `aria-label="Toggle mobile menu"` to all mobile menu buttons
  - Added `aria-expanded="false"` attribute
  - Added `aria-controls="mobile-menu"` attribute
  - Updated JavaScript to toggle `aria-expanded` on click
- **Impact:** Screen reader accessibility improved
- **Status:** ✅ Code complete

### 4. **Analytics Helper Script** (NEW)
- **File:** `public/scripts/analytics-helper.js`
- **Features:**
  - Landing page capture
  - Referrer tracking
  - UTM persistence
  - Scroll depth tracking
  - Phone/email/Calendly click tracking
  - Outbound link tracking
- **Impact:** Richer analytics data for optimization
- **Status:** ✅ Created, NOT YET ADDED to HTML pages

### 5. **Documentation Updates**
- **Files:** 
  - `PROGRESS_TRACKER.md` - Updated (Task 1.1 complete)
  - `DIAGNOSTIC_REPORT.md` - Created (form debugging)
  - `FORM_DIAGNOSIS_SUMMARY.md` - Created (quick reference)
  - `check-deployment.ps1` - Created (diagnostic tool)
- **Impact:** Better project management and debugging
- **Status:** ✅ Complete

---

## 📋 Pre-Deployment Tasks

### Phase 1: Verification (DO BEFORE COMMIT)

- [ ] **Test form locally**
  - Open `/quote.html` in browser
  - Fill out form with test data
  - Submit and verify redirect to `/thank-you/`
  - Check browser console for dataLayer events
  - Verify no JavaScript errors

- [ ] **Test mobile menu accessibility**
  - Open any page in browser
  - Open mobile viewport (375px)
  - Click mobile menu button
  - Verify menu opens/closes
  - Check `aria-expanded` toggles in dev tools

- [ ] **Verify GTM tracking**
  - Open `/thank-you/` directly
  - Check browser console for "✅ generate_lead event pushed"
  - Verify event includes UTM params, referrer, landing page

- [ ] **Check for console errors**
  - Visit all 8 pages
  - Open dev tools console
  - Verify no errors on any page

- [ ] **Validate HTML** (optional but recommended)
  - Run through https://validator.w3.org/
  - Fix any critical errors

### Phase 2: Documentation (BEFORE COMMIT)

- [ ] **Move diagnostic files to docs/**
  ```powershell
  Move-Item DIAGNOSTIC_REPORT.md docs/
  Move-Item FORM_DIAGNOSIS_SUMMARY.md docs/
  ```

- [ ] **Update README.md**
  - Add note about form fix (Oct 30)
  - Add GTM configuration section
  - Add analytics-helper.js documentation
  - Update troubleshooting section

- [ ] **Update .gitignore** (if needed)
  - Verify NewFiles/ and _archive/ still excluded
  - Add any new temp files

### Phase 3: Git Commit (ORGANIZE CHANGES)

Since you have multiple changes, commit them separately for clean history:

#### Commit 1: Form Fix (CRITICAL - Priority)
```powershell
git add quote.html
git commit -m "fix: netlify forms not capturing submissions

- Added hidden static form template for build bot detection
- Form now properly registered with Netlify Forms
- Fixes 11+ missing submissions from Oct 26-30"
```

#### Commit 2: GTM Tracking Improvements
```powershell
git add thank-you.html
git commit -m "feat: enhance GA4 and Reddit Pixel tracking

- Added conversion_data object to generate_lead event
- Added referrer and landing_page tracking
- Consolidated tracking scripts for better performance
- Enhanced debug logging with UTM parameters"
```

#### Commit 3: Accessibility Improvements
```powershell
git add index.html about.html services.html powerpair.html case-studies.html quote.html thank-you.html 404.html
git commit -m "feat: add ARIA labels for mobile menu accessibility

- Added aria-label='Toggle mobile menu' to all pages
- Added aria-expanded and aria-controls attributes
- Updated JavaScript to toggle aria-expanded on click
- Improves screen reader experience (Task 1.1 complete)"
```

#### Commit 4: Analytics Helper & Documentation
```powershell
git add public/scripts/analytics-helper.js PROGRESS_TRACKER.md docs/ check-deployment.ps1
git commit -m "docs: add analytics helper and diagnostic tools

- Created analytics-helper.js for enhanced tracking
- Updated PROGRESS_TRACKER.md (Task 1.1 complete)
- Added diagnostic reports to docs/
- Created check-deployment.ps1 diagnostic script"
```

### Phase 4: Netlify Deployment

- [ ] **Push to GitHub**
  ```powershell
  git push origin main
  ```

- [ ] **Monitor Netlify Deployment**
  - Visit: https://app.netlify.com/sites/admiralenergy/deploys
  - Wait for deploy to complete (usually 1-2 minutes)
  - Check for any build errors

- [ ] **Verify Form Registration**
  - Visit: https://app.netlify.com/sites/admiralenergy/forms
  - Confirm `admiral-contact` form is listed
  - Check field count (should show 11 fields)

- [ ] **Test Live Form Submission**
  - Visit: https://admiralenergy.ai/quote
  - Submit test form with unique identifier ("Test Deploy Oct30")
  - Check Netlify Forms dashboard
  - Verify submission appears within 30 seconds

- [ ] **Enable Form Notifications** (IMPORTANT)
  - Visit: https://app.netlify.com/sites/admiralenergy/settings/forms
  - Enable email notifications
  - Add email: `david@admiralenergy.ai`
  - This ensures you get leads even if dashboard breaks again

### Phase 5: GTM Publishing

- [ ] **Test GTM in Preview Mode**
  - Open GTM container
  - Click "Preview"
  - Submit test form on live site
  - Verify in GTM Preview panel:
    - `generate_lead` event fires
    - GA4 tag fires
    - Reddit Pixel tag fires (both tags)

- [ ] **Publish GTM Container**
  - Click "Submit" in GTM
  - Add version name: "Oct 30 2025 - Enhanced tracking + Reddit pixel optimization"
  - Add description: "Custom event triggers for GA4, separate Reddit tags for conversions vs engagement"
  - Click "Publish"

- [ ] **Verify Live Tracking**
  - Submit another test form
  - Check GA4 DebugView (real-time events)
  - Check Reddit Events Manager
  - Verify both show the conversion

### Phase 6: Post-Deployment Verification

- [ ] **Check All Pages Load**
  - Visit all 8 pages
  - Verify no 404s or broken links
  - Check mobile menu works on all pages

- [ ] **Verify Analytics**
  - Submit 2-3 test forms over next hour
  - Confirm all appear in Netlify dashboard
  - Confirm GA4 shows events
  - Confirm Reddit tracks events

- [ ] **Monitor for Errors**
  - Check Netlify function logs for any errors
  - Monitor email for form submissions
  - Review GTM debug panel for any issues

---

## 🚨 CRITICAL: If Form Still Doesn't Work

If test submissions still don't appear in Netlify after deployment:

### Troubleshooting Steps:

1. **Run Diagnostic Script**
   ```powershell
   .\check-deployment.ps1
   ```

2. **Check Netlify toml Redirects**
   - Edit `netlify.toml` lines 23-36
   - Change `status = 200` to `status = 302`
   - Change `force = true` to `force = false`
   - Commit and redeploy

3. **Contact Netlify Support**
   - URL: https://answers.netlify.com/
   - Include Site ID: `c19958dc-f3e2-4cdb-bd30-9da6d31e8da9`
   - Include Form ID: `68f932529a29f700087ea861`
   - Explain: Users reaching thank-you page but form data not captured

---

## 📊 Success Criteria

### Minimum Requirements (MUST PASS):
- ✅ Form submissions appear in Netlify dashboard
- ✅ Email notification received for test submission
- ✅ `generate_lead` event fires in GA4
- ✅ Reddit Pixel tracks conversion
- ✅ Mobile menu works on all pages
- ✅ No console errors on any page

### Optimal Results (NICE TO HAVE):
- ✅ All 3 test submissions captured
- ✅ GTM Preview shows clean event flow
- ✅ Screen reader properly announces mobile menu
- ✅ Analytics helper tracking engagement events

---

## 🎯 Post-Deployment Next Steps

After successful deployment:

1. **Resume Optimization Work**
   - Continue with Task 1.2 (Semantic HTML)
   - Follow PROGRESS_TRACKER.md sequentially

2. **Add Analytics Helper to Pages** (Optional - can be separate deploy)
   - Add `<script src="/public/scripts/analytics-helper.js"></script>` before GTM on all pages
   - Test scroll tracking and click tracking
   - Create GTM tags for new events

3. **Monitor Form Submissions**
   - Check dashboard daily
   - Respond to leads within 24 hours
   - Track conversion rate improvements

4. **Lead Recovery Attempt** (if time permits)
   - Check Reddit Events Manager for any captured data from Oct 26-30
   - Review GA4 for any recoverable information
   - Cross-reference with email inquiries

---

## 📝 Deployment Log

### Deployment 1: October 30, 2025
**Status:** Pending  
**Commit SHA:** ___ (fill in after commit)  
**Deploy Time:** ___ (fill in after deploy)  
**Form Test Result:** ___ (PASS/FAIL)  
**Notes:** ___

**Issues Encountered:**
- None yet

**Resolution:**
- N/A

---

**Created:** October 30, 2025  
**Last Updated:** October 30, 2025  
**Approved By:** David Edwards  
**Ready for Production:** ✅ YES (pending tests)
