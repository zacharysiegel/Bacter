"use strict";

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
var port = process.env.PORT || 80; // process.env.PORT is fed by Heroku

var express = require('express');

var app = express();
var server = app.listen(port); // Socket.io

var socketio = require('socket.io');

var io = socketio(server); // Configurations

var config = require('./config.json'); // Send Static Data


app.use(express["static"]('./public')); // Start

var connections = 0;
var games = [];
var passwords = [// {
  //    title: (title of game), 
  //    pass: (password)
  //    permissed: [] (array of socket.id's allowed into the game)
  // }
];
var intervals = [];
var shrinkIntervals = [];
console.log('Running...'); // 'Running...' always prints to console

if (config.project_state === 'development') console.log(''); /////////////////////////////////////////////////////////////////////
//////////////////////////    Listeners    //////////////////////////
/////////////////////////////////////////////////////////////////////
// New Connection

io.sockets.on('connection', function (socket) {
  // Connect
  // players: [], 
  // info: {}, 
  // world: {},  
  // orgs: []
  // }
  connections++;
  if (config.project_state === 'development') console.log('Client connected: ' + socket.id + '    (' + connections + ')'); // Server Message

  socket.join('Lobby'); // Join 'Lobby' Room

  socket.emit('Games', {
    games: games,
    connections: connections
  }); // Copied from 'Games Request'
  // Disconnect

  socket.on('disconnect', function () {
    connections--;
    if (config.project_state === 'development') console.log('Client disconnected: ' + socket.id + ' (' + connections + ')'); // Server Message
    // End Hosted Game

    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == socket.id) {
        // If player is host
        io.to(games[i].info.title).emit('Game Ended', games[i]); // Remove Players From Hosted Game

        for (var j = 0; j < games[i].players.length; j++) {
          for (var k = 0; k < io.sockets.sockets.length; k++) {
            if (games[i].players[j] == io.sockets.sockets[k].id) {
              io.sockets.sockets[k].leave(games[i].info.title);
            }
          }
        }

        for (var _j = 0; _j < games[i].spectators.length; _j++) {
          for (var _k = 0; _k < io.sockets.sockets.length; _k++) {
            if (games[i].spectators[_j] == io.sockets.sockets[_k].id) {
              io.sockets.sockets[_k].leave(games[i].info.title);
            }
          }
        }

        if (config.project_state === 'development') console.log('                                               Game Deleted: ' + games[i].info.title + ' (' + games[i].info.host + ')'); // Before game deletion so game info can be attained before it is deleted

        for (var _j2 = 0; _j2 < passwords.length; _j2++) {
          if (passwords[_j2].title == games[i].info.title) {
            passwords.splice(_j2, 1);
            _j2--; // Unnecessary when break proceeds

            break;
          }
        }

        games.splice(i, 1); // Delete Game

        clearInterval(intervals[i]); // Clear Game Interval

        intervals.splice(i, 1);
        i--;
        break; // Break can be removed to remove multiple games if player is host of multiple games by some bug
      } else {
        // If player is not host
        for (var _j3 = 0; _j3 < games[i].board.list.length; _j3++) {
          // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
          if (games[i].board.list[_j3].player == socket.id) {
            // Find player in leaderboard
            games[i].board.list.splice(_j3, 1); // Remove player from leaderboard

            _j3--;
            break;
          }
        }

        for (var _j4 = 0; _j4 < games[i].players.length; _j4++) {
          // Search Players
          if (games[i].players[_j4] == socket.id) {
            // Find Player
            socket.leave(games[i].info.title); // Leave 'Game' Room

            if (games[i].teams.length != 0) {
              // If is a team game
              var team = games[i].teams[teamColors.indexOf(games[i].orgs[_j4].team)]; // Identify player's team

              team.splice(team.indexOf(socket.id), 1); // Remove player from team
            }

            games[i].players.splice(_j4, 1); // Remove Player

            games[i].orgs.splice(_j4, 1); // Remove Player Org

            games[i].abilities.splice(_j4, 1); // Remove Player Abilities

            games[i].info.count = games[i].orgs.length;
            _j4--;
            if (config.project_state === 'development') console.log('                                               Player Left: ' + games[i].info.title + ' (' + socket.id + ')');
            break;
          }
        }

        for (var _j5 = 0; _j5 < games[i].spectators.length; _j5++) {
          // Search Spectators
          if (games[i].spectators[_j5] == socket.id) {
            // Find Spectator
            socket.leave(games[i].info.title);
            games[i].spectators.splice(_j5, 1);
            _j5--;
            if (config.project_state === 'development') console.log('                                               Spectator Left: ' + games[i].info.title + ' (' + socket.id + ')');
            break;
          }
        }
      }
    }
  }); // Games Update Request

  socket.on('Games Request', function () {
    socket.emit('Games', {
      games: games,
      connections: connections
    });
  }); // Leave Game

  socket.on('Leave Game', function (game) {
    if (game.info.host == socket.id) {
      // If player is host
      io.to(game.info.title).emit('Game Ended', game); // Copied from 'Game Ended'

      for (var i = 0; i < game.players.length; i++) {
        // If player
        for (var j = 0; j < io.sockets.sockets.length; j++) {
          if (game.players[i] == io.sockets.sockets[j].id) {
            io.sockets.sockets[j].leave(game.info.title); // Leave server room
          }
        }
      }

      for (var _i = 0; _i < game.spectators.length; _i++) {
        // If spectator
        for (var _j6 = 0; _j6 < io.sockets.sockets.length; _j6++) {
          if (game.spectators[_i] == io.sockets.sockets[_j6].id) {
            io.sockets.sockets[_j6].leave(game.info.title); // Leave server room

          }
        }
      }

      for (var _i2 = 0; _i2 < passwords.length; _i2++) {
        if (passwords[_i2].title == game.info.title) {
          passwords.splice(_i2, 1); // Remove game from passwords array

          _i2--;
          break;
        }
      }

      if (config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted

      for (var _i3 = 0; _i3 < games.length; _i3++) {
        if (games[_i3].info.host == game.info.host) {
          games.splice(_i3, 1); // Delete Game

          clearInterval(intervals[_i3]); // Clear Game Interval

          intervals.splice(_i3, 1); // Remove game interval from intervals array

          _i3--;
          break;
        }
      }
    } else {
      for (var _i4 = 0; _i4 < games.length; _i4++) {
        // Copied from 'disconnect'
        for (var _j7 = 0; _j7 < games[_i4].board.list.length; _j7++) {
          // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
          if (games[_i4].board.list[_j7].player == socket.id) {
            // Find player in leaderboard
            games[_i4].board.list.splice(_j7, 1); // Remove player from leaderboard


            _j7--;
            break;
          }
        }

        for (var _j8 = 0; _j8 < games[_i4].players.length; _j8++) {
          // Search Players
          if (games[_i4].players[_j8] == socket.id) {
            // Find Player
            socket.leave(games[_i4].info.title); // Leave 'Game' Room

            if (games[_i4].teams.length != 0) {
              // If is a team game
              var team = games[_i4].teams[teamColors.indexOf(games[_i4].orgs[_j8].team)]; // Identify player's team


              team.splice(team.indexOf(socket.id), 1); // Remove player from team
            }

            games[_i4].players.splice(_j8, 1); // Remove Player


            games[_i4].orgs.splice(_j8, 1); // Remove Player Org


            games[_i4].abilities.splice(_j8, 1); // Remove Player Abilities


            games[_i4].info.count = games[_i4].orgs.length;
            _j8--;
            if (config.project_state === 'development') console.log('                                               Player Left: ' + games[_i4].info.title + ' (' + socket.id + ')');
            break;
          }
        }

        for (var _j9 = 0; _j9 < games[_i4].spectators.length; _j9++) {
          // Search Spectators
          if (games[_i4].spectators[_j9] == socket.id) {
            // Find Spectator
            socket.leave(games[_i4].info.title);

            games[_i4].spectators.splice(_j9, 1);

            _j9--;
            if (config.project_state === 'development') console.log('                                               Spectator Left: ' + games[_i4].info.title + ' (' + socket.id + ')');
            break;
          }
        }
      }
    }
  }); // Game Ended

  socket.on('Game Ended', function (game) {
    if (game.info.host == socket.id) {
      io.to(game.info.title).emit('Game Ended', game);

      for (var i = 0; i < game.players.length; i++) {
        for (var j = 0; j < io.sockets.sockets.length; j++) {
          if (game.players[i] == io.sockets.sockets[j].id) {
            io.sockets.sockets[j].leave(game.info.title); // Make all players in 'game' leave the server group
          }
        }
      }

      for (var _i5 = 0; _i5 < games[_i5].spectators.length; _i5++) {
        for (var _j10 = 0; _j10 < io.sockets.sockets.length; _j10++) {
          if (game.spectators[_i5] == io.sockets.sockets[_j10].id) {
            io.sockets.sockets[_j10].leave(game.info.title); // Make all spectators in 'game' leave the server group

          }
        }
      }

      for (var _i6 = 0; _i6 < passwords.length; _i6++) {
        if (passwords[_i6].title == game.info.title) {
          passwords.splice(_i6, 1);
          _i6--;
          break;
        }
      }

      if (config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted

      for (var _i7 = 0; _i7 < games.length; _i7++) {
        if (games[_i7].info.host == game.info.host) {
          games.splice(_i7, 1); // Delete Game

          clearInterval(intervals[_i7]); // Clear Game Interval

          intervals.splice(_i7, 1);
          _i7--;
          break;
        }
      }
    }
  }); // Create Password

  socket.on('Password Created', function (data) {
    passwords.push({
      pass: data.pass,
      title: data.info.title,
      permissed: [socket.id]
    });
  }); // Verify Password on Join or Spectate

  socket.on('Ask Permission', function (data) {
    for (var i = 0; i < passwords.length; i++) {
      if (data.info.title === passwords[i].title) {
        if (data.pass === passwords[i].pass) {
          passwords[i].permissed.push(socket.id);
        }

        break;
      }
    }
  }); // Check if player is permitted entry into game

  socket.on('Check Permission', function (data) {
    var granted = false;
    var hasPassword = false;

    for (var i = 0; i < passwords.length; i++) {
      if (passwords[i].title === data.title) {
        // Identify game
        hasPassword = true;

        for (var j = 0; j < passwords[i].permissed.length; j++) {
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
  }); // Game Creation

  socket.on('Game Created', function (game) {
    games.push(game);
    socket.leave('Lobby'); // Leave 'Lobby' Room

    socket.join(game.info.title); // Join 'Game' Room

    if (config.project_state === 'development') console.log('                                               Game Created: ' + games[games.length - 1].info.title + ' (' + games[games.length - 1].info.host + ')');
    intervals.push(setInterval(function () {
      // Send updated game to all players
      for (var i = 0; i < games.length; i++) {
        // Game interval
        if (games[i].info.host === socket.id) {
          // Find game of specific host
          games[i].info.count = games[i].players.length; // Calculate and update player count

          io.to(games[i].info.title).emit('Game', games[i]); // Send updated game info to clients in game room

          break;
        }
      }
    }, config._renderfrequency));
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

  socket.on('Player Joined', function (data) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == data.info.host) {
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
  }); // Spectator Joined

  socket.on('Spectator Joined', function (game) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == game.info.host) {
        socket.leave('Lobby'); // Leave 'Lobby' Room

        socket.join(game.info.title); // Join 'Game' Room

        games[i].spectators.push(socket.id);
        if (config.project_state === 'development') console.log('                                               Spectator Spawned: ' + games[i].info.title + ' (' + socket.id + ')');
        break;
      }
    }
  }); // Spectator Left

  socket.on('Spectator Left', function (data) {
    // data is game.info
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == data.host) {
        for (var j = 0; j < games[i].spectators.length; j++) {
          if (games[i].spectators[j] == socket.id) {
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

  socket.on('Round End', function (data) {
    // data is game.info
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == data.host) {
        // Identify game
        games[i].rounds.waiting = false;
        games[i].rounds.delayed = true;
        games[i].rounds.delaystart = new Date().valueOf();
        break;
      }
    }

    var delay = setTimeout(function () {
      // End of round delay
      for (var _i8 = 0; _i8 < games.length; _i8++) {
        if (games[_i8].info.host == data.host) {
          games[_i8].rounds.waiting = true;
          games[_i8].rounds.delayed = false;
          break;
        }
      }

      io["in"](data.title).emit('Force Spawn');
    }, config._delaytime);

    if (data.mode === 'srv') {
      for (var _i9 = 0; _i9 < shrinkIntervals.length; _i9++) {
        if (shrinkIntervals[_i9].host === data.host) {
          // Identify shrink interval
          clearInterval(shrinkIntervals[_i9].interval);

          for (var j = 0; j < games.length; j++) {
            if (games[j].info.host === data.host) {
              games[j].world.width = shrinkIntervals[_i9].width; // shrinkIntervals[i].world is preserved from 'Round Delay'

              games[j].world.height = shrinkIntervals[_i9].height; // Reset world width and height

              break;
            }
          }

          shrinkIntervals.splice(_i9, 1); // Remove shrink interval

          break;
        }
      }
    }
  }); // Round Delay

  socket.on('Round Delay', function (game) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == game.info.host) {
        // Identify game
        games[i].rounds.waiting = true;
        games[i].rounds.delayed = true;
        games[i].rounds.delaystart = new Date().valueOf();
        break;
      }
    }

    var delay = setTimeout(function () {
      for (var _i10 = 0; _i10 < games.length; _i10++) {
        if (games[_i10].info.host === game.info.host) {
          // Identify game
          games[_i10].rounds.waiting = false; // Start Round

          games[_i10].rounds.delayed = false;

          if (game.info.mode === 'srv') {
            // If is survival mode
            shrinkIntervals.push({
              // Shrink the world
              host: game.info.host,
              width: game.world.width,
              // Preserve initial width of world
              height: game.world.height,
              // Preserve initial height of world
              interval: setInterval(function () {
                for (var j = 0; j < games.length; j++) {
                  if (games[j].info.host === game.info.host && games[j].world.width > 200 && games[j].world.height > 200) {
                    // Identify game; If both dimensions are greater than minimum
                    games[j].world.width -= config._shrinkrate;
                    games[j].world.height -= config._shrinkrate;
                    games[j].world.x += config._shrinkrate / 2; // World shrinks to center

                    games[j].world.y += config._shrinkrate / 2;
                    break;
                  }
                }
              }, config._renderfrequency) // Same frequency as game interval

            });
          }

          games[_i10].rounds.start = new Date().valueOf();
          break;
        }
      }
    }, config._delaytime);
    var spawndelay = setTimeout(function () {
      // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
      io["in"](game.info.title).emit('Force Spawn');
    }, config._delaytime - 1000);
  }); // Update Server Leaderboard

  socket.on('Board', function (data) {
    // data: { list: board.list, host: game.board.host }
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == data.host) {
        // Find board's game
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

  socket.on('Org Update', function (data) {
    // data is an array in order to decrease json data sent over web socket
    var done = false;

    for (var i = 0; i < games.length; i++) {
      for (var j = 0; j < games[i].orgs.length; j++) {
        if (games[i].orgs[j].player == socket.id) {
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
  }); // Update Server Abilities

  socket.on('Ability', function (ability) {
    var done = false;

    for (var i = 0; i < games.length; i++) {
      for (var j = 0; j < games[i].info.count; j++) {
        if (games[i].abilities[j].player == socket.id) {
          // Find ability of socket
          games[i].abilities[j] = ability;
          done = true;
          break;
        }
      }

      if (done) break;
    }
  }); // Update Server-side Game

  socket.on('Game', function (data) {
    // data: { game: {} } (data object literal exists rather than just 'game' to allow for customization of input beyond 'game')
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host === data.game.host) {
        games[i] = data.game;
        break;
      }
    }
  }); // Update Server Teams

  socket.on('Teams', function (data) {
    // data: { teams: game.teams, host: game.info.host }
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == data.host) {
        // Identify game
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

  socket.on('Flag', function (game) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].info.host == game.info.host) {
        games[i].flag = game.flag;
        break;
      }
    }
  }); // Dead

  socket.on('Dead', function (spectating) {
    for (var i = 0; i < games.length; i++) {
      if (games[i].players.indexOf(socket.id) != -1) {
        for (var j = 0; j < games[i].players.length; j++) {
          // Remove Player
          if (games[i].players[j] == socket.id) {
            games[i].players.splice(j, 1);
            break;
          }
        }

        for (var _j11 = 0; _j11 < games[i].abilities.length; _j11++) {
          // Remove Ability
          if (games[i].abilities[_j11].player == socket.id) {
            games[i].abilities.splice(_j11, 1);
            break;
          }
        }

        for (var _j12 = 0; _j12 < games[i].orgs.length; _j12++) {
          // Do not use games[i].info.count server-side (orgs.length may change before count changes)
          if (games[i].orgs[_j12].player == socket.id) {
            games[i].orgs.splice(_j12, 1); // Remove Org

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
  {
    // On-Abilities
    socket.on('Tag', function (player) {
      if (player == socket.id) {
        socket.emit('Tag');
      } else {
        socket.to(player).emit('Tag');
      }
    });
    socket.on('Extend', function (player) {
      if (player == socket.id) {
        socket.emit('Extend');
      } else {
        socket.to(player).emit('Extend');
      }
    });
    socket.on('Compress', function (player) {
      if (player == socket.id) {
        socket.emit('Compress');
      } else {
        socket.to(player).emit('Compress');
      }
    }); // socket.on('Speed', function(player) {
    //    if (player == socket.id) {
    //       socket.emit('Speed');
    //    } else {
    //       socket.to(player).emit('Speed');
    //    }
    // });
    // socket.on('Slow', function(player) {
    //    if (player == socket.id) {
    //       socket.emit('Slow');
    //    } else {
    //       socket.to(player).emit('Slow');
    //    }
    // });

    socket.on('Immortality', function (player) {
      if (player == socket.id) {
        socket.emit('Immortality');
      } else {
        socket.to(player).emit('Immortality');
      }
    });
    socket.on('Freeze', function (player) {
      if (player == socket.id) {
        socket.emit('Freeze');
      } else {
        socket.to(player).emit('Freeze');
      }
    }); // socket.on('Stimulate', function(player) {
    //    if (player == socket.id) {
    //       socket.emit('Stimulate');
    //    } else {
    //       socket.to(player).emit('Stimulate');
    //    }
    // });
    // socket.on('Poison', function(player) {
    //    if (player == socket.id) {
    //       socket.emit('Poison');
    //    } else {
    //       socket.to(player).emit('Poison');
    //    }
    // });

    socket.on('Neutralize', function (player) {
      if (player == socket.id) {
        socket.emit('Neutralize');
      } else {
        socket.to(player).emit('Neutralize');
      }
    });
    socket.on('Toxin', function (player) {
      if (player == socket.id) {
        socket.emit('Toxin');
      } else {
        socket.to(player).emit('Toxin');
      }
    });
  }
});