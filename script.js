const quotes = [
    "Balloons are pretty and come in different colors, different shapes, different sizes, and they can even adjust sizes"
];

const quoteEl = document.getElementById("quote");
const input = document.getElementById("input");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const cursor = document.getElementById("cursor");
const customInputContainer = document.getElementById("customInputContainer");
const customParagraph = document.getElementById("customParagraph");
const setParagraphBtn = document.getElementById("setParagraphBtn");

let startTime, currentQuote, timerInterval;

// Allow user to add custom paragraph
setParagraphBtn.addEventListener("click", () => {
    const customText = customParagraph.value.trim();
    if (customText) {
        quotes.push(customText);
        alert("✅ Custom paragraph added!");
        customParagraph.value = "";
    }
});

// ------------------ START GAME ------------------
function startGame() {
    input.value = "";
    result.textContent = "";
    input.disabled = false;
    input.classList.remove("hidden");
    input.classList.add("hidden-input");
    input.focus();

    // Hide custom input section during game
    customInputContainer.classList.add("hidden");

    // Pick random quote
    currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
    renderQuote();

    startTime = new Date();
    timerDisplay.textContent = "0.00";
    wpmDisplay.textContent = "0";

    clearInterval(timerInterval);
    timerInterval = setInterval(updateStats, 100);
}

// ------------------ UPDATE TIMER & WPM ------------------
function updateStats() {
    const elapsed = (new Date() - startTime) / 1000;
    timerDisplay.textContent = elapsed.toFixed(2);

    const wordsTyped = input.value.trim().split(/\s+/).filter(Boolean).length;
    const wpm = (wordsTyped / (elapsed / 60)) || 0;
    wpmDisplay.textContent = Math.floor(wpm);

    if (input.value === currentQuote) {
        clearInterval(timerInterval);
        endGame(elapsed, wpm);
    }
}

// ------------------ END GAME ------------------
function endGame(time, wpm) {
    input.disabled = true;
    result.textContent = `🎉 Finished in ${time.toFixed(2)}s — ${Math.floor(wpm)} WPM!`;
    customInputContainer.classList.remove("hidden"); // show custom input again
    input.classList.add("hidden"); // hide typing area again after game ends

}

// ------------------ RENDER QUOTE ------------------
function renderQuote() {
    quoteEl.innerHTML = "";
    for (let char of currentQuote) {
        const span = document.createElement("span");
        span.textContent = char;
        quoteEl.appendChild(span);
    }
    cursor.style.left = "0";
}

// ------------------ HANDLE INPUT ------------------
input.addEventListener("input", () => {
    const chars = quoteEl.querySelectorAll("span");
    const typedText = input.value.split("");

    chars.forEach((span, index) => {
        const char = typedText[index];
        if (char == null) {
            span.classList.remove("text-green-400", "text-red-500");
        } else if (char === span.textContent) {
            span.classList.add("text-green-400");
            span.classList.remove("text-red-500");
        } else {
            span.classList.add("text-red-500");
            span.classList.remove("text-green-400");
        }
    });

    // Move cursor
    const parentRect = quoteEl.getBoundingClientRect();
    let targetRect;

    if (typedText.length < chars.length) {
        targetRect = chars[typedText.length].getBoundingClientRect();
    } else {
        targetRect = chars[chars.length - 1].getBoundingClientRect();
    }

    const x = targetRect.left - parentRect.left;
    const y = targetRect.top - parentRect.top;

    // Move cursor smoothly in both directions
    cursor.style.transform = `translate(${x}px, ${y}px)`;

});

startBtn.addEventListener("click", startGame);
