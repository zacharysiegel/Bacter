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
		options: [ 'Game Title', 'Password', 'World Type', 'World Width', 'World Height', 'World Color', 'Player Cap', 'Leaderboard Length', 'Game Mode' ], // Team count not included because ffa is default
		values: [ 'text',         'text',    'list',       'number',      'number',       'list',        'number',     'number',             'list'      ], 
		units: [ undefined, undefined, 'px', 'px', undefined, undefined, undefined, undefined, undefined ], 
		editNums: function() {
			{ // World Width
				let worldWidthInput = document.getElementById('World Width Input');
				worldWidthInput.placeholder = WORLDWIDTH;
				worldWidthInput.min = 300;
				worldWidthInput.addEventListener('change', function() {
					if (parseFloat(worldWidthInput.value) < worldWidthInput.min) {
						worldWidthInput.value = worldWidthInput.min;
					}
				});
			}
			{ // World Height
				let worldHeightInput = document.getElementById('World Height Input');
				worldHeightInput.placeholder = WORLDHEIGHT;
				worldHeightInput.min = 300;
				worldHeightInput.addEventListener('change', function() {
					if (parseFloat(worldHeightInput.value) < worldHeightInput.min) {
						worldHeightInput.value = worldHeightInput.min;
					}
				});
			}
			{ // Player Cap
				let playerCapInput = document.getElementById('Player Cap Input');
				playerCapInput.placeholder = PLAYERCAP;
				playerCapInput.min = 2;
				playerCapInput.addEventListener('change', function() {
					if (parseFloat(playerCapInput.value) < playerCapInput.min) {
						playerCapInput.value = playerCapInput.min;
					}
				});
			}
			{ // Leaderboard Length
				let boardLengthInput = document.getElementById('Leaderboard Length Input');
				if (boardLengthInput != null) {
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
				}
			}
			{ // Team Count
				let tcInput = document.getElementById('Team Count Input');
				if (tcInput != null) {
					tcInput.placeholder = TEAMCOUNT;
					tcInput.min = 2;
					tcInput.max = teamColors.length; // = 4
					tcInput.addEventListener('change', function() {
						if (parseFloat(tcInput.value) < tcInput.min) {
							tcInput.value = tcInput.min;
						} else if (parseFloat(tcInput.value) > tcInput.max) {
							tcInput.value = tcInput.max;
						}
						if (parseFloat(tcInput.value) % 1 != 0) { // If length is not an integer
							tcInput.value = floor(tcInput.value);
						}
					});
				}
			}
		}, 
		editLists: function() {
			{ // World Type
				let worldTypeInput = document.getElementById('World Type Input');
				let rectOption = document.createElement('option');
				worldTypeInput.appendChild(rectOption);
				rectOption.value = 'Rectangle';
				rectOption.selected = 'selected';
				rectOption.innerHTML = 'Rectangle';
				let ellipseOption = document.createElement('option');
				worldTypeInput.appendChild(ellipseOption);
				ellipseOption.value = 'Ellipse';
				ellipseOption.innerHTML = 'Ellipse';
			}
			{ // World Color
				let worldColorInput = document.getElementById('World Color Input');
				let blackOption = document.createElement('option');
				worldColorInput.appendChild(blackOption);
				blackOption.value = 'Black';
				blackOption.selected = 'selected';
				blackOption.style.backgroundColor = 'rgb(0, 0, 0)';
				blackOption.style.color = 'rgb(255, 255, 255)';
				blackOption.innerHTML = 'Black';
				let whiteOption = document.createElement('option');
				worldColorInput.appendChild(whiteOption);
				whiteOption.value = 'White';
				whiteOption.style.backgroundColor = 'rgb(255, 255, 255)';
				whiteOption.style.color = 'rgb(0, 0, 0)';
				whiteOption.innerHTML = 'White';
			}
			{ // Game Mode
				let modeInput = document.getElementById('Game Mode Input');
				let ffaOption = document.createElement('option');
				ffaOption.value = 'ffa';
				ffaOption.selected = 'selected';
				ffaOption.innerHTML = 'Free for All';
				modeInput.appendChild(ffaOption);
				let skmOption = document.createElement('option');
				skmOption.value = 'skm';
				skmOption.innerHTML = 'Skirmish';
				modeInput.appendChild(skmOption);
				let srvOption = document.createElement('option');
				srvOption.value = 'srv';
				srvOption.innerHTML = 'Survival';
				modeInput.appendChild(srvOption);
				let ctfOption = document.createElement('option');
				ctfOption.value = 'ctf';
				ctfOption.innerHTML = 'Capture the Flag';
				modeInput.appendChild(ctfOption);
				let infOption = document.createElement('option');
				infOption.value = 'inf';
				infOption.innerHTML = 'Infection';
				modeInput.appendChild(infOption);
				let kthOption = document.createElement('option');
				kthOption.value = 'kth';
				kthOption.innerHTML = 'King of the Hill';
				modeInput.appendChild(kthOption);
				modeInput.addEventListener('change', function() {
					if (modeInput.value == 'skm' || modeInput.value == 'ctf') { // If team game
						if (document.getElementById('Leaderboard Length Input') != null) { // If leaderboard length input is present
							let lengthInput = document.getElementById('Leaderboard Length Input'); // Remove Leaderboard Length Option
							let cell = lengthInput.parentNode;
							let row = cell.parentNode;
							row.parentNode.removeChild(row);
							let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
							for (let i = 0; i < rows.length; i++) {
								let row = rows[i];
								row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
								if (i % 2 == 0) {
									row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
								}
							}
						}
						if (document.getElementById('Team Count Input') == null) { // If team count input not present
							let modeInput = document.getElementById('Game Mode Input'); // Create Team Count Option
							let modeCell = modeInput.parentNode;
							let modeRow = modeCell.parentNode;
							let tableBody = modeRow.parentNode;
							let row = document.createElement('tr');
							tableBody.insertBefore(row, modeRow);
							left = document.createElement('td');
							row.appendChild(left);
							left.style.margin = menus.cells.margin + 'px';
							left.style.padding = menus.cells.padding + 'px';
							left.style.width = menus.width / 2 + 'px';
							left.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
							left.style.borderWidth = menus.cells.border.width + 'px';
							left.style.borderStyle = menus.cells.border.style;
							left.style.textAlign = 'right';
							left.innerHTML = 'Team Count';
							right = document.createElement('td');
							row.appendChild(right);
							right.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
							right.style.borderWidth = menus.cells.border.width + 'px';
							right.style.borderStyle = menus.cells.border.style;
							tcInput = document.createElement('input');
							right.appendChild(tcInput);
							tcInput.id =  'Team Count Input';
							tcInput.style.width = menus.inputs.width + 'px';
							tcInput.style.height = menus.inputs.height + 'px';
							tcInput.type = 'number';
							tcInput.value = '';
							tcInput.style.autocomplete = 'on';
							tcInput.style.boxSizing = 'border-box';
							tcInput.style.textAlign = 'center';
							tcInput.style.fontFamily = menus.inputs.font;
							tcInput.style.fontSize = menus.inputs.size + 'px';
							tcInput.style.outline = 'none';
							tcInput.style.backgroundColor = 'rgb(255, 255, 255)';
							tcInput.style.borderWidth = '0px';
							tcInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
							tcInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
							tcInput.style.borderRadius = menus.inputs.border.radius + 'px';
							tcInput.addEventListener('focus', function() {
								tcInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
							});
							tcInput.addEventListener('focusout', function() {
								tcInput.style.backgroundColor = 'rgb(255, 255, 255)';
							});
							menus.create.editNums();
							let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
							for (let i = 0; i < rows.length; i++) {
								let row = rows[i];
								row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
								if (i % 2 == 0) {
									row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
								}
							}
						}
					} else { // If not a team game
						if (document.getElementById('Leaderboard Length Input') == null) { // If leaderboard length input is not present
							let modeCell = modeInput.parentNode; // Create Leaderboard Length Option
							let modeRow = modeCell.parentNode;
							let tableBody = modeRow.parentNode;
							let row = document.createElement('tr');
							tableBody.insertBefore(row, modeRow);
							left = document.createElement('td');
							row.appendChild(left);
							left.style.margin = menus.cells.margin + 'px';
							left.style.padding = menus.cells.padding + 'px';
							left.style.width = menus.width / 2 + 'px';
							left.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
							left.style.borderWidth = menus.cells.border.width + 'px';
							left.style.borderStyle = menus.cells.border.style;
							left.style.textAlign = 'right';
							left.innerHTML = 'Leaderboard Length';
							right = document.createElement('td');
							row.appendChild(right);
							right.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
							right.style.borderWidth = menus.cells.border.width + 'px';
							right.style.borderStyle = menus.cells.border.style;
							lengthInput = document.createElement('input');
							right.appendChild(lengthInput);
							lengthInput.id =  'Leaderboard Length Input';
							lengthInput.style.width = menus.inputs.width + 'px';
							lengthInput.style.height = menus.inputs.height + 'px';
							lengthInput.type = 'number';
							lengthInput.value = '';
							lengthInput.style.autocomplete = 'on';
							lengthInput.style.boxSizing = 'border-box';
							lengthInput.style.textAlign = 'center';
							lengthInput.style.fontFamily = menus.inputs.font;
							lengthInput.style.fontSize = menus.inputs.size + 'px';
							lengthInput.style.outline = 'none';
							lengthInput.style.backgroundColor = 'rgb(255, 255, 255)';
							lengthInput.style.borderWidth = '0px';
							lengthInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
							lengthInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
							lengthInput.style.borderRadius = menus.inputs.border.radius + 'px';
							lengthInput.addEventListener('focus', function() {
								lengthInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
							});
							lengthInput.addEventListener('focusout', function() {
								lengthInput.style.backgroundColor = 'rgb(255, 255, 255)';
							});
							menus.create.editNums();
							let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
							for (let i = 0; i < rows.length; i++) {
								let row = rows[i];
								row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
								if (i % 2 == 0) {
									row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
								}
							}
						}
						if (document.getElementById('Team Count Input') != null) { // If team count input is not present
							let tcInput = document.getElementById('Team Count Input'); // Remove Team Count Option
							let cell = tcInput.parentNode;
							let row = cell.parentNode;
							row.parentNode.removeChild(row);
							let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
							for (let i = 0; i < rows.length; i++) {
								let row = rows[i];
								row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
								if (i % 2 == 0) {
									row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
								}
							}
						}
					}
				});
			}
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
				var width = parseFloat(worldWidthInput.value);
				if (width == '' || width == undefined || width == null || width !== width) { // width !== width tests for NaN
					width = WORLDWIDTH;
				}
				let worldHeightInput = document.getElementById('World Height Input');
				var height = parseFloat(worldHeightInput.value);
				if (height == '' || height == undefined || height == null || height !== height) {
					height = WORLDHEIGHT;
				}
				if (width < worldWidthInput.min || height < worldHeightInput.min) {
					ok = false;
					alert('Square dimensions must be at least 300 x 300 px');
				}
				if (width * height < 90000) { // If area is less than 300x300
					ok = false;
					alert('Area must be greater than 90,000 pixels (300 x 300)');
				}
			}
			{ // Player Cap
				let playerCapInput = document.getElementById('Player Cap Input');
				var cap = parseFloat(playerCapInput.value);
				if (cap == '' || cap == undefined || cap == null || cap !== cap) {
					cap = PLAYERCAP;
				} else if (parseFloat(cap) < playerCapInput.min) {
					ok = false;
					alert('Player cap must be at least ' + playerCapInput.min);
				}
			}
			{ // Leaderboard Length
				let boardLengthInput = document.getElementById('Leaderboard Length Input');
				if (boardLengthInput != null) {
					var show = parseFloat(boardLengthInput.value);
					if (show == '' || show == undefined || show == null || show !== show) {
						show = BOARDLENGTH;
					} else if (show < boardLengthInput.min) {
						ok = false;
						alert('Leaderboard length must be at least ' + boardLengthInput.min);
					} else if (show > boardLengthInput.max) {
						ok = false;
						alert('Leaderboard length can be at most ' + boardLengthInput.max);
					} else if (show % 1 != 0) {
						ok = false;
						alert('Leaderboard length must be a whole number');
					}
				}
			}
			{ // Team Count
				let tcInput = document.getElementById('Team Count Input');
				if (tcInput != null) {
					var teamCount = parseFloat(tcInput.value);
					if (teamCount == '' || teamCount == undefined || teamCount == null || teamCount !== teamCount) {
						teamCount = TEAMCOUNT;
					} else if (teamCount < tcInput.min) {
						ok = false;
						alert('Team count must be at least ' + tcInput.min);
					} else if (teamCount > tcInput.max) {
						ok = false;
						alert('Team count can be at most ' + tcInput.max);
					} else if (teamCount % 1 != 0) {
						ok = false;
						alert('Team count must be a whole number');
					}
				}
			}
			if (ok == true) {
				let password = document.getElementById('Password Input').value;
				let type = document.getElementById('World Type Input').value.toLowerCase();
				let color = document.getElementById('World Color Input').value.toLowerCase();
				let mode = document.getElementById('Game Mode Input').value;
				createGame({
					title: title, 
					password: password, 
					type: type, 
					width: width, 
					height: height, 
					color: color, 
					cap: cap, 
					show: show, 
					mode: mode, 
					teamCount: teamCount
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
		options: [ 'Screen Name', 'Password', 'Color', 'Skin',    '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign' ], 
		values:  [ 'text',        'text',     'list',  '2 radio', '2 radio',     '2 radio',     '2 radio',     'list', '1 radio'     ], 
		units: [  ], 
		editTexts: function() {
			{ // Password
				let passwordInput = document.getElementById('Password Input');
				socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
				passwordInput.addEventListener('change', function() {
					socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
				});
				if (game.info.protected == false || socket.id == game.info.host) { // If game is not password protected or player is host
					let passInput = document.getElementById('Password Input'); // Remove Password Field
					let cell = passInput.parentNode;
					let row = cell.parentNode;
					row.parentNode.removeChild(row);
					let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
					for (let i = 0; i < rows.length; i++) {
						let row = rows[i];
						row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
						if (i % 2 == 0) {
							row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
						}
					}
				}
			}
		}, 
		editLists: function() {
			{ // Color
				let colorInput = document.getElementById('Color Input');
				if (game.info.mode != 'skm' && game.info.mode != 'ctf' && game.info.mode != 'inf') { // If not a team mode + inf
					var colorNames = [];
					var options = [];
					var colorLength = 0;
					for (let i in orgColors[game.world.color]) {
						colorLength++;
					}
					let i = 0;
					for (let j in orgColors[game.world.color]) {
						let option;
						if (colorInput.options.length < colorLength) { // If options not already created
							option = document.createElement('option');
							colorInput.appendChild(option);
						} else { // If options already created
							option = colorInput.options[i];
						}
						option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
						option.style.color = 'rgb(0, 0, 0)';
						option.innerHTML = j[0].toUpperCase() + j.slice(1);
						i++;
					}
				} else {
					if (colorInput != undefined) { // If color input not already removed
						let cell = colorInput.parentNode;
						let row = cell.parentNode;
						row.parentNode.removeChild(row); // Remove color row if is a team mode
						let rows = document.getElementById('Menu Body').children;
						for (let i = 0; i < rows.length; i++) { // Reset row coloration
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					}
				}
			}
			{ // Team
				for (let j = 0; j < games.length; j++) { // Update game (Normally occurs in thesocket.js socket.on('Game')); Used for team option updates
					if (games[j].host == game.host) { // Identify game
						game = games[j];
						break;
					}
				}
				let teamInput = document.getElementById('Team Input');
				if (teamInput != undefined) { // If team option not already removed
					if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team mode
						let cell = teamInput.parentNode;
						let row = cell.parentNode;
						row.parentNode.removeChild(row); // Remove team option
						let rows = document.getElementById('Menu Body').children; // Reset row coloration
						for (let i = 0; i < rows.length; i++) {
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					} else { // If a team mode
						for (let i = 0; i < game.teams.length; i++) {
							let option;
							if (teamInput.options.length < game.teams.length) {
								option = document.createElement('option');
								teamInput.appendChild(option);
							} else {
								option = teamInput.options[i];
							}
							option.value = teamColors[i];
							option.innerHTML = teamColors[i][0].toUpperCase() + teamColors[i].slice(1) + ': ' + game.teams[i].length;
						}
					}
				}
			}
		}, 
		editRadios: function() {
			{ // Skins
				for (let i = 0; i < 2; i++) { // i < number of skin options
					let skinInput = document.getElementById('Skin Input ' + i);
					let cell = skinInput.parentNode;
					let name = document.createElement('p');
					name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
					name.style.display = 'inline';
					name.style.margin = '0px';
					name.style.fontFamily = menus.text.font;
					name.style.fontSize = menus.text.size - 2 + 'px';
					name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
					cell.insertBefore(name, cell.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
				}
			}
			{ // Ability Selection
				if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
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
								if (ability[k] != undefined && k != 'tag') {
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
				} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') { // CTF and INF use 'tag'
					for (let i = 0; i < 3; i++) {
						let ordinal;
						if (i == 0) {
							ordinal = '1st';
						} else if (i == 1) {
							ordinal = '2nd';
						} else if (i == 2) {
							ordinal = '3rd';
						}
						let row = document.getElementById(ordinal + ' Ability Input 0').parentNode.parentNode; // Input is first radio button; Input parent is cell
						row.parentNode.removeChild(row);
						let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
						for (let i = 0; i < rows.length; i++) {
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					}
				}
			}
			{ // Auto Assign
				let autoInput = document.getElementById('Auto Assign Input 0');
				if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team game
					let cell = autoInput.parentNode;
					let row = cell.parentNode;
					row.parentNode.removeChild(row);
					let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
					for (let i = 0; i < rows.length; i++) {
						let row = rows[i];
						row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
						if (i % 2 == 0) {
							row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
						}
					}
				} else { // If a team game
					autoInput.addEventListener('click', function() {
						let teamInput = document.getElementById('Team Input');
						if (autoInput.value == true) {
							teamInput.disabled = true;
						} else {
							teamInput.disabled = false;
						}
					});
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
			{ // Skins
				let skin = 'none';
				let values = [];
				for (let i = 0; i < skins.length; i++) {
					if (document.getElementById('Skin Input ' + i).value == true) {
						for (let j = 0; j < values.length; j++) {
							if (values[j] == true) {
								ok = false;
								alert('Only one skin can be selected');
								break;
							}
						}
						values[i] = true;
					} else {
						values[i] = false;
					}
				}
			}
			{ // Abilities
				if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
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
				} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') {

				}
			}
			{ // Team
				if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
					let auto = document.getElementById('Auto Assign Input 0').value;
					if (auto != true) {
						let team = document.getElementById('Team Input').value.toLowerCase();
						for (let i = 0; i < game.teams.length; i++) {
							if (i == teamColors.indexOf(team)) {
								continue;
							}
							if (game.teams[teamColors.indexOf(team)].length > game.teams[i].length) {
								if (org != undefined && org.team == team && typeof team == 'string') { // If player is already on loaded team
									break; // Allow spawn
								}
								ok = false;
								alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);
								break;
							}
						}
					}
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
								deaths: 0, 
								score: 0
							});
							orderBoard(game.board.list);
							socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
							// Abilities
							if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
								ability.tag.activated = false;
								ability.tag.can = false;
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
								ability.spore.activated = true;
								ability.spore.can = true;
								ability.secrete.activated = true;
								ability.secrete.can = false;
								for (let i = 0; i < ability.shoot.value.length; i++) {
									ability.shoot.can[i] = true;
									ability.shoot.value[i] = false;
								}
							} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') {
								ability.tag.activated = true;
								ability.tag.can = true;
								ability.extend.activated = false;
								ability.extend.can = false;
								ability.compress.activated = false;
								ability.compress.can = false;
								ability.immortality.activated = false;
								ability.immortality.can = false;
								ability.freeze.activated = false;
								ability.freeze.can = false;
								ability.neutralize.activated = false;
								ability.neutralize.can = false;
								ability.toxin.activated = false;
								ability.toxin.can = false;
								ability.spore.activated = false;
								ability.spore.can = false;
								ability.secrete.activated = false;
								ability.secrete.can = false;
								for (let i = 0; i < ability.shoot.value.length; i++) {
									if (i == ability.tag.i) {
										ability.shoot.can[i] = true;
									} else {
										ability.shoot.can[i] = false;
									}
									ability.shoot.value[i] = false;
								}
							}
							// Skin
							let skin = 'none';
							for (let i = 0; i < skins.length; i++) {
								if (document.getElementById('Skin Input ' + i).value == true) {
									skin = skins[i];
								}
							}
							// Team
							if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
								var team;
								var auto = document.getElementById('Auto Assign Input 0').value;
								if (auto != true) { // If auto assign is not selected
									team = document.getElementById('Team Input').value;
								} else { // If auto assign is selected
									let indices = [];
									let min = Infinity;
									for (let i = 0 ; i < game.teams.length; i++) {
										if (game.teams[i].length < min) { // If length is less than minimum
											min = game.teams[i].length; // Set length as new minimum
											indices = [i]; // Clear indices and push i
										} else if (game.teams[i].length == min) {
											indices.push(i);
										}
									}
									team = teamColors[indices[floor(random(0, indices.length))]];
								}
								for (let i = 0; i < teamColors.length; i++) {
									if (team == teamColors[i]) {
										game.teams[i].push(socket.id); // Add player to selected team
										socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
										break;
									}
								}
							}
							// Color
							if (game.info.mode == 'inf') { // If inf mode
								var color = teamColorDef.green; // All players healthy by default
							} else if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If is not a team game
								var color = document.getElementById('Color Input').value.toLowerCase();
							} else {
								var color = teamColorDef[team]; // Color must be after Team
							}
							// Initialize
							initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: skin, team: team });
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
			if (game.info.protected == false || socket.id == game.info.host) { // If game is not password protected or player is host
				let passInput = document.getElementById('Password Input'); // Remove Password Field
				let cell = passInput.parentNode;
				let row = cell.parentNode;
				row.parentNode.removeChild(row);
				let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
				for (let i = 0; i < rows.length; i++) {
					let row = rows[i];
					row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
					if (i % 2 == 0) {
						row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
					}
				}
			}
		}, 
		submit: function() {
			var ok = true;
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
								deaths: 0, 
								wins: 0
							});
							orderBoard(game.board.list);
							socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
							// Initialize
							initialize(game, { spectate: true, color: undefined, skin: undefined });
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
		options: [ 'Color', 'Skin',    '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign' ], 
		values:  [ 'list',  '2 radio', '2 radio',     '2 radio',     '2 radio',     'list', '1 radio'     ], 
		units: [  ], 
		editLists: function() {
			{ // Color
				let colorInput = document.getElementById('Color Input');
				if (game.info.mode != 'skm' && game.info.mode != 'ctf' && game.info.mode != 'inf') { // If not a team mode + inf
					var colorNames = [];
					var options = [];
					var colorLength = 0;
					for (let i in orgColors[game.world.color]) {
						colorLength++;
					}
					let i = 0;
					for (let j in orgColors[game.world.color]) {
						let option;
						if (colorInput.options.length < colorLength) { // If options not already created
							option = document.createElement('option');
							colorInput.appendChild(option);
						} else { // If options already created
							option = colorInput.options[i];
						}
						option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
						option.style.color = 'rgb(0, 0, 0)';
						option.innerHTML = j[0].toUpperCase() + j.slice(1);
						if (org.color != undefined) {
							if (orgColors[game.world.color][j].r == org.color.r && orgColors[game.world.color][j].g == org.color.g && orgColors[game.world.color][j].b == org.color.b) { // If is current org color
								option.selected = 'selected'; // Pre-Select current org color
							}
						}
						i++;
					}
				} else {
					if (colorInput != undefined) { // If color input not already removed
						let cell = colorInput.parentNode;
						let row = cell.parentNode;
						row.parentNode.removeChild(row); // Remove color row if is a team mode
						let rows = document.getElementById('Menu Body').children;
						for (let i = 0; i < rows.length; i++) { // Reset row coloration
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					}
				}
			}
			{ // Team
				for (let j = 0; j < games.length; j++) { // Update game (Normally occurs in thesocket.js socket.on('Game')); Used for team option updates
					if (games[j].host == game.host) { // Identify game
						game = games[j];
						break;
					}
				}
				let teamInput = document.getElementById('Team Input');
				if (teamInput != undefined) { // If team option not already removed
					if (game.info.mode != 'skm' && game.info.mode != 'ctf' && teamInput != undefined) { // If not a team mode
						let cell = teamInput.parentNode;
						let row = cell.parentNode;
						row.parentNode.removeChild(row); // Remove team option
						let rows = document.getElementById('Menu Body').children; // Reset row coloration
						for (let i = 0; i < rows.length; i++) {
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					} else { // If a team mode
						for (let i = 0; i < game.teams.length; i++) {
							let option;
							if (teamInput.options.length < game.teams.length) { // If options not yet created
								option = document.createElement('option');
								teamInput.appendChild(option);
								if (i == teamColors.indexOf(org.team)) {
									option.selected = 'selected';
								}
							} else { // If updating previously created options
								option = teamInput.options[i];
							}
							option.value = teamColors[i];
							option.innerHTML = teamColors[i][0].toUpperCase() + teamColors[i].slice(1) + ': ' + game.teams[i].length;
						}
					}
				}
			}
		}, 
		editRadios: function() {
			{ // Skins
				for (let i = 0; i < skins.length; i++) { // i < number of skin options
					let skinInput = document.getElementById('Skin Input ' + i);
					let cell = skinInput.parentNode;
					let name = document.createElement('p');
					name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
					name.style.display = 'inline';
					name.style.margin = '0px';
					name.style.fontFamily = menus.text.font;
					name.style.fontSize = menus.text.size - 2 + 'px';
					name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
					cell.insertBefore(name, cell.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
					if (org.skin == skins[i]) {
						skinInput.value = true;
						skinInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
					}
				}
			}
			{ // Ability Selection
				if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
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
								if (ability[k] != undefined && k != 'tag') {
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
				} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') { // CTF and INF use 'tag'
					for (let i = 0; i < 3; i++) {
						let ordinal;
						if (i == 0) {
							ordinal = '1st';
						} else if (i == 1) {
							ordinal = '2nd';
						} else if (i == 2) {
							ordinal = '3rd';
						}
						let row = document.getElementById(ordinal + ' Ability Input 0').parentNode.parentNode; // Input is first radio button; Input parent is cell
						row.parentNode.removeChild(row); // Remove ability selections
						let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
						for (let i = 0; i < rows.length; i++) {
							let row = rows[i];
							row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
							if (i % 2 == 0) {
								row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
							}
						}
					}
				}
			}
			{ // Auto Assign
				let autoInput = document.getElementById('Auto Assign Input 0');
				if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team game
					let cell = autoInput.parentNode;
					let row = cell.parentNode;
					row.parentNode.removeChild(row);
					let rows = document.getElementById('Menu Body').children; // Reset Row Coloration
					for (let i = 0; i < rows.length; i++) {
						let row = rows[i];
						row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
						if (i % 2 == 0) {
							row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
						}
					}
				} else { // If a team game
					autoInput.addEventListener('click', function() {
						let teamInput = document.getElementById('Team Input');
						if (autoInput.value == true) {
							teamInput.disabled = true;
						} else {
							teamInput.disabled = false;
						}
					});
				}
			}
		}, 
		submit: function() {
			var ok = true;
			{ // Skins
				let skin = 'none';
				let values = [];
				for (let i = 0; i < skins.length; i++) {
					if (document.getElementById('Skin Input ' + i).value == true) {
						for (let j = 0; j < values.length; j++) {
							if (values[j] == true) {
								ok = false;
								alert('Only one skin can be selected');
								break;
							}
						}
						values[i] = true;
					} else {
						values[i] = false;
					}
				}
			}
			{ // Abilities
				if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
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
				} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') { // CTF and INF use tag

				}
			}
			{ // Team
				if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
					var team;
					var auto = document.getElementById('Auto Assign Input 0').value;
					if (auto != true) { // If auto assign is not selected
						team = document.getElementById('Team Input').value;
						for (let i = 0; i < game.teams.length; i++) {
							if (i == teamColors.indexOf(team)) {
								continue;
							}
							if (game.teams[teamColors.indexOf(team)].length > game.teams[i].length) {
								if (org.team == team && typeof team == 'string') { // If player is already on loaded team
									break; // Allow spawn
								}
								ok = false;
								alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);
								break;
							}
						}
					} else { // If auto assing is selected
						let indices = [];
						let min = Infinity;
						for (let i = 0 ; i < game.teams.length; i++) {
							if (game.teams[i].length < min) { // If length is less than minimum
								min = game.teams[i].length; // Set length as new minimum
								indices = [i]; // Clear indices and push i
							} else if (game.teams[i].length == min) {
								indices.push(i);
							}
						}
						team = teamColors[indices[floor(random(0, indices.length))]];
					}
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
			if (ok == true) {
				socket.emit('Spectator Spawned', game);
				// Abilities
				if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') { // FFA, SKM, SRV, and KTH all use standard ability set
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
					ability.spore.activated = true;
					ability.spore.can = true;
					ability.secrete.activated = true;
					ability.secrete.can = false;
				} else if (game.info.mode == 'ctf' || game.info.mode == 'inf') {
					ability.extend.activated = false;
					ability.extend.can = false;
					ability.compress.activated = false;
					ability.compress.can = false;
					ability.immortality.activated = false;
					ability.immortality.can = false;
					ability.freeze.activated = false;
					ability.freeze.can = false;
					ability.neutralize.activated = false;
					ability.neutralize.can = false;
					ability.toxin.activated = false;
					ability.toxin.can = false;
					ability.spore.activated = false;
					ability.spore.can = false;
					ability.secrete.activated = false;
					ability.secrete.can = false;
				}
				// Skin
				let skin = 'none';
				for (let i = 0; i < skins.length; i++) {
					if (document.getElementById('Skin Input ' + i).value == true) {
						skin = skins[i];
					}
				}
				// Team
				if (game.info.mode == 'skm' || game.info.mode == 'ctf') { // If is a team game
					if (org.team != team) { // Only add player to team if not already on team
						game.teams[teamColors.indexOf(team)].push(socket.id); // Add player to selected team
						game.teams[teamColors.indexOf(org.team)].splice(game.teams[teamColors.indexOf(org.team)].indexOf(socket.id), 1);
						socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
					}
				}
				// Color
				if (game.info.mode == 'inf') { // If inf mode
					var color = teamColorDef.green; // All players healthy by default
				} else if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If is not a team mode	
					var color = document.getElementById('Color Input').value.toLowerCase();
				} else {
					var color = teamColorDef[team]; // Color must be after Team
				}
				// Initialize
				initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: skin, team: team });
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
		options: [ 'Color', 'Skin',    'Name Labels', 'Leave Game' ], 
		values:  [ 'list',  '2 radio', '1 radio'    , 'button'     ], 
		units: [  ], 
		editLists: function() {
			{ // Color
				let colorInput = document.getElementById('Color Input');
				if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team mode
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
				} else {
					let cell = colorInput.parentNode;
					let row = cell.parentNode;
					row.parentNode.removeChild(row); // Remove color row if is a team mode
					let rows = document.getElementById('Menu Body').children;
					for (let i = 0; i < rows.length; i++) { // Reset row coloration
						let row = rows[i];
						row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
						if (i % 2 == 0) {
							row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
						}
					}
				}
			}
		}, 
		editRadios: function() {
			{ // Skins
				for (let i = 0; i < skins.length; i++) { // i < number of skin options
					let skinInput = document.getElementById('Skin Input ' + i);
					let cell = skinInput.parentNode;
					let name = document.createElement('p');
					name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
					name.style.display = 'inline';
					name.style.margin = '0px';
					name.style.fontFamily = menus.text.font;
					name.style.fontSize = menus.text.size - 2 + 'px';
					name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
					cell.insertBefore(name, cell.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
					if (org.skin == skins[i]) {
						skinInput.value = true;
						skinInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
					}
				}
			}
			{ // Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				if (Labels == true) {
					labelsInput.value = true;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
				} else if (Labels == false) {
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
			{ // Skins
				let skin = 'none';
				let values = [];
				for (let i = 0; i < skins.length; i++) {
					if (document.getElementById('Skin Input ' + i).value == true) {
						for (let j = 0; j < values.length; j++) {
							if (values[j] == true) {
								ok = false;
								alert('Only one skin can be selected');
								break;
							}
						}
						values[i] = true;
					} else {
						values[i] = false;
					}
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
			if (ok == true) {
				// Color
				if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If is not a team mode
					var color = document.getElementById('Color Input').value.toLowerCase();
					org.color = orgColors[game.world.color][color];
				} // Cannot change team in pause menu

				// Skin
				let skin = 'none';
				for (let i = 0; i < skins.length; i++) {
					if (document.getElementById('Skin Input ' + i).value == true) {
						skin = skins[i];
					}
				}
				org.skin = skin;
				// Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				Labels = labelsInput.value;
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
				if (Labels == true) {
					labelsInput.value = true;
					labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
				} else if (Labels == false) {
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
			if (ok == true) {
				// Name Labels
				let labelsInput = document.getElementById('Name Labels Input 0');
				Labels = labelsInput.value;
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
		tableBody.id = 'Menu Body';
		tableBody.style.fontFamily = menus.text.font;
		tableBody.style.fontSize = menus.text.size + 'pt';
		table.appendChild(tableBody);
		for (let i = 0; i < menus[type].options.length; i++) {
			let row = tableBody.insertRow(-1);
			row.row = i;
			row.style.height = menus.rows.height + 'px';
			row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
			if (i % 2 == 0) {
				row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
			}
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
						buttonInput.id = menus[type].options[i] + ' Input';
						buttonInput.type = 'button';
						buttonInput.style.cursor = 'pointer';
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
		button.style.cursor = 'pointer';
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