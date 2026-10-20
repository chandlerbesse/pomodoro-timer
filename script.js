console.log("hello from script.js");

// === Constants: ===
const DEFAULT_MS = 25 * 60 * 1000;

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
let remainingMilliseconds = DEFAULT_MS;
let timerEndsAt = null;
let isTimerRunning = false;
let timerIntervalId = null;

// let prevTick = null // TEMP for testing

// === Functions: ===
function tick() {
    // // Testing
    // const startTick = Date.now()  // TEMP
    // console.log(startTick - prevTick, document.visibilityState)  // TEMP: ms since the prev tick
    // prevTick = startTick  // TEMP: remember this tick for the next one

    remainingMilliseconds = timerEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
        clearInterval(timerIntervalId);
        timerIntervalId = null;
        isTimerRunning = false;
        remainingMilliseconds = 0;  // Protects formatTime() from negative values
    }
    render();
}

function startTimer() {
    if (isTimerRunning || remainingMilliseconds <= 0) {
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
    remainingMilliseconds = timerEndsAt - Date.now();  // Spamming "Pause" button will keep updating remainingMilliseconds
    console.log("Pause clicked");
    clearInterval(timerIntervalId);
    timerIntervalId = null;  // Keeps state accurate
    isTimerRunning = false;
    timerEndsAt = null;  // While paused, there is no end time. A new end time will need to be calculated once unpaused
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
    remainingMilliseconds = DEFAULT_MS;
    timerEndsAt = null;
    render();
}

function handleVisibilityChange() {
    if (!document.hidden && isTimerRunning) {
        tick();
    }
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
    const remainingSeconds = Math.ceil(remainingMilliseconds / 1000);
    const formattedTime = formatTime(remainingSeconds);
    const isPaused = 0 < remainingMilliseconds && remainingMilliseconds < DEFAULT_MS && !isTimerRunning;
    const isFinished = remainingMilliseconds <= 0;

    timerElement.classList.toggle("is-paused", isPaused);
    timerElement.classList.toggle("is-finished", isFinished);

    timerElement.textContent = formattedTime;
    modeElement.textContent = "Work";
    startPauseButton.disabled = isFinished;  // Disables "Start" button once timer hits 00:00

    // Tab Title:
    if (isTimerRunning) {
        document.title = `Running: ${formattedTime}`;
    } else if (isPaused) {
        document.title = `Paused: ${formattedTime}`;
    } else if (isFinished) {
        document.title = `Finished: ${formattedTime}`;
    } else {
        document.title = "Pomodoro Timer";
    }

    // Button Labels:
    if (isTimerRunning) {
        startPauseButton.textContent = "Pause";
    } else {
        startPauseButton.textContent = "Start";
    }
}

// === Event listeners: ===
startPauseButton.addEventListener("click", handleStartPause);
resetButton.addEventListener("click", handleReset);
document.addEventListener("visibilitychange", handleVisibilityChange);

// === Startup: ===
render();
