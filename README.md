# WhatsApp Digital Marketing Chatbot

A Node.js WhatsApp chatbot built on **Green API** with **AI-powered replies** via OpenAI GPT-4o-mini.

## Features

- Welcome menu with numbered options
- Lead capture flow (name → business → service → saved)
- AI assistant powered by GPT-4o-mini
- Works with any normal WhatsApp number (no Meta/Twilio account needed)
- Session tracking per user

---

## Project Structure

```
chat-bot/
├── src/
│   ├── index.js                        # Entry point, Express server
│   ├── routes/
│   │   └── webhook.js                  # Green API webhook receiver
│   ├── controllers/
│   │   └── messageController.js        # Bot logic & conversation flows
│   ├── services/
│   │   ├── whatsapp.js                 # Send messages via Green API
│   │   └── ai.js                       # OpenAI AI replies
│   └── utils/
│       └── sessionStore.js             # In-memory conversation state
├── .env.example                        # Environment variable template
├── .gitignore
└── package.json
```

---

## Requirements

- Node.js v18 or higher → [nodejs.org](https://nodejs.org)
- A WhatsApp number (any normal number works)
- Green API account (free) → [green-api.com](https://green-api.com)
- OpenAI API key → [platform.openai.com](https://platform.openai.com)
- ngrok (for local testing) → [ngrok.com](https://ngrok.com)

---

## Setup Guide

### Step 1 — Install Node dependencies

Open VS Code terminal in the project folder and run:

```bash
npm install
```

---

### Step 2 — Create your .env file

```bash
copy .env.example .env
```

Then open `.env` and fill in all the values (see steps below).

---

### Step 3 — Green API Setup (WhatsApp connection)

Green API lets you connect your own WhatsApp number — no Meta or Twilio account needed.

1. Go to [green-api.com](https://green-api.com) and sign up with your email
2. After login, click **"Create Instance"**
3. Select the **Free** plan
4. Your instance will be created. Open it and you will see:
   - `idInstance` — copy this into `.env` as `GREEN_API_INSTANCE_ID`
   - `apiTokenInstance` — copy this into `.env` as `GREEN_API_TOKEN`
5. Click **"Scan QR"** inside the instance
6. On your phone: open WhatsApp → Settings → Linked Devices → Link a Device
7. Scan the QR code shown on screen
8. Wait for status to show **"authorized"** — your number is now connected

> Recommended: Use a dedicated WhatsApp number for the bot (a second SIM or separate account) so personal messages do not mix with bot messages.

---

### Step 4 — OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in → click your profile → **API Keys**
3. Click **"Create new secret key"**
4. Copy the key and paste into `.env` as `OPENAI_API_KEY`

> Note: OpenAI requires a small credit balance to use the API. Add $5 credit to get started.

---

### Step 5 — Set your business name

In `.env`, update:

```
BUSINESS_NAME=Your Actual Business Name
```

This name appears in the welcome message users receive.

---

### Step 6 — Get a public webhook URL (ngrok)

Green API needs a public HTTPS URL to send messages to your bot. Use ngrok for local development:

1. Download and install ngrok from [ngrok.com](https://ngrok.com)
2. Sign up for a free account and get your auth token
3. Run in a separate terminal:

```bash
ngrok http 3000
```

4. Copy the `https://xxxx.ngrok-free.app` URL (the HTTPS one)

---

### Step 7 — Register webhook URL in Green API

1. Go to your Green API dashboard
2. Open your instance
3. Click **"Settings"** tab
4. Find **"Webhook URL"** field
5. Paste your ngrok URL + `/webhook`:

```
https://xxxx.ngrok-free.app/webhook
```

6. Make sure these webhook types are enabled:
   - `incomingMessageReceived` ✅
7. Click **Save**

---

### Step 8 — Run the bot

```bash
# Development mode (auto-restarts on code changes)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ Server running on port 3000
📌 Webhook URL: https://your-domain.com/webhook
```

---

### Step 9 — Test the bot

From a different WhatsApp number, send **"hi"** to the number you connected in Step 3.

You should receive:

```
👋 Hi [Your Name]! Welcome to [Your Business Name].

How can we help you today?

1️⃣ Our Services
2️⃣ Get a Quote
3️⃣ Ask AI Assistant

Reply with a number to choose.
```

---

## How the Bot Works

```
User says "hi"
    → Welcome menu with 3 options (reply 1, 2, or 3)

Reply "1" — Our Services
    → Lists all digital marketing services

Reply "2" — Get a Quote
    → Lead flow: asks name → business name → service needed → lead saved

Reply "3" — Ask AI Assistant
    → Free-form AI chat using GPT-4o-mini
    → Answers any digital marketing question intelligently
```

---

## Deploy to Production (Railway)

For a permanent public URL without ngrok:

1. Push this project to a GitHub repository
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Select your repo
4. Go to **Variables** tab → add all values from your `.env` file
5. Railway will give you a public URL like `https://your-app.railway.app`
6. Update your Green API webhook URL to: `https://your-app.railway.app/webhook`

Railway has a free tier that is enough to run this bot.

---

## Environment Variables Reference

| Variable | Where to get it | Example |
|---|---|---|
| `GREEN_API_INSTANCE_ID` | Green API dashboard → Instance ID | `1101234567` |
| `GREEN_API_TOKEN` | Green API dashboard → API Token | `abc123xyz...` |
| `OPENAI_API_KEY` | platform.openai.com → API Keys | `sk-proj-...` |
| `PORT` | Any port number (default 3000) | `3000` |
| `BUSINESS_NAME` | Your own business name | `Ali Marketing Agency` |

---

## Customization

- **Change AI behavior** — Edit the `SYSTEM_PROMPT` in `src/services/ai.js`
- **Add new menu options** — Add cases in `routeTextMessage()` in `src/controllers/messageController.js`
- **Save leads to a database** — Replace the `console.log("📥 New Lead:", ...)` line in the controller with your database write code
- **Change the welcome message** — Edit the `sendWelcome()` function in the controller
- **Add more services** — Update the services list in `handleServices()` in the controller

---

## Troubleshooting

| Problem | Solution |
|---|---|
| Bot not receiving messages | Check ngrok is running and webhook URL is set correctly in Green API |
| Green API status not "authorized" | Re-scan the QR code — it expires after a few minutes |
| AI not replying | Check `OPENAI_API_KEY` is correct and account has credit |
| `Cannot find module` error | Run `npm install` again |
| Port already in use | Change `PORT` in `.env` to `3001` or another number |
