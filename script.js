console.log("hello from script.js");

// === Constants: ===
const MODE_ORDER = ["focus", "short-break", "long-break"];
const MODES = {
    focus: { label: "Focus", durationMs: 25 * 60 * 1000 },
    "short-break": { label: "Short Break", durationMs: 5 * 60 * 1000 },
    "long-break": { label: "Long Break", durationMs: 15 * 60 * 1000 },
};

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");
const prevModeButton = document.querySelector("#prev-mode-btn");
const nextModeButton = document.querySelector("#next-mode-btn");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
let currentMode = "focus";
let remainingMilliseconds = MODES[currentMode].durationMs;
let timerEndsAt = null;
let timerStatus = "idle";
let timerIntervalId = null;

// let prevTick = null // TEMP for testing

// === Functions: ===
function stopTicking() {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
}

function switchMode(newMode) {
    stopTicking();
    currentMode = newMode;
    timerStatus = "idle";
    remainingMilliseconds = MODES[currentMode].durationMs;
    timerEndsAt = null;
    render();
}

function tick() {
    // // Testing
    // const startTick = Date.now()  // TEMP
    // console.log(startTick - prevTick, document.visibilityState)  // TEMP: ms since the prev tick
    // prevTick = startTick  // TEMP: remember this tick for the next one

    remainingMilliseconds = timerEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
        stopTicking();
        timerStatus = "finished";
        remainingMilliseconds = 0;  // Protects formatTime() from negative values
    }
    render();
}

function startTimer() {
    if (timerStatus !== "idle" && timerStatus !== "paused") {
        return;
    }
    timerEndsAt = Date.now() + remainingMilliseconds;
    console.log("Start clicked");
    timerIntervalId = setInterval(tick, 1000);
    timerStatus = "running";
    render();
}

function pauseTimer() {
    if (timerStatus !== "running") {
        return;
    }
    remainingMilliseconds = timerEndsAt - Date.now();  // Spamming "Pause" button will keep updating remainingMilliseconds
    console.log("Pause clicked");
    stopTicking();
    timerStatus = "paused";
    timerEndsAt = null;  // While paused, there is no end time. A new end time will need to be calculated once unpaused
    render();
}

function handleStartPause() {
    if (timerStatus === "running") {
        pauseTimer();
    } else {
        startTimer();
    }
}

function handleReset() {
    console.log("Reset clicked");
    
    const isActive = timerStatus === "running" || timerStatus === "paused";

    if (isActive && !confirm("Abandon this session?")) {
        return;
    }

    switchMode(currentMode);
}

function handleVisibilityChange() {
    if (!document.hidden && timerStatus === "running") {
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

function changeModeBy(step) {
    const isActive = timerStatus === "running" || timerStatus === "paused";

    if (isActive && !confirm("Abandon this session?")) {
        return;
    }

    const numModes = MODE_ORDER.length;
    const currentIndex = MODE_ORDER.indexOf(currentMode);
    const newIndex = (currentIndex + step + numModes) % numModes;

    switchMode(MODE_ORDER[newIndex]);
}

function handleNextMode() {
    changeModeBy(1);
}

function handlePrevMode() {
    changeModeBy(-1);
}

function render() {
    const remainingSeconds = Math.ceil(remainingMilliseconds / 1000);
    const formattedTime = formatTime(remainingSeconds);
    const isPaused = timerStatus === "paused";
    const isFinished = timerStatus === "finished";

    timerElement.classList.toggle("is-paused", isPaused);
    timerElement.classList.toggle("is-finished", isFinished);

    timerElement.textContent = formattedTime;
    modeElement.textContent = MODES[currentMode].label;
    startPauseButton.disabled = isFinished;  // Disables "Start" button once timer hits 00:00

    // Tab Title:
    if (timerStatus === "running") {
        document.title = `Running: ${formattedTime}`;
    } else if (isPaused) {
        document.title = `Paused: ${formattedTime}`;
    } else if (isFinished) {
        document.title = `Finished: ${formattedTime}`;
    } else {
        document.title = "Pomodoro Timer";
    }

    // Button Labels:
    if (timerStatus === "running") {
        startPauseButton.textContent = "Pause";
    } else {
        startPauseButton.textContent = "Start";
    }
}

// === Event listeners: ===
startPauseButton.addEventListener("click", handleStartPause);
resetButton.addEventListener("click", handleReset);
document.addEventListener("visibilitychange", handleVisibilityChange);
prevModeButton.addEventListener("click", handlePrevMode);
nextModeButton.addEventListener("click", handleNextMode);

// === Startup: ===
render();
