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

app.post('/send-code', async (req, res) => {
  try {
    const { phone } = req.body;
    await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications
      .create({ to: phone, channel: 'sms' });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post('/verify-code', async (req, res) => {
  try {
    const { phone, code } = req.body;
    const check = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verificationChecks
      .create({ to: phone, code });

    if (check.status === 'approved') {
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(3000, () => console.log('✅ Server running on port 3000'));