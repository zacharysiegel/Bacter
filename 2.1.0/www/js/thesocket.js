var socket;
function connectSocket() {
	socket = io.connect('24.55.26.67'); // Local Server
	// socket = io.connect('https://bacter.herokuapp.com/'); // Heroku Server

	socket.on('Connections', function(connectionS) {
		connections = connectionS;
		if (state == 'browser') {
			renderBrowser();
		}
	});

	socket.on('Games', function(gameS) {
		if (state == 'browser') {
			games = gameS;
			renderBrowser();
		}
	});

	socket.on('Password Confirmed', function(datA) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.name == datA.info.name) {
				initialize(games[i], datA.spectate);
				break;
			}
		}
	});

	socket.on('Password Denied', function(datA) {
		if (datA.pass == '') {
			alert('The game requires a password');
		} else {
			alert('The password is incorrect');
		}
	});

	socket.on('Enter', function() {
		var namE = prompt('Enter a screen name');
		fixName();
		function fixName() {
			if (namE == '') { // Name must contain a character
				namE = prompt('Enter a screen name\nField cannot be left blank');
				fixName();
				return;
			}
			for (let i = 0; i < game.info.count; i++) {
				if (namE == game.board.list[i].name) { // Name cannot match another player's name
					namE = prompt('Enter a screen name\nName matches that of another player');
					fixName();
					return;
				}
			}
		}
		game.board.list.push({ // Add player to leaderboard
			player: socket.id, 
			name: namE, 
			kills: 0, 
			deaths: 0
		});
		orderBoard(game.board.list);
		socket.emit('Board', game.board.list);
		chooseAbilities();
	});

	socket.on('Game', function(gamE) {
		game = gamE;
		if (state == 'game') {
			translate(-org.off.x, -org.off.y);

			if (ability.spore.value == true) {
				ability.spore.interval();
			}
			for (let i = 0; i < 3; i++) {
				if (ability.shoot.value[i] == true) {
					ability.shoot.interval[i]();
				}
			}
			renderWorld();
			for (let i = 0; i < game.info.count; i++) {
				renderToxin(game.abilities[i]);
				renderSecretions(game.abilities[i]);
				renderNeutralize(game.abilities[i]);
			}
			renderOrgs();
			for (let i = 0; i < game.info.count; i++) {
				renderSpores(game.abilities[i]);
			}
			renderUI();
			move(); // Move goes at the end so player does not render his movements before others

			translate(org.off.x, org.off.y);
		} else if (state == 'spectate') {
			translate(-org.off.x, -org.off.y);

			renderWorld();
			for (let i = 0; i < game.info.count; i++) {
				renderToxin(game.abilities[i]);
				renderSecretions(game.abilities[i]);
				renderNeutralize(game.abilities[i]);
			}
			renderOrgs(); // Orgs render over neutralize and toxin but under other abilities
			for (let i = 0; i < game.info.count; i++) {
				renderSpores(game.abilities[i]);
			}
			move();

			translate(org.off.x, org.off.y);
		}
	});

	socket.on('Game Ended', function(gamE) {
		alert('The game has ended');
		document.location.reload();
	});

	socket.on('Spectate', function() {
		spectate();
	});

	{ // Abilities
		socket.on('Extend', function() {
			ability.extend.value = true;
			clearTimeout(ability.extend.timeout);
			org.coefficient = -25.5;
			org.range = 70;
			ability.extend.start = new Date();
			socket.emit('Ability', ability);
			ability.extend.timeout = setTimeout(function() { // End ability
				ability.extend.value = false;
				ability.extend.end = new Date();
				org.coefficient = -27.5;
				org.range += 10; // So as to cancel out compress
				if (org.range > 50) {
					org.range = 50; // Extend does not stack
				}
				ability.extend.cooling = true;
				socket.emit('Ability', ability);
			}, ability.extend.time);
		});

		socket.on('Compress', function() {
			ability.compress.value = true;
			clearTimeout(ability.compress.timeout);
			org.coefficient = -31.5;
			org.range -= 10; // So as to cancel out extend
			if (org.range < 30) {
				org.range = 30; // Compress does not stack
			}
			socket.emit('Ability', ability);
			ability.compress.timeout = setTimeout(function() {
				ability.compress.value = false;
				org.coefficient = -27.5;
				org.range = 50;
				socket.emit('Ability', ability);
			}, ability.compress.time);
		});

		// socket.on('Speed', function() { // Not updated
		// 	ability.speed.value = true;
		// 	org.speed *= ability.speed.factor;
		// 	clearTimeout(ability.speed.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.speed.timeout = setTimeout(function() { // End ability
		// 		org.speed /= ability.speed.factor;
		// 		ability.speed.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.speed.time);
		// });

		// socket.on('Slow', function() { // Not updated
		// 	ability.slow.value = true;
		// 	org.speed /= ability.slow.factor; // Divide speed by factor
		// 	clearTimeout(ability.slow.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.slow.timeout = setTimeout(function() { // End ability
		// 		org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
		// 		ability.slow.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.slow.time);
		// });

		socket.on('Immortality', function() {
			ability.immortality.value = true;
			clearTimeout(ability.immortality.timeout);
			ability.immortality.start = new Date();
			socket.emit('Ability', ability);
			ability.immortality.timeout = setTimeout(function() { // End ability
				ability.immortality.value = false;
				ability.immortality.end = new Date();
				ability.immortality.cooling = true;
			}, ability.immortality.time);
		});

		socket.on('Stunt', function() {
			ability.stunt.value = true;
			clearTimeout(ability.stunt.timeout);
			socket.emit('Ability', ability);
			ability.stunt.timeout = setTimeout(function() { // End ability
				ability.stunt.value = false;
				socket.emit('Ability', ability);
			}, ability.stunt.time);
		});

		// socket.on('Stimulate', function() {
		// 	ability.stimulate.value = true;
		// 	clearTimeout(ability.stimulate.timeout);
		// 	ability.stimulate.start = new Date();
		// 	socket.emit('Ability', ability);
		// 	ability.stimulate.timeout = setTimeout(function() { // End ability
		// 		ability.stimulate.value = false;
		// 		ability.stimulate.end = new Date();
		// 		ability.stimulate.cooling = true;
		// 		socket.emit('Ability', ability);
		// 	}, ability.stimulate.time);
		// });

		// socket.on('Poison', function() {
		// 	ability.poison.value = true;
		// 	clearTimeout(ability.poison.timeout);
		// 	socket.emit('Ability', ability);
		// 	ability.poison.timeout = setTimeout(function() { // End ability
		// 		ability.poison.value = false;
		// 		socket.emit('Ability', ability);
		// 	}, ability.poison.time);
		// });

		socket.on('Neutralize', function() {
			ability.neutralize.value = true;
			ability.neutralize.start = new Date();
			clearTimeout(ability.neutralize.timeout);
			ability.neutralize.x = org.x();
			ability.neutralize.y = org.y();
			socket.emit('Ability', ability);
			ability.neutralize.timeout = setTimeout(function() {
				ability.neutralize.value = false;
				ability.neutralize.end = new Date();
				ability.neutralize.cooling = true;
				socket.emit('Ability', ability);
			}, ability.neutralize.time);
		});

		socket.on('Toxin', function() {
			ability.toxin.value = true;
			ability.toxin.start = new Date();
			clearTimeout(ability.toxin.timeout);
			ability.toxin.x = org.x();
			ability.toxin.y = org.y();
			socket.emit('Ability', ability);
			ability.toxin.timeout = setTimeout(function() {
				ability.toxin.value = false;
				ability.toxin.end = new Date();
				ability.toxin.cooling = true;
				socket.emit('Ability', ability);
			}, ability.toxin.time);
		});
	}
}