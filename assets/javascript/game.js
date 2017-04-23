// Game object
var game = {
	lettersGuessed: [],
	guessesRemaining: 6,
	wins: 0,
	inProgress: false,
	wordList: ["object", "array", "variable", "loop", "container", "grid", "javascript"],
	currentWord: "",
	wordState: [],
	lettersRemaining: 0,


	startGame() {
		this.inProgress = true;
	},

	// Picks a new word and initializes other game variables
	reset() {
		console.log("NEW GAME");

		// Randomly pick a word from the list
		this.currentWord = this.wordList[Math.floor(Math.random()*this.wordList.length)];
		
		// Initialize wordState to have same number of blanks as chosen word
		this.wordState = [];
		for (var i=0; i<this.currentWord.length; i++){
			this.wordState.push("_");
		}

		this.lettersRemaining = this.currentWord.length;
		this.lettersGuessed = [];
		this.guessesRemaining = 6;
	},

	win() {
		console.log("YOU WIN!");
		console.log("-------------------------");
		this.wins++;
		this.reset();
		this.update();
	},

	lose() {

	},

	checkLetter(c) {
		// Check if letter has already been guessed before
		for (var j=0; j<this.lettersGuessed.length; j++){
			if (c===this.lettersGuessed[j]){
				// Letter has been already guesssed, do nothing
				return;
			}
		}

		// Check if currentWord contains the given letter and reveal them in wordState
		for (var i=0; i<this.currentWord.length; i++){
			if (c===this.currentWord.charAt(i)){
				this.wordState[i] = c;
				this.lettersRemaining--;

				// Check if any letters left
				if (this.lettersRemaining === 0){
					this.win();					
					return;
				}
			}
		}

		// Add letter to list of guessed letters
		this.lettersGuessed.push(c);		
	},

	// Updates screen elements
	update(){
		document.getElementById('wordState').innerHTML = this.wordState.join(" ");
		console.log("Word: "+this.currentWord);
		console.log("State: "+this.wordState.join(" "));
		console.log("Letters left: "+this.lettersRemaining);
	}
};

// Initialize the game
game.reset();
game.update();

// Key press handler
document.onkeyup = function(event){
	event = event || window.event;

 	var key = event.keyCode;

 	// Check if letter key
 	if (key > 64 && key <91){
 		// Check if letter is in word
 		var letter = String.fromCharCode(key).toLowerCase();
 		console.log("Guessed '"+letter+"'");
 		game.checkLetter(letter);
 		game.update();
 	} else {
 		console.log("Not a valid key!");
 	}
}