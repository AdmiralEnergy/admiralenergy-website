// netlify/functions/admiral-chat.js
// Admiral chat relay — Netlify Function (no streaming)
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
    const systemPrompt =
      process.env.ADMIRAL_SYSTEM_PROMPT ||
      "You are The Admiral—NC-focused solar & battery advisor. Use math-first, battery-first guidance; cite dates; avoid prices unless user shares bill/usage. Mention Duke PowerPair realities, interconnection timelines, and when solar doesn't pencil out. Tone: calm, clear, non-pushy.";

    if (!apiKey) {
      return { statusCode: 500, headers: corsHeaders(event.headers?.origin), body: JSON.stringify({ error: 'Missing OPENAI_API_KEY' }) };
    }

    const { messages } = JSON.parse(event.body || '{}');
    if (!Array.isArray(messages) || messages.length === 0) {
      return { statusCode: 400, headers: corsHeaders(event.headers?.origin), body: JSON.stringify({ error: 'messages[] required' }) };
    }

    const payload = {
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [{ role: "system", content: systemPrompt }, ...messages].slice(-24)
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