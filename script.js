const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");
const difficultySelect = document.getElementById("difficulty");
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const countdownEl = document.getElementById("countdown");

let cards = [];
let flippedCards = [];
let matchedCount = 0;
let timeLeft;
let timer;
let gridSize;

const imagePaths = Array.from({ length: 18 }, (_, i) => `images/img${i + 1}.png`);

const modeTime = {
  4: 120,  // 2 mins
  6: 180,  // 3 mins
  8: 240,  // 4 mins
  10: 300  // 5 mins
};

playBtn.addEventListener("click", startCountdown);
restartBtn.addEventListener("click", startGame);

function startCountdown() {
  let countdown = 3;
  countdownEl.textContent = countdown;
  countdownEl.style.display = "block";

  const interval = setInterval(() => {
    countdown--;
    if (countdown > 0) countdownEl.textContent = countdown;
    else if (countdown === 0) countdownEl.textContent = "Go!";
    else {
      clearInterval(interval);
      countdownEl.style.display = "none";
      startGame();
    }
  }, 800);
}

function startGame() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedCount = 0;
  restartBtn.classList.remove("hidden");
  timerDisplay.classList.remove("hidden");

  gridSize = parseInt(difficultySelect.value);
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;

  const totalCards = gridSize * gridSize;
  const neededImages = imagePaths.slice(0, totalCards / 2);
  cards = [...neededImages, ...neededImages].sort(() => Math.random() - 0.5);

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = src;

    card.appendChild(img);
    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  clearInterval(timer);
  timeLeft = modeTime[gridSize];
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  timer = setInterval(updateTimer, 1000);
}

function flipCard(card) {
  if (card.classList.contains("flipped") || flippedCards.length === 2) return;
  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) checkMatch();
}

function checkMatch() {
  const [c1, c2] = flippedCards;
  const match = c1.querySelector("img").src === c2.querySelector("img").src;

  if (match) {
    c1.classList.add("matched");
    c2.classList.add("matched");
    setTimeout(() => {
      c1.style.visibility = "hidden";
      c2.style.visibility = "hidden";
    }, 400);
    matchedCount += 2;
  } else {
    setTimeout(() => {
      c1.classList.remove("flipped");
      c2.classList.remove("flipped");
    }, 600);
  }
  flippedCards = [];

  if (matchedCount === cards.length) {
    clearInterval(timer);
    alert("🎉 You won! Sentient brain activated!");
  }
}

function updateTimer() {
  timeLeft--;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) {
    clearInterval(timer);
    alert("⏰ Time’s up! Try again!");
  }
}
