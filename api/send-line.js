// api/send-line.js
export default async function handler(req, res) {
  try {
    const body = await req.json();
    const message = body.message;

    // ใส่ token และ userId ของคุณ
    const token = "YOUR_LINE_CHANNEL_ACCESS_TOKEN";
    const userId = "Ua74514c2f5500bca939e5db00814c436";

    const response = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        to: userId,
        messages: [{ type: "text", text: message }]
      })
    });

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      const text = await response.text();
      res.status(500).json({ error: text });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
