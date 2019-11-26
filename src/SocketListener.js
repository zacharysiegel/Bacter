const Permissions = require('./Permissions.js');

class SocketListener {
    constructor(socket, io, config) {
        this.socket = socket;
        this.io = io;
        this.config = config;
    }

    /**
     * Listen for a new connection to the socketio server
     *    Initialize all other socketio listeners
     */
    listen(games) {
        games.connections++;
        if (this.config.project_state === 'development') console.log('Client connected:     ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

        this.socket.join('lobby'); // Join 'lobby' room in '/' namespace
        this.socket.inGame = false;
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
        this.listen_teams(games);
        this.listen_flag(games);
        this.listen_ability(games);

        // Ability Transmission
        this.listen_abilities();

        // Miscellaneous
        this.listen_error();
        this.listen_test();
    }

    /**
     * Listen for the test event from client
     */
    listen_test() {
        this.socket.on('Test', (data, callback) => {
            console.log('Test Successful');
            callback(data);
        });
    }

    /**
     * Listen for the socketio error event
     */
    listen_error() {
        this.socket.on('error', error => {
            console.error('Error -- socket.io:\n', error);
        });
    }

    /**
     * Listen for the socket disconnect
     */
    listen_disconnect(games) {
        this.socket.on('disconnect', () => {
            games.connections--;
            if (this.config.project_state === 'development') console.log('Client disconnected:  ' + this.socket.id + ' (' + games.connections + ')'); // Server Message

            if (this.socket.inGame) { // If client is in a game
                this.removeMember(games); // Remove the client from the game and update the game's data
            } // Nothing else is necessary because client is disconnecting from the server entirely
        });
    }

    /**
     * Listen for leave game event from client
     */
    listen_leave_game(games) {
        this.socket.on('leave game', () => {
            this.removeMember(games);

            this.socket.join('lobby');
            this.socket.inGame = false;
        });
    }

    /**
     * Listen for game ended event from client
     */
    listen_game_ended(games) {
        this.socket.on('game ended', (game) => {
            if (game.info.host === this.socket.id) { // 'game ended' event can only fire when it is sent by the game's host
                this.io.to(game.info.title).emit('game ended', game);
                this.io.of('/').in(game.info.title).clients((error, ids) => { // Get each client in room
                    let client_count = ids.length;
                    for (let i = 0; i < client_count; i++) {
                        this.io.sockets.sockets[ids[i]].leave(game.info.title); // Direct each player to leave the room
                    }
                });

                if (game.info.protected) { // If game is protected by a password, remove the security info from the securities array
                    let password_count = games.securities.length;
                    for (let p = 0; p < password_count; p++) {
                        if (games.securities[p].title === game.info.title) { // Find game's security info and remove it
                            games.securities.splice(p, 1);
                            break;
                        }
                    }
                }

                const g = games.getIndexByHost(game.info.host); // Location of game in games.list (O(n))
                if (g === -1) {
                    console.error(`[ERROR] :: listen_game_ended :: Game not found in {Games}.list with host ${game.info.host}`);
                    return;
                }

                games.list.splice(g, 1); // Delete Game
                clearInterval(games.intervals[g]); // Clear Game Interval
                games.intervals.splice(g, 1);

                if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
            }
        });
    }

    /**
     * Listen for create game event from client
     */
    listen_create_game(games) {
        /**
         * Create a game instance on the server and emit it to all clients
         * @param data {Map} game object
         */
        this.socket.on('create game', (game) => {
            games.createGame(game, this.socket.id, this.io);

            // Switching to game's room is necessary here (rather than waiting until join) so game is deleted correctly if client disconnects before joining, but after creating
            this.socket.leave('lobby'); // Leave 'lobby' Room (this.socket.io)
            this.socket.join(game.info.title); // Join 'Game' Room (this.socket.io)
            this.socket.inGame = true;
        });
    }

    /**
     * Listen for create password event from client
     * @param {Games} games Game instance
     */
    listen_create_password(games) {
        this.socket.on('create password', (data) => {
            let permissions = new Permissions(data.info.title, data.pass);
            permissions.permiss(this.socket.id);
            games.securities.push(permissions);
        });
    }

    /**
     * Verify Password on Join or Spectate
     *    Callback with argument 'true' if client is permissed, else callback 'false'
     */
    listen_ask_permission(games) {
        this.socket.on('ask permission', (data, callback) => {
            let len = games.securities.length;
            for (let i = 0; i < len; i++) {
                let permissions = games.securities[i];
                if (data.info.title === permissions.title &&
                    data.pass === permissions.password) {
                    permissions.permiss(this.socket.id);
                    callback(true);
                }
            }
            callback(false);
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
            let secured_count = games.securities.length;

            for (let i = 0; i < secured_count; i++) {
                if (games.securities[i].title === data.title) { // Identify game
                    has_password = true;
                    if (games.securities[i].isPermissed(this.socket.id)) {
                        granted = true;
                    }

                    break;
                }
            }

            if (!has_password || granted) {
                callback('permission granted');
            } else { // (has_password && !granted)
                callback('permission denied');
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
        this.socket.on('player joined', (data) => {
            const g = games.getIndexByHost(data.info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_player_joined :: Game not found in {Games}.list with host ${data.info.host}`);
                return;
            }

            this.socket.leave('lobby'); // Leave 'lobby' Room
            this.socket.join(data.info.title); // Join 'Game' Room
            this.socket.inGame = true;

            games.list[g].players.push(this.socket.id); // Add player to server's list of players in game
            games.list[g].orgs.push(data.org); // Create server instance of compressed org (no functions)
            games.list[g].abilities.push(data.ability); // Create server instance of ability
            games.list[g].info.count = games.list[g].orgs.length;

            this.socket.emit('enter');
            if (this.config.project_state === 'development') console.log('                                               Player Spawned: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
        });
    }

    /**
     * Listen for spectator joined event from client
     */
    listen_spectator_joined(games) {
        this.socket.on('spectator joined', (game) => {
            this.socket.leave('lobby'); // Leave 'lobby' Room
            this.socket.join(game.info.title); // Join 'Game' Room
            this.socket.inGame = true;

            const g = games.getIndexByHost(game.info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_spectator_joined :: Game not found in {Games}.list with host ${game.info.host}`);
                return;
            }

            games.list[g].spectators.push(this.socket.id);
            if (this.config.project_state === 'development') console.log('                                               Spectator Spawned: ' + games.list[g].info.title + ' (' + this.socket.id + ')');
        });
    }

    /**
     * Listen for spectator left event from client
     * @return {void}
     */
    listen_spectator_left(games) {
        this.socket.on('spectator left', (data) => { // data is game.info
            const g = games.getIndexByHost(data.host); // It is a bit faster to get the index of game from host and feeding that as a starting point into getIndicesByMember
            if (g === -1) {
                console.error(`[ERROR] :: listen_spectator_left :: Game not found in {Games}.list with host ${data.host}`);
                return;
            }

            const indices = games.getIndicesByMember(this.socket.id, g);
            games.list[g].spectators.splice(indices.s, 1);
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
         */
        this.socket.on('end round', (data) => { // data is game.info
            const g = games.getIndexByHost(data.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_end_round :: Game not found in {Games}.list with host ${data.host}`);
                return;
            }

            games.list[g].rounds.waiting = false;
            games.list[g].rounds.delayed = true;
            games.list[g].rounds.delaystart = (new Date()).valueOf();

            let delay = setTimeout(() => { // End of round delay
                const g = games.getIndexByHost(data.host); // The value of g is saved in the Closure, but it may change by the time the timeout is called, so it must be recalculated
                if (g === -1) {
                    console.error(`[ERROR] :: listen_end_round|delay :: Game not found in {Games}.list with host ${data.host}`);
                    return;
                }

                const s = games.getShrinkIndex(data.host); // Must recalculate the shrink index in case of concurrent modification
                games.list[g].world.width = games.shrinkIntervals[s].width; // games.shrinkIntervals[s].world is preserved from 'round delay'
                games.list[g].world.height = games.shrinkIntervals[s].height; // Reset world width and height
                games.shrinkIntervals.splice(s, 1); // Remove shrink interval

                games.list[g].rounds.waiting = true; // When the 'end of round' delay finishes, the 'start of round' delay begins
                games.list[g].rounds.delayed = false;

                this.io.in(data.title).emit('force spawn');
            }, this.config.delay_time);

            if (data.mode === 'srv') {
                const s = games.getShrinkIndex(data.host);
                if (s === -1) { // This will occur if the 'end round' was emitted multiple times at the end of a single round, this will usually not occur
                    console.error('[WARN] :: listen_end_round :: shrinkInterval not found');
                    return; // This prevents crash from index out of bounds issue
                }

                clearInterval(games.shrinkIntervals[s].interval); // Stop shrinking the world
            }
        });
    }

    /**
     * Listen for round delay event from client
     */
    listen_round_delay(games) {
        this.socket.on('round delay', (game) => {
            const g = games.getIndexByHost(game.info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_round_delay :: Game not found in {Games}.list with host ${game.info.host}`);
                return;
            }
            if (games.list[g].rounds.delayed) { // If round delay has already begun (if the 'round delay' emit happened twice accidentally)
                console.error(`[WARN]  :: listen_round_delay :: Round delay has already begun`);
                return;
            }

            games.list[g].rounds.waiting = true;
            games.list[g].rounds.delayed = true;
            games.list[g].rounds.delaystart = (new Date()).valueOf();

            let delay = setTimeout(() => {
                games.list[g].rounds.waiting = false; // Start Round
                games.list[g].rounds.delayed = false;
                if (game.info.mode === 'srv') { // If is survival mode
                    games.setShrinkInterval(game);
                }
                games.list[g].rounds.start = (new Date()).valueOf();
            }, this.config.delay_time);

            let spawndelay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
                this.io.in(game.info.title).emit('force spawn');
            }, this.config.delay_time - 1000);
        });
    }

    /**
     * Listen for board event from client
     *    Update server-side board data
     */
    listen_board(games) {
        /**
         * @param {Object} data { list: board.list, host: game.board.host }
         */
        this.socket.on('board', (data) => {
            const g = games.getIndexByHost(data.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_board :: Game not found in {Games}.list with host ${data.host}`);
                return; // Return here prevents an index out of bounds exception
            }

            games.list[g].board.list = data.list;
        });
    }

    /**
     * Listen for org event from client
     *    Update server-side org data
     */
    listen_org(games) {
        /*
         * Update Server Org
         * @param data: {
         *     cells: org.cells,
         *     off: org.off,
         *     pos: org.pos,
         *     cursor: org.cursor,
         *     color: org.color,
         *     skin: org.skin,
         *     team: org.team,
         *     coefficient: org.coefficient,
         *     range: org.range
         *  }
         */
        this.socket.on('org', ({ cells, off, pos, cursor, color, skin, team, coefficient, range }) => {
            const indices = games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: listen_org :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds issue
            } else if (indices.p === -1) {
                console.error(`[ERROR] :: listen_org :: Player not found in {Games}.list[].orgs with id ${this.socket.id}`);
                return; // Return here prevents an index out of bounds issue
            }

            // games.list[indices.g].orgs[indices.p] = org; // Latency is decreased by only sending necessary data rather than the entire org object
            games.list[indices.g].orgs[indices.p].cells = cells; // Only the following attributes of org need to be updated and shared
            games.list[indices.g].orgs[indices.p].count = cells.length;
            games.list[indices.g].orgs[indices.p].off = off;
            games.list[indices.g].orgs[indices.p].pos = cursor;
            games.list[indices.g].orgs[indices.p].color = color;
            games.list[indices.g].orgs[indices.p].skin = skin;
            games.list[indices.g].orgs[indices.p].team = team;
            games.list[indices.g].orgs[indices.p].coefficient = coefficient;
            games.list[indices.g].orgs[indices.p].range = range;
        });
    }

    /**
     * Listen for ability event from client
     */
    listen_ability(games) {
        this.socket.on('ability', (ability) => {
            const indices = games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: listen_ability :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            games.list[indices.g].abilities[indices.p] = ability;
        });
    }

    /**
     * Listen for team event from client
     */
    listen_teams(games) {
        this.socket.on('Teams', (data) => { // data: { teams: game.teams, host: game.info.host }
            const g = games.getIndexByHost(data.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_teams :: Game not found in {Games}.list with host ${data.host}`);
                return;
            }

            games.list[g].teams = data.teams;
        });
    }

    /**
     * Listen for flag event from client
     */
    listen_flag(games) {
        /**
         * Update the server's instance of game's flag
         * @param {Object} data {
         *       flag: game.flag,
         *       host: game.info.host
         *    }
         */
        this.socket.on('flag', (data) => { // Be careful
            const g = games.getIndexByHost(data.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_flag :: Game not found in {Games}.list with host ${data.host}`);
                return;
            }

            games.list[g].flag = data.flag;
        });
    }

    /**
     * Listen for dead event from client
     */
    listen_dead(games) {
        this.socket.on('dead', (spectating) => {
            const indices = games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: listen_dead :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            games.list[indices.g].players.splice(indices.p, 1); // User is no longer a player, but a spectator
            games.list[indices.g].abilities.splice(indices.p, 1); // Abilities array should be indexed identically to players array
            games.list[indices.g].orgs.splice(indices.p, 1); // Orgs array should be indexed identically to players array
            games.list[indices.g].info.count--; // One less player in the game

            if (spectating) {
                this.socket.emit('Spectate'); // Dead player becomes spectator
            }
        });
    }

    /**
     * Listen for ability events from client
     * The client emitting the event is requesting to the server that his ability be applied to either himself or an opponent
     *    Standard: Extend, Compress, Immortality, Freeze, Neutralize, Toxin, Spore
     *    Special: Tag
     *    Old: Speed, Slow, Stimulate, Poison
     */
    listen_abilities() {
        /**
         * Emit an ability to the specified player
         * @param {String} ability The ability to be applied
         *                            First letter is capitalized
         * @param {String} player The player to whom the ability will be applied
         *                           Corresponds to a socket.id String in the player's game's org array
         */
        const emit_ability = (ability, player) => { // Function expressions are not hoisted, so must be declared above usages
            if (player === this.socket.id) {
                this.socket.emit(ability); // Arrow function or bind is necessary in order for 'this' to point to the correct object
            } else {
                this.socket.to(player).emit(ability);
            }
        };

        this.socket.on('extend', player => emit_ability('Extend', player));
        this.socket.on('compress', player => emit_ability('Compress', player));
        this.socket.on('immortality', player => emit_ability('Immortality', player));
        this.socket.on('freeze', player => emit_ability('Freeze', player));
        this.socket.on('neutralize', player => emit_ability('Neutralize', player));
        this.socket.on('toxin', player => emit_ability('Toxin', player));
        this.socket.on('tag', player => emit_ability('Tag', player)); // UNRELEASED
        // this.socket.on('Speed', player => emit_ability('Speed', player)); // OLD
        // this.socket.on('Slow', player => emit_ability('Slow', player)); // OLD
        // this.socket.on('Stimulate', player => emit_ability('Stimulate', player)); // OLD
        // this.socket.on('Poison', player => emit_ability('Poison', player)); // OLD
    }

    /**
     * Remove a member from his game
     *    Depends if the member is a host or not
     * @param {Games} games The server's games object
     */
    removeMember(games) {
        const index = games.getIndexByHost(this.socket.id);
        const isHost = index !== -1;
        if (isHost) { // If current socket is the host of his game, end the game
            const indices = games.getIndicesByMember(this.socket.id, index);
            if (indices.g === -1) {
                console.error(`[ERROR] :: removeMember :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            const game = games.list[indices.g];

            this.io.to(game.info.title).emit('game ended', game); // Remove Players From Hosted Game
            this.io.of('/').in(game.info.title).clients((error, clients) => {
                if (error) throw error;
                clients.forEach(id => {
                    let member = this.io.sockets.sockets[id];
                    member.leave(game.info.title); // Remove all players from Socket.io room
                    member.inGame = false;
                });
            });

            let secured_count = games.securities.length;
            for (let s = 0; s < secured_count; s++) {
                if (games.securities[s].title === game.info.title) {
                    games.securities.splice(s, 1); // Remove password form securities collection
                    break;
                }
            }

            clearInterval(games.intervals[indices.g]); // Clear Game Interval
            games.list.splice(indices.g, 1); // Remove game from games.list
            games.intervals.splice(indices.g, 1); // Remvoe the game's interval from the collection of intervals

            const shrink_index = games.getShrinkIndex(this.socket.id);
            if (shrink_index !== -1) {
                clearInterval(games.shrinkIntervals[shrink_index].interval);
                games.shrinkIntervals.splice(shrink_index, 1);
            }


            if (this.config.project_state === 'development') console.log('                                               Game Removed: ' + game.info.title + ' (' + game.info.host + ')');
        } else { // If current socket is not the host of his game
            const indices = games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: removeMember :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            const game = games.list[indices.g];
            if (game === undefined) return; // If this socket is not a member of any game, don't do anything (would crash server otherwise)

            this.socket.leave(game.info.title); // Leave 'Game' Room

            game.board.list.splice(indices.l, 1); // Remove member from the leaderboard
            if (indices.p !== -1) { // If member is a player
                game.players.splice(indices.p, 1); // Remove player from game's players list
                game.orgs.splice(indices.p, 1); // Remove player's org from game's orgs list (Orgs array should be indexed identically to players array)
                game.abilities.splice(indices.p, 1); // Remove player's abilities from game's abilities list (Abilities array should be indexed identically to players array)
                game.info.count--; // Reduce the number of players in the game
                if (game.teams.length > 0) { // If is a team game, remove player from team
                    let team = game.teams[this.config.colors.teams.indexOf(game.orgs[indices.p].team)]; // Identify player's team
                    team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                }

                if (this.config.project_state === 'development') console.log('                                               Player Left: ' + game.info.title + ' (' + this.socket.id + ')');
            } else { // If member is a spectator
                game.spectators.splice(indices.s, 1); // Remove spectator from spectators array

                if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + game.info.title + ' (' + this.socket.id + ')');
            }
        }
    }
}

module.exports = SocketListener;
