var org;
var Org = function(data) { // data: { player: , color: , skin: , team: , spectate: , pos: , title: } (color and skin are required)
   this.player = data.player;
   this.color = data.color;
   this.skin = data.skin;
   this.team = data.team;
   let src = getSrc();
   if (src != undefined && src.src == 'game') {
      if (game.rounds.util == true) {
         this.ready = false; // org.ready ensures that org will only be forcibly respawned once
      }
      if (game.info.mode == 'srv' && game.rounds.waiting == false) {
         this.spawn = false;
      } else {
         this.spawn = true; // Allowance to spawn
      }
      for (let i = 0; i < game.board.list.length; i++) {
         if (game.board.list[i].player == this.player) { // Find player name in leaderboard list
            this.name = game.board.list[i].name;
         }
      }
   }
   if (data.spectate == true) {
      this.speed = _spectatespeed; // Faster movement when spectating
   } else {
      this.speed = _movespeed; // Speed of position movement
   }
   this.cells = [];
   this.count = 0;
   if (data.pos != undefined) {
      this.pos = data.pos;
   } else {
      do {
         this.pos = { // Position is the target's location in the world
            x: floor(random(game.world.x + 50 + _cellwidth / 2, game.world.x + game.world.width - 50 - _cellwidth / 2)), // +- 50 acts as buffer
            y: floor(random(game.world.y + 50 + _cellwidth / 2, game.world.y + game.world.height - 50 - _cellwidth / 2))
         };
         var rePos = false;
         if (game.world.type == 'rectangle') {
            if (this.pos.x < game.world.x || this.pos.x > game.world.x + game.world.width || this.pos.y < game.world.y || this.pos.y > game.world.y + game.world.height) {
               rePos = false;
            }
         } else if (game.world.type == 'ellipse') {
            if (sq(this.pos.x - (game.world.x + game.world.width / 2)) / sq(game.world.width / 2) + sq(this.pos.y - (game.world.y + game.world.height / 2)) / sq(game.world.height / 2) >= 1) {
               rePos = true;
            }
         }
         for (let i = 0; i < game.info.count; i++) { // Org Overlap
            for (let j = 0; j < game.orgs[i].count; j++) {
               if (game.orgs[i].cells[j].x - game.orgs[i].cells[j].width <= this.pos.x && game.orgs[i].cells[j].x + game.orgs[i].cells[j].width >= this.pos.x && game.orgs[i].cells[j].y - game.orgs[i].cells[j].height <= this.pos.y && game.orgs[i].cells[j].y + game.orgs[i].cells[j].height >= this.pos.y) { // If position collides with enemy cell (Full width buffer is intended)
                  rePos = true;
                  break;
               }
            }
            if (rePos == true) { break; }
            let abilitY = game.abilities[i];
            if (abilitY.secrete.value == true) { // Spore Secretions Overlap
               for (let j = 0; j < abilitY.spore.count; j++) {
                  let cell = abilitY.spore.spores[j];
                  if (sqrt(sq(this.pos.x - cell.x) + sq(this.pos.y - cell.y)) <= abilitY.secrete.radius) {
                     rePos = true;
                     break;
                  }
               }
            }
            for (let j = 0; j < 3; j++) { // Shoot Secretions Overlap
               if (abilitY.shoot.secrete[j].value == true) {
                  let cell = abilitY.shoot.spore[j];
                  let sec = abilitY.shoot.secrete[j];
                  if (sqrt(sq(this.pos.x - cell.x) + sq(this.pos.y - cell.y)) <= sec.radius) {
                     rePos = true;
                     break;
                  }
               }
            }
            if (abilitY.toxin.value == true) { // Toxin Overlap
               if (sqrt(sq(this.pos.x - abilitY.toxin.x) + sq(this.pos.y - abilitY.toxin.y)) <= abilitY.toxin.radius) {
                  rePos = true;
               }
            }
            if (rePos == true) { break; }
         }
      } while (rePos == true);
   }
   this.off = { // Offset is the difference between pos and center
      x: this.pos.x - center.x,
      y: this.pos.y - center.y
   };
   this.col = 10; // Collision radius (square) for crosshair (used in collision detection with flag)
   // this.target = undefined; // ID of player which this org is currently targeting (NOT IN USE)
   // this.clickbox = { // Targeting box for other orgs to click (NOT IN USE)
   //    width: undefined,
   //    height: undefined,
   //    x: undefined,
   //    y: undefined,
   //    left: this.pos.x,
   //    right: this.pos.x,
   //    top: this.pos.y,
   //    bottom: this.pos.y,
   //    buffer: _cellwidth / 2,
   //    color: this.color
   // };
   this.coefficient = -27.5; // Used in calculating size (changes in response to extend and compress abilities)
   this.range = 50;
   this.alive = false;
   this.hit = undefined;
   this.count = this.cells.length;
   this.intervals = []; // Store an array of intervals to be pushed; in case multiple intervals are created unintentionally, they can be cleared
   /**
    * Clear the growth interval(s) in this org
    * @return void
    */
   this.tracker = { // Used to ensure no double org growth intervals
      start: undefined, 
      end: undefined, 
      elap: undefined
   };

   // Helper Functions
   /**
    * Compress the org object into only the data that must be sent to the server
    *    In order to reduce latency, data sent through web socket should be minimized
    *    Currently, only the following properties are updated each tick:
    *       alive, cells, off, pos, color, skin, team, coefficient, range
    * @return {Object} contains only attributes of org, no functional properties
    */
   this.getCompressed = () => {
      return {
         player: this.player, // Properties are listed here in the order they appear above in this file (/public/js/org.js)
         color: this.color,
         skin: this.skin,
         team: this.team,
         ready: this.ready,
         spawn: this.spawn,
         name: this.name,
         speed: this.speed,
         cells: this.cells,
         count: this.count,
         pos: this.pos,
         off: this.off,
         col: this.col,
         // target: this.target,
         // clickbox: this.clickbox,
         coefficient: this.coefficient,
         range: this.range,
         alive: this.alive,
         hit: this.hit,
         intervals: this.intervals,
         tracker: this.tracker
      };
   };
   this.clearIntervals = () => {
      for (let i = 0; i < this.intervals.length; i++) {
         clearInterval(this.intervals[i]);
      }
      this.intervals = [];
   };
   this.x = () => { // The average of all cell x values 
      let sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].x;
      }
      let average = sum / this.count;
      return average;
   };
   this.y = () => { // The average of all cell y values
      let sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].y;
      }
      let average = sum / this.count;
      return average;
   };
   this.checkAlive = () => {
      if (this.count > 0) this.alive = true;
      else if (this.count === 0) this.alive = false;
      else console.error('(org).checkAlive(): (org).count < 0');
   };
   // this.setClickbox = () => { // DO NOT DELETE
   //    this.clickbox.left = this.x();
   //    this.clickbox.right = this.clickbox.left;
   //    this.clickbox.top = this.y();
   //    this.clickbox.bottom = this.clickbox.top;
   //    for (let i = 0; i < this.count; i++) { // Set the size of clickbox
   //       if (this.cells[i].x - this.cells[i].width / 2 < this.clickbox.left) {
   //          this.clickbox.left = this.cells[i].x - this.cells[i].width / 2;
   //       }
   //       if (this.cells[i].x + this.cells[i].width / 2 > this.clickbox.right) {
   //          this.clickbox.right = this.cells[i].x + this.cells[i].width / 2;
   //       }
   //       if (this.cells[i].y - this.cells[i].height / 2 < this.clickbox.top) {
   //          this.clickbox.top = this.cells[i].y - this.cells[i].height / 2;
   //       }
   //       if (this.cells[i].y + this.cells[i].height / 2 > this.clickbox.bottom) {
   //          this.clickbox.bottom = this.cells[i].y + this.cells[i].height / 2;
   //       }
   //    }
   //    this.clickbox.left -= this.clickbox.buffer;
   //    this.clickbox.right += this.clickbox.buffer;
   //    this.clickbox.top -= this.clickbox.buffer;
   //    this.clickbox.bottom += this.clickbox.buffer;
   //    this.clickbox.width = this.clickbox.right - this.clickbox.left;
   //    this.clickbox.height = this.clickbox.bottom - this.clickbox.top;
   //    this.clickbox.x = this.clickbox.left + this.clickbox.width / 2;
   //    this.clickbox.y = this.clickbox.top + this.clickbox.height / 2;
   // };
   this.getRegionInfo = () => {
      var enclosed = [];
      var exposed = [];
      var adjacent = [];
      for (let i = 0; i < this.count; i++) {
         let test = { x: undefined, y: undefined };
         var left = false;
         var top = false;
         var right = false;
         var bottom = false;
         for (let j = 0; j < this.count; j++) {
            if (i != j) {
               test = { // Left
                  x: this.cells[i].x - this.cells[i].width,
                  y: this.cells[i].y
               };
               if (test.x == this.cells[j].x && test.y == this.cells[j].y) {
                  left = true; // There is a friendly cell to the left
               }
               test = { // Top
                  x: this.cells[i].x,
                  y: this.cells[i].y - this.cells[i].height
               };
               if (test.x == this.cells[j].x && test.y == this.cells[j].y) {
                  top = true; // There is a friendly cell to the top
               }
               test = { // Right
                  x: this.cells[i].x + this.cells[i].width,
                  y: this.cells[i].y
               };
               if (test.x == this.cells[j].x && test.y == this.cells[j].y) {
                  right = true; // There is a friendly cell to the right
               }
               test = { // Bottom
                  x: this.cells[i].x,
                  y: this.cells[i].y + this.cells[i].height
               };
               if (test.x == this.cells[j].x && test.y == this.cells[j].y) {
                  bottom = true; // There is a friendly cell to the bottom
               }
            }
         }
         if (left == true && top == true && right == true && bottom == true) { // If cell is enclosed on all sides by friendly cells
            enclosed.push(this.cells[i]);
         } else { // If cell is not enclosed on all sides by friendly cells
            exposed.push(this.cells[i]);
         }
         if (left == false) { // Push all empty regions adjacent to org
            adjacent.push({ x: this.cells[i].x - this.cells[i].width, y: this.cells[i].y });
         }
         if (top == false) {
            adjacent.push({ x: this.cells[i].x, y: this.cells[i].y - this.cells[i].height });
         }
         if (right == false) {
            adjacent.push({ x: this.cells[i].x + this.cells[i].width, y: this.cells[i].y });
         }
         if (bottom == false) {
            adjacent.push({ x: this.cells[i].x, y: this.cells[i].y + this.cells[i].height });
         }
      }
      for (var j = 0; j < adjacent.length; j++) { // Splice out empty regions adjacent to multiple cells
         for (var k = 0; k < adjacent.length; k++) {
            if (j != k) { // If adjacent[j] and adjacent[k] are different regions
               if (adjacent[k].x == adjacent[j].x && adjacent[k].y == adjacent[j].y) { // If region is repeated
                  adjacent.splice(k, 1);
                  k--;
               }
               if (j >= adjacent.length) {
                  continue;
               }
            }
         }
      }
      return {
         enclosed: enclosed,
         exposed: exposed,
         adjacent: adjacent
      };
   };
   this.grow = () => {
      // Avoid double intervals
      if (this.tracker.start) { // If tracker has been started
         this.tracker.end = Date.now();
         this.tracker.elap = this.tracker.end - this.tracker.start;
      }
      if (this.tracker.elap < _ofrequency * .6) { // If org is growing ~twice as frequently as it should
         switch (state) { // Recreate org growth interval (stored in an array so if multiple intervals are created accidentally, they can be cleared)
            case 'game': // Only necessary in states where orgs are growing (game and game pause menu), others states may be added
            case 'pauseGameMenu':
               this.clearIntervals();
               this.intervals.push(setInterval(() => runLoop(), _ofrequency));
               break;
         }
      }
      let src = getSrc();
      let ability;
      for (let i = 0; i < src.abilities.length; i++) {
         if (src.abilities[i].player == this.player) {
            ability = src.abilities[i];
            break;
         }
      }
      
      this.birth();
      this.naturalDeath();
      this.checkAbilities();

      this.checkAlive();

      socket.emit('Org Update', [
         this.alive, // Only the following attributes of org need to be updated
         this.cells, // Latency is decreased by only sending necessary data
         this.off, // Order of this array matters and is encoded in /src/app.js @ socket.on('Org Update')
         this.pos,
         this.color,
         this.skin,
         this.team,
         this.coefficient,
         this.range
      ]);
      if (this.count === 0) {
         for (let i = 0; i < game.board.list.length; i++) {
            if (game.board.list[i].player === socket.id) { // Add death to leaderboard
               game.board.list[i].deaths++; // Add 1 to deaths counter
               orderBoard(game.board.list); // Sort the list by kills then deaths
               socket.emit('Board', { list: game.board.list, host: game.board.host }); // Send updated board to server
            }
         }
         if (this.hit !== this.player) { // Cannot gain kill for suicide
            for (let i = 0; i < game.board.list.length; i++) {
               if (game.board.list[i].player === this.hit) { // Find killer in leaderboard list
                  game.board.list[i].kills++;
                  orderBoard(game.board.list);
                  socket.emit('Board', { list: game.board.list, host: game.board.host });
                  break;
               }
            }
         }
         die(true);
      }
      
      this.tracker.start = Date.now();
   };
   /**
    * Determine if and where cells should be born during a single tick
    * @return void
    */
   this.birth = () => {
      let src = getSrc();
      let regions = this.getRegionInfo();
      if (ability.freeze.value === false) { // If org is not Frozen (cannot birth or die naturally)
         // for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
         // if (ability.poison.value == true) {
         //    if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
         //       continue;
         //    }
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
               if (src.orgs[j].player === this.player) { // If org is player's org
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
               this.coefficient = -27.5;
               this.range = _range;
            } else if (ability.compress.value == true) {
               this.coefficient = -31.5;
               this.range = _range - 10;
            } else if (ability.extend.value == true) {
               this.coefficient = -25.5;
               this.range = _range + 20;
            }
            let chance = this.coefficient * Math.log(sqrt(sq(regions.adjacent[i].x - this.pos.x) + sq(regions.adjacent[i].y - this.pos.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100
            if (random(0, 100) <= chance) {
               var repeat = false;
               for (let j = 0; j < this.count; j++) {
                  if (regions.adjacent[i].x == this.cells[j].x && regions.adjacent[i].y == this.cells[j].y) {
                     repeat = true;
                     break;
                  }
               }
               if (repeat === false) {
                  this.cells.push(new Cell(regions.adjacent[i].x, regions.adjacent[i].y, this));
                  this.count++;
               }
            }
         }
      }
   };
   /**
    * Determine if and where cells should die naturally (without ability involvement) during a single tick
    *    Remove cells from org after determination
    * @return void
    */
   this.naturalDeath = () => {
      let src = getSrc();
      let regions = this.getRegionInfo();
      if (ability.freeze.value === false) { // If org is not Frozen (cannot birth or die naturally)
         if (ability.immortality.value === false) { // If org is not Immortal
            for (let i = 0; i < regions.exposed.length; i++) { // Only Exposed Cells Can Die
               let chance = this.coefficient * Math.log(-regions.exposed[i].d(this) + (this.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
               if (regions.exposed[i].d(this) > this.range) { // If exposed cell is outside maximum radius
                  for (let j = 0; j < this.count; j++) {
                     if (regions.exposed[i].x === this.cells[j].x && regions.exposed[i].y === this.cells[j].y) { // Find exposed cell within org cells array
                        this.cells.splice(j, 1);
                        this.count--;
                        regions.exposed.splice(i, 1);
                        i--;
                        j--;
                        break;
                     }
                  }
                  continue;
               }
               if (src.world.type == 'rectangle' && (regions.exposed[i].x < src.world.x || regions.exposed[i].x > src.world.x + src.world.width || regions.exposed[i].y < src.world.y || regions.exposed[i].y > src.world.y + src.world.height)) { // If cell is outside rectangular world
                  for (let j = 0; j < this.count; j++) {
                     if (regions.exposed[i].x === this.cells[j].x && regions.exposed[i].y === this.cells[j].y) {
                        this.cells.splice(j, 1);
                        this.count--;
                        regions.exposed.splice(i, 1);
                        i--;
                        j--;
                        break;
                     }
                  }
               } else if (src.world.type === 'ellipse' && sq(regions.exposed[i].x - src.world.x - src.world.width / 2) / sq(src.world.width / 2) + sq(regions.exposed[i].y - src.world.y - src.world.height / 2) / sq(src.world.height / 2) > 1) { // If outside elliptical world
                  for (let j = 0; j < this.count; j++) {
                     if (regions.exposed[i].x === this.cells[j].x && regions.exposed[i].y === this.cells[j].y) { // Identify cell
                        this.cells.splice(j, 1);
                        this.count--;
                        regions.exposed.splice(i, 1);
                        i--;
                        j--;
                        break;
                     }
                  }
               }
               if (random(0, 100) <= chance) {
                  for (let j = 0; j < this.count; j++) {
                     if (regions.exposed[i].x === this.cells[j].x && regions.exposed[i].y === this.cells[j].y) {
                        this.cells.splice(j, 1);
                        this.count--;
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
   };
   this.checkAbilities = () => {
      let src = getSrc();
      for (let i = 0; i < src.orgs.length; i++) {
         if ((src.orgs[i].team === this.team && typeof team === 'string') && src.orgs[i].player !== socket.id) { // If is friendly org but not own org
            continue; // No friendly fire but can hurt self
         }
         if (src.abilities[i].secrete.value === true) { // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
            for (let j = 0; j < this.count; j++) {
               for (let k = 0; k < src.abilities[i].spore.count; k++) {
                  if (sqrt(sq(this.cells[j].x - src.abilities[i].spore.spores[k].x) + sq(this.cells[j].y - src.abilities[i].spore.spores[k].y)) <= src.abilities[i].secrete.radius) { // If center of cell is within secrete circle (subject to change)
                     let skip = false;
                     for (let l = 0; l < src.abilities.length; l++) {
                        if (src.abilities[l].neutralize.value === true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                           skip = true;
                           break;
                        }
                     }
                     if (skip) {
                        continue; // Acid is ineffectual when neutralized
                     }
                     this.hit = src.abilities[i].player;
                     if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                        for (let l = 0; l < src.teams.length; l++) { // Search teams
                           if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                              skip = true;
                              break;
                           }
                        }
                     }
                     if (skip) {
                        continue; // Acid is ineffectual when neutralized
                     }
                     this.cells.splice(j, 1);
                     this.count--;
                     j--;
                     break;
                  }
               }
            }
         }
         for (let j = 0; j < 3; j++) { // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
            if (src.abilities[i].shoot.secrete[j].value == true) {
               for (let k = 0; k < this.count; k++) {
                  if (sqrt(sq(this.cells[k].x - src.abilities[i].shoot.spore[j].x) + sq(this.cells[k].y - src.abilities[i].shoot.spore[j].y)) <= src.abilities[i].shoot.secrete[j].radius) { // If center of cell is within shoot circle (subject to change)
                     let skip = false;
                     for (let l = 0; l < src.abilities.length; l++) {
                        if (src.abilities[l].neutralize.value == true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                           skip = true;
                           break;
                        }
                     }
                     if (skip) {
                        continue; // Acid is ineffectual when neutralized
                     }
                     this.hit = src.abilities[i].player;
                     if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                        for (let l = 0; l < src.teams.length; l++) { // Search teams
                           if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                              skip = true;
                              break;
                           }
                        }
                     }
                     if (skip) {
                        continue; // Acid is ineffectual when neutralized
                     }
                     this.cells.splice(k, 1);
                     this.count--;
                     k--;
                     // break; // Break causes cells to die one at a time (not default)
                  }
               }
            }
         }
         if (src.abilities[i].toxin.value == true) { // Toxin
            for (let j = 0; j < this.count; j++) {
               if (this.player == src.abilities[i].player) { // If is own org's toxin
                  continue; // Do not kill own cells
               }
               if (sqrt(sq(this.cells[j].x - src.abilities[i].toxin.x) + sq(this.cells[j].y - src.abilities[i].toxin.y)) <= src.abilities[i].toxin.radius) { // If center of cell is within toxin circle
                  let skip = false;
                  for (let l = 0; l < src.abilities.length; l++) {
                     if (src.abilities[l].neutralize.value == true && sqrt(sq(this.cells[j].x - src.abilities[l].neutralize.x) + sq(this.cells[j].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
                        skip = true;
                        break;
                     }
                  }
                  if (skip) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  this.hit = src.abilities[i].player;
                  if (src.src === 'game' && this.hit !== this.player) { // Only for game; Only for other player hits
                     for (let l = 0; l < src.teams.length; l++) { // Search teams
                        if (src.teams[l].indexOf(this.hit) !== -1 && src.teams[l].indexOf(this.player) !== -1) { // If player and hitter are on same team
                           skip = true;
                           break;
                        }
                     }
                  }
                  if (skip) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  this.cells.splice(j, 1); // Kill cell
                  this.count--;
                  j--;
                  // break; // Break causes cells to die one at a time (not default)
               }
            }
         }
      }
   };
};

var Cell = function(x, y, org) {
   this.player = org.player;
   this.width = _cellwidth; // or 3x3
   this.height = _cellwidth;
   this.x = x;
   this.y = y;
   this.color = org.color;
   this.r = function() { // Distance from org center
      let distance = sqrt(sq(this.x - org.x()) + sq(this.y - org.y()));
      return distance;
   };
   this.d = function(org) { // Distance from target (Position in world)
      let distance = sqrt(sq(this.x - org.pos.x) + sq(this.y - org.pos.y));
      return distance;
   };
};

function renderOrgs() {
   let src = getSrc();
   for (let i = 0; i < src.orgs.length; i++) {
      for (let j = 0; j < src.orgs[i].count; j++) {
         let cell = src.orgs[i].cells[j];
         fill(src.orgs[i].color.r, src.orgs[i].color.g, src.orgs[i].color.b);
         if (src.orgs[i].skin == 'grid') {
            stroke(40, 40, 40); // Draw constant grid (natural grid is variable)
            strokeWeight(.25);
            rect(cell.x, cell.y, cell.width, cell.height);
         } else if (src.orgs[i].skin == 'circles') {
            noStroke();
            ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
         } else if (src.orgs[i].skin == 'ghost') {
            noFill();
            stroke(src.orgs[i].color.r, src.orgs[i].color.g, src.orgs[i].color.b);
            strokeWeight(1);
            rect(cell.x, cell.y, cell.width, cell.height);
         } else if (src.orgs[i].skin == 'none') {
            stroke(src.orgs[i].color.r, src.orgs[i].color.g, src.orgs[i].color.b); // Stroke over natural grid
            strokeWeight(1);
            rect(cell.x, cell.y, cell.width, cell.height);
         }
      }
   }
}