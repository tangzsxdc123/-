const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');

let tasks = JSON.parse(localStorage.getItem('taskList')) || [];

function loadTasks() {
    taskSelector.innerHTML = '';
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.name;
        option.textContent = `${task.name} (คิวสูงสุด ${task.maxQueue})`;
        taskSelector.appendChild(option);
    });
}

function saveTasks() {
    localStorage.setItem('taskList', JSON.stringify(tasks));
}

generateButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const name = nameInput.value.trim();

    if (!selectedTaskName || !name) {
        alert('กรุณาเลือกงานและกรอกชื่อของคุณ');
        return;
    }

    const task = tasks.find(t => t.name === selectedTaskName);
    if (!task) return;

    // ตรวจสอบว่าชื่อนี้สุ่มไปแล้วหรือยัง
    if (task.history && task.history.some(entry => entry.name === name)) {
        alert('คุณได้สุ่มคิวไปแล้ว ไม่สามารถสุ่มซ้ำได้!');
        return;
    }

    let currentNumber = 1;
    resultDiv.innerHTML = "กำลังสุ่มคิว...";

    const interval = setInterval(() => {
        currentNumber = Math.floor(Math.random() * task.maxQueue) + 1;
        resultDiv.innerHTML = `<div class="final-result">กำลังสุ่ม: ${currentNumber}</div>`;
    }, 80);

    setTimeout(() => {
        clearInterval(interval);
        resultDiv.innerHTML = `<div class="final-result highlight">คิวที่สุ่มได้: <strong>${currentNumber}</strong></div>`;

        if (!task.history) task.history = [];
        task.history.push({ name, queueNumber: currentNumber, timestamp: new Date().toLocaleString() });

        saveTasks();  // บันทึกข้อมูลหลังจากสุ่มสำเร็จ

        nameInput.value = '';  // ล้างชื่อที่กรอกหลังจากสุ่มสำเร็จ
    }, 3000);
});

viewHistoryButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);

    if (!task || !task.history || task.history.length === 0) {
        previousResultsDiv.innerHTML = `<p>ไม่มีประวัติการสุ่มสำหรับงานนี้</p>`;
        return;
    }

    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มของ ${selectedTaskName}</h3>`;
    
    task.history.forEach(entry => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${entry.name} | คิวที่สุ่มได้: ${entry.queueNumber} | เวลา: ${entry.timestamp}</p>`;
    });
});

loadTasks();
