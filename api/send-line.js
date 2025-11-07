let currentQueue = 0;
let lastQueueDate = new Date().toLocaleDateString(); // เก็บวันที่ล่าสุดที่มีการใช้คิว

function getNextQueue() {
    const today = new Date().toLocaleDateString();

    // ถ้าวันเปลี่ยน รีเซ็ตคิว
    if (today !== lastQueueDate) {
        currentQueue = 0;
        lastQueueDate = today;
    }

    currentQueue += 1;
    return currentQueue;
}

// เวลาสร้างข้อความออเดอร์
function createOrderMessage(customerOrder) {
    const queueNumber = getNextQueue();
    return `📦 คิวลูกค้า ${queueNumber}\n${customerOrder}`;
}
