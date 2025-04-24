const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// ✅ اختبار السيرفر
app.get("/", (req, res) => {
  res.send("🚀 Vonage SMS Server is live and ready!");
});

// ✅ نقطة إرسال رمز التحقق
app.post("/send-code", async (req, res) => {
  // 🟡 طباعة البيانات القادمة من Unity
  console.log("📥 Received body:", req.body);

  const { phone } = req.body;

  // 🟡 طباعة الرقم
  console.log("📲 Phone received:", phone);

  if (!phone) {
    console.log("🚫 Missing phone in request!");
    return res.status(400).json({ error: "Phone number is missing." });
  }

  // توليد كود عشوائي من 4 أرقام
  const code = Math.floor(1000 + Math.random() * 9000);

  try {
    const response = await axios.post("https://rest.nexmo.com/sms/json", null, {
      params: {
        api_key: process.env.VONAGE_API_KEY,
        api_secret: process.env.VONAGE_API_SECRET,
        to: phone,
        from: "Tanfis", // الاسم الظاهر في الرسالة
        text: `Tanfis: Your verification code is ${code}`,
      },
    });

    console.log("✅ SMS sent to:", phone);
    // نرجع الكود مع الرد عشان Unity تقدر تقارن
    res.json({ success: true, code: code.toString() });
  } catch (error) {
    console.error("❌ Failed to send SMS:", error.message);
    res.status(500).json({ error: "SMS failed", details: error.message });
  }
});

// ✅ بدء تشغيل السيرفر
app.listen(PORT, () => {
  console.log(`🚀 Vonage server running on port ${PORT}`);
});
