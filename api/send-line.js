// /api/send-line.js
let queueCounter = 0; // ตัวนับคิว (global)

export default async function handler(req, res) {
  try {
    const { message, userId } = req.body; // รับ message และ userId จาก request

    // ตรวจสอบว่าเป็นคำสั่งรีเซ็ตจากผู้อนุญาต
    if (
      message &&
      message.trim() === "รีคิว" &&
      userId === "Ua74514c2f5500bca939e5db00814c436"
    ) {
      queueCounter = 0;
      await sendLineMessage("🔁 ระบบรีเซ็ตคิวกลับเป็น 0 แล้ว");
      return res.status(200).json({ success: true, message: "Queue reset" });
    }

    // ถ้าไม่ใช่คำสั่งรีเซ็ต ก็ไม่ทำอะไร
    res.status(200).json({ success: true, message: "No action taken" });
  } catch (err) {
    console.error("Error in send-line.js:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}

// ฟังก์ชันส่งข้อความไปยัง LINE
async function sendLineMessage(text) {
  const token = process.env.LINE_TOKEN; // เก็บใน .env
  const userId = "Ua74514c2f5500bca939e5db00814c436"; // User ของคุณ

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
