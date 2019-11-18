let ability;

class Ability {
    constructor(player) {
        this.player = player;
        this.auto = false;
        this.extend = {
            value: false,
            activated: false, // If this ability was selected in the join menu
            can: false, // If this ability is currently available for use
            i: 0,
            j: 0,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 4500,
            cooldown: 4000
        };
        this.compress = {
            value: false,
            applied: false,
            activated: false,
            can: false,
            i: 0,
            j: 1,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 3500,
            cooldown: 4000
        };
        this.immortality = {
            value: false,
            activated: false,
            can: false,
            i: 1,
            j: 0,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 3500,
            cooldown: 6000
        };
        this.freeze = {
            value: false,
            applied: false,
            activated: false,
            can: false,
            i: 1,
            j: 1,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 4000,
            cooldown: 6000
        };
        this.neutralize = {
            value: false,
            activated: false,
            can: false,
            i: 2,
            j: 0,
            radius: 60,
            color: { r: 0, g: 179, b: 12 },
            weight: 3,
            x: undefined,
            y: undefined,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 3500,
            cooldown: 6500
        };
        this.toxin = {
            value: false,
            activated: false,
            can: false,
            i: 2,
            j: 1,
            radius: 60,
            color: { r: 255, g: 111, b: 92 },
            weight: 3,
            x: undefined,
            y: undefined,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 4000,
            cooldown: 6000
        };
        this.spore = {
            value: false,
            activated: false,
            i: 3,
            j: 0,
            interval: undefined,
            speed: 6,
            spores: [],
            count: 0,
            can: false,
            timeout: undefined,
            start: undefined,
            end: undefined,
            cooling: false,
            time: 1700,
            cooldown: 7500 // 7500 default
        };
        this.secrete = {
            value: false,
            activated: false,
            i: 3,
            j: 1,
            color: { r: undefined, g: undefined, b: undefined },
            radius: config.game.cell_width / Z.cos45 * 2.9,
            can: false,
            timeout: undefined,
            start: undefined,
            end: undefined,
            time: 800
        };
        this.shoot = {
            value: [ false, false, false ],
            can: [ true, true, true ],
            secrete: [{}, {}, {}
                // { // Sets values on use
                //    value: false,
                //    color: undefined,
                //    radius: config.game.cell_width / Z.cos45 * 2.7 / 2, // Half 'secrete'
                //    hit: false,
                //    timeout: undefined,
                //    start: undefined,
                //    end: undefined,
                //    time: 800 // Same as 'secrete'
                // }
            ],
            spore: [undefined, undefined, undefined],
            speed: 5,
            interval: [undefined, undefined, undefined],
            timeout: [undefined, undefined, undefined],
            start: [undefined, undefined, undefined],
            end: [undefined, undefined, undefined],
            time: 1500,
            cooling: [false, false, false],
            cooldown: [2000, 2000, 2000]
        };
        this.tag = {
            value: false,
            activated: false,
            i: 0,
            j: 1,
            can: false,
            timeout: undefined,
            start: undefined,
            end: undefined,
            time: 0,
            cooldown: 5000
        };
        // speed: { // Not updated
        //    value: false,
        //    activated: false,
        //    i: 0,
        //    j: 0,
        //    factor: 2,
        //    timeout: undefined,
        //    time: 5000
        // };
        // slow: { // Not updated
        //    value: false,
        //    activated: false,
        //    i: 0,
        //    j: 1,
        //    factor: 2,
        //    timeout: undefined,
        //    time: 5000
        // };
        // stimulate: {
        //    value: false,
        //    activated: false,
        //    can: false,
        //    i: 2,
        //    j: 0,
        //    factor: 9, // Factor must be equal to that of poison
        //    timeout: undefined,
        //    start: undefined,
        //    end: undefined,
        //    cooling: false,
        //    time: 3000,
        //    cooldown: 5000
        // },
        // poison: {
        //    value: false,
        //    activated: false,
        //    can: false,
        //    i: 2,
        //    j: 1,
        //    factor: 9, // Factor must be equal to that of stimulate
        //    timeout: undefined,
        //    start: undefined,
        //    end: undefined,
        //    cooling: false,
        //    time: 3000,
        //    cooldown: 5000
        // },
    }

    /**
     * Invoke an ability function by the ability's indices
     * @param {Number} I 0, 1, 2, 3
     * @param {Number} J 0, 1
     * @param {String} player ID of the player to which the ability is applied
     */
    use(I, J, player) {
        if (I === 0) {
            if (J === 0) {
                if (this.extend.activated) {
                    this.use_extend(player);
                }
            } else if (J === 1) {
                if (this.compress.activated) {
                    this.use_compress(player);
                } else if (this.tag.activated) {
                    this.use_tag(player);
                }
            }
        } else if (I === 1) {
            if (J === 0) {
                if (this.immortality.activated) {
                    this.use_immortality(player);
                }
            } else if (J === 1) {
                if (this.freeze.activated) {
                    this.use_freeze(player);
                }
            }
        } else if (I === 2) {
            if (J === 0) {
                if (this.neutralize.activated) {
                    this.use_neutralize(player);
                }
            } else if (J === 1) {
                if (this.toxin.activated) {
                    this.use_toxin(player);
                }
            }
        } else if (I === 3) {
            if (J === 0) {
                if (this.spore.activated) {
                    this.use_spore(player);
                }
            } else if (J === 1) {
                if (this.secrete.activated) {
                    this.use_secrete(player);
                }
            }
        }
    }

    /**
     * Shoot an exposed cell
     *    Cell determined by closest proximity to the user's mouse cursor
     * @param I Identifier for ability to be applied if shoot is successful
     * @param J Identifier for ability to be applied if shoot is successful
     */
    use_shoot(I, J) { // Both parameters are required
        if (this.shoot.value[I] === false && this.shoot.can[I] === true) { // If not currently shooting and if can shoot specified ability (Should have been checked before this point)
            this.shoot.value[I] = true;
            this.shoot.can[I] = false;
            this.shoot.secrete[I].value = false;
            clearTimeout(this.shoot.timeout[I]); // Reset timeout
            this.shoot.start[I] = new Date(); // Set start time

            // Get Spore
            let theta;
            if (mouseX === Infinity || mouseY === Infinity) {
                let mpos = getMpos();
                mouseX = mpos.x;
                mouseY = mpos.y;
            }
            if (Game.state !== 'tutorial') {
                theta = atan((mouseY - center.y) / (mouseX - center.x)); // Get angle (theta) from mouse pointer
                if (mouseX < center.x) { // If mouse is in second or third quadrants
                    theta += 180; // Correct theta for negative x
                }
            } else {
                theta = atan((mouseY - org.cursor.y) / (mouseX - org.cursor.x));
                if (mouseX < org.cursor.x) { // If mouse is in second or third quadrants
                    theta += 180; // Correct theta for negative x
                }
            }

            // Determine which exposed cell to shoot
            let deltas = [];
            const exposed = Array.from(org.regions.exposed);
            const exposed_count = exposed.length;

            for (let i = 0; i < exposed_count; i++) { // Loop through exposed cells
                let phi = atan((exposed[i].y - org.y) / (exposed[i].x - org.x)); // Get angle (phi) of each exposed cell
                if (exposed[i].x - org.x < 0) {
                    phi += 180;
                }
                deltas.push(abs(theta - phi)); // Calculate difference between theta and phi and collect in 'deltas' array
            }

            let min = deltas[0];
            for (let i = 1; i < deltas.length; i++) {
                if (deltas[i] < min) { // Calculate minimum delta
                    min = deltas[i];
                }
            }

            this.shoot.spore[I] = exposed[deltas.indexOf(min)]; // Set spore as the cell with angle phi closest to mouse angle theta
            for (let i = 0; i < org.count; i++) {
                if (this.shoot.spore[I].equals(org.cells[i])) { // Find spore in org
                    org.removeCell(i); // Remove spore cell from org
                    i--;
                    break;
                }
            }
            this.shoot.spore[I].speed = this.shoot.speed;
            this.shoot.spore[I].theta = theta;

            // Interval
            this.shoot.interval[I] = () => {
                this.shoot.spore[I].x += this.shoot.spore[I].speed * cos(this.shoot.spore[I].theta);
                this.shoot.spore[I].y += this.shoot.spore[I].speed * sin(this.shoot.spore[I].theta);
                if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            };

            // Timeout
            this.shoot.timeout[I] = setTimeout(() => {
                if (this.shoot.value[I] === true && this.shoot.secrete[I].value === false) {
                    this.shoot.value[I] = false;
                    this.shoot.spore[I] = undefined;
                    this.shoot.cooling[I] = true;
                    this.shoot.end[I] = new Date();
                    this.shoot.secrete[I].end = new Date();
                    if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
                }
            }, this.shoot.time);

        } else if (this.shoot.value[I] === true) { // If currently shooting (secrete)
            this.shoot.end[I] = new Date();
            this.shoot.value[I] = false;
            this.shoot.secrete[I].radius = config.game.cell_width / Z.cos45 * 2.9 / 2; // Not predefined (Half secrete)
            this.shoot.secrete[I].hit = false;
            this.shoot.secrete[I].time = 800; // Not predefined (Same as secrete)
            clearTimeout(this.shoot.timeout[I]);
            this.shoot.secrete[I].start = new Date();
            this.shoot.secrete[I].color = org.color;

            // Hit (Apply Ability) (Hit detection on local machine)
            let src = getSrc();
            for (let i = 0; i < src.orgs.length; i++) {
                if (src.orgs[i].player === connection.socket.id || org.team && src.orgs[i].team === org.team) { // Do not apply ability to self or teammate
                    continue;
                }
                for (let j = 0; j < src.orgs[i].count; j++) {
                    if (sqrt(sq(src.orgs[i].cells[j].x - this.shoot.spore[I].x) + sq(src.orgs[i].cells[j].y - this.shoot.spore[I].y)) < this.shoot.secrete[I].radius) { // If center of cell is within circle (subject to change)
                        if (src.abilities[i].neutralize.value === true && sqrt(sq(src.orgs[i].cells[j].x - src.abilities[i].neutralize.x) + sq(src.orgs[i].cells[j].y - src.abilities[i].neutralize.y)) <= src.abilities[i].neutralize.radius) { // If center of cell is within neutralize circle
                            continue;
                        }
                        this.use(I, J, src.orgs[i].player); // Apply ability to target
                        this.shoot.secrete[I].hit = true;
                        break;
                    }
                }
            }

            this.shoot.secrete[I].value = true; // Value after hit detection so 'grow' hit detection does not run before initial
            if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            this.shoot.secrete[I].timeout = setTimeout(() => {
                this.shoot.secrete[I].value = false;
                this.shoot.secrete[I].end = new Date(); { // Copy of 'shoot' timeout
                    this.shoot.value[I] = false;
                    this.shoot.spore[I] = undefined;
                    this.shoot.cooling[I] = true;
                    this.shoot.end[I] = new Date();
                }
                clearTimeout(this.shoot.timeout[I]);
                this.shoot.timeout[I] = undefined;
                if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            }, this.shoot.secrete[I].time);
        }
    }

    use_tag(player) {
        connection.emit('tag', player);
        this.tag.can = false;
        this.tag.start = new Date();
        if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
        setTimeout(() => {
            this.tag.end = new Date();
            this.tag.cooling = true;
        }, this.tag.time);
    }

    use_extend(player) {
        this.extend.can = false;
        connection.emit('extend', player);
    }

    use_compress(player) {
        let src = getSrc();
        if (src.src === 'tutorial') { // Since orgs are locally grown in tutorial, abilities must be locally applied
            for (let i = 0; i < src.abilities.length; i++) {
                if (src.abilities[i].player === player) {
                    src.abilities[i].compress.value = true;
                    clearTimeout(src.abilities[i].compress.timeout);
                    src.abilities[i].compress.timeout = setTimeout(() => {
                        src.abilities[i].compress.value = false;
                    }, src.abilities[i].compress.time);
                }
            }
        } else {
            connection.emit('compress', player);
        }

        this.compress.applied = true;
        this.compress.can = false; // Redundancy
        this.compress.start = new Date();
        if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
        setTimeout(() => {
            this.compress.end = new Date();
            this.compress.applied = false;
            this.compress.cooling = true;
        }, this.compress.time);
    }

    // use_speed(player) {
    //     connection.emit('Speed', player);
    // }
    //
    // use_slow(player) {
    //     connection.emit('Slow', player);
    // }

    use_immortality(player) {
        this.immortality.can = false;
        connection.emit('immortality', player);
    }

    use_freeze(player) {
        let src = getSrc();
        if (src.src === 'tutorial') { // Since orgs are locally grown in tutorial, abilities must be locally applied
            for (let i = 0; i < src.abilities.length; i++) {
                if (src.abilities[i].player === player) {
                    src.abilities[i].freeze.value = true;
                    clearTimeout(src.abilities[i].freeze.timeout);
                    src.abilities[i].freeze.timeout = setTimeout(() => {
                        src.abilities[i].freeze.value = false;
                    }, src.abilities[i].freeze.time);
                }
            }
        } else {
            connection.emit('freeze', player);
        }

        this.freeze.applied = true;
        this.freeze.can = false; // Redundancy
        this.freeze.start = new Date();
        if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
        setTimeout(() => {
            this.freeze.end = new Date();
            this.freeze.applied = false;
            this.freeze.cooling = true;
        }, this.freeze.time);
    }

    // use_stimulate(player) {
    //     this.stimulate.can = false;
    //     if (Game.state !== 'tutorial') {
    //         connection.emit('Stimulate', player);
    //     }
    // }

    // use_poison(player) {
    //     connection.emit('Poison', player);
    //     this.poison.can = false; // Redundancy
    //     this.poison.start = new Date();
    //     if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
    //     setTimeout(() => {
    //         this.poison.end = new Date();
    //         this.poison.cooling = true;
    //     }, this.poison.time);
    // }

    use_neutralize(player) {
        connection.emit('neutralize', player);
        this.neutralize.can = false;
    }

    use_toxin(player) {
        connection.emit('toxin', player);
        this.toxin.can = false;
    }

    use_spore() {
        if (this.spore.can === true) { // If spore is allowed
            this.spore.value = true;
            clearTimeout(this.spore.timeout);
            this.spore.can = false;
            this.secrete.can = true;
            this.spore.start = new Date();
            this.spore.spores = Array.from(org.regions.exposed); // All exposed cells become spores
            this.spore.count = this.spore.spores.length;
            for (let i = 0; i < this.spore.count; i++) {
                this.spore.spores[i].color = org.color;
                this.spore.spores[i].theta = atan((this.spore.spores[i].y - org.y) / (this.spore.spores[i].x - org.x)); // Generate angle value
                if (this.spore.spores[i].x < org.x) {
                    this.spore.spores[i].theta += 180;
                }
                this.spore.spores[i].speed = this.spore.speed; // Set spore speed to constant (subject to change)
                for (let j = 0; j < org.count; j++) {
                    if (this.spore.spores[i].equals(org.cells[j])) { // Find corresponding cell to spore
                        org.removeCell(j); // Remove spore cells from org
                        j--;
                    }
                }
            }
            this.spore.interval = () => {
                for (let i = 0; i < this.spore.count; i++) {
                    this.spore.spores[i].x += this.spore.spores[i].speed * cos(this.spore.spores[i].theta);
                    this.spore.spores[i].y += this.spore.spores[i].speed * sin(this.spore.spores[i].theta);
                }
                if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            };
            this.spore.timeout = setTimeout(() => { // End Spore
                if (this.spore.value === true && this.secrete.value === false) { // If secrete() has not been called
                    this.spore.spores = []; // Clear spores array
                    this.spore.value = false;
                    this.spore.end = new Date();
                    this.spore.cooling = true;
                    if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
                }
            }, this.spore.time);
        }
    }

    use_secrete() {
        if (this.secrete.can === true) { // If not already secreting and spores are activated
            this.secrete.value = true;
            this.secrete.can = false;
            this.spore.value = false;
            this.spore.end = new Date(); // Set spore end date for secrete timer calculations
            clearTimeout(this.secrete.timeout);
            this.secrete.start = new Date();
            this.secrete.color = org.color;
            if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            this.secrete.timeout = setTimeout(() => { // End Secrete
                this.secrete.value = false;
                this.secrete.can = true; { // Copy of spore timeout so spore ends when secrete ends
                    this.spore.spores = []; // Clear spores array
                    this.spore.end = new Date(); // Overwrite actual end date for cooldown purposes
                    this.spore.cooling = true;
                }
                this.secrete.end = new Date();
                if (Game.state !== 'tutorial') connection.emit('ability', this); // Server does not store ability for tutorial
            }, this.secrete.time);
        }
    }
}
