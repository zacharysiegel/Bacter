var games = [];
function setup() {
	state = 'browser';
	connectSocket();
	var nameInput = document.getElementById('nameInput');
	nameInput.addEventListener('keyup', function() { 
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
				createGame();
			}
		}
	});
	var passwordInput = document.getElementById('PasswordInput');
	passwordInput.addEventListener('keyup', function() { 
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
				createGame();
			}
		}
	});
}