const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');
let tasks = JSON.parse(localStorage.getItem('taskList')) || [];

// ฟังก์ชันโหลดงานทั้งหมดจาก localStorage
function loadTasks() {
    taskSelector.innerHTML = '';  // ล้างตัวเลือกทั้งหมด
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.name;
        option.textContent = `${task.name} (คิวสูงสุด ${task.maxQueue})`;
        taskSelector.appendChild(option);  // เพิ่มตัวเลือกงาน
    });
}

// ฟังก์ชันบันทึกงานลง localStorage
function saveTasks() {
    localStorage.setItem('taskList', JSON.stringify(tasks));
}

// ฟังก์ชันสุ่มคิว
generateButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const name = nameInput.value.trim();

    if (!selectedTaskName || !name) {
        alert('กรุณาเลือกงานและกรอกชื่อของคุณ');
        return;
    }

    const task = tasks.find(t => t.name === selectedTaskName);
    if (!task) return;

    if (task.history && task.history.some(entry => entry.name === name)) {
        alert('คุณได้สุ่มคิวไปแล้ว ไม่สามารถสุ่มซ้ำได้!');
        return;
    }

    let currentNumber = 1;
    resultDiv.innerHTML = "กำลังสุ่มคิว...";

    const interval = setInterval(() => {
        currentNumber = Math.floor(Math.random() * task.maxQueue) + 1;
        resultDiv.innerHTML = `กำลังสุ่ม: ${currentNumber}`;
    }, 80);

    setTimeout(() => {
        clearInterval(interval);
        resultDiv.innerHTML = `คิวที่สุ่มได้: ${currentNumber}`;

        task.history.push({ name, queueNumber: currentNumber, timestamp: new Date().toLocaleString() });

        saveTasks();
        nameInput.value = '';
    }, 3000);
});

// ฟังก์ชันดูประวัติการสุ่มคิว
viewHistoryButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);

    if (!task || !task.history || task.history.length === 0) {
        previousResultsDiv.innerHTML = `<p>ไม่มีประวัติการสุ่มสำหรับงานนี้</p>`;
        return;
    }

    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มของ ${selectedTaskName}</h3>`;
    task.history.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.innerHTML = `<p>ชื่อ: ${entry.name} | คิวที่สุ่มได้: ${entry.queueNumber} | เวลา: ${entry.timestamp}</p>`;
        previousResultsDiv.appendChild(entryDiv);
    });
});

// เรียกใช้งาน loadTasks() เมื่อหน้าเว็บโหลด
loadTasks();
