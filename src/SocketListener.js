const Permissions = require('./Permissions.js');

class SocketListener {
    /**
     * Construct a new SocketListener instance
     * @param {WebSocket} socket The socket to which to listen
     * @param io The socketio module
     * @param {Games} games The server's Games instance
     * @param {Object} config The server's configurations
     */
    constructor(socket, io, games, config) {
        this.socket = socket;
        this.io = io;
        this.games = games;
        this.config = config;
    }

    /**
     * Listen for a new connection to the socketio server
     *    Initialize all other socketio listeners
     */
    listen() {
        this.games.connections++;
        if (this.config.project_state === 'development') console.log('Client connected:     ' + this.socket.id + ' (' + this.games.connections + ')'); // Server Message

        this.socket.join('lobby'); // Join 'lobby' room in '/' namespace
        this.socket.inGame = false;

        // Socket Management
        this.listen_disconnect();

        // Control Flow
        this.listen_leave_game();
        this.listen_game_ended();
        this.listen_create_game();
        this.listen_create_password();
        this.listen_ask_permission();
        this.listen_check_permission();
        this.listen_player_joined();
        this.listen_respawn();
        this.listen_spectator_joined();
        this.listen_spectator_left();
        this.listen_end_round();
        this.listen_preround_delay();
        this.listen_cancel_preround_delay();
        this.listen_die();

        // Data Congruence
        this.listen_board();
        this.listen_org();
        this.listen_teams();
        this.listen_flag();
        this.listen_ability();

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
    listen_disconnect() {
        this.socket.on('disconnect', () => {
            this.games.connections--;
            if (this.config.project_state === 'development') console.log('Client disconnected:  ' + this.socket.id + ' (' + this.games.connections + ')'); // Server Message

            if (this.socket.inGame) { // If client is in a game
                this.removeMember(); // Remove the client from the game and update the game's information
            } // Nothing else is necessary because client is disconnecting from the server entirely
        });
    }

    /**
     * Listen for leave game event from client
     */
    listen_leave_game() {
        this.socket.on('leave game', () => {
            this.removeMember();

            this.socket.join('lobby');
            this.socket.inGame = false;
        });
    }

    /**
     * Listen for game ended event from client
     */
    listen_game_ended() {
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
                    this.games.securities.delete(game.info.host);
                }
                this.games.remove(game.info.host);

                if (this.config.project_state === 'development') console.log('                                               Game Deleted: ' + game.info.title + ' (' + game.info.host + ')'); // Before game deletion so game info can be attained before it is deleted
            }
        });
    }

    /**
     * Listen for create game event from client
     */
    listen_create_game() {
        /**
         * Create a game instance on the server and emit it to all clients
         * @param {Game} The new Game object
         */
        this.socket.on('create game', (game) => {
            this.games.createGame(game, this.socket.id, this.io);

            // Switching to game's room is necessary here (rather than waiting until join) so game is deleted correctly if client disconnects before joining, but after creating
            this.socket.leave('lobby'); // Leave 'lobby' Room (this.socket.io)
            this.socket.join(game.info.title); // Join 'Game' Room (this.socket.io)
            this.socket.inGame = true;
        });
    }

    /**
     * Listen for create password event from client
     */
    listen_create_password() {
        this.socket.on('create password', ({ pass, info }) => {
            let permissions = new Permissions(info.title, pass);
            permissions.permiss(this.socket.id);
            this.games.securities.set(info.host, permissions);
        });
    }

    /**
     * Verify Password on Join or Spectate
     *    Callback with argument 'true' if client is permissed, else callback 'false'
     */
    listen_ask_permission() {
        this.socket.on('ask permission', ({ pass, info }, callback) => {
            let permissions = this.games.securities.get(info.host);
            if (info.title === permissions.title && pass === permissions.password) {
                permissions.permiss(this.socket.id);
                if (callback) callback(true); // The callback function is not currently in use
            }
            if (callback) callback(false);
        });
    }

    /**
     * Check if the player is permitted entry into game
     */
    listen_check_permission() {
        /**
         * Check if the player is permitted entry into a game
         *    Responds to the client with a callback specified by the client
         * @param {String} host The host of the game in question
         * @param {Function} callback  Will be called with a resultant value fed as an argument
         *                                 Run by the client after called on the server
         */
        this.socket.on('check permission', (host, callback) => {
            let has_password = false;
            let granted = false;

            if (this.games.securities.has(host)) {
                has_password = true;
                if (this.games.securities.get(host).isPermissed(this.socket.id)) {
                    granted = true;
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
     * Listen for dead event from client
     */
    listen_die() {
        this.socket.on('die', ({spectating, host}) => {
            this.kill(this.socket.id, host);

            if (spectating) {
                this.socket.emit('spectate'); // Dead player becomes spectator
            }
        });
    }

    /**
     * Listen for player joined event from client
     */
    listen_player_joined() {
        /**
         * Player Joined emit listener
         * @param {
         *           info: game.info,
         *           org: compressedOrg,
         *           ability: ability
         *        }
         */
        this.socket.on('join player', ({info, org, ability}, enter) => {
            this.socket.leave('lobby'); // Leave 'lobby' Room
            this.socket.join(info.title); // Join 'Game' Room
            this.socket.inGame = true;

            this.spawn(this.socket.id, org, ability, info.host);
            enter();
        });
    }

    /**
     * Listen for the 'respawn' event from a client
     */
    listen_respawn() {
        this.socket.on('respawn', ({host, org, ability}, enter) => { // 'org' is a compressed {Org}
            this.spawn(this.socket.id, org, ability, host); // Spawn already handles the removal-of-spectator possibility
            enter();
        });
    }

    /**
     * Listen for 'join spectator' event from client
     */
    listen_spectator_joined() {
        this.socket.on('join spectator', (game) => {
            this.socket.leave('lobby'); // Leave 'lobby' Room
            this.socket.join(game.info.title); // Join 'Game' Room
            this.socket.inGame = true;

            game.spectators.push(this.socket.id);
            if (this.config.project_state === 'development') console.log('                                               Spectator Spawned: ' + game.info.title + ' (' + this.socket.id + ')');
        });
    }

    /**
     * Listen for remove spectator event from client
     */
    listen_spectator_left() {
        this.socket.on('remove spectator', (host) => {
            let game = this.games.map.get(host);
            for (let s = 0; s < game.spectators.length; s++) {
                if (game.spectators[s] === this.socket.id) {
                    game.spectators.splice(s, 1);
                    break;
                }
            }
        });
    }

    /**
     * Listen for end round event from client
     */
    listen_end_round() {
        /**
         * End Round
         *    Received upon round of survival ending after only one player stands (or zero if multiple die on same tick)
         *    Starts a new 'end round' delay which waits 'delay_time'-many milliseconds before resetting to the 'waiting-for-players' delay
         * @param  {Object} {Game}.info
         */
        this.socket.on('end round', (info) => { // info is game.info
            let game = this.games.map.get(info.host);

            game.rounds.waiting = false;
            game.rounds.delayed = true;
            game.rounds.delaystart = (new Date()).valueOf();

            let delay = setTimeout(() => { // End of round delay
                let game = this.games.map.get(info.host);
                let shrink = this.games.shrinkIntervals.get(info.host);

                game.world.width = shrink.width; // shrink.world is preserved from 'round delay'
                game.world.height = shrink.height; // Reset world width and height
                this.games.shrinkIntervals.delete(info.host); // Remove shrink interval

                game.rounds.waiting = true; // When the 'end of round' delay finishes, the 'start of round' delay begins
                game.rounds.delayed = false;

                this.forceSpawn(game);
            }, this.config.delay_time);

            if (info.mode === 'srv') {
                let shrink = this.games.shrinkIntervals.get(info.host);
                clearInterval(this.games.shrinkIntervals[s].interval); // Stop shrinking the world
            }
        });
    }

    /**
     * Listen for the 'preround delay' event from the client
     */
    listen_preround_delay() {
        this.socket.on('preround delay', (host) => {
            let game = this.games.map.get(host);

            if (game.rounds.delayed) { // If round delay has already begun (if the 'round delay' emit happened twice accidentally)
                console.error(`[WARN]  :: listen_preround_delay :: Round delay has already begun`);
                return;
            }

            game.rounds.waiting = true;
            game.rounds.delayed = true;
            game.rounds.delaystart = (new Date()).valueOf();

            let preround_delay = setTimeout(() => {
                let game = this.games.map.get(host);

                game.rounds.waiting = false; // Start Round
                game.rounds.delayed = false;
                if (game.info.mode === 'srv') { // If is survival mode
                    this.games.setShrinkInterval(host);
                }
                game.rounds.start = (new Date()).valueOf();
            }, this.config.delay_time);

            let spawn_delay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
                this.forceSpawn(game);
            }, this.config.delay_time - 1000);

            this.games.preRoundTimeouts.set(host, preround_delay);
            this.games.forceSpawnTimeouts.set(host, spawn_delay);
        });
    }

    /**
     * Listen for the 'cancel preround delay' event from the client
     */
    listen_cancel_preround_delay() {
        this.socket.on('cancel preround delay', (host) => {
            let game = this.games.map.get(host);

            if (!game.rounds.delayed) {
                console.error(`[ERROR] :: listen_cancel_preround_delay :: Not during the pre-round delay`);
                return;
            }

            game.rounds.waiting = true;
            game.rounds.delayed = false;
            game.rounds.delaystart = null;
            clearTimeout(this.games.preRoundTimeouts.get(host));
            clearTimeout(this.games.forceSpawnTimeouts.get(host));
        });
    }

    /**
     * Listen for board event from client
     *    Update server-side board information
     */
    listen_board() {
        /**
         * @param {Object} { list: board.list, host: game.board.host }
         */
        this.socket.on('board', ({ list, host }) => {
            let game = this.games.map.get(host);
            game.board.list = list;
        });
    }



    /**
     * Listen for org event from client
     *    Update server-side org information
     */
    listen_org() {
        /*
         * Update Server Org
         * @param {
         *     cells: org.cells,
         *     offset: org.off,
         *     pos: org.pos,
         *     cursor: org.cursor,
         *     color: org.color,
         *     skin: org.skin,
         *     team: org.team,
         *     coefficient: org.coefficient,
         *     range: org.range
         *  }
         */
        this.socket.on('org', ({ cells, offset, pos, cursor, color, skin, team, coefficient, range }) => {
            let game = this.games.map.get(host);
            let org_index = -1;
            for (let o = 0; o < game.info.player_count; o++) {
                if (game.orgs[o].player === this.socket.id) {
                    org_index = o;
                    break;
                }
            }

            // game.orgs[org_index] = org; // Latency is decreased by only sending necessary information rather than the entire org object
            game.orgs[org_index].cells = cells; // Only the following attributes of org need to be updated and shared
            game.orgs[org_index].count = cells.length;
            game.orgs[org_index].off = offset;
            game.orgs[org_index].pos = cursor;
            game.orgs[org_index].color = color;
            game.orgs[org_index].skin = skin;
            game.orgs[org_index].team = team;
            game.orgs[org_index].coefficient = coefficient;
            game.orgs[org_index].range = range;
        });
    }

    /**
     * Listen for ability event from client
     */
    listen_ability() {
        this.socket.on('ability', ({ ability, host }) => {
            let game = this.games.map.get(host);
            let player_index = -1;
            console.log(this.socket.id, game, ability);
            for (let i = 0; i < game.info.player_count; i++) {
                if (game.players[i].player === this.socket.id) {
                    player_index = i;
                }
            }

            if (player_index === -1) {
                console.error(`[ERROR] :: listen_ability :: Player not found in game with host ${host}`);
            }

            game.abilities[player_index] = ability;
        });
    }

    /**
     * Listen for team event from client
     */
    listen_teams() {
        this.socket.on('teams', ({teams, host}) => {
            let game = this.games.map.get(host);
            game.teams = teams;
        });
    }

    /**
     * Listen for flag event from client
     */
    listen_flag() {
        /**
         * Update the server's instance of game's flag
         * @param {Object} {
         *       flag: game.flag,
         *       host: game.info.host
         *    }
         */
        this.socket.on('flag', ({ flag, host }) => { // Be careful
            let game = this.games.map.get(host);
            game.flag = flag;
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

        this.socket.on('extend', player => emit_ability('extend', player));
        this.socket.on('compress', player => emit_ability('compress', player));
        this.socket.on('immortality', player => emit_ability('immortality', player));
        this.socket.on('freeze', player => emit_ability('freeze', player));
        this.socket.on('neutralize', player => emit_ability('neutralize', player));
        this.socket.on('toxin', player => emit_ability('toxin', player));
        this.socket.on('tag', player => emit_ability('tag', player)); // UNRELEASED
        // this.socket.on('speed', player => emit_ability('speed', player)); // OLD
        // this.socket.on('slow', player => emit_ability('slow', player)); // OLD
        // this.socket.on('stimulate', player => emit_ability('stimulate', player)); // OLD
        // this.socket.on('poison', player => emit_ability('poison', player)); // OLD
    }

    /**
     * Remove a member from his game
     *    Depends if the member is a host or not
     */
    removeMember(host) {
        let game = this.games.get(host);

        if (this.socket.id === host) { // If current socket is the host of his game, end the game
            this.io.to(game.info.title).emit('game ended', game); // Remove Players From Hosted Game
            this.io.of('/').in(game.info.title).clients((error, clients) => {
                if (error) throw error;
                clients.forEach(id => {
                    let member = this.io.sockets.sockets[id];
                    member.leave(game.info.title); // Remove all players from Socket.io room
                    member.inGame = false;
                });
            });

            this.games.securities.remove(host); // Remove password form securities collection
            clearInterval(this.games.intervals.get(host)); // Clear Game Interval
            this.games.map.delete(host); // Remove game from this.games.list
            this.games.intervals.delete(host); // Remvoe the game's interval from the collection of intervals
            clearInterval(this.games.shrinkIntervals.get(host).interval);
            this.games.shrinkIntervals.delete(host);

            if (this.config.project_state === 'development') console.log('                                               Game Removed: ' + game.info.title + ' (' + game.info.host + ')');
        } else { // If current socket is not the host of his game
            const game = this.games.map.get(host);
            if (game === undefined) return; // If this socket is not a member of any game, don't do anything (would crash server otherwise)

            this.socket.leave(game.info.title); // Leave 'Game' Room

            let list_index = -1;
            for (let l = 0; l < game.board.list.length; l++) {
                if (game.board.list[l].id === this.socket.id) {
                    list_index = l;
                    break;
                }
            }
            let player_index = -1;
            for (let p = 0; p < game.info.player_count; p++) {
                if (game.players[p] === this.socket.id) {
                    player_index = p;
                    break;
                }
            }
            game.board.list.splice(l, 1); // Remove member from the leaderboard
            if (player_index === -1) { // If member is a spectator
                let spectator_index = -1;
                for (let s = 0; s < game.spectators.length; s++) {
                    spectator_index = s;
                }

                game.spectators.splice(spectator_index, 1); // Remove spectator from spectators array

                if (this.config.project_state === 'development') console.log('                                               Spectator Left: ' + game.info.title + ' (' + this.socket.id + ')');
            } else { // If member is a player
                game.players.splice(player_index, 1); // Remove player from game's players list
                game.orgs.splice(player_index, 1); // Remove player's org from game's orgs list (Orgs array should be indexed identically to players array)
                game.abilities.splice(player_index, 1); // Remove player's abilities from game's abilities list (Abilities array should be indexed identically to players array)
                game.info.player_count--; // Reduce the number of players in the game
                if (game.teams.length > 0) { // If is a team game, remove player from team
                    let team = game.teams[this.config.colors.teams.indexOf(game.orgs[player_index].team)]; // Identify player's team
                    team.splice(team.indexOf(this.socket.id), 1); // Remove player from team
                }

                if (this.config.project_state === 'development') console.log('                                               Player Left: ' + game.info.title + ' (' + this.socket.id + ')');
            }
        }
    }

    /**
     * Kill the given player
     * @param player The player to be killed
     * @param host The host of the game the player is in
     */
    kill(player, host) {
        const g = this.games.getIndexByHost(host); // It is faster to get the index of game from host and feeding that as a starting point into getIndicesByMember (O(n^3) -> O(n^2))
        if (g === -1) {
            console.error(`[ERROR] :: {SocketListener}.spawn :: Game not found in {Games}.list with member ${this.socket.id}`);
            return; // Return here prevents an index out of bounds exception
        }
        const indices = this.games.getIndicesByMember(this.socket.id, g);

        let game = this.games.list[indices.g];
        game.players.splice(indices.p, 1); // User is no longer a player, but a spectator
        game.abilities.splice(indices.p, 1); // Abilities array should be indexed identically to players array
        game.orgs.splice(indices.p, 1); // Orgs array should be indexed identically to players array
        game.info.player_count = game.players.length; // player_count-- is problematic (probably due to odd emission timings)

        if (this.config.project_state === 'development') console.log('                                               Player Died: ' + game.info.title + ' (' + player + ')');
    }

    /**
     * Spawn the given player into the game
     * @param player The player to be spawned
     * @param org The player's Org instance
     * @param ability The player's Ability instance
     * @param host The host of the game the player is in
     *             This property allows for more efficient searching of {Games}.list
     */
    spawn(player, org, ability, host) {
        const g = this.games.getIndexByHost(host); // It is faster to get the index of game from host and feeding that as a starting point into getIndicesByMember (O(n^3) -> O(n^2))
        if (g === -1) {
            console.error(`[ERROR] :: {SocketListener}.spawn :: Game not found in {Games}.list with host ${host}`);
            return; // Return here prevents an index out of bounds exception
        }
        const indices = this.games.getIndicesByMember(player, g);
        let game = this.games.list[g];

        if (indices.s !== -1) { // If player is a spectator
            game.spectators.splice(indices.s, 1); // Remove spectator from spectators list
        }
        game.players.push(player); // Add player to server's list of players in game
        game.orgs.push(org); // Create server instance of compressed org (no functions)
        game.abilities.push(ability); // Create server instance of ability
        game.info.player_count = game.players.length; // player_count++ is problematic
        if (indices.s !== -1) { // If player is a spectator
            game.spectators.splice(indices.s, 1); // Remove spectator from spectators list
        }

        if (this.config.project_state === 'development') console.log('                                               Player Spawned: ' + game.info.title + ' (' + player + ')');
    }

    /**
     * Force all members of the given game to respawn
     * @param game The game to be modified
     */
    forceSpawn(game) {
        this.io.of('/').in(game.info.title).clients((error, clients) => { // Get each client in room
            clients.forEach(client => {
                this.kill(client, game.info.host);          // Kill all the Orgs in the game
            });
        });
        this.io.in(game.info.title).emit('force spawn');    // Force all Orgs in the game to respawn
    }
}

module.exports = SocketListener;

/**
 * Socket.io Quick Reference
 *
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
