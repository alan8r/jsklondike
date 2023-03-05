class Card {
    constructor(value, suit, faceUp) {

        this.drawX = null;
        this.drawY = null;

        if (value >= 1 && value <= 13) this.value = value;
        else this.value = -1;

        if (suit >= 0 && suit <= 3) this.suit = suit;
        else this.suit = -1;

        if (typeof faceUp == "boolean") this.faceUp = faceUp;
        else this.faceUp = -1;
    }

    flip() {
        this.faceUp = !this.faceUp;
        return this;
    }

    toString() {
        let valueString, suitString;
        switch (this.value) {
            case 1: 	valueString = "Ace";			break;
            case 11: 	valueString = "Jack";			break;
            case 12: 	valueString = "Queen";			break;
            case 13: 	valueString = "King";			break;
            default: 	valueString = "" + this.value;	break;
        }

        switch (this.suit) {
            case 0: 	suitString = "Clubs"; 		break;
            case 1: 	suitString = "Diamonds"; 	break;
            case 2: 	suitString = "Hearts"; 		break;
            case 3: 	suitString = "Spades";		break;
            default: 	suitString = "INVALID";		break;
        }

        return valueString + " of " + suitString;
    }

    render(x, y) {
        
        let CB = CARD_BORDER,
            CW = CARD_WIDTH,
            CH = CARD_HEIGHT,
            CFS = CARD_FONT_SIZE; // CLEANS UP CODE LENGTH/READABILITY

        ctx.fillStyle = "black"; // CARD BORDER
        ctx.fillRect(x, y, CW, CH);
        
        if (!this.faceUp) {
            ctx.fillStyle = "blue";
            ctx.fillRect(x + CB, y + CB, CW - (CB*2), CH - (CB*2));
        } else { 
            ctx.fillStyle = "white";
            ctx.fillRect(x + CB, y + CB, CW - (CB*2), CH - (CB*2));
            
            if (this.suit < 1 || this.suit > 2) ctx.fillStyle = "black";
            else ctx.fillStyle = "red";
            
            let drawSuit = SUIT_SYMBOLS[this.suit],
                drawValue = this.value != 10 ? this.toString().split(" ")[0][0] : this.toString().split(" ")[0], // TO HANDLE WIDTH CHAR OF '10'
                spaceBuffer = this.value != 10 ? "    " : "   ", // SAME AS ABOVE
                topString = drawValue + spaceBuffer + drawSuit,
                bottomString = drawSuit + spaceBuffer + drawValue;
            
            ctx.font = CFS + "px " + CARD_FONT_FACE; 
            ctx.fillText(topString, x + (CW/2) - ctx.measureText(topString).width/2, y + CB + CFS);
            ctx.fillText(bottomString, x + (CW/2) - ctx.measureText(bottomString).width/2, y + CH - (CB*2) - CFS/5);

            ctx.font = (CFS*3) + "px " + CARD_FONT_FACE;
            ctx.fillText(drawSuit, x + (CW/2) - ctx.measureText(drawSuit).width/2, y + (CH/2) + CFS);
        }
    }
}