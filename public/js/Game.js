class Game {
    /**
     * All static fields are listed below:
     * (static) Game.game;    // Value set in Game.start
     * (static) Game.games;   // Initialized to [] in static initializer below Game class
     * (static) Game.state;   // Value set in setup()
     * (static) Game.message; // Value set in setup()
     */

    /**
     * Construct a Game object
     * @param  {Map} data {
     *                       title: gametitle,
     *                       secured: secured,
     *                       type: type,
     *                       width: width,
     *                       height: height,
     *                       color: color,
     *                       cap: cap,
     *                       show: show,
     *                       mode: mode,
     *                       teamCount: teamCount,
     *                       min: minimum
     *                    }
     */
    constructor(data) {
        this.src = 'game'; // Info
        this.players = [];
        this.info = {
            host: connection.socket.id,
            title: data.title,
            secured: data.secured,
            player_count: 0,
            cap: data.cap,
            mode: data.mode,
            teamCount: data.teamCount
        };

        this.teams = []; // Teams
        if (this.info.mode === 'skm' || this.info.mode === 'ctf') {
            for (let i = 0; i < this.info.teamCount; i++) {
                this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
            }
        } else if (this.info.mode === 'inf') {
            for (let i = 0; i < 2; i++) { // Only can be two teams in infection (healthy/infected)
                this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
            }
        }

        this.rounds = { // Rounds
            host: undefined, // Identification purposes
            util: false, // If game utilizes rounds
            waiting: true, // Waiting for players to join
            delayed: false, // All players present, about to join
            delaystart: undefined,
            rounddelay: config.game.delay_time,
            start: undefined,
            min: undefined, // Min players
            winner: undefined
        };
        if (this.info.mode === 'srv' || this.info.mode === 'ctf' || this.info.mode === 'inf' || this.info.mode === 'kth') { // If game mode utilizes round system
            this.rounds.util = true;
            this.rounds.host = this.info.host;
            this.rounds.min = data.min;
            this.rounds.waiting = true;
        }

        this.board = new Board(this.info.mode, data.show, this.info.teamCount);
        this.world = new World(data.width, data.height, data.type, data.color);
        if (this.info.mode === 'ctf') {
            this.flag = new Flag(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.border.color);
        }
        this.players = [];
        this.spectators = [];
        this.orgs = [];
        this.abilities = [];
    }

    /**
     * Initialize game
     * @param {Object} game game object holding all game-wide info
     * @param {Boolean} spectating true: initialize as spectator, false: initialize as player
     * @param { r, g, b } color (Optional) The RGB color object of the host's org
     * @param {String} skin (Optional) The skin of the host's org
     * @param {String} team (Optional) The host's team
     */
    static start(game, spectating, color=undefined, skin=undefined, team=undefined) {
        ReactDOM.render(<CanvasCont />, Z.eid('root'));
        Game.game = game;
        if (spectating) { // Field can be left undefined
            Control.spectate(color, skin, team);
        } else if (!spectating) {
            Control.spawn(color, skin, team);
        }
    }

    /**
     * Determine if the game corresponding to the specified host exists in the games array
     * @param {String} host The host of the game in question (the identifier of a game)
     * @return {Boolean} True if game was found in games array, else false
     */
    static exists(host) {
        let exists = false;

        Game.games.forEach(game => { // return statement in here does not return Game.exists, it returns the arrow function
            if (game.info.host === host) {
                exists = true;
            }
        });

        return exists;
    }

    /**
     * Determine the number of members in the given game
     * @param {Game} game The game to query
     * @returns {Number} The number of members (players + spectators) in this {Game}
     */
    static member_count(game) {
        return game.board.list.length;
    }
}

// Static Initialization Block for class Game
(function() {

    Game.games = [];

})();
