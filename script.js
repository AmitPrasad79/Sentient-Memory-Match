const playBtn = document.getElementById("play-btn");
const restartBtn = document.getElementById("restart-btn");
const gameBoard = document.getElementById("game-board");
const difficultySelect = document.getElementById("difficulty");
const timerDisplay = document.getElementById("time");
const controls = document.getElementById("controls");

let firstCard, secondCard;
let lock = false;
let matches = 0;
let timer;
let time = 0;
let totalPairs = 0;

// Start game
playBtn.addEventListener("click", () => {
  const difficulty = difficultySelect.value;
  if (!difficulty) return alert("Please select a difficulty!");

  startGame(difficulty);
});

// Restart
restartBtn.addEventListener("click", () => {
  const difficulty = difficultySelect.value;
  startGame(difficulty);
});

function startGame(level) {
  gameBoard.innerHTML = "";
  matches = 0;
  time = 0;
  timerDisplay.textContent = time;
  controls.classList.remove("hidden");

  let size;
  if (level === "easy") size = 4;
  else if (level === "medium") size = 6;
  else size = 8;

  totalPairs = (size * size) / 2;
  createBoard(size);

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    timerDisplay.textContent = time;
  }, 1000);
}

function createBoard(size) {
  gameBoard.style.gridTemplateColumns = `repeat(${size}, 80px)`;
  gameBoard.classList.remove("hidden");

  const symbols = [];
  for (let i = 0; i < totalPairs; i++) {
    symbols.push(i + 1, i + 1);
  }
  symbols.sort(() => Math.random() - 0.5);

  symbols.forEach(symbol => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.textContent = symbol;
    card.addEventListener("click", flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (lock || this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

function checkMatch() {
  const match = firstCard.textContent === secondCard.textContent;

  if (match) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    matches++;

    if (matches === totalPairs) {
      clearInterval(timer);
      setTimeout(() => alert(`🎉 You won in ${time} seconds!`), 300);
    }

    resetTurn();
  } else {
    lock = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      resetTurn();
    }, 800);
  }
}

function resetTurn() {
  [firstCard, secondCard, lock] = [null, null, false];
}
