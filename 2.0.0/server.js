/*
NPM Version: 5.6.0
	Update npm code: <npm install npm@latest -g>
Node.js Version: 9.4.0
*/

/* 
socket.emit('ID', data) // Emit to specific client
socket.broadcast.emit('ID', data); // Emit to all other clients
io.sockets.emit('ID', data); // Emit to all clients

socket.on('ID', function(parameter) {});
*/

// Express
var port = process.env.PORT || 80;
var express = require('express');
var app = express();
var server = app.listen(port);

// Socket.io
var socketio = require('socket.io');
var io = socketio(server);

// Send Static Data
app.use(express.static('./www'));

// Start
var connections = 0;
io.sockets.on('connection', newConnection);
var games = [
	// {
		// players: [], 
		// info: {}, 
		// world: {},  
		// orgs: []
	// }
];
var passwords = [
	// {
	// 	name: (name of game), 
	// 	pass: (password)
	// }
];
var intervals = [];

console.log('Running...');
console.log('');
console.log('Connections: ' + connections);

//////////////////////////////////////////////////////////////

// New Connection
function newConnection(sockeT) {
	// Connect
	connections++;
	console.log('Client connected: ' + sockeT.id); // Server Message
	console.log('Connections: ' + connections);

	sockeT.join('Lobby'); // Join 'Lobby' Room
	sockeT.emit('Games', games);
	io.sockets.emit('Connections', connections);

	// Disconnect
	sockeT.on('disconnect', function() {
		connections--;
		io.sockets.emit('Connections', connections);
		console.log('Client disconnected: ' + sockeT.id); // Server Message
		console.log('Connections: ' + connections);

		// End Hosted Game
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == sockeT.id) {
				io.to(games[i].info.name).emit('Game Ended', games[i]); // Remove Players From Hosted Game
				console.log('                                               Game Deleted: ' + games[i].info.name + ' (' + games[i].info.host + ')');
				games.splice(i, 1); // Delete Game
				sockeT.broadcast.emit('Games', games); // Update Clients' Games
				clearInterval(intervals[i]); // Clear Game Interval
				intervals.splice(i, 1);
				break;
			}
		}
		// Leave Current Game
		for (let i = 0; i < games.length; i++) {
			for (let j = 0; j < games[i].players.length; j++) { // Search Players
				if (games[i].players[j] == sockeT.id) { // Find Player
					sockeT.leave(games[i].info.name); // Leave 'Game' Room
					games[i].players.splice(j, 1); // Remove Player
					games[i].orgs.splice(j, 1); // Remove Player Org
					games[i].abilities.splice(j, 1); // Remove Player Abilities
					games[i].info.count = games[i].orgs.length;
					io.sockets.emit('Games', games);
					console.log('                                               Player Left: ' + games[i].info.name + ' (' + sockeT.id + ')');
					break;
				}
			}
			for (let j = 0; j < games[i].spectators.length; j++) { // Search Spectators
				if (games[i].spectators[j] == sockeT.id) { // Find Spectator
					sockeT.leave(games[i].info.name);
					games[i].spectators.splice(j, 1);
					io.sockets.emit('Games', games);
					console.log('                                               Spectator Left: ' + games[i].info.name + ' (' + sockeT.id + ')');
					break;
				}
			}
		}
	});

	// Create Password
	sockeT.on('Password Created', function(datA) {
		passwords.push({ pass: datA.pass, name: datA.info.name });
	});

	// Verify Password on Join or Spectate
	sockeT.on('Check Password', function(datA) {
		var confirmed = false;
		var hasPassword = false;
		for (let i = 0; i < passwords.length; i++) {
			if (datA.info.name == passwords[i].name) {
				hasPassword = true;
				if (datA.pass == passwords[i].pass) {
					confirmed = true;
				}
				break;
			}
		}
		if (confirmed == true || hasPassword == false) {
			sockeT.emit('Password Confirmed', datA);
		} else if (confirmed == false && hasPassword == true) {
			sockeT.emit('Password Denied', datA);
		}
	});

	// Game Creation
	sockeT.on('Game Created', function(gamE) {
		games.push(gamE);
		io.sockets.emit('Games', games);
		sockeT.leave('Lobby'); // Leave 'Lobby' Room
		sockeT.join(gamE.info.name); // Join 'Game' Room
		console.log('                                               Game Created: ' + games[games.length - 1].info.name + ' (' + games[games.length - 1].info.host + ')');
		intervals.push(setInterval(function() { // Send updated game to all players 10 times per second
			for (let i = 0; i < games.length; i++) { // Game interval
				if (games[i].info.host == sockeT.id) {
					// games[i].info.count = games[i].players.length; // Calculate and update player count
					io.to(games[i].info.name).emit('Game', gamE); // Send updated game info to clients in game room
					break;
				}
			}
		}, 40));
	});

	// Player Joined
	sockeT.on('Player Joined', function(datA) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == datA.info.host) {
				sockeT.leave('Lobby'); // Leave 'Lobby' Room
				sockeT.join(datA.info.name); // Join 'Game' Room
				games[i].players.push(sockeT.id);
				games[i].orgs.push(datA.org);
				games[i].abilities.push(datA.ability);
				games[i].info.count = games[i].orgs.length;
				io.sockets.emit('Games', games);
				for (let j = 0; j < games[i].players.length; j++) {
					if (games[i].players[j] == sockeT.id) {
						sockeT.emit('Index', { index: j, spawn: true });
						break;
					}
				}
				console.log('                                               Player Joined: ' + games[i].info.name + ' (' + sockeT.id + ')');
				break;
			}
		}
	});

	// Spectator Joined
	sockeT.on('Spectator Joined', function(gamE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == gamE.info.host) {
				sockeT.leave('Lobby'); // Leave 'Lobby' Room
				sockeT.join(gamE.info.name); // Join 'Game' Room
				games[i].spectators.push(sockeT.id);
				io.sockets.emit('Games', games);
				console.log('                                               Spectator Joined: ' + games[i].info.name + ' (' + sockeT.id + ')');
				break;
			}
		}
	});

	// Spectator Left
	sockeT.on('Spectator Spawned', function(gamE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == gamE.info.host) {
				for (let j = 0; j < games[i].spectators.length; j++) {
					if (games[i].spectators[j] == sockeT.id) {
						games[i].spectators.splice(j, 1);
						io.sockets.emit('Games', games);
						break;
					}
				}
				break;
			}
		}
	});

	// Update Server Org
	sockeT.on('Org', function(orG) {
		for (let i = 0; i < games.length; i++) {
			for (let j = 0; j < games[i].orgs.length; j++) {
				if (games[i].orgs[j].player == sockeT.id) {
					games[i].orgs[j] = orG;
					break;
				}
			}
		}
	});

	// Update Server Abilities
	sockeT.on('Ability', function(abilitY) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].players[abilitY.index] == sockeT.id) {
				games[i].abilities[abilitY.index] = abilitY;
				break;
			}
		}
	});

	// World
	sockeT.on('World', function(worlD) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == worlD.host) { // Find game
				games[i].world = worlD;
				break;
			}
		}
	});

	{ // Abilities
		sockeT.on('Extend', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Extend');
			} else {
				sockeT.to(playeR).emit('Extend');
			}
		});

		sockeT.on('Compress', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Compress');
			} else {
				sockeT.to(playeR).emit('Compress');
			}
		});

		// sockeT.on('Speed', function(playeR) {
		// 	if (playeR == sockeT.id) {
		// 		sockeT.emit('Speed');
		// 	} else {
		// 		sockeT.to(playeR).emit('Speed');
		// 	}
		// });

		// sockeT.on('Slow', function(playeR) {
		// 	if (playeR == sockeT.id) {
		// 		sockeT.emit('Slow');
		// 	} else {
		// 		sockeT.to(playeR).emit('Slow');
		// 	}
		// });

		sockeT.on('Immortality', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Immortality');
			} else {
				sockeT.to(playeR).emit('Immortality');
			}
		});

		sockeT.on('Stunt', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Stunt');
			} else {
				sockeT.to(playeR).emit('Stunt');
			}
		});

		// sockeT.on('Stimulate', function(playeR) {
		// 	if (playeR == sockeT.id) {
		// 		sockeT.emit('Stimulate');
		// 	} else {
		// 		sockeT.to(playeR).emit('Stimulate');
		// 	}
		// });

		// sockeT.on('Poison', function(playeR) {
		// 	if (playeR == sockeT.id) {
		// 		sockeT.emit('Poison');
		// 	} else {
		// 		sockeT.to(playeR).emit('Poison');
		// 	}
		// });

		sockeT.on('Neutralize', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Neutralize');
			} else {
				sockeT.to(playeR).emit('Neutralize');
			}
		});

		sockeT.on('Toxin', function(playeR) {
			if (playeR == sockeT.id) {
				sockeT.emit('Toxin');
			} else {
				sockeT.to(playeR).emit('Toxin');
			}
		});
	}

	// Dead
	sockeT.on('Dead', function() {
		for (let i = 0; i < games.length; i++) {
			if (games[i].players.indexOf(sockeT.id) != -1) {
				for (let j = 0; j < games[i].orgs.length; j++) { // Do not use games[i].info.count server-side (orgs.length may change before count changes)
					if (games[i].orgs[j].player == sockeT.id) {
						games[i].orgs.splice(j, 1); // Remove player from game
						games[i].players.splice(j, 1);
						games[i].abilities.splice(j, 1);
						games[i].info.count = games[i].orgs.length;
						sockeT.emit('Spectate'); // Dead player becomes spectator
						for (let k = 0; k < games[i].players.length; k++) {
							sockeT.to(games[i].players[k]).emit('Index', { index: k, spawn: false }); // Emit new indices to all players in game
						}
						break;
					}
				}
				break;
			}
		}
	});
}