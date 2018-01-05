var socket;
function connectSocket() {
	socket = io.connect('24.55.26.67');

	socket.on('Games', function(gameS) {
		if (state == 'browser') {
			let browser = document.getElementById('browser');
			for (let i = 0; i < games.length; i++) {
				browser.deleteRow(-1);
			}
			games = gameS;
			for (let i = 0; i < games.length; i++) {
				let row = browser.insertRow(-1);
				row.style.height = '20px';
				let name = row.insertCell(0);
				name.innerHTML = games[i].info.name;
				name.style.width = '500px';
				let host = row.insertCell(1);
				host.innerHTML = games[i].info.host;
				host.style.width = '200px';
				let pop = row.insertCell(2);
				pop.innerHTML = games[i].players.length;
				pop.style.width = '100px';
				pop.style.textAlign = 'center';
				let join = row.insertCell(3);
				join.innerHTML = 'Join';
				join.style.width = '190px';
				join.style.textAlign = 'center';
				join.style.cursor = 'pointer';
				let baseColor = join.style.backgroundColor;
				join.addEventListener('mousedown', function() { join.style.backgroundColor = 'rgb(180, 180, 180)'; });
				join.addEventListener('mouseup', function() { join.style.backgroundColor = baseColor; });
				join.addEventListener('mouseleave', function() { join.style.backgroundColor = baseColor; });
				join.addEventListener('click', function() { initialize(games[i]); });
				let spectate = row.insertCell(4);
				spectate.innerHTML = 'Spectate';
				spectate.style.width = '190px';
				spectate.style.textAlign = 'center';
				spectate.style.cursor = 'pointer';
				baseColor = spectate.style.backgroundColor;
				spectate.addEventListener('mousedown', function() { spectate.style.backgroundColor = 'rgb(180, 180, 180)'; });
				spectate.addEventListener('mouseup', function() { spectate.style.backgroundColor = baseColor; });
				spectate.addEventListener('mouseleave', function() { spectate.style.backgroundColor = baseColor; });
				spectate.addEventListener('click', function() { alert('Spectate mode is coming soon'); });		
			}
		}
	});

	socket.on('Game', function(gamE) {
		game = gamE;
		if (state == 'game') {
			renderWorld();
			renderOrgs();
			for (let i = 0; i < game.info.count; i++) {
				renderAbilities(game.abilities[i]);
			}
			renderUI();
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
				setTimeout(function() { // Cooldown
					ability.extend.can = true;
					socket.emit('Ability', ability);
				}, ability.extend.cooldown);
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
				setTimeout(function() { // Cooldown
					ability.immortality.can = true;
					socket.emit('Ability', ability);
				}, ability.immortality.cooldown);
				socket.emit('Ability', ability);
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
				setTimeout(function() { // Cooldown
					ability.stimulate.can = true;
					socket.emit('Ability', ability);
				}, ability.stimulate.cooldown);
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