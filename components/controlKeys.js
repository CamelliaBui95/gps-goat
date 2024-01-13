class ControlKeys {
    constructor() {
        this.upKey = document.getElementById("up-arrow");
        this.downKey = document.getElementById("down-arrow");
        this.leftKey = document.getElementById("left-arrow");
        this.rightKey = document.getElementById("right-arrow");
        this.spaceKey = document.getElementById("space-key");
    }

    refreshKeys() {
        this.upKey.classList.remove("bg-grey-md");
        this.downKey.classList.remove("bg-grey-md");
        this.rightKey.classList.remove("bg-grey-md");
        this.leftKey.classList.remove("bg-grey-md");
        this.spaceKey.classList.remove("bg-grey-md");
    }

    updateKeys(direction) {
        this.refreshKeys();
        if (direction === 1)
            this.rightKey.classList.add("bg-grey-md");
        if (direction === -1)
            this.leftKey.classList.add("bg-grey-md");
        if (direction === 10)
            this.downKey.classList.add("bg-grey-md");
        if (direction === -10)
            this.upKey.classList.add("bg-grey-md");
        if (direction === 'space')
            this.spaceKey.classList.add("bg-grey-md");  
    }
}

export default ControlKeys;