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

generateButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const name = nameInput.value.trim();

    if (!selectedTaskName || !name) {
        alert('กรุณาเลือกงานและกรอกชื่อของคุณ');
        return;
    }

    const task = tasks.find(t => t.name === selectedTaskName);

    if (!task) return;

    let currentNumber = 1;
    resultDiv.innerHTML = "กำลังสุ่มคิว...";

    const interval = setInterval(() => {
        currentNumber = Math.floor(Math.random() * task.maxQueue) + 1;
        resultDiv.innerHTML = `<strong>กำลังสุ่ม: ${currentNumber}</strong>`;
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        resultDiv.innerHTML = `คิวที่สุ่มได้: <strong>${currentNumber}</strong>`;
        
        if (!task.history) task.history = [];
        task.history.push({ name, queueNumber: currentNumber, timestamp: new Date().toLocaleString() });
        localStorage.setItem('taskList', JSON.stringify(tasks));
    }, 3000);
});

viewHistoryButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);

    if (!task || !task.history) return;

    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มคิวของ ${selectedTaskName}</h3>`;
    task.history.forEach(entry => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${entry.name} | คิวที่สุ่มได้: ${entry.queueNumber} | เวลา: ${entry.timestamp}</p>`;
    });
});

loadTasks();
