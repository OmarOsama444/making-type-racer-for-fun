const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Typing fast requires practice and focus.",
    "JavaScript and Tailwind make web dev fun!",
    "Racing against time improves your accuracy."
];

const quoteDisplay = document.getElementById("quote");
const input = document.getElementById("input");
const timerDisplay = document.getElementById("timer");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");

let startTime, currentQuote;

function startGame() {
    // Reset UI
    input.value = "";
    result.textContent = "";
    input.disabled = false;
    input.focus();

    // Pick a random quote
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    quoteDisplay.innerHTML = currentQuote;

    // Start timer
    startTime = new Date();
    timerDisplay.textContent = "0.00";

    // Update timer every 100ms
    const timer = setInterval(() => {
        const elapsed = (new Date() - startTime) / 1000;
        timerDisplay.textContent = elapsed.toFixed(2);
        if (input.value === currentQuote) {
            clearInterval(timer);
            endGame(elapsed);
        }
    }, 100);
}

function endGame(time) {
    input.disabled = true;
    result.textContent = `🎉 You finished in ${time.toFixed(2)} seconds!`;
}

startBtn.addEventListener("click", startGame);
