let org;
class Org {
    constructor(data) { // data: { player: , color: , skin: , team: , pos: } (color and skin are required)
        this.player = data.player;
        this.color = data.color;
        this.skin = data.skin;
        this.team = data.team;
        this.spectating = Game.state === 'spectate';

        this.speed = this.spectating ? config.game.spectate_speed : config.game.move_speed;
        this.cells = [];
        this.count = 0;

        this.coefficient = -27.5; // Used in calculating size (changes in response to extend and compress abilities)
        this.range = config.game.default_range;
        this.hit = undefined;
        this.intervals = []; // Store an array of intervals to be pushed; in case multiple intervals are created unintentionally, they can be cleared
        this.col = config.game.collision_radius; // Collision radius (square) for crosshair (used in collision detection with flag)
        this.tracker = { // Used to ensure no double org growth intervals
            start: undefined,
            end: undefined,
            elap: undefined
        };

        let src = getSrc();
        if (src && src.src === 'game') {
            this.ready = !Game.game.rounds.util; // org.ready ensures that org will only be forcibly respawned once
            this.spawn = !Game.game.rounds.util || Game.game.rounds.waiting; // org is only disallowed to spawn if game is no longer waiting for new spawns

            let index = Board.find(Game.game.board, this.player);
            this.name = Game.game.board.list[index].name;
        }

        // Set Initial Position
        if (data.cursor) { // If cursor position is specified as a parameter
            this.cursor = data.cursor; // this.cursor refers to the cursor positon
        } else {
            let repos;
            do {
                let min_x = src.world.x + 50 + config.game.cell_width / 2; // +- 50 acts as buffer
                let min_y = src.world.y + 50 + config.game.cell_width / 2;
                let max_x = src.world.x + src.world.width - 50 - config.game.cell_width / 2;
                let max_y = src.world.y + src.world.height - 50 - config.game.cell_width / 2;
                this.cursor = { // Position is the target's location in the world
                    x: floor(min_x + Math.random() * (max_x - min_x)),
                    y: floor(min_y + Math.random() * (max_y - min_y))
                };

                repos = false; // Recalculate initial position if the org is to be placed in an invalid position
                if (src.world.type === 'rectangle') {
                    if (this.cursor.x < src.world.x || this.cursor.x > src.world.x + src.world.width || this.cursor.y < src.world.y || this.cursor.y > src.world.y + src.world.height) {
                        repos = false;
                    }
                } else if (src.world.type === 'ellipse') {
                    if (sq(this.cursor.x - (src.world.x + src.world.width / 2)) / sq(src.world.width / 2) + sq(this.cursor.y - (src.world.y + src.world.height / 2)) / sq(src.world.height / 2) >= 1) {
                        repos = true;
                    }
                }
                let org_count = src.orgs.length;
                for (let i = 0; i < org_count; i++) { // Org Overlap
                    let org = src.orgs[i];
                    for (let j = 0; j < org.count; j++) {
                        if (org.cells[j].x - org.cells[j].width <= this.cursor.x && org.cells[j].x + org.cells[j].width >= this.cursor.x && org.cells[j].y - org.cells[j].height <= this.cursor.y && org.cells[j].y + org.cells[j].height >= this.cursor.y) { // If position collides with enemy cell (Full width buffer is intended)
                            repos = true;
                            break;
                        }
                    }
                    if (repos) {
                        break;
                    }
                    let _ability = src.abilities[i]; // _ prefix so as to not confuse with the global variable "ability"
                    if (_ability.secrete.value === true) { // Spore Secretions Overlap
                        for (let j = 0; j < _ability.spore.count; j++) {
                            let cell = _ability.spore.spores[j];
                            if (sqrt(sq(this.cursor.x - cell.x) + sq(this.cursor.y - cell.y)) <= _ability.secrete.radius) {
                                repos = true;
                                break;
                            }
                        }
                    }
                    for (let j = 0; j < 3; j++) { // Shoot Secretions Overlap
                        if (_ability.shoot.secrete[j].value === true) {
                            let cell = _ability.shoot.spore[j];
                            let sec = _ability.shoot.secrete[j];
                            if (sqrt(sq(this.cursor.x - cell.x) + sq(this.cursor.y - cell.y)) <= sec.radius) {
                                repos = true;
                                break;
                            }
                        }
                    }
                    if (_ability.toxin.value === true) { // Toxin Overlap
                        if (sqrt(sq(this.cursor.x - _ability.toxin.x) + sq(this.cursor.y - _ability.toxin.y)) <= _ability.toxin.radius) {
                            repos = true;
                        }
                    }
                    if (!repos) {
                        break;
                    }
                }
            } while (repos);
        }
        this.off = { // Offset is the difference between the cursor components and the center of the window
            x: this.cursor.x - center.x,
            y: this.cursor.y - center.y
        };

        this.count = 0;

        if (!this.spectating) {
            this.cells[0] = new Cell(this.cursor.x, this.cursor.y, this); // Create first cell in org
            this.count = 1;
        }

        // Clickbox (DO NOT DELETE)
        // this.target = undefined; // ID of player which this org is currently targeting
        // this.clickbox = { // Targeting box for other orgs to click (NOT IN USE)
        //    width: undefined,
        //    height: undefined,
        //    x: undefined,
        //    y: undefined,
        //    left: this.cursor.x,
        //    right: this.cursor.x,
        //    top: this.cursor.y,
        //    bottom: this.cursor.y,
        //    buffer: config.game.cell_width / 2,
        //    color: this.color
        // };
        // this.setClickbox = () => { // DO NOT DELETE
        //    this.clickbox.left = this.x;
        //    this.clickbox.right = this.clickbox.left;
        //    this.clickbox.top = this.y;
        //    this.clickbox.bottom = this.clickbox.top;
        //    for (let i = 0; i < this.count; i++) { // Set the size of clickbox
        //       if (this.cells[i].x - this.cells[i].width / 2 < this.clickbox.left) {
        //          this.clickbox.left = this.cells[i].x - this.cells[i].width / 2;
        //       }
        //       if (this.cells[i].x + this.cells[i].width / 2 > this.clickbox.right) {
        //          this.clickbox.right = this.cells[i].x + this.cells[i].width / 2;
        //       }
        //       if (this.cells[i].y - this.cells[i].height / 2 < this.clickbox.top) {
        //          this.clickbox.top = this.cells[i].y - this.cells[i].height / 2;
        //       }
        //       if (this.cells[i].y + this.cells[i].height / 2 > this.clickbox.bottom) {
        //          this.clickbox.bottom = this.cells[i].y + this.cells[i].height / 2;
        //       }
        //    }
        //    this.clickbox.left -= this.clickbox.buffer;
        //    this.clickbox.right += this.clickbox.buffer;
        //    this.clickbox.top -= this.clickbox.buffer;
        //    this.clickbox.bottom += this.clickbox.buffer;
        //    this.clickbox.width = this.clickbox.right - this.clickbox.left;
        //    this.clickbox.height = this.clickbox.bottom - this.clickbox.top;
        //    this.clickbox.x = this.clickbox.left + this.clickbox.width / 2;
        //    this.clickbox.y = this.clickbox.top + this.clickbox.height / 2;
        // };
    }

    /**
     * Determine if this org is alive or dead
     * @returns {boolean}
     */
    get alive() {
        if (this.count > 0) return true;
        else if (this.count === 0) return false;
        else {
            console.error('Org.alive getter: this.count < 0');
            return false;
        }
    }

    /**
     * Get the x center of mass of this org
     * @returns {Number} the average of all cell x values
     */
    get x() {
        let sum = 0;
        for (let i = 0; i < this.count; i++) {
            sum += this.cells[i].x;
        }
        return sum / this.count;
    }

    /**
     * Get the y center of mass of this org
     * @returns {Number} The average of all cell y values
     */
    get y() {
        let sum = 0;
        for (let i = 0; i < this.count; i++) {
            sum += this.cells[i].y;
        }
        return sum / this.count;
    }

    /**
     * Determine if this org is a spectator in the current game
     * @returns {Boolean} True if spectator, else false
     */
    get isSpectator() {
        const len = Game.game.spectators.length;
        for (let i = 0; i < len; i++) {
            if (Game.game.spectators[i] === this.player) { // If player is spectator
                return true;
            }
        }
        return false;
    }

    /**
     * Get a reduced version of the org object containing only information needing to be sent to the server
     *    Sending less data to the server allows for lower latency
     * @returns {{col: number, color: *, skin: *, count: (number|*), range: number, team: *, speed: (*|number), off: ({x: number, y: number}|*), hit: undefined, intervals: ([]|Array), spawn: (boolean|*), cells: ([]|Array), pos: *, ready: boolean, name: *, coefficient: number, tracker: ({start: *, elap: *, end: *}|*), player: *}}
     */
    get compressed() {
        return {
            player: this.player, // Properties are listed here in the order they appear above in this file (/public/js/org.js)
            color: this.color,
            skin: this.skin,
            team: this.team,
            ready: this.ready,
            spawn: this.spawn,
            name: this.name,
            speed: this.speed,
            cells: this.cells,
            count: this.count,
            pos: this.cursor,
            off: this.off,
            col: this.col,
            // target: this.target,
            // clickbox: this.clickbox,
            coefficient: this.coefficient,
            range: this.range,
            hit: this.hit,
            intervals: this.intervals,
            tracker: this.tracker
        };
    }

    /**
     * Gather information about the cells in this org
     *    enclosed: Cells with only friendly cells around them
     *    exposed: Cells bordering an empty cell
     *    adjacent: x/y coordinates of the empty cells adjacent to this org
     * @returns {{exposed: *, adjacent: *, enclosed: *}}
     */
    get regions() {
        let enclosed = new Set();
        let exposed = new Set();
        let adjacent = new Set();
        for (let i = 0; i < this.count; i++) {
            let test = {x: undefined, y: undefined};
            let left = false;
            let top = false;
            let right = false;
            let bottom = false;
            for (let j = 0; j < this.count; j++) {
                if (i !== j) {
                    test = { // Left
                        x: this.cells[i].x - this.cells[i].width,
                        y: this.cells[i].y
                    };
                    if (test.x === this.cells[j].x && test.y === this.cells[j].y) {
                        left = true; // There is a friendly cell to the left
                    }
                    test = { // Top
                        x: this.cells[i].x,
                        y: this.cells[i].y - this.cells[i].height
                    };
                    if (test.x === this.cells[j].x && test.y === this.cells[j].y) {
                        top = true; // There is a friendly cell to the top
                    }
                    test = { // Right
                        x: this.cells[i].x + this.cells[i].width,
                        y: this.cells[i].y
                    };
                    if (test.x === this.cells[j].x && test.y === this.cells[j].y) {
                        right = true; // There is a friendly cell to the right
                    }
                    test = { // Bottom
                        x: this.cells[i].x,
                        y: this.cells[i].y + this.cells[i].height
                    };
                    if (test.x === this.cells[j].x && test.y === this.cells[j].y) {
                        bottom = true; // There is a friendly cell to the bottom
                    }
                }
            }
            if (left && top && right && bottom ) { // If cell is enclosed on all sides by friendly cells
                enclosed.add(this.cells[i]);
            } else { // If cell is not enclosed on all sides by friendly cells
                exposed.add(this.cells[i]);
            }
            if (! left) { // Push all empty regions adjacent to org
                adjacent.add({ x: this.cells[i].x - this.cells[i].width, y: this.cells[i].y });
            }
            if (! top) {
                adjacent.add({ x: this.cells[i].x, y: this.cells[i].y - this.cells[i].height });
            }
            if (! right) {
                adjacent.add({ x: this.cells[i].x + this.cells[i].width, y: this.cells[i].y });
            }
            if (! bottom) {
                adjacent.add({ x: this.cells[i].x, y: this.cells[i].y + this.cells[i].height });
            }
        }

        return {
            enclosed: enclosed,
            exposed: exposed,
            adjacent: adjacent
        };
    }

    /**
     * Remove a cell from the org's cells array
     * @param index The index of the cell to remove
     * @return {Cell} The return value of splicing the cells array
     */
    removeCell(index) {
        if (this.count !== this.cells.length) console.error('Invalid Value :: Org.removeCell :: org.count should always equal org.cells.length');
        this.count--;
        return this.cells.splice(index, 1);
    }

    grow() {
        // Avoid double intervals
        if (this.tracker.start) { // If tracker has been started
            this.tracker.end = Date.now();
            this.tracker.elap = this.tracker.end - this.tracker.start;
        }
        if (this.tracker.elap < config.game.org_frequency * .6) { // If org is growing ~twice as frequently as it should
            switch (Game.state) { // Recreate org growth interval (stored in an array so if multiple intervals are created accidentally, they can be cleared)
                case 'game': // Only necessary in states where orgs are growing (game and game pause menu), others states may be added
                case 'pauseGameMenu':
                    this.clearIntervals();
                    this.intervals.push(setInterval(Control.loop, config.game.org_frequency));
                    break;
            }
        }
        let src = getSrc();
        let ability;
        for (let i = 0; i < src.abilities.length; i++) {
            if (src.abilities[i].player === this.player) {
                ability = src.abilities[i]; // Set local 'ability' variable to the correct ability object
                break;
            }
        }

        if (ability === undefined) {
            console.error('Player\'s abilities not found');
            // org.die(true);
            // alert('An error has caused you to be forcibly removed from the game');
            // Control.leave();
            // debugger;
            return;
        }

        this.birth();
        this.naturalDeath();
        this.checkAbilities();

        if (Game.state === 'game' || Game.state === 'pauseGameMenu') { // These are the only states in which the org is updating itself (same as switch at the start of grow())
            connection.emit_org({
                cells: this.cells, // Only the following attributes of org need to be updated
                off: this.off, // Latency is decreased by only sending necessary data
                cursor: this.cursor,
                color: this.color,
                skin: this.skin,
                team: this.team,
                coefficient: this.coefficient,
                range: this.range
            });

            if (this.count === 0) {
                for (let i = 0; i < Game.game.board.list.length; i++) { // Find player in leaderboard
                    if (Game.game.board.list[i].player === connection.socket.id) { // Add death to leaderboard
                        Game.game.board.list[i].deaths++; // Add 1 to deaths counter
                        Board.order(Game.game.board); // Sort the list by kills then deaths
                        connection.emit_board(Game.game.board); // Send updated board to server
                        break;
                    }
                }
                if (this.hit !== this.player) { // Cannot gain kill for suicide
                    for (let i = 0; i < Game.game.board.list.length; i++) {
                        if (Game.game.board.list[i].player === this.hit) { // Find killer in leaderboard list
                            Game.game.board.list[i].kills++;
                            Board.order(Game.game.board);
                            connection.emit_board(Game.game.board);
                            break;
                        }
                    }
                }
                this.die(true);
            }
        }

        this.tracker.start = Date.now();
    }

    checkAbilities() {
        let src = getSrc();

        for (let ability of src.abilities) {
            if ((this.team === this.team && typeof team === 'string') && this.player !== connection.socket.id) { // If is friendly org but not own org
                continue; // No friendly fire but can hurt self
            }
            if (ability.secrete.value === true) { // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
                for (let j = 0; j < this.count; j++) {
                    for (let k = 0; k < ability.spore.count; k++) {
                        if (sqrt(sq(this.cells[j].x - ability.spore.spores[k].x) + sq(this.cells[j].y - ability.spore.spores[k].y)) <= ability.secrete.radius) { // If center of cell is within secrete circle (subject to change)
                            let skip = false;
                            for (let l = 0; l < src.abilities.length; l++) {
                                if (src.abilities[l].neutralize.value === true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                                    skip = true;
                                    break;
                                }
                            }
                            if (skip) continue; // Acid is ineffectual when neutralized

                            this.hit = ability.player;
                            if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                                for (let l = 0; l < src.teams.length; l++) { // Search teams
                                    if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                                        skip = true;
                                        break;
                                    }
                                }
                            }
                            if (skip) continue; // Acid is ineffectual if friendly

                            this.removeCell(j);
                            j--;
                            break;
                        }
                    }
                }
            }
            for (let j = 0; j < 3; j++) { // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
                if (ability.shoot.secrete[j].value === true) { // Kill cells inside shoot secretion
                    for (let k = 0; k < this.count; k++) {
                        if (sqrt(sq(this.cells[k].x - ability.shoot.spore[j].x) + sq(this.cells[k].y - ability.shoot.spore[j].y)) <= ability.shoot.secrete[j].radius) { // If center of cell is within shoot circle (subject to change)
                            let skip = false;
                            for (let l = 0; l < src.abilities.length; l++) {
                                if (src.abilities[l].neutralize.value === true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                                    skip = true;
                                    break;
                                }
                            }
                            if (skip) {
                                continue; // Acid is ineffectual when neutralized
                            }
                            this.hit = ability.player;
                            if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                                for (let l = 0; l < src.teams.length; l++) { // Search teams
                                    if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                                        skip = true;
                                        break;
                                    }
                                }
                            }
                            if (skip) {
                                continue; // Acid is ineffectual when neutralized
                            }
                            this.removeCell(k);
                            k--;
                            // break; // Break causes cells to die one at a time (not the currently desired behavior)
                        }
                    }
                }
            }
            if (ability.toxin.value === true) { // Toxin
                for (let j = 0; j < this.count; j++) {
                    if (this.player === ability.player) { // If is own org's toxin
                        break; // Do not kill own cells
                    }
                    if (sqrt(sq(this.cells[j].x - ability.toxin.x) + sq(this.cells[j].y - ability.toxin.y)) <= ability.toxin.radius) { // If center of cell is within toxin circle
                        let skip = false;
                        for (let l = 0; l < src.abilities.length; l++) {
                            if (src.abilities[l].neutralize.value === true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                                skip = true;
                                break;
                            }
                        }
                        if (skip) {
                            continue; // Acid is ineffectual when neutralized
                        }
                        this.hit = ability.player;
                        if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                            for (let l = 0; l < src.teams.length; l++) { // Search teams
                                if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                                    skip = true;
                                    break;
                                }
                            }
                        }
                        if (skip) {
                            continue; // Acid is ineffectual when neutralized
                        }
                        this.removeCell(j);
                        j--;
                        // break; // Break causes cells to die one at a time (not the currently desired behavior)
                    }
                }
            }
        }
    }

    /**
     * Conduct the natural birth operations of this org
     * @return {void}
     */
    birth() {
        let src = getSrc();

        let ability;
        for (let i = 0; i < src.abilities.length; i++) {
            if (src.abilities[i].player === this.player) {
                ability = src.abilities[i]; // Set local 'ability' variable to the    ability object
                break;
            }
        }

        if (ability.freeze.value) { // If this org is frozen, no natural birth occurs
            return;
        }
        // for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
        // if (ability.poison.value == true) {
        //    if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
        //       continue;
        //    }
        // }
        for (let cell of this.regions.adjacent.values()) { // Only Adjacent Regions Can Produce New Cells
            // Don't birth new cell outside world boundary
            if (cellIsOutsideWorld.call(this, cell)) { // Call the function whild sustaining the value of 'this'
                continue;
            }
            // Don't birth new cell on top of an opponent's org
            if (cellCollidesWithOpponent.call(this, cell)) { // Call the function whild sustaining the value of 'this'
                continue;
            }

            // Birth new cell accordingly; If execution has reached this point, the spawn location is confirmed to be valid
            if (ability.compress.value && ability.extend.value || ! ability.compress.value && ! ability.extend.value) { // compress.value NOT XOR extend.value (if both false or both true)
                this.coefficient = -27.5;
                this.range = config.game.default_range;
            } else if (ability.compress.value === true) {
                this.coefficient = -31.5;
                this.range = config.game.default_range - 10;
            } else if (ability.extend.value === true) {
                this.coefficient = -25.5;
                this.range = config.game.default_range + 20;
            }

            let chance = this.coefficient * Math.log(sqrt(sq(cell.x - this.cursor.x) + sq(cell.y - this.cursor.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100
            if (Math.random() * 100 <= chance) {
                let repeat = false;
                for (let j = 0; j < this.count; j++) {
                    if (cell.x === this.cells[j].x && cell.y === this.cells[j].y) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    this.cells.push(new Cell(cell.x, cell.y, this));
                    this.count++;
                }
            }
        }

        /**
         * Determine if the given cell location would be outside the world boundary
         * @param {x:, y:} cell The cell location to check
         * @returns {Boolean} True if the location is out of the world bounds
         */
        function cellIsOutsideWorld(cell) { // Not an instance member of Cell because 'cell' is an adjacent location, not a Cell instance
            let src = getSrc();

            if (src.world) {
                if (src.world.type === 'rectangle') { // If new cell would be outside a rectangular world's boundary
                    if (cell.x - config.game.cell_width / 2 <= src.world.x || // West
                        cell.x + config.game.cell_width / 2 >= src.world.x + src.world.width || // East
                        cell.y - config.game.cell_width / 2 <= src.world.y || // North
                        cell.y + config.game.cell_width / 2 >= src.world.y + src.world.height) { // South
                        return true;
                    }
                } else if (src.world.type === 'ellipse') { // If the new cell would be outside an elliptical world's boundary
                    let a = src.world.width / 2;
                    let a2 = sq(a);
                    let b = src.world.height / 2;
                    let b2 = sq(b);
                    let x = (cell.x - config.game.cell_width / 2) - a;
                    let y = (cell.y - config.game.cell_width / 2) - b;

                    if (sq(x) / a2 + sq(y) / b2 >= 1) { // If top-left corner is outside ellipse
                        return true;
                    }
                    x = (cell.x + config.game.cell_width / 2) - a;
                    y = (cell.y - config.game.cell_width / 2) - b;
                    if (sq(x) / a2 + sq(y) / b2 >= 1) { // If top-right corner is outside ellipse
                        return true;
                    }
                    x = (cell.x + config.game.cell_width / 2) - a;
                    y = (cell.y + config.game.cell_width / 2) - b;
                    if (sq(x) / a2 + sq(y) / b2 >= 1) { // If bottom-right corner is outside ellipse
                        return true;
                    }
                    x = (cell.x - config.game.cell_width / 2) - a;
                    y = (cell.y + config.game.cell_width / 2) - b;
                    if (sq(x) / a2 + sq(y) / b2 >= 1) { // If bottom-left corner is outside ellipse
                        return true;
                    }
                }
            }

            return false;
        }

        /**
         * Detect collisions between the given cell and an opponent's org
         * @param {x:, y:} cell The friendly cell on which collisions are checked
         *                      Not a Cell instance
         * @return {Boolean} True if collision is detected, else false
         */
        function cellCollidesWithOpponent(cell) { // Not an instance member of Cell because 'cell' is an adjacent location, not a Cell instance
            const src = getSrc();

            let org_count = src.orgs.length;
            for (let o = 0; o < org_count; o++) {
                const opp_org = src.orgs[o];
                if (opp_org.player === this.player) { // If org is player's org
                    continue;
                }

                for (let c = 0; c < opp_org.count; c++) {
                    const opp = opp_org.cells[c]; // Opponent's cell
                    const cell_bottom = cell.y + config.game.cell_width / 2;
                    const cell_right = cell.x + config.game.cell_width / 2;
                    const cell_top = cell_bottom - config.game.cell_width;
                    const cell_left = cell_right - config.game.cell_width;
                    const opp_bottom = opp.y + config.game.cell_width / 2;
                    const opp_right = opp.x + config.game.cell_width / 2;
                    const opp_top = opp_bottom - config.game.cell_width;
                    const opp_left = opp_right - config.game.cell_width;

                    if (opp_left <= cell_right && cell_right <= opp_right) { // If right side of the new cell is between the right and left sides of opp cell
                        if (opp_top <= cell_bottom && cell_bottom <= opp_bottom) { // If bottom side of the new cell is between the top and bottom sides of opp cell
                            return true;
                        } else if (opp_top <= cell_top && cell_top <= opp_bottom) { // If top side of the new cell is between the top and bottom sides of opp cell
                            return true;
                        }
                    } else if (opp_left <= cell_left && cell_left <= opp_right) { // If left side of the new cell is between the right and left sides of opp cell
                        if (opp_top <= cell_bottom && cell_bottom <= opp_bottom) { // If bottom side of the new cell is between the top and bottom sides of opp cell
                            return true;
                        } else if (opp_top <= cell_top && cell_top <= opp_bottom) { // If top side of the new cell is between the top and bottom sides of opp cell
                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }

    /**
     * Conduct the natural decay operations of this org
     *    Only expesed cells can die
     * @return {void}
     */
    naturalDeath() {
        let src = getSrc();
        let ability;
        for (let i = 0; i < src.abilities.length; i++) {
            if (src.abilities[i].player === this.player) {
                ability = src.abilities[i]; // Set local 'ability' variable to the    ability object
                break;
            }
        }

        if (ability.freeze.value || ability.immortality.value) { // If org is frozen or immortal, natural death should not occur
            return;
        }

        exposed:
            for (let cell of this.regions.exposed.values()) { // Loop from tail to head of array because elements will be removed
                let r = cell.r;

                // Remove cells if they are outside the org's range value
                if (r > this.range) { // If exposed cell is outside maximum radius
                    for (let j = 0; j < this.count; j++) { // Find exposed cell in org cells array
                        if (cell.equals(this.cells[j])) {
                            this.removeCell(j);
                            this.regions.exposed.delete(cell);
                            continue exposed; // Since cell is removed, if no continue, the program would continue to perform checks on the previous cell
                        }
                    }
                    console.error("Element Not Found :: Org.naturalDeath :: Could not find exposed cell in org's cells array");
                }

                // Remove cells if they are outside the world
                if (cell.isOutsideWorld) {
                    for (let c = 0; c < this.count; c++) {
                        if (cell.equals(this.cells[c])) {
                            this.removeCell(c);
                            this.regions.exposed.delete(cell);
                            continue exposed; // Since cell is removed, if no continue, the program would continue to perform checks on the previous cell
                        }
                    }
                }

                // Kill normal cells based on their distance from the org's cursor
                let chance = this.coefficient * Math.log(-r + (this.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100 (r is the distance from cell to cursor)
                if (Math.random() * 100 <= chance) {
                    for (let j = 0; j < this.count; j++) { // Find exposed cell in org cells array
                        if (cell.equals(this.cells[j])) {
                            this.removeCell(j);
                            this.regions.exposed.delete(cell);
                            continue exposed; // Could use a break instead since there are no more instructions in the 'exposed:' for loop
                        }
                    }
                    console.error("Element Not Found :: Org.naturalDeath :: Could not find exposed cell in org's cells array");
                }
            }
    }

    /**
     * Clear the growth interval(s) in this org
     * @return void
     */
    clearIntervals() {
        for (let i = 0; i < this.intervals.length; i++) {
            clearInterval(this.intervals[i]);
        }
        this.intervals = [];
    }

    /**
     * Check for user input and move the player's cursor appropriately
     */
    move() {
        let keys = '';
        if (keyIsDown(config.settings.controls.left1.code) || keyIsDown(config.settings.controls.left2.code)) {
            keys += 'l';
        }
        if (keyIsDown(config.settings.controls.up1.code) || keyIsDown(config.settings.controls.up2.code)) {
            keys += 'u';
        }
        if (keyIsDown(config.settings.controls.right1.code) || keyIsDown(config.settings.controls.right2.code)) {
            keys += 'r';
        }
        if (keyIsDown(config.settings.controls.down1.code) || keyIsDown(config.settings.controls.down2.code)) {
            keys += 'd';
        }
        switch (keys) {
            case 'l':
                this.cursor.x -= this.speed;
                break;
            case 'u':
                this.cursor.y -= this.speed;
                break;
            case 'r':
                this.cursor.x += this.speed;
                break;
            case 'd':
                this.cursor.y += this.speed;
                break;
            case 'lu':
                this.cursor.x -= this.speed * Z.cos45;
                this.cursor.y -= this.speed * Z.cos45;
                break;
            case 'lr':
                // Net zero
                break;
            case 'ld':
                this.cursor.x -= this.speed * Z.cos45;
                this.cursor.y += this.speed * Z.cos45;
                break;
            case 'ur':
                this.cursor.x += this.speed * Z.cos45;
                this.cursor.y -= this.speed * Z.cos45;
                break;
            case 'ud':
                // Net zero
                break;
            case 'rd':
                this.cursor.x += this.speed * Z.cos45;
                this.cursor.y += this.speed * Z.cos45;
                break;
            case 'lur':
                this.cursor.y -= this.speed; // Net up
                break;
            case 'lud':
                this.cursor.x -= this.speed; // Net left
                break;
            case 'lrd':
                this.cursor.y += this.speed; // Net down
                break;
            case 'urd':
                this.cursor.x += this.speed; // Net right
                break;
            case 'lurd':
                // Net zero
                break;
        }
        if (keys !== '') {
            this.off.x = this.cursor.x - center.x;
            this.off.y = this.cursor.y - center.y;
        }
    }

    /**
     * Kill this org
     * @param spectating Whether or not this player should become a spectator
     */
    die(spectating) {
        connection.emit('dead', spectating);
        this.clearIntervals();
        Abilities.reset(ability);
    }

    /**
     * Render this org on the canavs
     * @param {org} org The org to render
     * @return {void}
     */
    static renderAll() {
        let src = getSrc();

        let org_count = src.orgs.length;
        for (let o = 0; o < org_count; o++) {
            let org = src.orgs[o];

            for (let j = 0; j < org.count; j++) {
                let cell = org.cells[j];
                fill(org.color.r, org.color.g, org.color.b);
                switch (org.skin) {
                    case 'grid':
                        stroke(40, 40, 40); // Draw constant grid (natural grid is variable)
                        strokeWeight(.25);
                        rect(cell.x, cell.y, cell.width, cell.height);
                        break;
                    case 'circles':
                        noStroke();
                        ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
                        break;
                    case 'ghost':
                        noFill();
                        stroke(org.color.r, org.color.g, org.color.b);
                        strokeWeight(1);
                        rect(cell.x, cell.y, cell.width, cell.height);
                        break;
                    case 'none':
                        stroke(org.color.r, org.color.g, org.color.b); // Stroke over natural grid
                        strokeWeight(1);
                        rect(cell.x, cell.y, cell.width, cell.height);
                        break;
                }
            }
        }
    }
}
