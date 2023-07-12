import Rock from "../components/rock.js";
import config from "../config.js";

class Program {
  timeoutSessions = {};
  interval;
  intervalTime = 1000;
  speed = 0.8;
  isRunning = false;
  width = config.width;
  directions = config.directions;
  area = config.area;
  obstacles = [];

  constructor(squares, goat) {
    this.squares = squares;
    this.goat = goat;
  }

  setUp() {
    for (let i = 0; i < this.area; i++) this.squares[i].setStatus("grass");

    this.obstacles = Rock.generateRocks(this.area);
    for (let rockIndex of this.obstacles)
      this.squares[rockIndex].setStatus("rock");

    for (let square of this.squares)
      square.addNeighbors(this.squares, this.directions, this.width, "rock");
  }

  init() {
    this.setUp();
    this.onInit();

    const initialPosition = 0;
    const initialDirection = 1;

    this.goat.setPosition(initialPosition);
    this.goat.setDirection(initialDirection);

    const name = this.goat.getName();

    this.squares[initialPosition].setStatus(name);
  }

  execute() {
    this.interval = setInterval(() => {
      this.doExecute();
    }, this.intervalTime);

    this.isRunning = true;
  }

  exit() {
    this.onExit();

    clearInterval(this.interval);
    this.isRunning = false;
  }

  pause() {
    this.isRunning = false;
    clearInterval(this.interval);
  }

  resume() {
    this.onResume();
    this.execute();
  }

  restart() {
    this.init();
    this.execute();
  }

  onResume() {}
  onInit() {}
  onExit() {}
}

export default Program;
