let tutorial; // Initialize in global scope; TODO: Convert this into static field on class Tutorial

class Tutorial {
    constructor() {
        this.src = 'tutorial';
        this.task = 'move';
        this.taskTimeout = undefined;
        this.margin = config.game.margin_width;
        this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin }); { // Org
            let colors = [];
            for (let j in config.colors.orgs.black) {
                if (j !== 'sun' && j !== 'sky') { // No bright colors which would obscure the crosshair in tutorial to minimize confusion
                    colors.push(config.colors.orgs.black[j]);
                }
            }
            let color = colors[Math.floor(Math.random() * colors.length)];
            if (connection.socket.id === undefined) {
                console.error("Connection not made yet");
            }
            org = new Org({ player: connection.socket.id, color: color, skin: 'none', spectating: false, cursor: { x: center.x, y: center.y } });
            org.cells[0] = new Cell(org.cursor.x, org.cursor.y, org); // Create first cell in org
            org.count++;
        }
        this.orgs = [ org ];
        this.abilities = [ ability ];
        this.org_interval = setInterval(() => {
            for (let i = 0; i < this.orgs.length; i++) {
                this.orgs[i].grow();
                if (!org.alive) {
                    this.orgs[i].cells[0] = new Cell(org.cursor.x, org.cursor.y, org); // Create first cell in org
                    this.orgs[i].count++;
                }
            }
        }, config.game.org_frequency); // 70ms

        this.render_interval = setInterval(() => {
            // Render
            background(this.world.backdrop.r, this.world.backdrop.g, this.world.backdrop.b); // Render Background

            // Shadows
            fill(this.world.backdrop.r - 20, this.world.backdrop.g - 20, this.world.backdrop.b - 20); // World Shadow
            noStroke();
            rect(this.world.x + this.world.width / 2 + 7, this.world.y + this.world.height / 2 + 6, this.world.width, this.world.height);

            const message = new Message();
            if (config.settings.messages === true) { // Render Messages; TODO: Should users be allowed to turn these messages off?
                textFont('Helvetica');
                textStyle(NORMAL);
                if (message.hasText) {
                    rect(5 + 25 + message.width / 2, 4 + 25 + 9 * message.breaks, 25 + message.width, 26 + 18 * message.breaks);
                }
            }

            // World
            fill(this.world.background.r, this.world.background.g, this.world.background.b);
            stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
            strokeWeight(1);
            rect(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.width, this.world.height);

            // Game
            Abilities.renderToxin(ability);
            Abilities.renderSecretions(ability);
            Abilities.renderNeutralize(ability);
            Org.renderAll();
            Abilities.renderSpores(ability);
            if (this.task !== 'move' && this.task !== 'survive') {
                translate(-org.off.x, -org.off.y);
                HUD.render();
                translate(org.off.x, org.off.y);
            }

            noFill(); // Crosshair
            stroke(this.world.border.color.r, this.world.border.color.g, this.world.border.color.b);
            strokeWeight(1);
            line(org.cursor.x - 4, org.cursor.y, org.cursor.x + 4, org.cursor.y);
            line(org.cursor.x, org.cursor.y - 4, org.cursor.x, org.cursor.y + 4);
            message.render(); // Render messages outside translation

            if (this.stopped === false) { // Calculate
                if (ability.spore.value === true) {
                    ability.spore.interval();
                }
                for (let i = 0; i < 3; i++) {
                    if (ability.shoot.value[i] === true) {
                        ability.shoot.interval[i]();
                    }
                }
                if (Game.state === 'tutorial') {
                    org.move();
                }
            }
            this.detect();
        }, config.game.render_frequency); // 40ms
        this.stopped = false;
        this.stopdate = undefined;
    }

    stop() {
        this.stopped = true;
        this.stopdate = new Date();
        clearInterval(this.org_interval);
    }

    /**
     * Clear the intervals related to the tutorial
     */
    clear() {
        clearInterval(this.org_interval);
        clearInterval(this.render_interval);
    }

    detect() {
        switch (this.task) {
            case 'move': {
                if (keyIsDown(config.settings.controls.left1.code) ||
                    keyIsDown(config.settings.controls.left2.code) ||
                    keyIsDown(config.settings.controls.up1.code) ||
                    keyIsDown(config.settings.controls.up2.code) ||
                    keyIsDown(config.settings.controls.right1.code) ||
                    keyIsDown(config.settings.controls.right2.code) ||
                    keyIsDown(config.settings.controls.down1.code) ||
                    keyIsDown(config.settings.controls.down2.code)) { // If a directional key is pressed
                    this.task = 'fullscreen';
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            this.task = 'survive';
                        }, 3500);
                    }
                }
                break;
            } // TODO: Skip fullscreen task once F11 is pressed
            case 'survive': {
                if (this.taskTimeout === undefined) {
                    this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined; // Set task to 'extend'
                        this.task = 'extend';
                        ability.extend.activated = true;
                        ability.extend.can = true;
                    }, 4500);
                }
                break;
            }
            case 'extend': {
                if (keyIsDown(config.settings.controls.ability1.code)) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined; // Set task to 'immortality'
                            ability.extend.activated = false;
                            ability.extend.can = false;
                            this.task = 'immortality';
                            ability.immortality.activated = true;
                            ability.immortality.can = true;
                        }, ability.extend.time);
                    }
                }
                break;
            }
            case 'immortality': {
                if (keyIsDown(config.settings.controls.ability2.code)) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined; // Set task to 'neutralize'
                            ability.immortality.activated = false;
                            ability.immortality.can = false;
                            this.task = 'neutralize';
                            ability.neutralize.activated = true;
                            ability.neutralize.can = true;
                        }, ability.immortality.time);
                    }
                }
                break;
            }
            case 'neutralize': {
                if (keyIsDown(config.settings.controls.ability3.code)) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            ability.neutralize.activated = false;
                            ability.neutralize.can = false;
                            this.task = 'shoot';
                            ability.compress.activated = true;
                            ability.compress.can = true;
                            ability.freeze.activated = true;
                            ability.freeze.can = true;
                        }, ability.neutralize.time);
                    }
                }
                break;
            }
            case 'shoot': {
                if (this.taskTimeout === undefined) {
                    this.taskTimeout = setTimeout(() => {
                        this.taskTimeout = undefined;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                        this.task = 'compress';
                        ability.compress.activated = true; // Redundancy
                        ability.compress.can = true; // Redundancy
                    }, 10000);
                }
                break;
            }
            case 'compress': {
                if (this.orgs.length === 1) {
                    let colors = [];
                    for (let j in config.colors.orgs.black) {
                        if (j !== 'sun' && j !== 'lime')
                            colors.push(config.colors.orgs.black[j]);
                    }
                    let color = colors[Math.floor(Math.random() * colors.length)];
                    let cursor;
                    do {
                        cursor = { x: Math.random() * this.world.width, y: Math.random() * this.world.height };
                    } while (sqrt(sq(cursor.x - org.cursor.x) + sq(cursor.y - org.cursor.y)) < config.game.default_range + 30); // config.game.default_range + 20 is maximum extend range
                    this.orgs.push(new Org({ player: 'bot' + 1, color: color, skin: 'none', spectating: false, cursor: cursor }));
                    this.orgs[1].cells[0] = new Cell(this.orgs[1].cursor.x, this.orgs[1].cursor.y, this.orgs[1]); // Create first cell in org
                    this.orgs[1].count++;
                    this.abilities[1] = new Ability( 'bot' + 1);
                }
                if (ability.compress.applied) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            ability.compress.activated = false;
                            ability.compress.can = false;
                            ability.freeze.activated = true;
                            ability.freeze.can = true;
                            this.task = 'freeze';
                        }, ability.compress.time);
                    }
                }
                break;
            }
            case 'freeze': {
                if (ability.freeze.applied) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            ability.freeze.activated = false;
                            ability.freeze.can = false;
                            ability.toxin.activated = true;
                            ability.toxin.can = true;
                            this.task = 'toxin';
                        }, ability.freeze.time);
                    }
                }
                break;
            }
            case 'toxin': { // TODO: Add 'Damage the bot to progress
                if (keyIsDown(config.settings.controls.ability3.code)) {
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            ability.toxin.activated = false;
                            ability.toxin.can = false; // All ability can values are reset to true after task change by cooldown; not a problem at the moment; can = false is useless at the moment
                            this.task = 'spore';
                            ability.spore.activated = true;
                            ability.spore.can = true;
                            ability.secrete.activated = true; // .can = false
                        }, ability.toxin.time);
                    }
                }
                break;
            }
            case 'spore': {
                let current = new Date();
                if (ability.secrete.value === true) {
                    if (this.stopped === true) {
                        this.stopped = false;
                        this.org_interval = setInterval(() => { // Restart
                            for (let i = 0; i < this.orgs.length; i++) {
                                this.orgs[i].grow();
                                if (!org.alive) {
                                    this.orgs[i].cells[0] = new Cell(org.cursor.x, org.cursor.y, org); // Create first cell in org
                                    this.orgs[i].count++;
                                }
                            }
                        }, config.game.org_frequency); // 70ms
                        ability.spore.end = new Date();
                        ability.secrete.start = new Date();
                    }
                    if (this.taskTimeout === undefined) {
                        this.taskTimeout = setTimeout(() => {
                            this.taskTimeout = undefined;
                            ability.spore.activated = false;
                            ability.spore.can = false;
                            ability.secrete.activated = false;
                            ability.secrete.can = false;
                            this.task = 'done';
                        }, ability.secrete.time);
                    }
                } else if (ability.spore.value === true && current - ability.spore.start >= ability.spore.time / 2) {
                    if (this.stopped === false) {
                        clearInterval(ability.spore.interval);
                        clearTimeout(ability.spore.timeout);
                        this.stop();
                    }
                }
                break;
            }
        }
    }

    resize(x, y, w, h) {
        center.x = window.innerWidth / 2;
        center.y = window.innerHeight / 2;
        let old_x = this.world.x - this.margin;
        let old_y = this.world.y - this.margin;
        for (let i = 0; i < this.orgs.length; i++) {
            this.orgs[i].cursor.x = (this.orgs[i].cursor.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly
            this.orgs[i].cursor.y = (this.orgs[i].cursor.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size
            this.orgs[i].cells = [];
            this.orgs[i].cells[0] = new Cell(this.orgs[i].cursor.x, this.orgs[i].cursor.y, this.orgs[i]);
            this.orgs[i].count = 1;
        }
        this.world = new World({ width: w - this.margin * 2, height: h - this.margin * 2, type: 'rectangle', color: 'black', x: x + this.margin, y: y + this.margin });
        if (Game.state === 'tutorial') this.render(); // Only render if Game.state is 'tutorial'; otherwise, will render over pause menu
    }

    render() {
        clearInterval(title.interval);
        ReactDOM.render(<CanvasCont />, Z.eid('root'));
        Game.state = 'tutorial';
    }
}
