# Admiral Energy - Quote Form Operations Checklist

## Post-Merge Deployment Steps

### 1. Set Netlify Environment Variables

Navigate to: **Netlify Dashboard → Site Settings → Environment Variables**

Set the following for **both Production and Deploy Preview contexts**:

#### Twilio SMS Verification (Optional)
```
TWILIO_ACCOUNT_SID = [Your Twilio Account SID]
TWILIO_AUTH_TOKEN = [Your Twilio Auth Token]
VERIFY_SERVICE_SID = [Your Twilio Verify Service SID]
```

**Note:** If these are not set, the OTP feature will gracefully degrade and the form will still work without SMS verification.

#### Chatbot (If Using)
```
OPENAI_API_KEY = [Your OpenAI API Key]
```

**Note:** If this is not set, the chatbot will show a friendly error message and stay on the page (no navigation away).

---

### 2. Create Twilio Verify Service (If Not Already Created)

1. Log into Twilio Console: https://console.twilio.com
2. Navigate to **Verify → Services**
3. Click **Create new Service**
4. Name it "Admiral Energy Lead Verification"
5. Copy the **Service SID** (starts with `VA...`)
6. Add this to Netlify environment variables as `VERIFY_SERVICE_SID`

**Important - Trial Account Restrictions:**
- Twilio trial accounts can only send SMS to verified phone numbers
- Verify test numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
- For production use, upgrade to a paid Twilio account

---

### 3. Redeploy Site

After setting environment variables:
1. Go to **Netlify Dashboard → Deploys**
2. Click **Trigger deploy → Clear cache and deploy site**
3. Wait for deployment to complete (~2 minutes)

---

### 4. Test Quote Form

#### Local Testing with `netlify dev`

```bash
# In your repo directory
netlify dev

# Navigate to http://localhost:8888/quote.html
```

**Test checklist:**
- [ ] Form loads with all fields visible
- [ ] Submit button works
- [ ] Redirects to `/thank-you/?ok=1` with HTTP 200
- [ ] Console shows `admiral_contact_submit` event
- [ ] Thank-you page shows `admiral_thankyou_view` event
- [ ] UTM parameters appear in form submission if present in URL

#### OTP Testing (If Twilio Configured)

```bash
# Test send-otp endpoint
curl -X POST https://admiralenergy.ai/.netlify/functions/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+18335551234"}'

# Expected response (success):
{"ok":true}

# Expected response (not configured):
{"ok":false,"reason":"VERIFY_SERVICE_NOT_CONFIGURED","error":"SMS verification is not available at this time"}
```

**Manual OTP test:**
1. Navigate to `/quote.html`
2. Fill in phone number in E.164 format (e.g., `+18335551234`)
3. Click "Verify Phone by Text"
4. Check phone for 6-digit code
5. Enter code and click "Confirm"
6. Verify "Phone Verified" badge appears

**Note:** On trial accounts, you must use a verified phone number or you'll get an error.

---

### 5. Deploy Preview Testing

1. Push changes to a feature branch
2. Netlify auto-creates deploy preview
3. Test all variations of thank-you URL:
   - `/thank-you`
   - `/thank-you/`
   - `/thank-you.html`
   - `/thank-you.html?ok=1`
4. All should render the same page with HTTP 200

---

### 6. Production Testing

After merging to `main`:

1. Visit https://admiralenergy.ai/quote.html
2. Submit test form (use real email you can check)
3. Verify redirect to https://admiralenergy.ai/thank-you/?ok=1
4. Check Netlify Dashboard → Forms to see submission
5. Verify you receive form submission notification email

---

### 7. Google Tag Manager Setup

In GTM, create triggers for these custom events:

#### Event 1: Contact Form Submission
- **Event Name:** `admiral_contact_submit`
- **Use for:** Conversion tracking, remarketing pixels

#### Event 2: Thank You Page View
- **Event Name:** `admiral_thankyou_view`
- **Use for:** Conversion confirmation, analytics goals

Wire these events to:
- Google Ads conversion tracking
- Facebook/Meta pixel
- LinkedIn Insight Tag
- Google Analytics 4 events

---

## Troubleshooting

### Form Redirects to Netlify Error Page

**Cause:** Netlify form handler expects exact form-name match.

**Fix:** Ensure `<input type="hidden" name="form-name" value="admiral-contact">` exists in the form.

---

### 404 on Thank-You Page

**Cause:** Netlify redirect rules not applied or deploy cache issue.

**Fix:**
1. Verify `netlify.toml` is in repo root
2. Clear Netlify cache: Dashboard → Deploys → Trigger deploy → Clear cache
3. Check redirect rules in Dashboard → Site settings → Build & deploy → Post processing

---

### OTP Not Working

**Cause:** Missing environment variables or trial account restrictions.

**Fix:**
1. Verify all 3 Twilio env vars are set in Netlify
2. Ensure phone number is verified in Twilio console (if trial account)
3. Check function logs: Dashboard → Functions → send-otp or verify-otp

---

### Chatbot Shows "Server Hiccup"

**Cause:** Missing `OPENAI_API_KEY` or function error.

**Fix:**
1. Set `OPENAI_API_KEY` in Netlify environment variables
2. Redeploy site
3. The UI will show an inline error but will not navigate away

---

## Quick Reference: Environment Variables Summary

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account identifier for SMS |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio authentication token |
| `VERIFY_SERVICE_SID` | Optional | Twilio Verify service identifier |
| `OPENAI_API_KEY` | Optional | OpenAI API for chatbot functionality |

**Note:** Form submission works even if none of these are set. SMS and chatbot features gracefully degrade.

---

## Success Criteria

✅ Form submits successfully  
✅ Redirects to `/thank-you/` with HTTP 200  
✅ Form data appears in Netlify Dashboard → Forms  
✅ GTM events fire correctly  
✅ UTM parameters are captured  
✅ OTP works (if configured) or gracefully degrades  
✅ No console errors  
✅ Mobile-responsive and accessible  

---

**Last Updated:** 2025-01-XX  
**Maintained By:** Admiral Energy Operations Team
