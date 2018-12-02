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
   this.x = function() { // The average of all cell x values 
      let sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].x;
      }
      let average = sum / this.count;
      return average;
   };
   this.y = function() { // The average of all cell y values
      let sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].y;
      }
      let average = sum / this.count;
      return average;
   };
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
   this.clearIntervals = () => {
      for (let i = 0; i < this.intervals.length; i++) {
         clearInterval(this.intervals[i]);
      }
      this.intervals = [];
   };
   this.tracker = { // Used to ensure no double org growth intervals
      start: undefined, 
      end: undefined, 
      elap: undefined
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

var getRegionInfo = function(orG) {
   var enclosed = [];
   var exposed = [];
   var adjacent = [];
   for (let i = 0; i < orG.count; i++) {
      let test = { x: undefined, y: undefined };
      var left = false;
      var top = false;
      var right = false;
      var bottom = false;
      for (let j = 0; j < orG.count; j++) {
         if (i != j) {
            test = { // Left
               x: orG.cells[i].x - orG.cells[i].width,
               y: orG.cells[i].y
            };
            if (test.x == orG.cells[j].x && test.y == orG.cells[j].y) {
               left = true; // There is a friendly cell to the left
            }
            test = { // Top
               x: orG.cells[i].x,
               y: orG.cells[i].y - orG.cells[i].height
            };
            if (test.x == orG.cells[j].x && test.y == orG.cells[j].y) {
               top = true; // There is a friendly cell to the top
            }
            test = { // Right
               x: orG.cells[i].x + orG.cells[i].width,
               y: orG.cells[i].y
            };
            if (test.x == orG.cells[j].x && test.y == orG.cells[j].y) {
               right = true; // There is a friendly cell to the right
            }
            test = { // Bottom
               x: orG.cells[i].x,
               y: orG.cells[i].y + orG.cells[i].height
            };
            if (test.x == orG.cells[j].x && test.y == orG.cells[j].y) {
               bottom = true; // There is a friendly cell to the bottom
            }
         }
      }
      if (left == true && top == true && right == true && bottom == true) { // If cell is enclosed on all sides by friendly cells
         enclosed.push(orG.cells[i]);
      } else { // If cell is not enclosed on all sides by friendly cells
         exposed.push(orG.cells[i]);
      }
      if (left == false) { // Push all empty regions adjacent to org
         adjacent.push({ x: orG.cells[i].x - orG.cells[i].width, y: orG.cells[i].y });
      }
      if (top == false) {
         adjacent.push({ x: orG.cells[i].x, y: orG.cells[i].y - orG.cells[i].height });
      }
      if (right == false) {
         adjacent.push({ x: orG.cells[i].x + orG.cells[i].width, y: orG.cells[i].y });
      }
      if (bottom == false) {
         adjacent.push({ x: orG.cells[i].x, y: orG.cells[i].y + orG.cells[i].height });
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