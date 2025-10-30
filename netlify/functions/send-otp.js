/**
 * Netlify Serverless Function: Send OTP via Twilio Verify
 * 
 * IMPORTANT: Twilio Trial Account Restrictions
 * - Trial accounts can only send to verified phone numbers
 * - Verify phone numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
 * - For production, upgrade to a paid account
 * 
 * Required Environment Variables (set in Netlify dashboard):
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - VERIFY_SERVICE_SID (create at https://console.twilio.com/us1/develop/verify/services)
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const VERIFY_SERVICE_SID = process.env.VERIFY_SERVICE_SID;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

exports.handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers: corsHeaders, 
      body: 'ok' 
    };
  }

  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, error: 'Method not allowed' })
    };
  }

  // Check if Verify service is configured
  if (!VERIFY_SERVICE_SID || !TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN) {
    return {
      statusCode: 503,
      headers: corsHeaders,
      body: JSON.stringify({ 
        ok: false, 
        reason: 'VERIFY_SERVICE_NOT_CONFIGURED',
        message: 'SMS verification is not configured yet. Your request was still submitted.' 
      })
    };
  }

  try {
    const { phone } = JSON.parse(event.body);

    // Basic E.164 validation (starts with +, followed by digits)
    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Invalid phone format. Please use E.164 format (e.g., +18335551234)' 
        })
      };
    }

    // Use Twilio Verify API to send OTP
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${VERIFY_SERVICE_SID}/Verifications`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `To=${encodeURIComponent(phone)}&Channel=sms`
      }
    );

    const data = await response.json();

    if (response.ok && data.status === 'pending') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true })
      };
    } else {
      console.error('Twilio Verify send error:', data);
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: data.message || 'Failed to send verification code. If using trial account, ensure phone is verified in Twilio console.' 
        })
      };
    }
  } catch (err) {
    console.error('Send OTP error:', err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        ok: false, 
        error: 'Internal server error' 
      })
    };
  }
};
