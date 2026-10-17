console.log("hello from script.js");

// --- getElementById vs querySelector: ---
const timerElement = document.querySelector("#timer");      // Finds by id, class, element type, or combination
timerElement.textContent = "12:34";
// const timerElement = document.getElementById("timer");   // Older, faster, only finds by ID
// timerElement.textContent = "01:23";