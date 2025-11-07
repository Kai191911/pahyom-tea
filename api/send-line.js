// /api/send-line.js
let queueCounter = 0; // ตัวนับคิว (เก็บไว้ระดับ global)

export default async function handler(req, res) {
  try {
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
  } catch (err) {
    console.error("Error in send-line.js:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ฟังก์ชันส่งข้อความไปยัง LINE
async function sendLineMessage(text) {
  const token = process.env.LINE_TOKEN; // ใช้ Channel access token ของคุณ
  const userId = process.env.LINE_USER_ID; // กำหนดใน .env ด้วย

  const response = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LINE API error:", errorText);
  }
}
