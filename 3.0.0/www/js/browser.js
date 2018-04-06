var connections;
var games;
var gamesInterval;
var clicked = {
	row: undefined, 
	cell: undefined
};
function renderBrowser(datA) {
	state = 'browser';
	// Browser
	if (datA != 'games') {
		let page = document.body.parentNode;
		page.removeChild(document.body);
		let body = document.createElement('body');
		page.appendChild(body);
		let bodyDiv = document.createElement('div');
		body.appendChild(bodyDiv);
		bodyDiv.class = 'body';
		let content = document.createElement('div');
		bodyDiv.appendChild(content);
		content.class = 'content';
		let table = document.createElement('table');
		content.appendChild(table);
		table.id = 'browser';
		let Thead = document.createElement('thead');
		table.appendChild(Thead);
		let headRow = document.createElement('tr');
		Thead.appendChild(headRow);
		headRow.id = 'head';
		let title = document.createElement('th');
		headRow.appendChild(title);
		title.colSpan = '1';
		title.id = 'Title';
		title.maxWidth = '500px';
		title.innerHTML = 'Title';
		let host = document.createElement('th');
		headRow.appendChild(host);
		host.colSpan = '1';
		host.id = 'host';
		host.innerHTML = 'Host';
		// let leader = document.createElement('th');
		// headRow.appendChild(leader);
		// leader.colSpan = '1';
		// leader.id = 'leader';
		// leader.innerHTML = 'Leader';
		let mode = document.createElement('th');
		headRow.appendChild(mode);
		mode.colSpan = '1';
		mode.id = 'mode';
		mode.innerHTML = 'Mode';
		let players = document.createElement('th');
		headRow.appendChild(players);
		players.colSpan = '1';
		players.id = 'players';
		players.innerHTML = 'Players';
		let spectators = document.createElement('th');
		headRow.appendChild(spectators);
		spectators.colSpan = '1';
		spectators.id = 'spectators';
		spectators.innerHTML = 'Spectators';
		let playercap = document.createElement('th');
		headRow.appendChild(playercap);
		playercap.colSpan = '1';
		playercap.id = 'playercap';
		playercap.innerHTML = 'Player Cap';
		let hostAGame = document.createElement('th');
		headRow.appendChild(hostAGame);
		hostAGame.colSpan = '2';
		hostAGame.id = 'join-spectate';
		hostAGame.addEventListener('mouseover', function() {
			hostAGame.style.backgroundColor = 'rgb(48, 48, 48)';
		});
		hostAGame.addEventListener('mouseout', function() {
			hostAGame.style.backgroundColor = 'rgb(0, 0, 0)';
		});
		hostAGame.innerHTML = 'Host a Game';
		let Tbody = document.createElement('tbody');
		table.appendChild(Tbody);
		Tbody.id = 'browserBody';
		let footerDiv = document.createElement('div');
		bodyDiv.appendChild(footerDiv);
		footerDiv.class = 'footer';
		let footer = document.createElement('footer');
		footerDiv.appendChild(footer);
		let displayConnections = document.createElement('p');
		footer.appendChild(displayConnections);
		displayConnections.id = 'displayConnections';
		displayConnections.innerHTML = 'Online Clients: ' + connections;
		hostAGame.style.cursor = 'pointer';
		let baseColor = hostAGame.style.backgroundColor;
		hostAGame.addEventListener('mouseover', function() {
			if (window.mouseIsPressed == true && clicked.row == -1 && clicked.cell == 5) {
				hostAGame.style.backgroundColor = 'rgb(70, 70, 70)';
			}
		});
		hostAGame.addEventListener('mousedown', function() {
			clicked.row = -1;
			clicked.cell = 5;
			hostAGame.style.backgroundColor = 'rgb(70, 70, 70)';
		});
		hostAGame.addEventListener('mouseup', function() { hostAGame.style.backgroundColor = baseColor; });
		hostAGame.addEventListener('mouseleave', function() { hostAGame.style.backgroundColor = baseColor; });
		hostAGame.addEventListener('click', function() {
			renderMenu('create');
		});
	}
	let displayConnections = document.getElementById('displayConnections');
	if (connections == undefined) {
		connections = 0; // Set connections as zero before retrieved from server so doesn't display 'undefined' clients
	}
	displayConnections.innerHTML = 'Online Clients: ' + connections;
	// Discrepancies between games and browser listings
	Tbody = document.getElementById('browserBody');
	var discrepancy = false;
	if (games.length != Tbody.childElementCount) { // Discrepancy in game count
		discrepancy = true;
		while (Tbody.childElementCount) {
			Tbody.deleteRow(-1);
		}
	} else {
		for (let i = 0; i < Tbody.childElementCount; i++) {
			let clear = false;
			if (games[i].info.title != Tbody.children[i].firstChild.innerHTML) { // Discrepancy in game title or host
				clear = true;
				break;
			}
			let hosted = false;
			for (let j = 0; j < games[i].board.list.length; j++) {
				if (games[i].board.list[j].player == games[i].info.host) { // Find host in leaderboard
					if (Tbody.children[i].children[1].innerHTML != games[i].board.list[j].name) { // Discrepancy in host name
						clear = true;
					}
					hosted = true;
					break;
				}
			}
			if (hosted == false) { // If host is not in board list, clear
				clear = true;
			}
			if (modes[games[i].info.mode] != Tbody.children[i].children[2].innerHTML) { // Discrepancy in listed leader
				Tbody.children[i].children[2].innerHTML = modes[games[i].info.mode];
			}
			if (games[i].players.length.toString() != Tbody.children[i].children[3].innerHTML) { // Discrepancy in listed player count
				Tbody.children[i].children[3].innerHTML = games[i].players.length;
			}
			if (games[i].spectators.length.toString() != Tbody.children[i].children[4].innerHTML) { // Discrepancy in listed spectator count
				Tbody.children[i].children[4].innerHTML = games[i].spectators.length;
			}
			if (games[i].info.cap.toString() != Tbody.children[i].children[5].innerHTML) { // Discrepancy in listed player cap
				Tbody.children[i].children[5].innerHTML = games[i].info.cap;
			}
			if (clear == true) {
				discrepancy = true;
				while (Tbody.childElementCount) {
					Tbody.deleteRow(-1);
				}
			}
		}
	}
	if (discrepancy == true) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].players.length == 0 && games[i].spectators.length == 0 && games[i].info.count == 0) { // If host has not yet joined the game
				continue;
			}
			let row = Tbody.insertRow(-1);
			row.style.height = '20px';
			let title = row.insertCell(-1);
			title.innerHTML = games[i].info.title;
			title.style.width = '500px';
			let host = row.insertCell(-1);
			for (let j = 0; j < games[i].board.list.length; j++) { // Search board.list
				if (games[i].info.host == games[i].board.list[j].player) { // Find player who is host
					host.innerHTML = games[i].board.list[j].name;
					break;
				}
			}
			host.style.width = '150px';
			host.style.textAlign = 'center';
			// let leader = row.insertCell(-1);
			// leader.innerHTML = games[i].board.list[0].name;
			// leader.style.width = '150px';
			// leader.style.textAlign = 'center';
			let mode = row.insertCell(-1);
			mode.innerHTML = modes[games[i].info.mode];
			mode.style.width = '150px';
			mode.style.textAlign = 'center';
			let players = row.insertCell(-1);
			players.innerHTML = games[i].players.length;
			// players.style.width = '40px';
			players.style.textAlign = 'center';
			let spectators = row.insertCell(-1);
			spectators.innerHTML = games[i].spectators.length;
			// spectators.style.width = '40px';
			spectators.style.textAlign = 'center';
			let playercap = row.insertCell(-1);
			playercap.innerHTML = games[i].info.cap;
			// playercap.style.width = '40px';
			playercap.style.textAlign = 'center';
			let join = row.insertCell(-1);
			join.row = i;
			join.innerHTML = 'Join';
			join.style.minWidth = '150px';
			join.style.textAlign = 'center';
			join.style.cursor = 'pointer';
			let baseColor = join.style.backgroundColor;
			join.addEventListener('mouseover', function() { 
				if (window.mouseIsPressed == true && join.row == clicked.row && join.cellIndex == clicked.cell) {
					join.style.backgroundColor = 'rgb(180, 180, 180)';
				}
			});
			join.addEventListener('mousedown', function() {
				clicked.row = join.row;
				clicked.cell = join.cellIndex;
				join.style.backgroundColor = 'rgb(180, 180, 180)';
			});
			join.addEventListener('mouseup', function() { join.style.backgroundColor = baseColor; });
			join.addEventListener('mouseleave', function() { join.style.backgroundColor = baseColor; });
			join.addEventListener('click', function() {
				renderMenu('join', games[i]);
			});
			let spectate = row.insertCell(-1);
			spectate.row = i;
			spectate.innerHTML = 'Spectate';
			spectate.style.minWidth = '150px';
			spectate.style.textAlign = 'center';
			spectate.style.cursor = 'pointer';
			baseColor = spectate.style.backgroundColor;
			spectate.addEventListener('mouseover', function() {
				if (window.mouseIsPressed == true && spectate.row == clicked.row && spectate.cellIndex == clicked.cell) {
					spectate.style.backgroundColor = 'rgb(180, 180, 180)';
				}
			});
			spectate.addEventListener('mousedown', function() {
				clicked.row = spectate.row;
				clicked.cell = spectate.cellIndex;
				spectate.style.backgroundColor = 'rgb(180, 180, 180)';
			});
			spectate.addEventListener('mouseup', function() { spectate.style.backgroundColor = baseColor; });
			spectate.addEventListener('mouseleave', function() { spectate.style.backgroundColor = baseColor; });
			spectate.addEventListener('click', function() {
				renderMenu('spectate', games[i]);
			});
		}
	}
}