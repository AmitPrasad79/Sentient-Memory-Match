// script.js (replace your current file with this)

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const backBtn = document.getElementById("backBtn");
const countdownEl = document.getElementById("countdown");
const gameArea = document.getElementById("gameArea");
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");

const popup = document.getElementById("popup");
const popupMessage = document.getElementById("popupMessage");
const popupClose = document.getElementById("popupClose");

let cards = [];           // array of card image paths (shuffled pairs)
let flipped = [];         // currently flipped cards (DOM elements)
let matched = 0;          // number of matched cards (count of cards, not pairs)
let gridSize = 4;
let timeLeft = 0;
let timer = null;
let lockBoard = false;
let gameStarted = false;

// images (30 images as you confirmed)
const images = Array.from({ length: 30 }, (_, i) => `images/img${i + 1}.png`);
const times = { 4: 120, 6: 180, 8: 240, 10: 300 };

// event listeners
startBtn.addEventListener("click", startCountdown);
restartBtn.addEventListener("click", () => {
  // restart with the same difficulty and show countdown again
  startCountdown();
});
backBtn.addEventListener("click", goBack);
popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
  // after closing, go back to menu so user can choose mode again
  goBack();
});

/* ----------------- Helpers ----------------- */

// Fisher-Yates shuffle (stable & good)
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ----------------- Game flow ----------------- */

function startCountdown() {
  // hide menu, show countdown
  document.querySelector(".menu").classList.add("hidden");
  countdownEl.classList.remove("hidden");
  gameArea.classList.add("hidden");
  countdownEl.textContent = "3";
  let count = 3;

  const interval = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = String(count);
    else if (count === 0) countdownEl.textContent = "Go!";
    else {
      clearInterval(interval);
      countdownEl.classList.add("hidden");
      gameArea.classList.remove("hidden");
      startGame(); // actually start the game after countdown
    }
  }, 800);
}

function startGame() {
  clearInterval(timer);
  gameBoard.innerHTML = "";
  flipped = [];
  matched = 0;
  lockBoard = false;
  gameStarted = false;

  gridSize = parseInt(difficultySelect.value) || 4;
  timeLeft = times[gridSize] || 120;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  restartBtn.classList.remove("hidden");
  backBtn.classList.remove("hidden");

  const total = gridSize * gridSize;
  const neededPairs = total / 2;

  // if you have 30 images, ensure at least 15 pairs for 10x10
  let selectedImgs = shuffleArray(images).slice(0, neededPairs);
  if (selectedImgs.length * 2 < total) {
    // duplicate pool until enough
    while (selectedImgs.length * 2 < total) {
      selectedImgs = selectedImgs.concat(shuffleArray(images).slice(0, neededPairs));
    }
  }

  // build the card list
  cards = shuffleArray([...selectedImgs, ...selectedImgs]).slice(0, total);

  // if still empty → abort (fixes instant win)
  if (!cards || cards.length === 0) {
    console.error("⚠️ No cards generated — check your images folder path!");
    showPopup("Error: No images found in /images folder.");
    return;
  }

  // build grid
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;
  cards.forEach(src => {
    const card = document.createElement("div");
    card.className = "card";

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";

    const back = document.createElement("div");
    back.className = "card-back";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "card";
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", () => flip(card));
    gameBoard.appendChild(card);
  });

  if (gameBoard.children.length === 0) {
    console.error("⚠️ No cards appended to board");
    showPopup("Error: No cards created — check image paths.");
    return;
  }

  gameStarted = true;
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      showPopup("⏰ Time’s up! You Lose.");
      gameStarted = false;
    }
  }, 1000);
}


/* ----------------- card logic ----------------- */

function flip(card) {
  if (!gameStarted) return; // don't allow flips before the game truly started
  if (lockBoard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;            // prevent extra clicks while checking
    checkMatch();
  }
}

function checkMatch() {
  const [a, b] = flipped;
  if (!a || !b) {
    lockBoard = false;
    return;
  }

  const imgA = a.querySelector(".card-back img").src;
  const imgB = b.querySelector(".card-back img").src;

  // wait for flip animation to finish (600ms in CSS)
  setTimeout(() => {
    if (imgA === imgB) {
      // mark matched, then vanish after a short delay
      a.classList.add("matched");
      b.classList.add("matched");

      setTimeout(() => {
        a.style.visibility = "hidden";
        b.style.visibility = "hidden";
      }, 400);

      matched += 2;
      flipped = [];
      lockBoard = false;

      // only declare win if the game actually started and there are cards
      if (gameStarted && cards.length > 0 && matched === cards.length) {
        clearInterval(timer);
        gameStarted = false;
        setTimeout(() => showPopup("🎉 You Win! Sentient brain activated!"), 300);
      }
    } else {
      // not a match: flip back
      setTimeout(() => {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        flipped = [];
        lockBoard = false;
      }, 400);
    }
  }, 600); // should match CSS flip duration
}

/* ----------------- UI helpers ----------------- */

function goBack() {
  clearInterval(timer);
  gameArea.classList.add("hidden");
  document.querySelector(".menu").classList.remove("hidden");
  restartBtn.classList.add("hidden");
  backBtn.classList.add("hidden");
  countdownEl.classList.add("hidden");
  gameBoard.innerHTML = "";
  gameStarted = false;
  flipped = [];
  matched = 0;
  timerDisplay.textContent = "";
}

function showPopup(message) {
  popupMessage.textContent = message;
  popup.classList.remove("hidden");
}
