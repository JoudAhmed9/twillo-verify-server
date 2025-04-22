
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// simple in-memory store (for demo/testing only)
const verificationStore = {};

app.post('/send-code', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (!phone || !code) {
      return res.status(400).send({ error: 'Phone or code missing.' });
    }

    verificationStore[phone] = code;

    await client.messages.create({
      body: `Your Tanfis verification code is: ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;

    if (verificationStore[phone] === code) {
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));
