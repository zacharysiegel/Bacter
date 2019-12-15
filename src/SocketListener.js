const Permissions = require('./Permissions.js');

class SocketListener {
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
        this.socket.emit('games', { list: this.games.list, connections: this.games.connections }); // Copied from 'Games Request'

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
                    let password_count = this.games.securities.length;
                    for (let p = 0; p < password_count; p++) {
                        if (this.games.securities[p].title === game.info.title) { // Find game's security info and remove it
                            this.games.securities.splice(p, 1);
                            break;
                        }
                    }
                }

                const g = this.games.getIndexByHost(game.info.host); // Location of game in this.games.list (O(n))
                if (g === -1) {
                    console.error(`[ERROR] :: listen_game_ended :: Game not found in {Games}.list with host ${game.info.host}`);
                    return;
                }

                this.games.list.splice(g, 1); // Delete Game
                clearInterval(this.games.intervals[g]); // Clear Game Interval
                this.games.intervals.splice(g, 1);

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
     * @param {Games} games Game instance
     */
    listen_create_password() {
        this.socket.on('create password', ({ pass, info }) => {
            let permissions = new Permissions(info.title, pass);
            permissions.permiss(this.socket.id);
            this.games.securities.push(permissions);
        });
    }

    /**
     * Verify Password on Join or Spectate
     *    Callback with argument 'true' if client is permissed, else callback 'false'
     */
    listen_ask_permission() {
        this.socket.on('ask permission', ({ pass, info }, callback) => {
            let len = this.games.securities.length;
            for (let i = 0; i < len; i++) {
                let permissions = this.games.securities[i];
                if (info.title === permissions.title && pass === permissions.password) {
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
    listen_check_permission() {
        /**
         * Check if the player is permitted entry into a game
         *    Responds to the client with a callback specified by the client
         * @param {String} title Corresponds to game.info.title
         * @param {Function} callback  Will be called with a resultant value fed as an argument
         *                                 Run by the client after called on the server
         */
        this.socket.on('check permission', (title, callback) => {
            let has_password = false;
            let granted = false;
            let secured_count = this.games.securities.length;

            for (let i = 0; i < secured_count; i++) {
                if (this.games.securities[i].title === title) { // Identify game
                    has_password = true;
                    if (this.games.securities[i].isPermissed(this.socket.id)) {
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

            const g = this.games.getIndexByHost(game.info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_spectator_joined :: Game not found in {Games}.list with host ${game.info.host}`);
                return;
            }

            this.games.list[g].spectators.push(this.socket.id);
            if (this.config.project_state === 'development') console.log('                                               Spectator Spawned: ' + this.games.list[g].info.title + ' (' + this.socket.id + ')');
        });
    }

    /**
     * Listen for remove spectator event from client
     */
    listen_spectator_left() {
        this.socket.on('remove spectator', (host) => {
            const g = this.games.getIndexByHost(host); // It is faster to get the index of game from host and feeding that as a starting point into getIndicesByMember
            if (g === -1) {
                console.error(`[ERROR] :: listen_spectator_left :: Game not found in {Games}.list with host ${host}`);
                return; // Return here prevents an index out of bounds exception
            }
            const indices = this.games.getIndicesByMember(this.socket.id, g);
            if (indices.s === -1) {
                console.error(`[ERROR] :: listen_spectator_left :: Spectator not found with ID ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            this.games.list[g].spectators.splice(indices.s, 1); // Remove spectator from spectators list
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
            const g = this.games.getIndexByHost(info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_end_round :: Game not found in {Games}.list with host ${info.host}`);
                return;
            }

            this.games.list[g].rounds.waiting = false;
            this.games.list[g].rounds.delayed = true;
            this.games.list[g].rounds.delaystart = (new Date()).valueOf();

            let delay = setTimeout(() => { // End of round delay
                const g = this.games.getIndexByHost(info.host); // The value of g is saved in the Closure, but it may change by the time the timeout is called, so it must be recalculated
                if (g === -1) { // Game could have been deleted concurrently while the timeout was waiting
                    return;
                }

                const s = this.games.getShrinkIndex(info.host); // Must recalculate the shrink index in case of concurrent modification
                if (s === -1) {
                    console.error(`[ERROR] :: listen_end_round|delay :: Shrink interval not found`);
                    return;
                }

                this.games.list[g].world.width = this.games.shrinkIntervals[s].width; // this.games.shrinkIntervals[s].world is preserved from 'round delay'
                this.games.list[g].world.height = this.games.shrinkIntervals[s].height; // Reset world width and height
                this.games.shrinkIntervals.splice(s, 1); // Remove shrink interval

                this.games.list[g].rounds.waiting = true; // When the 'end of round' delay finishes, the 'start of round' delay begins
                this.games.list[g].rounds.delayed = false;

                this.forceSpawn(this.games.list[g]);
            }, this.config.delay_time);

            if (info.mode === 'srv') {
                const s = this.games.getShrinkIndex(info.host);
                if (s === -1) { // This will occur if the 'end round' was emitted multiple times at the end of a single round, this will usually not occur
                    console.error('[WARN] :: listen_end_round :: shrinkInterval not found');
                    return; // This prevents crash from index out of bounds issue
                }

                clearInterval(this.games.shrinkIntervals[s].interval); // Stop shrinking the world
            }
        });
    }

    /**
     * Listen for the 'preround delay' event from the client
     */
    listen_preround_delay() {
        this.socket.on('preround delay', (game) => {
            const g = this.games.getIndexByHost(game.info.host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_preround_delay :: Game not found in {Games}.list with host ${game.info.host}`);
                return;
            } else if (this.games.list[g].rounds.delayed) { // If round delay has already begun (if the 'round delay' emit happened twice accidentally)
                console.error(`[WARN]  :: listen_preround_delay :: Round delay has already begun`);
                return;
            }

            this.games.list[g].rounds.waiting = true;
            this.games.list[g].rounds.delayed = true;
            this.games.list[g].rounds.delaystart = (new Date()).valueOf();

            let preround_delay = setTimeout(() => {
                const g = this.games.getIndexByHost(game.info.host);
                if (g === -1) { // Game could have been deleted concurrently while the timeout was waiting
                    return;
                }

                this.games.list[g].rounds.waiting = false; // Start Round
                this.games.list[g].rounds.delayed = false;
                if (game.info.mode === 'srv') { // If is survival mode
                    this.games.setShrinkInterval(game);
                }
                this.games.list[g].rounds.start = (new Date()).valueOf();
            }, this.config.delay_time);

            let spawn_delay = setTimeout(() => { // Force spawns 1 second before round starts so one player does not join before the others and automatically win game
                this.forceSpawn(this.games.list[g]);
            }, this.config.delay_time - 1000);

            this.games.preRoundTimeouts[game.info.host] = preround_delay;
            this.games.forceSpawnTimeouts[game.info.host] = spawn_delay;
        });
    }

    /**
     * Listen for the 'cancel preround delay' event from the client
     */
    listen_cancel_preround_delay() {
        this.socket.on('cancel preround delay', (host) => {
            const g = this.games.getIndexByHost(host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_cancel_preround_delay :: Game not found in {Games}.list with host ${host}`);
                return;
            } else if (!this.games.list[g].rounds.delayed) {
                console.error(`[ERROR] :: listen_cancel_preround_delay :: Not during the pre-round delay`);
                return;
            }

            this.games.list[g].rounds.waiting = true;
            this.games.list[g].rounds.delayed = false;
            this.games.list[g].rounds.delaystart = null;
            clearTimeout(this.games.preRoundTimeouts[host]);
            clearTimeout(this.games.forceSpawnTimeouts[host]);
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
            const g = this.games.getIndexByHost(host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_board :: Game not found in {Games}.list with host ${host}`);
                return; // Return here prevents an index out of bounds exception
            }

            this.games.list[g].board.list = list;
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
            const indices = this.games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: listen_org :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds issue
            } else if (indices.p === -1) {
                console.error(`[ERROR] :: listen_org :: Player not found in {Games}.list[].orgs with id ${this.socket.id}`);
                return; // Return here prevents an index out of bounds issue
            }

            // this.games.list[indices.g].orgs[indices.p] = org; // Latency is decreased by only sending necessary information rather than the entire org object
            this.games.list[indices.g].orgs[indices.p].cells = cells; // Only the following attributes of org need to be updated and shared
            this.games.list[indices.g].orgs[indices.p].count = cells.length;
            this.games.list[indices.g].orgs[indices.p].off = offset;
            this.games.list[indices.g].orgs[indices.p].pos = cursor;
            this.games.list[indices.g].orgs[indices.p].color = color;
            this.games.list[indices.g].orgs[indices.p].skin = skin;
            this.games.list[indices.g].orgs[indices.p].team = team;
            this.games.list[indices.g].orgs[indices.p].coefficient = coefficient;
            this.games.list[indices.g].orgs[indices.p].range = range;
        });
    }

    /**
     * Listen for ability event from client
     */
    listen_ability() {
        this.socket.on('ability', (ability) => {
            const indices = this.games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: listen_ability :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            this.games.list[indices.g].abilities[indices.p] = ability;
        });
    }

    /**
     * Listen for team event from client
     */
    listen_teams() {
        this.socket.on('teams', ({teams, host}) => {
            const g = this.games.getIndexByHost(host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_teams :: Game not found in {Games}.list with host ${host}`);
                return;
            }

            this.games.list[g].teams = teams;
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
            const g = this.games.getIndexByHost(host);
            if (g === -1) {
                console.error(`[ERROR] :: listen_flag :: Game not found in {Games}.list with host ${host}`);
                return;
            }

            this.games.list[g].flag = flag;
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
     */
    removeMember() {
        const index = this.games.getIndexByHost(this.socket.id);
        const isHost = index !== -1;
        if (isHost) { // If current socket is the host of his game, end the game
            const indices = this.games.getIndicesByMember(this.socket.id, index);
            if (indices.g === -1) {
                console.error(`[ERROR] :: removeMember :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            const game = this.games.list[indices.g];

            this.io.to(game.info.title).emit('game ended', game); // Remove Players From Hosted Game
            this.io.of('/').in(game.info.title).clients((error, clients) => {
                if (error) throw error;
                clients.forEach(id => {
                    let member = this.io.sockets.sockets[id];
                    member.leave(game.info.title); // Remove all players from Socket.io room
                    member.inGame = false;
                });
            });

            let secured_count = this.games.securities.length;
            for (let s = 0; s < secured_count; s++) {
                if (this.games.securities[s].title === game.info.title) {
                    this.games.securities.splice(s, 1); // Remove password form securities collection
                    break;
                }
            }

            clearInterval(this.games.intervals[indices.g]); // Clear Game Interval
            this.games.list.splice(indices.g, 1); // Remove game from this.games.list
            this.games.intervals.splice(indices.g, 1); // Remvoe the game's interval from the collection of intervals

            const shrink_index = this.games.getShrinkIndex(this.socket.id);
            if (shrink_index !== -1) {
                clearInterval(this.games.shrinkIntervals[shrink_index].interval);
                this.games.shrinkIntervals.splice(shrink_index, 1);
            }

            if (this.config.project_state === 'development') console.log('                                               Game Removed: ' + game.info.title + ' (' + game.info.host + ')');
        } else { // If current socket is not the host of his game
            const indices = this.games.getIndicesByMember(this.socket.id);
            if (indices.g === -1) {
                console.error(`[ERROR] :: removeMember :: Game not found in {Games}.list with member ${this.socket.id}`);
                return; // Return here prevents an index out of bounds exception
            }

            const game = this.games.list[indices.g];
            if (game === undefined) return; // If this socket is not a member of any game, don't do anything (would crash server otherwise)

            this.socket.leave(game.info.title); // Leave 'Game' Room

            game.board.list.splice(indices.l, 1); // Remove member from the leaderboard
            if (indices.p !== -1) { // If member is a player
                game.players.splice(indices.p, 1); // Remove player from game's players list
                game.orgs.splice(indices.p, 1); // Remove player's org from game's orgs list (Orgs array should be indexed identically to players array)
                game.abilities.splice(indices.p, 1); // Remove player's abilities from game's abilities list (Abilities array should be indexed identically to players array)
                game.info.player_count--; // Reduce the number of players in the game
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
            console.error(`[ERROR] :: {SocketListener}.spawn :: Game not found in {Games}.list with host ${info.host}`);
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
