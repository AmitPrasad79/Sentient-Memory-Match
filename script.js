// script.js

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

let cards = [];
let flipped = [];
let matched = 0;
let gridSize = 4;
let timeLeft = 0;
let timer = null;
let lockBoard = false;
let gameStarted = false;

// 👇 Adjust this if you have 30 images named images/img1.png → images/img30.png
const images = Array.from({ length: 30 }, (_, i) => `images/img${i + 1}.png`);
const times = { 4: 120, 6: 180, 8: 240, 10: 300 };

// Event Listeners
startBtn.addEventListener("click", startCountdown);
restartBtn.addEventListener("click", startCountdown);
backBtn.addEventListener("click", goBack);
popupClose.addEventListener("click", () => {
  popup.classList.add("hidden");
  goBack();
});

// Shuffle helper
function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Countdown before game starts
function startCountdown() {
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
      startGame();
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

  // pick random unique images
  let selectedImgs = shuffleArray(images).slice(0, neededPairs);

  // ✅ Safety check — no images loaded
  if (selectedImgs.length === 0) {
    showPopup("⚠️ No images found. Check your /images folder path!");
    console.error("No images loaded from:", images);
    return;
  }

  cards = shuffleArray([...selectedImgs, ...selectedImgs]).slice(0, total);

  if (cards.length === 0) {
    showPopup("⚠️ Failed to generate cards — check your image names!");
    return;
  }

  // Create grid of cards
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
    img.onerror = () => {
      console.error("❌ Image not found:", img.src);
      img.style.opacity = "0.3";
    };

    back.appendChild(img);
    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", () => flip(card));
    gameBoard.appendChild(card);
  });

  // Verify that images actually loaded
  const allImages = document.querySelectorAll(".card-back img");
  if (allImages.length === 0) {
    console.error("⚠️ No <img> elements found inside .card-back!");
    showPopup("⚠️ No images found. Make sure /images folder is correct.");
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

// Flip logic
function flip(card) {
  if (!gameStarted || lockBoard) return;
  if (card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flipped.push(card);

  if (flipped.length === 2) {
    lockBoard = true;
    checkMatch();
  }
}

// Check if 2 flipped cards match
function checkMatch() {
  const [a, b] = flipped;
  if (!a || !b) {
    lockBoard = false;
    return;
  }

  const imgA = a.querySelector(".card-back img").src;
  const imgB = b.querySelector(".card-back img").src;

  setTimeout(() => {
    if (imgA === imgB) {
      a.classList.add("matched");
      b.classList.add("matched");

      setTimeout(() => {
        a.style.visibility = "hidden";
        b.style.visibility = "hidden";
      }, 400);

      matched += 2;
      flipped = [];
      lockBoard = false;

      if (gameStarted && matched === cards.length) {
        clearInterval(timer);
        gameStarted = false;
        setTimeout(() => showPopup("🎉 You Win! Sentient brain activated!"), 300);
      }
    } else {
      setTimeout(() => {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        flipped = [];
        lockBoard = false;
      }, 400);
    }
  }, 600);
}

// UI
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
