function spawn(datA) { // datA: { color: {}, skin: '', team: '' }
   state = 'game';
   org = new Org({ player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, spectate: false });
   org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
   org.count++;
   socket.emit('Player Joined', { info: game.info, org: org, ability: ability });
}

function spectate(datA) { // datA: { color: {}, pos: {}, skin: '', team: '' }
   state = 'spectate';
   socket.emit('Spectator Joined', game);
   org = new Org( { player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, pos: datA.pos, spectate: true } );
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

   // // Targeting
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
   if (Labels == true && src.src == 'game') {
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
   if (src.stopped != true) {
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
   var current;
   if (src.stopped == true) {
      current = src.stopdate;
   } else {
      current = new Date(); // Set current time
   }
   if (ability.tag.activated == false) {
      for (let i = 0; i < 4; i++) {
         for (let j in ability) {
            if (typeof ability[j] == 'object') {
               if (ability[j].i == i) { // Find corresponding ability set to tooltip
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
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (current - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                        } else if (ability[j].value == false && ability[j].can == false) { // If during cooldown
                           arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (current - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                        } else if (ability[j].value == false && ability[j].can == true) { // If idling
                           ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                        }
                     } else if (ability[j].j == 1) { // If offensive ability
                        if (ability[j].i < 3) { // If one of first three abilities (not secrete)
                           noStroke();
                           // Ability
                           if (ability[j].can == true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && current - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (current - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                           } else if (ability[j].can == false && current - ability[j].start > ability[j].time) { // If during cooldown
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (current - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                           }
                           // Shoot
                           if (j != 'toxin') { // Toxin does not shoot
                              stroke(0);
                              if (ability.shoot.value[i] == false && ability.shoot.can[i] == true) { // Idle
                                 ellipse(center.x - 150 + i * 100 - 41, height * 9 / 10, 8);
                              } else if (ability.shoot.value[i] == true && ability.shoot.can[i] == false) { // If is shooting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (current - ability.shoot.start[i]) / ability.shoot.time * 360); // Ability timeout timer
                              } else if (ability.shoot.secrete[i].value == true) { // If is secreting
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360) - ((current - ability.shoot.secrete[i].start) / ability.secrete.time * (360 - (ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360))); // Secretion timer
                              } else if (current - ability.shoot.secrete[i].end < ability.shoot.cooldown[i]) {
                                 arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 + ((current - ability.shoot.secrete[i].end) / ability.shoot.cooldown[i] * 360)); // Shoot cooldown timer (if no hit)
                              }
                           }
                        } else if (ability[j].i == 3) { // Secrete
                           if (ability[j].can == true) { // Idle
                              ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && current - ability[j].start <= ability[j].time) { // If during ability
                              arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360) - (current - ability[j].start) / ability[j].time * (360 - ((ability.spore.end - ability.spore.start) / ability.spore.time * 360))); // Ability cooldown timer
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
      } else if (ability.tag.can == false && current - ability.tag.start <= ability.tag.time) { // If during ability
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 - (current - ability.tag.start) / ability.tag.time * 360); // Ability timeout timer
      } else if (ability.tag.can == false && current - ability.tag.start > ability.tag.time) { // If during cooldown
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 + (current - ability.tag.end) / ability.tag.cooldown * 360); // Ability cooldown timer
      }
      itemize(items.tag, 1, { r: 0, g: 0, b: 0 }, center.x, height * 9 / 10);
      // Shoot
      fill(215);
      stroke(0);
      if (ability.shoot.value[ability.tag.i] == false && ability.shoot.can[ability.tag.i] == true) { // Idle
         ellipse(center.x - 41, height * 9 / 10, 8);
      } else if (ability.shoot.value[ability.tag.i] == true && ability.shoot.can[ability.tag.i] == false) { // If is shooting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (current - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360); // Ability timeout timer
      } else if (ability.shoot.secrete[ability.tag.i].value == true) { // If is secreting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360) - ((current - ability.shoot.secrete[ability.tag.i].start) / ability.secrete.time * (360 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360))); // Secretion timer
      } else if (current - ability.shoot.secrete[ability.tag.i].end < ability.shoot.cooldown[ability.tag.i]) {
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 + ((current - ability.shoot.secrete[ability.tag.i].end) / ability.shoot.cooldown[ability.tag.i] * 360)); // Shoot cooldown timer (if no hit)
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

function run() {
   if (!org.intervals.length) { // org.intervals array must be of length 0
      org.intervals.push(setInterval(() => runLoop(), _ofrequency));
   }
}

function runLoop() {
   // Rounds
   var current = new Date();
   if (game.rounds.util) {
      if (game.info.host == socket.id) { // Only if player is host
         if (game.rounds.waiting == true && game.rounds.delayed == false && game.info.count >= game.rounds.min) { // If waiting, not delayed, and have minimum players
            socket.emit('Round Delay', game);
            game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
         } else if (game.rounds.waiting == true && game.rounds.delayed == true && current - game.rounds.delaystart >= game.rounds.rounddelay - 1000 && org.ready == false) { // Only host; If 1 second left in round-begin delay
            socket.emit('Force Spawn', game.info);
         }
      }
      if (game.info.mode == 'srv') { // Survival End-Game
         if (game.rounds.waiting == false && game.rounds.delayed == false && game.info.count == 1 && game.players[0] == socket.id) { // If during game and player is winner
            for (let i = 0; i < game.board.list.length; i++) {
               if (game.board.list[i].player == socket.id) {
                  socket.emit('Round End', game.info);
                  game.board.list[i].wins++;
                  orderBoard(game.board.list);
                  socket.emit('Board', { list: game.board.list, host: game.board.host });
               }
            }
         }
      }
   }

   grow(org);

   // // Targeting DO NOT DELETE
   // org.clickbox.left = org.x();
   // org.clickbox.right = org.clickbox.left;
   // org.clickbox.top = org.y();
   // org.clickbox.bottom = org.clickbox.top;
   // for (let i = 0; i < org.count; i++) { // Set the size of clickbox
   //    if (org.cells[i].x - org.cells[i].width / 2 < org.clickbox.left) {
   //       org.clickbox.left = org.cells[i].x - org.cells[i].width / 2;
   //    }
   //    if (org.cells[i].x + org.cells[i].width / 2 > org.clickbox.right) {
   //       org.clickbox.right = org.cells[i].x + org.cells[i].width / 2;
   //    }
   //    if (org.cells[i].y - org.cells[i].height / 2 < org.clickbox.top) {
   //       org.clickbox.top = org.cells[i].y - org.cells[i].height / 2;
   //    }
   //    if (org.cells[i].y + org.cells[i].height / 2 > org.clickbox.bottom) {
   //       org.clickbox.bottom = org.cells[i].y + org.cells[i].height / 2;
   //    }
   // }
   // org.clickbox.left -= org.clickbox.buffer;
   // org.clickbox.right += org.clickbox.buffer;
   // org.clickbox.top -= org.clickbox.buffer;
   // org.clickbox.bottom += org.clickbox.buffer;
   // org.clickbox.width = org.clickbox.right - org.clickbox.left;
   // org.clickbox.height = org.clickbox.bottom - org.clickbox.top;
   // org.clickbox.x = org.clickbox.left + org.clickbox.width / 2;
   // org.clickbox.y = org.clickbox.top + org.clickbox.height / 2;

   // CTF
   if (game.info.mode === 'ctf') {
      if (!game.flag.carried) {
         if (org.pos.x - org.col > game.flag.x - game.flag.width / 2 && org.pos.x + org.col < game.flag.x + game.flag.width / 2 && org.pos.y - org.col > game.flag.y - game.flag.height / 2 && org.pos.y + org.col < game.flag.y + game.flag.height / 2) {
            game.flag.carried = true;
            game.flag.carrier = socket.id;
            socket.emit('Flag', { flag: game.flag, host: game.info.host });
         }
      }
   }
   
   socket.emit('Org Update', [
      org.alive, // Only the following attributes of org need to be updated
      org.cells, // Latency is decreased by only sending necessary data
      org.off,
      org.pos,
      org.color,
      org.skin,
      org.team,
      org.coefficient,
      org.range
   ]);
   if (org.count === 0) {
      for (let i = 0; i < game.board.list.length; i++) {
         if (game.board.list[i].player === socket.id) { // Add death to leaderboard
            game.board.list[i].deaths++; // Add 1 to deaths counter
            orderBoard(game.board.list); // Sort the list by kills then deaths
            socket.emit('Board', { list: game.board.list, host: game.board.host }); // Send updated board to server
         }
      }
      if (org.hit !== org.player) { // Cannot gain kill for suicide
         for (let i = 0; i < game.board.list.length; i++) {
            if (game.board.list[i].player === org.hit) { // Find killer in leaderboard list
               game.board.list[i].kills++;
               orderBoard(game.board.list);
               socket.emit('Board', { list: game.board.list, host: game.board.host });
               break;
            }
         }
      }
      die(true);
   }
}

function grow(orG) {
   let org = orG;
   // Avoid double intervals
   if (org.tracker.start) { // If tracker has been started
      org.tracker.end = Date.now();
      org.tracker.elap = org.tracker.end - org.tracker.start;
   }
   if (org.tracker.elap < _ofrequency * .6) {
      switch (state) {
         case 'game': // Only necessary in game, others states may be added
         case 'pauseGameMenu':
            org.clearIntervals();
            org.intervals.push(setInterval(() => runLoop(), _ofrequency));
            break;
      }
   }
   let src = getSrc();
   let ability;
   for (let i = 0; i < src.abilities.length; i++) {
      if (src.abilities[i].player == org.player) {
         ability = src.abilities[i];
         break;
      }
   }
   // Birth
   var regions = getRegionInfo(org);
   if (ability.freeze.value == false) { // If org is not Frozen (cannot birth or die naturally)
      // for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
      // if (ability.poison.value == true) {
      // 	if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
      // 		continue;
      // 	}
      // }
      for (let i = 0; i < regions.adjacent.length; i++) { // Only Adjacent Regions Can Produce New Cells
         // Don't birth new cell outside world boundary
         if (src.world) {
            if (src.world.type === 'rectangle') {
               if (regions.adjacent[i].x - _cellwidth / 2 <= src.world.x || regions.adjacent[i].x + _cellwidth / 2 >= src.world.x + src.world.width || regions.adjacent[i].y - _cellwidth / 2 <= src.world.x || regions.adjacent[i].y + _cellwidth / 2 >= src.world.y + src.world.height) { // If new cell would be outside world boundary
                  continue;
               }
            } else if (src.world.type === 'ellipse') {
               let a = src.world.width / 2;
               let b = src.world.height / 2;
               let x = (regions.adjacent[i].x - _cellwidth / 2) - a;
               let y = (regions.adjacent[i].y - _cellwidth / 2) - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) { // If top-left corner is outside ellipse
                  continue;
               }
               x = (regions.adjacent[i].x + _cellwidth / 2) - a;
               y = (regions.adjacent[i].y - _cellwidth / 2) - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) { // If top-right corner is outside ellipse
                  continue;
               }
               x = (regions.adjacent[i].x + _cellwidth / 2) - a;
               y = (regions.adjacent[i].y + _cellwidth / 2) - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) { // If bottom-right corner is outside ellipse
                  continue;
               }
               x = (regions.adjacent[i].x - _cellwidth / 2) - a;
               y = (regions.adjacent[i].y + _cellwidth / 2) - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) { // If bottom-left corner is outside ellipse
                  continue;
               }
            }
         }
         // Don't birth new cell on top of an opponent org
         var overlap = false;
         for (let j = 0; j < src.orgs.length; j++) {
            if (src.orgs[j].player === org.player) { // If org is player's org
               continue;
            }
            for (let k = 0; k < src.orgs[j].count; k++) {
               if (regions.adjacent[i].x + _cellwidth / 2 >= src.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[i].x + _cellwidth / 2 <= src.orgs[j].cells[k].x + _cellwidth / 2) { // If right side collides
                  if (regions.adjacent[i].y + _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y + _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) { // If bottom side collides
                     overlap = true;
                  } else if (regions.adjacent[i].y - _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y - _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) { // If top side collides
                     overlap = true;
                  }
               } else if (regions.adjacent[i].x - _cellwidth / 2 >= src.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[i].x - _cellwidth / 2 <= src.orgs[j].cells[k].x + _cellwidth / 2) { // If left side collides
                  if (regions.adjacent[i].y + _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y + _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) { // If bottom side collides
                     overlap = true;
                  } else if (regions.adjacent[i].y - _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y - _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) { // If top side collides
                     overlap = true;
                  }
               }
            }
         }
         if (overlap === true) {
            continue;
         }
         // Birth new cell accordingly
         if (ability.compress.value ^ ability.extend.value == 0) { // compress.value NOT XOR extend.value
            org.coefficient = -27.5;
            org.range = _range;
         } else if (ability.compress.value == true) {
            org.coefficient = -31.5;
            org.range = _range - 10;
         } else if (ability.extend.value == true) {
            org.coefficient = -25.5;
            org.range = _range + 20;
         }
         let chance = org.coefficient * Math.log(sqrt(sq(regions.adjacent[i].x - org.pos.x) + sq(regions.adjacent[i].y - org.pos.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100
         if (random(0, 100) <= chance) {
            var repeat = false;
            for (let j = 0; j < org.count; j++) {
               if (regions.adjacent[i].x == org.cells[j].x && regions.adjacent[i].y == org.cells[j].y) {
                  repeat = true;
                  break;
               }
            }
            if (repeat === false) {
               org.cells.push(new Cell(regions.adjacent[i].x, regions.adjacent[i].y, org));
               org.count++;
            }
         }
      }
   }

   // Natural Death
   if (ability.freeze.value === false) { // If org is not Frozen (cannot birth or die naturally)
      if (ability.immortality.value === false) { // If org is not Immortal
         for (let i = 0; i < regions.exposed.length; i++) { // Only Exposed Cells Can Die
            let chance = org.coefficient * Math.log(-regions.exposed[i].d(org) + (org.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
            if (regions.exposed[i].d(org) > org.range) { // If exposed cell is outside maximum radius
               for (let j = 0; j < org.count; j++) {
                  if (regions.exposed[i].x === org.cells[j].x && regions.exposed[i].y === org.cells[j].y) { // Find exposed cell within org cells array
                     org.cells.splice(j, 1);
                     org.count--;
                     regions.exposed.splice(i, 1);
                     i--;
                     j--;
                     break;
                  }
               }
               continue;
            }
            if (src.world.type == 'rectangle' && (regions.exposed[i].x < src.world.x || regions.exposed[i].x > src.world.x + src.world.width || regions.exposed[i].y < src.world.y || regions.exposed[i].y > src.world.y + src.world.height)) { // If cell is outside rectangular world
               for (let j = 0; j < org.count; j++) {
                  if (regions.exposed[i].x === org.cells[j].x && regions.exposed[i].y === org.cells[j].y) {
                     org.cells.splice(j, 1);
                     org.count--;
                     regions.exposed.splice(i, 1);
                     i--;
                     j--;
                     break;
                  }
               }
            } else if (src.world.type === 'ellipse' && sq(regions.exposed[i].x - src.world.x - src.world.width / 2) / sq(src.world.width / 2) + sq(regions.exposed[i].y - src.world.y - src.world.height / 2) / sq(src.world.height / 2) > 1) { // If outside elliptical world
               for (let j = 0; j < org.count; j++) {
                  if (regions.exposed[i].x === org.cells[j].x && regions.exposed[i].y === org.cells[j].y) { // Identify cell
                     org.cells.splice(j, 1);
                     org.count--;
                     regions.exposed.splice(i, 1);
                     i--;
                     j--;
                     break;
                  }
               }
            }
            if (random(0, 100) <= chance) {
               for (let j = 0; j < org.count; j++) {
                  if (regions.exposed[i].x === org.cells[j].x && regions.exposed[i].y === org.cells[j].y) {
                     org.cells.splice(j, 1);
                     org.count--;
                     regions.exposed.splice(i, 1);
                     i--;
                     j--;
                     break;
                  }
               }
            }
         }
      }
   }

   // Abilities
   for (let i = 0; i < src.orgs.length; i++) {
      if ((src.orgs[i].team === org.team && typeof team === 'string') && src.orgs[i].player !== socket.id) { // If is friendly org but not own org
         continue; // No friendly fire but can hurt self
      }
      if (src.abilities[i].secrete.value === true) { // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
         for (let j = 0; j < org.count; j++) {
            for (let k = 0; k < src.abilities[i].spore.count; k++) {
               if (sqrt(sq(org.cells[j].x - src.abilities[i].spore.spores[k].x) + sq(org.cells[j].y - src.abilities[i].spore.spores[k].y)) <= src.abilities[i].secrete.radius) { // If center of cell is within secrete circle (subject to change)
                  let skip = false;
                  for (let l = 0; l < src.abilities.length; l++) {
                     if (src.abilities[l].neutralize.value === true && sqrt(sq(org.cells[j].x - src.abilities[l].neutralize.x) + sq(org.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                        skip = true;
                        break;
                     }
                  }
                  if (skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.hit = src.abilities[i].player;
                  if (src.src === 'game' && org.hit !== org.player) { // Only for game; Only for other player hits
                     for (let l = 0; l < src.teams.length; l++) { // Search teams
                        if (src.teams[l].indexOf(org.hit) !== -1 && src.teams[l].indexOf(org.player) !== -1) { // If player and hitter are on same team
                           skip = true;
                           break;
                        }
                     }
                  }
                  if (skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.cells.splice(j, 1);
                  org.count--;
                  j--;
                  break;
               }
            }
         }
      }
      for (let j = 0; j < 3; j++) { // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
         if (src.abilities[i].shoot.secrete[j].value == true) {
            for (let k = 0; k < org.count; k++) {
               if (sqrt(sq(org.cells[k].x - src.abilities[i].shoot.spore[j].x) + sq(org.cells[k].y - src.abilities[i].shoot.spore[j].y)) <= src.abilities[i].shoot.secrete[j].radius) { // If center of cell is within shoot circle (subject to change)
                  let skip = false;
                  for (let l = 0; l < src.abilities.length; l++) {
                     if (src.abilities[l].neutralize.value == true && sqrt(sq(org.cells[j].x - src.abilities[l].neutralize.x) + sq(org.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                        skip = true;
                        break;
                     }
                  }
                  if (skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.hit = src.abilities[i].player;
                  if (src.src === 'game' && org.hit !== org.player) { // Only for game; Only for other player hits
                     for (let l = 0; l < src.teams.length; l++) { // Search teams
                        if (src.teams[l].indexOf(org.hit) !== -1 && src.teams[l].indexOf(org.player) !== -1) { // If player and hitter are on same team
                           skip = true;
                           break;
                        }
                     }
                  }
                  if (skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.cells.splice(k, 1);
                  org.count--;
                  k--;
                  // break; // Break causes cells to die one at a time (not default)
               }
            }
         }
      }
      if (src.abilities[i].toxin.value == true) { // Toxin
         for (let j = 0; j < org.count; j++) {
            if (org.player == src.abilities[i].player) { // If is own org's toxin
               continue; // Do not kill own cells
            }
            if (sqrt(sq(org.cells[j].x - src.abilities[i].toxin.x) + sq(org.cells[j].y - src.abilities[i].toxin.y)) <= src.abilities[i].toxin.radius) { // If center of cell is within toxin circle
               let skip = false;
               for (let l = 0; l < src.abilities.length; l++) {
                  if (src.abilities[l].neutralize.value == true && sqrt(sq(org.cells[j].x - src.abilities[l].neutralize.x) + sq(org.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                     skip = true;
                     break;
                  }
               }
               if (skip == true) {
                  continue; // Acid is ineffectual when neutralized
               }
               org.hit = src.abilities[i].player;
               if (src.src === 'game' && org.hit !== org.player) { // Only for game; Only for other player hits
                  for (let l = 0; l < src.teams.length; l++) { // Search teams
                     if (src.teams[l].indexOf(org.hit) !== -1 && src.teams[l].indexOf(org.player) !== -1) { // If player and hitter are on same team
                        skip = true;
                        break;
                     }
                  }
               }
               if (skip == true) {
                  continue; // Acid is ineffectual when neutralized
               }
               org.cells.splice(j, 1); // Kill cell
               org.count--;
               j--;
               // break; // Break causes cells to die one at a time (not default)
            }
         }
      }
   }

   if (org.count == 0) {
      org.alive = false;
   } else {
      org.alive = true;
   }
   org.tracker.start = Date.now();
}

function die(spectatE) {
   socket.emit('Dead', spectatE);
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
   socket.emit('Ability', ability);
}