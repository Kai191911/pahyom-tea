let queueCounter = 0;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { events } = req.body;

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userMessage = event.message.text.trim();
        const replyToken = event.replyToken;

        if (userMessage === "รีคิว") {
          queueCounter = 0;
          await replyLineMessage(replyToken, "🔁 ระบบรีเซ็ตคิวกลับเป็น 0 แล้ว");
        } else {
          queueCounter += 1;
          const messageWithQueue = `📦 คิวที่ ${queueCounter}\n${userMessage}`;
          await replyLineMessage(replyToken, messageWithQueue);
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
}

async function replyLineMessage(replyToken, text) {
  const token = process.env.LINE_TOKEN;
  const res = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("LINE reply API error:", errorText);
  }
}
