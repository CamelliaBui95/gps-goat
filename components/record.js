class Record {
    constructor() {
        this.highestScoreDisplay = document.getElementById("highest-score");
        this.prevScoreDisplay = document.getElementById("previous-score");
        this.highestScore = 0;
        this.prevScore = 0;
    }

    updateRecord(score) {
        if (this.highestScore < score)
            this.highestScore = score;

        this.prevScore = score;
        
        this.highestScoreDisplay.innerText = this.highestScore.toString();
        this.prevScoreDisplay.innerText = this.prevScore.toString();
    }
}

export default Record;