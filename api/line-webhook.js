import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const event = req.body.events?.[0];
  if (!event) return res.json({ ok: true });

  const message = event.message?.text?.trim();
  if (!message) return res.json({ ok: true });

  // ✅ รีคิว
  if (message === "รีคิว") {
    await redis.set("queueCounter", 0);
    await reply(event.replyToken, "✅ รีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // ✅ รีแก้ว
  if (message === "รีแก้ว") {
    await redis.set("cupCounter", 0);
    await reply(event.replyToken, "✅ รีจำนวนแก้วกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // ✅ นับแก้ว
  if (message === "แก้ว") {
    let cups = await redis.get("cupCounter");
    if (!cups) cups = 0;

    cups = Number(cups) + 1;
    await redis.set("cupCounter", cups);

    await reply(event.replyToken, `🥤 ตอนนี้ได้ ${cups} แก้ว`);
    return res.json({ success: true });
  }

  // ✅ จัดการคิว
  let queue = await redis.get("queueCounter");
  if (!queue) queue = 0;

  queue = Number(queue) + 1;
  await redis.set("queueCounter", queue);

  const full = `📦 คิวที่ ${queue}\n${message}`;
  await sendLineMessage(full);

  return res.json({ success: true });
}

// ✅ ส่งข้อความแบบ Push (ใช้ตอนแจ้งคิวใหม่)
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

// ✅ ตอบกลับข้อความทันที
async function reply(replyToken, text) {
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
