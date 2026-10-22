console.log("hello from script.js");

// === Constants: ===
const MODE_ORDER = ["focus", "short-break", "long-break"];
const MODES = {
    focus: { label: "Focus", durationMs: 5 * 1000 },
    "short-break": { label: "Short Break", durationMs: 3 * 1000 },
    "long-break": { label: "Long Break", durationMs: 10 * 1000 },
};

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");
const prevModeButton = document.querySelector("#prev-mode-btn");
const nextModeButton = document.querySelector("#next-mode-btn");
const endMessageElement = document.querySelector("#session-message");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
let currentMode = "focus";
let remainingMilliseconds = MODES[currentMode].durationMs;
let timerEndsAt = null;
let timerStatus = "idle";
let timerIntervalId = null;
let finishedSessionMode = null;

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
    finishedSessionMode = null;
    render();
}

function tick() {
    // // Testing
    // const startTick = Date.now()  // TEMP
    // console.log(startTick - prevTick, document.visibilityState)  // TEMP: ms since the prev tick
    // prevTick = startTick  // TEMP: remember this tick for the next one

    remainingMilliseconds = timerEndsAt - Date.now();
    if (remainingMilliseconds <= 0) {
        const prevMode = currentMode;
        switchMode(nextModeInCycle(currentMode));  // load the next mode (not started)
        finishedSessionMode = prevMode;
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
    finishedSessionMode = null;
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

function nextModeInCycle(modeId) {
    if (modeId === "focus") {
        return "short-break";
    }

    return "focus";
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
    const justFinished = finishedSessionMode !== null;

    timerElement.classList.toggle("is-paused", isPaused);
    modeElement.classList.toggle("just-finished", justFinished);

    timerElement.textContent = formattedTime;
    modeElement.textContent = MODES[currentMode].label;
    document.body.dataset.mode = currentMode;  // for per-mode CSS (themes)

    if (justFinished) {
        endMessageElement.textContent = `Finished ${MODES[finishedSessionMode].label} session; mode changed to "${MODES[currentMode].label}"`;
    } else {
        endMessageElement.textContent = "";
    }

    // Tab Title:
    if (timerStatus === "running") {
        document.title = `Running: ${formattedTime}`;
    } else if (isPaused) {
        document.title = `Paused: ${formattedTime}`;
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
