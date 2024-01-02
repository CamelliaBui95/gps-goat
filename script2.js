// Obsolete Script
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".scoreDisplay");
let width = 10;
let numOfSquares = 100;
let rockPositions = []; // = numOfSquares / Math.floor(Math.random() * numOfSquares);
let directions = [1, width, -1, -width];
let currentGoat = 0;
let currentDirection = 1;
let score = 0;
let intervalTime = 1000;
let interval = 0;
let squares = [];
let squaresArr = [];
let isPlaying = true;

let controlPanel = {
  1: () => new KeyboardEvent("keyup", { code: "ArrowRight" }),
  "-1": () => new KeyboardEvent("keyup", { code: "ArrowLeft" }),
  10: () => new KeyboardEvent("keyup", { code: "ArrowDown" }),
  "-10": () => new KeyboardEvent("keyup", { code: "ArrowUp" }),
};

const control = (e) => {
  if (e.code === "ArrowRight") currentDirection = 1;
  else if (e.code === "ArrowLeft") currentDirection = -1;
  else if (e.code === "ArrowUp") currentDirection = -width;
  else if (e.code === "ArrowDown") currentDirection = width;
  else if (e.code === "Space") {
    if (isPlaying) {
      clearInterval(interval);
      isPlaying = false;
    } else {
      isPlaying = true;
      interval = setInterval(moveOutcome, intervalTime);
    }
  }
};

const createBoard = () => {
  for (let i = 0; i < numOfSquares; i++) {
    let div = document.createElement("div");
    div.textContent = i;
    div.classList.add("grass");
    grid.appendChild(div);
  }

  squares = document.querySelectorAll(".grid div");

  randomRocks();

  squares.forEach((sq, sqIndex) => {
    const neighbors = getNeighborsOf(sqIndex);
    squaresArr.push({
      square: sq,
      index: sqIndex,
      neighbors,
      lastGrassSession: null,
      setNewGrass: function () {
        if (this.lastGrassSession) clearTimeout(this.lastGrassSession);

        this.lastGrassSession = setTimeout(() => {
          if (!sq.classList.contains("goat")) {
            sq.classList.add("newGrass");
            this.setGrass();
          }
        }, 15000);
      },
      setGrass: function () {
        if (this.lastGrassSession) clearTimeout(this.lastGrassSession);

        this.lastGrassSession = setTimeout(() => {
          if (sq.classList.contains("newGrass")) {
            sq.classList.remove("newGrass");
            sq.classList.add("grass");
          }
        }, 10000);
      },
    });
  });

  interval = setInterval(moveOutcome, intervalTime);
};

const randomRocks = () => {
  let rockIndex;
  let numOfRocks;
  do {
    numOfRocks = Math.floor(Math.random() * 10);
  } while (numOfRocks < 4);

  for (let i = 0; i < numOfRocks; i++) {
    do {
      rockIndex = Math.floor(Math.random() * (numOfSquares - 1));
    } while (rockIndex === 0 || rockPositions.indexOf(rockIndex) !== -1);
    rockPositions[i] = rockIndex;
  }

  positionRocks();
};

const positionRocks = () => {
  for (let i = 0; i < rockPositions.length; i++) {
    squares[rockPositions[i]].classList.remove("grass");
    squares[rockPositions[i]].classList.add("rock");
  }
};

const start = () => {
  scoreDisplay.innerHTML = score;

  squares[currentGoat].classList.remove("grass");
  squares[currentGoat].classList.add("goat");
};

const getNeighborsOf = (squareIndex) => {
  const surroundings = [];

  for (let i = 0; i < directions.length; i++) {
    if (
      squares[squareIndex + directions[i]] &&
      !squares[squareIndex + directions[i]].classList.contains("rock") &&
      !squares[squareIndex].classList.contains("rock")
    ) {
      if (squareIndex % width === 0) {
        if (directions[i] !== -1)
          surroundings.push(squareIndex + directions[i]);
      } else if (squareIndex % width === width - 1) {
        if (directions[i] !== 1) surroundings.push(squareIndex + directions[i]);
      } else if (squareIndex + width >= width * width) {
        if (directions[i] !== width)
          surroundings.push(squareIndex + directions[i]);
      } else surroundings.push(squareIndex + directions[i]);
    }
  }

  return surroundings;
};

const updateDirection = () => {
  const randomIndex = Math.floor(
    Math.random() * squaresArr[currentGoat].neighbors.length
  );
  const nextSquare = squaresArr[currentGoat].neighbors[randomIndex];
  const newDirection = nextSquare - currentGoat;

  document.dispatchEvent(controlPanel[newDirection]());
};

const moveGoat = () => {
  squares[currentGoat].classList.remove("goat");
  currentGoat += currentDirection;

  if (
    squares[currentGoat].classList.contains("grass") ||
    squares[currentGoat].classList.contains("newGrass")
  )
    score++;

  squares[currentGoat].classList.remove("grass");
  squares[currentGoat].classList.remove("newGrass");
  squares[currentGoat].classList.add("goat");

  squaresArr[currentGoat].setNewGrass();

  scoreDisplay.textContent = score;
};

const moveOutcome = () => {
  updateDirection();
  if (score === numOfSquares - rockPositions.length)
    return clearInterval(interval);
  else moveGoat();
};

if (document.readyState !== "loading") {
  document.addEventListener("keyup", control);
  createBoard();
  start();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("keyup", control); // document object observes the game
    createBoard();
    start();
  });
}
