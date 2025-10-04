let boardSize;
let moves = 0;
let firstCard, secondCard;
let lockBoard = false;
let matchedPairs = 0;
let totalPairs;
let timerInterval;
let timeLeft;

const gameBoard = document.getElementById("game-board");
const movesDisplay = document.getElementById("moves");
const timerDisplay = document.getElementById("timer");
const countdownEl = document.getElementById("countdown");

const difficulties = {
  4: {time: 120}, // 2 mins
  6: {time: 240}, // 4 mins
  8: {time: 360}, // 6 mins
  10: {time: 600} // 10 mins
};

// Use 18 images, cycle them if needed
const images = Array.from({ length: 18 }, (_, i) => `images/img${i+1}.png`);

function startGame(size) {
  boardSize = size;
  totalPairs = (size * size) / 2;
  document.getElementById("start-screen").classList.add("hidden");
  countdown(3, () => {
    document.getElementById("game").classList.remove("hidden");
    setupBoard();
    startTimer();
  });
}

function countdown(num, callback) {
  countdownEl.style.display = "block";
  let count = num;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      countdownEl.textContent = count;
    } else {
      countdownEl.textContent = "Start!";
      setTimeout(() => {
        countdownEl.style.display = "none";
        callback();
      }, 1000);
      clearInterval(interval);
    }
  }, 1000);
}

function setupBoard() {
  gameBoard.innerHTML = "";
  gameBoard.style.gridTemplateColumns = `repeat(${boardSize}, 80px)`;
  
  let neededImages = [];
  for (let i = 0; i < totalPairs; i++) {
    neededImages.push(images[i % images.length]);
  }
  let cardsArray = [...neededImages, ...neededImages];
  cardsArray.sort(() => Math.random() - 0.5);

  cardsArray.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${img}" class="back" />
      <div class="front"></div>
    `;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });

  moves = 0;
  matchedPairs = 0;
  movesDisplay.textContent = `Moves: 0`;
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;
  moves++;
  movesDisplay.textContent = `Moves: ${moves}`;

  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.innerHTML === secondCard.innerHTML;
  if (isMatch) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      setTimeout(() => alert("🎉 You Win!"), 500);
    }
    resetBoard();
  } else {
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetBoard();
    }, 1000);
  }
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = difficulties[boardSize].time;
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      alert("⏰ Time’s up! Try again.");
      restartGame();
    }
  }, 1000);
}

function updateTimer() {
  timerDisplay.textContent = `Time: ${timeLeft}s`;
}

function restartGame() {
  document.getElementById("game").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
  clearInterval(timerInterval);
}
