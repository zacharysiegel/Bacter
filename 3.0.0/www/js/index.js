var games = [];
var defaultCanvas;
function setup() {
	state = 'browser';
	connectSocket();
	renderBrowser();

	// Input fields in header cells (pre-menus)
	// var nameInput = document.getElementById('nameInput');
	// nameInput.addEventListener('keyup', function() { // Enter event listener for name input field
	// 	if (event.keyCode == 13) { // ENTER
	// 		var invalid = false;
	// 		if (nameInput.value == '' || nameInput.value == undefined || nameInput.value == null) {
	// 			invalid = true;
	// 		} else {
	// 			for (let i = 0; i < games.length; i++) {
	// 				if (nameInput.value == games[i].info.name) {
	// 					invalid = true;
	// 					break;
	// 				}
	// 			}
	// 		}
	// 		if (invalid == true) {
	// 			alert('Invalid Name');
	// 		} else {
	// 			createGame(); // Creates new game
	// 		}
	// 	}
	// });
	// var passwordInput = document.getElementById('PasswordInput');
	// passwordInput.addEventListener('keyup', function() { // Enter event listener for password field
	// 	if (event.keyCode == 13) { // ENTER
	// 		var invalid = false;
	// 		if (nameInput.value == '' || nameInput.value == undefined || nameInput.value == null) {
	// 			invalid = true;
	// 		} else {
	// 			for (let i = 0; i < games.length; i++) {
	// 				if (nameInput.value == games[i].info.name) {
	// 					invalid = true;
	// 					break;
	// 				}
	// 			}
	// 		}
	// 		if (invalid == true) {
	// 			alert('Invalid Name');
	// 		} else {
	// 			createGame(); // Creates new game
	// 		}
	// 	}
	// });
}

function windowResized() {
	var button;
	if (state == 'createMenu') {
		button = document.getElementById('createButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	} else if (state == 'joinMenu') {
		button = document.getElementById('joinButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	} else if (state == 'spectateMenu') {
		button = document.getElementById('spectateButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	} else if (state == 'respawnMenu') {
		button = document.getElementById('respawnButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	} else if (state == 'pauseGameMenu') {
		button = document.getElementById('pauseGameButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	} else if (state == 'pauseSpectateMenu') {
		button = document.getElementById('pauseSpectateButton');
		button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
	}
}