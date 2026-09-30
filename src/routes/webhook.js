const express = require("express");
const router = express.Router();
const { handleMessage } = require("../controllers/messageController");

// Green API sends JSON POST data
router.use(express.json());

// Health check
router.get("/", (req, res) => {
  res.status(200).send("WhatsApp bot webhook is active ✅");
});

// Receive incoming messages from Green API
router.post("/", async (req, res) => {
  try {
    const body = req.body;

    // Green API webhook body structure
    const typeWebhook = body?.typeWebhook;

    // Only handle incoming messages
    if (typeWebhook !== "incomingMessageReceived") {
      return res.sendStatus(200);
    }

    const messageData = body?.messageData;
    const senderData = body?.senderData;

    // Only handle text messages
    if (messageData?.typeMessage !== "textMessage") {
      return res.sendStatus(200);
    }

    const senderPhone = senderData?.sender?.replace("@c.us", ""); // e.g. 923001234567
    const senderName = senderData?.senderName || "there";
    const text = messageData?.textMessageData?.textMessage?.trim();

    if (!senderPhone || !text) {
      return res.sendStatus(400);
    }

    console.log(`📩 Message from ${senderPhone} (${senderName}): ${text}`);

    const message = {
      type: "text",
      from: senderPhone,
      text: { body: text },
    };

    await handleMessage(senderPhone, senderName, message);
  } catch (error) {
    console.error("Error processing webhook:", error);
  }

  res.sendStatus(200);
});

module.exports = router;
