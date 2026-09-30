const axios = require("axios");

const BASE_URL = `https://api.green-api.com/waInstance${process.env.GREEN_API_INSTANCE_ID}`;

/**
 * Send a plain text message
 */
async function sendTextMessage(to, text) {
  try {
    // Green API expects number in format: 923001234567@c.us
    const chatId = formatNumber(to);

    await axios.post(
      `${BASE_URL}/sendMessage/${process.env.GREEN_API_TOKEN}`,
      {
        chatId,
        message: text,
      }
    );
    console.log(`📤 Sent text to ${to}`);
  } catch (error) {
    console.error("Error sending text message:", error.response?.data || error.message);
  }
}

/**
 * Send interactive buttons (simulated as numbered list for Green API)
 */
async function sendInteractiveButtons(to, bodyText, buttons) {
  try {
    const buttonList = buttons
      .map((btn, i) => `${i + 1}️⃣ ${btn.title}`)
      .join("\n");

    const fullMessage = `${bodyText}\n\n${buttonList}\n\n_Reply with a number to choose._`;

    await sendTextMessage(to, fullMessage);
  } catch (error) {
    console.error("Error sending interactive message:", error.message);
  }
}

/**
 * Send a list message (formatted as numbered text)
 */
async function sendListMessage(to, bodyText, buttonLabel, sections) {
  try {
    let fullMessage = `${bodyText}\n\n`;
    sections.forEach((section) => {
      if (section.title) fullMessage += `*${section.title}*\n`;
      section.rows.forEach((row, i) => {
        fullMessage += `${i + 1}. ${row.title}\n`;
        if (row.description) fullMessage += `   ${row.description}\n`;
      });
    });

    await sendTextMessage(to, fullMessage);
  } catch (error) {
    console.error("Error sending list message:", error.message);
  }
}

/**
 * Format phone number to Green API chatId format
 * Input:  +923001234567 or 923001234567
 * Output: 923001234567@c.us
 */
function formatNumber(phone) {
  const cleaned = phone.replace(/\D/g, ""); // remove +, spaces, dashes
  return `${cleaned}@c.us`;
}

module.exports = { sendTextMessage, sendInteractiveButtons, sendListMessage };
