console.log("hello from script.js");

// === Constants: ===
// const DEFAULT_SECONDS = 25 * 60;
const DEFAULT_MS = 25 * 60 * 1000;

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
// let remainingSeconds = DEFAULT_SECONDS;
let remainingMilliseconds = DEFAULT_MS;
let timerEndsAt = null;
let isTimerRunning = false;
let timerIntervalId = null;

// === Functions: ===
function tick() {
    // remainingSeconds -= 1;
    remainingMilliseconds = timerEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        isTimerRunning = false;
        remainingMilliseconds = 0;
    }
    render();
}

function startTimer() {
    if (isTimerRunning || remainingMilliseconds <= 0) {
        // console.log("Timer is already running");
        return;
    }
    timerEndsAt = Date.now() + remainingMilliseconds;
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
    remainingMilliseconds = timerEndsAt - Date.now();  // Idk if this is necessary
    console.log("Pause clicked");
    clearInterval(timerIntervalId);
    timerIntervalId = null;  // Keeps state accurate
    isTimerRunning = false;
    timerEndsAt = null;  // Idk if this is necessary
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
    // remainingSeconds = DEFAULT_SECONDS;
    remainingMilliseconds = DEFAULT_MS;
    timerEndsAt = null;
    render();
}

function formatTime(totalSeconds) {
    // const totalSeconds = Math.ceil(totalMilliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Convert nums into strings and pad with "0"
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    
    return `${paddedMinutes}:${paddedSeconds}`;
}

function render() {
    const remainingSeconds = Math.ceil( remainingMilliseconds / 1000);
    // const isPaused = 0 < remainingSeconds && remainingSeconds < DEFAULT_SECONDS && !isTimerRunning;
    // const isFinished = remainingSeconds <= 0;
    const isPaused = 0 < remainingMilliseconds && remainingMilliseconds < DEFAULT_MS && !isTimerRunning;
    const isFinished = remainingMilliseconds <= 0;

    timerElement.classList.toggle("is-paused", isPaused);
    timerElement.classList.toggle("is-finished", isFinished);

    timerElement.textContent = formatTime(remainingSeconds);
    // timerElement.textContent = formatTime(remainingMilliseconds);
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
