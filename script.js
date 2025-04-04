const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const addTaskButton = document.getElementById('addTaskButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const newTaskInput = document.getElementById('newTaskInput');
const queueCountInput = document.getElementById('queueCountInput');
const taskList = document.getElementById('taskList');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');

let tasks = JSON.parse(localStorage.getItem('taskList')) || [];

function saveTasks() {
    localStorage.setItem('taskList', JSON.stringify(tasks));
}

function loadTasks() {
    taskSelector.innerHTML = '';
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.name;
        option.textContent = `${task.name} (คิวสูงสุด ${task.maxQueue})`;
        taskSelector.appendChild(option);
    });
}

function displayPreviousResults(task) {
    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มคิวของ ${task.name}</h3>`;
    task.history.forEach(result => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${result.name} | คิวที่สุ่มได้: ${result.queueNumber} | เวลา: ${result.timestamp}</p>`;
    });
}

viewHistoryButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);
    if (task) displayPreviousResults(task);
});

addTaskButton.addEventListener('click', () => {
    const newTaskName = newTaskInput.value.trim();
    const maxQueue = parseInt(queueCountInput.value.trim(), 10);

    if (!newTaskName || isNaN(maxQueue) || maxQueue <= 0) {
        alert('กรุณากรอกชื่องานใหม่ และ จำนวนคิวที่เป็นตัวเลขที่มากกว่า 0');
        return;
    }

    tasks.push({ name: newTaskName, maxQueue, usedNumbers: [], history: [] });
    saveTasks();
    loadTasks();
    newTaskInput.value = '';
    queueCountInput.value = '';
});

generateButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);
    const name = nameInput.value.trim();

    if (!task || !name) {
        alert('กรุณาเลือกงานและกรอกชื่อของคุณ');
        return;
    }

    const randomQueue = Math.floor(Math.random() * task.maxQueue) + 1;

    task.usedNumbers.push(randomQueue);
    task.history.push({ name, queueNumber: randomQueue, timestamp: new Date().toLocaleString() });
    saveTasks();

    resultDiv.innerHTML = `คิวที่สุ่มได้: <strong>${randomQueue}</strong>`;
    nameInput.value = '';
});

loadTasks();
