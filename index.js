const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ID = process.env.ID_INSTANCE;
const TOKEN = process.env.API_TOKEN;
const GEMINI_KEY = process.env.GEMINI_KEY;

app.post('/webhook', async (req, res) => {
  try {
    const data = req.body;
    if (data.typeWebhook !== 'incomingMessageReceived') return res.sendStatus(200);
    const msg = data.messageData?.textMessageData?.textMessage;
    const chatId = data.senderData?.chatId;
    if (!msg || !chatId || data.senderData?.fromMe) return res.sendStatus(200);

    // Gemini se jawab
    const gemini = await axios.post(https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}, {
      contents: [{ parts: [{ text: "Tum ek helpful WhatsApp assistant ho, Roman Urdu me jawab do. Sawal: " + msg }] }]
    });
    const reply = gemini.data.candidates[0].content.parts[0].text;

    // WhatsApp pe wapas bhejo
    await axios.post(https://7107.api.green-api.com/waInstance${ID}/sendMessage/${TOKEN}, {
      chatId: chatId,
      message: reply
    });
    res.sendStatus(200);
  } catch (e) { console.log(e.message); res.sendStatus(200); }
});

app.get('/', (req, res) => res.send('Bot Chal Raha Hai'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Running'));