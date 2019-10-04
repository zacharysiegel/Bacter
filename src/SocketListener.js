const Permissions = require('./Permissions.js');

class SocketListener {
   constructor(server, config) {
      this.socketio = require('socket.io');
      this.io = this.socketio(server);
      this.config = config;
      this.socket;
   }

   /**
   * Listen for a new connection to the socketio server
   *    Initialize all other socketio listeners
   */
   listen(games) {
      this.io.on('connection', socket => {
         this.socket = socket;

         games.connections++;
         if (this.config.project_state === 'development') console.log('Client connected:     ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

         this.socket.join('Lobby'); // Join 'Lobby' room in '/' namespace
         this.socket.emit('Games', { games: games.list, connections: games.connections }); // Copied from 'Games Request'

         // Socket Management
         this.listen_disconnect(games);

         // Control Flow
         this.listen_leave_game(games);
         this.listen_game_ended(games);
         this.listen_create_game(games);
         this.listen_create_password(games);
         this.listen_ask_permission(games);
         this.listen_check_permission(games);
         this.listen_player_joined(games);
         this.listen_spectator_joined(games);
         this.listen_spectator_left(games);
         this.listen_end_round(games);
         this.listen_round_delay(games);
         this.listen_dead(games);

         // Data Congruence
         this.listen_board(games);
         this.listen_org(games);
         this.listen_game(games);
         this.listen_teams(games);
         this.listen_flag(games);
         this.listen_ability(games);

         // Ability Transmission
         this.listen_abilities();

         // Miscellaneous
         this.listen_error();
         this.listen_test();
      });
   }

   /**
    * Listen for the socketio error event
    */
   listen_error() {
      this.socket.on('error', error => {
         console.log('Error -- this.socket.io: ', error);
      });
   }

   /**
   * Listen for the socket disconnect
   */
   listen_disconnect(games) {
      this.socket.on('disconnect', () => {
         games.connections--;
         if (this.config.project_state === 'development') console.log('Client disconnected:  ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

         // End Hosted Game
         for (let i = 0; i < games.count; i++) {
            if (games.list[i].info.host === this.socket.id) { // If player is host
               this.io.to(games.list[i].info.title).emit('Game Ended', games.list[i]); // Remove Players From Hosted Game
               for (let j = 0; j < games.list[i].players.length; j++) {
                  for (let k = 0; k < this.io.sockets.sockets.length; k++) {
                     if (games.list[i].players[j] === this.io.sockets.sockets[k].id) {
                        this.io.sockets.sockets[k].leave(games.list[i].info.title);
                     }
                  }
               }
               for (let j = 0; j < games.list[i].spectators.length; j++) {
                  for (let k = 0; k < this.io.sockets.sockets.length; k++) {
                     if (games.list[i].spectators[j] === this.io.sockets.sockets[k].id) {
                        this.io.sockets.sockets[k].leave(games.list[i].info.title);
                     }
                  }
               }
               if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + games.list[i].info.title + ' (' + games.list[i].info.host + ')'); // Before game deletion so game info can be attained before it is deleted
               let password_count = games.securities.length;
               for (let j = 0; j < password_count; j++) {
                  if (games.securities[j].title === games.list[i].info.title) {
                     games.securities.splice(j, 1);
                     j--; // Unnecessary when break proceeds
                     break;
                  }
               }
               games.splice(i, 1); // Delete Game
               clearInterval(games.intervals[i]); // Clear Game Interval
               games.intervals.splice(i, 1);
               i--;
               break; // Break can be removed to remove multiple games if player is host of multiple games by some bug
               } else { // If player is not host
               for (let j = 0; j < games.list[i].board.list.length; j++) { // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
                  if (games.list[i].board.list[j].player === this.socket.id) { // Find player in leaderboard
                     games.list[i].board.list.splice(j, 1); // Remove player from leaderboard
                     j--;
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].players.length; j++) { // Search Players
                  if (games.list[i].players[j] === this.socket.id) { // Find Player
                     this.socket.leave(games.list[i].info.title); // Leave 'Game' Room
                     if (games.list[i].teams.length !== 0) { // If is a team game
                        let team = games.list[i].teams[teamColors.indexOf(games.list[i].orgs[j].team)]; // Identify player's team
                        team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                     }
                     games.list[i].players.splice(j, 1); // Remove Player
                     games.list[i].orgs.splice(j, 1); // Remove Player Org
                     games.list[i].abilities.splice(j, 1); // Remove Player Abilities
                     games.list[i].info.count = games.list[i].orgs.length;
                     j--;
                     if (this.config.project_state === 'development') console.log('                                               Player Left: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].spectators.length; j++) { // Search Spectators
                  if (games.list[i].spectators[j] === this.socket.id) { // Find Spectator
                     this.socket.leave(games.list[i].info.title);
                     games.list[i].spectators.splice(j, 1);
                     j--;
                     if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
                     break;
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for leave game event from client
    */
   listen_leave_game(games) {
      this.socket.on('Leave Game', (game) => {
         if (game.info.host === this.socket.id) { // If player is host
            this.io.to(game.info.title).emit('Game Ended', game); // Copied from 'Game Ended'
            for (let i = 0; i < game.players.length; i++) { // If player
               for (let j = 0; j < this.io.sockets.sockets.length; j++) {
                  if (game.players[i] === this.io.sockets.sockets[j].id) {
                     this.io.sockets.sockets[j].leave(game.info.title); // Leave server room
                  }
               }
            }
            for (let i = 0; i < game.spectators.length; i++) { // If spectator
               for (let j = 0; j < this.io.sockets.sockets.length; j++) {
                  if (game.spectators[i] === this.io.sockets.sockets[j].id) {
                     this.io.sockets.sockets[j].leave(game.info.title); // Leave server room
                  }
               }
            }
            let password_count = games.securities.length;
            for (let i = 0; i < password_count; i++) {
               if (games.securities[i].title === game.info.title) {
                  games.securities.splice(i, 1); // Remove game from securities array
                  i--; // Not necessary with break statement, but it is here to avoid future bugs
                  break;
               }
            }
            if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
            for (let i = 0; i < games.length; i++) {
               if (games.list[i].info.host === game.info.host) {
                  games.splice(i, 1); // Delete Game
                  clearInterval(games.intervals[i]); // Clear Game Interval
                  games.intervals.splice(i, 1); // Remove game interval from intervals array
                  i--;
                  break;
               }
            }
         } else { // If player is not host
            for (let i = 0; i < games.length; i++) { // Copied from 'disconnect'
               for (let j = 0; j < games.list[i].board.list.length; j++) { // Search leaderboard outside players and spectators because players and spectators both have place on leaderboard
                  if (games.list[i].board.list[j].player === this.socket.id) { // Find player in leaderboard
                     games.list[i].board.list.splice(j, 1); // Remove player from leaderboard
                     j--;
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].players.length; j++) { // Search Players
                  if (games.list[i].players[j] === this.socket.id) { // Find Player
                     this.socket.leave(games.list[i].info.title); // Leave 'Game' Room
                     if (games.list[i].teams.length !== 0) { // If is a team game
                        let team = games.list[i].teams[teamColors.indexOf(games.list[i].orgs[j].team)]; // Identify player's team
                        team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                     }
                     games.list[i].players.splice(j, 1); // Remove Player
                     games.list[i].orgs.splice(j, 1); // Remove Player Org
                     games.list[i].abilities.splice(j, 1); // Remove Player Abilities
                     games.list[i].info.count = games.list[i].orgs.length;
                     j--;
                     if (this.config.project_state === 'development') console.log('                                               Player Left: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].spectators.length; j++) { // Search Spectators
                  if (games.list[i].spectators[j] === this.socket.id) { // Find Spectator
                     this.socket.leave(games.list[i].info.title);
                     games.list[i].spectators.splice(j, 1);
                     j--;
                     if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
                     break;
                  }
               }
            }
         }
      });
   }

   /**
    * Listen for game ended event from client
    */
   listen_game_ended(games) {
      this.socket.on('Game Ended', (game) => {
         if (game.info.host === this.socket.id) {
            this.io.to(game.info.title).emit('Game Ended', game);
            for (let i = 0; i < game.players.length; i++) {
               for (let j = 0; j < this.io.sockets.sockets.length; j++) {
                  if (game.players[i] === this.io.sockets.sockets[j].id) {
                     this.io.sockets.sockets[j].leave(game.info.title); // Make all players in 'game' leave the server group
                  }
               }
            }
            for (let i = 0; i < games.list[i].spectators.length; i++) {
               for (let j = 0; j < this.io.sockets.sockets.length; j++) {
                  if (game.spectators[i] === this.io.sockets.sockets[j].id) {
                     this.io.sockets.sockets[j].leave(game.info.title); // Make all spectators in 'game' leave the server group
                  }
               }
            }
            let password_count = games.securities.length;
            for (let i = 0; i < password_count; i++) {
               if (games.securities[i].title === game.info.title) {
                  games.securities.splice(i, 1);
                  i--;
                  break;
               }
            }
            if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
            for (let i = 0; i < games.length; i++) {
               if (games.list[i].info.host === game.info.host) {
                  games.splice(i, 1); // Delete Game
                  clearInterval(games.intervals[i]); // Clear Game Interval
                  games.intervals.splice(i, 1);
                  i--;
                  break;
               }
            }
         }
      });
   }

   /**
    * Listen for create game event from client
    */
   listen_create_game(games) {
      /**
       * Create a game instance on the server and emit it to all clients
       * @param data {Map} {
       *                      game: {Game}
       *                   }
       */
      this.socket.on('Create Game', (data) => {
         console.log('create game');
         games.createGame(data.game, this.socket.id, this.io);

         this.socket.leave('Lobby'); // Leave 'Lobby' Room (this.socket.io)
         this.socket.join(data.game.info.title); // Join 'Game' Room (this.socket.io)
      });
   }

   /**
    * Listen for create password event from client
    */
   listen_create_password(games) {
      this.socket.on('Create Password', (data) => {
         let permissions = new Permissions(data.info.title, data.pass);
         permissions.permiss(this.socket.id);
         games.securities.push(permissions);
      });
   }


   /**
    * Listen for the test event from client
    */
   listen_test() {
      this.socket.on('Test', data => {
         console.log('test successful');
      });
   }

   /**
    * Verify Password on Join or Spectate
    */
   listen_ask_permission(games) {
      this.socket.on('Ask Permission', (data, callback) => {
         let len = games.securities.length;
         for (let i = 0; i < len; i++) {
            let permissions = games.securities[i];
            if (data.info.title === permissions.title &&
               data.pass === permissions.password) {
               permissions.permiss(this.socket.id);
               callback(true);
            }
            return true;
         }
         callback(false);
         return false;
      });
   }

   /**
    * Check if the player is permitted entry into game
    */
   listen_check_permission(games) {
      /**
       * Check if the player is permitted entry into a game
       *    Responds to the client with a callback specified by the client
       * @param  {Map}      data      {
       *                                 title: Corresponds to game.info.title
       *                              }
       * @param  {Function} callback  Will be called with a resultant value fed as an argument
       *                                 Run by the client after called on the server
       */
      this.socket.on('Check Permission', (data, callback) => {
         let has_password = false;
         let granted = false;
         let password_count = games.securities.length;

         for (let i = 0; i < password_count; i++) {
            if (games.securities[i].title === data.title) { // Identify game
               has_password = true;
               console.log('has password');
               if (games.securities[i].isPermissed(this.socket.id)) {
                  console.log('granted');
                  granted = true;
               }
               break;
            }
         }

         console.log(this.socket.id, data, 'has password ' + has_password, 'granted ' + granted);

         if (!has_password || granted) {
            // this.socket.emit('Permission Granted', data);
            callback('Permission Granted');
         } else { // (has_password && !granted)
            // this.socket.emit('Permission Denied', data);
            callback('Permission Denied');
         }
      });
   }

   /**
    * Listen for player joined event from client
    */
   listen_player_joined(games) {
      /**
       * Player Joined emit listener
       * @param  data {Map} {
       *                       info: game.info,
       *                       org: org,
       *                       ability: ability
       *                    }
       */
      this.socket.on('Player Joined', (data) => {
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.info.host) {
               this.socket.leave('Lobby'); // Leave 'Lobby' Room
               this.socket.join(data.info.title); // Join 'Game' Room
               games.list[i].players.push(this.socket.id); // Add player to server's list of players in game
               games.list[i].orgs.push(data.org); // Create server instance of org
               games.list[i].abilities.push(data.ability); // Create server instance of ability
               games.list[i].info.count = games.list[i].orgs.length;
               this.socket.emit('Enter');
               if (this.config.project_state === 'development') console.log('                                               Player Spawned: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
               break;
            }
         }
      });
   }

   /**
    * Listen for spectator joined event from client
    */
   listen_spectator_joined(games) {
      this.socket.on('Spectator Joined', (game) => {
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === game.info.host) {
               this.socket.leave('Lobby'); // Leave 'Lobby' Room
               this.socket.join(game.info.title); // Join 'Game' Room
               games.list[i].spectators.push(this.socket.id);
               if (this.config.project_state === 'development') console.log('                                               Spectator Spawned: ' + games.list[i].info.title + ' (' + this.socket.id + ')');
               break;
            }
         }
      });
   }

   /**
    * Listen for spectator left event from client
    */
   listen_spectator_left(games) {
      this.socket.on('Spectator Left', (data) => { // data is game.info
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.host) {
               for (let j = 0; j < games.list[i].spectators.length; j++) {
                  if (games.list[i].spectators[j] === this.socket.id) {
                     games.list[i].spectators.splice(j, 1);
                     break;
                  }
               }
               break;
            }
         }
      });
   }

   /**
    * Listen for end round event from client
    */
   listen_end_round(games) {
      /**
       * End Round
       *    Received upon round of survival ending after only one player stands (or zero if multiple die on same tick)
       * @param  {Object} data: game.info
       * @return {void}
       */
      this.socket.on('End Round', (data) => { // data is game.info
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.host) { // Identify game
               games.list[i].rounds.waiting = false;
               games.list[i].rounds.delayed = true;
               games.list[i].rounds.delaystart = (new Date()).valueOf();
               break;
            }
         }
         let delay = setTimeout(() => { // End of round delay
            for (let i = 0; i < games.length; i++) {
               if (games.list[i].info.host === data.host) {
                  games.list[i].rounds.waiting = true;
                  games.list[i].rounds.delayed = false;
                  break;
               }
            }
            this.io.in(data.title).emit('Force Spawn');
         }, this.config.delay_time);
         if (data.mode === 'srv') {
            for (let i = 0; i < games.shrinkIntervals.length; i++) {
               if (games.shrinkIntervals[i].host === data.host) { // Identify shrink interval
                  clearInterval(games.shrinkIntervals[i].interval);
                  for (let j = 0; j < games.length; j++) {
                     if (games.list[j].info.host === data.host) {
                        games.list[j].world.width = games.shrinkIntervals[i].width; // games.shrinkIntervals[i].world is preserved from 'Round Delay'
                        games.list[j].world.height = games.shrinkIntervals[i].height; // Reset world width and height
                        break;
                     }
                  }
                  games.shrinkIntervals.splice(i, 1); // Remove shrink interval
                  break;
               }
            }
         }
      });
   }

   /**
    * Listen for round delay event from client
    */
   listen_round_delay(games) {
      this.socket.on('Round Delay', (game) => {
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === game.info.host) { // Identify game
               games.list[i].rounds.waiting = true;
               games.list[i].rounds.delayed = true;
               games.list[i].rounds.delaystart = (new Date()).valueOf();
               break;
            }
         }
         let delay = setTimeout(() => {
            for (let i = 0; i < games.length; i++) {
               if (games.list[i].info.host === game.info.host) { // Identify game
                  games.list[i].rounds.waiting = false; // Start Round
                  games.list[i].rounds.delayed = false;
                  if (game.info.mode === 'srv') { // If is survival mode
                     games.shrinkIntervals.push({ // Shrink the world
                        host: game.info.host,
                        width: game.world.width, // Preserve initial width of world
                        height: game.world.height, // Preserve initial height of world
                        interval: setInterval(() => {
                           for (let j = 0; j < games.length; j++) {
                              if (games.list[j].info.host === game.info.host && (games.list[j].world.width > 200 && games.list[j].world.height > 200)) { // Identify game; If both dimensions are greater than minimum
                                 games.list[j].world.width -= config.shrink_rate;
                                 games.list[j].world.height -= config.shrink_rate;
                                 games.list[j].world.x += config.shrink_rate / 2; // World shrinks to center
                                 games.list[j].world.y += config.shrink_rate / 2;
                                 break;
                              }
                           }
                        }, this.config.render_frequency) // Same frequency as game interval
                     });
                  }
                  games.list[i].rounds.start = (new Date()).valueOf();
                  break;
               }
            }
         }, this.config.delay_time);
         let spawndelay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
            this.io.in(game.info.title).emit('Force Spawn');
         }, this.config.delay_time - 1000);
      });
   }

   /**
    * Listen for board event from client
    *    Update server-side board data
    */
   listen_board(games) {
      this.socket.on('Board', (data) => { // data: { list: board.list, host: game.board.host }
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.host) { // Find board's game
               games.list[i].board.list = data.list; // Update server leaderboard list
               break;
            }
         }
      });
   }

   /**
    * Listen for org event from client
    *    Update server-side org data
    */
   listen_org(games) {
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
      this.socket.on('Org Update', (data) => { // data is an array in order to decrease json data sent over web this.socket
         let done = false;
         for (let i = 0; i < games.length; i++) {
            for (let j = 0; j < games.list[i].orgs.length; j++) {
               if (games.list[i].orgs[j].player === this.socket.id) {
                  // games.list[i].orgs[j] = org;
                  games.list[i].orgs[j].alive = data[0]; // Only the following attributes of org need to be updated
                  games.list[i].orgs[j].cells = data[1]; // Latency is decreased by only sending necessary data
                  games.list[i].orgs[j].count = data[1].length;
                  games.list[i].orgs[j].off = data[2];
                  games.list[i].orgs[j].pos = data[3];
                  games.list[i].orgs[j].color = data[4];
                  games.list[i].orgs[j].skin = data[5];
                  games.list[i].orgs[j].team = data[6];
                  games.list[i].orgs[j].coefficient = data[7];
                  games.list[i].orgs[j].range = data[8];
                  done = true;
                  break;
               }
            }
            if (done) break;
         }
      });
   }

   /**
    * Listen for ability event from client
    */
   listen_ability(games) {
      this.socket.on('Ability', (ability) => {
         let done = false;
         for (let i = 0; i < games.length; i++) {
            for (let j = 0; j < games.list[i].info.count; j++) {
               if (games.list[i].abilities[j].player === this.socket.id) { // Find ability of this.socket
                  games.list[i].abilities[j] = ability;
                  done = true;
                  break;
               }
            }
            if (done) break;
         }
      });
   }

   /**
    * Listen for game event from client
    */
   listen_game(games) {
      this.socket.on('Game', (data) => { // data: { game: {} } (data object literal exists rather than just 'game' to allow for customization of input beyond 'game')
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.game.host) {
               games.list[i] = data.game;
               break;
            }
         }
      });
   }

   /**
    * Listen for team event from client
    */
   listen_teams(games) {
      this.socket.on('Teams', (data) => { // data: { teams: game.teams, host: game.info.host }
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === data.host) { // Identify game
               games.list[i].teams = data.teams; // All data in teams array must be updated
               break;
            }
         }
      });
   }

   /**
    * Listen for flag event from client
    */
   listen_flag(games) {
      /**
       * Update the server's instance of game's flag
       * @param Object data {
       *       flag: game.flag,
       *       host: game.info.host
       *    }
       */
      this.socket.on('Flag', (game) => {
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].info.host === game.info.host) {
               games.list[i].flag = game.flag;
               break;
            }
         }
      });
   }

   /**
    * Listen for dead event from client
    */
   listen_dead(games) {
      this.socket.on('Dead', (spectating) => {
         for (let i = 0; i < games.length; i++) {
            if (games.list[i].players.indexOf(this.socket.id) !== -1) {
               for (let j = 0; j < games.list[i].players.length; j++) { // Remove Player
                  if (games.list[i].players[j] === this.socket.id) {
                     games.list[i].players.splice(j, 1);
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].abilities.length; j++) { // Remove Ability
                  if (games.list[i].abilities[j].player === this.socket.id) {
                     games.list[i].abilities.splice(j, 1);
                     break;
                  }
               }
               for (let j = 0; j < games.list[i].orgs.length; j++) { // Do not use games.list[i].info.count server-side (orgs.length may change before count changes)
                  if (games.list[i].orgs[j].player === this.socket.id) {
                     games.list[i].orgs.splice(j, 1); // Remove Org
                     games.list[i].info.count = games.list[i].orgs.length;
                     if (spectating) {
                        this.socket.emit('Spectate'); // Dead player becomes spectator
                     }
                     break;
                  }
               }
               break;
            }
         }
      });
   }

   /**
    * Listen for ability events from client
    *    Standard: Extend, Compress, Immortality, Freeze, Neutralize, Toxin, Spore
    *    Special: Tag
    *    Old: Speed, Slow, Stimulate, Poison
    */
   listen_abilities() {
      this.socket.on('Tag', function(player) {
         if (player === this.socket.id) {
            this.socket.emit('Tag');
         } else {
            this.socket.to(player).emit('Tag');
         }
      });

      this.socket.on('Extend', function(player=this.socket.id) {
         if (player === this.socket.id) {
            this.socket.emit('Extend');
         } else {
            this.socket.to(player).emit('Extend');
         }
      });

      this.socket.on('Compress', function(player) {
         if (player === this.socket.id) {
            this.socket.emit('Compress');
         } else {
            this.socket.to(player).emit('Compress');
         }
      });

      this.socket.on('Immortality', function(player=this.socket.id) {
         if (player === this.socket.id) {
            this.socket.emit('Immortality');
         } else {
            this.socket.to(player).emit('Immortality');
         }
      });

      this.socket.on('Freeze', function(player) {
         if (player === this.socket.id) {
            this.socket.emit('Freeze');
         } else {
            this.socket.to(player).emit('Freeze');
         }
      });

      this.socket.on('Neutralize', function(player=this.socket.id) {
         if (player === this.socket.id) {
            this.socket.emit('Neutralize');
         } else {
            this.socket.to(player).emit('Neutralize');
         }
      });

      this.socket.on('Toxin', function(player) {
         if (player === this.socket.id) {
            this.socket.emit('Toxin');
         } else {
            this.socket.to(player).emit('Toxin');
         }
      });

      // this.socket.on('Speed', function(player) {
      //    if (player === this.socket.id) {
      //       this.socket.emit('Speed');
      //    } else {
      //       this.socket.to(player).emit('Speed');
      //    }
      // });

      // this.socket.on('Slow', function(player) {
      //    if (player === this.socket.id) {
      //       this.socket.emit('Slow');
      //    } else {
      //       this.socket.to(player).emit('Slow');
      //    }
      // });

      // this.socket.on('Stimulate', function(player) {
      //    if (player === this.socket.id) {
      //       this.socket.emit('Stimulate');
      //    } else {
      //       this.socket.to(player).emit('Stimulate');
      //    }
      // });

      // this.socket.on('Poison', function(player) {
      //    if (player === this.socket.id) {
      //       this.socket.emit('Poison');
      //    } else {
      //       this.socket.to(player).emit('Poison');
      //    }
      // });
   }
}

module.exports = SocketListener;
