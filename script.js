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
    if (remainingSeconds <= 0) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        isTimerRunning = false;
    }
    render();
}

function startTimer() {
    if (isTimerRunning || remainingSeconds <= 0) {
        // console.log("Timer is already running");
        return;
    }
    console.log("Start clicked");
    timerIntervalId = setInterval(tick, 1000);
    isTimerRunning = true;
    render();
}

function pauseTimer() {
    if (!isTimerRunning) {
        console.log("Timer is already paused");
        return;
    }
    console.log("Pause clicked");
    clearInterval(timerIntervalId);
    timerIntervalId = null;  // Keeps state accurate
    isTimerRunning = false;
    render();
}

function handleStartPause() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function handleReset() {
    console.log("Reset clicked");
    clearInterval(timerIntervalId);
    timerIntervalId = null;
    isTimerRunning = false;
    remainingSeconds = DEFAULT_SECONDS;
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
    const isPaused = 0 < remainingSeconds && remainingSeconds < DEFAULT_SECONDS && !isTimerRunning;
    const isFinished = remainingSeconds <= 0;

    timerElement.classList.toggle("is-paused", isPaused);
    timerElement.classList.toggle("is-finished", isFinished);

    timerElement.textContent = formatTime(remainingSeconds);
    modeElement.textContent = "Work";
    startPauseButton.disabled = isFinished;  // Disables "Start" button once timer hits 00:00

    if (isTimerRunning) {
        startPauseButton.textContent = "Pause";
    } else {
        startPauseButton.textContent = "Start";
    }
}

// === Event listeners: ===
startPauseButton.addEventListener("click", handleStartPause);
resetButton.addEventListener("click", handleReset);

// === Startup: ===
render();
