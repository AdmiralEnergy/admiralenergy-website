# Netlify Forms Implementation Guide

**Last Updated**: October 30, 2025  
**Status**: ✅ Production-Ready

---

## 🎯 Quick Reference

### Form Status
- **Form Name**: admiral-contact
- **Form ID**: 68f932529a29f700087ea861
- **Status**: ✅ Capturing submissions correctly
- **Fields**: 11 (5 visible + 6 hidden)

### Key Files
- **Form Page**: `quote.html`
- **Success Page**: `thank-you.html`
- **Configuration**: `netlify.toml`

---

## 📝 Implementation Pattern

### Required: Hidden Template Form

**Location**: Top of `<body>` tag in `quote.html`

```html
<!-- CRITICAL: Hidden form for Netlify build bot detection -->
<form name="admiral-contact" netlify netlify-honeypot="bot-field" hidden>
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
```

**Why This Matters**:
- Netlify's build bot parses HTML at build time
- Without this, form fields won't be detected
- Must use `netlify` attribute (NOT `data-netlify`)
- Must list ALL fields (visible + hidden)

---

### Required: Visible Form with Unique ID

```html
<form 
    id="admiral-contact-form"
    name="admiral-contact" 
    method="POST" 
    data-netlify="true" 
    netlify-honeypot="bot-field">
    
    <!-- Hidden fields for Netlify -->
    <input type="hidden" name="form-name" value="admiral-contact">
    
    <!-- Honeypot for spam protection -->
    <p class="hidden">
        <label>Don't fill this out: <input name="bot-field"></label>
    </p>
    
    <!-- Visible fields -->
    <input type="text" name="Full Name" required>
    <input type="email" name="Email" required>
    <input type="tel" name="Phone" required>
    <input type="text" name="Location" required>
    <textarea name="Message" required></textarea>
    
    <!-- Hidden tracking fields -->
    <input type="hidden" name="phone_verified" id="phone-verified" value="0">
    <input type="hidden" name="utm_source" id="utm-source">
    <input type="hidden" name="utm_medium" id="utm-medium">
    <input type="hidden" name="utm_campaign" id="utm-campaign">
    <input type="hidden" name="utm_term" id="utm-term">
    <input type="hidden" name="utm_content" id="utm-content">
    
    <button type="submit">Submit</button>
</form>
```

**Key Points**:
- `id="admiral-contact-form"` must be unique
- `name="admiral-contact"` must match hidden template
- NO `action` attribute (prevents Netlify injection)
- `data-netlify="true"` enables form processing
- `form-name` hidden field connects to Netlify backend

---

### Required: JavaScript Submission Handler

**Location**: Bottom of `quote.html` before `</body>`

```javascript
<script>
    // Form Submission Event
    const form = document.getElementById('admiral-contact-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); // CRITICAL: Prevents Netlify default redirect
            
            // Push dataLayer event for GTM
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'admiral_contact_submit',
                formName: 'admiral-contact',
                timestamp: Date.now()
            });

            // Submit form data via fetch
            const formData = new FormData(form);
            
            fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            })
            .then(() => {
                // Redirect to custom thank-you page with query params preserved
                const queryString = window.location.search;
                window.location.href = '/thank-you.html' + queryString;
            })
            .catch((error) => {
                console.error('Form submission error:', error);
                alert('There was an error submitting the form. Please try again.');
            });
        });
    }
</script>
```

**Why This Approach**:
1. `e.preventDefault()` stops Netlify's default behavior
2. `fetch()` submits data to Netlify Forms backend
3. Manual redirect preserves UTM parameters
4. No Netlify injection (clean custom thank-you page)
5. dataLayer event fires before submission

---

## 🚫 Common Mistakes

### ❌ DON'T: Use `action` Attribute
```html
<!-- BAD: Causes Netlify to inject default thank-you card -->
<form action="/thank-you.html" data-netlify="true">
```

**Why**: Netlify intercepts and adds their UI after your custom page.

### ❌ DON'T: Use querySelector with Form Name
```javascript
// BAD: Selects hidden template form
const form = document.querySelector('form[name="admiral-contact"]');
```

**Why**: Hidden template form is first match, event listener attaches to wrong form.

### ❌ DON'T: Use `data-netlify` on Hidden Template
```html
<!-- BAD: Build bot won't detect this -->
<form name="admiral-contact" data-netlify="true" hidden>
```

**Why**: Use `netlify` attribute (no `data-` prefix) for build-time detection.

### ❌ DON'T: Forget Hidden Fields in Template
```html
<!-- BAD: UTM fields won't be captured -->
<form name="admiral-contact" netlify hidden>
    <input type="text" name="Full Name" />
    <input type="email" name="Email" />
    <!-- Missing UTM and phone_verified fields! -->
</form>
```

**Why**: Netlify only captures fields listed in hidden template.

---

## ✅ Correct Implementation Checklist

- [ ] Hidden template form with `netlify` attribute (not `data-netlify`)
- [ ] All 11 fields listed in hidden template
- [ ] Visible form has unique `id="admiral-contact-form"`
- [ ] Visible form has `data-netlify="true"`
- [ ] Visible form has NO `action` attribute
- [ ] `form-name` hidden field matches template name
- [ ] JavaScript uses `getElementById()` to select form
- [ ] `e.preventDefault()` called in submit handler
- [ ] `fetch()` submits to `/` with URL-encoded data
- [ ] Manual redirect to `/thank-you.html` with query params
- [ ] dataLayer event pushed before submission

---

## 🔍 Verification Steps

### 1. Check Form Registration (After Deploy)
```bash
# Using curl
curl https://api.netlify.com/api/v1/sites/admiralenergy/forms

# Or visit Netlify dashboard
https://app.netlify.com/sites/admiralenergy/forms
```

**Expected Result**:
- Form name: admiral-contact
- Form ID: 68f932529a29f700087ea861
- Fields: 11

### 2. Test Form Submission
1. Go to https://admiralenergy.ai/quote
2. Fill out form
3. Click Submit
4. Verify redirect to thank-you page (no Netlify card)
5. Check console for dataLayer event

### 3. Check Netlify Forms Dashboard
1. Go to https://app.netlify.com/sites/admiralenergy/forms
2. Click on admiral-contact
3. Verify submission appears with all field data

### 4. Verify GA4 Tracking
1. Go to https://analytics.google.com/
2. Select property G-RX78MRB03L
3. Click Realtime → Event count by Event name
4. Look for `generate_lead` event (appears within 30 seconds)

---

## 🔧 Troubleshooting

### Form Not Appearing in Netlify Dashboard

**Possible Causes**:
1. Hidden template missing
2. Hidden template uses `data-netlify` instead of `netlify`
3. Form name mismatch between template and visible form
4. Build failed (check deploy logs)

**Solution**:
- Verify hidden template exists
- Check attribute is `netlify` not `data-netlify`
- Ensure names match exactly
- Redeploy site

### Submissions Not Captured

**Possible Causes**:
1. JavaScript submission handler not firing
2. Form selector wrong (selecting hidden form)
3. `e.preventDefault()` not called
4. fetch() failing silently

**Solution**:
- Check console for errors
- Verify `getElementById('admiral-contact-form')` works
- Test form submission with network tab open
- Add `.catch()` error handling

### Netlify Card Still Appearing

**Possible Causes**:
1. `action` attribute still present
2. JavaScript handler not preventing default
3. Form submitting directly without JS
4. Cache not cleared

**Solution**:
- Remove `action` attribute completely
- Verify `e.preventDefault()` is first line in handler
- Check JS file loaded correctly
- Clear browser cache (Ctrl+Shift+Delete)

### Thank-You Page Not Loading

**Possible Causes**:
1. Redirect path incorrect
2. Query params not preserved
3. File doesn't exist at path

**Solution**:
- Check redirect path: `/thank-you.html` (not `/thank-you/`)
- Verify query string concatenation: `+ window.location.search`
- Confirm `thank-you.html` exists at root level

---

## 📧 Email Notifications Setup

To receive email notifications for each submission:

1. Go to https://app.netlify.com/sites/admiralenergy/settings/forms
2. Click "Add notification"
3. Select "Email notification"
4. Enter email: `david@admiralenergy.ai`
5. Choose "New form submission"
6. Save

**Backup**: Check Netlify dashboard daily even with notifications enabled.

---

## 🔒 Security Considerations

### Honeypot Field
- Prevents basic spam bots
- Hidden from users with CSS
- Bots fill it out, Netlify rejects submission

### reCAPTCHA (Optional Future Enhancement)
```html
<form data-netlify="true" data-netlify-recaptcha="true">
  <!-- Form fields -->
  <div data-netlify-recaptcha="true"></div>
</form>
```

### Rate Limiting
- Netlify Forms has built-in rate limiting
- 100 submissions/month on free tier
- Upgrade if exceeding limit

---

## 📊 Analytics Integration

Form submission triggers multiple tracking events:

1. **admiral_contact_submit** (on form page)
   - Fires immediately when user clicks Submit
   - Before redirect
   - Tracks form interaction

2. **generate_lead** (on thank-you page)
   - Fires when thank-you page loads
   - Includes conversion data, UTM params, context
   - Key event in GA4
   - Triggers Reddit Pixel conversion

See [TRACKING_CONFIGURATION.md](TRACKING_CONFIGURATION.md) for full analytics setup.

---

## 🔄 Updating Form Fields

If you need to add/remove fields:

1. **Update hidden template form first**
   ```html
   <form name="admiral-contact" netlify hidden>
     <!-- Add new field here -->
     <input type="text" name="New Field" />
   </form>
   ```

2. **Update visible form**
   ```html
   <form id="admiral-contact-form" data-netlify="true">
     <!-- Add matching field here -->
     <input type="text" name="New Field" />
   </form>
   ```

3. **Deploy and verify**
   - Check Netlify Forms dashboard
   - Field count should increase
   - Test submission includes new field

**Important**: Field names must match EXACTLY (case-sensitive).

---

## 📚 Additional Resources

- [Netlify Forms Docs](https://docs.netlify.com/forms/setup/)
- [Netlify Forms JavaScript](https://docs.netlify.com/forms/setup/#submit-forms-via-ajax)
- [Spam Filtering](https://docs.netlify.com/forms/spam-filters/)
- [Form Notifications](https://docs.netlify.com/forms/notifications/)

---

**End of Netlify Forms Guide**
