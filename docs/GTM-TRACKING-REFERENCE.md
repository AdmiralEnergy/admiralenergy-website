# Google Tag Manager - Complete Tracking Reference

**Container ID:** GTM-N6HRP34Z  
**GA4 Property:** G-RX78MRB03L  
**Last Updated:** October 30, 2025  
**Status:** Fully Implemented & Tested

---

## Overview

This document provides a complete reference for all analytics tracking on the Admiral Energy website. All events use Google Tag Manager's dataLayer for clean separation of tracking from business logic.

---

## dataLayer Event Structure

### Standard Pattern
```javascript
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: 'event_name',        // Required: Event identifier
  parameter1: 'value1',       // Optional: Event-specific data
  parameter2: 'value2',
  // ... additional parameters
});
```

### Implementation Location
- **Chat Events:** `public/scripts/admiral-chat-ui.js` (via `pushEvent()` helper)
- **Quote Form Events:** `quote.html` (inline JavaScript)
- **Exit Intent:** Various pages with exit tracking

---

## Chat Widget Events

### 1. chat_opened
**Trigger:** User clicks floating chat button  
**Purpose:** Track chat engagement initiation  
**File:** `public/scripts/admiral-chat-ui.js`  
**Line:** ~435 (in `openPanel()` function)

**dataLayer Structure:**
```javascript
{
  event: 'chat_opened',
  source: 'floating_button',  // or 'unknown'
  page: '/index.html'         // Current page path
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `chat_opened`
- **Tag:** GA4 Event
  - Event Name: `chat_opened`
  - Event Parameters:
    - source: `{{DLV - source}}`
    - page_location: `{{DLV - page}}`

**Use Cases:**
- Measure chat adoption rate
- Identify which pages drive chat engagement
- Calculate chat engagement vs total visitors

---

### 2. chat_message_sent
**Trigger:** User sends message in chat  
**Purpose:** Track user engagement within chat  
**File:** `public/scripts/admiral-chat-ui.js`  
**Line:** ~164 (in `onSubmit()` function)

**dataLayer Structure:**
```javascript
{
  event: 'chat_message_sent',
  page: '/powerpair.html'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `chat_message_sent`
- **Tag:** GA4 Event
  - Event Name: `chat_message_sent`
  - Event Parameters:
    - page_location: `{{DLV - page}}`

**Use Cases:**
- Measure chat depth (messages per session)
- Identify power users vs casual browsers
- Calculate message volume trends

---

### 3. admiral_chat_reply_received
**Trigger:** Bot responds to user message  
**Purpose:** Track successful bot interactions  
**File:** `public/scripts/admiral-chat-ui.js`  
**Line:** ~186 (in `onSubmit()` function, after bot response)

**dataLayer Structure:**
```javascript
{
  event: 'admiral_chat_reply_received',
  page: '/services.html'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `admiral_chat_reply_received`
- **Tag:** GA4 Event
  - Event Name: `chat_reply_received`
  - Event Parameters:
    - page_location: `{{DLV - page}}`

**Use Cases:**
- Verify bot is responding (system health)
- Calculate average response time (manual analysis)
- Measure conversation completion rate

---

### 4. chat_closed
**Trigger:** User closes chat (× button, backdrop click, or ESC key)  
**Purpose:** Track chat exit behavior  
**File:** `public/scripts/admiral-chat-ui.js`  
**Line:** ~443 (in `closePanel()` function)

**dataLayer Structure:**
```javascript
{
  event: 'chat_closed',
  page: '/about.html'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `chat_closed`
- **Tag:** GA4 Event
  - Event Name: `chat_closed`
  - Event Parameters:
    - page_location: `{{DLV - page}}`

**Use Cases:**
- Calculate chat bounce rate (opened but closed immediately)
- Measure average chat duration (opened → closed time)
- Identify pages with highest chat abandonment

---

### 5. generate_lead (Chat Source)
**Trigger:** User submits lead capture form in chat  
**Purpose:** Track conversions from chat widget  
**File:** `public/scripts/admiral-chat-ui.js`  
**Line:** ~471 (in `showLeadCaptureForm()` after successful submission)

**dataLayer Structure:**
```javascript
{
  event: 'generate_lead',
  source: 'admiral_chat',
  lead_type: 'chat_contact_form',
  page: '/powerpair.html'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `generate_lead` AND `{{DLV - source}}` equals `admiral_chat`
- **Tag:** GA4 Event (Conversion)
  - Event Name: `generate_lead`
  - Event Parameters:
    - source: `{{DLV - source}}`
    - lead_type: `{{DLV - lead_type}}`
    - page_location: `{{DLV - page}}`
  - Mark as Conversion: YES

**Use Cases:**
- Track chat-to-lead conversion rate
- Calculate ROI of chat investment
- A/B test chat copy effectiveness

---

## Quote Form Events

### 6. form_start
**Trigger:** User focuses first field in quote form  
**Purpose:** Track form engagement  
**File:** `quote.html`  
**Line:** ~366

**dataLayer Structure:**
```javascript
{
  event: 'form_start',
  page_url: 'https://admiralenergy.ai/quote.html'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `form_start`
- **Tag:** GA4 Event
  - Event Name: `form_start`
  - Event Parameters:
    - page_url: `{{DLV - page_url}}`

**Use Cases:**
- Measure form engagement rate (visits vs starts)
- Calculate form abandonment (start vs complete)
- Identify top entry points to quote form

---

### 7. phone_verified
**Trigger:** Twilio OTP code successfully verified  
**Purpose:** Track SMS verification success  
**File:** `quote.html`  
**Line:** ~526

**dataLayer Structure:**
```javascript
{
  event: 'phone_verified',
  page_url: 'https://admiralenergy.ai/quote.html',
  verification_method: 'twilio_otp'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `phone_verified`
- **Tag:** GA4 Event
  - Event Name: `phone_verified`
  - Event Parameters:
    - verification_method: `{{DLV - verification_method}}`
    - page_url: `{{DLV - page_url}}`

**Use Cases:**
- Measure SMS verification friction
- Calculate verification success rate
- Identify issues with Twilio integration

---

### 8. generate_lead (Quote Form Source)
**Trigger:** Quote form successfully submitted after verification  
**Purpose:** Track conversions from quote form  
**File:** `quote.html`  
**Line:** ~407

**dataLayer Structure:**
```javascript
{
  event: 'generate_lead',
  form_name: 'admiral-contact',
  page_url: 'https://admiralenergy.ai/quote.html',
  utm_source: '[captured from URL]',
  utm_medium: '[captured from URL]',
  utm_campaign: '[captured from URL]',
  utm_term: '[captured from URL]',
  utm_content: '[captured from URL]'
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `generate_lead` AND `{{DLV - form_name}}` equals `admiral-contact`
- **Tag:** GA4 Event (Conversion)
  - Event Name: `generate_lead`
  - Event Parameters:
    - form_name: `{{DLV - form_name}}`
    - utm_source: `{{DLV - utm_source}}`
    - utm_medium: `{{DLV - utm_medium}}`
    - utm_campaign: `{{DLV - utm_campaign}}`
    - page_url: `{{DLV - page_url}}`
  - Mark as Conversion: YES

**Use Cases:**
- Track quote form conversion rate
- Attribute leads to marketing campaigns (UTM tracking)
- Compare chat vs quote form performance

---

### 9. exit_intent
**Trigger:** User moves cursor to leave page (top of viewport)  
**Purpose:** Capture abandonment behavior  
**Files:** Various pages with exit intent tracking  
**Implementation:** Varies by page

**dataLayer Structure:**
```javascript
{
  event: 'exit_intent',
  page_url: 'https://admiralenergy.ai/index.html',
  time_on_page: 45  // seconds
}
```

**Recommended GTM Setup:**
- **Trigger:** Custom Event = `exit_intent`
- **Tag:** GA4 Event
  - Event Name: `exit_intent`
  - Event Parameters:
    - page_url: `{{DLV - page_url}}`
    - time_on_page: `{{DLV - time_on_page}}`

**Use Cases:**
- Trigger exit popups (if implemented)
- Measure content engagement time
- Identify pages with quick exits

---

## GTM Variable Configuration

### Required Data Layer Variables

Create these in GTM → Variables → User-Defined Variables:

1. **DLV - event** (Built-in Data Layer Variable)
   - Data Layer Variable Name: `event`
   - Data Layer Version: Version 2

2. **DLV - source**
   - Data Layer Variable Name: `source`
   - Default Value: `(not set)`

3. **DLV - page**
   - Data Layer Variable Name: `page`
   - Default Value: `{{Page Path}}`

4. **DLV - lead_type**
   - Data Layer Variable Name: `lead_type`
   - Default Value: `(not set)`

5. **DLV - form_name**
   - Data Layer Variable Name: `form_name`
   - Default Value: `(not set)`

6. **DLV - page_url**
   - Data Layer Variable Name: `page_url`
   - Default Value: `{{Page URL}}`

7. **DLV - verification_method**
   - Data Layer Variable Name: `verification_method`
   - Default Value: `(not set)`

8. **DLV - utm_source**
   - Data Layer Variable Name: `utm_source`
   - Default Value: `(direct)`

9. **DLV - utm_medium**
   - Data Layer Variable Name: `utm_medium`
   - Default Value: `(none)`

10. **DLV - utm_campaign**
    - Data Layer Variable Name: `utm_campaign`
    - Default Value: `(not set)`

11. **DLV - time_on_page**
    - Data Layer Variable Name: `time_on_page`
    - Default Value: `0`

---

## GTM Tag Templates

### Template 1: GA4 Event - Chat Opened
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Config Tag]

Event Name: chat_opened

Event Parameters:
- Parameter Name: source
  Value: {{DLV - source}}

- Parameter Name: page_location
  Value: {{DLV - page}}

Triggering: Custom Event = chat_opened
```

### Template 2: GA4 Event - Lead Generated (Conversion)
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Config Tag]

Event Name: generate_lead

Event Parameters:
- Parameter Name: source
  Value: {{DLV - source}}

- Parameter Name: lead_type
  Value: {{DLV - lead_type}}

- Parameter Name: form_name
  Value: {{DLV - form_name}}

- Parameter Name: page_location
  Value: {{DLV - page_url}}

Mark as Conversion: ✓ (Check this box)

Triggering: Custom Event = generate_lead
```

### Template 3: GA4 Event - Phone Verified
```
Tag Type: Google Analytics: GA4 Event
Configuration Tag: [Your GA4 Config Tag]

Event Name: phone_verified

Event Parameters:
- Parameter Name: verification_method
  Value: {{DLV - verification_method}}

- Parameter Name: page_url
  Value: {{DLV - page_url}}

Triggering: Custom Event = phone_verified
```

---

## GA4 Configuration

### Key Events (Conversions)
Mark these as key events in GA4:
1. **generate_lead** - Primary conversion (both chat and form)
2. **phone_verified** - Secondary conversion (quote form milestone)

### Recommended Custom Dimensions
Create in GA4 → Admin → Custom Definitions:

**Event-Scoped:**
- `source` - Lead source (admiral_chat, admiral-contact)
- `lead_type` - Type of lead form (chat_contact_form, quote_form)
- `form_name` - Form identifier
- `verification_method` - SMS verification method

**User-Scoped:**
- `first_lead_source` - First source that generated a lead
- `chat_user` - User who opened chat (true/false)

### Recommended Audiences
Create in GA4 → Admin → Audiences:

1. **Chat Engagers**
   - Condition: `chat_opened` event count > 0
   - Use: Retargeting, behavior analysis

2. **Lead Generators**
   - Condition: `generate_lead` event count > 0
   - Use: Conversion analysis, CRM sync

3. **Form Starters (Non-Converters)**
   - Condition: `form_start` count > 0 AND `generate_lead` count = 0
   - Use: Abandonment analysis, retargeting

4. **Chat-to-Lead Converters**
   - Condition: `generate_lead` with `source` = 'admiral_chat'
   - Use: Chat effectiveness analysis

### Exploration Reports to Create

1. **Chat Funnel**
   - Technique: Funnel Exploration
   - Steps:
     1. chat_opened
     2. chat_message_sent
     3. generate_lead (source = admiral_chat)
   - Goal: Measure chat conversion rate

2. **Quote Form Funnel**
   - Technique: Funnel Exploration
   - Steps:
     1. form_start
     2. phone_verified
     3. generate_lead (form_name = admiral-contact)
   - Goal: Identify drop-off points

3. **Lead Source Comparison**
   - Technique: Free Form
   - Dimensions: `source`
   - Metrics: `generate_lead` event count, Conversions
   - Goal: Compare chat vs form effectiveness

---

## Testing & Validation

### GTM Preview Mode
1. Open GTM → Preview
2. Enter your website URL
3. Test each event trigger:
   - Open chat → Verify `chat_opened` fires
   - Send message → Verify `chat_message_sent` fires
   - Bot responds → Verify `admiral_chat_reply_received` fires
   - Close chat → Verify `chat_closed` fires
   - Submit lead form → Verify `generate_lead` fires with correct parameters

### GA4 DebugView
1. Enable in GA4 → Admin → DebugView
2. Use Preview mode OR add `?gtm_debug=true` to URL
3. Watch events arrive in real-time
4. Verify parameters are correct

### GA4 Realtime Report
1. GA4 → Reports → Realtime
2. Trigger events on site
3. See events appear within ~10 seconds
4. Verify event counts match your actions

---

## Common Issues & Fixes

### Issue 1: Events Not Firing
**Symptoms:** No events in GTM Preview  
**Causes:**
- `window.dataLayer` not initialized before push
- Typo in event name
- Code not executing (JavaScript error)

**Fix:**
```javascript
// Always initialize dataLayer first
window.dataLayer = window.dataLayer || [];
window.dataLayer.push({ event: 'your_event' });
```

### Issue 2: Parameters Missing in GA4
**Symptoms:** Event fires but parameters don't show  
**Causes:**
- GTM tag not configured to pass parameters
- Variable names don't match dataLayer keys
- Parameters not registered as custom dimensions in GA4

**Fix:**
1. Check GTM tag configuration (Event Parameters section)
2. Verify variable names match dataLayer keys exactly
3. Create custom dimensions in GA4 if needed

### Issue 3: generate_lead Not Marked as Conversion
**Symptoms:** Event tracked but not showing in Conversions report  
**Cause:** Event not marked as key event in GA4

**Fix:**
1. GA4 → Admin → Events
2. Find `generate_lead` event
3. Toggle "Mark as key event" to ON

### Issue 4: Duplicate Events
**Symptoms:** Same event fires twice  
**Causes:**
- GTM tag firing on multiple triggers
- Event pushed multiple times in code
- Multiple GTM containers on page

**Fix:**
1. Check GTM trigger configuration
2. Use debugging to see where duplicate comes from
3. Add conditional logic to prevent double-firing

---

## Event Naming Conventions

### Current Naming Pattern
- **Lowercase with underscores:** `chat_opened`, `generate_lead`
- **Descriptive and specific:** `admiral_chat_reply_received` (not just `reply`)
- **Verb-based for actions:** `opened`, `sent`, `verified`, `generated`

### Recommendations for Future Events
- Follow GA4 recommended event names where possible
- Use verb_noun pattern: `view_item`, `add_to_cart`, `begin_checkout`
- Keep consistent with current naming for easier analysis

---

## Performance Impact

### dataLayer Overhead
- **Minimal:** ~1-2ms per push
- **Best Practice:** Batch related parameters in single push
- **Avoid:** Pushing inside tight loops

### GTM Container Size
- **Current:** ~50KB (container + tags)
- **Load Time:** <500ms on average
- **Async:** Doesn't block page rendering

### Recommended Monitoring
- Check GTM load time in Chrome DevTools (Network tab)
- Monitor GA4 event volume (shouldn't exceed 500 events/second)
- Use GTM's built-in analytics to see tag firing times

---

## Maintenance Schedule

### Weekly
- [ ] Review GA4 Realtime report for anomalies
- [ ] Check for JavaScript errors in browser console
- [ ] Verify lead count matches Netlify Forms dashboard

### Monthly
- [ ] Full GTM Preview test of all events
- [ ] Review GA4 custom reports
- [ ] Update this document with any changes

### Quarterly
- [ ] Audit event naming consistency
- [ ] Review and optimize GTM triggers
- [ ] Clean up unused tags/variables
- [ ] Update GA4 audiences based on new insights

---

## Quick Reference

### All Events Summary
| Event | Trigger | Primary Use | File |
|-------|---------|-------------|------|
| chat_opened | Float button click | Chat adoption | admiral-chat-ui.js |
| chat_message_sent | User sends message | Engagement depth | admiral-chat-ui.js |
| admiral_chat_reply_received | Bot responds | System health | admiral-chat-ui.js |
| chat_closed | Chat closed | Session length | admiral-chat-ui.js |
| generate_lead (chat) | Chat form submit | **CONVERSION** | admiral-chat-ui.js |
| form_start | First field focus | Form engagement | quote.html |
| phone_verified | OTP success | Verification rate | quote.html |
| generate_lead (form) | Form submit | **CONVERSION** | quote.html |
| exit_intent | Cursor to top | Abandonment | Various |

### Critical Success Metrics
1. **Chat Conversion Rate:** (generate_lead from chat) / (chat_opened)
2. **Form Conversion Rate:** (generate_lead from form) / (form_start)
3. **Overall Lead Rate:** (total generate_lead) / (total visitors)
4. **Chat Engagement:** (chat_message_sent) / (chat_opened)
5. **Form Abandonment:** 1 - ((generate_lead from form) / (form_start))

---

**Document Version:** 2.0  
**Last Review:** October 30, 2025  
**Next Review:** November 30, 2025  
**Owner:** Development Team  
**Contact:** [Your contact information]
