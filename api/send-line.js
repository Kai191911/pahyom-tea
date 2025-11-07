// /api/send-line.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const LINE_TOKEN = "ใส่ Channel Access Token ของคุณที่นี่";

  const lineRes = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${LINE_TOKEN}`,
    },
    body: JSON.stringify({
      to: "ใส่ userId ของคุณ", // เช่น "Ua74514c2f5500bca939e5db00814c436"
      messages: [
        { type: "text", text: message }
      ],
    }),
  });

  if (!lineRes.ok) {
    const text = await lineRes.text();
    console.error("LINE API Error:", text);
    return res.status(500).json({ error: "LINE send failed", detail: text });
  }

  return res.status(200).json({ success: true });
}
