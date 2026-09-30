const { sendTextMessage, sendInteractiveButtons } = require("../services/whatsapp");
const { getAIReply } = require("../services/ai");
const sessionStore = require("../utils/sessionStore");

async function handleMessage(senderPhone, senderName, message) {
  const msgType = message.type;

  if (msgType === "text") {
    const text = message.text.body.trim();
    await routeTextMessage(senderPhone, senderName, text);
  }
}

async function routeTextMessage(phone, name, text) {
  const lower = text.toLowerCase();
  const session = sessionStore.get(phone);

  // Greeting trigger
  if (["hi", "hello", "start", "hey"].includes(lower)) {
    sessionStore.clear(phone);
    return await sendWelcome(phone, name);
  }

  // Main menu number selection
  if (!session?.awaitingInput) {
    if (text === "1") return await handleServices(phone);
    if (text === "2") return await startQuoteFlow(phone);
    if (text === "3") return await startAIFlow(phone, name);
  }

  // If user is in a conversation flow
  if (session?.awaitingInput) {
    return await handleFlowInput(phone, name, text, session);
  }

  // Default: AI reply
  const aiReply = await getAIReply(name, text);
  await sendTextMessage(phone, aiReply);
}

async function handleServices(phone) {
  await sendTextMessage(
    phone,
    `📋 *Our Digital Marketing Services:*\n\n` +
    `• 🔍 SEO & Google Rankings\n` +
    `• 📱 Social Media Management\n` +
    `• 💰 Paid Ads (Google & Meta)\n` +
    `• 📧 Email Marketing\n` +
    `• 🌐 Website Design & Development\n\n` +
    `Type any service name to learn more, or type *quote* to get a custom quote.\n\nType *hi* to go back to main menu.`
  );
}

async function startQuoteFlow(phone) {
  sessionStore.set(phone, { awaitingInput: "quote_name" });
  await sendTextMessage(phone, `Great! Let's get you a custom quote. 📝\n\nFirst, what's your *full name*?`);
}

async function startAIFlow(phone, name) {
  sessionStore.set(phone, { awaitingInput: "ai_question" });
  await sendTextMessage(phone, `🤖 AI Assistant ready! Ask me anything about digital marketing, ${name}.`);
}

async function handleFlowInput(phone, name, text, session) {
  // Lead capture flow
  if (session.awaitingInput === "quote_name") {
    sessionStore.set(phone, { awaitingInput: "quote_business", leadName: text });
    return await sendTextMessage(phone, `Nice to meet you, *${text}*! 👋\n\nWhat's your *business name*?`);
  }

  if (session.awaitingInput === "quote_business") {
    sessionStore.set(phone, { ...session, awaitingInput: "quote_service", businessName: text });
    return await sendTextMessage(
      phone,
      `Great! Which *service* are you interested in?\n\n` +
      `1. SEO\n2. Social Media\n3. Paid Ads\n4. Email Marketing\n5. Website Design\n\n` +
      `Type the service name or number.`
    );
  }

  if (session.awaitingInput === "quote_service") {
    const lead = {
      name: session.leadName,
      business: session.businessName,
      service: text,
      phone,
      collectedAt: new Date().toISOString(),
    };
    console.log("📥 New Lead:", JSON.stringify(lead, null, 2));
    // TODO: Save to database or CRM here
    sessionStore.clear(phone);
    return await sendTextMessage(
      phone,
      `✅ Thanks, *${session.leadName}*! We've received your request for *${text}*.\n\n` +
      `Our team will contact you within *24 hours* with a custom quote. 🚀\n\n` +
      `Type *hi* to go back to the main menu.`
    );
  }

  // AI free-chat mode
  if (session.awaitingInput === "ai_question") {
    const aiReply = await getAIReply(name, text);
    return await sendTextMessage(
      phone,
      aiReply + "\n\n_Ask another question or type *hi* for the main menu._"
    );
  }
}

async function sendWelcome(phone, name) {
  await sendInteractiveButtons(
    phone,
    `👋 Hi *${name}*! Welcome to *${process.env.BUSINESS_NAME || "our Marketing Agency"}*.\n\nHow can we help you today?`,
    [
      { id: "btn_services", title: "Our Services" },
      { id: "btn_quote",    title: "Get a Quote" },
      { id: "btn_ai",       title: "Ask AI Assistant" },
    ]
  );
}

module.exports = { handleMessage };
