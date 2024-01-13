import Program from "./program.js";

class DemoProgram extends Program {
  handler = null;
  constructor(squares, goat, handler, messageDialog) {
    super(squares, goat, messageDialog);
    this.handler = handler;
  }

  setRandomDirection() {
    const currentPosition = this.goat.getPosition();
    const neighbors = this.squares[currentPosition].getNeighbors();
    const randomIndex = Math.floor(Math.random() * neighbors.length);

    const nextSquare = neighbors[randomIndex];
    const newDirection = nextSquare - currentPosition;

    if (this.handler != null)
      this.handler(newDirection)
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

    this.wolf.move();
    this.goat.move();

    const newPosition = this.goat.getPosition();
    const lastGrassSession = this.timeoutSessions[newPosition];
    if (lastGrassSession) clearTimeout(lastGrassSession);

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

  onInit() {
    this.messageDialog.setMessage("Let's Play");
    this.messageDialog.displayMessage();
  }
}

export default DemoProgram;

