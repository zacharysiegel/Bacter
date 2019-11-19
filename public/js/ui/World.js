class World {
    /**
     * Construct a new World object
     * @param {Number} width
     * @param {Number} height
     * @param {String} type
     * @param {String} color
     * @param {Number} x
     * @param {Number} y
     */
    constructor(width, height, type, color, x=0, y=0) { // data: { width: , height: , type: , color: , x: , y: }
        this.host = connection.socket.id; // Cannot call Game.game.info.host since Game.game is not fully constructed yet; World() can only be called by host, so connection.socket.id is ok
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.type = type;
        this.color = color;
        for (let i in config.colors.world) {
            if (i === this.color) {
                this.background = config.colors.world[i];
                break;
            }
        }
        this.interval = undefined;
        this.border = {
            color: undefined,
            weight: 1
        };
        this.backdrop = config.colors.backdrop;
        this.border.weight = 1;
        if (this.color === 'black') {
            this.border.color = { r: 255, g: 255, b: 255 };
        } else if (this.color === 'white') {
            this.border.color = { r: 0, g: 0, b: 0 };
        }
    }

    /**
     * Render the given world
     *    This function is static rather than an instance member because the
     *      JSON.stringify used in the Socket.io transfer of the Game object
     *      ignores functions and prototypes
     */
    static render(world) {
        // Background
        background(world.backdrop.r, world.backdrop.g, world.backdrop.b);

        // Shadows
        fill(world.backdrop.r - 20, world.backdrop.g - 20, world.backdrop.b - 20);
        noStroke();
        { // World
            if (world.type === 'rectangle') { // World
                rect(world.x + world.width / 2 + 7, world.y + world.height / 2 + 6, world.width, world.height);
            } else if (world.type === 'ellipse') {
                ellipse(world.x + world.width / 2 + 5, world.y + world.height / 2 + 4, world.width / 2, world.height / 2);
            }
        }
        { // Leaderboard
            translate(org.off.x, org.off.y); // Shadows in renderWorld() so it will render behind world
            rectMode(CORNER);
            Game.game.board.y = Game.game.board.marginTop; // Leaderboard Head
            switch (Game.game.info.mode) {
                case 'ffa':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth, Game.game.board.rowHeight);
                    Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
                    break;
                case 'skm':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth, Game.game.board.rowHeight);
                    Game.game.board.count = Game.game.teams.length;
                    break;
                case 'srv':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                    Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
                    break;
                case 'ctf':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                    Game.game.board.count = Game.game.teams.length;
                    break;
                case 'inf':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.rowHeight);
                    Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
                    break;
                case 'kth':
                    Game.game.board.x = width - (Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth) - Game.game.board.marginRight;
                    rect(Game.game.board.x + 4, Game.game.board.y + 3, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                    Game.game.board.count = min(Game.game.board.show, Game.game.board.list.length);
                    break;
            }
            let a = 0;
            for (let i = 0; i < Game.game.board.count; i++) { // Leaderboard Body
                if (Game.game.info.mode !== 'skm' && Game.game.info.mode !== 'ctf') { // If not a team mode
                    let spectator = false;
                    for (let j = 0; j < Game.game.spectators.length; j++) {
                        if (Game.game.board.list[i].player === Game.game.spectators[j]) {
                            spectator = true;
                            break;
                        }
                    }
                    if (spectator === true) {
                        if (i < Game.game.board.count) {
                            if (Game.game.board.count < Game.game.info.count) {
                                Game.game.board.count++; // Extend leaderboard length to include the next player
                                i++; // Do not render leaderboard status if player is a spectator
                            } else {
                                continue;
                            }
                        }
                    }
                }
                switch (Game.game.info.mode) {
                    case 'ffa':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth, Game.game.board.rowHeight);
                        break;
                    case 'skm':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth + Game.game.board.threeWidth, Game.game.board.rowHeight);
                        break;
                    case 'srv':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                        break;
                    case 'ctf':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                        break;
                    case 'inf':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth, Game.game.board.rowHeight);
                        break;
                    case 'kth':
                        rect(Game.game.board.x + 4, Game.game.board.y + 3 + (a + 1) * Game.game.board.rowHeight, Game.game.board.nameWidth + Game.game.board.oneWidth + Game.game.board.twoWidth, Game.game.board.rowHeight);
                        break;
                }
                a++;
            }
            translate(-org.off.x, -org.off.y);
            rectMode(CENTER);
        } { // Messages
            translate(org.off.x, org.off.y);
            if (config.settings.messages === true) {
                textFont('Helvetica');
                textStyle(NORMAL);
                const message = new Message();
                if (message.hasText) {
                    rect(5 + 25 + message.width / 2, 4 + 25 + 9 * message.breaks, 25 + message.width, 26 + 18 * message.breaks);
                }
            }
            translate(-org.off.x, -org.off.y);
        }

        // World
        fill(world.background.r, world.background.g, world.background.b);
        stroke(world.border.color.r, world.border.color.g, world.border.color.b);
        strokeWeight(world.border.weight);
        if (world.type === 'rectangle') {
            rect(world.x + world.width / 2, world.y + world.height / 2, world.width, world.height); // World border
        } else if (world.type === 'ellipse') {
            ellipse(world.x + world.width / 2, world.y + world.height / 2, world.width / 2, world.height / 2); // World border
        }

        // CTF
        if (Game.game.info.mode === 'ctf') {
            // Bases
            for (let i = 1; i < Game.game.teams.length + 1; i++) {
                let color = config.colors.teamsDef[config.colors.teams[i - 1]];
                stroke(config.colors.orgs[world.color][color].r, config.colors.orgs[world.color][color].g, config.colors.orgs[world.color][color].b);
                strokeWeight(3);
                let bin = i.toString(2); // Convert i to binary string
                if (bin.length < 2) {
                    bin = '0' + bin; // Add zero to front to form equivalent two-length binary number
                }
                let x = world.x + (world.width * parseInt(bin[bin.length - 1]));
                let y = world.y + (world.height * parseInt(bin[bin.length - 2]));
                let theta;
                if (bin === '01') {
                    theta = 270;
                } else if (bin === '10') {
                    theta = 90;
                } else if (bin === '11') {
                    theta = 180;
                } else if (bin === '100') {
                    theta = 0;
                }
                let l = 150;
                if (world.type === 'rectangle') {
                    arc(x, y, l, l, -theta + 1, -theta + 89); // -1 to avoid world border overlap with a degree cushion either side
                } else if (world.type === 'ellipse') {
                    let r = world.width / 2;
                    let h = x + cos(-theta + 45) * r * (Z.root2 - 1); // l = r(Z.root2 - 1); length from circle to square corner
                    let k = y + sin(-theta + 45) * r * (Z.root2 - 1); // yoff = l*sin(-theta + 45); -theta + 45 gives angle to center
                    let a = world.x + r; // a is world center x
                    let b = world.y + r; // b is world center y
                    let diffs = [];
                    let points = [ /*{ p: Number, q: Number }*/ ];
                    for (let j = 0; j < 720; j++) {
                        let alpha = j;
                        let p = h + l * cos(alpha);
                        let q = k + l * sin(alpha);
                        let d = abs(sqrt(sq(p - a) + sq(q - b)) - r); // Calculate distance of point on base circle to world circle
                        diffs.push(d); // Store all distances to array
                        points.push({ p: p, q: q }); // Store all points to array
                    }
                    let point = points[diffs.indexOf(min(diffs))]; // Find closest point to world circle (points and diffs are analogous)
                    let phi = atan(abs(point.q - k) / abs(point.p - h));
                    if (phi > 45) {
                        phi = 90 - phi;
                    }
                    arc(h, k, l, l, -theta - phi + 1, -theta + 90 + phi - 1); // -1 to avoid world border overlap
                }
            }
            // Flag
            noFill();
            stroke(world.border.color.r, world.border.color.g, world.border.color.b);
            strokeWeight(2);
            line(Game.game.flag.x - Game.game.flag.width / 2, Game.game.flag.y - Game.game.flag.height / 2, Game.game.flag.x - Game.game.flag.width / 2, Game.game.flag.y + Game.game.flag.height / 2);
            fill(Game.game.flag.color.r, Game.game.flag.color.g, Game.game.flag.color.b);
            strokeWeight(1);
            triangle(Game.game.flag.x - Game.game.flag.width / 2, Game.game.flag.y - Game.game.flag.height / 2, Game.game.flag.x - Game.game.flag.width / 2, Game.game.flag.y, Game.game.flag.x + Game.game.flag.width / 2, Game.game.flag.y - Game.game.flag.height / 4);
        }
    }
}
