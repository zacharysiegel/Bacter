class Games {
    /**
     * Construct a new Games instance f
     * @param config A configuration object (Converted from ./config.json)
     */
    constructor(config) {
        this.config = config;
        this.map = new Map();
        this.securities = new Map(); // Contains PermissedList objects; Will convert securities array into a hash table in the future
        this.intervals = new Map();
        this.shrinkIntervals = new Map();
        this.preRoundTimeouts = new Map();   // { {String}: {Number} } , { host: pre-round delay timeout }
        this.forceSpawnTimeouts = new Map(); // { {String}: {Number} } , { host: pre-round force-spawn timeout }
        this.connections = 0;
        this.games_interval = null;
    }

    get count() { // count will not be recalculated unless this.games changes length (see memoized getters)
        return this.map.size;
    }

    /**
     * Determine if a game exists, hosted by the given host
     * @param {String} host The host of the game in question
     * @return {Boolean} True if the game exists, else false
     */
    exists(host) {
        return this.map.has(host);
    }

    /**
     * Remove a game
     * @param {String} host The host of the game in question
     */
    remove(host) {
        this.map.delete(host);
        clearInterval(this.games.intervals.get(host));
        this.games.intervals.delete(host);
    }

    /**
     * Add the current game to this Games instance
     * @param game The game to be pushed to this.list
     * @param host The host of the game
     * @param io
     */
    createGame(game, host, io) {
        this.map.set(host, game);

        if (this.config.project_state === 'development') console.log('                                               Game Created: ' + game.info.title + ' (' + game.info.host + ')');

        this.intervals.set(host, setInterval(() => { // Send updated game to all players
            let game = this.map.get(host);

            game.info.player_count = game.players.length; // Calculate and update player count
            io.to(game.info.title).volatile.binary(false).emit('game', game); // Send updated game info to clients in game room
        }, this.config.render_period));
    }

    /**
     * Set the Interval which emits the 'games' data-congruity event to all clients
     * @param delay The period of the interval
     * @param io The io object from the socket.io library
     */
    setGamesInterval(delay, io) {
        this.games_interval = setInterval(() => {
            io.sockets.volatile.emit('games', {
                map: this.map,
                connections: this.connections
            });
        }, delay); // Every delay, send a copy of the games array to all clients
    }

    /**
     * Clear the Interval which emits the 'games' data-congruity event to tall clients
     */
    clearGamesInterval() {
        clearInterval(this.games_interval);
    }

    /**
     * Set a new interval to shrink the world for a survival game
     * @param host The host of the game to be mutated
     */
    setShrinkInterval(host) {
        const shrink = () => { // function expressions are not hoisted, but prefer to not overwrite 'this' value
            if (!this.exists(host)) {
                console.error(`[ERROR] :: {Games.setShrinkInterval} :: Game does not exist with host ${host}`);
                return;
            }

            let game = this.map.get(host);
            if (game.world.width > 200 && game.world.height > 200) { // If both dimensions are greater than minimum
                game.world.width -= this.config.shrink_rate * 2;
                game.world.height -= this.config.shrink_rate * 2;
                game.world.x += this.config.shrink_rate; // World shrinks to center
                game.world.y += this.config.shrink_rate;
            }
        };

        let game = this.map.get(host);
        this.shrinkIntervals.set(game.info.host, ({ // Shrink the world
            host: game.info.host,
            width: game.world.width, // Preserve initial width of world
            height: game.world.height, // Preserve initial height of world
            interval: setInterval(shrink, this.config.shrink_period)
        }));
    }
}

module.exports = Games;
