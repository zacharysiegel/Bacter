/**
 * NPM Version: 5.6.0
 *    Update npm code: <npm install npm@latest -g>
 * Node.js Version: 9.4.0
 */

/**
 * socket.emit('ID', data) // Emit to specific client
 * socket.broadcast.emit('ID', data); // Emit to all other clients
 * io.sockets.emit('ID', data); // Emit to all clients
 * socket.to('ROOM').emit('ID', data); // Emit to all clients in a room except sender
 * io.in('ROOM').emit('ID', data); // Emit to all clients in a room (including sender)
 * socket.to('SOCKET.ID').emit('ID', data); // Emit to only specific client
 * socket.on('ID', function(parameter) {});
 * io.sockets.sockets returns an array of the socket objects of all connected clients
 * io.engine.clients returns an array of the socket.id strings of all connected clients
 */

// Express
let port = process.env.PORT || 80; // process.env.PORT is fed by Heroku; 80 is default http port
let express = require('express');
let app = express();
let server = app.listen(port);

// Socket.io
let socketio = require('socket.io');
let io = socketio(server);

// Configurations
let config;
try { // Production code in try
   config = require('../config/config.json');
} catch {
   config = require('../../config/config.json');
}

// Send Static Data
app.use(express.static('./public'));

// Start
let connections = 0;
let games = [];
let passwords = [
   // {
   //    title: (title of game), 
   //    pass: (password)
   //    permissed: [] (array of socket.id's allowed into the game)
   // }
];
let intervals = [];
let shrinkIntervals = [];

console.log('Running...'); // 'Running...' always prints to console
if (config.project_state === 'development') console.log('');

/////////////////////////////////////////////////////////////////////
//////////////////////////    Listeners    //////////////////////////
/////////////////////////////////////////////////////////////////////

// New Connection
io.sockets.on('connection', socket => {
	// Connect
      // players: [], 
      // info: {}, 
      // world: {},  
      // orgs: []
   // }
   connections++;
   if (config.project_state === 'development') console.log('Client connected: ' + socket.id + '    (' + connections + ')'); // Server Message

   socket.join('Lobby'); // Join 'Lobby' Room
   socket.emit('Games', { games: games, connections: connections }); // Copied from 'Games Request'

   // Disconnect
   socket.on('disconnect', () => {
      connections--;
      if (config.project_state === 'development') console.log('Client disconnected: ' + socket.id + ' (' + connections + ')'); // Server Message

      // End Hosted Game
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === socket.id) { // If player is host
            io.to(games[i].info.title).emit('Game Ended', games[i]); // Remove Players From Hosted Game
            for (let j = 0; j < games[i].players.length; j++) {
               for (let k = 0; k < io.sockets.sockets.length; k++) {
                  if (games[i].players[j] === io.sockets.sockets[k].id) {
                     io.sockets.sockets[k].leave(games[i].info.title);
                  }
               }
            }
            for (let j = 0; j < games[i].spectators.length; j++) {
               for (let k = 0; k < io.sockets.sockets.length; k++) {
                  if (games[i].spectators[j] === io.sockets.sockets[k].id) {
                     io.sockets.sockets[k].leave(games[i].info.title);
                  }
               }
            }
            if (config.project_state === 'development') console.log('                                               Game Deleted: ' + games[i].info.title + ' (' + games[i].info.host + ')'); // Before game deletion so game info can be attained before it is deleted
            for (let j = 0; j < passwords.length; j++) {
               if (passwords[j].title === games[i].info.title) {
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
               if (games[i].board.list[j].player === socket.id) { // Find player in leaderboard
                  games[i].board.list.splice(j, 1); // Remove player from leaderboard
                  j--;
                  break;
               }
            }
            for (let j = 0; j < games[i].players.length; j++) { // Search Players
               if (games[i].players[j] === socket.id) { // Find Player
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
                  if (config.project_state === 'development') console.log('                                               Player Left: ' + games[i].info.title + ' (' + socket.id + ')');
                  break;
               }
            }
            for (let j = 0; j < games[i].spectators.length; j++) { // Search Spectators
               if (games[i].spectators[j] === socket.id) { // Find Spectator
                  socket.leave(games[i].info.title);
                  games[i].spectators.splice(j, 1);
                  j--;
                  if (config.project_state === 'development') console.log('                                               Spectator Left: ' + games[i].info.title + ' (' + socket.id + ')');
                  break;
               }
            }
         }
      }
   });

   // Games Update Request
   socket.on('Games Request', () => {
      socket.emit('Games', { games: games, connections: connections });
   });

   // Leave Game
   socket.on('Leave Game', (game) => {
      if (game.info.host === socket.id) { // If player is host
         io.to(game.info.title).emit('Game Ended', game); // Copied from 'Game Ended'
         for (let i = 0; i < game.players.length; i++) { // If player
            for (let j = 0; j < io.sockets.sockets.length; j++) {
               if (game.players[i] === io.sockets.sockets[j].id) {
                  io.sockets.sockets[j].leave(game.info.title); // Leave server room
               }
            }
         }
         for (let i = 0; i < game.spectators.length; i++) { // If spectator
            for (let j = 0; j < io.sockets.sockets.length; j++) {
               if (game.spectators[i] === io.sockets.sockets[j].id) {
                  io.sockets.sockets[j].leave(game.info.title); // Leave server room
               }
            }
         }
         for (let i = 0; i < passwords.length; i++) {
            if (passwords[i].title === game.info.title) {
               passwords.splice(i, 1); // Remove game from passwords array
               i--;
               break;
            }
         }
         if (config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
         for (let i = 0; i < games.length; i++) {
            if (games[i].info.host === game.info.host) {
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
               if (games[i].board.list[j].player === socket.id) { // Find player in leaderboard
                  games[i].board.list.splice(j, 1); // Remove player from leaderboard
                  j--;
                  break;
               }
            }
            for (let j = 0; j < games[i].players.length; j++) { // Search Players
               if (games[i].players[j] === socket.id) { // Find Player
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
                  if (config.project_state === 'development') console.log('                                               Player Left: ' + games[i].info.title + ' (' + socket.id + ')');
                  break;
               }
            }
            for (let j = 0; j < games[i].spectators.length; j++) { // Search Spectators
               if (games[i].spectators[j] === socket.id) { // Find Spectator
                  socket.leave(games[i].info.title);
                  games[i].spectators.splice(j, 1);
                  j--;
                  if (config.project_state === 'development') console.log('                                               Spectator Left: ' + games[i].info.title + ' (' + socket.id + ')');
                  break;
               }
            }
         }
      }
   });

   // Game Ended
   socket.on('Game Ended', (game) => {
      if (game.info.host === socket.id) {
         io.to(game.info.title).emit('Game Ended', game);
         for (let i = 0; i < game.players.length; i++) {
            for (let j = 0; j < io.sockets.sockets.length; j++) {
               if (game.players[i] === io.sockets.sockets[j].id) {
                  io.sockets.sockets[j].leave(game.info.title); // Make all players in 'game' leave the server group
               }
            }
         }
         for (let i = 0; i < games[i].spectators.length; i++) {
            for (let j = 0; j < io.sockets.sockets.length; j++) {
               if (game.spectators[i] === io.sockets.sockets[j].id) {
                  io.sockets.sockets[j].leave(game.info.title); // Make all spectators in 'game' leave the server group
               }
            }
         }
         for (let i = 0; i < passwords.length; i++) {
            if (passwords[i].title === game.info.title) {
               passwords.splice(i, 1);
               i--;
               break;
            }
         }
         if (config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
         for (let i = 0; i < games.length; i++) {
            if (games[i].info.host === game.info.host) {
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
   socket.on('Password Created', (data) => {
      passwords.push({ pass: data.pass, title: data.info.title, permissed: [ socket.id ] });
   });

   // Verify Password on Join or Spectate
   socket.on('Ask Permission', (data) => {
      for (let i = 0; i < passwords.length; i++) {
         if (data.info.title === passwords[i].title) {
            if (data.pass === passwords[i].pass) {
               passwords[i].permissed.push(socket.id);
            }
            break;
         }
      }
   });

   // Check if player is permitted entry into game
   socket.on('Check Permission', (data) => {
      let granted = false;
      let hasPassword = false;
      for (let i = 0; i < passwords.length; i++) {
         if (passwords[i].title === data.title) { // Identify game
            hasPassword = true;
            for (let j = 0; j < passwords[i].permissed.length; j++) {
               if (passwords[i].permissed[j] === socket.id) {
                  granted = true;
                  break;
               }
            }
            break;
         }
      }
      if (hasPassword === false || granted === true) {
         socket.emit('Permission Granted', data);
      } else if (hasPassword === true && granted === false) {
         console.log('denied');
         socket.emit('Permission Denied', data);
      }
   });

   // Game Creation
   socket.on('Game Created', (game) => {
      games.push(game);
      socket.leave('Lobby'); // Leave 'Lobby' Room
      socket.join(game.info.title); // Join 'Game' Room
      if (config.project_state === 'development') console.log('                                               Game Created: ' + games[games.length - 1].info.title + ' (' + games[games.length - 1].info.host + ')');
      intervals.push(setInterval(() => { // Send updated game to all players
         for (let i = 0; i < games.length; i++) { // Game interval
            if (games[i].info.host === socket.id) { // Find game of specific host
               games[i].info.count = games[i].players.length; // Calculate and update player count
               io.to(games[i].info.title).emit('Game', games[i]); // Send updated game info to clients in game room
               break;
            }
         }
      }, config.render_frequency));
   });

   /**
    * Player Joined emit listener
    * @param  data: {
    *            info: game.info,
    *            org: org,
    *            ability: ability
    *         }
    * @return void
    */
   socket.on('Player Joined', (data) => {
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.info.host) {
            socket.leave('Lobby'); // Leave 'Lobby' Room
            socket.join(data.info.title); // Join 'Game' Room
            games[i].players.push(socket.id); // Add player to server's list of players in game
            games[i].orgs.push(data.org); // Create server instance of org
            games[i].abilities.push(data.ability); // Create server instance of ability
            games[i].info.count = games[i].orgs.length;
            socket.emit('Enter');
            if (config.project_state === 'development') console.log('                                               Player Spawned: ' + games[i].info.title + ' (' + socket.id + ')');
            break;
         }
      }
   });

   // Spectator Joined
   socket.on('Spectator Joined', (game) => {
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === game.info.host) {
            socket.leave('Lobby'); // Leave 'Lobby' Room
            socket.join(game.info.title); // Join 'Game' Room
            games[i].spectators.push(socket.id);
            if (config.project_state === 'development') console.log('                                               Spectator Spawned: ' + games[i].info.title + ' (' + socket.id + ')');
            break;
         }
      }
   });

   // Spectator Left
   socket.on('Spectator Left', (data) => { // data is game.info
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.host) {
            for (let j = 0; j < games[i].spectators.length; j++) {
               if (games[i].spectators[j] === socket.id) {
                  games[i].spectators.splice(j, 1);
                  break;
               }
            }
            break;
         }
      }
   });

   /**
    * Round End
    *    Received upon round of survival ending after only one player stands (or zero if multiple die on same tick)
    * @param  {Object} data: game.info
    * @return {void}
    */
   socket.on('Round End', (data) => { // data is game.info
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.host) { // Identify game
            games[i].rounds.waiting = false;
            games[i].rounds.delayed = true;
            games[i].rounds.delaystart = (new Date()).valueOf();
            break;
         }
      }
      let delay = setTimeout(() => { // End of round delay
         for (let i = 0; i < games.length; i++) {
            if (games[i].info.host === data.host) {
               games[i].rounds.waiting = true;
               games[i].rounds.delayed = false;
               break;
            }
         }
         io.in(data.title).emit('Force Spawn');
      }, config.delay_time);
      if (data.mode === 'srv') {
         for (let i = 0; i < shrinkIntervals.length; i++) {
            if (shrinkIntervals[i].host === data.host) { // Identify shrink interval
               clearInterval(shrinkIntervals[i].interval);
               for (let j = 0; j < games.length; j++) {
                  if (games[j].info.host === data.host) {
                     games[j].world.width = shrinkIntervals[i].width; // shrinkIntervals[i].world is preserved from 'Round Delay'
                     games[j].world.height = shrinkIntervals[i].height; // Reset world width and height
                     break;
                  }
               }
               shrinkIntervals.splice(i, 1); // Remove shrink interval
               break;
            }
         }
      }
   });

   // Round Delay
   socket.on('Round Delay', (game) => {
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === game.info.host) { // Identify game
            games[i].rounds.waiting = true;
            games[i].rounds.delayed = true;
            games[i].rounds.delaystart = (new Date()).valueOf();
            break;
         }
      }
      let delay = setTimeout(() => {
         for (let i = 0; i < games.length; i++) {
            if (games[i].info.host === game.info.host) { // Identify game
               games[i].rounds.waiting = false; // Start Round
               games[i].rounds.delayed = false;
               if (game.info.mode === 'srv') { // If is survival mode
                  shrinkIntervals.push({ // Shrink the world
                     host: game.info.host,
                     width: game.world.width, // Preserve initial width of world
                     height: game.world.height, // Preserve initial height of world
                     interval: setInterval(() => {
                        for (let j = 0; j < games.length; j++) {
                           if (games[j].info.host === game.info.host && (games[j].world.width > 200 && games[j].world.height > 200)) { // Identify game; If both dimensions are greater than minimum
                              games[j].world.width -= config.shrink_rate;
                              games[j].world.height -= config.shrink_rate;
                              games[j].world.x += config.shrink_rate / 2; // World shrinks to center
                              games[j].world.y += config.shrink_rate / 2;
                              break;
                           }
                        }
                     }, config.render_frequency) // Same frequency as game interval
                  });
               }
               games[i].rounds.start = (new Date()).valueOf();
               break;
            }
         }
      }, config.delay_time);
      let spawndelay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
         io.in(game.info.title).emit('Force Spawn');
      }, config.delay_time - 1000);
   });

   // Update Server Leaderboard
   socket.on('Board', (data) => { // data: { list: board.list, host: game.board.host }
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.host) { // Find board's game
            games[i].board.list = data.list; // Update server leaderboard list
            break;
         }
      }
   });

   /*
      * Update Server Org
      * @param data: [
      *     org.alive,
      *     org.cells,
      *     org.off,
      *     org.pos,
      *     org.color,
      *     org.skin,
      *     org.team,
      *     org.coefficient,
      *     org.range
      *  ]
   */
   socket.on('Org Update', (data) => { // data is an array in order to decrease json data sent over web socket
      let done = false;
      for (let i = 0; i < games.length; i++) {
         for (let j = 0; j < games[i].orgs.length; j++) {
            if (games[i].orgs[j].player === socket.id) {
               // games[i].orgs[j] = org;
               games[i].orgs[j].alive = data[0]; // Only the following attributes of org need to be updated
               games[i].orgs[j].cells = data[1]; // Latency is decreased by only sending necessary data
               games[i].orgs[j].count = data[1].length;
               games[i].orgs[j].off = data[2];
               games[i].orgs[j].pos = data[3];
               games[i].orgs[j].color = data[4];
               games[i].orgs[j].skin = data[5];
               games[i].orgs[j].team = data[6];
               games[i].orgs[j].coefficient = data[7];
               games[i].orgs[j].range = data[8];
               done = true;
               break;
            }
         }
         if (done) break;
      }
   });

   // Update Server Abilities
   socket.on('Ability', (ability) => {
      let done = false;
      for (let i = 0; i < games.length; i++) {
         for (let j = 0; j < games[i].info.count; j++) {
            if (games[i].abilities[j].player === socket.id) { // Find ability of socket
               games[i].abilities[j] = ability;
               done = true;
               break;
            }
         }
         if (done) break;
      }
   });

   // Update Server-side Game
   socket.on('Game', (data) => { // data: { game: {} } (data object literal exists rather than just 'game' to allow for customization of input beyond 'game')
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.game.host) {
            games[i] = data.game;
            break;
         }
      }
   });

   // Update Server Teams
   socket.on('Teams', (data) => { // data: { teams: game.teams, host: game.info.host }
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === data.host) { // Identify game
            games[i].teams = data.teams; // All data in teams array must be updated
            break;
         }
      }
   });

   /**
    * Update the server's instance of game's flag
    * @param Object data {
    *       flag: game.flag,
    *       host: game.info.host
    *    }
    */
   socket.on('Flag', (game) => {
      for (let i = 0; i < games.length; i++) {
         if (games[i].info.host === game.info.host) {
            games[i].flag = game.flag;
            break;
         }
      }
   });

   // Dead
   socket.on('Dead', (spectating) => {
      for (let i = 0; i < games.length; i++) {
         if (games[i].players.indexOf(socket.id) != -1) {
            for (let j = 0; j < games[i].players.length; j++) { // Remove Player
               if (games[i].players[j] === socket.id) {
                  games[i].players.splice(j, 1);
                  break;
               }
            }
            for (let j = 0; j < games[i].abilities.length; j++) { // Remove Ability
               if (games[i].abilities[j].player === socket.id) {
                  games[i].abilities.splice(j, 1);
                  break;
               }
            }
            for (let j = 0; j < games[i].orgs.length; j++) { // Do not use games[i].info.count server-side (orgs.length may change before count changes)
               if (games[i].orgs[j].player === socket.id) {
                  games[i].orgs.splice(j, 1); // Remove Org
                  games[i].info.count = games[i].orgs.length;
                  if (spectating) {
                     socket.emit('Spectate'); // Dead player becomes spectator
                  }
                  break;
               }
            }
            break;
         }
      }
   });

	// On-Abilities
	socket.on('Tag', function(player) {
      if (player === socket.id) {
         socket.emit('Tag');
      } else {
         socket.to(player).emit('Tag');
      }
   });

   socket.on('Extend', function(player=socket.id) {
      if (player === socket.id) {
         socket.emit('Extend');
      } else {
         socket.to(player).emit('Extend');
      }
   });

   socket.on('Compress', function(player) {
      if (player === socket.id) {
         socket.emit('Compress');
      } else {
         socket.to(player).emit('Compress');
      }
   });

   socket.on('Immortality', function(player=socket.id) {
      if (player === socket.id) {
         socket.emit('Immortality');
      } else {
         socket.to(player).emit('Immortality');
      }
   });

   socket.on('Freeze', function(player) {
      if (player === socket.id) {
         socket.emit('Freeze');
      } else {
         socket.to(player).emit('Freeze');
      }
   });

   socket.on('Neutralize', function(player=socket.id) {
      if (player === socket.id) {
         socket.emit('Neutralize');
      } else {
         socket.to(player).emit('Neutralize');
      }
   });

   socket.on('Toxin', function(player) {
      if (player === socket.id) {
         socket.emit('Toxin');
      } else {
         socket.to(player).emit('Toxin');
      }
   });
   
   // socket.on('Speed', function(player) {
   //    if (player === socket.id) {
   //       socket.emit('Speed');
   //    } else {
   //       socket.to(player).emit('Speed');
   //    }
   // });

   // socket.on('Slow', function(player) {
   //    if (player === socket.id) {
   //       socket.emit('Slow');
   //    } else {
   //       socket.to(player).emit('Slow');
   //    }
   // });
   
   // socket.on('Stimulate', function(player) {
   //    if (player === socket.id) {
   //       socket.emit('Stimulate');
   //    } else {
   //       socket.to(player).emit('Stimulate');
   //    }
   // });

   // socket.on('Poison', function(player) {
   //    if (player === socket.id) {
   //       socket.emit('Poison');
   //    } else {
   //       socket.to(player).emit('Poison');
   //    }
   // });
});
