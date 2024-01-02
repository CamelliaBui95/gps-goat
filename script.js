// Obsolete Script
const grid = document.querySelector(".grid");
const scoreDisplay = document.querySelector(".scoreDisplay");
let width = 10;
let numOfSquares = 100;
let rockPositions = []; // = numOfSquares / Math.floor(Math.random() * numOfSquares);
let orientations = [1, width, -1, -width];
let controlPanel = {
  "1": () => new KeyboardEvent("keyup", { code: "ArrowRight" }),
  "-1": () => new KeyboardEvent("keyup", { code: "ArrowLeft" }),
  "10": () => new KeyboardEvent("keyup", { code: "ArrowDown" }),
  "-10": () => new KeyboardEvent("keyup", {code: "ArrowUp"})
}
let currentGoat = 0;
let currentDirection = 1; // moving right, default
let prevDirection;
let exclusions = [];
let path = [];
let destination;
let score = 0;
let intervalTime = 1000;
let interval = 0;
let squares = [];
let squareArray = [];
let squareLevels = [];
let searchFactor = 0;
let isPlaying = true;

const createBoard = () => {
  for (let i = 0; i < numOfSquares; i++) {
    let div = document.createElement("div");
    div.textContent = i;
    div.classList.add("grass");
    grid.appendChild(div);
  }

  /**Collect Nodes + Convert NodeList to array of nodes */
  squares = document.querySelectorAll(".grid div");
  squareArray = Array.from(squares);
  
  /**Divide map into levels of nodes */
  squareLevels = partition(squareArray, width);

  destination = searchGrass(currentGoat);

  interval = setInterval(moveOutcome, intervalTime);
};

const partition = (items, partitionSize) => {
  let output = [];
  let index = 0;
  let pointer1 = 0,
    pointer2 = partitionSize;

  while (pointer2 <= items.length) {
    const arr = [];
    for (let i = pointer1; i < pointer2; i++) {  
      arr[i - pointer1] = items[i];
    }
    output[index++] = arr;
    pointer1 = pointer2;
    pointer2 += partitionSize;
  }

  return output;
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
  randomRocks();
  squares[currentGoat].classList.remove("grass");
  squares[currentGoat].classList.add("goat");
};

const willHitObstacles = () => {
  if (
    (currentDirection === 1 && currentGoat % width === width - 1) ||
    (currentDirection === width && currentGoat + width >= width * width) ||
    (currentDirection === -1 && currentGoat % width === 0) ||
    (currentDirection === -width && currentGoat - width < 0) ||
    squares[currentGoat + currentDirection].getStatus() === "rock"
  ) return true;
 
  return false; 
};

const willHitObstaclesAt = position => {
  if (
    position % width === width - 1 ||
    position + width >= width * width ||
    position % width === 0 ||
    position - width < 0 ||
    squares[position].classList.contains("rock")
  ) {
    return true;
  } else return false;
};

const hasGrass = direction => {
  if (
    squares[currentGoat + direction] &&
    squares[currentGoat + direction].classList.contains("grass")
  ) return true;
  else return false;  
};

const willHitRock = () => {
  return squares[currentGoat + currentDirection].classList.contains(
    "rock"
  );
};

const moveOutcome = () => {
  observeGoat();
  if (score === numOfSquares - rockPositions.length)
    return clearInterval(interval);
  else moveGoat();
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

const moveGoat = () => {
  squares[currentGoat].classList.remove("goat");
  currentGoat += currentDirection;
  
  if (squares[currentGoat].classList.contains("grass")) score++;

  squares[currentGoat].classList.remove("grass");
  squares[currentGoat].classList.add("goat");

  scoreDisplay.textContent = score;
};

const observeGoat = () => {
  const currentGoatPosition = {
    at: currentGoat,
    index: currentGoat % squareLevels.length,
    level: getNodeLevel(squareLevels.length, currentGoat),
    surroundings: {
      left: { at: currentGoat - 1, direction: -1 },
      right: { at: currentGoat + 1, direction: 1 },
      up: { at: currentGoat - width, direction: -width },
      down: { at: currentGoat + width, direction: width },
    },
  };

  directGoatTowardsDestination(currentGoatPosition);
  console.log("currentGoatPosition ", currentGoatPosition);
  console.log("destination ", destination);

  if (willHitObstacles()) {
    //clearInterval(interval);
    changeDirection();
    //interval = setInterval(moveOutcome, intervalTime);
  }
}

const directGoatTowardsDestination = currentGoatPosition => {
  const { grassIndex, grassLevel } = destination;
  const { index: goatIndex, level: goatLevel, surroundings, at} = currentGoatPosition;

  if (grassIndex === goatIndex && grassLevel === goatLevel) {
    destination = searchGrass(at);
    exclusions = [];
    return;
  }

  prevDirection = currentDirection;
  let direction;
  if (grassLevel === goatLevel) {
    direction = Math.abs(grassIndex - goatIndex) / (grassIndex - goatIndex);
  } else {
    direction = (Math.abs(grassLevel - goatLevel) / (grassLevel - goatLevel)) * width;
  }

  return document.dispatchEvent(controlPanel[direction]());
}



const getNodeLevel = (nodeListLength, nodePosition) => {
  const currentLevel = [nodePosition - (nodePosition % nodeListLength)] / nodeListLength;
  return currentLevel;
}

const getNearestGrassPositionFrom = (nodes, currentPosition) => {
  const left = nodes.slice(0, currentPosition);
  const right = nodes.slice(currentPosition + 1, nodes.length);
  let nearestFromLeft;
  let nearestFromRight;

  for (let i = left.length - 1; i >= 0; i--) {
    if (left[i].classList.contains("grass")) {
      nearestFromLeft = nodes.indexOf(left[i]);
      break;
    }
  }

  for (let j = 0; j < right.length; j++) {
    if (right[j].classList.contains("grass")) {
      nearestFromRight = squareArray.indexOf(right[j]);
      break;
    }
  }

  if (!nearestFromRight)
    return nearestFromLeft;
  
  if (!nearestFromLeft)
    return nearestFromRight;
  
  const diffLeft = Math.abs(currentPosition - nearestFromLeft);
  const diffRight = Math.abs(currentPosition - nearestFromRight);
  if (diffLeft <= diffRight) return nearestFromLeft;

  else return nearestFromRight;
}

const searchGrass = currentPosition => {  
  const nearestGrass = getNearestGrassPositionFrom(
    squareArray,
    currentPosition
  );
  const level = getNodeLevel(squareLevels.length, nearestGrass);
  return { nearestGrassPosition: nearestGrass, grassIndex: nearestGrass % squareLevels.length, grassLevel: level };
}

const changeDirection = () => {
  const possibleDirections = orientations.filter(d => d !== currentDirection);
  prevDirection = currentDirection;

  let i = 0;
  while (willHitObstacles()) {
    document.dispatchEvent(controlPanel[possibleDirections[i]]());
    i += 1;
  }
}

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

// set destination => define path to destination => guide goat through path
