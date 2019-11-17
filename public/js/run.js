function spawn(data) { // data: { color: {}, skin: '', team: '' }
   Game.state = 'game';
   org = new Org({ player: connection.socket.id, color: data.color, skin: data.skin, team: data.team, spectating: false });
   org.cells[0] = new Cell(org.cursor.x, org.cursor.y, org); // Create first cell in org
   org.count++;
   let compressedOrg = org.compressed;
   connection.socket.binary(false).emit('Player Joined', { info: Game.game.info, org: compressedOrg, ability: ability });
}

function spectate(data) { // data: { color: {}, cursor: {}, skin: '', team: '' }
   Game.state = 'spectate';
   connection.socket.binary(false).emit('Spectator Joined', Game.game);
   org = new Org( { player: connection.socket.id, color: data.color, skin: data.skin, team: data.team, cursor: data.cursor, spectating: true } );
}

function renderUI() {
   let src = getSrc();
   // Crosshair
   if (src.src !== 'tutorial') {
      noFill();
      stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
      strokeWeight(1);
      line(org.cursor.x - 4, org.cursor.y, org.cursor.x + 4, org.cursor.y);
      line(org.cursor.x, org.cursor.y - 4, org.cursor.x, org.cursor.y + 4);
   }

   // // Render Clickbox
   // if (org.target) { // If org is targenting a player (NOT IN USE)
   //    for (let i = 0; i < src.orgs.length; i++) {
   //       if (src.orgs[i].player == org.target) { // Find targeted org
   //          noFill();
   //          stroke(src.orgs[i].clickbox.color.r, src.orgs[i].clickbox.color.g, src.orgs[i].clickbox.color.b);
   //          strokeWeight(1);
   //          rect(src.orgs[i].clickbox.x, src.orgs[i].clickbox.y, src.orgs[i].clickbox.width, src.orgs[i].clickbox.height, 2); // Draw Target Box
   //       }
   //    }
   // }

   // Screen Name Labels
   if (config.settings.labels && src.src === 'game') {
      fill(Game.game.world.border.color.r, Game.game.world.border.color.g, Game.game.world.border.color.b); // Same color as border to maintain contrast with background
      noStroke();
      textFont('Helvetica');
      if (Game.game.world.color === 'black') {
         textStyle(NORMAL);
      } else if (Game.game.world.color === 'white') {
         textStyle(BOLD);
      }
      textSize(10);
      for (let i = 0; i < Game.game.info.count; i++) {
         for (let j = 0; j < Game.game.board.list.length; j++) {
            if (Game.game.orgs[i].player === Game.game.board.list[j].player) {
               let x = function() { // x() and y() cannot be accessed through orgs array, so code is copied and edited from org file
                  let sum = 0;
                  for (let k = 0; k < Game.game.orgs[i].count; k++) {
                     sum += Game.game.orgs[i].cells[k].x;
                  }
                  let average = sum / Game.game.orgs[i].count;
                  return average;
               };
               let y = function() {
                  let sum = 0;
                  for (let k = 0; k < Game.game.orgs[i].count; k++) {
                     sum += Game.game.orgs[i].cells[k].y;
                  }
                  let average = sum / Game.game.orgs[i].count;
                  return average;
               };

               if (Game.game.board.list[j].name.length <= 30) {
                  text(Game.game.board.list[j].name, x() - textWidth(Game.game.board.list[j].name) / 2, y() + sqrt(sq(config.game.cell_width) * Game.game.orgs[i].count / PI) + 2 * config.game.cell_width + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               } else {
                  text(Game.game.board.list[j].name.slice(0, 20) + '...', x() - textWidth(Game.game.board.list[j].name.slice(0, 20)) / 2, y() + sqrt(sq(config.game.cell_width) * Game.game.orgs[i].count / PI) + 2 * config.game.cell_width + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               }
            }
         }
      }
   }

   // Ability Cooldowns
   if (!src.stopped) {
      for (let a in ability) { // Regular Cooldowns
         if (typeof ability[a] == 'object' && a !== 'shoot') {
            if (ability[a].cooling === true) {
               Abilities.cooldown(ability[a]);
            }
         }
      }
      for (let i = 0; i < ability.shoot.value.length; i++) { // Shoot Cooldown
         if (ability.shoot.cooling[i] === true) {
            Abilities.cooldown(ability.shoot);
            break;
         }
      }
   }

   // Ability Tooltips
   translate(org.off.x, org.off.y);
   let currentTime;
   if (src.stopped === true) {
      currentTime = src.stopdate;
   } else {
      currentTime = new Date(); // Set current time
   }
   if (!ability.tag.activated) {
      for (let i = 0; i < 4; i++) {
         for (let j in ability) {
            if (typeof ability[j] === 'object') {
               if (ability[j].i === i) { // Find corresponding ability set to tooltip
                  if (ability[j].activated === true) { // Find corresponding activated ability to tooltip
                     if (j === 'spore' && ability.secrete.value === true) {
                        continue; // Do not draw spore
                     }
                     if (j === 'secrete' && ability.secrete.value === false) {
                        continue; // Do not draw secrete
                     }
                     fill(215);
                     stroke(0);
                     strokeWeight(1);
                     rect(center.x - 150 + i * 100, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
                     let letter;
                     if (i === 0) {
                        letter = config.settings.controls.ability1.key;
                     } else if (i === 1) {
                        letter = config.settings.controls.ability2.key;
                     } else if (i === 2) {
                        letter = config.settings.controls.ability3.key;
                     } else if (i === 3) {
                        if (config.settings.controls.ability4.key === ' ') {
                           letter = '_'; // Display space bar as underscore
                        } else {
                           letter = config.settings.controls.ability4.key;
                        }
                     }
                     fill(0);
                     noStroke();
                     textSize(14);
                     textFont('Consolas');
                     textStyle(BOLD);
                     text(letter, center.x - 150 + i * 100 - textWidth(letter) / 2, height * 9 / 10 + 30 + 13);
                     fill(0);
                     stroke(0);
                     strokeWeight(1);
                     ellipse(center.x - 150 + i * 100, height * 9 / 10, 30); // Background ellipse; Necessary to cover the key tip
                     fill(215);
                     noStroke();
                     if (ability[j].j === 0) { // If defensive ability (or spore)
                        // Ability
                        if (ability[j].value === true) { // If during ability
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                        } else if (ability[j].value === false && ability[j].can === false) { // If during cooldown
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                        } else if (ability[j].value === false && ability[j].can === true) { // If idling
                           ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                        }
                     } else if (ability[j].j === 1) { // If offensive ability
                        if (ability[j].i < 3) { // If one of first three abilities (not secrete)
                           noStroke();
                           // Ability
                           if (ability[j].can === true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can === false && currentTime - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                           } else if (ability[j].can === false && currentTime - ability[j].start > ability[j].time) { // If during cooldown
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                           }
                           // Shoot
                           if (j !== 'toxin') { // Toxin does not shoot
                              stroke(0);
                              if (ability.shoot.value[i] === false && ability.shoot.can[i] === true) { // Idle
                                 ellipse(center.x - 150 + i * 100 - 41, height * 9 / 10, 8);
                              } else if (ability.shoot.value[i] === true && ability.shoot.can[i] === false) { // If is shooting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[i]) / ability.shoot.time * 360); // Ability timeout timer
                              } else if (ability.shoot.secrete[i].value === true) { // If is secreting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360) - ((currentTime - ability.shoot.secrete[i].start) / ability.secrete.time * (360 - (ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360))); // Secretion timer
                              } else if (currentTime - ability.shoot.secrete[i].end < ability.shoot.cooldown[i]) {
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 + ((currentTime - ability.shoot.secrete[i].end) / ability.shoot.cooldown[i] * 360)); // Shoot cooldown timer (if no hit)
                              }
                           }
                        } else if (ability[j].i === 3) { // Secrete
                           if (ability[j].can === true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can === false && currentTime - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360) - (currentTime - ability[j].start) / ability[j].time * (360 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360))); // Ability cooldown timer
                           }
                        }
                     }
                     itemize(items[j], 1, { r: 0, g: 0, b: 0 }, center.x - 150 + i * 100, height * 9 / 10);
                  }
                  if (ability[j].value === true && ability[j].i < 3) { // Ability Activated Tooltip (Not for spore/secrete)
                     if (ability[j].j === 0 || ability[j].i === 3) { // If defensive ability (+ secrete)
                        fill(66, 244, 176); // Green
                        noStroke();
                        ellipse(center.x - 150 + i * 100 - 9, height * 9 / 10 - 37, 5, 5);
                     } else if (ability[j].j === 1 && ability[j].i !== 3) { // If offensive ability (No secrete)
                        fill(255, 141, 135); // Red
                        noStroke();
                        ellipse(center.x - 150 + i * 100 + 9, height * 9 / 10 - 37, 5, 5);
                     }
                  }
                  // fill(215);
                  // ellipse(center.x - 150 + 3 * 100, height * 9 / 10, 29);
               }
            }
         }
      }
   } else if (ability.tag.activated === true) {
      fill(215);
      stroke(0);
      strokeWeight(1);
      rect(center.x, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
      let letter;
      if (ability.tag.i === 0) {
         letter = config.settings.controls.ability1.key;
      } else if (ability.tag.i === 1) {
         letter = config.settings.controls.ability2.key;
      } else if (ability.tag.i === 2) {
         letter = config.settings.controls.ability3.key;
      } else if (ability.tag.i === 3) {
         if (config.settings.controls.ability4.key === ' ') {
            letter = '_';
         } else {
            letter = config.settings.controls.ability4.key;
         }
      }
      fill(0);
      noStroke();
      textSize(14);
      textFont('Consolas');
      textStyle(BOLD);
      text(letter, center.x - textWidth(letter) / 2, height * 9 / 10 + 30 + 13); // Letter text
      // Ability Circles
      fill(0);
      stroke(0);
      strokeWeight(1);
      ellipse(center.x, height * 9 / 10, 30); // Background ellipse
      fill(215);
      noStroke();
      if (ability.tag.can === true) { // Idle
         ellipse(center.x, height * 9 / 10, 29);
      } else if (ability.tag.can === false && currentTime - ability.tag.start <= ability.tag.time) { // If during ability
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability.tag.start) / ability.tag.time * 360); // Ability timeout timer
      } else if (ability.tag.can === false && currentTime - ability.tag.start > ability.tag.time) { // If during cooldown
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability.tag.end) / ability.tag.cooldown * 360); // Ability cooldown timer
      }
      itemize(items.tag, 1, { r: 0, g: 0, b: 0 }, center.x, height * 9 / 10);
      // Shoot
      fill(215);
      stroke(0);
      if (ability.shoot.value[ability.tag.i] === false && ability.shoot.can[ability.tag.i] === true) { // Idle
         ellipse(center.x - 41, height * 9 / 10, 8);
      } else if (ability.shoot.value[ability.tag.i] === true && ability.shoot.can[ability.tag.i] === false) { // If is shooting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360); // Ability timeout timer
      } else if (ability.shoot.secrete[ability.tag.i].value === true) { // If is secreting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360) - ((currentTime - ability.shoot.secrete[ability.tag.i].start) / ability.secrete.time * (360 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360))); // Secretion timer
      } else if (currentTime - ability.shoot.secrete[ability.tag.i].end < ability.shoot.cooldown[ability.tag.i]) {
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 + ((currentTime - ability.shoot.secrete[ability.tag.i].end) / ability.shoot.cooldown[ability.tag.i] * 360)); // Shoot cooldown timer (if no hit)
      }
      if (ability.tag.value === true) { // Ability Activated Tooltip (only green for tag)
         fill(66, 244, 176); // Green
         noStroke();
         ellipse(center.x - 9, height * 9 / 10 - 37, 5, 5);
      }
   }
   translate(-org.off.x, -org.off.y);
}

/**
 * Get the source object for the current state of the game
 * @returns {Object|*|Game|Game|Menu.props.data}
 */
function getSrc() {
   let src;
   switch (Game.state) {
      case 'game':
      case 'spectate':
      case 'respawnMenu':
      case 'pauseGameMenu':
      case 'pauseSpectateMenu':
         src = Game.game;
         break;
      case 'title':
      case 'browser':
      case 'createMenu':
      case 'joinMenu':
      case 'spectateMenu':
         src = title;
         break;
      case 'tutorial':
      case 'pauseTutorialMenu':
         src = tutorial;
         break;
   }
   return src;
}

/**
 * Enter game by starting game interval (runLoop()) (with org growth)
 * @return void
 */
function enter() {
   if (!org.intervals.length) { // org.intervals array must be of length 0
      org.intervals.push(setInterval(() => runLoop(), config.game.org_frequency));
   }
}

function runLoop() {
   roundBehaviors();

   org.grow();
   // org.setClickbox();

   // CTF
   if (Game.game.info.mode === 'ctf') {
      Game.game.flag.detectPickup();
   }
}

function roundBehaviors() {
   const currentTime = new Date();
   if (Game.game.rounds.util) {
      if (Game.game.info.host === connection.socket.id) { // Only if player is host
         if (Game.game.rounds.waiting && !Game.game.rounds.delayed && Game.game.info.count >= Game.game.rounds.min) { // If waiting, not delayed, and have minimum players
            connection.socket.binary(false).emit('Round Delay', Game.game);
            Game.game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
         } else if (Game.game.rounds.waiting && Game.game.rounds.delayed && currentTime - Game.game.rounds.delaystart >= Game.game.rounds.rounddelay - 1000 && org.ready === false) { // Only host; If 1 second left in round-begin delay
            connection.socket.binary(false).emit('Force Spawn', Game.game.info);
         }
      }
      if (Game.game.info.mode === 'srv' && !Game.game.rounds.waiting && !Game.game.rounds.delayed && Game.game.info.count <= 1 && Game.game.players[0] === connection.socket.id) { // Survival end-game: if during game and player is winner; count <= 1 (rather than === 1) in case multiple players die on last tick, setting count to 0
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
