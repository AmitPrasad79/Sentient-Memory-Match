const grid = document.getElementById('gameGrid');
const restartBtn = document.getElementById('restartBtn');
const movesDisplay = document.getElementById('moves');
const timerDisplay = document.getElementById('timer');

let moves = 0;
let timer = 0;
let timerInterval;
let firstCard, secondCard;
let lockBoard = false;

// Add your own image names here
const images = [
  'brain.png', 
  'planet.png', 
  'lightning.png', 
  'robot.png', 
  'dna.png', 
  'star.png', 
  'galaxy.png', 
  'crystal.png'
];

let cardsArray = [...images, ...images];

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
  cardsArray.forEach(img => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front"></div>
        <div class="card-back">
          <img src="images/${img}" alt="icon">
        </div>
      </div>
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
  if (this.classList.contains('flip')) return;

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
    firstCard.querySelector('img').src ===
    secondCard.querySelector('img').src;

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
