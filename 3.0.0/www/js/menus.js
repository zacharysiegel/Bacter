var menus = {
	width: 900, 
	top: 30, 
	padding: 0, 
	color: { r: 240, g: 240, b: 240 }, 
	header: {
		padding: 9, 
		height: 32, 
		backgroundColor: { r: 0, g: 0, b: 0 }, 
		color: { r: 255, g: 255, b: 255 }, 
		font: 'Verdana', 
		size: 16,
		weight: 'bold'
	}, 
	rows: {
		height: 21, 
		color: { r: 255, g: 255, b: 255 }, 
		margin: 0, 
		padding: 0
	}, 
	cells: {
		count: 2, 
		margin: 0, 
		padding: 5, 
		border: {
			color: { r: 0, g: 0, b: 0 }, 
			width: 0, 
			style: 'solid'
		}
	}, 
	text: {
		color: { r: 0, g: 0, b: 0 }, 
		font: 'Georgia, serif', 
		size: 15
	}, 
	inputs: {
		color: { r: 0, g: 0, b: 0 }, 
		backgroundColor: { r: 230, g: 230, b: 230 }, 
		border: {
			color: { r: 50, g: 50, b: 50 }, 
			width: 2, 
			radius: 3, 
			style: 'solid'
		}, 
		width: 100, 
		height: 26, 
		font: 'serif', 
		size: 14
	}, 
	radios: {
		width: 16, 
		height: 18, 
		backgroundColor: { r: 255, g: 255, b: 255 }, 
		selectColor: { r: 190, g: 190, b: 190 }
	}, 
	border: {
		color: { r: 0, g: 0, b: 0 }, 
		width: 0, 
		style: 'solid'
	}, 
	button: {
		width: 120, 
		height: 35, 
		backgroundColor: { r: 240, g: 240, b: 240 }, 
		color: { r: 0, g: 0, b: 0 }, 
		font: 'Gerogia, serif', 
		size: 16, 
		weight: 'bold', 
		top: 20, 
		borderRadius: 2, 
	}, 
	footer: {
		backgroundColor: { r: 0, g: 0, b: 0 }, 
		color: { r: 255, g: 255, b: 255 }, 
		height: 30, 
		font: 'Verdana', 
		size: 15
	}, 
	create: {
		header: {
			text: 'Game Creation Options'
		}, 
		button: {
			text: 'Create'
		}, 
		options: [ 'Game Title', 'Password', 'World Width', 'World Height', 'World Color', 'Player Cap', 'Leaderboard Length', 'Game Mode' ], 
		values: [ 'text', 'text', 'number', 'number', 'list', 'number', 'number', 'Coming Soon' ], 
		units: [ undefined, undefined, 'px', 'px', undefined, undefined, undefined, undefined, undefined ], 
		editNums: function() {
			// World Width
			let worldWidthInput = document.getElementById('World Width Input');
			worldWidthInput.placeholder = WORLDWIDTH;
			worldWidthInput.min = 200;
			worldWidthInput.addEventListener('change', function() {
				if (parseFloat(worldWidthInput.value) < worldWidthInput.min) {
					worldWidthInput.value = worldWidthInput.min;
				}
				document.getElementById('World Height Input').value = worldWidthInput.value;
			});
			// World Height
			let worldHeightInput = document.getElementById('World Height Input');
			worldHeightInput.placeholder = WORLDWIDTH;
			worldHeightInput.min = 200;
			worldHeightInput.addEventListener('change', function() {
				if (parseFloat(worldHeightInput.value) < worldHeightInput.min) {
					worldHeightInput.value = worldHeightInput.min;
				}
				document.getElementById('World Width Input').value = worldHeightInput.value;
			});
			// Player Cap
			let playerCapInput = document.getElementById('Player Cap Input');
			playerCapInput.placeholder = PLAYERCAP;
			playerCapInput.min = 2;
			playerCapInput.addEventListener('change', function() {
				if (parseFloat(playerCapInput.value) < playerCapInput.min) {
					playerCapInput.value = playerCapInput.min;
				}
			})
			// Leaderboard Length
			let boardLengthInput = document.getElementById('Leaderboard Length Input');
			boardLengthInput.placeholder = BOARDLENGTH;
			boardLengthInput.min = 1;
			boardLengthInput.max = 20;
			boardLengthInput.addEventListener('change', function() {
				if (parseFloat(boardLengthInput.value) < boardLengthInput.min) {
					boardLengthInput.value = boardLengthInput.min;
				} else if (parseFloat(boardLengthInput.value) > boardLengthInput.max) {
					boardLengthInput.value = boardLengthInput.max;
				}
				if (parseFloat(boardLengthInput.value) % 1 != 0) { // If length is not an integer
					boardLengthInput.value = floor(boardLengthInput.value);
				}
			});
		}, 
		editLists: function() {
			// World Color
			let worldColorInput = document.getElementById('World Color Input');
			blackOption = document.createElement('option');
			worldColorInput.appendChild(blackOption);
			blackOption.value = 'Black';
			blackOption.selected = 'selected';
			blackOption.style.backgroundColor = 'rgb(0, 0, 0)';
			blackOption.style.color = 'rgb(255, 255, 255)';
			blackOption.innerHTML = 'Black';
			whiteOption = document.createElement('option');
			worldColorInput.appendChild(whiteOption);
			whiteOption.value = 'White';
			whiteOption.style.backgroundColor = 'rgb(255, 255, 255)';
			whiteOption.style.color = 'rgb(0, 0, 0)';
			whiteOption.innerHTML = 'White';
		}, 
		submit: function() {
			var ok = true; // Check for inputs' validities
			{ // Game Title
				var title = document.getElementById('Game Title Input').value;
				if (title == '' || title == undefined || title == null) { // If empty
					ok = false;
					alert('Title cannot be left blank');
				} else {
					for (let i = 0; i < games.length; i++) {
						if (title == games[i].info.title) { // Find matching title to another game
							ok = false;
							alert('Title matches that of another game');
							break;
						}
					}
				}
			}
			{ // Width and Height
				let worldWidthInput = document.getElementById('World Width Input');
				var width = worldWidthInput.value;
				if (width == '' || width == undefined || width == null) {
					width = WORLDWIDTH;
				}
				let worldHeightInput = document.getElementById('World Height Input');
				var height = worldHeightInput.value;
				if (height == '' || height == undefined || height == null) {
					height = WORLDWIDTH;
				}
				if (parseFloat(width) < worldWidthInput.min || parseFloat(height) < worldHeightInput.min) {
					ok = false;
					alert('Square dimensions must be at least 200 x 200 px');
				}
				if (parseFloat(width) != parseFloat(height)) {
					ok = false;
					alert('Dimensions must be square');
				}
			}
			{ // Player Cap
				let playerCapInput = document.getElementById('Player Cap Input');
				var cap = playerCapInput.value;
				if (cap == '' || cap == undefined || cap == null) {
					cap = PLAYERCAP;
				} else if (parseFloat(cap) < playerCapInput.min) {
					ok = false;
					alert('Player cap must be at least ' + playerCapInput.min);
				}
				if (width / parseFloat(cap) > 200) {
					let capConfirm = confirm('A width:player-cap ratio greater than 200:1 is not recommended\nClick \'ok\' to confirm your choice or \'cancel\' to go back');
					if (capConfirm != true) {
						ok = false;
					}
				}
			}
			{ // Leaderboard Length
				let boardLengthInput = document.getElementById('Leaderboard Length Input');
				var show = boardLengthInput.value;
				if (show == '' || show == undefined || show == null) {
					show = BOARDLENGTH;
				} else if (parseFloat(show) < boardLengthInput.min) {
					ok = false;
					alert('Leaderboard length must be at least ' + boardLengthInput.min);
				} else if (parseFloat(show) > boardLengthInput.max) {
					ok = false;
					alert('Leaderboard length can be at most ' + boardLengthInput.max);
				} else if (parseFloat(show) % 1 != 0) {
					ok = false;
					alert('Leaderboard length must be a whole number');
				}
			}
			if (ok == true) {
				createGame({
					title: title, 
					password: document.getElementById('Password Input').value, 
					width: width, 
					height: height, 
					color: document.getElementById('World Color Input').value, 
					cap: cap, 
					show: show
				});
			}
		}
	}, 
	join: {
		header: {
			text: 'Join Game Options'
		}, 
		button: {
			text: 'Join'
		}, 
		options: [ 'Screen Name', 'Password', 'Color', 'Grid Texture', '1st Ability', '2nd Ability', '3rd Ability', 'Team'], 
		values:  [ 'text',        'text',     'list',  '1 radio',      '2 radio',     '2 radio',     '2 radio',     'Coming Soon' ], 
		units: [  ], 
		editTexts: function() {
			// Password
			let passwordInput = document.getElementById('Password Input');
			socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
			passwordInput.addEventListener('change', function() {
				socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
			});
		}, 
		editLists: function() {
			// Color
			let colorInput = document.getElementById('Color Input');
			var colorNames = [];
			var options = [];
			for (let j in orgColors[game.world.color]) {
				let option = document.createElement('option');
				colorInput.appendChild(option);
				option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
				option.style.color = 'rgb(0, 0, 0)';
				option.innerHTML = j[0].toUpperCase() + j.slice(1);
			}
		}, 
		editRadios: function() {
			// Ability Selection
			for (let i = 0; i < 3; i++) {
				let ordinal;
				if (i == 0) {
					ordinal = '1st';
				} else if (i == 1) {
					ordinal = '2nd';
				} else if (i == 2) {
					ordinal = '3rd';
				}
				for (let j = 0; j < 2; j++) {
					let abilityInput = document.getElementById(ordinal + ' Ability Input ' + j);
					var cell = abilityInput.parentNode;
					for (let k in ability) {
						if (ability[k] != undefined) {
							if (ability[k].i == i && ability[k].j == j) {
								let name = document.createElement('p');
								name.innerHTML = k[0].toUpperCase() + k.slice(1);
								name.style.display = 'inline';
								name.style.margin = '0px';
								name.style.fontFamily = menus.text.font;
								name.style.fontSize = menus.text.size - 2 + 'px';
								name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
								cell.insertBefore(name, cell.getElementsByTagName('div')[2 * j + 1]); // Insert name before the div line break
							}
						}
					}
				}
			}
		}, 
		submit: function() {
			var ok = true; // Check for inputs' validities
			{ // Screen Name
				var name = document.getElementById('Screen Name Input').value;
				if (name == '' || name == undefined || name == null) {
					ok = false;
					alert('Screen name cannot be left empty');
				}
				for (let i = 0; i < game.info.count; i++) { // Requires game to be updated (in renderMenu(datA))
					if (name == game.board.list[i].name) { // Name cannot match another player's name
						ok = false;
						alert('Name matches that of another player');
						break;
					}
				}
			}
			{ // Color
				var color = document.getElementById('Color Input').value;
				if (color == '' || color == undefined || color == null) {
					ok = false;
					alert('Color cannot be left empty');
				}
			}
			{ // Abilities
				var extend = document.getElementById('1st Ability Input 0');
				var compress = document.getElementById('1st Ability Input 1');
				var immortality = document.getElementById('2nd Ability Input 0');
				var freeze = document.getElementById('2nd Ability Input 1');
				var neutralize = document.getElementById('3rd Ability Input 0');
				var toxin = document.getElementById('3rd Ability Input 1');
				if (extend.value == false && compress.value == false || immortality.value == false && freeze.value == false || neutralize.value == false && toxin.value == false) { // If both false
					ok = false;
					alert('Please select three abilities');
				} else if (extend.value == true && compress.value == true || immortality.value == true && freeze.value == true || neutralize.value == true && toxin.value == true) { // If both true
					ok = false;
					alert('Only one ability of a type can be selected');
				}
			}
			{ // Player Cap
				if (game.players.length >= game.info.cap) {
					ok = false;
					alert('Game is at maximum player capacity');
				}
			}
			{ // Game Closed
				let closed = true;
				for (let i = 0; i < games.length; i++) {
					if (games[i].info.host == game.info.host) {
						closed = false;
						break;
					}
				}
				if (closed == true) {
					ok = false;
					alert('The game has closed');
					renderBrowser();
				}
			}
			{ // Password
				socket.emit('Check Permission', { title: game.info.title, type: 'join' });
				socket.on('Permission Denied', deniedJoin);
				socket.on('Permission Granted', grantedJoin);
				function deniedJoin(datA) {
					if (datA.type == 'join') { // 'type' is necessary so won't run spectate code when joining game
						ok = false;
						let password = document.getElementById('Password Input').value;
						if (password == '' || typeof password != 'string') {
							alert('A password is required for this game');
						} else {
							alert('Password is invalid');
						}
					}
					socket.removeListener('Permission Denied', deniedJoin);
				}
				function grantedJoin(datA) {
					if (datA.type == 'join') { // 'type' is necessary so won't run spectate code when joining game
						if (ok == true) { // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
							// Leaderboard
							game.board.list.push({
								player: socket.id, 
								name: name, 
								kills: 0, 
								deaths: 0
							});
							orderBoard(game.board.list);
							socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
							// Abilities
							if (extend.value == true) {
								ability.extend.activated = true;
								ability.extend.can = true;
								ability.compress.activated = false;
								ability.compress.can = false;
							} else if (compress.value == true) {
								ability.compress.activated = true;
								ability.compress.can = true;
								ability.extend.activated = false;
								ability.extend.can = false;
							}
							if (immortality.value == true) {
								ability.immortality.activated = true;
								ability.immortality.can = true;
								ability.freeze.activated = false;
								ability.freeze.can = false;
							} else if (freeze.value == true) {
								ability.freeze.activated = true;
								ability.freeze.can = true;
								ability.immortality.activated = false;
								ability.immortality.can = false;
							}
							if (neutralize.value == true) {
								ability.neutralize.activated = true;
								ability.neutralize.can = true;
								ability.toxin.activated = false;
								ability.toxin.can = false;
							} else if (toxin.value == true) {
								ability.toxin.activated = true;
								ability.toxin.can = true;
								ability.neutralize.activated = false;
								ability.neutralize.can = false;
							}
							// Grid Texture
							let gridded = document.getElementById('Grid Texture Input 0').value;
							// Initialize
							initialize(game, { spectate: false, color: orgColors[game.world.color][color[0].toLowerCase() + color.slice(1)], gridded: gridded });
						}
					}
					socket.removeListener('Permission Granted', grantedJoin);
				}
			}
		}
	}, 
	spectate: {
		header: {
			text: 'Spectate Game Options'
		}, 
		button: {
			text: 'Spectate'
		}, 
		options: [ 'Screen Name', 'Password' ], 
		values:  [ 'text',        'text'     ], 
		units: [ undefined, undefined ], 
		editTexts: function() {
			// Password
			let passwordInput = document.getElementById('Password Input');
			passwordConfirmed = undefined; // Run password check code once outside of event listener in case player never triggers event so password is never checked
			socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
			passwordInput.addEventListener('change', function() {
				passwordConfirmed = undefined;
				socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
			});
		}, 
		submit: function() {
			var ok = true;
			{ // Screen Name
				var name = document.getElementById('Screen Name Input').value;
				if (name == '' || name == undefined || name == null) {
					ok = false;
					alert('Screen name cannot be left empty');
				}
				for (let i = 0; i < game.info.count; i++) { // Requires game to be updated (in renderMenu(datA))
					if (name == game.board.list[i].name) { // Name cannot match another player's name
						ok = false;
						alert('Name matches that of another player');
						break;
					}
				}
			}
			{ // Password
				socket.emit('Check Permission', { title: game.info.title, type: 'spectate' });
				socket.on('Permission Denied', deniedSpectate);
				socket.on('Permission Granted', grantedSpectate);
				function deniedSpectate(datA) {
					if (datA.type == 'spectate') { // 'type' is necessary so won't run join code when spectating game
						ok = false;
						let password = document.getElementById('Password Input').value;
						if (password == '' || typeof password != 'string') {
							alert('A password is required for this game');
						} else {
							alert('Password is invalid');
						}
					}
					socket.removeListener('Permission Denied', deniedSpectate);
				}
				function grantedSpectate(datA) {
					if (datA.type == 'spectate') { // 'type' is necessary so won't run join code when spectating game
						if (ok == true) { // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
							// Leaderboard
							game.board.list.push({ // Add player to leaderboard
								player: socket.id, 
								name: name, 
								kills: 0, 
								deaths: 0
							});
							orderBoard(game.board.list);
							socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
							// Initialize
							initialize(game, { spectate: true, color: undefined, gridded: undefined });
						}
					}
					socket.removeListener('Permission Granted', grantedSpectate);
				}
			}
		}
	}, 
	respawn: {
		header: {
			text: 'Respawn Options'
		}, 
		button: {
			text: 'Respawn'
		}, 
		options: [ 'Color', 'Grid Texture', '1st Ability', '2nd Ability', '3rd Ability', 'Team' ], 
		values:  [ 'list',  '1 radio',      '2 radio',     '2 radio',     '2 radio',     'Coming Soon' ], 
		units: [  ], 
		editLists: function() {
			// Color
			let colorInput = document.getElementById('Color Input');
			var colorNames = [];
			var options = [];
			for (let j in orgColors[game.world.color]) {
				let option = document.createElement('option');
				colorInput.appendChild(option);
				option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
				option.style.color = 'rgb(0, 0, 0)';
				option.innerHTML = j[0].toUpperCase() + j.slice(1);
				if (org.color != undefined) {
					if (orgColors[game.world.color][j].r == org.color.r && orgColors[game.world.color][j].g == org.color.g && orgColors[game.world.color][j].b == org.color.b) { // If is current org color
						option.selected = 'selected'; // Pre-Select current org color
					}
				}
			}
		}, 
		editRadios: function() {
			// Grid Texture
			let griddedInput = document.getElementById('Grid Texture Input 0');
			if (org.gridded == true) {
				griddedInput.value = true;
				griddedInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
			} else if (org.gridded == false) {
				griddedInput.value = false;
				griddedInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
			}
			// Ability Selection
			for (let i = 0; i < 3; i++) {
				let ordinal;
				if (i == 0) {
					ordinal = '1st';
				} else if (i == 1) {
					ordinal = '2nd';
				} else if (i == 2) {
					ordinal = '3rd';
				}
				for (let j = 0; j < 2; j++) {
					let abilityInput = document.getElementById(ordinal + ' Ability Input ' + j);
					var cell = abilityInput.parentNode;
					for (let k in ability) {
						if (ability[k] != undefined) {
							if (ability[k].i == i && ability[k].j == j) {
								let name = document.createElement('p');
								name.innerHTML = k[0].toUpperCase() + k.slice(1);
								name.style.display = 'inline';
								name.style.margin = '0px';
								name.style.fontFamily = menus.text.font;
								name.style.fontSize = menus.text.size - 2 + 'px';
								name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
								cell.insertBefore(name, cell.getElementsByTagName('div')[2 * j + 1]); // Insert name before the div line break
								if (ability[k].activated == true) { // Load previous ability configuration to default
									abilityInput.value = true;
									abilityInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
								} else if (ability[k].activated == false) {
									abilityInput.value = false;
									abilityInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
								}
							}
						}
					}
				}
			}
		}, 
		submit: function() {
			var ok = true;
			{ // Abilities
				var extend = document.getElementById('1st Ability Input 0');
				var compress = document.getElementById('1st Ability Input 1');
				var immortality = document.getElementById('2nd Ability Input 0');
				var freeze = document.getElementById('2nd Ability Input 1');
				var neutralize = document.getElementById('3rd Ability Input 0');
				var toxin = document.getElementById('3rd Ability Input 1');
				if (extend.value == false && compress.value == false || immortality.value == false && freeze.value == false || neutralize.value == false && toxin.value == false) { // If both false
					ok = false;
					alert('Please select three abilities');
				} else if (extend.value == true && compress.value == true || immortality.value == true && freeze.value == true || neutralize.value == true && toxin.value == true) { // If both true
					ok = false;
					alert('Only one ability of a type can be selected');
				}
			}
			if (ok == true) {
				socket.emit('Spectator Spawned', game);
				// Color
				let color = document.getElementById('Color Input').value;
				// Abilities
				if (extend.value == true) {
					ability.extend.activated = true;
					ability.extend.can = true;
					ability.compress.activated = false;
					ability.compress.can = false;
				} else if (compress.value == true) {
					ability.compress.activated = true;
					ability.compress.can = true;
					ability.extend.activated = false;
					ability.extend.can = false;
				}
				if (immortality.value == true) {
					ability.immortality.activated = true;
					ability.immortality.can = true;
					ability.freeze.activated = false;
					ability.freeze.can = false;
				} else if (freeze.value == true) {
					ability.freeze.activated = true;
					ability.freeze.can = true;
					ability.immortality.activated = false;
					ability.immortality.can = false;
				}
				if (neutralize.value == true) {
					ability.neutralize.activated = true;
					ability.neutralize.can = true;
					ability.toxin.activated = false;
					ability.toxin.can = false;
				} else if (toxin.value == true) {
					ability.toxin.activated = true;
					ability.toxin.can = true;
					ability.neutralize.activated = false;
					ability.neutralize.can = false;
				}
				// Grid Texture
				let gridded = document.getElementById('Grid Texture Input 0').value;
				// Initialize
				initialize(game, { spectate: false, color: orgColors[game.world.color][color[0].toLowerCase() + color.slice(1)], gridded: gridded });
			}
		}
	}, 
	pauseGame: {
		header: {
			text: 'Pause Options'
		}, 
		button: {
			text: 'Return'
		}, 
		options: [ 'Color', 'Grid Texture', 'Name Labels', 'Leave Game' ], 
		values:  [ 'list',  '1 radio',      '1 radio'    , 'button'     ], 
		units: [  ], 
		editLists: function() {
			{ // Color
				let colorInput = document.getElementById('Color Input');
				var colorNames = [];
				var options = [];
				for (let j in orgColors[game.world.color]) {
					let option = document.createElement('option');
					colorInput.appendChild(option);
					option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
					option.style.color = 'rgb(0, 0, 0)';
					option.innerHTML = j[0].toUpperCase() + j.slice(1);
					if (org.color != undefined) {
						if (orgColors[game.world.color][j].r == org.color.r && orgColors[game.world.color][j].g == org.color.g && orgColors[game.world.color][j].b == org.color.b) { // If is current org color
							option.selected = 'selected'; // Pre-Select current org color
						}
					}
				}
			}
		}, 
		editRadios: function() {
			{ // Grid Texture
				let griddedInput = document.getElementById('Grid Texture Input 0');
				if (org.gridded == true) {
					griddedInput.value = true;
					griddedInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
				} else if (org.gridded == false) {
					griddedInput.value = false;
					griddedInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
				}
			}
			{ // Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				if (LABELS == true) {
					labelsInput.value = true;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
				} else if (LABELS == false) {
					labelsInput.value = false;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
				}
			}
		}, 
		editButtons: function() {
			let buttonInput = document.getElementById('Leave Game Input');
			buttonInput.addEventListener('click', function() {
				socket.emit('Leave Game', game);
				clearInterval(org.interval); // Copied from gameOver()
				for (let i in ability) { // Reset Ability Cooldowns
					if (ability[i].i != undefined) { // If is a usable ability
						clearTimeout(ability[i].timeout);
						ability[i].value = false;
						ability[i].can = true;
						ability[i].cooling = false;
						ability[i].start = undefined;
						ability[i].end = undefined;
					}
				}
				for (let i = 0; i < 3; i++) { // Reset shoots
					clearTimeout(ability.shoot.timeout[i]);
					ability.shoot.value[i] = false;
					ability.shoot.can[i] = true;
					ability.shoot.spore[i] = undefined;
					ability.shoot.secrete[i] = {};
					ability.shoot.start[i] = undefined;
					ability.shoot.end[i] = undefined;
				}
				for (let i = 0; i < game.board.list.length; i++) {
					if (game.board.list[i].player == socket.id) { // Find player in leaderboard
						game.board.list.splice(i, 1); // Remove player from leaderboard
						orderBoard(game.board.list); // Sort the list
						socket.emit('Board', game.board); // Send updated board to server
						break;
					}
				}
				org = undefined;
				renderBrowser();
			});
		}, 
		submit: function() {
			var ok = true;
			if (ok == true) {
				// Color
				let colorInput = document.getElementById('Color Input');
				org.color = orgColors[game.world.color][colorInput.value[0].toLowerCase() + colorInput.value.slice(1)];
				// Grid Texture
				let griddedInput = document.getElementById('Grid Texture Input 0');
				org.gridded = griddedInput.value;
				// Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				LABELS = labelsInput.value;
				// Initialize
				var page = document.body.parentNode; // Clear Body
				page.removeChild(document.body);
				body = document.createElement('body');
				page.appendChild(body);
				body.style.overflow = 'hidden'; // Apply Canvas Styling
				body.style.margin = '0px';
				body.style.border = '0px';
				body.style.padding = '0px';
				cnv = createCanvas(window.innerWidth, window.innerHeight); // Create Canvas
				canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
				canvas.style.visibility = 'visible';
				body.appendChild(canvas);
				center = {
					x: width / 2, 
					y: height / 2
				};
				rectMode(CENTER);
				ellipseMode(RADIUS);
				angleMode(DEGREES);
				textAlign(LEFT);
				let skip = false;
				for (let i = 0; i < game.players.length; i++) {
					if (game.players[i] == socket.id) { // If still is a player
						state = 'game';
						skip = true;
						break;
					}
				}
				if (skip == false) {
					for (let i = 0; i < game.spectators.length; i++) {
						if (game.spectators[i] == socket.id) {
							state = 'spectate';
							break;
						}
					}
				}
			}
		}
	}, 
	pauseSpectate: {
		header: {
			text: 'Pause Options'
		}, 
		button: {
			text: 'Return'
		}, 
		options: [ 'Name Labels', 'Leave Game' ], 
		values:  [ '1 radio'    , 'button'     ], 
		units: [  ], 
		editRadios: function() {
			{ // Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				if (LABELS == true) {
					labelsInput.value = true;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
				} else if (LABELS == false) {
					labelsInput.value = false;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
				}
			}
		}, 
		editButtons: function() {
			let buttonInput = document.getElementById('Leave Game Input');
			buttonInput.addEventListener('click', function() {
				socket.emit('Leave Game', game);
				clearInterval(org.interval); // Copied from gameOver() (Ability resets not necessary for spectate leave)
				for (let i = 0; i < game.board.list.length; i++) {
					if (game.board.list[i].player == socket.id) { // Find player in leaderboard
						game.board.list.splice(i, 1); // Remove player from leaderboard
						orderBoard(game.board.list); // Sort the list
						socket.emit('Board', game.board); // Send updated board to server
						break;
					}
				}
				org = undefined;
				renderBrowser();
			});
		}, 
		submit: function() {
			var ok = true;
			if (ok == true) {
				// Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				LABELS = labelsInput.value;
				// Initialize
				var page = document.body.parentNode; // Clear Body
				page.removeChild(document.body);
				body = document.createElement('body');
				page.appendChild(body);
				body.style.overflow = 'hidden'; // Apply Canvas Styling
				body.style.margin = '0px';
				body.style.border = '0px';
				body.style.padding = '0px';
				cnv = createCanvas(window.innerWidth, window.innerHeight); // Create Canvas
				canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
				canvas.style.visibility = 'visible';
				body.appendChild(canvas);
				center = {
					x: width / 2, 
					y: height / 2
				};
				rectMode(CENTER);
				ellipseMode(RADIUS);
				angleMode(DEGREES);
				textAlign(LEFT);
				state = 'spectate';
			}
		}
	}
};

function renderMenu(typE, datA) {
	var type = typE;
	if (type == 'join' || type == 'spectate' || type == 'respawn') {
		game = datA;
	}
	// Clear Body
	var page = document.body.parentNode;
	page.removeChild(document.body);
	page.addEventListener('mouseup', function() {
		button.down = false;
	});
	var body = document.createElement('body');
	page.appendChild(body);
	{
		state = type + 'Menu';
		var header = document.createElement('div');
		body.appendChild(header);
		header.id = type + 'Header';
		header.style.height = menus.header.height + 'px';
		header.style.width = '100%';
		header.style.paddingTop = menus.header.padding + 'px';
		header.style.paddingBottom = menus.header.padding + 'px';
		header.style.backgroundColor = 'rgb(' + menus.header.backgroundColor.r + ', ' + menus.header.backgroundColor.g + ', ' + menus.header.backgroundColor.b + ')';
		var headerText = document.createElement('h2');
		header.appendChild(headerText);
		headerText.style.margin = '0px';
		headerText.style.position = 'relative';
		headerText.style.top = (menus.header.height - menus.header.padding - menus.header.size * 3 / 4) / 2 + 'px';
		headerText.style.color = 'rgb(' + menus.header.color.r + ', ' + menus.header.color.g + ', ' + menus.header.color.b + ')';
		headerText.style.fontFamily = menus.header.font;
		headerText.style.fontSize = menus.header.size + 'px';
		headerText.style.textAlign = 'center';
		headerText.style.fontWeight = menus.header.weight;
		headerText.innerHTML = menus[type].header.text;
		var content = document.createElement('div');
		body.appendChild(content);
		content.style.paddingBottom = menus.footer.height + 'px';
		content.style.overflow = 'auto';
		var table = document.createElement('table');
		content.appendChild(table);
		table.id = type + 'Table';
		table.style.width = '100%';
		table.style.margin ='0px';
		table.style.marginTop = menus.top + 'px';
		table.style.padding = menus.padding + 'px';
		table.style.backgroundColor = 'rgb(' + menus.color.r + ', ' + menus.color.g + ', ' + menus.color.b + ')';
		table.style.borderCollapse = 'collapse';
		table.style.borderColor = 'rgb(' + menus.border.color.r + ', ' + menus.border.color.g + ', ' + menus.border.color.b + ')';
		table.style.borderWidth = menus.border.width + 'px';
		table.style.borderStyle = menus.border.style;
		var tableBody = document.createElement('tbody');
		table.appendChild(tableBody);
		for (let i = 0; i < menus[type].options.length; i++) {
			let row = tableBody.insertRow(-1);
			row.row = i;
			row.style.height = menus.rows.height + 'px';
			row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
			if (i % 2 == 0) {
				row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
			}
			row.style.fontFamily = menus.text.font;
			row.style.fontSize = menus.text.size + 'pt';
			row.style.width = 'inherit';
			row.style.margin = menus.rows.margin + 'px';
			row.style.padding = menus.rows.padding + 'px';
			for (let j = 0; j < menus.cells.count; j++) {
				let cell = row.insertCell(j);
				cell.style.margin = menus.cells.margin + 'px';
				cell.style.padding = menus.cells.padding + 'px';
				cell.style.width = menus.width / 2 + 'px';
				cell.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
				cell.style.borderWidth = menus.cells.border.width + 'px';
				cell.style.borderStyle = menus.cells.border.style;
				if (j == 0) {
					cell.style.textAlign = 'right';
					if (menus[type].values[i].indexOf(' ') == 0) { // If ' ' is first character (Empty space for entire value)
						cell.style.fontWeight = 'bold';
					}
					cell.innerHTML = menus[type].options[i];
				} else if (j == 1) {
					cell.style.textAlign = 'left';
					if (menus[type].values[i] == 'text') {
						let textInput = document.createElement('input');
						cell.appendChild(textInput);
						textInput.id = menus[type].options[i] + ' Input';
						textInput.style.width = menus.inputs.width + 'px';
						textInput.style.height = menus.inputs.height + 'px';
						textInput.type = 'text';
						textInput.value = '';
						textInput.style.autocomplete = 'on';
						textInput.style.boxSizing = 'border-box';
						textInput.style.textAlign = 'center';
						textInput.style.fontFamily = menus.inputs.font;
						textInput.style.fontSize = menus.inputs.size + 'px';
						textInput.style.outline = 'none';
						textInput.style.backgroundColor = 'rgb(255, 255, 255)';
						textInput.style.borderWidth = '0px';
						textInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
						textInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
						textInput.style.borderRadius = menus.inputs.border.radius + 'px';
						textInput.addEventListener('focus', function() {
							textInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
						});
						textInput.addEventListener('focusout', function() {
							textInput.style.backgroundColor = 'rgb(255, 255, 255)';
						});
					} else if (menus[type].values[i] == 'number') {
						let numInput = document.createElement('input');
						cell.appendChild(numInput);
						numInput.id = menus[type].options[i] + ' Input';
						numInput.style.width = menus.inputs.width + 'px';
						numInput.style.height = menus.inputs.height + 'px';
						numInput.type = 'number';
						numInput.value = '';
						numInput.style.autocomplete = 'on';
						numInput.style.boxSizing = 'border-box';
						numInput.style.textAlign = 'center';
						numInput.style.fontFamily = menus.inputs.font;
						numInput.style.fontSize = menus.inputs.size + 'px';
						numInput.style.outline = 'none';
						numInput.style.backgroundColor = 'rgb(255, 255, 255)';
						numInput.style.borderWidth = '0px';
						numInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
						numInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
						numInput.style.borderRadius = menus.inputs.border.radius + 'px';
						numInput.addEventListener('focus', function() {
							numInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
						});
						numInput.addEventListener('focusout', function() {
							numInput.style.backgroundColor = 'rgb(255, 255, 255)';
						});
					} else if (menus[type].values[i] == 'list') {
						let listInput = document.createElement('select');
						cell.appendChild(listInput);
						listInput.id = menus[type].options[i] + ' Input';
						listInput.style.width = menus.inputs.width + 'px';
						listInput.style.height = menus.inputs.height + 'px';
						listInput.style.outline = 'none';
						listInput.style.borderWidth = '0px';
						listInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
						listInput.style.borderStyle = menus.inputs.border.style;
						listInput.style.borderColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
						listInput.style.borderRadius = menus.inputs.border.radius + 'px';
						listInput.style.fontFamily = menus.inputs.font;
						listInput.style.fontSize = menus.inputs.size + 'px';
					} else if (menus[type].values[i].indexOf('radio') != -1) { // If 'radio' is anywhere within string
						// let radioDiv = document.createElement('div');
						// cell.appendChild(radioDiv);
						// radioDiv.style.display = 'block';
						// radioDiv.style.position = 'relative';
						// radioDiv.style.right = '0px';
						for (let k = 0; k < parseInt(menus[type].values[i]); k++) { // Creates integer of radio inputs as specified in value string
							let radioInput = document.createElement('div');
							cell.appendChild(radioInput);
							radioInput.id = menus[type].options[i] + ' Input ' + k;
							radioInput.type = 'radio';
							radioInput.order = k;
							radioInput.value = false;
							radioInput.style.display = 'inline-block';
							radioInput.style.boxSizing = 'border-box';
							radioInput.style.position = 'relative';
							radioInput.style.top = '4px';
							radioInput.style.margin = '0px 5px 0px 5px';
							radioInput.style.width = menus.radios.width + 'px';
							radioInput.style.height = menus.radios.height + 'px';
							radioInput.style.outline = 'none';
							radioInput.style.borderWidth = '0px';
							radioInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
							radioInput.style.borderStyle = menus.inputs.border.style;
							radioInput.style.borderColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
							radioInput.style.borderRadius = menus.inputs.border.radius + 'px';
							radioInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
							radioInput.addEventListener('click', function() {
								radioInput.value = !radioInput.value;
								if (radioInput.value == false) {
									radioInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
								} else if (radioInput.value == true) {
									radioInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
								}
								for (let l = 0; l < parseInt(menus[type].values[i]); l++) {
									if (l == radioInput.order) {
										continue;
									}
									let other = document.getElementById(menus[type].options[i] + ' Input ' + l);
									other.value = false;
									other.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
								}
							});
							let lineBreak = document.createElement('div');
							cell.appendChild(lineBreak);
							lineBreak.style.display = 'block';
							if (k + 1 < parseInt(menus[type].values[i])) { // All but last
								lineBreak.style.height = '2px';
							} else { // Last
								lineBreak.style.height = '6px';
							}
						}
					} else if (menus[type].values[i] == 'button') {
						let buttonInput = document.createElement('button');
						cell.appendChild(buttonInput);
						buttonInput.type = 'button';
						buttonInput.id = menus[type].options[i] + ' Input';
						buttonInput.style.position = 'relative';
						buttonInput.style.top = '2px';
						buttonInput.style.width = 45 + 'px';
						buttonInput.style.height = (menus.radios.height + 4) + 'px';
						buttonInput.style.outline = 'none';
						buttonInput.style.padding = '0px';
						buttonInput.style.boxSizing = 'border-box';
						buttonInput.style.borderWidth = '0px';
						buttonInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
						buttonInput.style.borderStyle = menus.inputs.border.style;
						buttonInput.style.borderColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
						buttonInput.style.borderRadius = menus.inputs.border.radius + 'px';
						buttonInput.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
						buttonInput.addEventListener('mouseover', function() {
							if (buttonInput.down != true) {
								buttonInput.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
							} else {
								buttonInput.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
							}
						});
						buttonInput.addEventListener('mouseout', function() {
							buttonInput.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
						});
						buttonInput.addEventListener('mousedown', function() {
							buttonInput.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
							buttonInput.down = true;
						});
						buttonInput.addEventListener('mouseup', function() {
							buttonInput.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
							buttonInput.down = false;
						});
					} else {
						cell.style.fontFamily = menus.text.font;
						cell.style.fontSize = menus.text.size + 'px';
						cell.innerHTML = menus[type].values[i];
					}
					if (menus[type].units[i] != undefined) {
						let unitText = document.createElement('span');
						cell.appendChild(unitText);
						unitText.innerHTML = ' ' + menus[type].units[i];
					}
				}
			}
		}
		if (typeof menus[type].editTexts == 'function') {
			menus[type].editTexts(datA);
		}
		if (typeof menus[type].editNums == 'function') {
			menus[type].editNums(datA);
		}
		if (typeof menus[type].editLists == 'function') {
			menus[type].editLists(datA);
		}
		if (typeof menus[type].editRadios == 'function') {
			menus[type].editRadios(datA);
		}
		if (typeof menus[type].editButtons == 'function') {
			menus[type].editButtons(datA);
		}
		var button = document.createElement('button');
		content.appendChild(button);
		button.id = type + 'Button';
		button.type = 'button';
		button.style.width = menus.button.width + 'px';
		button.style.height = menus.button.height + 'px';
		button.style.position = 'relative';
		button.style.left = (window.innerWidth - menus.button.width) / 2 + 'px';
		button.style.marginTop = menus.button.top + 'px';
		button.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
		button.style.borderRadius = menus.button.borderRadius + 'px';
		button.style.display = 'block';
		button.style.border = 'none';
		button.style.outline = 'none';
		button.addEventListener('mouseover', function() {
			if (button.down != true) {
				button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
			} else {
				button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
			}
		});
		button.addEventListener('mouseout', function() {
			button.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
		});
		button.addEventListener('mousedown', function() {
			button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
			button.down = true;
		});
		button.addEventListener('mouseup', function() {
			button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
			button.down = false;
		});
		button.addEventListener('click', function() {
			menus[type].submit(datA);
		});
		var buttonText = document.createElement('p');
		button.appendChild(buttonText);
		buttonText.style.margin = '0px';
		buttonText.style.padding = '0px';
		buttonText.style.color = 'rgb(' + menus.button.color.r + ', ' + menus.button.color.g + ', ' + menus.button.color.b + ')';
		buttonText.style.fontFamily = menus.button.font;
		buttonText.style.fontWeight = menus.button.weight;
		buttonText.style.fontSize = menus.button.size + 'px';
		buttonText.style.textAlign = 'center';
		buttonText.innerHTML = menus[type].button.text;
	}
	var footerDiv = document.createElement('div');
	body.appendChild(footerDiv);
	footerDiv.id = 'footerDiv';
	footerDiv.style.position = 'absolute';
	var footer = document.createElement('footer');
	footerDiv.appendChild(footer);
	footer.id = 'footer';
	footer.style.position = 'fixed';
	footer.style.bottom = '0px';
	footer.style.width = '100%';
	footer.style.height = menus.footer.height + 'px';
	footer.style.backgroundColor = 'rgb(' + menus.footer.backgroundColor.r + ', ' + menus.footer.backgroundColor.g + ', ' + menus.footer.backgroundColor.b + ')';
	var back = document.createElement('p');
	footer.appendChild(back);
	back.style.position = 'relative';
	back.style.top = '50%';
	back.style.transform = 'translateY(-50%)';
	back.style.margin = '0px';
	back.style.marginLeft = '10px';
	back.style.color = 'rgb(' + menus.footer.color.r + ', ' + menus.footer.color.g + ', ' + menus.footer.color.b + ')';
	back.style.fontFamily = menus.footer.font;
	back.style.fontSize = menus.footer.size + 'px';
	back.style.cursor = 'pointer';
	back.innerHTML = '&larr; Back';
	back.addEventListener('click', function() {
		if (type == 'create' || type == 'spectate') {
			renderBrowser();
		} else if (type == 'join') {
			if (game.info.host == socket.id) { // If player is host (If player is joining directly after creating the game)
				socket.emit('Game Ended', game);
			}
			renderBrowser();
		} else if (type == 'respawn') {
			initialize(game, { spectate: true, color: undefined, gridded: undefined });
		} else if (type == 'pauseGame') {
			menus.pauseGame.submit();
		} else if (type == 'pauseSpectate') {
			menus.pauseSpectate.submit();
		}
	});
};