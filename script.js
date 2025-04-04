const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const addTaskButton = document.getElementById('addTaskButton');
const newTaskInput = document.getElementById('newTaskInput');
const queueCountInput = document.getElementById('queueCountInput');
const taskList = document.getElementById('taskList');
const resultDiv = document.getElementById('result');

let tasks = JSON.parse(localStorage.getItem('taskList')) || [
    { name: 'คอนเสิร์ต A', maxQueue: 10 },
    { name: 'คอนเสิร์ต B', maxQueue: 15 },
    { name: 'คอนเสิร์ต C', maxQueue: 20 }
];

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

    tasks.push({ name: newTaskName, maxQueue });
    saveTasks();
    loadTasks();

    alert(`เพิ่มงาน "${newTaskName}" เรียบร้อยแล้ว! คิวสูงสุด: ${maxQueue}`);
    newTaskInput.value = '';
    queueCountInput.value = '';
});

generateButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    const task = tasks.find(t => t.name === selectedTaskName);

    if (!task) {
        alert('กรุณาเลือกงานที่ต้องการสุ่มคิว');
        return;
    }

    const maxQueue = task.maxQueue;
    const randomQueue = Math.floor(Math.random() * maxQueue) + 1;

    resultDiv.innerHTML = `งาน: ${task.name} <br> คิวที่สุ่มได้: <strong>${randomQueue}</strong>`;
});

loadTasks();
