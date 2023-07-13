import Graph from "../graph/graph.js";
import Program from "./program.js";

class BotProgram extends Program {
    destination = 1;
    path = [];
    score = 0;
  constructor(squares, goat) {
    super(squares, goat);
    this.graph = new Graph();
  }

    /*setNextDestination() {
        const currentPosition = this.goat.getPosition();
        const left = this.squares.slice(0, currentPosition);
        const right = this.squares.slice(currentPosition + 1, this.squares.length);
        let nearestFromLeft;
        let nearestFromRight;

        for (let i = left.length - 1; i >= 0; i--) {
            if (left[i].getStatus() === "grass") {
                nearestFromLeft = left[i].getIndex();
                break;
            }
        }

        for (let j = 0; j < right.length; j++) {
            if (right[j].getStatus() === "grass") {
                nearestFromRight = right[j].getIndex();
                break;
            }
        }

        if (!nearestFromRight) return (this.destination = nearestFromLeft);

        if (!nearestFromLeft) return (this.destination = nearestFromRight);

        const diffLeft = Math.abs(currentPosition - nearestFromLeft);
        const diffRight = Math.abs(currentPosition - nearestFromRight);

        if (diffLeft <= diffRight) this.destination = nearestFromLeft;
        else this.destination = nearestFromRight;
    }*/

    setNextDestination() {
        const currentPosition = this.goat.getPosition();
        for (let i = 1; i < this.width; i++) {
            let foundDestination = false;
            for (let d of this.directions) {
                if (!this.squares[currentPosition + d * i])
                    continue;
                if (this.squares[currentPosition + d * i].getStatus() === "grass") {
                    foundDestination = true;
                    return this.destination = currentPosition + d * i
                      
                }
                if (foundDestination)
                    return;   
            }
        }
    }
    
    setDirection() {
        if (this.path.length === 0)
            this.setNextDestination();
        
        const currentPosition = this.goat.getPosition();
        this.path = this.graph.findShortestPath(currentPosition, this.destination);
        const nextSquare = this.path.shift();
        const newDirection = nextSquare - currentPosition;

        this.goat.setDirection(newDirection);
    }

  updateSquares() {
    const currentPosition = this.goat.getPosition();
    this.squares[currentPosition].setStatus("");

    this.goat.move();

      const newPosition = this.goat.getPosition();
      if (this.squares[newPosition].getStatus() === "grass") 
        this.score += 1;

      this.squares[newPosition].setStatus(this.goat.getName());
  }

  onInit() {
    for (let square of this.squares) this.graph.addNode(square.getIndex());

    for (let square of this.squares) {
      for (let neighbor of square.getNeighbors()) {
        const weight = neighbor - square.getIndex();
        this.graph.addEdge(square.getIndex(), neighbor, weight);
      }
    }
  }

    doExecute() {
        if (
            this.score ===
            this.area - (this.obstacles.length + 1)
        )
            return this.pause();
          
        this.setDirection();
        this.updateSquares();
    }

  onExit() {
    for (let session in this.timeoutSessions)
      clearTimeout(this.timeoutSessions[session]);
  }
}

export default BotProgram;