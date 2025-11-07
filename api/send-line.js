export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body || {};
  if (!message) return res.status(400).json({ error: "No message" });

  // อ่านคิวปัจจุบันจาก ENV
  let queue = parseInt(process.env.QUEUE_COUNTER || "0", 10);

  // ถ้ามีคนพิมพ์ "รีคิว"
  if (message.trim() === "รีคิว") {
    await updateEnv("QUEUE_COUNTER", "0");
    await sendLineMessage("✅ รีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.json({ success: true });
  }

  // เพิ่มคิว + อัปเดต ENV
  queue += 1;
  await updateEnv("QUEUE_COUNTER", String(queue));

  // ส่งข้อความเข้า LINE
  const fullMessage = `📦 คิวที่ ${queue}\n${message}`;
  await sendLineMessage(fullMessage);

  return res.json({ success: true });
}

// ฟังก์ชันส่งข้อความเข้า LINE
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

// ฟังก์ชันอัปเดตค่า ENV ใน Vercel
async function updateEnv(key, value) {
  await fetch(
    `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}/env`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value,
        id: process.env[`ENV_${key}_ID`],
        type: "plain",
      }),
    }
  );
}
