console.log("hello from script.js");

// === Constants: ===
const DEFAULT_SECONDS = 25 * 60;

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
let remainingSeconds = DEFAULT_SECONDS;
let isTimerRunning = false;
let timerIntervalId = null;

// === Functions: ===
function tick() {
    remainingSeconds -= 1;
    render();
}

function startTimer() {
    if (isTimerRunning) {
        console.log("Timer is already running");
        return;
    }
    console.log("Start clicked");
    modeElement.textContent = "Running";
    // if (timerIntervalId !== null) {
    //     clearInterval(timerIntervalId);
    // }
    timerIntervalId = setInterval(tick, 1000);
    isTimerRunning = true;
}

function handleReset() {
    console.log("Reset clicked");
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    isTimerRunning = false;
    remainingSeconds = DEFAULT_SECONDS;
    modeElement.textContent = "Work";
    render();
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Convert nums into strings and pad with "0"
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    
    return `${paddedMinutes}:${paddedSeconds}`;
}

function render() {
    timerElement.textContent = formatTime(remainingSeconds);
}

// === Event listeners: ===
startPauseButton.addEventListener("click", startTimer);
resetButton.addEventListener("click", handleReset);

// === Startup: ===
render();
