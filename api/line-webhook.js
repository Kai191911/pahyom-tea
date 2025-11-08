import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  const event = req.body.events?.[0];
  if (!event) return res.json({ ok: true });

  const message = event.message?.text?.trim();

  // ✅ รีจำนวนแก้วด้วยคำว่า "รีแก้ว"
  if (message === "รีแก้ว") {
    await redis.set("cupCounter", 0);
    await reply(event.replyToken, "✅ รีค่าแก้วกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // ✅ ถ้าพิมพ์คำว่า "แก้ว"
  if (message === "แก้ว") {
    let cups = await redis.get("cupCounter");
    if (!cups) cups = 0;

    cups += 1;
    await redis.set("cupCounter", cups);

    await reply(event.replyToken, `🥤 ได้ ${cups} แก้ว`);
    return res.json({ success: true });
  }

  return res.json({ ok: true });
}

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
