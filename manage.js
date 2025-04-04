const taskSelector = document.getElementById('taskSelector');
const addTaskButton = document.getElementById('addTaskButton');
const deleteTaskButton = document.getElementById('deleteTaskButton');
const newTaskInput = document.getElementById('newTaskInput');
const queueCountInput = document.getElementById('queueCountInput');

let tasks = JSON.parse(localStorage.getItem('taskList')) || [];

function saveTasks() {
    localStorage.setItem('taskList', JSON.stringify(tasks));
}

function loadTasks() {
    taskSelector.innerHTML = '';
    tasks.forEach(task => {
        const option = document.createElement('option');
        option.value = task.name;
        option.textContent = `${task.name} (คิวสูงสุด ${task.maxQueue})`;
        taskSelector.appendChild(option);
    });
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

deleteTaskButton.addEventListener('click', () => {
    const selectedTaskName = taskSelector.value;
    tasks = tasks.filter(task => task.name !== selectedTaskName);
    saveTasks();
    loadTasks();
});

loadTasks();
