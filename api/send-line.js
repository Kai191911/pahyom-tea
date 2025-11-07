let queueCounter = 0;

export default async function handler(req, res) {
  console.log("✅ /api/send-line hit");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body || {};
  console.log("📨 Received message:", message);

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  // รีคิว
  if (message.trim() === "รีคิว") {
    queueCounter = 0;
    await sendLineMessage("✅ รีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.status(200).json({ success: true });
  }

  queueCounter++;
  const full = `📦 คิวที่ ${queueCounter}\n${message}`;

  try {
    await sendLineMessage(full);
    console.log("✅ Push OK");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Push Error:", err);
    return res.status(500).json({ error: err.message });
  }
}

async function sendLineMessage(text) {
  const token = process.env.LINE_TOKEN;
  const userId = process.env.LINE_USER_ID;

  console.log("➡️ Sending to LINE:", userId);

  const r = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }]
    })
  });

  const body = await r.text();
  console.log("🔎 LINE Response:", body);

  if (!r.ok) {
    throw new Error(body);
  }
}
