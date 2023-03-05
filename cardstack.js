class CardStack {
    constructor() {

        this.stackArray = [];

        this.drawX = null;
        this.drawY = null;
        
        this.bounds = {
            left: null,
            right: null,
            top: null,
            bottom: null
        };

        this.emptySymbol = null;
    }

    toString() { return this.stackArray.toString(); }

    size() { return this.stackArray.length; }

    removeCardAt(index) { return this.stackArray.splice(index, 1)[0]; }

    addCard(card) { 
        this.stackArray.push(card);
        return this;
    }

    flipAll() {
        for (let i = 0; i < this.stackArray.length; i++) this.stackArray[i].flip();
    }

    clicked(x, y) {
        let cardIndex;
        let yy = y - this.bounds.top;
        if (this.stackArray.length > 1) {
            cardIndex = Math.floor(yy/CARD_OVERLAP);
            if (cardIndex > this.stackArray.length - 1) {
                cardIndex = this.stackArray.length - 1;
            }
        } else {
            cardIndex = 0;
        }
        return { inBounds: this.inBounds(x, y), cardIndex: cardIndex };
    }

    getStackFrom(index) {
        let newStack = new CardStack();
        for (let i = index; i < this.stackArray.length; i++) {
            newStack.addCard(this.stackArray[i]);
        }
        return newStack;
    }

    removeCardsFrom(index) {
        let size = this.size();
        for (let i = index; i < size; i++) {
            this.removeCardAt(index);
        }
    }

    addStack(stack) {
        let count = stack.size();
        for (let i = 0; i < count; i++) {
            this.addCard(stack.cardAt(i));
        }
    }

    cardAt(index) {
        if (this.stackArray[index] != undefined) return this.stackArray[index];
        else return -1;
    }

    inBounds(x, y) {
        return (
            x >= this.bounds.left && 
            x <= this.bounds.right && 
            y >= this.bounds.top && 
            y <= this.bounds.bottom 
        );
    }

    render(x, y) {
        
        if (x >= 0 && x < canvas.width &&
            y >= 0 && y < canvas.height) {
            this.drawX = x;
            this.drawY = y;
        }

        let CW = CARD_WIDTH,
            CH = CARD_HEIGHT,
            CB = CARD_BORDER;

        if (x >= 0 && x < canvas.width &&
            y >= 0 && y < canvas.height) {
            this.bounds.left = x;
            this.bounds.right = x + CW;
            this.bounds.top = y;
            this.bounds.bottom = y + CH + (30 * (this.stackArray.length-1));
        }
        
        if (this.stackArray.length < 1) {
            ctx.fillStyle = "#333";
            ctx.fillRect(x, y, CW, CH);
            ctx.fillStyle = "darkGreen";
            ctx.fillRect(x + CB, y + CB, CW - (CB*2), CH - (CB*2));
        } else {
            for (let i = 0; i < this.stackArray.length; i++) {
                this.stackArray[i].render(x, y + i * CARD_OVERLAP);
            }
        }
    }
}