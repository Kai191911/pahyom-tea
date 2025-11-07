// /api/send-line.js
let queueCounter = 0; // Global counter

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message" });
  }

  const cleaned = message.trim();

  // ✅ รีเซ็ตคิว
  if (cleaned === "รีคิว" || cleaned.toLowerCase() === "reset queue") {
    queueCounter = 0;
    await sendLineMessage("🔁 ระบบรีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.status(200).json({ success: true });
  }

  // ✅ เพิ่มคิวและส่งข้อความ
  queueCounter += 1;
  const fullMessage = `📦 คิวที่ ${queueCounter}\n${cleaned}`;

  try {
    await sendLineMessage(fullMessage);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Send error:", err);
    return res.status(500).json({ error: "Send failed" });
  }
}

async function sendLineMessage(text) {
  const token = process.env.LINE_TOKEN;
  const userId = process.env.LINE_USER_ID;

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }]
    })
  });

  if (!response.ok) {
    const errTxt = await response.text();
    throw new Error("LINE push failed: " + errTxt);
  }
}
