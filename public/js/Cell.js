class Cell {
    constructor(x, y, org) {
        this.player = org.player;
        this.width = config.game.cell_width;
        this.height = config.game.cell_width; // this.width should equal this.height
        this.x = x; // Cell Center's x coordinate
        this.y = y; // Cell Center's y coordinate
        this.color = org.color; // ^ Causes errors when sending cells to server in 'org update'
        this.org_cursor = org.cursor; // org.cursor is stored because if the entire org was stored, the cell would be recursive (org contains cell)
    }

    /**
     * Check if two cells are equivalent
     * @param rhs Cell to be checked against this one (this is lhs)
     * @param tol The tolerance to be used in x and y positional comparison
     *    Default value is .1
     * @returns Boolean true if equal, else false
     */
    equals(rhs, tol) {
        if (!(rhs instanceof Cell)) {
            console.error('Illegal Argument :: {Cell}.equals :: Attempting to compare with an invalid type');
            return false;
        }

        if (!tol) tol = .001; // Default tolerance to be used in x/y position equality
        return (rhs instanceof Cell) && (this.player === rhs.player) && (this.x - tol < rhs.x && rhs.x < this.x + tol) && (this.y - tol < rhs.y && rhs.y < this.y + tol);
    }

    /**
     * The distance to the org's cursor
     * @returns {Number} The distance from the cursor to the org's center
     */
    get r() {
        return sqrt(this.r2);
    }

    /**
     * The sum of the squares of the x and y distances to the org's cursor
     * @returns {Number} The square of the distance from the cursor to the cell
     */
    get r2() {
        return sq(this.x - this.org_cursor.x) + sq(this.y - this.org_cursor.y);
    }

    /**
     * Determine if the given cell is outside the world boundary
     *     Includes a margin
     * @returns {Boolean} True if the location is out of the world bounds
     */
    get isOutsideWorld() {
        let src = getSrc();

        if (src.world) {
            if (src.world.type === 'rectangle') { // If new cell would be outside a rectangular world's boundary
                if (this.x - this.width <= src.world.x || // West
                    this.x + this.width >= src.world.x + src.world.width || // East
                    this.y - this.height <= src.world.y || // North
                    this.y + this.height >= src.world.y + src.world.height) { // South
                    return true;
                }
            } else if (src.world.type === 'ellipse') { // If the new cell would be outside an elliptical world's boundary
                let a = src.world.width / 2;
                let a2 = sq(a);
                let b = src.world.height / 2;
                let b2 = sq(b);
                let x, y;

                x = (this.x - this.width) - a;
                y = (this.y - this.height) - b;
                if (sq(x) / a2 + sq(y) / b2 >= 1) { // If top-left corner is outside ellipse
                    return true;
                }
                x = (this.x + this.width) - a;
                y = (this.y - this.height) - b;
                if (sq(x) / a2 + sq(y) / b2 >= 1) { // If top-right corner is outside ellipse
                    return true;
                }
                x = (this.x + this.width) - a;
                y = (this.y + this.height) - b;
                if (sq(x) / a2 + sq(y) / b2 >= 1) { // If bottom-right corner is outside ellipse
                    return true;
                }
                x = (this.x - this.width) - a;
                y = (this.y + this.height) - b;
                if (sq(x) / a2 + sq(y) / b2 >= 1) { // If bottom-left corner is outside ellipse
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Detect collisions between the given cell and an opponent's org
     * @return {Boolean} True if collision is detected, else false
     */
    get collidesWithOpponent() {
        const src = getSrc();

        let org_count = src.orgs.length;
        for (let o = 0; o < org_count; o++) {
            const opp_org = src.orgs[o];
            if (opp_org.player === this.player) { // If org is player's org
                continue;
            }

            for (let c = 0; c < opp_org.count; c++) {
                const opp = opp_org.cells[c]; // Opponent's cell
                const cell_bottom = this.y + this.height / 2;
                const cell_right = this.x + this.width / 2;
                const cell_top = cell_bottom - this.height;
                const cell_left = cell_right - this.width;
                const opp_bottom = opp.y + this.height / 2;
                const opp_right = opp.x + this.width / 2;
                const opp_top = opp_bottom - this.height;
                const opp_left = opp_right - this.width;

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
