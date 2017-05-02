// Game object
var game = {
    // Word bank
	wordList: [{
					word: "object",
					hint: "In Javascript, almost everything is this"
				}, 
				{	word: "array",
					hint: "You can access its elements using an index"
				}, 
				{	word: "variable",
					hint: "You can store values in this"
				}, 
				{	
					word: "loop",
					hint: "Use this to run a section of code multiple times"
				}, 
				{
					word: "grid",
					hint: "Bootstrap's positioning system is based on this"
				}, 
				{
					word: "javascript",
					hint: "Popular web programming language"
				}, 
				{
					word: "column",
					hint: "Opposite of row"
				}, 
				{
					word: "string",
					hint: "Values of this data type are surrounded by quotation marks"
				}, 
				{
					word: "bootstrap",
					hint: "Popular front-end framework"
				}, 
				{
					word: "function",
					hint: "A section of code that can be 'called' when needed"
				}, 
				{
					word: "expression",
					hint: "A section of code that can be evaluated"
				},
				{
					word: "comment",
					hint: "Code that the compiler ignores"
				},
				{
					word: "position",
					hint: "'relative', 'absolute', and 'fixed' are values of this property"	
				},
				{
					word: "jquery",
					hint: "Popular Javascript library"
				},
				{
					word: "span",
					hint: "This tag is an in-line element"
				},
				{
					word: "boolean",
					hint: "Data type that can be either true or false"
				},
				{
					word: "undefined",
					hint: "Unassigned variables have this value"
				},
				{
					word: "arguments",
					hint: "These go inside the parentheses of a function"
				},
				{
					word: "link",
					hint: "Tag used to access an external resource"
				},
				{
					word: "script",
					hint: "Tag used to define a section of Javascript code"
				}],
	lettersGuessed: [],    // List of letters already guessed
	incorrectLetters: [],  // List of incorrect letters already guessed
	guessesRemaining: 6,   // # of guesses remaining
	wins: 0,               // # of wins
	currentWord: "",       // Currently selected word
	hint: "",              // Hint for current word
	wordState: [],         // State of game (starts out filled with '_')
	lettersRemaining: 0,   // Letters remaining for user to guess
	muted: false,          // Flags whether music is on/off
	punchFX: null,
	hitFX: null,
	KOWinFX: null,
	KOLoseFX: null,
	bellFX: null,
	crowdFX: null,

	// Pick a new word and initialize other game variables
	reset: function () {
		console.log("NEW GAME");

		// Randomly pick a word from the list and display hint
		var index = Math.floor(Math.random()*this.wordList.length);
		this.currentWord = this.wordList[index]['word'];
		this.hint = this.wordList[index]['hint'];
		document.getElementById("hint").innerHTML = "HINT: "+this.hint;
		
		// Initialize wordState to have same number of blanks as chosen word
		this.wordState = [];
		for (var i=0; i<this.currentWord.length; i++){
			this.wordState.push("_");
		}

		this.lettersRemaining = this.currentWord.length;
		this.lettersGuessed = [];
		this.incorrectLetters = [];
		this.guessesRemaining = 6;

		this.bellFX.play();
	},

	// Trigger Mike KO animation and update win counter, then picks a new word
	win: function () {
		console.log("YOU WIN!");
		console.log("-------------------------");
		this.wins++;
		document.getElementById('score').innerHTML = 'X '+this.wins;
		this.mikeKO();
		setTimeout(function(){
			game.reset();
			game.update();
		}, 1000);
	},

	// Trigger Mac KO animation then picks a new word
	lose: function () {
		console.log("YOU LOSE!");
		console.log("-------------------------");
		this.macKO();
		setTimeout(function(){
			// Reveal word to user before resetting
			document.getElementById('wordState').innerHTML = game.currentWord;		
			setTimeout(function(){
				game.reset();
				game.update();
			}, 1250);		
		}, 1);
    },

	// Check if the current word contains the given letter and calls the relevant methods
	checkLetter: function(c) {
		// Check if letter has already been guessed before
		if (this.lettersGuessed.indexOf(c) != -1){
			// Letter has been already guessed, do nothing
			return;
		}

		// Add letter to list of guessed letters
		this.lettersGuessed.push(c);

		var found = false; // Flags whether a letter was found

		// Check if currentWord contains the given letter and reveal them in wordState
		for (var i=0; i<this.currentWord.length; i++){
			// Letter found		
			if (c===this.currentWord.charAt(i)){
				this.wordState[i] = c;
				this.lettersRemaining--;
				found = true;

				// Trigger win if there are no letters left
				if (this.lettersRemaining === 0){
					this.win();
					return;					
				}
				// Perform punch animation
				this.punch();
			}
		}

		// Letter not found
		if (!found){
			// Add to list of incorrect letters
			this.incorrectLetters.push(c);
			this.guessesRemaining--;
			// Trigger lose if there are no guesses left
			if (this.guessesRemaining===0){
				this.lose();
				return;
			}
			// Perform miss animation
			this.miss();
		}
	},

	// Update screen elements
	update: function (){
		// Update blanks
		document.getElementById('wordState').innerHTML = this.wordState.join("");

		// Update incorrect letters
		document.getElementById('incorrectLetters').innerHTML = this.incorrectLetters.join(" ");

		// Update health bars
		var percentage = this.guessesRemaining/6;
		this.hpAnimate('playerHP', Math.floor(percentage*215));
		percentage = this.lettersRemaining/this.currentWord.length;
		this.hpAnimate('CPUHP', Math.floor(percentage*215));

		// Console output
		console.log("Word: "+this.currentWord);
		console.log("State: "+this.wordState.join(" "));
		console.log("Letters left: "+this.lettersRemaining);
		console.log("Guesses left: "+this.guessesRemaining);
	},

	// Draw Little Mac punching Mike
	punch: function (){
		this.punchFX.play();
		
		// Hide default Little Mac and Mike animations
		document.getElementById('player').style.display = 'none';
		document.getElementById('PC').style.display = 'none';

		// Display punch frames
		document.getElementById('player-punched').style.backgroundImage = "url('assets/images/mac-punch.png')";
		document.getElementById('PC-punched').style.backgroundImage = "url('assets/images/mike-hit.png')";
		document.getElementById('player-punched').style.display = 'block';
		document.getElementById('PC-punched').style.display = 'block';
		
		// Delay before resuming default animations
		setTimeout(function(){
			document.getElementById('player-punched').style.display = 'none';
			document.getElementById('PC-punched').style.display = 'none';
			document.getElementById('player').style.display = 'block';
			document.getElementById('PC').style.display = 'block';
		}, 500);
	},

	// Draw Mike punching Little Mac
	miss: function (){
		this.hitFX.play();

		// Hide default Little Mac and Mike animations
		document.getElementById('player').style.display = 'none';
		document.getElementById('PC').style.display = 'none';

		// Display punch frames
		document.getElementById('player-punched').style.backgroundImage = "url('assets/images/mac-hit.png')";
		document.getElementById('PC-punched').style.backgroundImage = "url('assets/images/mike-punch.png')";
		document.getElementById('player-punched').style.display = 'block';
		document.getElementById('PC-punched').style.display = 'block';		

		// Delay before resuming default animations
		setTimeout(function(){
			document.getElementById('player-punched').style.display = 'none';
			document.getElementById('PC-punched').style.display = 'none';
			document.getElementById('player').style.display = 'block';
			document.getElementById('PC').style.display = 'block';
		}, 500);
	},

	// Draw Mac getting KO'ed
	macKO: function () {
		this.KOLoseFX.play();
		this.crowdFX.play();
		var player = document.getElementById('player');
		var pc = document.getElementById('PC');
		var playerPunched = document.getElementById('player-punched');
		var PCpunched = document.getElementById('PC-punched');
		var wordState = document.getElementById('wordState');

		// Hide default Little Mac animation
		player.style.display = 'none';
		pc.style.display = 'none';

		// Display KO frames
		playerPunched.style.width = '73px';
		playerPunched.style.height = '40px';
		playerPunched.style.backgroundImage = "url('assets/images/mac-KO.png')";
		PCpunched.style.backgroundImage = "url('assets/images/mike-punch-KO.png')";
		PCpunched.style.display = 'block';		
		playerPunched.style.display = 'block';

		// Delay before resuming default animation
		setTimeout(function(){
			playerPunched.style.display = 'none';
			PCpunched.style.display = 'none';
			playerPunched.style.width = '40px';
			playerPunched.style.height = '73px';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 1250);
	},

	// Draw Mike getting KO'ed
	mikeKO: function () {
		this.KOWinFX.play();
		this.crowdFX.play();
		var player = document.getElementById('player');
		var pc = document.getElementById('PC');
		var playerPunched = document.getElementById('player-punched');
		var PCpunched = document.getElementById('PC-punched');

		// Hide default Mike animation
		player.style.display = 'none';
		pc.style.display = 'none';

		// Display KO frame
		playerPunched.style.backgroundImage = "url('assets/images/mac-punch-KO.png')";
		PCpunched.style.backgroundImage = "url('assets/images/mike-KO.png')";
		PCpunched.style.display = 'block';		
		playerPunched.style.display = 'block';

		// Delay before resuming default animation
		setTimeout(function(){
			playerPunched.style.display = 'none';
			PCpunched.style.display = 'none';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 1250);
	},

	// Animate the HP bar to the specified width
	hpAnimate: function (barID, targetWidth){
		var elem = document.getElementById(barID);
    	var currentWidth = elem.clientWidth;
    	var id = setInterval(frame, 2);
    	
    	function frame() {
        	if (currentWidth == targetWidth) {
            	clearInterval(id);
        	} else if (currentWidth > targetWidth) {
            	currentWidth--; 
            	elem.style.width = currentWidth+'px'; 
        	} else {
        		currentWidth++; 
            	elem.style.width = currentWidth+'px';
        	}
		}
	},

	// Toggle music on/off
	musicToggle: function () {
		document.getElementById('theme').muted = !this.muted;
		this.muted = !this.muted;
	}
};

/* INITIALIZE THE GAME */

// Load audio effects
game.punchFX = new Audio('assets/audio/punch.mp3');
game.hitFX = new Audio('assets/audio/hit.mp3');
game.KOWinFX = new Audio('assets/audio/ko-win.mp3');
game.KOLoseFX = new Audio('assets/audio/ko-lose.mp3');
game.bellFX = new Audio('assets/audio/bell.mp3');
game.crowdFX = new Audio('assets/audio/crowd.mp3');

// Reduce volume
document.getElementById('theme').volume = 0.5;
game.punchFX.volume = 0.5;
game.hitFX.volume = 0.5;
game.KOWinFX.volume = 0.5;
game.KOLoseFX.volume = 0.5;
game.bellFX.volume = 0.5;
game.crowdFX.volume = 0.5;

// Pick a word
game.reset();
game.update();

// Key press handler
document.onkeyup = function(event){
	event = event || window.event;

	var key = event.keyCode;

 	// Check if letter key
 	if (key > 64 && key < 91){
 		// Check if letter is in word
 		var letter = String.fromCharCode(key).toLowerCase();
 		console.log("Guessed '"+letter+"'");
 		game.checkLetter(letter);
 		game.update();
 	} else {
 		console.log("Not a valid key!");
 	}
}