const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');

const min = 1;
const max = 10;
let availableNumbers = Array.from({length: max - min + 1}, (_, i) => i + min);

function loadPreviousResults(task) {
    const savedData = localStorage.getItem(`randomQueueResults-${task}`);
    return savedData ? JSON.parse(savedData) : [];
}

function saveResult(task, name, queueNumber) {
    const previousResults = loadPreviousResults(task);
    previousResults.push({ name, queueNumber, timestamp: new Date().toLocaleString() });
    localStorage.setItem(`randomQueueResults-${task}`, JSON.stringify(previousResults));
}

function displayPreviousResults(task) {
    const previousResults = loadPreviousResults(task);
    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มคิวของ ${task}</h3>`;
    
    previousResults.forEach(result => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${result.name} | คิวที่สุ่มได้: ${result.queueNumber} | เวลา: ${result.timestamp}</p>`;
    });
}

generateButton.addEventListener('click', () => {
    const name = nameInput.value;
    const task = taskSelector.value;

    if (!name) {
        alert('กรุณากรอกชื่อก่อน');
        return;
    }

    if (availableNumbers.length === 0) {
        alert('คิวทั้งหมดถูกสุ่มไปหมดแล้ว!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers.splice(randomIndex, 1)[0];
    
    resultDiv.innerHTML = `ชื่อ: ${name} <br> คิวที่สุ่มได้: <strong>${randomQueue}</strong>`;
    
    saveResult(task, name, randomQueue);
    displayPreviousResults(task);
});

// แสดงประวัติของงานที่เลือกเมื่อเปลี่ยนงาน
taskSelector.addEventListener('change', () => {
    const task = taskSelector.value;
    displayPreviousResults(task);
});

// โหลดประวัติของงานที่เลือกครั้งแรกเมื่อเปิดหน้าเว็บ
displayPreviousResults(taskSelector.value);