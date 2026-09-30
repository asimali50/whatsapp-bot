require("dotenv").config();
const express = require("express");
const webhookRouter = require("./routes/webhook");

const app = express();
app.use(express.json());

// Routes
app.use("/webhook", webhookRouter);

// Health check — Railway uses this to confirm app is running
app.get("/", (req, res) => {
  res.json({ status: "WhatsApp Marketing Bot is running 🚀" });
});

// Railway injects PORT automatically — always use process.env.PORT
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📌 Webhook URL: https://your-railway-domain.railway.app/webhook`);
});
