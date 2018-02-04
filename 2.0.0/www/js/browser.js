var connections;
var games;
var clicked = {
	row: undefined, 
	cell: undefined
};
function renderBrowser() {
	// Browser
	// let body = document.getElementsByTagName('body')[0];
	let browserBody = document.getElementById('browserBody');
	for (let i = 0; i < browserBody.children.length; i++) {
		browserBody.deleteRow(-1);
	}
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
		join.row = i;
		join.innerHTML = 'Join';
		join.style.width = '190px';
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
			let passInput = document.getElementById(games[i].info.name + 'passInput');
			socket.emit('Check Password', { pass: passInput.value, info: games[i].info, spectate: false }); // Initialize game as a player
		});
		let spectate = row.insertCell(5);
		spectate.row = i;
		spectate.innerHTML = 'Spectate';
		spectate.style.width = '190px';
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

	// Footer
	let displayConnections = document.getElementById('displayConnections');
	displayConnections.innerHTML = 'Online Clients: ' + connections;
}