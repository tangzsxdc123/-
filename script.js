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

    if (tasks.find(task => task.name === newTaskName)) {
        alert('งานนี้มีอยู่แล้ว!');
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
        alert('ชื่อนี้สุ่มคิวไปแล้ว!');
        return;
    }

    let availableNumbers = Array.from({ length: task.maxQueue }, (_, i) => i + 1)
        .filter(num => !task.usedNumbers.includes(num));

    if (availableNumbers.length === 0) {
        alert('คิวเต็มหมดแล้ว!');
        return;
    }

    let count = 0;
    const totalDuration = 5000;
    const intervalDuration = 100;

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers[randomIndex];

    const interval = setInterval(() => {
        count += intervalDuration;

        const fakeRandom = Math.floor(Math.random() * task.maxQueue) + 1;
        resultDiv.innerHTML = `กำลังสุ่มคิว... ${fakeRandom}`;

        if (count >= totalDuration) {
            clearInterval(interval);
            task.usedNumbers.push(randomQueue);
            task.history.push({ name, queueNumber: randomQueue, timestamp: new Date().toLocaleString() });

            saveTasks();
            resultDiv.innerHTML = `งาน: ${task.name} <br> คิวที่สุ่มได้: <strong>${randomQueue}</strong>`;
            displayPreviousResults(task);
        }
    }, intervalDuration);
});

function displayPreviousResults(task) {
    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มคิวของ ${task.name}</h3>`;
    task.history.forEach(result => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${result.name} | คิวที่สุ่มได้: ${result.queueNumber} | เวลา: ${result.timestamp}</p>`;
    });
}

loadTasks();
