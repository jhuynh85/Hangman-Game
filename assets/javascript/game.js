// Game object
var game = {
	lettersGuessed: [],
	incorrectLetters: [],
	guessesRemaining: 6,
	wins: 0,
	inProgress: false,
	wordList: ["object", "array", "variable", "loop", "container", "grid", "javascript", "column", "string", "bootstrap", ],
	currentWord: "",
	wordState: [],
	lettersRemaining: 0,
	music: true,
	punchFX: null,
	hitFX: null,
	KOWinFX: null,
	KOLoseFX: null,
	bellFX: null,
	crowdFX: null,

	startGame() {
		this.inProgress = true;
	},

	// Pick a new word and initialize other game variables
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
		this.incorrectLetters = [];
		this.guessesRemaining = 6;

		this.bellFX.play();
	},

	win() {
		console.log("YOU WIN!");
		console.log("-------------------------");
		this.wins++;
		this.mikeKO();
		this.reset();
		this.update();
	},

	lose() {
		console.log("YOU LOSE!");
		console.log("-------------------------");
		this.macKO();
		this.reset();
		this.update();
	},

	checkLetter(c) {
		// Check if letter has already been guessed before
		for (var j=0; j<this.lettersGuessed.length; j++){
			if (c===this.lettersGuessed[j]){
				// Letter has been already guesssed, do nothing
				return;
			}
		}
		// Add letter to list of guessed letters
		this.lettersGuessed.push(c);

		var found = false; // Flags whether a letter was found

		// Check if currentWord contains the given letter and reveal them in wordState
		for (var i=0; i<this.currentWord.length; i++){		
			if (c===this.currentWord.charAt(i)){
				this.wordState[i] = c;
				this.lettersRemaining--;
				found = true;

				// Check if any letters left
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
			this.incorrectLetters.push(c);
			this.guessesRemaining--;
			if (this.guessesRemaining===0){
				this.lose();
				return;
			}
			// Perform miss animation
			this.miss();
		}
	},

	// Update screen elements
	update(){
		// Update blanks
		document.getElementById('wordState').innerHTML = this.wordState.join("");

		// Update incorrect letters
		document.getElementById('incorrectLetters').innerHTML = this.incorrectLetters.join(" ");

		// Update health bars
		var percentage = this.guessesRemaining/6;
		this.hpAnimate('playerHP', Math.floor(percentage*215));
		percentage = this.lettersRemaining/this.currentWord.length;
		this.hpAnimate('CPUHP', Math.floor(percentage*215));

		console.log("Word: "+this.currentWord);
		console.log("State: "+this.wordState.join(" "));
		console.log("Letters left: "+this.lettersRemaining);
		console.log("Guesses left: "+this.guessesRemaining);
	},

	// Draw Little Mac punching Mike
	punch(){
		this.punchFX.play();
		
		// Hide default Little Mac and Mike animations
		document.getElementById('player').style.display = 'none';
		document.getElementById('PC').style.display = 'none';

		// Display "punched" frames
		document.getElementById('player-punched').style.backgroundImage = "url('assets/images/mac-punch.png')";
		document.getElementById('PC-punched').style.backgroundImage = "url('assets/images/mike-hit.png')";
		document.getElementById('player-punched').style.display = 'block';
		document.getElementById('PC-punched').style.display = 'block';
		

		// Delay before resuming animation
		setTimeout(function(){
			document.getElementById('player-punched').style.display = 'none';
			document.getElementById('PC-punched').style.display = 'none';
			document.getElementById('player').style.display = 'block';
			document.getElementById('PC').style.display = 'block';
		}, 750);
	},

	// Draw Mike punching Little Mac
	miss(){
		this.hitFX.play();

		// Hide default Little Mac and Mike animations
		document.getElementById('player').style.display = 'none';
		document.getElementById('PC').style.display = 'none';

		// Display "punched" frames
		document.getElementById('player-punched').style.backgroundImage = "url('assets/images/mac-hit.png')";
		document.getElementById('PC-punched').style.backgroundImage = "url('assets/images/mike-punch.png')";
		document.getElementById('player-punched').style.display = 'block';
		document.getElementById('PC-punched').style.display = 'block';		

		// Delay before resuming animation
		setTimeout(function(){
			document.getElementById('player-punched').style.display = 'none';
			document.getElementById('PC-punched').style.display = 'none';
			document.getElementById('player').style.display = 'block';
			document.getElementById('PC').style.display = 'block';
		}, 750);
	},


	// Draw Mac getting KO'ed
	macKO() {
		this.KOLoseFX.play();
		this.crowdFX.play();
		var player = document.getElementById('player');
		var pc = document.getElementById('PC');
		var playerPunched = document.getElementById('player-punched');
		var PCpunched = document.getElementById('PC-punched');

		// Hide default Little Mac animation
		player.style.display = 'none';
		pc.style.display = 'none';

		// Display KO frame
		playerPunched.style.width = '73px';
		playerPunched.style.height = '40px';
		playerPunched.style.backgroundImage = "url('assets/images/mac-KO.png')";
		PCpunched.style.backgroundImage = "url('assets/images/mike-punch-KO.png')";
		PCpunched.style.display = 'block';		
		playerPunched.style.display = 'block';

		// Delay before resuming animation
		setTimeout(function(){
			playerPunched.style.display = 'none';
			PCpunched.style.display = 'none';
			playerPunched.style.width = '40px';
			playerPunched.style.height = '73px';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 1750);
	},

	// Draw Mike getting KO'ed
	mikeKO() {
		this.KOWinFX.play();
		this.crowdFX.play();
		var player = document.getElementById('player');
		var pc = document.getElementById('PC');
		var playerPunched = document.getElementById('player-punched');
		var PCpunched = document.getElementById('PC-punched');

		// Hide default Little Mac animation
		player.style.display = 'none';
		pc.style.display = 'none';

		// Display KO frame
		playerPunched.style.backgroundImage = "url('assets/images/mac-punch-KO.png')";
		PCpunched.style.backgroundImage = "url('assets/images/mike-KO.png')";
		PCpunched.style.display = 'block';		
		playerPunched.style.display = 'block';

		// Delay before resuming animation
		setTimeout(function(){
			playerPunched.style.display = 'none';
			PCpunched.style.display = 'none';
			player.style.display = 'block';
			pc.style.display = 'block';
		}, 1750);

	},

	// Animate the HP bar to the specified width
	hpAnimate(barID, targetWidth){
		var elem = document.getElementById(barID);
    	var currentWidth = elem.clientWidth;
    	var id = setInterval(frame, 5);
    	
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
	musicToggle() {
		document.getElementById('theme').muted = !this.music;
	}
};

// Initialize the game
game.punchFX = new Audio('assets/audio/punch.mp3');
game.hitFX = new Audio('assets/audio/hit.mp3');
game.KOWinFX = new Audio('assets/audio/ko-win.mp3');
game.KOLoseFX = new Audio('assets/audio/ko-lose.mp3');
game.bellFX = new Audio('assets/audio/bell.mp3');
game.crowdFX = new Audio('assets/audio/crowd.mp3');

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