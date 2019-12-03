class Board {
    /**
     * Construct a new Board object
     * @param {String} mode The gamemode
     * @param {Number} show The max rows on the leaterboard
     * @param {Number} teamCount The number of teams in the game
     */
    constructor(mode, show, teamCount) {
        this.host = connection.socket.id; // Cannot call Game.game.info.host since game is not fully constructed yet; World() can only be called by host, so connection.socket.id is ok
        this.list = [
            // { TODO: Make a class out of this
            //    player: undefined, // ID of player
            //    name: undefined, // Screen name of player
            //    kills: undefined, // Kills as defined by number of enemy cells killed
            //    deaths: undefined, // Deaths as defined by number of org deaths
            //    ratio: undefined, // Ratio of kills to deaths
            //    score: undefined, // Flag captures (ctf), time score (kth)
            //    wins: undefined // Round wins (srv, ctf, inf, kth)
            // }
        ];
        this.count = undefined;
        if (mode === 'skm' || mode === 'ctf') { // If is a team Game.game
            this.show = teamCount; // Maximum number of players shown in leaderboard (Top __)
        } else {
            this.show = show;
        }
        this.x = undefined; // width - (nameWidth + oneWidth + twoWidth) / 2 - marginRight
        this.y = undefined; // marginTop
        this.marginRight = 15;
        this.marginTop = 13;
        this.text = {
            marginLeft: 5,
            marginTop: 15,
            size: 11,
            font: 'Helvetica',
            boldFont: 'Verdana',
            color: { r: 0, g: 0, b: 0 }
        };
        this.nameWidth = 170;
        this.oneWidth = 46;
        this.twoWidth = 46;
        this.threeWidth = 46;
        this.rowHeight = 22;
        this.tableWeight = 1;
        this.headWeight = 1;
        this.cellWeight = 1;
        this.headColor = { r: 200, g: 200, b: 200 };
        this.cellColor = { r: 245, g: 245, b: 245 };
        this.stroke = { r: 0, g: 0, b: 0 };
    }

    /**
     * Find a player's ID in the list
     *    This function is static rather than an instance member because the
     *      JSON.stringify used in the Socket.io transfer of the Game object
     *      ignores functions and prototypes
     * @param board The board object to search
     * @param id The socket.id String of a player
     * @returns {Number} Index of player in {Board}.list
     */
    static find(board, id) {
        let len = Game.game.board.list.length;
        for (let i = 0; i < len; i++) { // Remove member from the leaderboard, reorder it, and update server's board instance
            if (Game.game.board.list[i].player === connection.socket.id) { // Find player in leaderboard
                return i;
            }
        }
        return -1;
    }

    /**
     * Order the leaderboard
     *    Sort in descending order of K:D ratio
     *    This function is static rather than an instance member because the
     *      JSON.stringify used in the Socket.io transfer of the Game object
     *      ignores functions and prototypes
     * @param {Board} board The board to be sorted (it is really the array board.list being sorted)
     */
    static order(board) {
        board.list.sort(function(a, b) { // Sorts in descending order of K:D ratio
            let N;
            if (Game.game.info.mode === 'ffa' || Game.game.info.mode === 'skm') {
                N = b.kills - a.kills; // If a.kills is greater than b.kills, value will be negative, so will sort a before b
                if (N === 0) {
                    N = a.deaths - b.deaths; // If b.deaths is greater than a.deaths, value will be positive, so will sort b before a
                }
            } else if (Game.game.info.mode === 'srv') {
                N = b.kills - a.kills;
                if (N === 0) {
                    N = b.wins - a.wins;
                }
            } else if (Game.game.info.mode === 'ctf' || Game.game.info.mode === 'kth') {
                N = b.score - a.score;
                if (N === 0) {
                    N = b.wins - a.wins;
                }
            } else if (Game.game.info.mode === 'inf') {
                N = b.wins - a.wins;
            }
            return N;
        });
    }

    /**
     * Render the leaderboard
     *    Leaderboard is stored in Game.game.board
     *    This function is static rather than an instance member because the
     *      JSON.stringify used in the Socket.io transfer of the Game object
     *      ignores functions and prototypes
     * Function is static (rather than an instance member) so the transmission of board to/from server is lighter
     */
    static render(board) {
        translate(org.off.x, org.off.y); // Settings for entire board
        rectMode(CORNER);
        board.y = board.marginTop;
        noFill();
        stroke(board.stroke.r, board.stroke.g, board.stroke.b);
        strokeWeight(board.tableWeight);
        noSmooth(); // Disables p5 anti-aliasing while drawing the Board
        textSize(board.text.size);
        textFont(board.text.font);
        textStyle(BOLD);
        if (Game.game.info.mode === 'ffa') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth + board.twoWidth + board.threeWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Names Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Kills Header
            rect(board.x + board.nameWidth + board.oneWidth, board.y, board.twoWidth, board.rowHeight); // Deaths Header
            rect(board.x + board.nameWidth + board.oneWidth + board.twoWidth, board.y, board.threeWidth, board.rowHeight); // Ratios Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Player', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Kills', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('Deaths', board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('K:D', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = min(board.show, board.list.length);
        } else if (Game.game.info.mode === 'skm') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth + board.twoWidth + board.threeWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Team Color Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Team Kills Header
            rect(board.x + board.nameWidth + board.oneWidth, board.y, board.twoWidth, board.rowHeight); // Team Deaths Header
            rect(board.x + board.nameWidth + board.oneWidth + board.twoWidth, board.y, board.threeWidth, board.rowHeight); // Team Ratio Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Team', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Kills', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('Deaths', board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('K:D', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = Game.game.teams.length;
        } else if (Game.game.info.mode === 'srv') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth + board.twoWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Names Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Wins Header
            rect(board.x + board.nameWidth + board.oneWidth, board.y, board.twoWidth, board.rowHeight); // Kills Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Player', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Wins', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('Kills', board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = min(board.show, board.list.length);
        } else if (Game.game.info.mode === 'ctf') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth + board.twoWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Team Color Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Wins Header
            rect(board.x + board.nameWidth + board.oneWidth, board.y, board.oneWidth, board.rowHeight); // Captures Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Team', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Wins', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('Score', board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = Game.game.teams.length;
        } else if (Game.game.info.mode === 'inf') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Names Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Wins Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Player', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Wins', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = min(board.show, board.list.length);
        } else if (Game.game.info.mode === 'kth') {
            board.x = Math.floor(width - (board.nameWidth + board.oneWidth + board.twoWidth) - board.marginRight);
            fill(board.headColor.r, board.headColor.g, board.headColor.b); // Header
            stroke(board.stroke.r, board.stroke.g, board.stroke.b);
            strokeWeight(board.headWeight);
            rect(board.x, board.y, board.nameWidth, board.rowHeight); // Names Header
            rect(board.x + board.nameWidth, board.y, board.oneWidth, board.rowHeight); // Wins Header
            rect(board.x + board.nameWidth + board.oneWidth, board.y, board.oneWidth, board.rowHeight); // Score Header
            fill(board.text.color.r, board.text.color.g, board.text.color.b); // Header Text
            noStroke();
            text('Player', board.x + board.text.marginLeft, board.y + board.text.marginTop);
            text('Wins', board.x + board.nameWidth + board.text.marginLeft, board.y + board.text.marginTop);
            text('Score', board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + board.text.marginTop);
            board.count = min(board.show, board.list.length);
        }
        let a = 0;
        for (let i = 0; i < board.count; i++) { // Body
            if (Game.game.info.mode !== 'skm' && Game.game.info.mode !== 'ctf') { // If not a team mode
                let spectator = false;
                for (let j = 0; j < Game.game.spectators.length; j++) {
                    if (board.list[i].player === Game.game.spectators[j]) {
                        spectator = true;
                        break;
                    }
                }
                if (spectator === true) {
                    if (i < board.count) {
                        if (board.count < Game.game.info.player_count) {
                            board.count++; // Extend leaderboard length to include the next player
                            i++; // Do not render leaderboard status if player is a spectator
                        } else {
                            continue;
                        }
                    }
                }
            }
            // Cell Boxes
            if (Game.game.info.mode === 'ffa') {
                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Names Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (board.list[i].player === connection.socket.id) {
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(board.list[i].name, board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Kills Body
                rect(board.x + board.nameWidth + board.oneWidth, board.y + (a + 1) * board.rowHeight, board.twoWidth, board.rowHeight); // Deaths Body
                rect(board.x + board.nameWidth + board.oneWidth + board.twoWidth, board.y + (a + 1) * board.rowHeight, board.threeWidth, board.rowHeight); // Ratios Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);// Text
                noStroke();
                text(board.list[i].kills, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                text(board.list[i].deaths, board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                board.list[i].ratio = board.list[i].kills / board.list[i].deaths;
                if (board.list[i].ratio === Infinity) { // n / 0, n != 0 (Divide by Zero)
                    text('∞', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                } else if (board.list[i].kills === 0 && board.list[i].deaths === 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
                    text('0', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                } else { // n / m, m != 0 (Rational Number)
                    text(round(board.list[i].ratio * 100) / 100, board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                }
            } else if (Game.game.info.mode === 'skm') {
                // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
                // noStroke();
                // rect(board.x + 4, board.y + 3 + (a + 1) * board.rowHeight, board.nameWidth + board.oneWidth + board.twoWidth + board.threeWidth, board.rowHeight);

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Team Color Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (Game.game.teams[i].indexOf(org.player) !== -1) { // If player is on given team
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(config.colors.teams[i][0].toUpperCase() + config.colors.teams[i].slice(1), board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name is above so it renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Team Kills Body
                rect(board.x + board.nameWidth + board.oneWidth, board.y + (a + 1) * board.rowHeight, board.twoWidth, board.rowHeight); // Team Deaths Body
                rect(board.x + board.nameWidth + board.oneWidth + board.twoWidth, board.y + (a + 1) * board.rowHeight, board.threeWidth, board.rowHeight); // Team Ratios Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b); // Text
                noStroke();
                let teamKills = 0;
                let teamDeaths = 0;
                for (let j = 0; j < Game.game.teams[i].length; j++) {
                    for (let k = 0; k < board.list.length; k++) {
                        if (Game.game.teams[i][j] === board.list[k].player) {
                            teamKills += board.list[k].kills;
                            teamDeaths += board.list[k].deaths;
                            break;
                        }
                    }
                }
                const teamRatio = teamKills / teamDeaths;
                text(teamKills, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                text(teamDeaths, board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                if (teamRatio === Infinity) { // n / 0, n != 0 (Divide by Zero)
                    text('∞', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                } else if (teamKills === 0 && teamDeaths === 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
                    text('0', board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                } else { // n / m, m != 0 (Rational Number)
                    text(round(teamRatio * 100) / 100, board.x + board.nameWidth + board.oneWidth + board.twoWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
                }
            } else if (Game.game.info.mode === 'srv') {
                // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
                // noStroke();
                // rect(board.x + 4, board.y + 3 + (a + 1) * board.rowHeight, board.nameWidth + board.oneWidth + board.twoWidth, board.rowHeight);

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Names Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (board.list[i].player === connection.socket.id) {
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(board.list[i].name, board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Kills Body
                rect(board.x + board.nameWidth + board.oneWidth, board.y + (a + 1) * board.rowHeight, board.twoWidth, board.rowHeight); // Deaths Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b); // Text
                noStroke();
                text(board.list[i].wins, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                text(board.list[i].kills, board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
            } else if (Game.game.info.mode === 'ctf') {
                // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
                // noStroke();
                // rect(board.x + 4, board.y + 3 + (a + 1) * board.rowHeight, board.nameWidth + board.oneWidth, board.rowHeight);

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Team Color Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (Game.game.teams[i].indexOf(org.player) !== -1) { // If player is on given team
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(config.colors.teams[i][0].toUpperCase() + config.colors.teams[i].slice(1), board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name is above so it renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Team Kills
                rect(board.x + board.nameWidth + board.oneWidth, board.y + (a + 1) * board.rowHeight, board.twoWidth, board.rowHeight); // Round Wins

                let wins = 0; // Text
                let done = false;
                for (let j = 0; j < Game.game.teams[i].length; j++) {
                    for (let k = 0; k < board.list.length; k++) {
                        if (Game.game.teams[i][j] === board.list[k].player) { // Find player in board list
                            wins = board.list[k].wins; // Team wins saved to each player; Copy wins from one player to represent the team
                            done = true;
                            break;
                        }
                    }
                    if (done === true) {
                        break;
                    }
                }
                let captures = 0;
                for (let j = 0; j < Game.game.teams[i].length; j++) {
                    for (let k = 0; k < board.list.length; k++) {
                        if (Game.game.teams[i][j] === board.list[k].player) {
                            captures += board.list[k].score;
                            break;
                        }
                    }
                }
                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                text(wins, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                text(captures, board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
            } else if (Game.game.info.mode === 'inf') {
                // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
                // noStroke();
                // rect(board.x + 4, board.y + 3 + (a + 1) * board.rowHeight, board.nameWidth + board.oneWidth, board.rowHeight);

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Names Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (board.list[i].player === connection.socket.id) {
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(board.list[i].name, board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Kills Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b); // Text
                noStroke();
                text(board.list[i].wins, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
            } else if (Game.game.info.mode === 'kth') {
                // fill(Game.game.world.backdrop.r - 20, Game.game.world.backdrop.g - 20, Game.game.world.backdrop.b - 20);
                // noStroke();
                // rect(board.x + 4, board.y + 3 + (a + 1) * board.rowHeight, board.nameWidth + board.oneWidth, board.rowHeight);

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b);
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x, board.y + (a + 1) * board.rowHeight, board.nameWidth, board.rowHeight); // Names Body

                fill(board.text.color.r, board.text.color.g, board.text.color.b);
                noStroke();
                if (board.list[i].player === connection.socket.id) {
                    textFont(board.text.boldFont);
                    textStyle(BOLD);
                } else {
                    textFont(board.text.font);
                    textStyle(NORMAL);
                }
                text(board.list[i].name, board.x + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop); // Screen name renders under kills box

                fill(board.cellColor.r, board.cellColor.g, board.cellColor.b); // Body
                stroke(board.stroke.r, board.stroke.g, board.stroke.b);
                strokeWeight(board.cellWeight);
                rect(board.x + board.nameWidth, board.y + (a + 1) * board.rowHeight, board.oneWidth, board.rowHeight); // Score
                rect(board.x + board.nameWidth + board.oneWidth, board.y + (a + 1) * board.rowHeight, board.twoWidth, board.rowHeight); // Wins

                fill(board.text.color.r, board.text.color.g, board.text.color.b); // Text
                noStroke();
                text(board.list[i].wins, board.x + board.nameWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
                text(board.list[i].score, board.x + board.nameWidth + board.oneWidth + board.text.marginLeft, board.y + (a + 1) * board.rowHeight + board.text.marginTop);
            }
            a++;
        }
        rectMode(CENTER); // Reset Mode
        translate(-org.off.x, -org.off.y);
        smooth();
    }
}
