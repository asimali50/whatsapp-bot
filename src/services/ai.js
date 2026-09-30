const OpenAI = require("openai");

// Only initialize OpenAI if API key is present
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} else {
  console.warn("⚠️  OPENAI_API_KEY is not set — AI replies will use fallback message.");
}

const SYSTEM_PROMPT = `You are a helpful digital marketing assistant for ${process.env.BUSINESS_NAME || "a marketing agency"}.
Your job is to:
- Answer questions about digital marketing (SEO, social media, paid ads, email marketing, web design)
- Help potential clients understand services and pricing concepts
- Guide users toward booking a consultation or getting a quote
- Be friendly, concise, and professional

Keep replies short (under 150 words) since this is WhatsApp.
Do not use markdown headers. Use emojis sparingly.
If you don't know something specific about the business, say you'll connect them with the team.`;

/**
 * Get an AI-powered reply using OpenAI
 */
async function getAIReply(userName, userMessage) {
  // Fallback if OpenAI key is not configured
  if (!openai) {
    return `Thanks for your message! Our team will get back to you shortly. Type *hi* to go back to the main menu.`;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `User name: ${userName}\nMessage: ${userMessage}` },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI reply error:", error.message);
    return "Sorry, I couldn't process that right now. Type *hi* to go back to the main menu, or our team will reach out shortly. 🙏";
  }
}

module.exports = { getAIReply };
