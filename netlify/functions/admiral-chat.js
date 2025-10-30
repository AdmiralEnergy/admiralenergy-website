// netlify/functions/admiral-chat.js
// Admiral chat relay — Netlify Function (no streaming)
const { searchKnowledge } = require('./knowledge-base');

const ALLOWED_ORIGINS = []; // optional: add prod origin(s) for strict CORS

exports.handler = async (event) => {
  try {
    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders(event.headers?.origin), body: '' };
    }
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, headers: corsHeaders(event.headers?.origin), body: 'Method Not Allowed' };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const systemPrompt = process.env.ADMIRAL_SYSTEM_PROMPT || `You are The Admiral, a friendly solar and battery backup advisor for North Carolina homeowners.

RESPONSE STYLE (CRITICAL):
- Keep responses SHORT and conversational (2-4 sentences max)
- Use simple language, avoid jargon
- Ask ONE follow-up question to understand their needs
- Only provide detailed numbers when specifically asked
- Be helpful and considerate, never overwhelming

CORE EXPERTISE:
- Battery-first: PowerPair (13.5 kWh) often sufficient without solar
- Solar ROI: Honest math - only recommend if financially sensible
- Duke Energy: Net metering, interconnection, rate structures
- Outage coverage: Runtime based on home size and essential loads
- Incentives: 30% federal tax credit, NC rebates

KEY FACTS (use sparingly, only when relevant):
- Duke PowerPair: ~$15k installed, 30% tax credit applies
- Solar payback in NC: Typically 8-12 years
- Duke interconnection: 45-90 days
- Battery runtime: 13.5 kWh covers essentials 1-2 days
- Solar makes sense: High usage (>1200 kWh/mo), south-facing roof, minimal shade

CONVERSATION FLOW:
1. First message: Understand their situation with 1-2 questions
2. Focus on backup power needs first
3. Only dive into details when asked
4. When user shows interest (asks about pricing, timeline, scheduling, or says "interested"), offer consultation

LEAD CAPTURE SIGNAL:
When user expresses buying intent (asks about "price", "cost", "quote", "schedule", "interested", "next steps"), respond EXACTLY with:
"SHOW_CONTACT_BUTTONS"

This will trigger Yes/No buttons asking if they want to speak with an expert.

TONE: Friendly neighbor who knows their stuff - professional but approachable, honest, never pushy.

REMEMBER: BRIEF responses build trust. Don't overwhelm with information dumps.`;

    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders(event.headers?.origin), body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
    }

    const { messages } = JSON.parse(event.body || '{}');
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers: corsHeaders(event.headers?.origin), body: JSON.stringify({ error: 'messages[] required' }) };
    }

    // Search knowledge base for relevant context
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const relevantKnowledge = searchKnowledge(lastUserMessage);
    
    // Enhance system prompt with relevant knowledge
    let enhancedSystemPrompt = systemPrompt;
    if (relevantKnowledge) {
      enhancedSystemPrompt += `\n\n=== RELEVANT KNOWLEDGE BASE ===\n${relevantKnowledge}\n=== END KNOWLEDGE BASE ===\n\nUse this information to provide specific, accurate answers. Cite numbers and timelines from the knowledge base when relevant.`;
    }

    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "system", content: enhancedSystemPrompt }, ...messages].slice(-24)
    };

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, headers: corsHeaders(event.headers?.origin), body: JSON.stringify({ error: 'OpenAI error', status: res.status, detail: text }) };
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || null;

    return {
      statusCode: 200,
      headers: { ...corsHeaders(event.headers?.origin), "Content-Type": "application/json" },
      body: JSON.stringify({ reply, usage })
    };
  } catch (err) {
    return { statusCode: 500, headers: corsHeaders(), body: JSON.stringify({ error: 'Server error', detail: String(err?.message || err) }) };
  }
};

function corsHeaders(origin) {
  let allow = "*";
  if (ALLOWED_ORIGINS.length && origin && ALLOWED_ORIGINS.includes(origin)) allow = origin;
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}