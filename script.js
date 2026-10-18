console.log("hello from script.js");

const WORK_SECONDS = 25 * 60;

// --- getElementById vs querySelector: ---
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
timerElement.textContent = formatTime(WORK_SECONDS);
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID
// timerElement.textContent = "01:23";

const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");

function handleStart() {
    console.log("Start clicked");
    modeElement.textContent = "Running";
}

function handlePause() {
    console.log("Pause clicked");
    modeElement.textContent = "Paused";
}

function handleReset() {
    console.log("Reset clicked");
    timerElement.textContent = formatTime(WORK_SECONDS);
    modeElement.textContent = "Work";
}

startPauseButton.addEventListener("click", handleStart);
resetButton.addEventListener("click", handleReset);

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Convert nums into strings and pad with "0"
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");
    
    return `${paddedMinutes}:${paddedSeconds}`;
}
