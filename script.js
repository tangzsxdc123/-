const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');
const addTaskButton = document.getElementById('addTaskButton');
const newTaskInput = document.getElementById('newTaskInput');
const taskList = document.getElementById('taskList');

const min = 1;
const max = 10;
let availableNumbers = Array.from({length: max - min + 1}, (_, i) => i + min);

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem('taskList')) || ['คอนเสิร์ต A', 'คอนเสิร์ต B', 'คอนเสิร์ต C'];
    taskSelector.innerHTML = '';
    taskList.innerHTML = '';

    savedTasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task;
        option.textContent = task;
        taskSelector.appendChild(option);

        const li = document.createElement('li');
        li.textContent = task;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'ลบ';
        deleteButton.style.marginLeft = '10px';
        deleteButton.addEventListener('click', () => deleteTask(task));

        li.appendChild(deleteButton);
        taskList.appendChild(li);
    });
}

function saveTasks(tasks) {
    localStorage.setItem('taskList', JSON.stringify(tasks));
}

function deleteTask(taskName) {
    const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
    const updatedTasks = tasks.filter(task => task !== taskName);
    saveTasks(updatedTasks);
    loadTasks();
}

addTaskButton.addEventListener('click', () => {
    const newTask = newTaskInput.value.trim();

    if (!newTask) {
        alert('กรุณากรอกชื่องานใหม่');
        return;
    }

    const tasks = JSON.parse(localStorage.getItem('taskList')) || [];
    if (tasks.includes(newTask)) {
        alert('งานนี้มีอยู่แล้ว!');
        return;
    }

    tasks.push(newTask);
    saveTasks(tasks);
    loadTasks();

    alert(`เพิ่มงาน "${newTask}" เรียบร้อยแล้ว!`);
    newTaskInput.value = '';
});

loadTasks();
