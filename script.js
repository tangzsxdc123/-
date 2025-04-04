const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const addTaskButton = document.getElementById('addTaskButton');
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

        const li = document.createElement('li');
        li.textContent = `${task.name} - คิวสูงสุด ${task.maxQueue}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'ลบ';
        deleteButton.addEventListener('click', () => deleteTask(task.name));

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function deleteTask(taskName) {
    tasks = tasks.filter(task => task.name !== taskName);
    saveTasks();
    loadTasks();
}

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

    if (task.history.some(record => record.name === name)) {
        alert('ชื่อนี้สุ่มไปแล้ว!');
        return;
    }

    const availableNumbers = Array.from({ length: task.maxQueue }, (_, i) => i + 1)
        .filter(num => !task.usedNumbers.includes(num));

    if (availableNumbers.length === 0) {
        alert('คิวเต็มหมดแล้ว!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers[randomIndex];
    task.usedNumbers.push(randomQueue);
    task.history.push({
