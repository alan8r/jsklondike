// CANVAS STUFF
let canvas, ctx;

// CONSTANTS
let SUIT_SYMBOLS = ["\u2663", "\u2666", "\u2665", "\u2660"];

// CARD CONSTANTS
let CARD_WIDTH = 100,
	CARD_HEIGHT = CARD_WIDTH * (3/2),
	CARD_BORDER = 2,
	CARD_OVERLAP = 30,
	CARD_FONT_SIZE = 24,
	CARD_FONT_FACE = "Courier";

// OBJECTS USED IN GAME LOOP
let mainDeck, drawPile, drawFlipPile, acePiles, cardStacks;

// GAME OPTIONS
let gameOptions = {
	drawThree: false,	// TODO: IMPLEMENT
	gameTimer: false 	// TODO: IMPLEMENT
}

function resizeCanvas() { 
	
	initCanvas();
	render();
}

function getWindowScale() {
	if (canvas.style.width == "") return 1;
	else return (parseInt(canvas.style.width) / canvas.width) || (parseInt(canvas.style.height) / canvas.height);
}

window.onload = function() {
	document.body.style.margin = 0;
	document.body.style.backgroundColor = "green";	
	document.documentElement.style.overflow = "hidden";
	document.body.scroll = "no";
	canvas = document.getElementById("canvas");
	//canvas.style.imageRendering = 'pixelated';
	ctx = canvas.getContext("2d");
	initCanvas();
	canvas.addEventListener('mousedown', mouseClick);
	//canvas.addEventListener('mousemove', function(e) {console.log(e.x, e.y)})
	window.addEventListener('resize', resizeCanvas);
	main();
	resizeCanvas();
}

function mouseClick(e) {

	let x = Math.floor(e.x/getWindowScale()),
		y = Math.floor(e.y/getWindowScale());

		//console.log(x, y);
		//console.log(e.x, e.y);

	if (drawPile.clicked(x, y)) {
		if (drawPile.size() > 0) {
			drawFlipPile.addCard(drawPile.drawCard().flip());
		} else {
			let repeats = drawFlipPile.size();
			for (let i = 0; i < repeats; i++) {
				drawPile.addCard(drawFlipPile.drawCard().flip());
			}
		}
	}
	
	if (drawFlipPile.clicked(x, y)) {
		let card = drawFlipPile.cardAt(drawFlipPile.size()-1);
		let played = false;
		played = playToAcePiles(card);
		if (!played) played = playToStacks(card);
		if (played) drawFlipPile.removeCardAt(drawFlipPile.size()-1);
	}

	for (let i = 0; i < acePiles.length; i++) {
		if (acePiles[i].clicked(x, y)) {
			if (acePiles[i].size() >= 1) {
				let card = acePiles[i].cardAt(acePiles[i].size()-1);
				let played = playToStacks(card);
				if (played) {
					acePiles[i].removeCardAt(acePiles[i].size()-1);
				}
			}
		}
	}

	for (let i = 0; i < cardStacks.length; i++) {
		let clicked = cardStacks[i].clicked(x, y);
		if (clicked.inBounds) {
			if (clicked.cardIndex == cardStacks[i].size()-1) {				// PLAY ONE CARD
				if (!cardStacks[i].cardAt(clicked.cardIndex).faceUp) {
					cardStacks[i].cardAt(clicked.cardIndex).flip();
				} else {
					let card = cardStacks[i].cardAt(clicked.cardIndex);
					let played = playToAcePiles(card);
					if (!played) played = playToStacks(card);
					if (played) cardStacks[i].removeCardAt(clicked.cardIndex);
				}
			} else {														// PLAY STACK OF CARDS
				if (cardStacks[i].cardAt(clicked.cardIndex).faceUp) {
					let played = playStackToStacks(cardStacks[i].getStackFrom(clicked.cardIndex));
					if (played) cardStacks[i].removeCardsFrom(clicked.cardIndex);
					
				}
			}
		}
	}

	render();
	if (winCheck()) {
		let rendered = false;
		while (!rendered) {
			render();
			rendered = true;
		}
		alert('you win! refresh the page to play again!');
	}

}

function clearScreen() {
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// CONFIGURE THE CANVAS PARAMS
function initCanvas() {
	canvas.style.width = "";
	canvas.style.height = "";

	let defaultWidth = 780,
		defaultHeight = 700;

	canvas.width = defaultWidth;
	canvas.height = defaultHeight;

	if (window.innerWidth < defaultWidth) {
		canvas.style.width = window.innerWidth + "px";
		canvas.height = defaultHeight*2;
	} else {
		// spent way too much time trying to make work like in head, to no avail. fix later :'( :'( :'(
	}

	clearScreen();
	ctx.font = CARD_FONT_SIZE + "px " + CARD_FONT_FACE;
}

function initVars() {
	mainDeck = new Deck();
	mainDeck.shuffle();

	drawPile = new CardPile();
	drawPile.emptySymbol = '\u2BAB';
	
	drawFlipPile = new CardPile();

	acePiles = [];
	for (let i = 0; i < 4; i++) {
		acePiles.push(new CardPile());
		acePiles[i].emptySymbol = 'A';
	}
	
	cardStacks = [];
	for (let i = 0; i < 7; i++) {
		cardStacks.push(new CardStack());
	}
}

function isRed (card) {
	if (card.suit == 1 || card.suit == 2) return true;
	else return false;
}

function dealCards() {
	for (let i = 0; i < cardStacks.length; i++) {
		for (let j = i+1; j > 0; j--) {
			cardStacks[i].addCard(mainDeck.drawCard());
		}
		cardStacks[i].cardAt(cardStacks[i].size()-1).flip();
	}

	let mainDeckSize = mainDeck.size();
	for (let i = 0; i < mainDeckSize; i++) {
		drawPile.addCard(mainDeck.drawCard());
	}
}

function playToAcePiles(card) {
	let played = false;
	for (let i = 0; i < acePiles.length; i++) {
		if (acePiles[i].size() == 0 && card.value == 1) {
			acePiles[i].addCard(card);
			played = true;
			break;
		} else {
			if (acePiles[i].cardAt(0).suit == card.suit) {
				if (acePiles[i].cardAt(acePiles[i].size()-1).value == card.value-1) {
					acePiles[i].addCard(card);
					played = true;
					break;
				}
			}
		}
	}
	return played;
}

function playToStacks(card) {
	let played = false;
	for (let i = 0; i < cardStacks.length; i++) {
		if (card.value == 13) {
			if (cardStacks[i].size() == 0) {
				cardStacks[i].addCard(card);
				played = true;
				break;
			}
		} else {
			if (
				cardStacks[i].size() != 0 && 
				cardStacks[i].cardAt(cardStacks[i].size()-1).value == card.value + 1 &&
				isRed(cardStacks[i].cardAt(cardStacks[i].size()-1)) != isRed(card)
			) {
				cardStacks[i].addCard(card);
				played = true;
				break;
			}
		}
	}
	return played;
}

function playStackToStacks(stack) {
	let played = false;
	let topCard = stack.cardAt(0);
	for (let i = 0; i < cardStacks.length; i++) {
		if (topCard.value == 13 && cardStacks[i].size() == 0) {				// IF TOP CARD OF STACK IS KING
			cardStacks[i].addStack(stack);
			played = true;
			break;
		}

		if (cardStacks[i].cardAt(cardStacks[i].size()-1).value == topCard.value+1 &&
			isRed(cardStacks[i].cardAt(cardStacks[i].size()-1)) != isRed(topCard)) {
				cardStacks[i].addStack(stack);
				played = true;
				break;
			}
	}
	return played;
}

function winCheck() {
	let countSum = 0;
	for (let i = 0; i < acePiles.length; i++) {
		countSum += acePiles[i].size();
	}
	if (countSum == 52) return true;
	else return false;
}


// MAIN PROGRAM FUNCTION
function main() {

	initVars();
	dealCards();

	render();
}

function render() {

	clearScreen();

	for (let i = 0; i < acePiles.length; i++) {
		acePiles[i].render(10 + (CARD_WIDTH+10)*i, 10);
	}

	drawFlipPile.render(10 + (CARD_WIDTH+10) * (acePiles.length+1), 10);

	drawPile.render(10 + (CARD_WIDTH+10) * (acePiles.length+2), 10);
	
	for (let i = 0; i < cardStacks.length; i++) {
		cardStacks[i].render(10 + (CARD_WIDTH+10)*i, 10 + (CARD_HEIGHT+10));
	}
}