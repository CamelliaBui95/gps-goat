import Rock from "../components/rock.js";
import Wolf from "../components/wolf.js";
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
  score = 0;
  prevScore = 0;
  level = 1;
  messageDialog = null;
  record = null;

  constructor(squares, goat, messageDialog, record) {
    this.squares = squares;
    this.goat = goat;
    this.messageDialog = messageDialog;
    this.record = record;
    this.wolf = new Wolf();
  }

  setUp() {
    for (let i = 0; i < this.area; i++) this.squares[i].setStatus("grass");

    /**Set rocks */
    let rocks = Rock.generateRocks(this.area);
    for (let rockIndex of rocks)
      this.squares[rockIndex].setStatus("rock");
    
    /**Set wolf */
    let wolfLocation = this.wolf.locate(this.squares);
    while (rocks.includes(wolfLocation[0]) && rocks.includes(wolfLocation[1]))
      wolfLocation = this.wolf.locate(this.squares);
    
    this.obstacles = [...rocks, ...wolfLocation];

    for (let square of this.squares)
      square.addNeighbors(this.squares, this.directions, this.width, this.obstacles);
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

    if(this.record)
      this.record.updateRecord(this.score);

    this.prevScore = 0;
    this.score = 0;
    this.level = 1;

    clearInterval(this.interval);
    this.isRunning = false;
  }

  pause() {
    this.onPause();

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

  onResume() {
    this.messageDialog.clearMessage();
  }

  onInit() {

  }

  onExit() { }
  
  onPause() {
    this.messageDialog.setMessage("Pause");
    this.messageDialog.displayMessage();
  }

  getScore() {
    return this.score;
  }

}

export default Program;
