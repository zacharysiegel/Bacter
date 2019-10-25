// TODO: Encapsulate into class Messages
let currentMessage = () => {
   let message;
   if (Game.state === 'game' || Game.state === 'spectate') {
      if (org.alive) {
         if (Game.game.rounds.util) {
            if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === false) {
               if (Game.game.rounds.min - Game.game.info.count === 1) {
                  message = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.count) + ' more player to join';
               } else {
                  message = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.count) + ' more players to join';
               }
            } else if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === true) { // Delay at round start
               message = 'Round begins in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === true) { // Delay at round end
               message = 'Round ends in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            }
         }
      } else if (!org.alive) {
         if (Game.game.rounds.util) {
            if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === false) { // Waiting for more players to join, not counting down yet
               if (Game.game.rounds.min - Game.game.info.count === 1) {
                  message = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.count) + ' more player to join';
               } else {
                  message = 'Waiting for ' + (Game.game.rounds.min - Game.game.info.count) + ' more players to join';
               }
            } else if (Game.game.rounds.waiting === true && Game.game.rounds.delayed === true) { // Enough players have joined, counting down
               message = 'Round begins in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === false) { // Round in progress
               message = 'Wait for the round to complete';
            } else if (Game.game.rounds.waiting === false && Game.game.rounds.delayed === true) {
               message = 'Round ends in: ' + (1 + floor((Game.game.rounds.rounddelay - (new Date() - Game.game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            }
         } else {
            message = 'Press \'' + config.settings.controls.respawn.key + '\' to Spawn';
         }
      }
   } else if (Game.state === 'tutorial') {
      switch (tutorial.task) {
         case 'move':
            message = 'Use W-A-S-D (Recommended) or the arrow keys to move';
            break;
         case 'fullscreen':
            message = 'Press F11 to enter fullscreen mode (Recommended)';
            break;
         case 'survive':
            message = 'If the crosshair is too far from the organism, it will die';
            break;
         case 'extend':
            message = 'Use the EXTEND ability to increase the organism\'s size';
            break;
         case 'immortality':
            message = 'The IMMORTALITY ability will stop the natural atrophe of cells';
            break;
         case 'neutralize':
            message = 'NEUTRALIZE will create a bubble of safety from enemy attacks';
            break;
         case 'shoot':
            message = 'To COMPRESS or FREEZE an enemy, press the ability key to launch a spore in the direction of the cursor\nThen press it again to activate the ability';
            break;
         case 'compress':
            message = 'On hit, COMPRESS shrinks the size of the targeted enemy\nCOMPRESS the bot to progress';
            break;
         case 'freeze':
            message = 'On hit, FREEZE halts all natural processes within the enemy organism\nFREEZE the bot to progress';
            break;
         case 'toxin':
            message = 'TOXIN creates a localized bubble in which only you can survive';
            break;
         case 'spore':
            if (tutorial.stopped) {
               message = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
            } else {
               message = 'Use SPORE to jettison outer cells in all directions (Space Bar)';
            }
            break;
         case 'secrete':
            message = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
            break;
         case 'done':
            message = 'Now that you\'re ready, press ESC to return to the menu';
            break;
      }
   }
   return message;
};

function renderMessages() {
   if (config.settings.messages === true) {
      let message = currentMessage();
      if (message !== undefined) {
         let src = getSrc();
         fill(src.world.background.r, src.world.background.g, src.world.background.b); // Message shadows are rendered in renderWorld()
         stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
         strokeWeight(1);
         textFont('Helvetica');
         textSize(14);
         if (src.world.color === 'black') {
            textStyle(NORMAL);
         } else if (src.world.color === 'white') {
            textStyle(BOLD);
         }
         let breaks = Z.freq(message, '\n');
         let width = messageWidth(message);
         rect(25 + width / 2, 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
         fill(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b); // Same color as border to maintain contrast with background
         noStroke();
         text(message, 25, 30);
      }
   }
}

let messageWidth = message => {
   let lines = message.split('\n');
   let count = lines.length;
   let lengths = [];
   for (let i = 0; i < count; i++) {
      lengths.push(lines[i].length);
   }
   return textWidth(lines[lengths.indexOf(max(lengths))]);
};
