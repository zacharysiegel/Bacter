class Control {
    /**
     * Spaen a new org into the game
     * @param data Information about the org to be constructed
     */
    static spawn(data) { // data: { color: {}, skin: '', team: '' }
        Game.state = 'game';
        org = new Org({ player: connection.socket.id, color: data.color, skin: data.skin, team: data.team });

        let compressedOrg = org.compressed;
        connection.emit('player joined', { info: Game.game.info, org: compressedOrg, ability: ability });
    }

    /**
     * Create a new spectator org in the game
     * @param data Information about the org to be constructed
     */
    static spectate(data) { // data: { color: {}, cursor: {}, skin: '', team: '' }
        Game.state = 'spectate';
        connection.emit('spectator joined', Game.game);
        org = new Org( { player: connection.socket.id, color: data.color, skin: data.skin, team: data.team, cursor: data.cursor } );
    }

    /**
     * Enter game by starting game interval (runLoop()) (with org growth)
     */
    static enter() {
        if (!org.intervals.length) { // org.intervals array must be of length 0
            org.intervals.push(setInterval(Control.loop, config.game.org_frequency));
        }
    }

    /**
     * Causes a player to leave the game
     */
    static leave() {
        connection.emit('leave game');
        org.clearIntervals();
        org = undefined; // Clear org globalvariable
        Abilities.reset(ability); // Ability reset occurs already in Title.render()

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

    static loop() {
        Control.roundBehaviors();

        org.grow();
        // org.setClickbox();

        // CTF
        if (Game.game.info.mode === 'ctf') {
            if (Game.game.flag.detectedPickup()) {
                Game.game.flag.pickup(org);
            }
        }
    }

    static roundBehaviors() {
        if (! Game.game.rounds.util) {
            return;
        }

        const currentTime = new Date();
        if (Game.game.info.host === connection.socket.id) { // Only if player is host
            if (Game.game.rounds.waiting && !Game.game.rounds.delayed && Game.game.info.player_count >= Game.game.rounds.min) { // If waiting, not delayed, and have minimum players

                connection.emit('preround delay', Game.game); // End waiting period
                Game.game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated

            } else if (Game.game.rounds.waiting && Game.game.rounds.delayed && currentTime - Game.game.rounds.delaystart >= Game.game.rounds.rounddelay - 1000 && org.ready === false) { // Only host; If 1 second left in round-begin delay

                connection.emit('force spawn', Game.game.info);
            }
        }

        if (Game.game.info.mode === 'srv' && !Game.game.rounds.waiting && !Game.game.rounds.delayed && Game.game.info.player_count <= 1 && Game.game.players[0] === connection.socket.id) { // Survival end-game: if during game and player is winner; count <= 1 (rather than === 1) in case multiple players die on last tick, setting count to 0
            for (let m = 0; m < Game.game.board.list.length; m++) {
                if (Game.game.board.list[m].player === connection.socket.id) {
                    connection.emit('end round', Game.game.info);
                    Game.game.rounds.waiting = true; // Prevent the above emission from executing multiple times
                    Game.game.rounds.delayed = true; // Prevent the above emission from executing multiple times

                    Game.game.board.list[m].wins++;
                    Board.order(Game.game.board);
                    connection.emit_board(Game.game.board);
                }
            }
        }
    }
}
