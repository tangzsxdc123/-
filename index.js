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
        resultDiv.innerHTML = `<div class="final-result">กำลังสุ่ม: ${currentNumber}</div>`;
    }, 80);

    setTimeout(() => {
        clearInterval(interval);
        resultDiv.innerHTML = `<div class="final-result highlight">คิวที่สุ่มได้: <strong>${currentNumber}</strong></div>`;

        if (!task.history) task.history = [];
        task.history.push({ name, queueNumber: currentNumber, timestamp: new Date().toLocaleString() });
        localStorage.setItem('taskList', JSON.stringify(tasks));
    }, 3000);
});

loadTasks();
