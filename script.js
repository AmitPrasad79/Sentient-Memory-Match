const board = document.getElementById("game-board");
const timerElement = document.getElementById("timer");
const countdownElement = document.getElementById("countdown");
const gameUI = document.getElementById("game-ui");
const modeSelection = document.getElementById("mode-selection");

let timer, countdown, timeLeft;
let lockBoard = false;
let firstCard, secondCard;
let matchedPairs = 0;
let totalPairs = 0;
let gridSize;

const images = Array.from({length: 18}, (_, i) => `images/img${i+1}.png`);

function startGame(mode) {
  modeSelection.style.display = "none";
  gameUI.style.display = "block";

  if (mode === "easy") { gridSize = 4; timeLeft = 120; }
  else if (mode === "medium") { gridSize = 6; timeLeft = 180; }
  else if (mode === "hard") { gridSize = 8; timeLeft = 240; }
  else if (mode === "extreme") { gridSize = 10; timeLeft = 300; }

  setupBoard();
  startCountdown();
}

function setupBoard() {
  board.innerHTML = "";
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  totalPairs = (gridSize * gridSize) / 2;
  matchedPairs = 0;

  let chosen = images.sort(() => 0.5 - Math.random()).slice(0, totalPairs);
  let cardImages = [...chosen, ...chosen].sort(() => 0.5 - Math.random());

  cardImages.forEach(img => {
    const card = document.createElement("div");
    card.classList.add("card");

    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = `url(${img})`;

    card.appendChild(front);
    card.appendChild(back);
    board.appendChild(card);

    card.addEventListener("click", flipCard);
  });
}

function startCountdown() {
  let count = 3;
  countdownElement.innerText = count;
  countdown = setInterval(() => {
    count--;
    if (count > 0) {
      countdownElement.innerText = count;
    } else {
      clearInterval(countdown);
      countdownElement.innerText = "";
      startTimer();
    }
  }, 1000);
}

function startTimer() {
  timerElement.innerText = `Time: ${timeLeft}s`;
  timer = setInterval(() => {
    timeLeft--;
    timerElement.innerText = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏳ Time’s up! Game Over.");
    }
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  const isMatch = firstCard.querySelector(".back").style.backgroundImage === 
                  secondCard.querySelector(".back").style.backgroundImage;
  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  setTimeout(() => {
    firstCard.style.visibility = "hidden";
    secondCard.style.visibility = "hidden";
    resetBoard();
    matchedPairs++;
    if (matchedPairs === totalPairs) {
      clearInterval(timer);
      alert("🎉 You Win!");
    }
  }, 600);
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function restartGame() {
  clearInterval(timer);
  clearInterval(countdown);
  startGame(gridSize === 4 ? 'easy' : gridSize === 6 ? 'medium' : gridSize === 8 ? 'hard' : 'extreme');
}
