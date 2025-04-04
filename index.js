const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const viewHistoryButton = document.getElementById('viewHistoryButton');
const resultDiv = document.getElementById('result');

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

    const randomNumber = Math.floor(Math.random() * task.maxQueue) + 1;

    resultDiv.innerHTML = `คิวที่สุ่มได้: <strong>${randomNumber}</strong>`;
    nameInput.value = '';
});

loadTasks();
