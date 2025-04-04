const taskSelector = document.getElementById('taskSelector');
const nameInput = document.getElementById('nameInput');
const generateButton = document.getElementById('generateButton');
const resultDiv = document.getElementById('result');
const previousResultsDiv = document.getElementById('previousResults');

const min = 1;
const max = 10;
let availableNumbers = Array.from({length: max - min + 1}, (_, i) => i + min);

function saveResult(task, name, queueNumber) {
    const previousResults = loadPreviousResults(task);
    previousResults.push({ name, queueNumber, timestamp: new Date().toLocaleString() });
    localStorage.setItem(`randomQueueResults-${task}`, JSON.stringify(previousResults));
}

function loadPreviousResults(task) {
    const savedData = localStorage.getItem(`randomQueueResults-${task}`);
    return savedData ? JSON.parse(savedData) : [];
}

function displayPreviousResults(task) {
    const previousResults = loadPreviousResults(task);
    previousResultsDiv.innerHTML = `<h3>ประวัติการสุ่มคิวของ ${task}</h3>`;
    
    previousResults.forEach(result => {
        previousResultsDiv.innerHTML += `<p>ชื่อ: ${result.name} | คิวที่สุ่มได้: ${result.queueNumber} | เวลา: ${result.timestamp}</p>`;
    });
}

function isNameUsed(task, name) {
    const previousResults = loadPreviousResults(task);
    return previousResults.some(result => result.name === name);
}

generateButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const task = taskSelector.value;

    if (!name) {
        alert('กรุณากรอกชื่อก่อน');
        return;
    }

    if (isNameUsed(task, name)) {
        alert('ชื่อนี้ถูกใช้ไปแล้วสำหรับงานนี้!');
        return;
    }

    if (availableNumbers.length === 0) {
        alert('คิวทั้งหมดถูกสุ่มไปหมดแล้ว!');
        return;
    }

    let count = 0;
    const totalDuration = 5000; // ลุ้น 5 วินาที
    const intervalDuration = 100; // ความถี่ในการแสดงผลเลขปลอม (0.1 วินาที)

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const randomQueue = availableNumbers.splice(randomIndex, 1)[0];
    
    const interval = setInterval(() => {
        count += intervalDuration;

        // แสดงผลเลขปลอมระหว่างลุ้น
        const fakeRandomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        resultDiv.innerHTML = `ชื่อ: ${name} <br> กำลังสุ่มคิว... <strong>${fakeRandomNumber}</strong>`;
        
        if (count >= totalDuration) {
            clearInterval(interval);

            // แสดงผลที่สุ่มได้จริงเมื่อครบเวลา
            resultDiv.innerHTML = `ชื่อ: ${name} <br> คิวที่สุ่มได้: <strong>${randomQueue}</strong>`;
            
            // บันทึกผลลัพธ์ลงใน LocalStorage
            saveResult(task, name, randomQueue);
            displayPreviousResults(task);
        }
    }, intervalDuration);
});

taskSelector.addEventListener('change', () => {
    const task = taskSelector.value;
    displayPreviousResults(task);
});

displayPreviousResults(taskSelector.value);
