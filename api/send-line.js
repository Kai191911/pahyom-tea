// ตัวอย่าง /api/send-line.js
let queueCounter = 0; // ตัวนับคิว (เก็บไว้ระดับ global)

export default async function handler(req, res) {
  const { message } = req.body;

  // ถ้ามีการพิมพ์ "รีคิว" จากไลน์
  if (message && (message.trim() === "รีคิว" || message.trim().toLowerCase() === "reset queue")) {
    queueCounter = 0;
    await sendLineMessage("🔁 ระบบรีเซ็ตคิวกลับเป็น 0 แล้ว");
    return res.status(200).json({ success: true, message: "Queue reset" });
  }

  // กรณีเป็นข้อความออเดอร์ทั่วไป
  queueCounter += 1;
  const messageWithQueue = `📦 คิวที่ ${queueCounter}\n${message}`;

  await sendLineMessage(messageWithQueue);
  res.status(200).json({ success: true });
}

// ฟังก์ชันส่งข้อความไปยัง LINE
async function sendLineMessage(text) {
  const token = process.env.LINE_TOKEN; // ใช้ Channel access token ของคุณ
  await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer 5xb4NTQxMBbeHkKFIkLfpkoIwbaoBpuKrPuI5wEl+9GL2YAMimH6MCZuLInvR7A58jjkhy2pyXW201jWkBXl2CUa8QyylOBZhOkiowVIbGSuZBhgVZQR+TQl4OLTiAp05x1KrF0fFem6wVau85K0zAdB04t89/1O/w1cDnyilFU=`
    },
    body: JSON.stringify({
      to: "Ua74514c2f5500bca939e5db00814c436", // userId ของคุณ
      messages: [{ type: "text", text }]
    })
  });
}
