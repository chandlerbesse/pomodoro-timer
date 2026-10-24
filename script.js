console.log("hello from script.js");

// === Constants: ===
const MODE_ORDER = ["focus", "short-break", "long-break"];
const MODES = {
    focus: { label: "Focus", durationMs: 25 * 60 * 1000 },
    "short-break": { label: "Short Break", durationMs: 5 * 60 * 1000 },
    "long-break": { label: "Long Break", durationMs: 15 * 60 * 1000 },
};
const SESSIONS_PER_CYCLE = 4;
const MAX_DURATION_MS = 60 * 60 * 1000;
const MIN_DURATION_MS = 1 * 60 * 1000;
const ADJUST_STEP_MS = 1 * 60 * 1000;

// === Element lookups: ===
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
const modeElement = document.querySelector("#mode");

const addMinuteButton = document.querySelector("#add-minute-btn");
const subtractMinuteButton = document.querySelector("#subtract-minute-btn");
const prevModeButton = document.querySelector("#prev-mode-btn");
const nextModeButton = document.querySelector("#next-mode-btn");
const startPauseButton = document.querySelector("#start-pause-btn");
const resetButton = document.querySelector("#reset-btn");

const endMessageElement = document.querySelector("#session-message");
const cycleDotsElement = document.querySelector("#cycle-dots");

// Alternative: getElementById()
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID

// === State: ===
let finishedFocusCount = 0;
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
        if (currentMode === "focus") {
            finishedFocusCount += 1;
        } else if (currentMode === "long-break") {
            finishedFocusCount = 0;
        }
        const prevMode = currentMode;
        switchMode(nextModeInCycle(currentMode, finishedFocusCount));  // load the next mode (not started)
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

function nextModeInCycle(modeId, count) {
    if (modeId === "focus") {
        if (count >= SESSIONS_PER_CYCLE) {
            return "long-break";
        }
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

function changeTimeBy(sign) {
    if (timerStatus !== "idle") {
        return;
    }

    const adjustedTime = remainingMilliseconds + sign * ADJUST_STEP_MS;
    remainingMilliseconds = Math.max(MIN_DURATION_MS, Math.min(MAX_DURATION_MS, adjustedTime));  // clamp: keep the new time between MIN and MAX durations

    // Alternatively:
    // remainingMilliseconds = Math.min(MAX_DURATION_MS, Math.max(MIN_DURATION_MS, adjustedTime))
    
    render();
}

function handleAddTime() {
    changeTimeBy(1);
}

function handleSubtractTime() {
    changeTimeBy(-1);
}

function render() {
    const remainingSeconds = Math.ceil(remainingMilliseconds / 1000);
    const formattedTime = formatTime(remainingSeconds);
    const isPaused = timerStatus === "paused";
    const justFinished = finishedSessionMode !== null;
    const numFilledDots = Math.min(finishedFocusCount, SESSIONS_PER_CYCLE);
    const numCurrentDots = numFilledDots < SESSIONS_PER_CYCLE ? 1 : 0; 
    const numEmptyDots = SESSIONS_PER_CYCLE - numFilledDots - numCurrentDots;
    const hideDots = currentMode !== "focus";
    const isIdle = timerStatus === "idle";
    const isAtMaxDuration = remainingMilliseconds >= MAX_DURATION_MS;
    const isAtMinDuration = remainingMilliseconds <= MIN_DURATION_MS;

    timerElement.classList.toggle("is-paused", isPaused);
    modeElement.classList.toggle("just-finished", justFinished);
    cycleDotsElement.classList.toggle("hide-dots", hideDots);

    timerElement.textContent = formattedTime;
    modeElement.textContent = MODES[currentMode].label;
    document.body.dataset.mode = currentMode;  // for per-mode CSS (themes)
    cycleDotsElement.setAttribute("aria-label", `${numFilledDots} of ${SESSIONS_PER_CYCLE} focus sessions done`)

    cycleDotsElement.textContent = "●".repeat(numFilledDots) + "◐".repeat(numCurrentDots) + "○".repeat(numEmptyDots);
    
    if (justFinished) {
        endMessageElement.textContent = `Finished ${MODES[finishedSessionMode].label} session; mode changed to "${MODES[currentMode].label}"`;
    } else {
        endMessageElement.textContent = "";
    }

    // Tab Title:
    if (timerStatus === "running") {
        document.title = `${MODES[currentMode].label}: ${formattedTime}`;
    } else if (isPaused) {
        document.title = `⏸ ${MODES[currentMode].label}: ${formattedTime}`;
    } else if (justFinished) {
        document.title = `${MODES[finishedSessionMode].label}: FINISHED`;
    } else {
        document.title = "Pomodoro Timer";
    }

    // Button Labels:
    if (timerStatus === "running") {
        startPauseButton.textContent = "Pause";
    } else {
        startPauseButton.textContent = "Start";
    }

    // Button States:
    addMinuteButton.disabled = !isIdle || isAtMaxDuration;
    subtractMinuteButton.disabled = !isIdle || isAtMinDuration;
}

// === Event listeners: ===
startPauseButton.addEventListener("click", handleStartPause);
resetButton.addEventListener("click", handleReset);
document.addEventListener("visibilitychange", handleVisibilityChange);
prevModeButton.addEventListener("click", handlePrevMode);
nextModeButton.addEventListener("click", handleNextMode);
addMinuteButton.addEventListener("click", handleAddTime);
subtractMinuteButton.addEventListener("click", handleSubtractTime);

// === Startup: ===
render();
