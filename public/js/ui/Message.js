class Message {
    /*
    Static fields:
        static color = { r: 255, g: 255, b: 255 };
     */
    constructor() {
        this.text = '';
        this.update();
    }

    /**
     * Updates this {Message} with the appropriate message text based upon the current state of the game
     */
    update() {
        let text = ''; // text contains the message's text as a String
        if (Game.state === 'game' || Game.state === 'spectate') {
            if (org.alive) {
                if (Game.game.rounds.util) {
                    if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === false) {
                        if (Game.game.rounds.min - Game.game.info.player_count === 1) {
                            text = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.player_count) + ' more player to join';
                        } else {
                            text = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.player_count) + ' more players to join';
                        }
                    } else if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === true) { // Delay at round start
                        text = 'Round begins in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
                    } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === true) { // Delay at round end
                        text = 'Round ends in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
                    }
                }
            } else if (!org.alive) {
                if (Game.game.rounds.util) {
                    if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === false) { // Waiting for more players to join, not counting down yet
                        if (Game.game.rounds.min - Game.game.info.player_count === 1) {
                            text = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.player_count) + ' more player to join';
                        } else {
                            text = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.player_count) + ' more players to join';
                        }
                    } else if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === true) { // Enough players have joined, counting down
                        text = 'Round begins in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
                    } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === false) { // Round in progress
                        text = 'Wait for the round to complete';
                    } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === true) {
                        text = 'Round ends in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
                    }
                } else {
                    text = 'Press \'' + config.settings.controls.respawn.key + '\' to Spawn';
                }
            }
        } else if (Game.state === 'tutorial') {
            switch (tutorial.task) {
                case 'move':
                    text = 'Use W-A-S-D (Recommended) or the arrow keys to move';
                    break;
                case 'fullscreen':
                    text = 'Press F11 to enter fullscreen mode (Recommended)';
                    break;
                case 'survive':
                    text = 'If the crosshair is too far from the organism, it will die';
                    break;
                case 'extend':
                    text = 'Use the EXTEND ability to increase the organism\'s size';
                    break;
                case 'immortality':
                    text = 'The IMMORTALITY ability will stop the natural atrophe of cells';
                    break;
                case 'neutralize':
                    text = 'NEUTRALIZE will create a bubble of safety from enemy attacks';
                    break;
                case 'shoot':
                    text = 'To COMPRESS or FREEZE an enemy, press the ability key to launch a spore in the direction of the cursor\n' +
                           'Then press it again to activate the ability';
                    break;
                case 'compress':
                    text = 'On hit, COMPRESS shrinks the size of the targeted enemy\n' +
                           'COMPRESS the bot to progress';
                    break;
                case 'freeze':
                    text = 'On hit, FREEZE halts all natural processes within the enemy organism\n' +
                           'FREEZE the bot to progress';
                    break;
                case 'toxin':
                    text = 'TOXIN creates a localized bubble in which only you can survive\n' +
                           'Damage the bot to progress';
                    break;
                case 'spore':
                    if (tutorial.stopped) {
                        text = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
                    } else {
                        text = 'Use SPORE to jettison outer cells in all directions (Space Bar)';
                    }
                    break;
                case 'secrete':
                    text = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
                    break;
                case 'done':
                    text = 'Now that you\'re ready, press ESC to return to the menu';
                    break;
            }
        }

        this.text = text;
    }

    /**
     * Determine the width in pixels of the message text
     * @returns {Number}
     */
    get width() {
        let lines = this.text.split('\n');
        let count = lines.length;
        let lengths = [];
        for (let i = 0; i < count; i++) {
            lengths.push(lines[i].length);
        }

        return textWidth(lines[lengths.indexOf(max(lengths))]);
    }

    /**
     * Determine the number of line breaks in the message
     * @returns {Number} The frequency of '\n' characters in the message text
     */
    get breaks() {
        return Z.freq(this.text, '\n');
    }

    /**
     * Determine if this message contains text
     *    This should return true unless there is an error printed in the constructor
     * @returns {Boolean} True if this.text is not the empty string
     */
    get hasText() {
        return !!this.text;
    }

    render() {
        if (config.settings.messages === true) {
            if (this.hasText) {
                let src = getSrc();

                fill(src.world.background.r, src.world.background.g, src.world.background.b); // Message shadows are rendered in renderWorld()
                stroke(Message.color.r, Message.color.g, Message.color.b);
                strokeWeight(1);
                textFont('Helvetica');
                textSize(14);
                if (src.world.color === 'black') {
                    textStyle(NORMAL);
                } else if (src.world.color === 'white') {
                    textStyle(BOLD);
                }

                rect(25 + this.width / 2, 25 + 9 * this.breaks, 25 + this.width, 26 + 18 * this.breaks);
                fill(Message.color.r, Message.color.g, Message.color.b); // Same color as border to maintain contrast with background
                noStroke();

                text(this.text, 25, 30);
            }
        }
    }
}

(() => {
    Message.color = { r: 255, g: 255, b: 255 };
})();
