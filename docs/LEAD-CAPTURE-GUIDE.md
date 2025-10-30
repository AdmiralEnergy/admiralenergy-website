# Admiral Chat - Lead Capture System

## How It Works

### User Experience Flow:
1. User chats with The Admiral about solar/battery systems
2. When user shows buying intent (asks about pricing, timeline, or says "interested"), bot offers consultation
3. Bot asks user to confirm with "CONTACT_FORM"
4. Chat displays inline form (name, email, phone)
5. User submits → Success message → Conversation continues

### Buying Intent Keywords:
The chatbot detects these signals:
- "price", "cost", "quote"
- "schedule", "appointment"
- "interested", "next steps"
- "how much", "what's the cost"
- "when can you", "timeline"

### What Gets Captured:
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "919-555-0123",
  "context": "Last 6 messages from conversation",
  "source": "Admiral Chat Widget",
  "page": "/powerpair.html"
}
```

### Where Leads Go:
**Netlify Forms Dashboard**
- View in: Netlify Dashboard → Forms → "chat-lead-capture"
- Get email notifications (configure in Netlify Forms settings)
- Export to CSV anytime
- Integrate with Zapier for CRM automation

**How to Access:**
1. Log into Netlify Dashboard
2. Select your site (admiralenergy-website)
3. Go to "Forms" in left sidebar
4. Click on "chat-lead-capture" form
5. See all submissions with timestamps

**Enable Email Notifications:**
1. Netlify Dashboard → Forms → Form notifications
2. Add your email address
3. Get instant alerts when leads come in

### Analytics Tracking:
Every lead fires this GA4 event:
```javascript
{
  event: 'generate_lead',
  source: 'admiral_chat',
  lead_type: 'chat_contact_form',
  page: window.location.pathname
}
```

View in GA4: Reports → Engagement → Events → `generate_lead`

### Testing:
1. Open chat on your site
2. Type: "What's the cost of a PowerPair system?"
3. Bot will offer consultation
4. Reply with: "CONTACT_FORM" (or just show interest)
5. Fill out form and submit
6. Check Netlify Dashboard → Forms → chat-lead-capture

### Files Modified:
- `index.html` - Added hidden form for Netlify build bot detection
- `netlify/functions/admiral-chat.js` - Updated chatbot prompt with lead detection
- `public/scripts/admiral-chat-ui.js` - Form submits to Netlify Forms
- `netlify/functions/capture-lead.js` - Optional: can be removed or used for additional processing

### Technical Details:
- Form submission uses `application/x-www-form-urlencoded` (Netlify Forms standard)
- Hidden form in HTML allows Netlify build process to detect the form
- JavaScript form submits to `/` endpoint which Netlify intercepts
- No serverless function needed - Netlify Forms handles everything
- Spam protection built-in via Netlify

### Future Enhancements:
- [ ] Enable Zapier integration (Netlify Forms → your CRM)
- [ ] Add Slack notifications for instant lead alerts
- [ ] Integrate with Calendly for instant booking
- [ ] Add lead scoring based on conversation depth
- [ ] Auto-respond with confirmation email via Netlify Functions
- [ ] A/B test different form copy/designs

---

## Quick Start: Enable Email Notifications

**Easiest Way (Built into Netlify):**
1. Go to Netlify Dashboard
2. Site Settings → Forms → Form notifications
3. Click "Add notification"
4. Select "Email notification"
5. Enter your email address
6. Choose form: "chat-lead-capture"
7. Save!

You'll now get an email every time someone submits the chat form.

## Optional: Zapier Integration

**Connect to 2,000+ Apps:**
1. Netlify Dashboard → Forms → Form notifications
2. Click "Add notification" → "Outgoing webhook"
3. Enter your Zapier webhook URL
4. In Zapier: Create Zap → Trigger: Webhooks by Zapier
5. Action: Choose your CRM (HubSpot, Salesforce, Google Sheets, etc.)
6. Map fields: name → Name, email → Email, etc.
7. Test and activate!

**Popular Zap Ideas:**
- Add to Google Sheets for simple tracking
- Create HubSpot contact automatically
- Send to Slack channel for team visibility
- Add to Mailchimp email list
- Create Trello card for follow-up tasks

---

**Need help?** Netlify Forms documentation: https://docs.netlify.com/forms/setup/
