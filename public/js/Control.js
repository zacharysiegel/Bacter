class Control {
    /**
     * Spaen a new org into the game
     * @param {Object} color The color of the Org to be spawned
     *                      { r: g: b: }
     * @param {String} skin The skin of the Org to be spawned
     * @param {String} team The team to which the new Org belongs
     * @param {Boolean} force (Optional) Whether or not this spawn is being forced by the server
     */
    static spawn(color, skin, team, force=false) {
        let prev_state = Game.state;
        Game.state = 'game'; // State must be set to 'game' for Org.constructor to function correctly
        if (org) org.clearIntervals(); // Must clear intervals before creating new Org because the intervals will be overwritten after which it will not be possible to clear them
        if (ability) Abilities.reset(ability); // Freshen the ability object

        org = new Org(connection.socket.id, color, skin, team);
        let compressedOrg = org.compressed;

        Game.game.info.player_count = Game.game.players.length;

        if (prev_state === 'respawnMenu' || force) {
            connection.emit_respawn(Game.game.info.host, compressedOrg, ability); // emit event 'respawn'
        } else if (prev_state === 'joinMenu') {
            connection.emit_join_player(Game.game.info, compressedOrg, ability); // emit event 'join player'
        } else {
            console.error('Invalid State :: Control.spawn :: Attempting to spawn from an invalid state');
        }
    }

    /**
     * Create a new spectator org in the game
     * @param {Object} color The color of the Org to be spawned
     *                       { r: g: b: }
     * @param {String} skin The skin of the Org to be spawned
     * @param {String} team The team to which the new Org belongs
     * @param {Object} cursor (Optional) The initial position at which the spectator's cursor will be placed
     *                        { x: y: }
     */
    static spectate(color, skin, team, cursor=undefined) {
        Game.state = 'spectate';
        connection.emit('join spectator', Game.game);
        org = new Org(connection.socket.id, color, skin, team, cursor);
    }

    /**
     * Enter game by starting game interval (runLoop()) (with org growth)
     */
    static enter() {
        org.clearIntervals();
        org.intervals.push(setInterval(Control.tick, config.game.org_frequency));
    }

    /**
     * Causes a player to leave the game
     */
    static leave() {
        connection.emit('leave game');
        org.clearIntervals();
        org = undefined; // Clear org globalvariable

        if (Game.game.info.host !== connection.socket.id) { // Only edit and update the board if the player is not the host
            let index = Board.find(Game.game.board, connection.socket.id); // Remove member from the leaderboard, reorder it, and update server's board instance
            if (index !== -1) {
                Game.game.board.list.splice(index, 1); // Remove player from leaderboard
                Board.order(Game.game.board); // Sort the list before emitting to the server
                connection.emit_board(Game.game.board); // Send updated board to server
            }
        }

        Title.render();
        title = Title.create();
    }

    /**
     * The fundamental control tick which performs all of a player's recurring computations
     *      Runs inside {Org}.interval
     *      Rendering is performed after receiving the 'game' event from a server-side loop
     */
    static tick() {
        if (Game.game.rounds.util) {
            Control.roundBehaviors();
        }

        org.grow();
        // org.setClickbox();

        // CTF
        if (Game.game.info.mode === 'ctf') {
            if (Game.game.flag.detectedPickup()) {
                Game.game.flag.pickup(org);
            }
        }
    }

    /**
     * Do round-specific behaviors in the Control loop
     *      It is presupposed that when this function is called, {Game}.rounds.util is true
     */
    static roundBehaviors() {
        const currentTime = new Date();

        if (Game.game.rounds.waiting && !Game.game.rounds.delayed) { // If waiting for player min to be reached
            if (Game.game.info.player_count >= Game.game.rounds.min) { // If player min is reached
                if (connection.socket.id === Game.game.info.host) { // Only host must emit
                    connection.emit('preround delay', Game.game); // End waiting period; Start the pre-round delay period
                }
                Game.game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
            }
        } else if (Game.game.rounds.waiting && Game.game.rounds.delayed) { // If in the pre-round delay
            if (Game.member_count(Game.game) < Game.game.rounds.min) { // If a member left, voiding the delay
                if (connection.socket.id === Game.game.info.host) {
                    connection.emit('cancel preround delay', Game.game.info.host);
                }
                Game.game.rounds.delayed = false; // {Game} will be overwritten, but this will stop the game from starting
                Game.game.rounds.delaystart = new Date().valueOf(); // ^ This is why non-host members do this
            }
        } // Clients are told to force spawn by the server at the end of the pre-round delay and the end-round delay

        if (Game.game.info.mode === 'srv' && Game.game.players[0] === connection.socket.id && !Game.game.rounds.waiting && !Game.game.rounds.delayed && Game.game.info.player_count <= 1) { // Survival end-game: if during game and player is winner; count <= 1 (rather than === 1) in case multiple players die on last tick, setting count to 0
            for (let m = 0; m < Game.game.board.list.length; m++) {
                if (Game.game.board.list[m].player === connection.socket.id) {
                    connection.emit('end round', Game.game.info);
                    Game.game.rounds.delayed = true; // Prevent the above emission from executing multiple times

                    Game.game.board.list[m].wins++;
                    Board.order(Game.game.board);
                    connection.emit_board(Game.game.board);
                }
            }
        }
    }
}
