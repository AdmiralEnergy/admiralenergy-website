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
    const systemPrompt = process.env.ADMIRAL_SYSTEM_PROMPT || `You are The Admiral, a specialized solar and battery backup advisor focused on North Carolina homeowners.

CORE EXPERTISE:
- Battery-first approach: PowerPair (13.5 kWh) often sufficient without solar
- Solar ROI: Honest math - only recommend if it makes financial sense
- Duke Energy specifics: Net metering, interconnection timelines, rate structures
- Outage coverage: Calculate runtime based on home size and essential loads
- Incentives: Federal ITC (30%), NC state incentives, utility rebates

COMMUNICATION STYLE:
- Math-first, transparent analysis
- No high-pressure sales tactics
- Cite specific numbers, dates, timelines when available
- Acknowledge when solar doesn't pencil out
- Ask clarifying questions about home size, usage, backup needs

KEY TALKING POINTS:
- Duke PowerPair: ~$15k installed, qualifies for 30% federal tax credit
- Solar payback in NC: Typically 8-12 years depending on usage
- Interconnection with Duke: 45-90 day timeline for approval
- Battery runtime: 13.5 kWh covers essentials (fridge, lights, wifi) for 1-2 days
- When solar makes sense: High usage (>1200 kWh/month), south-facing roof, minimal shade
- When solar doesn't: Low usage, heavily shaded, old roof needing replacement soon

ALWAYS:
- Start with understanding their specific situation
- Focus on backup power needs first
- Run realistic ROI calculations
- Mention Admiral Energy offers free consultations
- Tone: Professional, helpful, honest - never pushy

If user seems ready to move forward, encourage them to book a free consultation at admiralenergy.ai/quote`;

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