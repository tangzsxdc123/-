const API_URL = "https://script.google.com/macros/s/AKfycbxWUcy8B-6_Xpur8WWwujASjQRb0SWp9hDGu2i8Y9sbGBxjf8Wjgu0kDk1RNgbMg9o/exec";

// ฟังก์ชันบันทึกงานใหม่ไปยัง Google Sheets
async function saveTaskToSheet(task) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });

        const result = await response.json();
        if (result.status === "success") {
            loadTasksFromSheet();  // โหลดข้อมูลใหม่หลังจากบันทึกสำเร็จ
        }
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการบันทึกงาน:', error);
    }
}

// ฟังก์ชันโหลดข้อมูลงานจาก Google Sheets
async function loadTasksFromSheet() {
    try {
        const response = await fetch(API_URL);
        const tasksFromSheet = await response.json();
        tasks = tasksFromSheet;
        localStorage.setItem('taskList', JSON.stringify(tasks));  // บันทึกลง localStorage
        loadTasks();  // อัปเดต UI
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการโหลดงาน:', error);
    }
}

// ฟังก์ชันเพิ่มงานใหม่จากการกรอกข้อมูล
addTaskButton.addEventListener('click', () => {
    const taskName = newTaskInput.value.trim();
    const maxQueue = parseInt(queueCountInput.value.trim(), 10);

    if (!taskName || isNaN(maxQueue) || maxQueue <= 0) {
        alert('กรุณากรอกชื่องานใหม่ และ จำนวนคิวที่เป็นตัวเลขที่มากกว่า 0');
        return;
    }

    const newTask = { name: taskName, maxQueue, history: [] };
    tasks.push(newTask);
    saveTasks();
    loadTasks();
    saveTaskToSheet(newTask);  // ส่งงานใหม่ไปยัง Google Sheets
});
