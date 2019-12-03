class Abilities {
    static renderNeutralize(abililtY) {
        if (ability.neutralize.value === true) { // Render neutralize (not toxin) over shoots, spores, and secretes of opponents
            fill(100);
            stroke(ability.neutralize.color.r, ability.neutralize.color.g, ability.neutralize.color.b);
            strokeWeight(ability.neutralize.weight);
            ellipse(ability.neutralize.x, ability.neutralize.y, ability.neutralize.radius);
        }
    }

    static renderToxin(ability) {
        if (ability.toxin.value === true) { // Toxin renders at bottom
            fill(100);
            stroke(ability.toxin.color.r, ability.toxin.color.g, ability.toxin.color.b);
            strokeWeight(ability.toxin.weight);
            ellipse(ability.toxin.x, ability.toxin.y, ability.toxin.radius);
        }
    }

    static renderSpores(ability) {
        let src = getSrc();
        if (ability.spore.value === true) {
            for (let i = 0; i < ability.spore.count; i++) {
                let cell = ability.spore.spores[i];
                for (let j = 0; j < src.orgs.length; j++) {
                    if (src.orgs[j].player === ability.player) {
                        if (src.orgs[j].skin === 'circles') {
                            fill(cell.color.r, cell.color.g, cell.color.b);
                            noStroke();
                            ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
                        } else if (src.orgs[j].skin === 'ghost') {
                            noFill();
                            stroke(cell.color.r, cell.color.g, cell.color.b);
                            strokeWeight(1);
                            rect(cell.x, cell.y, cell.width, cell.height);
                        } else {
                            fill(cell.color.r, cell.color.g, cell.color.b);
                            noStroke();
                            rect(cell.x, cell.y, cell.width, cell.height);
                        }
                    }
                }
            }
        }
        for (let i = 0; i < 3; i++) {
            if (ability.shoot.value[i] === true) {
                let cell = ability.shoot.spore[i];
                for (let j = 0; j < src.orgs.length; j++) {
                    if (src.orgs[j].player === ability.player) {
                        if (src.orgs[j].skin === 'circles') {
                            fill(cell.color.r, cell.color.g, cell.color.b);
                            noStroke();
                            ellipse(cell.x, cell.y, cell.width / 2 * .8, cell.height / 2 * .8); // .8 (default) size of spore (so as to differentiate between the two)
                        } else if (src.orgs[j].skin === 'ghost') {
                            noFill();
                            stroke(cell.color.r, cell.color.g, cell.color.b);
                            strokeWeight(1);
                            rect(cell.x, cell.y, cell.width * .8, cell.height * .8);
                        } else {
                            fill(cell.color.r, cell.color.g, cell.color.b);
                            noStroke();
                            rect(cell.x, cell.y, cell.width * .8, cell.height * .8);
                        }
                    }
                }
            }
        }
    }

    static renderSecretions(ability) {
        let src = getSrc();
        for (let i = 0; i < src.orgs.length; i++) {
            if (ability.player === src.orgs[i].player) { // Identify org of ability
                if (ability.secrete.value === true) {
                    for (let j = 0; j < ability.spore.count; j++) {
                        let spore = ability.spore.spores[j];
                        if (src.orgs[i].skin === 'ghost') {
                            noFill();
                            stroke(ability.secrete.color.r, ability.secrete.color.g, ability.secrete.color.b);
                            strokeWeight(2);
                            ellipse(spore.x, spore.y, ability.secrete.radius);
                        } else {
                            fill(ability.secrete.color.r, ability.secrete.color.g, ability.secrete.color.b);
                            noStroke();
                            ellipse(spore.x, spore.y, ability.secrete.radius);
                        }
                    }
                }
                for (let j = 0; j < ability.shoot.value.length; j++) {
                    if (ability.shoot.secrete[j].value === true) {
                        let spore = ability.shoot.spore[j];
                        if (src.orgs[i].skin === 'ghost') {
                            noFill();
                            stroke(ability.shoot.secrete[j].color.r, ability.shoot.secrete[j].color.g, ability.shoot.secrete[j].color.b);
                            strokeWeight(2);
                            ellipse(spore.x, spore.y, ability.shoot.secrete[j].radius);
                        } else {
                            fill(ability.shoot.secrete[j].color.r, ability.shoot.secrete[j].color.g, ability.shoot.secrete[j].color.b);
                            noStroke();
                            ellipse(spore.x, spore.y, ability.shoot.secrete[j].radius);
                        }
                    }
                }
                break;
            }
        }
    }

    static cooldown(type) { // type is {Ability}._____
        if (typeof type.value === 'boolean') { // If type is not shoot, value is a boolean
            if (type.cooling === true) { // If abilitY is cooling down
                let current = new Date(); // Get current time
                if (current - type.end >= type.cooldown) { // If cooldown has passed
                    type.can = true; // Re-enable abilitY
                    type.cooling = false;
                    if (Game.state !== 'tutorial') connection.emit('ability', ability); // Server does not store ability for tutorial
                }
            }
        } else { // If type is shoot, value is an array of booleans
            for (let i = 0; i < type.value.length; i++) {
                if (type.cooling[i] === true) { // If abilitY is cooling down
                    let current = new Date(); // Get current time
                    if (current - type.end[i] >= type.cooldown[i]) { // If cooldown has passed
                        type.can[i] = true; // Re-enable abilitY
                        type.cooling[i] = false;
                        if (Game.state !== 'tutorial') connection.emit('ability', ability); // Server does not store ability for tutorial
                    }
                }
            }
        }
    }

    /**
     * Reset the given ability to its values at spawn
     * @param {Ability} _ability The ability object to be reset
     *                  I use a prefixing underscore to differentiate the parameter from the global 'ability' object
     */
    static reset(_ability) {
        for (let a in _ability) { // Reset Ability Cooldowns
            if (_ability[a].hasOwnProperty('activated')) { // Avoid reference error by checking if _ability[a] is an activatable _ability
                if (_ability[a].activated !== undefined && _ability[a].activated === true) { // If is a usable _ability
                    clearTimeout(_ability[a].timeout);
                    _ability[a].value = false;
                    _ability[a].can = true;
                    _ability[a].cooling = false;
                    _ability[a].start = undefined;
                    _ability[a].end = undefined;
                }
            }
        }
        for (let i = 0; i < 3; i++) { // Reset shoots
            clearTimeout(_ability.shoot.timeout[i]);
            _ability.shoot.value[i] = false;
            _ability.shoot.can[i] = true;
            _ability.shoot.spore[i] = undefined;
            _ability.shoot.secrete[i] = {};
            _ability.shoot.start[i] = undefined;
            _ability.shoot.end[i] = undefined;
        }
        connection.emit('ability', _ability);
    }
}
