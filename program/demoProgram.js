import Program from "./program.js";

class DemoProgram extends Program {
  constructor(squares, goat) {
    super(squares, goat);
  }

  setRandomDirection() {
    const currentPosition = this.goat.getPosition();
    const neighbors = this.squares[currentPosition].getNeighbors();
    const randomIndex = Math.floor(Math.random() * neighbors.length);

    const nextSquare = neighbors[randomIndex];
    const newDirection = nextSquare - currentPosition;

    this.goat.setDirection(newDirection);
  }

  setNewGrass(squareIndex) {
    let lastTimeoutSession = this.timeoutSessions[squareIndex];
    if (lastTimeoutSession) clearTimeout(lastTimeoutSession);

    this.timeoutSessions[squareIndex] = setTimeout(() => {
      if (!this.squares[squareIndex].getStatus("goat")) {
        this.squares[squareIndex].setStatus("newGrass");
        this.setGrass(squareIndex);
      }
    }, 10000);
  }

  setGrass(squareIndex) {
    let lastTimeoutSession = this.timeoutSessions[squareIndex];
    if (lastTimeoutSession) clearTimeout(lastTimeoutSession);

    this.timeoutSessions[squareIndex] = setTimeout(() => {
      this.squares[squareIndex].setStatus("grass");
    }, 5000);
  }

  updateSquares() {
    const currentPosition = this.goat.getPosition();
    this.squares[currentPosition].setStatus("");

    this.goat.move();

    const newPosition = this.goat.getPosition();
    this.squares[newPosition].setStatus(this.goat.getName());

    this.setNewGrass(currentPosition);
  }

  doExecute() {
    this.setRandomDirection();
    this.updateSquares();
  }

  onExit() {
    for (let session in this.timeoutSessions)
      clearTimeout(this.timeoutSessions[session]);
  }
}

export default DemoProgram;

// class DemoProgram {
//   timeoutSessions = {};
//   executingClock;
//   width = config.width;
//   directions = config.directions;
//   area = config.area;

//   constructor(squares, goat) {
//     this.squares = squares;
//     this.goat = goat;
//   }

//   setExecutingClock(executingClock) {
//     this.executingClock = executingClock;
//   }

//   setRandomDirection() {
//     const currentPosition = this.goat.getPosition();
//     const neighbors = this.squares[currentPosition].getNeighbors();
//     const randomIndex = Math.floor(Math.random() * neighbors.length);

//     const nextSquare = neighbors[randomIndex];
//     const newDirection = nextSquare - currentPosition;

//     this.goat.setDirection(newDirection);
//   }

//   setNewGrass(squareIndex) {
//     let lastTimeoutSession = this.timeoutSessions[squareIndex];
//     if (lastTimeoutSession) clearTimeout(lastTimeoutSession);

//     this.timeoutSessions[squareIndex] = setTimeout(() => {
//       if (!this.squares[squareIndex].getStatus("goat")) {
//         this.squares[squareIndex].setStatus("newGrass");
//         this.setGrass(squareIndex);
//       }
//     }, 15000);
//   }

//   setGrass(squareIndex) {
//     let lastTimeoutSession = this.timeoutSessions[squareIndex];
//     if (lastTimeoutSession) clearTimeout(lastTimeoutSession);

//     this.timeoutSessions[squareIndex] = setTimeout(() => {
//       this.squares[squareIndex].setStatus("grass");
//     }, 10000);
//   }

//   setUp() {
//     for (let i = 0; i < this.area; i++) this.squares[i].setStatus("grass");

//     let rocks = Rock.generateRocks(this.area);
//     for (let rockIndex of rocks) this.squares[rockIndex].setStatus("rock");

//     for (let square of this.squares)
//       square.addNeighbors(this.squares, this.directions, this.width, "rock");
//   }

//   onInit() {
//     this.setUp();

//     const initialPosition = 0;
//     const initialDirection = 1;
//     this.goat.setPosition(initialPosition);
//     this.goat.setDirection(initialDirection);

//     const name = this.goat.getName();

//     this.squares[initialPosition].setStatus(name);
//   }

//   onUpdate() {
//     const currentPosition = this.goat.getPosition();
//     this.squares[currentPosition].setStatus("");

//     this.goat.move();

//     const newPosition = this.goat.getPosition();
//     this.squares[newPosition].setStatus(this.goat.getName());

//     this.setNewGrass(currentPosition);
//   }

//   doExecute() {
//     this.setRandomDirection();
//     this.onUpdate();
//   }

//   onExit() {
//     for (let session in this.timeoutSessions)
//       clearTimeout(this.timeoutSessions[session]);
//   }
// }

// export default DemoProgram;
