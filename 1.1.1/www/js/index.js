var games = [];
var defaultCanvas;
function setup() {
	state = 'browser';
	connectSocket();
	var nameInput = document.getElementById('nameInput');
	nameInput.addEventListener('keyup', function() { // Enter event listener for name input field
		if (event.keyCode == 13) { // ENTER
			var invalid = false;
			if (nameInput.value == '' || nameInput.value == undefined || nameInput.value == null) {
				invalid = true;
			} else {
				for (let i = 0; i < games.length; i++) {
					if (nameInput.value == games[i].info.name) {
						invalid = true;
						break;
					}
				}
			}
			if (invalid == true) {
				alert('Invalid Name');
			} else {
				createGame(); // Creates new game
			}
		}
	});
	var passwordInput = document.getElementById('PasswordInput');
	passwordInput.addEventListener('keyup', function() { // Enter event listener for password field
		if (event.keyCode == 13) { // ENTER
			var invalid = false;
			if (nameInput.value == '' || nameInput.value == undefined || nameInput.value == null) {
				invalid = true;
			} else {
				for (let i = 0; i < games.length; i++) {
					if (nameInput.value == games[i].info.name) {
						invalid = true;
						break;
					}
				}
			}
			if (invalid == true) {
				alert('Invalid Name');
			} else {
				createGame(); // Creates new game
			}
		}
	});
	defaultCanvas = document.getElementById('defaultCanvas0'); // Hide canvas defaulted into the document body
	defaultCanvas.style.display = 'none';
}