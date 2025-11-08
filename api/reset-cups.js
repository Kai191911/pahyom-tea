import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  await redis.set("cupCounter", 0);

  // ส่งข้อความแจ้ง LINE ว่าจำนวนแก้วถูกรีเซ็ตแล้ว
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LINE_TOKEN}`,
    },
    body: JSON.stringify({
      to: process.env.LINE_USER_ID,
      messages: [{ type: "text", text: "🕛 รีเซ็ตจำนวนแก้วประจำสัปดาห์แล้ว!" }],
    }),
  });

  res.json({ ok: true });
};
