import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const { message } = req.body || {};

  if (!message) {
    return res.status(400).json({ error: "No message" });
  }

  // รีคิว
  if (message.trim() === "รีคิว") {
    await redis.set("queueCounter", 0);
    await sendLineMessage("✅ รีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // อ่านคิว
  let queue = await redis.get("queueCounter");
  if (!queue) queue = 0;

  // เพิ่มคิว
  queue += 1;
  await redis.set("queueCounter", queue);

  const full = `📦 คิวที่ ${queue}\n${message}`;
  await sendLineMessage(full);

  res.json({ success: true });
}

async function sendLineMessage(text) {
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_TOKEN}`,
    },
    body: JSON.stringify({
      to: process.env.LINE_USER_ID,
      messages: [{ type: "text", text }],
    }),
  });
}
