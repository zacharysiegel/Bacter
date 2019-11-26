class Games {
    /**
     * Construct a new Games instance
     * @param config A configuration object (Converted from ./config.json)
     */
    constructor(config) {
        this.config = config;
        // this.map = {}; // Will convert games array into a hash table in the future
        this.list = [];
        this.securities = []; // Contains PermissedList objects; Will convert securities array into a hash table in the future
        this.intervals = [];
        this.shrinkIntervals = [];
        this.connections = 0;
        this.games_interval;
    }

    get count() { // count will not be recalculated unless this.games changes length (see memoized getters)
        return this.list.length;
    }

    /**
     * Add the current game to this Games instance
     * @param game The game to be pushed to this.list
     * @param host The host of the game
     * @param io
     */
    createGame(game, host, io) {
        const game_index = this.list.push(game) - 1; // array.push() returns the new length of the array

        if (this.config.project_state === 'development') console.log('                                               Game Created: ' + this.list[this.count - 1].info.title + ' (' + this.list[this.count - 1].info.host + ')');

        this.intervals.push(setInterval(() => { // Send updated game to all players
            this.list[game_index].count = this.list[game_index].players.lenth; // Calculate and update player count

            let game = this.list[game_index];
            io.to(this.list[game_index].info.title).volatile.binary(false).emit('game', game); // Send updated game info to clients in game room
        }, this.config.render_period));
    }

    setGamesInterval(delay=1000, io) {
        this.games_interval = setInterval(() => {
            io.sockets.volatile.emit('Games', {
                games: this.list,
                connections: this.connections
            });
        }, delay); // Every delay, send a copy of the games array to all clients
    }

    clearGamesInterval() {
        clearInterval(this.games_interval);
    }

    setShrinkInterval(game) {
        const shrink = () => { // function expressions are not hoisted, but prefer to not overwrite 'this' value
            const g = this.getIndexByHost(game.info.host); // g is saved in Closure but its value may change over the lifetime of the interval, so it must be recalculated
            if (g === -1) {
                console.error(`[ERROR] :: {Games.setShrinkInterval} :: Game not found in {Games}.list with host ${game.info.host}`);
                return;
            }

            if (this.list[g].world.width > 200 && this.list[g].world.height > 200) { // If both dimensions are greater than minimum
                this.list[g].world.width -= this.config.shrink_rate * 2;
                this.list[g].world.height -= this.config.shrink_rate * 2;
                this.list[g].world.x += this.config.shrink_rate; // World shrinks to center
                this.list[g].world.y += this.config.shrink_rate;
            }
        };

        this.shrinkIntervals.push({ // Shrink the world
            host: game.info.host,
            width: game.world.width, // Preserve initial width of world
            height: game.world.height, // Preserve initial height of world
            interval: setInterval(shrink, this.config.shrink_period)
        });
    }

    /**
     * Determine the location in {Games}.list of the game with the given host or -1 if not found
     * @param {String} host
     * @return {Number} The index of the game in {Games}.list which is hosted by 'host' or -1 if not found
     */
    getIndexByHost(host) {
        for (let g = 0; g < this.count; g++) {
            if (this.list[g].info.host === host) {
                return g;
            }
        }
        return -1;
    }

    /**
     * Find the game in {Games}.list in which the given socket.id is playing or spectating
     * @param {String} id The socket.id of the socket to search for
     * @param {Number} start_index (Optional) The index of the game in {Games}.list to start search in (if game has already been found)
     *                     Default Value: 0 (If game hasn't been found already, search from the beginning)
     * @return {Object} {
     *            {Number} g: The index in {Games}.list[] of the game which contains the given user in its players array
     *            {Number} p: The index in {Games}.list[].players of the given player (or -1 if spectator)
     *            {Number} s: The index in {Games}.list[].spectators of the given player (or -1 if player)
     *            {Number} l; The index in {Games}.list[].board.list of the given membeA
     *         }
     */
    getIndicesByMember(id, start_index=0) {
        const result = {
            g: -1,
            p: -1,
            s: -1,
            l: -1
        };

        for (let g = start_index; g < this.count; g++) {
            let game = this.list[g];

            let member_found = false;
            let member_count = game.board.list.length;

            if (game.info.host === id) {
                result.g = g; // If host disconnects after creating game, but before joining, he is not yet placed in the leaderboard
                member_found = true;
            }

            for (let l = 0; l < member_count; l++) { // Search leaderboard array for id
                if (game.board.list[l].player === id) {
                    result.g = g;
                    result.l = l;
                    member_found = true;
                    break;
                }
            }
            if (! member_found) { // If id is not a member of this game, do not look in players/spectators collections
                continue;
            }

            for (let p = 0; p < game.info.player_count; p++) { // Search players array for id
                if (game.players[p] === id) {
                    result.p = p;
                    return result; // Member cannot be both a player and a spectator
                }
            }

            const spectator_count = game.spectators.length; // If id was not found in players array
            for (let s = 0; s < spectator_count; s++) { // Search spectators array
                if (game.spectators[s] === id) {
                    result.s = s;
                    return result; // Member cannot be both a player and a spectator
                }
            }
        }

        return result;
    }

    /**
     * Detemine the index of a shrink interval in {Games}.shrinkIntervals
     * @param {String} host The host of the game in question
     * @return {Number} The index of the target interval in {Games}.shrinkIntervals or -1 if not found
     */
    getShrinkIndex(host) {
        const len = this.shrinkIntervals.length;
        for (let s = 0; s < len; s++) {
            const shrink = this.shrinkIntervals[s];
            if (shrink.host === host) {
                return s;
            }
        }
        return -1;
    }
}

module.exports = Games;
