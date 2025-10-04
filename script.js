const grid = document.getElementById('gameGrid');
const restartBtn = document.getElementById('restartBtn');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

let moves = 0;
let timer = 0;
let timerInterval;
let firstCard, secondCard;
let lockBoard = false;

const icons = ['🧠', '🤖', '⚡', '🌌', '🔮', '💫', '🧬', '🪐'];
let cardsArray = [...icons, ...icons];

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startGame() {
  grid.innerHTML = '';
  moves = 0;
  timer = 0;
  movesDisplay.textContent = moves;
  timerDisplay.textContent = timer;
  clearInterval(timerInterval);

  cardsArray = shuffle(cardsArray);
  cardsArray.forEach(icon => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="front">${icon}</div>
      <div class="back"></div>
    `;
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });

  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  moves++;
  movesDisplay.textContent = moves;

  checkForMatch();
}

function checkForMatch() {
  let isMatch =
    firstCard.querySelector('.front').textContent ===
    secondCard.querySelector('.front').textContent;

  isMatch ? disableCards() : unflipCards();
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);

  resetBoard();

  if (document.querySelectorAll('.card:not(.flip)').length === 0) {
    clearInterval(timerInterval);
    setTimeout(() => alert(`You won in ${moves} moves and ${timer}s! 🎉`), 500);
  }
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

restartBtn.addEventListener('click', startGame);
startGame();
