import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const event = req.body.events?.[0];
  if (!event) return res.status(200).json({ ok: true });

  const userMessage = event.message?.text?.trim();

  if (!userMessage) return res.json({ ok: true });

  // 🔹 รีคิว
  if (userMessage.includes("รีคิว")) {
    await redis.set("queueCounter", 0);
    await replyToUser(event.replyToken, "✅ รีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // 🔹 จำนวนแก้ว
  if (userMessage === "แก้ว") {
    const cups = (await redis.get("cupCounter")) || 0;
    await replyToUser(event.replyToken, `ตอนนี้ขายไปทั้งหมด ${cups} แก้ว 🧋`);
    return res.json({ success: true });
  }

  return res.json({ ok: true });
}

// ฟังก์ชันตอบกลับผู้ใช้
async function replyToUser(replyToken, text) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}
