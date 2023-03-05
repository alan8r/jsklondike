class CardPile {
    constructor() {

        this.emptySymbol = null;

        this.pileArray = [];

        this.bounds = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };
    }

    size() { return this.pileArray.length; }
    
    drawCard() { return this.pileArray.splice(0, 1)[0]; }
    
    removeCardAt(index) { return this.pileArray.splice(index, 1)[0]; }
    
    addCard(card) {
        this.pileArray.push(card);
        return this;
    }

    addCardAt(card, index) {
        this.pileArray.splice(index, 0, card);
    }

    topCard() {
        return this.pileArray[this.pileArray.length-1];
    }

    toString() {
        let returnString = "";
        for (let i = 0; i < this.pileArray.length; i++) {
            returnString += this.pileArray[i].toString();
            if (i != this.pileArray.length-1) returnString += ",";
        }
        return returnString;
    }

   cardAt(index) {
        if (this.pileArray[index] != undefined) return this.pileArray[index];
        else return -1;
    }

    indexOf(card) {
        for (let i = 0; i < this.pileArray.length; i++) {
            if (card.toString() == this.pileArray[i].toString()) return i;
        }
        return -1;
    }

    inBounds(x, y) {
        return (
            x >= this.bounds.left && 
            x <= this.bounds.right && 
            y >= this.bounds.top && 
            y <= this.bounds.bottom 
        );
    }

    clicked = function(x, y) {
        return this.inBounds(x, y);
    }

    render = function(x, y) {
        
        let CW = CARD_WIDTH,
            CH = CARD_HEIGHT,
            CB = CARD_BORDER,
            CFS = CARD_FONT_SIZE;

        if (x >= 0 && x < canvas.width &&
            y >= 0 && y < canvas.height) {
            this.bounds.left = x;
            this.bounds.right = x + CW;
            this.bounds.top = y;
            this.bounds.bottom = y + CH;
        }

        if (this.pileArray.length < 1) {
            ctx.fillStyle = "#333";
            ctx.fillRect(x, y, CW, CH);
            ctx.fillStyle = "darkGreen";
            ctx.fillRect(x + CB, y + CB, CW - (CB*2), CH - (CB*2));
            ctx.fillStyle = "#333";
            ctx.font = (CFS*2) + "px " + CARD_FONT_FACE;
            
            let symbol = "";
            if (this.emptySymbol) symbol = this.emptySymbol;
            
            let xx = x + ctx.measureText(symbol).width+4,
                yy = y + CH - ((CFS*2.5));
            if (symbol == '\u2BAB') {
                xx -= (CFS - 7);
                yy += 5;
            }
            ctx.fillText(symbol, xx, yy);
        } else {
            this.pileArray[this.pileArray.length-1].render(x, y);
        }
    }
}