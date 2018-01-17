var socket;
function connectSocket() {
	socket = io.connect('24.55.26.67');

	socket.on('Games', function(gameS) {
		if (state == 'browser') {
			// let body = document.getElementsByTagName('body')[0];
			document.addEventListener('mouseup', function() {
				joinMouseDown = false;
				spectateMouseDown = false;
			});
			let browserBody = document.getElementById('browserBody');
			for (let i = 0; i < games.length; i++) {
				browserBody.deleteRow(-1);
			}
			games = gameS;
			for (let i = 0; i < games.length; i++) {
				let row = browserBody.insertRow(-1);
				row.style.height = '20px';
				let name = row.insertCell(0);
				name.innerHTML = games[i].info.name;
				name.style.width = '500px';
				let host = row.insertCell(1);
				host.innerHTML = games[i].info.host;
				host.style.width = '200px';
				let players = row.insertCell(2);
				players.innerHTML = games[i].players.length;
				players.style.width = '100px';
				players.style.textAlign = 'center';
				let spectators = row.insertCell(3);
				spectators.innerHTML = games[i].spectators.length;
				spectators.style.width = '100px';
				spectators.style.textAlign = 'center';
				let join = row.insertCell(4);
				join.innerHTML = 'Join';
				join.style.width = '190px';
				join.style.textAlign = 'center';
				join.style.cursor = 'pointer';
				let baseColor = join.style.backgroundColor;
				var joinMouseDown = false;
				join.addEventListener('mouseover', function() { if (joinMouseDown == true) { join.style.backgroundColor = 'rgb(180, 180, 180)'; } });
				join.addEventListener('mousedown', function() { joinMouseDown = true; join.style.backgroundColor = 'rgb(180, 180, 180)'; });
				join.addEventListener('mouseup', function() { joinMouseDown = false; join.style.backgroundColor = baseColor; });
				join.addEventListener('mouseleave', function() { join.style.backgroundColor = baseColor; });
				join.addEventListener('click', function() {
					let passInput = document.getElementById(games[i].info.name + 'passInput');
					socket.emit('Check Password', { pass: passInput.value, info: games[i].info, spectate: false }); // Initialize game as a player
				});
				let spectate = row.insertCell(5);
				spectate.innerHTML = 'Spectate';
				spectate.style.width = '190px';
				spectate.style.textAlign = 'center';
				spectate.style.cursor = 'pointer';
				baseColor = spectate.style.backgroundColor;
				var spectateMouseDown = false;
				spectate.addEventListener('mouseover', function() { if (spectateMouseDown == true) { spectate.style.backgroundColor = 'rgb(180, 180, 180)'; } });
				spectate.addEventListener('mousedown', function() { spectateMouseDown = true; spectate.style.backgroundColor = 'rgb(180, 180, 180)'; });
				spectate.addEventListener('mouseup', function() { spectateMouseDown = false; spectate.style.backgroundColor = baseColor; });
				spectate.addEventListener('mouseleave', function() { spectate.style.backgroundColor = baseColor; });
				spectate.addEventListener('click', function() {
					let passInput = document.getElementById(games[i].info.name + 'passInput');
					socket.emit('Check Password', { pass: passInput.value, info: games[i].info, spectate: true }); // Initialize game as a spectator
				});
				let password = row.insertCell(6);
				password.style.width = '150px';
				password.textAlign = 'center';
				let passwordInput = document.createElement('input');
				password.appendChild(passwordInput);
				passwordInput.type = 'text';
				passwordInput.value = '';
				passwordInput.autocomplete = 'off';
				passwordInput.id = games[i].info.name + 'passInput';
				passwordInput.style.width = '100%';
				passwordInput.style.boxSizing = 'border-box';
			}
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

	socket.on('Game', function(gamE) {
		game = gamE;
		if (state == 'game') {
			translate(-org.off.x, -org.off.y);
			renderWorld();
			renderOrgs();
			for (let i = 0; i < game.info.count; i++) {
				renderAbilities(game.abilities[i]);
			}
			renderUI();
			move(); // Move goes at the end so player does not see his movements before others
			translate(org.off.x, org.off.y);
		} else if (state == 'spectate') {
			translate(-org.off.x, -org.off.y);
			renderWorld();
			renderOrgs();
			for (let i = 0; i < game.info.count; i++) {
				renderAbilities(game.abilities[i]);
			}
			move();
			translate(org.off.x, org.off.y);
		}
	});

	socket.on('Index', function(datA) {
		org.index = datA.index;
		ability.index = datA.index;
		if (datA.spawn == true) {
			chooseAbilities();
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
			ability.extend.can = false;
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
			ability.immortality.can = false;
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

		socket.on('Stimulate', function() {
			ability.stimulate.value = true;
			ability.stimulate.can = false;
			clearTimeout(ability.stimulate.timeout);
			ability.stimulate.start = new Date();
			socket.emit('Ability', ability);
			ability.stimulate.timeout = setTimeout(function() { // End ability
				ability.stimulate.value = false;
				ability.stimulate.end = new Date();
				ability.stimulate.cooling = true;
				socket.emit('Ability', ability);
			}, ability.stimulate.time);
		});

		socket.on('Poison', function() {
			ability.poison.value = true;
			clearTimeout(ability.poison.timeout);
			socket.emit('Ability', ability);
			ability.poison.timeout = setTimeout(function() { // End ability
				ability.poison.value = false;
				socket.emit('Ability', ability);
			}, ability.poison.time);
		});
	}
}