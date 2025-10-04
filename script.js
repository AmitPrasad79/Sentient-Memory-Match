const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const countdownEl = document.getElementById("countdown");
const gameArea = document.getElementById("gameArea");
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const difficultySelect = document.getElementById("difficulty");

let cards = [];
let flipped = [];
let matched = 0;
let gridSize = 4;
let timeLeft = 0;
let timer;

const images = Array.from({ length: 19 }, (_, i) => `images/img${i + 1}.png`);
const times = { 4: 120, 6: 180, 8: 240, 10: 300 };

startBtn.addEventListener("click", () => startCountdown());
restartBtn.addEventListener("click", () => startGame());

function startCountdown() {
  document.querySelector(".menu").classList.add("hidden");
  countdownEl.classList.remove("hidden");
  gameArea.classList.add("hidden");
  let count = 3;
  countdownEl.textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) countdownEl.textContent = count;
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
  gridSize = parseInt(difficultySelect.value);
  timeLeft = times[gridSize];
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  restartBtn.classList.remove("hidden");

  const total = gridSize * gridSize;
  const selectedImgs = images.slice(0, total / 2);
  cards = [...selectedImgs, ...selectedImgs].sort(() => Math.random() - 0.5);

  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;

  cards.forEach(src => {
    const card = document.createElement("div");
    card.classList.add("card");

    const inner = document.createElement("div");
    inner.classList.add("card-inner");

    const front = document.createElement("div");
    front.classList.add("card-front");

    const back = document.createElement("div");
    back.classList.add("card-back");
    const img = document.createElement("img");
    img.src = src;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    card.addEventListener("click", () => flip(card));
    gameBoard.appendChild(card);
  });

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      alert("⏰ Time's up! Try again!");
    }
  }, 1000);
}

function flip(card) {
  if (card.classList.contains("flipped") || flipped.length === 2) return;
  card.classList.add("flipped");
  flipped.push(card);
  if (flipped.length === 2) checkMatch();
}

function checkMatch() {
  const [a, b] = flipped;
  const imgA = a.querySelector(".card-back img").src;
  const imgB = b.querySelector(".card-back img").src;

  // wait for the flip animation (~600ms)
  setTimeout(() => {
    if (imgA === imgB) {
      // mark as matched AFTER flip finishes
      a.classList.add("matched");
      b.classList.add("matched");

      // small delay so vanish is smooth
      setTimeout(() => {
        a.style.visibility = "hidden";
        b.style.visibility = "hidden";
      }, 400);

      matched += 2;
      flipped = [];

      if (matched === cards.length) {
        clearInterval(timer);
        setTimeout(() => alert("🎉 You Won! Sentient brain activated!"), 300);
      }
    } else {
      // flip back if not match
      setTimeout(() => {
        a.classList.remove("flipped");
        b.classList.remove("flipped");
        flipped = [];
      }, 200);
    }
  }, 600); // delay ensures full flip visible
}
