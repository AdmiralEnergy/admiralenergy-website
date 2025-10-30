/**
 * Netlify Serverless Function: Verify OTP via Twilio Verify
 * 
 * IMPORTANT: Twilio Trial Account Restrictions
 * - Trial accounts can only send to verified phone numbers
 * - Verify phone numbers at: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
 * 
 * Required Environment Variables (set in Netlify dashboard):
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - VERIFY_SERVICE_SID
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
    const { phone, code } = JSON.parse(event.body);

    // Validate inputs
    if (!phone || !/^\+\d{10,15}$/.test(phone)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Invalid phone format' 
        })
      };
    }

    if (!code || !/^\d{6}$/.test(code)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Invalid code format. Must be 6 digits.' 
        })
      };
    }

    // Use Twilio Verify API to check OTP
    const auth = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    
    const response = await fetch(
      `https://verify.twilio.com/v2/Services/${VERIFY_SERVICE_SID}/VerificationCheck`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `To=${encodeURIComponent(phone)}&Code=${encodeURIComponent(code)}`
      }
    );

    const data = await response.json();

    if (response.ok && data.status === 'approved') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ ok: true })
      };
    } else {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: data.status === 'pending' ? 'Invalid code' : (data.message || 'Verification failed') 
        })
      };
    }
  } catch (err) {
    console.error('Verify OTP error:', err);
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
