class Goat {
    direction = 1;
    position = 0;
    name = "goat";

    constructor(position, direction) {
        this.position = position;
        this.direction = direction;
    }

    getDirection = () => this.direction;

    setDirection = newDirection => {
        this.direction = newDirection;

        if (newDirection === 1)
            this.setName("goat-right");
        if (newDirection === -1)
            this.setName("goat-left")
    }

    getPosition = () => this.position;

    setPosition = newPosition => {
        this.position = newPosition;
    }

    move() {
        this.position = this.position + this.direction;
    }

    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName;
    }
        
}

export default Goat;