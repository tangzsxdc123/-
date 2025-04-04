const taskSelector = document.getElementById('taskSelector');
const viewHistoryButton = document.getElementById('viewHistoryButton');

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

loadTasks();
