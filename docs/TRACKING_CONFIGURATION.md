# Tracking & Analytics Configuration

**Last Updated**: October 30, 2025  
**Status**: ✅ Fully Operational  

---

## 📊 Overview

Admiral Energy uses a comprehensive tracking stack to monitor conversions, user behavior, and marketing attribution.

### Tracking Stack
- **Google Tag Manager (GTM)**: Container GTM-N6HRP34Z
- **Google Analytics 4 (GA4)**: Property G-RX78MRB03L
- **Reddit Pixel**: a2_hpzbegj1w700
- **Netlify Forms**: admiral-contact (ID: 68f932529a29f700087ea861)

---

## 🏷️ Google Tag Manager Configuration

### Container: GTM-N6HRP34Z

#### Tags

##### 1. GA4 Configuration Tag (Base Tag)
- **Type**: Google Tag (GA4)
- **Measurement ID**: G-RX78MRB03L
- **Trigger**: Initialization - All Pages
- **Purpose**: Base GA4 tracking for pageviews and automatic events

##### 2. GA4 Event - generate_lead
- **Type**: GA4 Event
- **Event Name**: generate_lead
- **Trigger**: Custom Event (event equals "generate_lead")
- **Configuration Tag**: GA4 Configuration Tag
- **Purpose**: Tracks form conversion events from thank-you page

##### 3. Reddit Pixel - Conversions (generate_lead only)
- **Type**: Custom HTML
- **Trigger**: Custom Event (event equals "generate_lead")
- **Purpose**: Track lead conversions on Reddit Ads
- **Configuration**:
  ```javascript
  <script>
  rdt('track', 'Lead', {
    customEventName: 'generate_lead',
    value: 0,
    currency: 'USD'
  });
  </script>
  ```

##### 4. Reddit Pixel - Other Events
- **Type**: Custom HTML
- **Trigger**: Custom Event (event matches regex `.+` but NOT "generate_lead")
- **Purpose**: Track all other events (page views, engagement, etc.)
- **Configuration**:
  ```javascript
  <script>
  rdt('track', 'Custom', {
    customEventName: {{Event Name}}
  });
  </script>
  ```
- **Uses GTM Variable**: `{{Event Name}}` for dynamic event tracking

#### Triggers

##### Custom Event - generate_lead
- **Type**: Custom Event
- **Event Name**: generate_lead
- **Fires On**: All Custom Events where event equals "generate_lead"

##### Custom Event - All Others (Regex)
- **Type**: Custom Event
- **Event Name**: Matches RegEx `.+`
- **Exception**: Does NOT match "generate_lead"
- **Fires On**: All other custom events

##### Initialization - All Pages
- **Type**: Initialization
- **Fires On**: All Pages
- **Purpose**: Load GA4 base configuration immediately

#### Variables

##### Event Name (Built-in)
- **Type**: Event
- **Variable Name**: Event Name
- **Purpose**: Captures the custom event name from dataLayer
- **Used In**: Reddit Pixel - Other Events tag

---

## 📈 Google Analytics 4 Configuration

### Property: G-RX78MRB03L

#### Key Events (Conversions)
- ✅ **generate_lead**: Marked as Key Event
  - Tracks when user reaches thank-you page after form submission
  - Includes conversion_data, user_data, ecommerce, and lead_context

#### Event Parameters

##### generate_lead Event Structure
```javascript
{
  event: "generate_lead",
  user_data: {
    email_address: "",
    phone_number: ""
  },
  conversion_data: {
    value: 0,
    currency: "USD",
    transaction_id: "lead_[timestamp]_[random]",
    method: "phone_verified" | "standard"
  },
  ecommerce: {
    value: 0,
    currency: "USD",
    items: [{
      item_id: "lead_form",
      item_name: "Solar Consultation",
      item_category: "Lead",
      price: 0,
      quantity: 1
    }]
  },
  lead_context: {
    page_url: "https://admiralenergy.ai/thank-you.html?...",
    page_title: "Message Sent - Thank You | Admiral Energy",
    event_id: "lead_[timestamp]_[random]",
    utm_source: "...",
    utm_medium: "...",
    utm_campaign: "...",
    utm_term: "...",
    utm_content: "...",
    referrer: "...",
    landing_page: "/quote" or "/"
  }
}
```

#### Automatic Events (Enhanced Measurement)
- page_view
- scroll
- form_start
- form_submit
- user_engagement
- session_start

#### Custom Events
- **admiral_contact_submit**: Fired when form is submitted (before redirect)
- **admiral_thankyou_view**: Fired when thank-you page loads

---

## 🎯 Reddit Pixel Configuration

### Pixel ID: a2_hpzbegj1w700

#### Base Pixel Code (Installed on All Pages)
```html
<script>
!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
rdt('init','a2_hpzbegj1w700', {"optOut":false,"useDecimalCurrencyValues":true});
rdt('track', 'PageVisit');
</script>
```

#### Conversion Events
- **Event Type**: Lead
- **Custom Event Name**: generate_lead
- **Value**: 0 (lead generation, no monetary value)
- **Currency**: USD
- **Trigger**: GTM Custom Event "generate_lead"

#### Engagement Events
- **Event Type**: Custom
- **Custom Event Name**: Dynamic from dataLayer (e.g., "admiral_thankyou_view")
- **Trigger**: All custom events except "generate_lead"

---

## 📝 Netlify Forms Configuration

### Form: admiral-contact
- **Form ID**: 68f932529a29f700087ea861
- **Status**: ✅ Active
- **Submissions**: Capturing correctly
- **Fields**: 11 total

#### Form Fields
1. Full Name (text)
2. Email (email)
3. Phone (tel)
4. Location (text)
5. Message (textarea)
6. phone_verified (hidden) - OTP verification status
7. utm_source (hidden)
8. utm_medium (hidden)
9. utm_campaign (hidden)
10. utm_term (hidden)
11. utm_content (hidden)

#### Form Implementation Architecture

##### Hidden Template Form (for Netlify Build Detection)
```html
<form name="admiral-contact" netlify netlify-honeypot="bot-field" hidden>
  <!-- All 11 fields listed here for build-time detection -->
</form>
```

##### Visible Form (User-Facing)
```html
<form 
  id="admiral-contact-form"
  name="admiral-contact" 
  method="POST" 
  data-netlify="true" 
  netlify-honeypot="bot-field">
  <!-- Form fields here -->
</form>
```

#### JavaScript Form Submission Handler

**Critical Implementation Detail**: Form submission is handled via JavaScript to prevent Netlify's default thank-you page injection.

```javascript
const form = document.getElementById('admiral-contact-form');
form.addEventListener('submit', function(e) {
  e.preventDefault(); // CRITICAL: Prevents Netlify default redirect
  
  // Push dataLayer event
  dataLayer.push({
    event: 'admiral_contact_submit',
    formName: 'admiral-contact',
    timestamp: Date.now()
  });

  // Submit via fetch
  const formData = new FormData(form);
  fetch('/', {
    method: 'POST',
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
  .then(() => {
    // Manual redirect to custom thank-you page
    window.location.href = '/thank-you.html' + window.location.search;
  })
  .catch((error) => {
    console.error('Form submission error:', error);
    alert('There was an error submitting the form. Please try again.');
  });
});
```

**Why This Approach?**
1. Netlify Forms has a default behavior that injects their success card
2. Using `action="/thank-you.html"` caused double content (custom page + Netlify card)
3. JavaScript submission + manual redirect prevents injection
4. Form data still captured by Netlify Forms backend
5. User sees only custom thank-you page with GTM tracking

---

## 🚨 Known Issues & Solutions

### Issue #1: Netlify Forms Not Capturing Submissions
**Discovered**: October 26-30, 2025 (11+ leads lost)

#### Root Cause
- Missing hidden static form template
- Netlify's build bot couldn't detect form fields without static HTML

#### Solution
- Added hidden form with `netlify` attribute (not `data-netlify`)
- Listed all 11 fields in hidden form for build-time detection
- Visible form uses `data-netlify="true"`

#### Verification
```bash
# Check form registration
curl https://api.netlify.com/api/v1/sites/admiralenergy/forms
```

### Issue #2: Netlify Default Thank-You Card Injection
**Discovered**: October 30, 2025

#### Root Cause
- Using `action="/thank-you.html"` triggered Netlify's form success handler
- Netlify injected their default "Thank you!" card after closing `</html>` tag
- Custom tracking code on thank-you page never fired

#### Solution
1. Removed `action` attribute from form
2. Added `id="admiral-contact-form"` to visible form
3. Implemented JavaScript form submission handler with `e.preventDefault()`
4. Submit via `fetch()` to Netlify Forms endpoint
5. Manual redirect to `/thank-you.html` after successful submission

#### Key Learning
- **NEVER use `action` attribute with Netlify Forms** if you need custom success pages
- **Use getElementById()** instead of querySelector() to avoid selecting hidden template form
- **Manual redirect preserves query parameters** for UTM tracking

### Issue #3: Form Selector Conflict
**Discovered**: October 30, 2025

#### Root Cause
- `querySelector('form[name="admiral-contact"]')` selected hidden template form
- Event listener attached to wrong form
- Submissions still went through Netlify's default flow

#### Solution
- Changed to `getElementById('admiral-contact-form')`
- Explicitly targets visible form by unique ID
- Hidden template has no ID attribute

---

## 🔍 Debugging & Verification

### Check GA4 Tracking (Realtime)
1. Go to https://analytics.google.com/
2. Select property G-RX78MRB03L
3. Click **Realtime** in left sidebar
4. Look for **Event count by Event name**
5. Verify `generate_lead` appears after form submission

### Check GA4 Tracking (DebugView)
1. Install [GA Debugger Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger)
2. Enable debug mode
3. Submit form
4. Go to GA4 → Configure → DebugView
5. See detailed event parameters

### Check Browser Console
After submitting form and landing on thank-you page:
```javascript
// Should see this log:
✅ generate_lead event pushed to dataLayer

// Check dataLayer contents:
console.log(dataLayer);

// Should include generate_lead event with all parameters
```

### Check GTM Preview Mode
1. Go to https://tagmanager.google.com/
2. Open workspace
3. Click **Preview**
4. Enter: https://admiralenergy.ai/quote
5. Submit form
6. Verify tags fire on thank-you page:
   - GA4 Event - generate_lead ✅
   - Reddit Pixel - Conversions ✅

### Check Netlify Forms Dashboard
1. Go to https://app.netlify.com/sites/admiralenergy/forms
2. Click on **admiral-contact** form
3. Verify submissions are appearing
4. Check field data is captured correctly

### Automated Deployment Check Script
```powershell
# Run from repository root
.\check-deployment.ps1

# Checks:
# - Latest deployment status
# - Form registration
# - Field count (should be 11)
# - Submission count
```

---

## 📊 Analytics Reports & Dashboards

### Where to Find Conversion Data

#### GA4 Realtime (Fastest - 10-30 seconds)
**Path**: Analytics → Realtime → Event count by Event name  
**Shows**: Live events including `generate_lead`  
**Use For**: Immediate verification after form submission

#### GA4 DebugView (Most Detailed)
**Path**: Analytics → Configure → DebugView  
**Requires**: GA Debugger browser extension enabled  
**Shows**: Full event parameters, user properties, errors  
**Use For**: Troubleshooting tracking issues

#### GA4 Events Report (24-48 hour delay)
**Path**: Analytics → Reports → Engagement → Events  
**Shows**: Historical event counts, conversions  
**Use For**: Weekly/monthly reporting

#### GA4 Conversions (24-48 hour delay)
**Path**: Analytics → Reports → Engagement → Conversions  
**Shows**: Key events marked as conversions  
**Use For**: Marketing ROI analysis

#### Netlify Forms Dashboard
**Path**: app.netlify.com → Sites → admiralenergy → Forms  
**Shows**: Raw form submissions with all field data  
**Use For**: Lead follow-up, backup data source

---

## 🔐 Security & Privacy

### PII Handling
- **Email/Phone**: NOT sent to GA4 or Reddit Pixel
- **Form Data**: Stored only in Netlify Forms (encrypted at rest)
- **UTM Parameters**: Safe to track (no PII)

### Reddit Pixel User Matching
Currently disabled (blank user_data fields):
```javascript
user_data: {
  email_address: "", // Empty - privacy first
  phone_number: ""   // Empty - privacy first
}
```

**Future Enhancement**: If needed, hash PII client-side before sending:
```javascript
// Example: SHA-256 hashing
const hashedEmail = await crypto.subtle.digest('SHA-256', 
  new TextEncoder().encode(email.toLowerCase().trim())
);
```

---

## 🎯 Future Enhancements

### Recommended Additions

1. **Google Ads Conversion Tracking**
   - Add Google Ads Conversion tag to GTM
   - Fire on generate_lead event
   - Track conversion value and attribution

2. **Facebook Pixel**
   - Similar dual-tag setup as Reddit Pixel
   - Lead event for conversions
   - Custom events for engagement

3. **Server-Side GTM**
   - More reliable tracking (bypasses ad blockers)
   - Better attribution with first-party data
   - Enhanced PII security

4. **Enhanced E-commerce Tracking**
   - Track quote values when available
   - Revenue attribution for closed deals
   - Lifetime value analysis

5. **Session Recording**
   - Hotjar or Microsoft Clarity
   - Understand user behavior on forms
   - Identify friction points

---

## 📞 Support Contacts

**GTM Container**: Ask David for access  
**GA4 Property**: david@admiralenergy.ai has admin access  
**Reddit Ads**: Check Reddit Ads Manager → Pixel section  
**Netlify Forms**: Site owner has full access  

---

## 🔄 Change Log

### October 30, 2025
- ✅ Fixed Netlify Forms submission capture (added hidden template)
- ✅ Fixed thank-you page injection (JavaScript submission handler)
- ✅ Fixed form selector conflict (ID instead of name)
- ✅ Configured Reddit Pixel dual-tag setup in GTM
- ✅ Enhanced generate_lead event with conversion_data and lead_context
- ✅ Verified GA4 tracking working end-to-end
- ✅ Documented all tracking configuration

### October 26-30, 2025
- ⚠️ 11+ form submissions lost due to missing hidden template form
- 🔍 Diagnostic investigation revealed build-time detection issue

---

**End of Tracking Configuration Documentation**
