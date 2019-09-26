function spawn(data) { // data: { color: {}, skin: '', team: '' }
   state = 'game';
   org = new Org({ player: Socket.socket.id, color: data.color, skin: data.skin, team: data.team, spectating: false });
   org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
   org.count++;
   let compressedOrg = org.getCompressed();
   Socket.socket.emit('Player Joined', { info: game.info, org: compressedOrg, ability: ability });
}

function spectate(data) { // data: { color: {}, pos: {}, skin: '', team: '' }
   state = 'spectate';
   Socket.socket.emit('Spectator Joined', game);
   org = new Org( { player: Socket.socket.id, color: data.color, skin: data.skin, team: data.team, pos: data.pos, spectating: true } );
}

function renderUI() {
   let src = getSrc();
   // Crosshair
   if (src.src != 'tutorial') {
      noFill();
      stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
      strokeWeight(1);
      line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
      line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);
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
   if (Labels && src.src === 'game') {
      fill(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b); // Same color as border to maintain contrast with background
      noStroke();
      textFont('Helvetica');
      if (game.world.color == 'black') {
         textStyle(NORMAL);
      } else if (game.world.color == 'white') {
         textStyle(BOLD);
      }
      textSize(10);
      for (let i = 0; i < game.info.count; i++) {
         for (let j = 0; j < game.board.list.length; j++) {
            if (game.orgs[i].player == game.board.list[j].player) {
               let x = function() { // x() and y() cannot be accessed through orgs array, so code is copied and edited from org file
                  let sum = 0;
                  for (let k = 0; k < game.orgs[i].count; k++) {
                     sum += game.orgs[i].cells[k].x;
                  }
                  let average = sum / game.orgs[i].count;
                  return average;
               };
               let y = function() {
                  let sum = 0;
                  for (let k = 0; k < game.orgs[i].count; k++) {
                     sum += game.orgs[i].cells[k].y;
                  }
                  let average = sum / game.orgs[i].count;
                  return average;
               };
               if (game.board.list[j].name.length <= 30) {
                  text(game.board.list[j].name, x() - textWidth(game.board.list[j].name) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               } else {
                  text(game.board.list[j].name.slice(0, 20) + '...', x() - textWidth(game.board.list[j].name.slice(0, 20)) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               }
            }
         }
      }
   }

   // Ability Cooldowns
   if (!src.stopped) {
      for (let i in ability) { // Regular Cooldowns
         if (typeof ability[i] == 'object' && i !== 'shoot') {
            if (ability[i].cooling == true) {
               cooldown(ability[i]);
            }
         }
      }
      for (let i = 0; i < ability.shoot.value.length; i++) { // Shoot Cooldown
         if (ability.shoot.cooling[i] == true) {
            cooldown(ability.shoot);
            break;
         }
      }
   }

   // Ability Tooltips
   translate(org.off.x, org.off.y);
   var currentTime;
   if (src.stopped == true) {
      currentTime = src.stopdate;
   } else {
      currentTime = new Date(); // Set current time
   }
   if (!ability.tag.activated) {
      for (let i = 0; i < 4; i++) {
         for (let j in ability) {
            if (typeof ability[j] === 'object') {
               if (ability[j].i === i) { // Find corresponding ability set to tooltip
                  if (ability[j].activated == true) { // Find corresponding activated ability to tooltip
                     if (j == 'spore' && ability.secrete.value == true) {
                        continue; // Do not draw spore
                     }
                     if (j == 'secrete' && ability.secrete.value == false) {
                        continue; // Do not draw secrete
                     }
                     fill(215);
                     stroke(0);
                     strokeWeight(1);
                     rect(center.x - 150 + i * 100, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
                     let letter;
                     if (i == 0) {
                        letter = Controls.ability1.key;
                     } else if (i == 1) {
                        letter = Controls.ability2.key;
                     } else if (i == 2) {
                        letter = Controls.ability3.key;
                     } else if (i == 3) {
                        if (Controls.ability4.key == ' ') {
                           letter = '_'; // Display space bar as underscore
                        } else {
                           letter = Controls.ability4.key;
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
                     if (ability[j].j == 0) { // If defensive ability (or spore)
                        // Ability
                        if (ability[j].value == true) { // If during ability
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                        } else if (ability[j].value == false && ability[j].can == false) { // If during cooldown
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                        } else if (ability[j].value == false && ability[j].can == true) { // If idling
                           ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                        }
                     } else if (ability[j].j == 1) { // If offensive ability
                        if (ability[j].i < 3) { // If one of first three abilities (not secrete)
                           noStroke();
                           // Ability
                           if (ability[j].can == true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && currentTime - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                           } else if (ability[j].can == false && currentTime - ability[j].start > ability[j].time) { // If during cooldown
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                           }
                           // Shoot
                           if (j != 'toxin') { // Toxin does not shoot
                              stroke(0);
                              if (ability.shoot.value[i] == false && ability.shoot.can[i] == true) { // Idle
                                 ellipse(center.x - 150 + i * 100 - 41, height * 9 / 10, 8);
                              } else if (ability.shoot.value[i] == true && ability.shoot.can[i] == false) { // If is shooting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[i]) / ability.shoot.time * 360); // Ability timeout timer
                              } else if (ability.shoot.secrete[i].value == true) { // If is secreting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360) - ((currentTime - ability.shoot.secrete[i].start) / ability.secrete.time * (360 - (ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360))); // Secretion timer
                              } else if (currentTime - ability.shoot.secrete[i].end < ability.shoot.cooldown[i]) {
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 + ((currentTime - ability.shoot.secrete[i].end) / ability.shoot.cooldown[i] * 360)); // Shoot cooldown timer (if no hit)
                              }
                           }
                        } else if (ability[j].i == 3) { // Secrete
                           if (ability[j].can == true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && currentTime - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360) - (currentTime - ability[j].start) / ability[j].time * (360 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360))); // Ability cooldown timer
                           }
                        }
                     }
                     itemize(items[j], 1, { r: 0, g: 0, b: 0 }, center.x - 150 + i * 100, height * 9 / 10);
                  }
                  if (ability[j].value == true && ability[j].i < 3) { // Ability Activated Tooltip (Not for spore/secrete)
                     if (ability[j].j == 0 || ability[j].i == 3) { // If defensive ability (+ secrete)
                        fill(66, 244, 176); // Green
                        noStroke();
                        ellipse(center.x - 150 + i * 100 - 9, height * 9 / 10 - 37, 5, 5);
                     } else if (ability[j].j == 1 && ability[j].i != 3) { // If offensive ability (No secrete)
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
   } else if (ability.tag.activated == true) {
      fill(215);
      stroke(0);
      strokeWeight(1);
      rect(center.x, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
      let letter;
      if (ability.tag.i == 0) {
         letter = Controls.ability1.key;
      } else if (ability.tag.i == 1) {
         letter = Controls.ability2.key;
      } else if (ability.tag.i == 2) {
         letter = Controls.ability3.key;
      } else if (ability.tag.i == 3) {
         if (Controls.ability4.key == ' ') {
            letter = '_';
         } else {
            letter = Controls.ability4.key;
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
      if (ability.tag.can == true) { // Idle
         ellipse(center.x, height * 9 / 10, 29);
      } else if (ability.tag.can == false && currentTime - ability.tag.start <= ability.tag.time) { // If during ability
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability.tag.start) / ability.tag.time * 360); // Ability timeout timer
      } else if (ability.tag.can == false && currentTime - ability.tag.start > ability.tag.time) { // If during cooldown
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability.tag.end) / ability.tag.cooldown * 360); // Ability cooldown timer
      }
      itemize(items.tag, 1, { r: 0, g: 0, b: 0 }, center.x, height * 9 / 10);
      // Shoot
      fill(215);
      stroke(0);
      if (ability.shoot.value[ability.tag.i] == false && ability.shoot.can[ability.tag.i] == true) { // Idle
         ellipse(center.x - 41, height * 9 / 10, 8);
      } else if (ability.shoot.value[ability.tag.i] == true && ability.shoot.can[ability.tag.i] == false) { // If is shooting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360); // Ability timeout timer
      } else if (ability.shoot.secrete[ability.tag.i].value == true) { // If is secreting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360) - ((currentTime - ability.shoot.secrete[ability.tag.i].start) / ability.secrete.time * (360 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360))); // Secretion timer
      } else if (currentTime - ability.shoot.secrete[ability.tag.i].end < ability.shoot.cooldown[ability.tag.i]) {
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 + ((currentTime - ability.shoot.secrete[ability.tag.i].end) / ability.shoot.cooldown[ability.tag.i] * 360)); // Shoot cooldown timer (if no hit)
      }
      if (ability.tag.value == true) { // Ability Activated Tooltip (only green for tag)
         fill(66, 244, 176); // Green
         noStroke();
         ellipse(center.x - 9, height * 9 / 10 - 37, 5, 5);
      }
   }
   translate(-org.off.x, -org.off.y);
}

var getSrc = function() {
   let src;
   switch (state) {
      case 'game':
      case 'spectate':
      case 'respawnMenu':
      case 'pauseGameMenu':
      case 'pauseSpectateMenu':
         src = game;
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
};

function move() {
   let keys = '';
   if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code)) {
      keys += 'l';
   }
   if (keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code)) {
      keys += 'u';
   }
   if (keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code)) {
      keys += 'r';
   }
   if (keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) {
      keys += 'd';
   }
   switch (keys) {
      case 'l':
         org.pos.x -= org.speed;
         break;
      case 'u':
         org.pos.y -= org.speed;
         break;
      case 'r':
         org.pos.x += org.speed;
         break;
      case 'd':
         org.pos.y += org.speed;
         break;
      case 'lu':
         org.pos.x -= org.speed * cos45;
         org.pos.y -= org.speed * cos45;
         break;
      case 'lr':
         // Net zero
         break;
      case 'ld':
         org.pos.x -= org.speed * cos45;
         org.pos.y += org.speed * cos45;
         break;
      case 'ur':
         org.pos.x += org.speed * cos45;
         org.pos.y -= org.speed * cos45;
         break;
      case 'ud':
         // Net zero
         break;
      case 'rd':
         org.pos.x += org.speed * cos45;
         org.pos.y += org.speed * cos45;
         break;
      case 'lur':
         org.pos.y -= org.speed; // Net up
         break;
      case 'lud':
         org.pos.x -= org.speed; // Net left
         break;
      case 'lrd':
         org.pos.y += org.speed; // Net down
         break;
      case 'urd':
         org.pos.x += org.speed; // Net right
         break;
      case 'lurd':
         // Net zero
         break;
   }
   if (keys != '') {
      org.off.x = org.pos.x - center.x;
      org.off.y = org.pos.y - center.y;
   }
}

/**
 * Enter game by starting game interval (runLoop()) (with org growth)
 * @return void
 */
function enter() {
   if (!org.intervals.length) { // org.intervals array must be of length 0
      org.intervals.push(setInterval(() => runLoop(), _orgfrequency));
   }
}

function runLoop() {
   roundBehaviors();

   org.grow();
   // org.setClickbox();

   // CTF
   if (game.info.mode === 'ctf') {
      game.flag.detectPickup();
   }
}

function roundBehaviors() {
   var currentTime = new Date();
   if (game.rounds.util) {
      if (game.info.host === Socket.socket.id) { // Only if player is host
         if (game.rounds.waiting && !game.rounds.delayed && game.info.count >= game.rounds.min) { // If waiting, not delayed, and have minimum players
            Socket.socket.emit('Round Delay', game);
            game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
         } else if (game.rounds.waiting && game.rounds.delayed && currentTime - game.rounds.delaystart >= game.rounds.rounddelay - 1000 && org.ready == false) { // Only host; If 1 second left in round-begin delay
            Socket.socket.emit('Force Spawn', game.info);
         }
      }
      if (game.info.mode === 'srv' && !game.rounds.waiting && !game.rounds.delayed && game.info.count <= 1 && game.players[0] === Socket.socket.id) { // Survival end-game: if during game and player is winner; count <= 1 (rather than === 1) in case multiple players die on last tick, setting count to 0
         for (let i = 0; i < game.board.list.length; i++) {
            if (game.board.list[i].player == Socket.socket.id) {
               Socket.socket.emit('Round End', game.info);
               game.board.list[i].wins++;
               orderBoard(game.board.list);
               Socket.socket.emit('Board', { list: game.board.list, host: game.board.host });
            }
         }
      }
   }
}

function die(spectating) {
   Socket.socket.emit('Dead', spectating);
   org.clearIntervals();
   for (let i in ability) { // Reset Ability Cooldowns
      if (typeof ability[i] === 'object' && i !== 'shoot') { // Avoid reference error
         if (ability[i].activated != undefined && ability[i].activated == true) { // If is a usable ability
            clearTimeout(ability[i].timeout);
            ability[i].value = false;
            ability[i].can = true;
            ability[i].cooling = false;
            ability[i].start = undefined;
            ability[i].end = undefined;
         }
      }
   }
   for (let i = 0; i < 3; i++) { // Reset shoots
      clearTimeout(ability.shoot.timeout[i]);
      ability.shoot.value[i] = false;
      ability.shoot.can[i] = true;
      ability.shoot.spore[i] = undefined;
      ability.shoot.secrete[i] = {};
      ability.shoot.start[i] = undefined;
      ability.shoot.end[i] = undefined;
   }
   Socket.socket.emit('Ability', ability);
}
