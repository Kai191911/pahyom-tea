import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, items } = req.body;

  // ✅ นับจำนวนแก้วรวมจากทุกเมนูในออเดอร์
  const totalCups = items?.reduce((sum, item) => sum + (item.qty || 0), 0) || 0;

  // ✅ ดึงค่าปัจจุบันจาก Redis
  let current = await redis.get("cupCounter");
  if (!current) current = 0;

  // ✅ บวกเพิ่ม
  const newTotal = Number(current) + totalCups;
  await redis.set("cupCounter", newTotal);

  // ✅ ส่งข้อความแจ้ง LINE (รวมจำนวนแก้วด้วย)
  const fullMessage = 
    `🧋 ออเดอร์ใหม่เข้ามา!\n\n${message}\n\n🥤 รวมทั้งหมด ${newTotal} แก้ว`;

  await sendLine(fullMessage);

  return res.status(200).json({ success: true, totalCups: newTotal });
}

async function sendLine(text) {
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
