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
  "timestamp": "2025-10-30T...",
  "page": "/powerpair.html"
}
```

### Where Leads Go:
**Currently:** Netlify Function Logs
- View in Netlify Dashboard → Functions → capture-lead → Recent logs
- Each lead is logged with full details

**Next Steps (Optional Integrations):**
1. **Email Notification** (Recommended first)
   - Add SendGrid/Mailgun to send you alerts
   - Add to `netlify/functions/capture-lead.js` (commented TODO section)

2. **Google Sheets**
   - Use Google Sheets API to append rows
   - Simple, free, no CRM needed

3. **Full CRM** (HubSpot, Salesforce, etc.)
   - Add API calls in capture-lead.js
   - Set API keys in Netlify env variables

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
5. Fill out form
6. Check Netlify Function logs for captured lead

### Files Modified:
- `netlify/functions/capture-lead.js` - NEW: Lead capture endpoint
- `netlify/functions/admiral-chat.js` - Updated chatbot prompt with lead detection
- `public/scripts/admiral-chat-ui.js` - Added form display and submission logic

### Security:
- Basic email validation
- CORS headers for security
- Rate limiting handled by Netlify
- No sensitive data stored in localStorage
- Lead data only sent over HTTPS

### Future Enhancements:
- [ ] Add email notifications (SendGrid/Mailgun)
- [ ] Integrate with CRM (HubSpot/Salesforce)
- [ ] Add SMS notifications via Twilio
- [ ] Store leads in database (Airtable/Supabase)
- [ ] Auto-respond with confirmation email
- [ ] Add lead scoring based on conversation
- [ ] Calendar integration (Calendly/Google Calendar)

---

## Quick Start for Next Integration

### Option 1: Email Notifications (Easiest)
Add to `capture-lead.js` around line 75:

```javascript
// Send email notification
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

await sgMail.send({
  to: 'your-email@admiralenergy.ai',
  from: 'leads@admiralenergy.ai', // Must be verified in SendGrid
  subject: `New Chat Lead: ${leadData.name}`,
  text: `
    New lead from Admiral Chat!
    
    Name: ${leadData.name}
    Email: ${leadData.email}
    Phone: ${leadData.phone}
    Page: ${leadData.page}
    
    Conversation Context:
    ${leadData.context}
  `
});
```

Then: `npm install @sendgrid/mail` and add `SENDGRID_API_KEY` to Netlify env vars.

### Option 2: Google Sheets (Free & Simple)
See: https://developers.google.com/sheets/api/guides/values#writing

---

**Need help implementing?** Check Netlify function logs or reach out!
