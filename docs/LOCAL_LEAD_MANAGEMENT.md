# Local lead management

This is the phase-one operating procedure for Admiral Energy's site leads. Netlify Forms is the intake system of record; a private owner-controlled tracker is the working pipeline. A CRM can replace the tracker later, but launch does not depend on one.

## Form inventory

| Netlify form | Purpose | Sensitive fields to expect |
|---|---|---|
| `home-backup-assessment` | Kings Mountain home-backup consultation request | Contact details, ZIP code, planning answers, notes, consent records, first-touch attribution |
| `resilience-list` | Requested resilience email updates | Email address, source, marketing consent |
| `bulk-order-inquiry` | General bulk-order request | Contact/company details, quantity, timeline, notes |
| `sidekick-bulk-inquiry` | SideKick organization/bulk pricing request | Contact/company details, quantity, timeline, notes |
| `sidekick-interest` | Optional post-purchase interest | Stripe session identifier and selected reason |

The static discovery forms in `public/__forms.html` must use the same form and field names as the client-rendered forms. Netlify scans deployed HTML, so changing a form requires a new deploy and another verification.

## Netlify setup and verification

Netlify's [Forms setup documentation](https://docs.netlify.com/manage/forms/setup/) is the authority for the current dashboard workflow.

1. In the production Netlify site, open **Forms** and enable form detection.
2. Trigger a fresh production deploy after form detection is enabled.
3. Confirm every form in the inventory appears under **Active forms** with the exact name above.
4. Open **Forms > Submission notifications** and create a form-specific email notification for each lead form. Send it to an owner-controlled business mailbox, not a shared personal inbox.
5. Give each notification a clear subject that includes the form name. Notifications should be for verified submissions.
6. Protect the Netlify account and notification mailbox with individual accounts, strong unique passwords, and multi-factor authentication where available.

An HTTP `200` from the browser proves only that the request received a successful response. A lead is verified only when the matching submission appears in Netlify's Forms dashboard. Notification delivery and analytics are additional checks, not substitutes for the dashboard record.

## Production test-submission protocol

Run this after the first deploy, after any form-field change, and after any Netlify or notification configuration change.

1. Choose a low-traffic time and record the test start time, deploy ID, form name, browser, and tracked entry URL.
2. Use an owner-controlled email alias and a reachable business phone number. Do not use a customer's identity.
3. Put a unique marker such as `KM-TEST-20261017-1530` in an optional notes field. For forms without notes, use a unique business email alias.
4. For the home-backup form, deliberately record which contact, marketing, and partner-referral choices were checked. Do not assume one consent covers another.
5. Submit once. Confirm the page shows success only after the request completes.
6. In Netlify, check both **Verified** and **Spam** views. Open the record and compare every expected field, including consent version, form location, submission path, and attribution.
7. Confirm the notification arrived in the correct mailbox and does not expose the lead to unintended recipients or forwarding rules.
8. In GTM Preview and GA4 DebugView, confirm one PII-free success event. Names, email addresses, phone numbers, ZIP codes, notes, consent values, and raw form fields must be absent.
9. Confirm the submission is present in the CSV export.
10. Record pass/fail and delete the marked test submission after the evidence is captured. Netlify deletion is permanent.

Space repeated submissions far enough apart to avoid confusing the spam filter. If a legitimate test lands in Spam, review the form configuration and mark it verified only when appropriate; do not weaken spam protections merely to make a test pass.

## Notifications and daily intake

The owner checks Netlify at least once each business day even when email notifications are enabled.

For each new verified lead:

1. Compare the notification with the Netlify record.
2. Create or update a row in the private tracker using the Netlify submission identifier and server timestamp.
3. Set `status=New`, assign an owner, and add a concrete `next_action_at`.
4. Review the request for service-area fit, urgency, consent, obvious spam, and any sensitive details that should not be copied further.
5. Respond only through the channel authorized for that specific request. Marketing permission and partner-referral permission are separate choices.

Email notifications can contain PII. Do not auto-forward them to personal accounts, broad groups, chat rooms, or unapproved automation services. Netlify's current notification options are documented at [Form notifications](https://docs.netlify.com/manage/forms/notifications/).

## Private tracker

Use an access-restricted business spreadsheet or database. Do not publish it, link-share it publicly, or store it in this repository.

Minimum columns:

- `netlify_submission_id` and Netlify/server-created time;
- form name and controlled lead source;
- lead name and approved contact details;
- required-consent status, marketing permission, partner-referral permission, and consent version;
- pipeline status, status-changed time, owner, `last_contacted_at`, `next_action_at`, and next action;
- qualification summary using controlled values where practical;
- partner name and referral timestamp, only when permission exists;
- outcome, loss/nurture reason, and retention-review date; and
- a short internal note that avoids copying unnecessary sensitive free text.

The Netlify timestamp is the canonical intake time. The client timestamp can help diagnose browser or network delay but should not replace it.

## Pipeline

Every lead follows this exact path:

`New → Contacted → Qualified → Partner Assessment → Won / Lost / Nurture`

| Stage | Entry rule | Required next action / exit rule |
|---|---|---|
| **New** | Verified Netlify submission or a manually logged phone/email inquiry | Assign an owner, review consent and service fit, set a contact action and due time |
| **Contacted** | At least one documented, request-specific contact attempt | Record result and next attempt; move to Qualified only when need, location, timing, and fit are understood |
| **Qualified** | The request is a plausible Admiral Energy opportunity and the requester wants a next step | Define the next action; use Partner Assessment only when licensed installation expertise is needed and referral permission exists |
| **Partner Assessment** | The lead gave partner-referral permission and an owner selected an appropriate qualified/licensed independent professional | Record what minimum data was shared, with whom, and when; track assessment outcome |
| **Won** | A purchase, signed engagement, or other defined successful outcome is confirmed by the authoritative system | Record the outcome and move the record to the applicable order, warranty, tax, or contract retention schedule |
| **Lost** | The requester declines, is out of scope, cannot be served, is duplicate/spam, or otherwise will not proceed | Record a controlled loss reason, stop follow-up, and set a deletion/review date |
| **Nurture** | The opportunity is not ready now and ongoing contact is appropriate | Set a specific future review; promotional nurture requires separate marketing permission |

Do not use Nurture as a holding area for forgotten leads. Without marketing permission, limit follow-up to the specific open request and close it when that purpose ends.

## Partner referrals and consent

- Required home-backup contact consent authorizes Admiral Energy to respond about that assessment request; it does not enroll the person in marketing.
- Marketing is a separate optional choice and must be unchecked by default.
- Partner referral is also separate and optional. Do not share a lead with an installer or other independent party unless the record shows that permission.
- Before a referral, the owner confirms the partner is appropriate for the work and records available license/insurance or qualification checks.
- Share only the information needed for the assessment. Do not send marketing status, unrelated notes, raw attribution history, or data the partner does not need.
- A consent record is permission, not proof that a referral happened. Record the actual recipient, date, and fields shared.

## CSV export and reconciliation

Netlify documents export and deletion in [Form submissions](https://docs.netlify.com/manage/forms/submissions/).

1. In **Forms**, select one form and choose **Download as CSV**.
2. Save the export only in approved private business storage. The CSV contains PII and must not be committed to Git, attached to a public ticket, or left in Downloads indefinitely.
3. Reconcile new Netlify rows to the tracker by submission identifier and timestamp. Do not match solely on email address.
4. Check that every open tracker row has an owner, status, and next action.
5. Review Netlify's Spam view before concluding a campaign produced no leads.
6. After a verified transfer and backup, delete exports that are no longer needed and apply the retention schedule to Netlify submissions.

Run this reconciliation weekly during launch and at least monthly after volume stabilizes. Use a tighter cadence if lead volume increases.

## Access, retention, and deletion

Netlify recommends actively managing form PII by exporting and deleting it regularly. Adopt and document a schedule that fits applicable legal, tax, warranty, contract, and marketing obligations; get professional advice where required.

Practical launch baseline:

- Delete test and confirmed spam submissions within 7 days after verification.
- Review Netlify submissions monthly. Once a lead has been accurately transferred to the protected tracker and the required backup is verified, remove redundant Netlify copies that no longer serve an operational purpose.
- Review active lead records at least quarterly. Do not retain abandoned New, Contacted, Qualified, Lost, or unconsented Nurture records indefinitely; use 12 months after the last meaningful activity as an initial review/deletion point unless a documented requirement supports longer retention.
- Retain Won/order records only under the separate tax, transaction, warranty, fraud-prevention, and contract schedule approved by the owner.
- When someone withdraws marketing permission, remove them from active marketing and retain only the minimum suppression record needed to prevent accidental resubscription.

Limit Netlify, mailbox, export, and tracker access to people who need it. Review access quarterly and immediately when a role changes. Use device encryption, screen locks, protected backups, and individual accounts. Never ask for or store medical history, passwords, payment-card data, government identifiers, or other unnecessary sensitive information in lead notes.

For an access, correction, or deletion request:

1. Route the request to the central business contact in `src/lib/business.ts`.
2. Verify identity without collecting more data than necessary.
3. Search Netlify, the private tracker, approved exports/backups, the notification mailbox, marketing tools, and any documented partner referral.
4. Correct, export, or delete as applicable, subject to necessary legal/transaction records.
5. Record completion using a minimal request log that does not recreate the deleted data.

## Owner-only launch checklist

- [ ] Enable Netlify form detection and redeploy.
- [ ] Confirm all five forms appear under Active forms.
- [ ] Configure and test form-specific notifications to the protected business mailbox.
- [ ] Run the production test protocol for each form and delete the test records afterward.
- [ ] Download one CSV per form and verify expected fields and timestamps.
- [ ] Create the private tracker with the exact pipeline and assign an accountable owner.
- [ ] Approve the retention schedule, review cadence, access list, and deletion-request procedure.
- [ ] Publish the reviewed GTM/GA4 configuration described in `docs/CONVERSION_TRACKING.md`.
- [ ] Update Google Business Profile and social profiles with the documented tracked URLs.
