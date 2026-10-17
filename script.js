console.log("hello from script.js");

// --- getElementById vs querySelector: ---
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
timerElement.textContent = "12:34";
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID
// timerElement.textContent = "01:23";

const modeElement = document.querySelector("#mode");
const startButton = document.querySelector("#start-btn");
const pauseButton = document.querySelector("#pause-btn");
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
    timerElement.textContent = "25:00";
    modeElement.textContent = "Work";
}

startButton.addEventListener("click", handleStart);
pauseButton.addEventListener("click", handlePause);
resetButton.addEventListener("click", handleReset);
