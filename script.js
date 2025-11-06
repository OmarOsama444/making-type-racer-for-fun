const quoteEl = document.getElementById("quote");
const input = document.getElementById("input");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpm");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const cursor = document.getElementById("cursor");
const customInputContainer = document.getElementById("customInputContainer");
const customParagraph = document.getElementById("customParagraph");

let startTime, currentQuote, timerInterval;

// ------------------ START GAME ------------------
function startGame() {
    const customText = customParagraph.value.trim();

    // Require user to input a paragraph
    if (!customText) {
        alert("⚠️ Please enter a paragraph before starting the game!");
        return;
    }

    // Use user's paragraph only
    currentQuote = customText;

    // Reset states
    input.value = "";
    result.textContent = "";
    input.disabled = false;
    input.classList.remove("hidden");
    input.classList.add("hidden-input");
    input.focus();

    // Hide custom input during the game
    customInputContainer.classList.add("hidden");

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
    customInputContainer.classList.remove("hidden");
    input.classList.add("hidden");
}

// ------------------ RENDER QUOTE ------------------
function renderQuote() {
    quoteEl.innerHTML = "";
    for (let char of currentQuote) {
        const span = document.createElement("span");
        span.textContent = char;
        quoteEl.appendChild(span);
    }

    // Position cursor at the start of the quote
    const firstSpan = quoteEl.querySelector("span");
    if (firstSpan) {
        const rect = firstSpan.getBoundingClientRect();
        cursor.style.position = "fixed";
        cursor.style.left = `${rect.left}px`;
        cursor.style.top = `${rect.top}px`;
        cursor.style.height = `${rect.height}px`;
    }
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
    let targetRect;
    if (typedText.length < chars.length) {
        targetRect = chars[typedText.length].getBoundingClientRect();
    } else {
        targetRect = chars[chars.length - 1].getBoundingClientRect();
    }

    cursor.style.position = "fixed";
    cursor.style.left = `${targetRect.left}px`;
    cursor.style.top = `${targetRect.top}px`;
    cursor.style.height = `${targetRect.height}px`;
});

startBtn.addEventListener("click", startGame);
