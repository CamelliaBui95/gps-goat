import Program from "./program.js";

class InteractiveProgram extends Program {
  updateControlKeys = null;

  constructor(
    squares,
    goat,
    scoreDisplay,
    levelDisplay,
    updateControlKeys,
    messageDialog,
    record
  ) {
    super(squares, goat, messageDialog, record);
    this.scoreDisplay = scoreDisplay;
    this.levelDisplay = levelDisplay;
    this.updateControlKeys = updateControlKeys;
  }

  setCommandCode(c) {
    if (c === "space") {
      if (this.isRunning) {
        this.updateControlKeys(c);

        return this.pause();
      } else {
        this.updateControlKeys(null);

        return this.resume();
      }
    }

    this.commandCode = c;

    this.updateControlKeys(this.commandCode);
    this.goat.setDirection(this.commandCode);
  }

  willMeetLimits() {
    const currentDirection = this.goat.getDirection();
    const currentPosition = this.goat.getPosition();
    if (
      (currentDirection === 1 &&
        currentPosition % this.width === this.width - 1) ||
      (currentDirection === this.width &&
        currentPosition + this.width >= this.width * this.width) ||
      (currentDirection === -1 && currentPosition % this.width === 0) ||
      (currentDirection === -this.width && currentPosition - this.width < 0) ||
      this.squares[currentPosition + currentDirection].getStatus() === "rock" ||
      this.squares[currentPosition + currentDirection].getStatus() === "wolf"
    ) {
      return true;
    }

    return false;
  }

  proceedToNextLvl() {
    this.pause();

    this.prevScore = this.score;

    this.level += 1;
    this.levelDisplay.textContent = this.level;

    this.intervalTime = this.intervalTime * this.speed;

    this.updateControlKeys(1);
    this.messageDialog.setMessage("Lvl Up</br>Good Job!");

    const idTimeOut = setTimeout(() => {
      this.restart();
      clearTimeout(idTimeOut);
    }, 3000);
  }

  onInit() {
    this.scoreDisplay.textContent = this.score;
    this.levelDisplay.textContent = this.level;
    this.messageDialog.clearMessage();
  }

  onExit() {
    this.messageDialog.setMessage(
      '<span class="text-xl">You\'ve lost.<br>Click <span class="border border-black solid-4 rounded-md bg-grey p-1 inline-block text-md translate-y-minus-20">Restart</span> to play again.<span>'
    );
  }

  updateSquares() {
    const prevPosition = this.goat.getPosition();

    this.squares[prevPosition].setStatus("");

    this.goat.move();
    this.wolf.move();

    const newPosition = this.goat.getPosition();
    if (this.squares[newPosition].getStatus() === "grass") {
      this.score += 1;
      this.scoreDisplay.textContent = this.score;
    }

    this.squares[newPosition].setStatus(this.goat.getName());
  }

  doExecute() {
    if (this.willMeetLimits()) {
      this.pause();
      this.intervalTime = 1000;
   
      return this.exit();
    }

    if (this.score - this.prevScore === this.area - (this.obstacles.length + 1))
      this.proceedToNextLvl();

    this.updateSquares();
  }
}

export default InteractiveProgram;
