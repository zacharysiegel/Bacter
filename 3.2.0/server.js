/*
NPM Version: 5.6.0
	Update npm code: <npm install npm@latest -g>
Node.js Version: 9.4.0
*/

/* 
socket.emit('ID', data) // Emit to specific client
socket.broadcast.emit('ID', data); // Emit to all other clients
io.sockets.emit('ID', data); // Emit to all clients
socket.to('ROOM').emit('ID', data); // Emit to all clients in a room except sender
io.in('ROOM').emit('ID', data); // Emit to all clients in a room (including sender)
socket.to('SOCKET.ID').emit('ID', data); // Emit to only specific client

socket.on('ID', function(parameter) {});

io.sockets.sockets returns an array of the socket objects of all connected clients
io.engine.clients returns an array of the socket.id strings of all connected clients
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

// Game Config Data (Must be exactly as found in config.js)
const teamColors = [
	'red', 
	'blue', 
	'green', 
	'pink'
];

// Start
var connections = 0;
io.sockets.on('connection', newConnection);
var games = [];
var passwords = [
	// {
	// 	title: (title of game), 
	// 	pass: (password)
	// 	permissed: [] (array of socket.id's allowed into the game)
	// }
];
var intervals = [];

console.log('Running...');
console.log('');

//////////////////////////////////////////////////////////////

// New Connection
function newConnection(socket) {
	// Connect
		// players: [], 
		// info: {}, 
		// world: {},  
		// orgs: []
	// }
	connections++;
	console.log('Client connected: ' + socket.id + '    (' + connections + ')'); // Server Message

	socket.join('Lobby'); // Join 'Lobby' Room
	socket.emit('Games', { games: games, connections: connections }); // Copied from 'Games Request'

	// Disconnect
	socket.on('disconnect', function() {
		connections--;
		console.log('Client disconnected: ' + socket.id + ' (' + connections + ')'); // Server Message

		// End Hosted Game
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == socket.id) { // If player is host
				io.to(games[i].info.title).emit('Game Ended', games[i]); // Remove Players From Hosted Game
				for (let j = 0; j < games[i].players.length; j++) {
					for (let k = 0; k < io.sockets.sockets.length; k++) {
						if (games[i].players[j] == io.sockets.sockets[k].id) {
							io.sockets.sockets[k].leave(games[i].info.title);
						}
					}
				}
				for (let j = 0; j < games[i].spectators.length; j++) {
					for (let k = 0; k < io.sockets.sockets.length; k++) {
						if (games[i].spectators[j] == io.sockets.sockets[k].id) {
							io.sockets.sockets[k].leave(games[i].info.title);
						}
					}
				}
				console.log('                                               Game Deleted: ' + games[i].info.title + ' (' + games[i].info.host + ')'); // Before game deletion so game info can be attained before it is deleted
				for (let j = 0; j < passwords.length; j++) {
					if (passwords[j].title == games[i].info.title) {
						passwords.splice(j, 1);
						j--; // Unnecessary when break proceeds
						break;
					}
				}
				games.splice(i, 1); // Delete Game
				clearInterval(intervals[i]); // Clear Game Interval
				intervals.splice(i, 1);
				i--;
				break; // Break can be removed to remove multiple games if player is host of multiple games by some bug
			} else { // If player is not host
				for (let j = 0; j < games[i].board.list.length; j++) { // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
					if (games[i].board.list[j].player == socket.id) { // Find player in leaderboard
						games[i].board.list.splice(j, 1); // Remove player from leaderboard
						j--;
						break;
					}
				}
				for (let j = 0; j < games[i].players.length; j++) { // Search Players
					if (games[i].players[j] == socket.id) { // Find Player
						socket.leave(games[i].info.title); // Leave 'Game' Room
						if (games[i].teams.length != 0) { // If is a team game
							let team = games[i].teams[teamColors.indexOf(games[i].orgs[j].team)]; // Identify player's team
							team.splice(team.indexOf(socket.id), 1); // Remove player from team
						}
						games[i].players.splice(j, 1); // Remove Player
						games[i].orgs.splice(j, 1); // Remove Player Org
						games[i].abilities.splice(j, 1); // Remove Player Abilities
						games[i].info.count = games[i].orgs.length;
						j--;
						console.log('                                               Player Left: ' + games[i].info.title + ' (' + socket.id + ')');
						break;
					}
				}
				for (let j = 0; j < games[i].spectators.length; j++) { // Search Spectators
					if (games[i].spectators[j] == socket.id) { // Find Spectator
						socket.leave(games[i].info.title);
						games[i].spectators.splice(j, 1);
						j--;
						console.log('                                               Spectator Left: ' + games[i].info.title + ' (' + socket.id + ')');
						break;
					}
				}
			}
		}
	});

	// Games Update Request
	socket.on('Games Request', function() {
		socket.emit('Games', { games: games, connections: connections });
	});

	// Leave Game
	socket.on('Leave Game', function(gamE) {
		if (gamE.info.host == socket.id) { // If player is host
			io.to(gamE.info.title).emit('Game Ended', gamE); // Copied from 'Game Ended'
			for (let i = 0; i < gamE.players.length; i++) { // If player
				for (let j = 0; j < io.sockets.sockets.length; j++) {
					if (gamE.players[i] == io.sockets.sockets[j].id) {
						io.sockets.sockets[j].leave(gamE.info.title); // Leave server room
					}
				}
			}
			for (let i = 0; i < gamE.spectators.length; i++) { // If spectator
				for (let j = 0; j < io.sockets.sockets.length; j++) {
					if (gamE.spectators[i] == io.sockets.sockets[j].id) {
						io.sockets.sockets[j].leave(gamE.info.title); // Leave server room
					}
				}
			}
			for (let i = 0; i < passwords.length; i++) {
				if (passwords[i].title == gamE.info.title) {
					passwords.splice(i, 1); // Remove game from passwords array
					i--;
					break;
				}
			}
			console.log('                                               Game Deleted: ' + gamE.info.title + ' (' + gamE.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
			for (let i = 0; i < games.length; i++) {
				if (games[i].info.host == gamE.info.host) {
					games.splice(i, 1); // Delete Game
					clearInterval(intervals[i]); // Clear Game Interval
					intervals.splice(i, 1); // Remove game interval from intervals array
					i--;
					break;
				}
			}
		} else {
			for (let i = 0; i < games.length; i++) { // Copied from 'disconnect'
				for (let j = 0; j < games[i].board.list.length; j++) { // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
					if (games[i].board.list[j].player == socket.id) { // Find player in leaderboard
						games[i].board.list.splice(j, 1); // Remove player from leaderboard
						j--;
						break;
					}
				}
				for (let j = 0; j < games[i].players.length; j++) { // Search Players
					if (games[i].players[j] == socket.id) { // Find Player
						socket.leave(games[i].info.title); // Leave 'Game' Room
						if (games[i].teams.length != 0) { // If is a team game
							let team = games[i].teams[teamColors.indexOf(games[i].orgs[j].team)]; // Identify player's team
							team.splice(team.indexOf(socket.id), 1); // Remove player from team
						}
						games[i].players.splice(j, 1); // Remove Player
						games[i].orgs.splice(j, 1); // Remove Player Org
						games[i].abilities.splice(j, 1); // Remove Player Abilities
						games[i].info.count = games[i].orgs.length;
						j--;
						console.log('                                               Player Left: ' + games[i].info.title + ' (' + socket.id + ')');
						break;
					}
				}
				for (let j = 0; j < games[i].spectators.length; j++) { // Search Spectators
					if (games[i].spectators[j] == socket.id) { // Find Spectator
						socket.leave(games[i].info.title);
						games[i].spectators.splice(j, 1);
						j--;
						console.log('                                               Spectator Left: ' + games[i].info.title + ' (' + socket.id + ')');
						break;
					}
				}
			}
		}
	});

	// Game Ended
	socket.on('Game Ended', function(gamE) {
		if (gamE.info.host == socket.id) {
			io.to(gamE.info.title).emit('Game Ended', gamE);
			for (let i = 0; i < gamE.players.length; i++) {
				for (let j = 0; j < io.sockets.sockets.length; j++) {
					if (gamE.players[i] == io.sockets.sockets[j].id) {
						io.sockets.sockets[j].leave(gamE.info.title);
					}
				}
			}
			for (let i = 0; i < games[i].spectators.length; i++) {
				for (let j = 0; j < io.sockets.sockets.length; j++) {
					if (gamE.spectators[i] == io.sockets.sockets[j].id) {
						io.sockets.sockets[j].leave(gamE.info.title);
					}
				}
			}
			for (let i = 0; i < passwords.length; i++) {
				if (passwords[i].title == gamE.info.title) {
					passwords.splice(i, 1);
					i--;
					break;
				}
			}
			console.log('                                               Game Deleted: ' + gamE.info.title + ' (' + gamE.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
			for (let i = 0; i < games.length; i++) {
				if (games[i].info.host == gamE.info.host) {
					games.splice(i, 1); // Delete Game
					clearInterval(intervals[i]); // Clear Game Interval
					intervals.splice(i, 1);
					i--;
					break;
				}
			}
		}
	});

	// Create Password
	socket.on('Password Created', function(datA) {
		passwords.push({ pass: datA.pass, title: datA.info.title, permissed: [ socket.id ] });
	});

	// Verify Password on Join or Spectate
	socket.on('Ask Permission', function(datA) {
		for (let i = 0; i < passwords.length; i++) {
			if (datA.info.title == passwords[i].title) {
				if (datA.pass == passwords[i].pass) {
					passwords[i].permissed.push(socket.id);
				}
				break;
			}
		}
	});

	// Check if player is permitted entry into game
	socket.on('Check Permission', function(datA) {
		let granted = false;
		let hasPassword = false;
		for (let i = 0; i < passwords.length; i++) {
			if (passwords[i].title == datA.title) { // Identify game
				hasPassword = true;
				for (let j = 0; j < passwords[i].permissed.length; j++) {
					if (passwords[i].permissed[j] == socket.id) {
						granted = true;
						break;
					}
				}
				break;
			}
		}
		if (hasPassword == false || granted == true) {
			socket.emit('Permission Granted', datA);
		} else if (hasPassword == true && granted == false) {
			socket.emit('Permission Denied', datA);
		}
	});

	// Game Creation
	socket.on('Game Created', function(gamE) {
		games.push(gamE);
		socket.leave('Lobby'); // Leave 'Lobby' Room
		socket.join(gamE.info.title); // Join 'Game' Room
		console.log('                                               Game Created: ' + games[games.length - 1].info.title + ' (' + games[games.length - 1].info.host + ')');
		intervals.push(setInterval(function() { // Send updated game to all players
			for (let i = 0; i < games.length; i++) { // Game interval
				if (games[i].info.host == socket.id) { // Find game of specific host
					games[i].info.count = games[i].players.length; // Calculate and update player count
					io.to(games[i].info.title).emit('Game', games[i]); // Send updated game info to clients in game room
					break;
				}
			}
		}, _rfrequency));
	});

	// Player Joined
	socket.on('Player Joined', function(datA) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == datA.info.host) {
				socket.leave('Lobby'); // Leave 'Lobby' Room
				socket.join(datA.info.title); // Join 'Game' Room
				games[i].players.push(socket.id);
				games[i].orgs.push(datA.org);
				games[i].abilities.push(datA.ability);
				games[i].info.count = games[i].orgs.length;
				socket.emit('Enter');
				console.log('                                               Player Spawned: ' + games[i].info.title + ' (' + socket.id + ')');
				break;
			}
		}
	});

	// Spectator Joined
	socket.on('Spectator Joined', function(gamE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == gamE.info.host) {
				socket.leave('Lobby'); // Leave 'Lobby' Room
				socket.join(gamE.info.title); // Join 'Game' Room
				games[i].spectators.push(socket.id);
				console.log('                                               Spectator Spawned: ' + games[i].info.title + ' (' + socket.id + ')');
				break;
			}
		}
	});

	// Spectator Left
	socket.on('Spectator Left', function(datA) { // datA is game.info
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == datA.host) {
				for (let j = 0; j < games[i].spectators.length; j++) {
					if (games[i].spectators[j] == socket.id) {
						games[i].spectators.splice(j, 1);
						break;
					}
				}
				break;
			}
		}
	});

	// Round End
	socket.on('Round End', function(datA) { // datA is game.info
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == datA.host) { // Identify game
				games[i].rounds.waiting = false;
				games[i].rounds.delayed = true;
				games[i].rounds.delaystart = (new Date()).valueOf();
				break;
			}
		}
		var delay = setTimeout(function() { // End of round delay
			for (let i = 0; i < games.length; i++) {
				if (games[i].info.host == datA.host) {
					games[i].rounds.waiting = true;
					games[i].rounds.delayed = false;
					break;
				}
			}
			io.in(datA.title).emit('Force Spawn');
		}, _delaytime);
		if (datA.mode == 'srv') {
			for (let i = 0; i < shrinkIntervals.length; i++) { // Remove shrink interval
				if (shrinkIntervals[i].host == datA.host) { // Identify shrink interval
					clearInterval(shrinkIntervals[i].interval);
					for (let i = 0; i < games.length; i++) {
						if (games[i].info.host == datA.host) {
							games[i].world.width = shrinkIntervals[i].width; // shrinkIntervals[i].world is preserved from 'Round Delay'
							games[i].world.height = shrinkIntervals[i].height; // Reset world width and height
						}
					}
					shrinkIntervals.splice(i, 1);
					break;
				}
			}
		}
	});

	// Round Delay
	socket.on('Round Delay', function(gamE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == gamE.info.host) { // Identify game
				games[i].rounds.waiting = true;
				games[i].rounds.delayed = true;
				games[i].rounds.delaystart = (new Date()).valueOf();
				break;
			}
		}
		var delay = setTimeout(function() {
			for (let i = 0; i < games.length; i++) {
				if (games[i].info.host == gamE.info.host) { // Identify game
					games[i].rounds.waiting = false; // Start Round
					games[i].rounds.delayed = false;
					if (gamE.info.mode == 'srv') { // If is survival mode
						shrinkIntervals.push({ // Shrink the world
							host: gamE.info.host, 
							width: gamE.world.width, 
							height: gamE.world.height, 
							interval: setInterval(function() {
								for (let i = 0; i < games.length; i++) {
									if (games[i].info.host == gamE.info.host) { // Identify game
										if (games[i].world.width > 200 && games[i].world.height > 200) { // If both dimensions are greater than minimum
											games[i].world.width -= _shrinkrate;
											games[i].world.height -= _shrinkrate;
											games[i].world.x += _shrinkrate / 2; // World shrinks to center
											games[i].world.y += _shrinkrate / 2;
											break;
										}
									}
								}
							}, 40) // Same frequency as game interval
						});
					}
					games[i].rounds.start = (new Date()).valueOf();
					break;
				}
			}
		}, _delaytime);
		var spawndelay = setTimeout(function() { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
			io.in(gamE.info.title).emit('Force Spawn');
		}, _delaytime - 1000);
	});

	// Update Server Rounds
	socket.on('Rounds', function(roundS) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == roundS.host) { // Identify game
				games[i].rounds = roundS;
				break;
			}
		}
	});

	// Update Server Leaderboard
	socket.on('Board', function(boarD) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == boarD.host) { // Find board's game
				games[i].board.list = boarD.list; // Update server leaderboard list
				break;
			}
		}
	});

	// Update Server Org
	socket.on('Org', function(orG) {
		for (let i = 0; i < games.length; i++) {
			for (let j = 0; j < games[i].orgs.length; j++) {
				if (games[i].orgs[j].player == socket.id) {
					games[i].orgs[j] = orG;
					break;
				}
			}
		}
	});

	// Update Server Abilities
	socket.on('Ability', function(abilitY) {
		for (let i = 0; i < games.length; i++) {
			for (let j = 0; j < games[i].info.count; j++) {
				if (games[i].abilities[j].player == socket.id) { // Find ability of socket
					games[i].abilities[j] = abilitY; // Replace ability with received
					break;
				}
			}
		}
	});

	// Update Server World
	socket.on('World', function(worlD) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == worlD.host) { // Identify game
				games[i].world = worlD;
				break;
			}
		}
	});

	// Update Server Teams
	socket.on('Teams', function(datA) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == datA.host) { // Identify game
				games[i].teams = datA.teams;
				break;
			}
		}
	});

	// Update Server Flag
	socket.on('Flag', function(gamE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].info.host == gamE.info.host) {
				games[i].flag = gamE.flag;
				break;
			}
		}
	});

	// Dead
	socket.on('Dead', function(spectatE) {
		for (let i = 0; i < games.length; i++) {
			if (games[i].players.indexOf(socket.id) != -1) {
				for (let j = 0; j < games[i].players.length; j++) { // Remove Player
					if (games[i].players[j] == socket.id) {
						games[i].players.splice(j, 1);
						break;
					}
				}
				for (let j = 0; j < games[i].abilities.length; j++) { // Remove Ability
					if (games[i].abilities[j].player == socket.id) {
						games[i].abilities.splice(j, 1);
						break;
					}
				}
				for (let j = 0; j < games[i].orgs.length; j++) { // Do not use games[i].info.count server-side (orgs.length may change before count changes)
					if (games[i].orgs[j].player == socket.id) {
						games[i].orgs.splice(j, 1); // Remove Org
						games[i].info.count = games[i].orgs.length;
						if (spectatE == true) {
							socket.emit('Spectate'); // Dead player becomes spectator
							console.log('Spectate: ' + socket.id);
						}
						break;
					}
				}
				break;
			}
		}
	});

	{ // Abilities
		socket.on('Tag', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Tag');
			} else {
				socket.to(playeR).emit('Tag');
			}
		});

		socket.on('Extend', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Extend');
			} else {
				socket.to(playeR).emit('Extend');
			}
		});

		socket.on('Compress', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Compress');
			} else {
				socket.to(playeR).emit('Compress');
			}
		});

		// socket.on('Speed', function(playeR) {
		// 	if (playeR == socket.id) {
		// 		socket.emit('Speed');
		// 	} else {
		// 		socket.to(playeR).emit('Speed');
		// 	}
		// });

		// socket.on('Slow', function(playeR) {
		// 	if (playeR == socket.id) {
		// 		socket.emit('Slow');
		// 	} else {
		// 		socket.to(playeR).emit('Slow');
		// 	}
		// });

		socket.on('Immortality', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Immortality');
			} else {
				socket.to(playeR).emit('Immortality');
			}
		});

		socket.on('Freeze', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Freeze');
			} else {
				socket.to(playeR).emit('Freeze');
			}
		});

		// socket.on('Stimulate', function(playeR) {
		// 	if (playeR == socket.id) {
		// 		socket.emit('Stimulate');
		// 	} else {
		// 		socket.to(playeR).emit('Stimulate');
		// 	}
		// });

		// socket.on('Poison', function(playeR) {
		// 	if (playeR == socket.id) {
		// 		socket.emit('Poison');
		// 	} else {
		// 		socket.to(playeR).emit('Poison');
		// 	}
		// });

		socket.on('Neutralize', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Neutralize');
			} else {
				socket.to(playeR).emit('Neutralize');
			}
		});

		socket.on('Toxin', function(playeR) {
			if (playeR == socket.id) {
				socket.emit('Toxin');
			} else {
				socket.to(playeR).emit('Toxin');
			}
		});
	}
}

// Game Data
const _delaytime = 10000;
const _shrinkrate = .2;
const _rfrequency = 40;
var shrinkIntervals = [];