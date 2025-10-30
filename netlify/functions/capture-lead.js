/**
 * Netlify Serverless Function: Capture Chat Lead
 * Simple lead capture from Admiral chat widget
 * 
 * Required Environment Variables:
 * - NOTIFICATION_EMAIL (your email for lead notifications)
 * - Optional: Add database/CRM integration later
 */

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

  try {
    const { name, email, phone, context: leadContext } = JSON.parse(event.body || '{}');

    // Validation
    if (!name || !email) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Name and email are required' 
        })
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ 
          ok: false, 
          error: 'Invalid email format' 
        })
      };
    }

    // Prepare lead data
    const leadData = {
      name,
      email,
      phone: phone || 'Not provided',
      context: leadContext || 'No context provided',
      source: 'Admiral Chat Widget',
      timestamp: new Date().toISOString(),
      page: event.headers.referer || 'Unknown'
    };

    // Log lead (you can see this in Netlify function logs)
    console.log('New chat lead captured:', JSON.stringify(leadData, null, 2));

    // TODO: Add your CRM integration here
    // Examples:
    // - Send to Google Sheets
    // - Save to Airtable
    // - Post to HubSpot/Salesforce
    // - Send email notification via SendGrid/Mailgun
    
    // For now, just return success
    // You can check Netlify function logs to see captured leads
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ 
        ok: true, 
        message: 'Lead captured successfully',
        leadId: `chat-${Date.now()}` // Simple ID for tracking
      })
    };

  } catch (error) {
    console.error('Error capturing lead:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        ok: false, 
        error: 'Failed to capture lead. Please try again.' 
      })
    };
  }
};
