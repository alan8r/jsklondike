class Deck {
    constructor() {
        this.deckArray = [];
        for (let suit = 0; suit <= 3; suit++) {
            for (let value = 1; value <= 13; value++) {
                this.deckArray.push(new Card(value, suit, false));
            }
        }
    }

    size() { return this.deckArray.length; }

    getCard(index) { return this.deckArray[index]; }

    drawCard() { return this.deckArray.splice(0, 1)[0]; }
    
    shuffle() {
        for (let index = this.deckArray.length - 1; index > 0; index--) {
            let randIndex = Math.floor(Math.random() * (index + 1));
            let temp = this.deckArray[index];
            this.deckArray[index] = this.deckArray[randIndex];
            this.deckArray[randIndex] = temp;
        }
        return this;
    }

    toString() {
        let returnString = "";
        for (let i = 0; i < this.deckArray.length; i++) {
            returnString += this.deckArray[i].toString();
            if (i != this.deckArray.length-1) returnString += ",";
        }
        return returnString;
    }
}