'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var ability;
var Ability = function Ability(datA) {
   // datA: { player: }
   var data = datA;
   this.player = data.player;
   // this.choose = {
   // 	width: undefined, 
   // 	height: undefined, 
   // 	color: {
   // 		deselected: { r: 139, g: 237, b: 173 }, 
   // 		selected: { r: 69, g: 204, b: 113 }
   // 	}
   // };
   this.extend = {
      value: false,
      activated: false,
      can: false,
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
   // speed: { // Not updated
   // 	value: false, 
   // 	activated: false, 
   // 	i: 0, 
   // 	j: 0, 
   // 	factor: 2, 
   // 	timeout: undefined, 
   // 	time: 5000
   // }, 
   // slow: { // Not updated
   // 	value: false, 
   // 	activated: false, 
   // 	i: 0, 
   // 	j: 1, 
   // 	factor: 2, 
   // 	timeout: undefined, 
   // 	time: 5000
   // }, 
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
   // stimulate: {
   // 	value: false, 
   // 	activated: false, 
   // 	can: false, 
   // 	i: 2, 
   // 	j: 0, 
   // 	factor: 9, // Factor must be equal to that of poison
   // 	timeout: undefined, 
   // 	start: undefined, 
   // 	end: undefined, 
   // 	cooling: false, 
   // 	time: 3000, 
   // 	cooldown: 5000
   // }, 
   // poison: {
   // 	value: false, 
   // 	activated: false, 
   // 	can: false, 
   // 	i: 2, 
   // 	j: 1, 
   // 	factor: 9, // Factor must be equal to that of stimulate
   // 	timeout: undefined, 
   // 	start: undefined, 
   // 	end: undefined, 
   // 	cooling: false, 
   // 	time: 3000, 
   // 	cooldown: 5000
   // }, 
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
      radius: _cellwidth / cos45 * 2.9,
      can: false,
      timeout: undefined,
      start: undefined,
      end: undefined,
      time: 800
   };
   this.shoot = {
      value: [false, false, false],
      can: [true, true, true],
      secrete: [{}, {}, {}
      // { // Sets values on use
      // 	value: false, 
      // 	color: undefined, 
      // 	radius: _cellwidth / cos45 * 2.7 / 2, // Half 'secrete'
      // 	hit: false, 
      // 	timeout: undefined, 
      // 	start: undefined, 
      // 	end: undefined, 
      // 	time: 800 // Same as 'secrete'
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
};

// function chooseAbilities() { // Old ability selection screen
// 	state = 'chooseAbilities';
// 	clear();
// 	textSize(30);
// 	textFont('Verdana');
// 	textStyle(NORMAL);
// 	fill(0);
// 	noStroke();
// 	rect(center.x, height / 30, textWidth('Choose Three Abilities') * 4 / 3, height / 15, 0, 0, 15, 15); // Choose Abilities Box
// 	fill(255);
// 	noStroke();
// 	text('Choose Three Abilities', center.x - textWidth('Choose Three Abilities') / 2, height / 24); // Choose Abilities Text
// 	ability.choose.width = width / 5;
// 	ability.choose.height = height / 3.5;
// 	for (let i = 0; i < 3; i++) {
// 		for (let j = 0; j < 2; j++) {
// 			for (let k in ability) {
// 				if (ability[k].i == i && ability[k].j == j) {
// 					if (ability[k].activated == false) {
// 						fill(ability.choose.color.deselected.r, ability.choose.color.deselected.g, ability.choose.color.deselected.b);
// 					} else if (ability[k].activated == true) {
// 						fill(ability.choose.color.selected.r, ability.choose.color.selected.g, ability.choose.color.selected.b);
// 					}
// 				}
// 			}
// 			stroke(0);
// 			strokeWeight(1);
// 			rect(width / 4 * (i + 1), height / 3 * (j + 1) - height / 30, ability.choose.width, ability.choose.height, 5); // Draw ability selection box
// 			for (let k in ability) {
// 				if (ability[k].i == i && ability[k].j == j) {
// 					fill(0);
// 					noStroke();
// 					textSize(24);
// 					textFont('Verdana');
// 					text(k[0].toUpperCase() + k.slice(1), width / 4 * (i + 1) - textWidth(k) / 2, height / 3 * (j + 1) - height / 30); // Write ability name
// 				}
// 			}
// 		}
// 	}
// 	noFill();
// 	stroke(0);
// 	strokeWeight(1);
// 	rect(center.x, height * 8 / 9, width / 9, height / 20, 6); // Spawn click box
// 	fill(0);
// 	noStroke();
// 	textSize(20);
// 	textFont('Verdana');
// 	text('Spawn', center.x - textWidth('Spawn') / 2, height * 8 / 9 + textSize() / 3); // Spawn Text
// }

function shoot(I, J) {
   // Both parameters are required
   if (ability.shoot.value[I] == false && ability.shoot.can[I] == true) {
      // If not currently shooting and if can shoot specified ability (Should have been checked before this point)
      ability.shoot.value[I] = true;
      ability.shoot.can[I] = false;
      ability.shoot.secrete[I].value = false;
      clearTimeout(ability.shoot.timeout[I]); // Reset timeout
      ability.shoot.start[I] = new Date(); // Set start time

      // Get Spore
      var regions = getRegionInfo(org); // Get region data
      var theta = void 0;
      if (mouseX == Infinity || mouseY == Infinity) {
         var mpos = getMpos();
         mouseX = mpos.x;
         mouseY = mpos.y;
      }
      if (state != 'tutorial') {
         theta = atan((mouseY - center.y) / (mouseX - center.x)); // Get angle (theta) from mouse pointer
         if (mouseX < center.x) {
            // If mouse is in second or third quadrants
            theta += 180; // Correct theta for negative x
         }
      } else {
         theta = atan((mouseY - org.pos.y) / (mouseX - org.pos.x));
         if (mouseX < org.pos.x) {
            // If mouse is in second or third quadrants
            theta += 180; // Correct theta for negative x
         }
      }
      var deltas = [];
      for (var i = 0; i < regions.exposed.length; i++) {
         // Loop through exposed cells
         var phi = atan((regions.exposed[i].y - org.y()) / (regions.exposed[i].x - org.x())); // Get angle (phi) of each exposed cell
         if (regions.exposed[i].x - org.x() < 0) {
            phi += 180;
         }
         deltas.push(abs(theta - phi)); // Calculate difference between theta and phi and collect in 'deltas' array
      }
      var min = void 0;
      for (var _i = 0; _i < deltas.length; _i++) {
         if (_i == 0) {
            min = deltas[_i]; // Set first delta as min for comparison value
            continue;
         } else if (min > deltas[_i]) {
            // Calculate minimum delta
            min = deltas[_i];
         }
      }
      ability.shoot.spore[I] = regions.exposed[deltas.indexOf(min)]; // Set spore as the cell with angle phi closest to mouse angle theta
      for (var _i2 = 0; _i2 < org.count; _i2++) {
         if (ability.shoot.spore[I].x == org.cells[_i2].x && ability.shoot.spore[I].y == org.cells[_i2].y) {
            // Find spore in org
            org.cells.splice(_i2, 1); // Remove spore cell from org
            org.count--;
            _i2--;
            break;
         }
      }
      ability.shoot.spore[I].speed = ability.shoot.speed;
      ability.shoot.spore[I].theta = theta;

      // Interval
      ability.shoot.interval[I] = function () {
         ability.shoot.spore[I].x += ability.shoot.spore[I].speed * cos(ability.shoot.spore[I].theta);
         ability.shoot.spore[I].y += ability.shoot.spore[I].speed * sin(ability.shoot.spore[I].theta);
         socket.emit('Ability', ability);
      };

      // Timeout
      ability.shoot.timeout[I] = setTimeout(function () {
         if (ability.shoot.value[I] == true && ability.shoot.secrete[I].value == false) {
            ability.shoot.value[I] = false;
            ability.shoot.spore[I] = undefined;
            ability.shoot.cooling[I] = true;
            ability.shoot.end[I] = new Date();
            ability.shoot.secrete[I].end = new Date();
            socket.emit('Ability', ability);
         }
      }, ability.shoot.time);
   } else if (ability.shoot.value[I] == true) {
      // If currently shooting (secrete)
      ability.shoot.end[I] = new Date();
      ability.shoot.value[I] = false;
      ability.shoot.secrete[I].radius = _cellwidth / cos45 * 2.9 / 2; // Not predefined (Half secrete)
      ability.shoot.secrete[I].hit = false;
      ability.shoot.secrete[I].time = 800; // Not predefined (Same as secrete)
      clearTimeout(ability.shoot.timeout[I]);
      ability.shoot.secrete[I].start = new Date();
      ability.shoot.secrete[I].color = org.color;

      // Hit (Apply Ability) (Hit detection on local machine)
      var src = getSrc();
      for (var _i3 = 0; _i3 < src.orgs.length; _i3++) {
         if (src.orgs[_i3].player == socket.id || src.orgs[_i3].team == org.team && typeof team == 'string') {
            // Do not apply ability to self or teammate
            continue;
         }
         for (var j = 0; j < src.orgs[_i3].count; j++) {
            if (sqrt(sq(src.orgs[_i3].cells[j].x - ability.shoot.spore[I].x) + sq(src.orgs[_i3].cells[j].y - ability.shoot.spore[I].y)) < ability.shoot.secrete[I].radius) {
               // If center of cell is within circle (subject to change)
               if (src.abilities[_i3].neutralize.value == true && sqrt(sq(src.orgs[_i3].cells[j].x - src.abilities[_i3].neutralize.x) + sq(src.orgs[_i3].cells[j].y - src.abilities[_i3].neutralize.y)) <= src.abilities[_i3].neutralize.radius) {
                  // If center of cell is within neutralize circle
                  continue;
               }
               use(I, J, src.orgs[_i3].player); // Apply ability to target
               ability.shoot.secrete[I].hit = true;
               break;
            }
         }
      }

      ability.shoot.secrete[I].value = true; // Value after hit detection so 'grow' hit detection does not run before initial
      socket.emit('Ability', ability);
      ability.shoot.secrete[I].timeout = setTimeout(function () {
         ability.shoot.secrete[I].value = false;
         ability.shoot.secrete[I].end = new Date();{
            // Copy of 'shoot' timeout
            ability.shoot.value[I] = false;
            ability.shoot.spore[I] = undefined;
            ability.shoot.cooling[I] = true;
            ability.shoot.end[I] = new Date();
         }
         clearTimeout(ability.shoot.timeout[I]);
         ability.shoot.timeout[I] = undefined;
         socket.emit('Ability', ability);
      }, ability.shoot.secrete[I].time);
   }
}

function use(I, J, playeR) {
   if (I == 0) {
      if (J == 0) {
         if (ability.extend.activated == true) {
            extend(playeR);
         }
      } else if (J == 1) {
         if (ability.compress.activated == true) {
            compress(playeR);
         } else if (ability.tag.activated == true) {
            tag(playeR);
         }
      }
   } else if (I == 1) {
      if (J == 0) {
         if (ability.immortality.activated == true) {
            immortality(playeR);
         }
      } else if (J == 1) {
         if (ability.freeze.activated == true) {
            freeze(playeR);
         }
      }
   } else if (I == 2) {
      if (J == 0) {
         if (ability.neutralize.activated == true) {
            neutralize(playeR);
         }
      } else if (J == 1) {
         if (ability.toxin.activated == true) {
            toxin(playeR);
         }
      }
   } else if (I == 3) {
      if (J == 0) {
         if (ability.spore.activated == true) {
            spore(playeR);
         }
      } else if (J == 1) {
         if (ability.secrete.activated == true) {
            secrete(playeR);
         }
      }
   }
}

function tag(playeR) {
   socket.emit('Tag', playeR);
   ability.tag.can = false;
   ability.tag.start = new Date();
   socket.emit('Ability', ability);
   setTimeout(function () {
      ability.tag.end = new Date();
      ability.tag.cooling = true;
   }, ability.tag.time);
}

function extend(playeR) {
   ability.extend.can = false;
   socket.emit('Extend', playeR);
}

function compress(playeR) {
   var src = getSrc();
   if (src.src == 'tutorial') {
      var _loop = function _loop(i) {
         if (src.abilities[i].player == playeR) {
            src.abilities[i].compress.value = true;
            clearTimeout(src.abilities[i].compress.timeout);
            src.abilities[i].compress.timeout = setTimeout(function () {
               src.abilities[i].compress.value = false;
            }, src.abilities[i].compress.time);
         }
      };

      // Since orgs are locally grown in tutorial, abilities must be locally applied
      for (var i = 0; i < src.abilities.length; i++) {
         _loop(i);
      }
   } else {
      socket.emit('Compress', playeR);
   }
   ability.compress.applied = true;
   ability.compress.can = false; // Redundancy
   ability.compress.start = new Date();
   socket.emit('Ability', ability);
   setTimeout(function () {
      ability.compress.end = new Date();
      ability.compress.applied = false;
      ability.compress.cooling = true;
   }, ability.compress.time);
}

// function speed(playeR) {
// 	socket.emit('Speed', playeR);
// }

// function slow(playeR) {
// 	socket.emit('Slow', playeR);
// }

function immortality(playeR) {
   ability.immortality.can = false;
   socket.emit('Immortality', playeR);
}

function freeze(playeR) {
   var src = getSrc();
   if (src.src == 'tutorial') {
      var _loop2 = function _loop2(i) {
         if (src.abilities[i].player == playeR) {
            src.abilities[i].freeze.value = true;
            clearTimeout(src.abilities[i].freeze.timeout);
            src.abilities[i].freeze.timeout = setTimeout(function () {
               src.abilities[i].freeze.value = false;
            }, src.abilities[i].freeze.time);
         }
      };

      // Since orgs are locally grown in tutorial, abilities must be locally applied
      for (var i = 0; i < src.abilities.length; i++) {
         _loop2(i);
      }
   } else {
      socket.emit('Freeze', playeR);
   }
   ability.freeze.applied = true;
   ability.freeze.can = false; // Redundancy
   ability.freeze.start = new Date();
   socket.emit('Ability', ability);
   setTimeout(function () {
      ability.freeze.end = new Date();
      ability.freeze.applied = false;
      ability.freeze.cooling = true;
   }, ability.freeze.time);
}

// function stimulate(playeR) {
// 	ability.stimulate.can = false;
// 	socket.emit('Stimulate', playeR);
// }

// function poison(playeR) {
// 	socket.emit('Poison', playeR);
// 	ability.poison.can = false; // Redundancy
// 	ability.poison.start = new Date();
// 	socket.emit('Ability', ability);
// 	setTimeout(() => {
// 		ability.poison.end = new Date();
// 		ability.poison.cooling = true;
// 	}, ability.poison.time);
// }

function neutralize(playeR) {
   socket.emit('Neutralize', playeR);
   ability.neutralize.can = false;
}

function toxin(playeR) {
   socket.emit('Toxin', playeR);
   ability.toxin.can = false;
}

function spore() {
   if (ability.spore.can == true) {
      // If spore is allowed
      ability.spore.value = true;
      clearTimeout(ability.spore.timeout);
      ability.spore.can = false;
      ability.secrete.can = true;
      ability.spore.start = new Date();
      var regions = getRegionInfo(org);
      ability.spore.spores = regions.exposed; // All exposed cells become spores
      ability.spore.count = ability.spore.spores.length;
      for (var i = 0; i < ability.spore.count; i++) {
         ability.spore.spores[i].color = org.color;
         ability.spore.spores[i].theta = atan((ability.spore.spores[i].y - org.y()) / (ability.spore.spores[i].x - org.x())); // Generate angle value
         if (ability.spore.spores[i].x < org.x()) {
            ability.spore.spores[i].theta += 180;
         }
         ability.spore.spores[i].speed = ability.spore.speed; // Set spore speed to constant (subject to change)
         for (var j = 0; j < org.count; j++) {
            if (ability.spore.spores[i].x == org.cells[j].x && ability.spore.spores[i].y == org.cells[j].y) {
               // Find corresponding cell to spore
               org.cells.splice(j, 1); // Remove spore cells from org
               org.count--;
               j--;
            }
         }
      }
      ability.spore.interval = function () {
         for (var _i4 = 0; _i4 < ability.spore.count; _i4++) {
            ability.spore.spores[_i4].x += ability.spore.spores[_i4].speed * cos(ability.spore.spores[_i4].theta);
            ability.spore.spores[_i4].y += ability.spore.spores[_i4].speed * sin(ability.spore.spores[_i4].theta);
         }
         socket.emit('Ability', ability);
      };
      ability.spore.timeout = setTimeout(function () {
         // End Spore
         if (ability.spore.value == true && ability.secrete.value == false) {
            // If secrete() has not been called
            ability.spore.spores = []; // Clear spores array
            ability.spore.value = false;
            ability.spore.end = new Date();
            ability.spore.cooling = true;
            socket.emit('Ability', ability);
         }
      }, ability.spore.time);
   }
}

function secrete() {
   if (ability.secrete.can == true) {
      // If not already secreting and spores are activated
      ability.secrete.value = true;
      ability.secrete.can = false;
      ability.spore.value = false;
      ability.spore.end = new Date(); // Set spore end date for secrete timer calculations
      clearTimeout(ability.secrete.timeout);
      ability.secrete.start = new Date();
      ability.secrete.color = org.color;
      socket.emit('Ability', ability);
      ability.secrete.timeout = setTimeout(function () {
         // End Secrete
         ability.secrete.value = false;
         ability.secrete.can = true;{
            // Copy of spore timeout so spore ends when secrete ends
            ability.spore.spores = []; // Clear spores array
            ability.spore.end = new Date(); // Overwrite actual end date for cooldown purposes
            ability.spore.cooling = true;
         }
         ability.secrete.end = new Date();
         socket.emit('Ability', ability);
      }, ability.secrete.time);
   }
}

function renderSpores(abilitY) {
   var src = getSrc();
   if (abilitY.spore.value == true) {
      for (var i = 0; i < abilitY.spore.count; i++) {
         var cell = abilitY.spore.spores[i];
         for (var j = 0; j < src.orgs.length; j++) {
            if (src.orgs[j].player == abilitY.player) {
               if (src.orgs[j].skin == 'circles') {
                  fill(cell.color.r, cell.color.g, cell.color.b);
                  noStroke();
                  ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
               } else if (src.orgs[j].skin == 'ghost') {
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
   for (var _i5 = 0; _i5 < 3; _i5++) {
      if (abilitY.shoot.value[_i5] == true) {
         var _cell = abilitY.shoot.spore[_i5];
         for (var _j = 0; _j < src.orgs.length; _j++) {
            if (src.orgs[_j].player == abilitY.player) {
               if (src.orgs[_j].skin == 'circles') {
                  fill(_cell.color.r, _cell.color.g, _cell.color.b);
                  noStroke();
                  ellipse(_cell.x, _cell.y, _cell.width / 2 * .8, _cell.height / 2 * .8); // .8 (default) size of spore (so as to differentiate between the two)
               } else if (src.orgs[_j].skin == 'ghost') {
                  noFill();
                  stroke(_cell.color.r, _cell.color.g, _cell.color.b);
                  strokeWeight(1);
                  rect(_cell.x, _cell.y, _cell.width * .8, _cell.height * .8);
               } else {
                  fill(_cell.color.r, _cell.color.g, _cell.color.b);
                  noStroke();
                  rect(_cell.x, _cell.y, _cell.width * .8, _cell.height * .8);
               }
            }
         }
      }
   }
}

function renderSecretions(abilitY) {
   // abilitY is src.abilities[x]
   var src = getSrc();
   for (var i = 0; i < src.orgs.length; i++) {
      if (abilitY.player == src.orgs[i].player) {
         // Identify org of abilitY
         if (abilitY.secrete.value == true) {
            for (var j = 0; j < abilitY.spore.count; j++) {
               var _spore = abilitY.spore.spores[j];
               if (src.orgs[i].skin == 'ghost') {
                  noFill();
                  stroke(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
                  strokeWeight(2);
                  ellipse(_spore.x, _spore.y, abilitY.secrete.radius);
               } else {
                  fill(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
                  noStroke();
                  ellipse(_spore.x, _spore.y, abilitY.secrete.radius);
               }
            }
         }
         for (var _j2 = 0; _j2 < abilitY.shoot.value.length; _j2++) {
            if (abilitY.shoot.secrete[_j2].value == true) {
               var _spore2 = abilitY.shoot.spore[_j2];
               if (src.orgs[i].skin == 'ghost') {
                  noFill();
                  stroke(abilitY.shoot.secrete[_j2].color.r, abilitY.shoot.secrete[_j2].color.g, abilitY.shoot.secrete[_j2].color.b);
                  strokeWeight(2);
                  ellipse(_spore2.x, _spore2.y, abilitY.shoot.secrete[_j2].radius);
               } else {
                  fill(abilitY.shoot.secrete[_j2].color.r, abilitY.shoot.secrete[_j2].color.g, abilitY.shoot.secrete[_j2].color.b);
                  noStroke();
                  ellipse(_spore2.x, _spore2.y, abilitY.shoot.secrete[_j2].radius);
               }
            }
         }
         break;
      }
   }
}

function renderNeutralize(abilitY) {
   if (abilitY.neutralize.value == true) {
      // Render neutralize (not toxin) over shoots, spores, and secretes of opponents
      fill(100);
      stroke(abilitY.neutralize.color.r, abilitY.neutralize.color.g, abilitY.neutralize.color.b);
      strokeWeight(abilitY.neutralize.weight);
      ellipse(abilitY.neutralize.x, abilitY.neutralize.y, abilitY.neutralize.radius);
   }
}

function renderToxin(abilitY) {
   if (abilitY.toxin.value == true) {
      // Toxin renders at bottom
      fill(100);
      stroke(abilitY.toxin.color.r, abilitY.toxin.color.g, abilitY.toxin.color.b);
      strokeWeight(abilitY.toxin.weight);
      ellipse(abilitY.toxin.x, abilitY.toxin.y, abilitY.toxin.radius);
   }
}

function cooldown(abilitY) {
   // abilitY is ability.xxxxx, not (games[i].)ability
   if (_typeof(abilitY.value) != 'object') {
      // If is not shoot (typeof [] == 'object')
      if (abilitY.cooling == true) {
         // If abilitY is cooling down
         var current = new Date(); // Get current time
         if (current - abilitY.end >= abilitY.cooldown) {
            // If cooldown has passed
            abilitY.can = true; // Re-enable abilitY
            abilitY.cooling = false;
            socket.emit('Ability', ability); // Update server
         }
      }
   } else {
      // If is shoot
      for (var i = 0; i < abilitY.value.length; i++) {
         if (abilitY.cooling[i] == true) {
            // If abilitY is cooling down
            var _current = new Date(); // Get current time
            if (_current - abilitY.end[i] >= abilitY.cooldown[i]) {
               // If cooldown has passed
               abilitY.can[i] = true; // Re-enable abilitY
               abilitY.cooling[i] = false;
               socket.emit('Ability', ability); // Update server
            }
         }
      }
   }
}
'use strict';

var Board = function Board(datA) {
   var data = datA;
   this.host = socket.id; // Cannot call game.info.host since game is not fully constructed yet; World() can only be called by host, so socket.id is ok
   this.list = [
      // {
      // 	player: undefined, // ID of player
      // 	name: undefined, // Screen name of player
      // 	kills: undefined, // Kills as defined by number of enemy cells killed
      // 	deaths: undefined, // Deaths as defined by number of org deaths
      // 	ratio: undefined, // Ratio of kills to deaths
      // 	score: undefined, // Flag captures (ctf), time score (kth)
      // 	wins: undefined // Round wins (srv, ctf, inf, kth)
      // }
   ], this.count = undefined;
   if (data.mode == 'skm' || data.mode == 'ctf') {
      // If is a team game
      this.show = data.teamCount; // Maximum number of players shown in leaderboard (Top __)
   } else {
      this.show = data.show;
   }
   this.x = undefined; // width - (nameWidth + oneWidth + twoWidth) / 2 - marginRight
   this.y = undefined; // marginTop
   this.marginRight = 15;
   this.marginTop = 13;
   this.text = {
      marginLeft: 5,
      marginTop: 15,
      size: 11,
      font: 'Helvetica',
      boldFont: 'Verdana',
      color: { r: 0, g: 0, b: 0 }
   };
   this.nameWidth = 170;
   this.oneWidth = 46;
   this.twoWidth = 46;
   this.threeWidth = 46;
   this.rowHeight = 22;
   this.tableWeight = 1;
   this.headWeight = 1;
   this.cellWeight = 1;
   this.headColor = { r: 200, g: 200, b: 200 };
   this.cellColor = { r: 245, g: 245, b: 245 };
   this.stroke = { r: 0, g: 0, b: 0 };
};

function orderBoard(lisT) {
   lisT.sort(function (a, b) {
      // Sorts in descending order of K:D ratio
      var N = void 0;
      if (game.info.mode == 'ffa' || game.info.mode == 'skm') {
         N = b.kills - a.kills; // If a.kills is greater than b.kills, value will be negative, so will sort a before b
         if (N == 0) {
            N = a.deaths - b.deaths; // If b.deaths is greater than a.deaths, value will be positive, so will sort b before a
         }
      } else if (game.info.mode == 'srv') {
         N = b.kills - a.kills;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (game.info.mode == 'ctf' || game.info.mode == 'kth') {
         N = b.score - a.score;
         if (N == 0) {
            N = b.wins - a.wins;
         }
      } else if (game.info.mode == 'inf') {
         N = b.wins - a.wins;
      }
      return N;
   });
   return lisT;
}

function renderLeaderboard() {
   // Leaderboard
   translate(org.off.x, org.off.y); // Settings for entire board
   rectMode(CORNER);
   game.board.y = game.board.marginTop;
   noFill();
   stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
   strokeWeight(game.board.tableWeight);
   textSize(game.board.text.size);
   textFont(game.board.text.font);
   textStyle(BOLD);
   if (game.info.mode == 'ffa') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Kills Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Deaths Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y, game.board.threeWidth, game.board.rowHeight); // Ratios Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Deaths', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('K:D', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'skm') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Team Color Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Team Kills Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Team Deaths Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y, game.board.threeWidth, game.board.rowHeight); // Team Ratio Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Team', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Deaths', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('K:D', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = game.teams.length;
   } else if (game.info.mode == 'srv') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.twoWidth, game.board.rowHeight); // Kills Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Kills', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'ctf') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Team Color Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Captures Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Team', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Score', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = game.teams.length;
   } else if (game.info.mode == 'inf') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   } else if (game.info.mode == 'kth') {
      game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
      fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
      stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
      strokeWeight(game.board.headWeight);
      rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
      rect(game.board.x + game.board.nameWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Wins Header
      rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y, game.board.oneWidth, game.board.rowHeight); // Score Header
      fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
      noStroke();
      text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Wins', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      text('Score', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
      game.board.count = min(game.board.show, game.board.list.length);
   }
   var a = 0;
   for (var i = 0; i < game.board.count; i++) {
      // Body
      if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
         // If not a team mode
         var spectator = false;
         for (var j = 0; j < game.spectators.length; j++) {
            if (game.board.list[i].player == game.spectators[j]) {
               spectator = true;
               break;
            }
         }
         if (spectator == true) {
            if (i < game.board.count) {
               if (game.board.count < game.info.count) {
                  game.board.count++; // Extend leaderboard length to include the next player
                  i++; // Do not render leaderboard status if player is a spectator
               } else {
                  continue;
               }
            }
         }
      }
      // Cell Boxes
      if (game.info.mode == 'ffa') {
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Deaths Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.threeWidth, game.board.rowHeight); // Ratios Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].kills, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].deaths, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         game.board.list[i].ratio = game.board.list[i].kills / game.board.list[i].deaths;
         if (game.board.list[i].ratio == Infinity) {
            // n / 0, n != 0 (Divide by Zero)
            text('∞', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (game.board.list[i].kills == 0 && game.board.list[i].deaths == 0) {
            // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else {
            // n / m, m != 0 (Rational Number)
            text(round(game.board.list[i].ratio * 100) / 100, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (game.info.mode == 'skm') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Team Color Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.teams[i].indexOf(org.player) != -1) {
            // If player is on given team
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Team Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Team Deaths Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.threeWidth, game.board.rowHeight); // Team Ratios Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         var teamKills = 0;
         var teamDeaths = 0;
         for (var _j = 0; _j < game.teams[i].length; _j++) {
            for (var k = 0; k < game.board.list.length; k++) {
               if (game.teams[i][_j] == game.board.list[k].player) {
                  teamKills += game.board.list[k].kills;
                  teamDeaths += game.board.list[k].deaths;
                  break;
               }
            }
         }
         var teamRatio = teamKills / teamDeaths;
         text(teamKills, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(teamDeaths, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         if (teamRatio == Infinity) {
            // n / 0, n != 0 (Divide by Zero)
            text('∞', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else if (teamKills == 0 && teamDeaths == 0) {
            // 0 / 0 (Indeterminate Form) (Ratio is NaN)
            text('0', game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         } else {
            // n / m, m != 0 (Rational Number)
            text(round(teamRatio * 100) / 100, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
         }
      } else if (game.info.mode == 'srv') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Deaths Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].kills, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'ctf') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Team Color Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.teams[i].indexOf(org.player) != -1) {
            // If player is on given team
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(teamColors[i][0].toUpperCase() + teamColors[i].slice(1), game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name is above so it renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Team Kills
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Round Wins
         // Text
         var wins = 0;
         var done = false;
         for (var _j2 = 0; _j2 < game.teams[i].length; _j2++) {
            for (var _k = 0; _k < game.board.list.length; _k++) {
               if (game.teams[i][_j2] == game.board.list[_k].player) {
                  // Find player in board list
                  wins = game.board.list[_k].wins; // Team wins saved to each player; Copy wins from one player to represent the team
                  done = true;
                  break;
               }
            }
            if (done == true) {
               break;
            }
         }
         var captures = 0;
         for (var _j3 = 0; _j3 < game.teams[i].length; _j3++) {
            for (var _k2 = 0; _k2 < game.board.list.length; _k2++) {
               if (game.teams[i][_j3] == game.board.list[_k2].player) {
                  captures += game.board.list[_k2].score;
                  break;
               }
            }
         }
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(captures, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'inf') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Kills Body
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      } else if (game.info.mode == 'kth') {
         // fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
         // noStroke();
         // rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         if (game.board.list[i].player == socket.id) {
            textFont(game.board.text.boldFont);
            textStyle(BOLD);
         } else {
            textFont(game.board.text.font);
            textStyle(NORMAL);
         }
         text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
         fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
         stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
         strokeWeight(game.board.cellWeight);
         rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.oneWidth, game.board.rowHeight); // Score
         rect(game.board.x + game.board.nameWidth + game.board.oneWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.twoWidth, game.board.rowHeight); // Wins
         // Text
         fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
         noStroke();
         text(game.board.list[i].wins, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
         text(game.board.list[i].score, game.board.x + game.board.nameWidth + game.board.oneWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
      }
      a++;
   }
   rectMode(CENTER); // Reset Mode
   translate(-org.off.x, -org.off.y);
}
'use strict';

var connections;
var clicked = {
   row: undefined,
   cell: undefined
};

function rb() {
   ReactDOM.render(React.createElement(Browser, null), document.body);
}

function renderBrowser(datA) {
   state = 'browser';
   // Browser
   if (datA != 'games') {
      cnvClear();
      var bodyDiv = document.createElement('div');
      body.appendChild(bodyDiv);
      bodyDiv.class = 'body';
      var shade = new Shade();
      bodyDiv.appendChild(shade.elt);
      var content = document.createElement('div');
      bodyDiv.appendChild(content);
      content.class = 'content';
      var table = document.createElement('table');
      content.appendChild(table);
      table.id = 'browser';
      table.style.position = 'fixed';
      table.style.left = '0px';
      table.style.top = '0px';
      table.style.width = '100%';
      var Thead = document.createElement('thead');
      table.appendChild(Thead);
      var headRow = document.createElement('tr');
      Thead.appendChild(headRow);
      headRow.id = 'head';
      headRow.style.opacity = '1';
      var tit = document.createElement('th');
      headRow.appendChild(tit);
      tit.colSpan = '1';
      tit.id = 'Title';
      tit.maxWidth = '500px';
      tit.innerHTML = 'Title';
      // let host = document.createElement('th');
      // headRow.appendChild(host);
      // host.colSpan = '1';
      // host.id = 'host';
      // host.innerHTML = 'Host';
      // let leader = document.createElement('th');
      // headRow.appendChild(leader);
      // leader.colSpan = '1';
      // leader.id = 'leader';
      // leader.innerHTML = 'Leader';
      var mode = document.createElement('th');
      headRow.appendChild(mode);
      mode.colSpan = '1';
      mode.id = 'mode';
      mode.innerHTML = 'Mode';
      var players = document.createElement('th');
      headRow.appendChild(players);
      players.colSpan = '1';
      players.id = 'players';
      players.innerHTML = 'Players';
      var spectators = document.createElement('th');
      headRow.appendChild(spectators);
      spectators.colSpan = '1';
      spectators.id = 'spectators';
      spectators.innerHTML = 'Spectators';
      var playercap = document.createElement('th');
      headRow.appendChild(playercap);
      playercap.colSpan = '1';
      playercap.id = 'playercap';
      playercap.innerHTML = 'Player Cap';
      // let hostAGame = document.createElement('th');
      // headRow.appendChild(hostAGame);
      // hostAGame.colSpan = '2';
      // hostAGame.id = 'join-spectate';
      // hostAGame.addEventListener('mouseover', function() {
      // 	hostAGame.style.backgroundColor = 'rgb(48, 48, 48)';
      // });
      // hostAGame.addEventListener('mouseout', function() {
      // 	hostAGame.style.backgroundColor = 'rgb(0, 0, 0)';
      // });
      // hostAGame.innerHTML = 'Host a Game';
      var j_s = document.createElement('th');
      headRow.appendChild(j_s);
      j_s.id = 'join-spectate';
      j_s.colSpan = '2';
      j_s.innerHTML = 'Bacter';
      j_s.style.fontSize = '22px';
      var _Tbody = document.createElement('tbody');
      table.appendChild(_Tbody);
      _Tbody.id = 'browserBody';
      _Tbody.style.opacity = '.95';
      var footerDiv = document.createElement('div');
      bodyDiv.appendChild(footerDiv);
      footerDiv.class = 'footer';
      var footer = document.createElement('footer');
      footerDiv.appendChild(footer);
      footer.style.cursor = 'pointer';
      footer.addEventListener('click', function () {
         title.return();
      });
      var back = document.createElement('p');
      footer.appendChild(back);
      back.style.display = 'inline';
      back.style.position = 'absolute';
      back.style.left = '0px';
      back.innerHTML = '&larr; Back';
      back.style.textAlign = 'left';
      var _displayConnections = document.createElement('p');
      footer.appendChild(_displayConnections);
      _displayConnections.id = 'displayConnections';
      _displayConnections.style.display = 'inline';
      _displayConnections.style.position = 'absolute';
      _displayConnections.style.right = '0px';
      _displayConnections.innerHTML = 'Online Clients: ' + connections;
      _displayConnections.style.textAlign = 'right';
      // hostAGame.style.cursor = 'pointer';
      // let baseColor = hostAGame.style.backgroundColor;
      // hostAGame.addEventListener('mouseover', function() {
      // 	if (window.mouseIsPressed == true && clicked.row == -1 && clicked.cell == 5) {
      // 		hostAGame.style.backgroundColor = 'rgb(70, 70, 70)';
      // 	}
      // });
      // hostAGame.addEventListener('mousedown', function() {
      // 	clicked.row = -1;
      // 	clicked.cell = 5;
      // 	hostAGame.style.backgroundColor = 'rgb(70, 70, 70)';
      // });
      // hostAGame.addEventListener('mouseup', function() { hostAGame.style.backgroundColor = baseColor; });
      // hostAGame.addEventListener('mouseleave', function() { hostAGame.style.backgroundColor = baseColor; });
      // hostAGame.addEventListener('click', function() {
      // 	renderMenu('create');
      // });
   }
   var displayConnections = document.getElementById('displayConnections');
   if (connections == undefined) {
      connections = 0; // Set connections as zero before retrieved from server so doesn't display 'undefined' clients
   }
   displayConnections.innerHTML = 'Online Clients: ' + connections;
   // Discrepancies between games and browser listings
   Tbody = document.getElementById('browserBody');
   var discrepancy = false;
   if (games.length != Tbody.childElementCount) {
      // Discrepancy in game count
      discrepancy = true;
      while (Tbody.childElementCount) {
         Tbody.deleteRow(-1);
      }
   } else {
      for (var i = 0; i < Tbody.childElementCount; i++) {
         var clear = false;
         if (games[i].info.title != Tbody.children[i].firstChild.innerHTML) {
            // Discrepancy in game title or host
            clear = true;
            break;
         }
         var hosted = false;
         for (var j = 0; j < games[i].board.list.length; j++) {
            if (games[i].board.list[j].player == games[i].info.host) {
               // Find host in leaderboard
               // if (Tbody.children[i].children[1].innerHTML != games[i].board.list[j].name) { // Discrepancy in host name
               // 	clear = true;
               // }
               hosted = true;
               break;
            }
         }
         if (hosted == false) {
            // If host is not in board list, clear
            clear = true;
         }
         if (modes[games[i].info.mode] != Tbody.children[i].children[1].innerHTML) {
            // Discrepancy in listed leader
            Tbody.children[i].children[1].innerHTML = modes[games[i].info.mode];
         }
         if (games[i].players.length.toString() != Tbody.children[i].children[2].innerHTML) {
            // Discrepancy in listed player count
            Tbody.children[i].children[2].innerHTML = games[i].players.length;
         }
         if (games[i].spectators.length.toString() != Tbody.children[i].children[3].innerHTML) {
            // Discrepancy in listed spectator count
            Tbody.children[i].children[3].innerHTML = games[i].spectators.length;
         }
         if (games[i].info.cap.toString() != Tbody.children[i].children[4].innerHTML) {
            // Discrepancy in listed player cap
            Tbody.children[i].children[4].innerHTML = games[i].info.cap;
         }
         if (clear == true) {
            discrepancy = true;
            while (Tbody.childElementCount) {
               Tbody.deleteRow(-1);
            }
         }
      }
   }
   if (discrepancy == true) {
      var _loop = function _loop(_i) {
         if (games[_i].players.length == 0 && games[_i].spectators.length == 0 && games[_i].info.count == 0) {
            // If host has not yet joined the game
            return 'continue';
         }
         var row = Tbody.insertRow(-1);
         row.style.height = '20px';
         var title = row.insertCell(-1);
         title.innerHTML = games[_i].info.title;
         title.style.width = '400px';
         title.style.textAlign = 'center';
         // let host = row.insertCell(-1);
         // for (let j = 0; j < games[i].board.list.length; j++) { // Search board.list
         // 	if (games[i].info.host == games[i].board.list[j].player) { // Find player who is host
         // 		host.innerHTML = games[i].board.list[j].name;
         // 		break;
         // 	}
         // }
         // host.style.width = '150px';
         // host.style.textAlign = 'center';
         // let leader = row.insertCell(-1);
         // leader.innerHTML = games[i].board.list[0].name;
         // leader.style.width = '150px';
         // leader.style.textAlign = 'center';
         var mode = row.insertCell(-1);
         mode.innerHTML = modes[games[_i].info.mode];
         mode.style.width = '250px';
         mode.style.textAlign = 'center';
         var players = row.insertCell(-1);
         players.innerHTML = games[_i].players.length;
         // players.style.width = '40px';
         players.style.textAlign = 'center';
         var spectators = row.insertCell(-1);
         spectators.innerHTML = games[_i].spectators.length;
         // spectators.style.width = '40px';
         spectators.style.textAlign = 'center';
         var playercap = row.insertCell(-1);
         playercap.innerHTML = games[_i].info.cap;
         // playercap.style.width = '40px';
         playercap.style.textAlign = 'center';
         var join = row.insertCell(-1);
         join.row = _i;
         join.innerHTML = 'Join';
         join.style.minWidth = '150px';
         join.style.textAlign = 'center';
         join.style.cursor = 'pointer';
         var baseColor = join.style.backgroundColor;
         join.addEventListener('mouseover', function () {
            if (window.mouseIsPressed == true && join.row == clicked.row && join.cellIndex == clicked.cell) {
               join.style.backgroundColor = 'rgb(180, 180, 180)';
            }
         });
         join.addEventListener('mousedown', function () {
            clicked.row = join.row;
            clicked.cell = join.cellIndex;
            join.style.backgroundColor = 'rgb(180, 180, 180)';
         });
         join.addEventListener('mouseup', function () {
            join.style.backgroundColor = baseColor;
         });
         join.addEventListener('mouseleave', function () {
            join.style.backgroundColor = baseColor;
         });
         join.addEventListener('click', function () {
            renderMenu('join', games[_i]);
         });
         var spectate = row.insertCell(-1);
         spectate.row = _i;
         spectate.innerHTML = 'Spectate';
         spectate.style.minWidth = '150px';
         spectate.style.textAlign = 'center';
         spectate.style.cursor = 'pointer';
         baseColor = spectate.style.backgroundColor;
         spectate.addEventListener('mouseover', function () {
            if (window.mouseIsPressed == true && spectate.row == clicked.row && spectate.cellIndex == clicked.cell) {
               spectate.style.backgroundColor = 'rgb(180, 180, 180)';
            }
         });
         spectate.addEventListener('mousedown', function () {
            clicked.row = spectate.row;
            clicked.cell = spectate.cellIndex;
            spectate.style.backgroundColor = 'rgb(180, 180, 180)';
         });
         spectate.addEventListener('mouseup', function () {
            spectate.style.backgroundColor = baseColor;
         });
         spectate.addEventListener('mouseleave', function () {
            spectate.style.backgroundColor = baseColor;
         });
         spectate.addEventListener('click', function () {
            renderMenu('spectate', games[_i]);
         });
      };

      for (var _i = 0; _i < games.length; _i++) {
         var _ret = _loop(_i);

         if (_ret === 'continue') continue;
      }
   }
}
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Browser = function (_React$Component) {
   _inherits(Browser, _React$Component);

   function Browser() {
      _classCallCheck(this, Browser);

      return _possibleConstructorReturn(this, (Browser.__proto__ || Object.getPrototypeOf(Browser)).apply(this, arguments));
   }

   _createClass(Browser, [{
      key: "render",
      value: function render() {
         return React.createElement(
            "table",
            null,
            "a"
         );
      }
   }]);

   return Browser;
}(React.Component);

;
'use strict';

var DEV = false;
var HEROKU = false;

// Repertoires
var worldColors = {
	black: { r: 0, g: 0, b: 0 },
	white: { r: 230, g: 230, b: 230 },
	blue: { r: 247, g: 250, b: 255 }
};
var orgColors = {
	black: {
		fire: { r: 255, g: 90, b: 81 },
		camel: { r: 232, g: 183, b: 155 },
		clay: { r: 232, g: 145, b: 95 },
		sun: { r: 255, g: 246, b: 86 },
		leaf: { r: 125, g: 255, b: 200 },
		lime: { r: 57, g: 249, b: 86 },
		sky: { r: 48, g: 210, b: 255 },
		lake: { r: 142, g: 182, b: 255 },
		ocean: { r: 102, g: 136, b: 244 },
		royal: { r: 175, g: 132, b: 255 },
		petal: { r: 250, g: 122, b: 255 },
		hot: { r: 232, g: 2, b: 216 }
	},
	white: {
		fire: { r: 240, g: 75, b: 66 },
		camel: { r: 232, g: 183, b: 155 },
		clay: { r: 232, g: 145, b: 95 },
		burnt: { r: 196, g: 99, b: 19 },
		lime: { r: 57, g: 249, b: 86 },
		forest: { r: 0, g: 114, b: 38 },
		peacock: { r: 16, g: 143, b: 147 },
		sky: { r: 48, g: 210, b: 255 },
		lake: { r: 104, g: 157, b: 255 },
		ocean: { r: 102, g: 136, b: 244 },
		royal: { r: 175, g: 132, b: 255 },
		petal: { r: 250, g: 122, b: 255 },
		hot: { r: 232, g: 2, b: 216 }
	}
};
var skins = ['grid', 'circles', 'ghost'];
var modes = {
	ffa: 'Free for All',
	skm: 'Skirmish',
	srv: 'Survival',
	ctf: 'Capture the Flag',
	inf: 'Infection',
	kth: 'King of the Hill'
};
var teamColors = ['red', 'blue', 'green', 'pink'];
var teamColorDef = {
	red: 'fire',
	blue: 'sky',
	green: 'lime',
	pink: 'petal'
};

// Math
var cos45 = 0.70710678118;
var root2 = 1.41421356;

// Defaults
var _ofrequency = 70;
var _rfrequency = 40;
var _range = 50;
var _cellwidth = 6;
var _movespeed = 1.7;
var _spectatespeed = 2.5;
var _worldwidth = 800;
var _worldheight = 800;
var _playercap = 16;
var _playermin = 4;
var _boardlength = 10;
var _teamcount = 2;
var _delaytime = 10000;
var _dummies = 10;
var _margin = 25;
var _taskdelay = 3000;

// Settings
var Labels = true;
var Messages = true;
var Controls = {
	left1: {
		key: 'A',
		code: 65
	},
	left2: {
		key: '←',
		code: 37
	},
	up1: {
		key: 'W',
		code: 87
	},
	up2: {
		key: '↑',
		code: 38
	},
	right1: {
		key: 'D',
		code: 68
	},
	right2: {
		key: '→',
		code: 39
	},
	down1: {
		key: 'S',
		code: 83
	},
	down2: {
		key: '↓',
		code: 40
	},
	ability1: {
		key: 'X',
		code: 88
	},
	ability2: {
		key: 'C',
		code: 67
	},
	ability3: {
		key: 'V',
		code: 86
	},
	ability4: {
		key: ' ',
		code: 32
	},
	respawn: {
		key: 'R',
		code: 82
	},
	pause: {
		key: 'ESC',
		code: 27
	}
};
"use strict";

var Flag = function Flag(X, Y, coloR) {
   this.x = X;
   this.y = Y;
   this.color = coloR;
   this.carried = false; // True: flag is being carried by a player; False: flag is dropped
   this.carrier = undefined;
   this.height = 20;
   this.width = 9;
};
'use strict';

var game; // Initialize in global scope
var Game = function Game(datA) {
   var data = datA;
   this.src = 'game';
   this.players = [];{
      // Info
      this.info = {
         host: socket.id,
         title: data.title,
         protected: undefined,
         count: 0,
         cap: data.cap,
         mode: data.mode,
         teamCount: data.teamCount
      };
      if (data.password == '' || data.password == undefined || data.password == null || data.password !== data.password) {
         this.info.protected = false;
      } else {
         this.info.protected = true;
      }
   }{
      // Teams
      this.teams = [];
      if (this.info.mode == 'skm' || this.info.mode == 'ctf') {
         for (var i = 0; i < this.info.teamCount; i++) {
            this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
         }
      } else if (this.info.mode == 'inf') {
         for (var _i = 0; _i < 2; _i++) {
            // Only can be two teams in infection (healthy/infected)
            this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
         }
      }
   }{
      // Rounds
      this.rounds = {
         host: undefined, // Identification purposes
         util: false, // If game utilizes rounds
         waiting: true,
         delayed: false,
         delaystart: undefined,
         delaytime: _delaytime,
         start: undefined,
         min: undefined, // Min players
         winner: undefined
      };
      if (this.info.mode == 'srv' || this.info.mode == 'ctf' || this.info.mode == 'inf' || this.info.mode == 'kth') {
         this.rounds.util = true;
         this.rounds.host = this.info.host;
         this.rounds.min = data.min;
         this.rounds.waiting = true;
      }
   }
   this.board = new Board(data);
   this.world = new World(data);
   if (this.info.mode == 'ctf') {
      this.flag = new Flag(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.border.color);
   }
   this.players = [];
   this.spectators = [];
   this.orgs = [];
   this.abilities = [];
   // { // Dots
   //   for (let i = 0; i < game.world.width; i++) {
   //      if (random() < game.world.dots.prob) { // About every five pixels, draw dot
   //         let dot = {
   //            i: game.world.dots.array.length, 
   //            r: random(game.world.dots.r.min, game.world.dots.r.max), 
   //            x: i, 
   //            y: random(0, game.world.height)
   //         };
   //         game.world.dots.array.push(dot);
   //      }
   //   }
   //   game.world.dots.count = game.world.dots.array.length;
   // }
};

function createGame(datA) {
   game = new Game(datA);
   socket.emit('Game Created', game);
   if (game.info.protected == true) {
      socket.emit('Password Created', { pass: datA.password, info: game.info });
   }
   renderMenu('join', game);
}
'use strict';

var games = [];
var defaultCanvas;
var state;

function setup() {
   state = 'setup';
   connectSocket();{
      rectMode(CENTER);
      ellipseMode(RADIUS);
      angleMode(DEGREES);
      textAlign(LEFT);
   }
   var socketInterval = setInterval(function () {
      ability = new Ability({ player: socket.id });
      if (socket.id != undefined) {
         clearInterval(socketInterval);
      }
   }, 50);
   renderTitle();
}

function windowResized() {
   var button;
   if (state == 'title' || state == 'browser' || state == 'tutorial') {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      getSrc().resize(0, 0, window.innerWidth, window.innerHeight);
   } else if (state == 'game' || state == 'spectate') {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
      org.off.y = org.pos.y - center.y;
   } else if (state.indexOf('Menu') != -1) {
      cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
      center.x = width / 2;
      center.y = height / 2;
      if (state == 'respawnMenu' || state.indexOf('pause') != -1) {
         org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly
         org.off.y = org.pos.y - center.y;
      }
      if (getSrc().src == 'title' || getSrc().src == 'tutorial') {
         cnv = createCanvas(window.innerWidth, window.innerHeight); // Replace canvas with new canvas of new dimensions
         center.x = width / 2;
         center.y = height / 2;
         getSrc().resize(0, 0, window.innerWidth, window.innerHeight);
      }
      var shade = document.getElementById('shade');
      shade.style.width = '100%';
      shade.style.height = '100%';
      button = document.getElementById(state.slice(0, state.indexOf('Menu')) + 'Button'); // Button ids must follow this style
      button.style.left = (window.innerWidth - parseFloat(button.style.width)) / 2 + 'px';
   }
}
'use strict';

var cnv; // Initialize in global scope
var center = {}; // Initialize in global scope
function initialize(gamE, datA) {
   state = 'initialize';

   // Clear Body
   var page = document.body.parentNode;
   page.removeChild(document.body);
   body = document.createElement('body');
   page.appendChild(body);

   // Apply Canvas Styling
   body.style.overflow = 'hidden';
   body.style.margin = '0px';
   body.style.border = '0px';
   body.style.padding = '0px';

   // Initialize Game
   cnv = createCanvas(window.innerWidth, window.innerHeight);
   canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
   canvas.style.visibility = 'visible';
   body.appendChild(canvas);
   center = {
      x: width / 2,
      y: height / 2
   };

   game = gamE;
   if (datA.spectate != true) {
      // Field can be left undefined
      spawn({ color: datA.color, skin: datA.skin, team: datA.team });
   } else if (datA.spectate == true) {
      spectate({ color: datA.color, skin: datA.skin, team: datA.team });
   }
}
'use strict';

function itemize(iteM, widtH, coloR, X, Y) {
   var item = iteM; // Directional array
   var count = item.length; // Number of squares
   var width = widtH; // Width of one square
   var color = coloR; // Object containing r, g, and b values
   var x = X; // Starting x
   var y = Y; // Starting y
   fill(color.r, color.g, color.b);
   noStroke();
   rect(x, y, width, width);
   for (var i = 0; i < count; i++) {
      if (item[i] == 'l') {
         x -= width;
      } else if (item[i] == 'u') {
         y -= width;
      } else if (item[i] == 'r') {
         x += width;
      } else if (item[i] == 'd') {
         y += width;
      }
      rect(x, y, width, width);
   }
}

var items = {
   tag: ['u', 'l', 'd', 'l', 'l', 'r', 'r', 'd', 'r', 'd', 'd', 'u', 'u', 'r', 'u', 'r', 'r', 'l', 'l', 'u', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'd', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'd', 'l', 'l', 'l', 'u', 'r', 'u', 'u', 'u', 'u', 'u', 'u', 'l', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'r', 'd', 'd', 'l', 'l', 'd', 'l', 'u', 'l', 'd', 'l', 'u', 'l', 'd', 'l', 'u', 'l', 'd', 'u', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'r', 'u', 'r', 'r', 'r', 'd', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'r'],
   extend: ['d', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'd', 'd', 'd', 'l', 'u', 'u', 'u', 'u', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'd', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'd', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'l', 'u', 'u', 'u', 'u', 'd', 'l', 'd', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'r', 'd', 'r', 'u', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'd', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'd', 'r', 'd', 'd'],
   compress: ['l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'u', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'd', 'r', 'd', 'd', 'd', 'd', 'd', 'd', 'u', 'r', 'u', 'u', 'u', 'u', 'd', 'r', 'd', 'd', 'r', 'd', 'u', 'u', 'u', 'u', 'r', 'u', 'd', 'd', 'd', 'd', 'd', 'd', 'r', 'd', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'u', 'r', 'u', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'r', 'd', 'r', 'u', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'r', 'd', 'd', 'd', 'd', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u', 'r', 'd', 'd', 'd', 'd', 'r', 'u', 'u', 'u', 'u'],
   // speed: [], 
   // slow: [], 
   immortality: ['d', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'l', 'd', 'd', 'r', 'l', 'l', 'd', 'l', 'l', 'u', 'r', 'r', 'u', 'l', 'l', 'l', 'd', 'l', 'u', 'r', 'u', 'l', 'l', 'd', 'u', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'r', 'r', 'r', 'u', 'l', 'l', 'r', 'u', 'r', 'r', 'u', 'd', 'd', 'r', 'u', 'u', 'r', 'd', 'd', 'r', 'u', 'r', 'd', 'd', 'l', 'r', 'r', 'u', 'd', 'r', 'd', 'l', 'r', 'r', 'd', 'l', 'r', 'd', 'r', 'u', 'r', 'd', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'd', 'u', 'u', 'r', 'u', 'r', 'd', 'd', 'l', 'r', 'u', 'r', 'u', 'u', 'r', 'd', 'd', 'r', 'u', 'u', 'd', 'r', 'r', 'd', 'l', 'd', 'r', 'r', 'u', 'd', 'd', 'r', 'u', 'd', 'r', 'd', 'l', 'r', 'r', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'r', 'l', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'd', 'd', 'l', 'u', 'u', 'd', 'l', 'd', 'd', 'l', 'u', 'u', 'l', 'd', 'd', 'u', 'l', 'u', 'u', 'l', 'd', 'd', 'u', 'l', 'u', 'u', 'l', 'd', 'u', 'u', 'l', 'd', 'u', 'u'],
   freeze: ['r', 'r', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'r', 'r', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'd', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'd', 'd', 'r', 'u', 'r', 'd', 'r', 'd', 'l', 'r', 'r', 'd', 'l', 'd', 'r', 'r', 'd', 'l', 'd', 'r', 'd', 'r', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'r', 'l', 'd', 'l', 'd', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'd', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'l', 'l', 'l', 'd', 'l', 'u', 'l', 'd', 'l', 'u', 'l', 'd', 'u', 'u', 'l', 'd', 'l', 'u', 'l', 'd', 'u', 'u', 'l', 'd', 'l', 'u', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'u', 'l', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'r', 'u', 'r', 'u', 'l', 'u', 'r'],
   // stimulate: ['r', 'r', 'u', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 'u', 'u', 'r', 'u', 'u', 'l', 'u', 'l', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'u', 'l', 'u', 'l', 'u', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'u', 'd', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'd', 'l', 'u', 'l', 'l', 'd', 'l', 'd', 'l', 'd', 'd', 'l', 'u'], 
   // poison: ['l', 'l', 'l', 'l', 'l', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'd', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'l', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'r', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'l'], 
   neutralize: ['r', 'r', 'u', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'u', 'u', 'u', 'r', 'u', 'u', 'l', 'u', 'l', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'r', 'd', 'u', 'l', 'u', 'l', 'u', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'u', 'd', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'd', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'd', 'l', 'u', 'l', 'l', 'd', 'l', 'd', 'l', 'd', 'd', 'l', 'u'],
   toxin: ['l', 'l', 'l', 'l', 'l', 'l', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'd', 'l', 'd', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'd', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'r', 'r', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'l', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'u', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'l', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'r', 'u', 'u', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'r', 'l', 'l', 'u', 'l', 'l', 'l', 'l', 'l'], // Same as stimulate
   spore: ['u', 'l', 'u', 'u', 'l', 'u', 'l', 'u', 'u', 'u', 'u', 'r', 'u', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'l', 'l', 'd', 'l', 'l', 'd', 'r', 'l', 'l', 'd', 'r', 'd', 'l', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'r', 'd', 'l', 'r', 'd', 'r', 'd', 'l', 'd', 'r', 'r', 'd', 'l', 'r', 'r', 'd', 'l', 'r', 'r', 'r', 'd', 'l', 'l', 'r', 'r', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'u', 'r', 'r', 'r', 'u', 'l', 'l', 'r', 'r', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'u', 'r', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'l', 'u', 'l', 'u', 'r', 'u', 'l', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'l', 'l', 'l', 'u', 'l', 'l', 'l', 'd', 'd', 'd', 'd', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'd', 'd', 'd', 'd', 'l', 'd', 'l', 'd', 'd', 'r', 'r', 'u', 'r', 'u', 'r', 'r', 'r', 'r', 'd', 'd', 'd', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'd', 'd', 'd', 'l', 'l', 'l', 'l', 'u', 'l', 'u', 'l', 'l', 'd', 'd', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'd', 'd', 'd', 'd', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'r', 'u', 'r', 'u', 'u', 'l', 'l', 'd', 'l', 'd', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'd', 'r', 'd', 'r', 'r', 'd', 'd', 'r', 'r', 'u', 'u', 'l'],
   secrete: ['u', 'l', 'u', 'u', 'l', 'u', 'l', 'u', 'u', 'u', 'u', 'r', 'u', 'r', 'r', 'r', 'r', 'd', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'l', 'd', 'l', 'r', 'r', 'r', 'l', 'l', 'd', 'l', 'l', 'd', 'r', 'l', 'l', 'd', 'r', 'd', 'l', 'd', 'l', 'd', 'r', 'd', 'l', 'd', 'r', 'd', 'l', 'r', 'd', 'r', 'd', 'l', 'd', 'r', 'r', 'd', 'l', 'r', 'r', 'd', 'l', 'r', 'r', 'r', 'd', 'l', 'l', 'r', 'r', 'r', 'd', 'r', 'u', 'r', 'd', 'r', 'u', 'r', 'd', 'u', 'r', 'r', 'r', 'u', 'l', 'l', 'r', 'r', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'r', 'r', 'u', 'l', 'u', 'r', 'u', 'r', 'u', 'l', 'u', 'r', 'u', 'l', 'u', 'r', 'l', 'u', 'l', 'u', 'r', 'u', 'l', 'l', 'u', 'r', 'l', 'l', 'u', 'r', 'l', 'l', 'l', 'u', 'l', 'l', 'l', 'd', 'd', 'd', 'd', 'u', 'u', 'u', 'u', 'r', 'r', 'r', 'd', 'd', 'd', 'd', 'l', 'd', 'l', 'd', 'd', 'r', 'r', 'u', 'r', 'u', 'r', 'r', 'r', 'r', 'd', 'd', 'd', 'l', 'l', 'l', 'l', 'r', 'r', 'r', 'r', 'd', 'd', 'd', 'l', 'l', 'l', 'l', 'u', 'l', 'u', 'l', 'l', 'd', 'd', 'r', 'd', 'r', 'd', 'd', 'd', 'd', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'd', 'd', 'd', 'd', 'l', 'l', 'l', 'u', 'u', 'u', 'u', 'r', 'u', 'r', 'u', 'u', 'l', 'l', 'd', 'l', 'd', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'l', 'l', 'l', 'l', 'u', 'u', 'u', 'r', 'r', 'r', 'r', 'd', 'r', 'd', 'r', 'r', 'd', 'd', 'r', 'r', 'u', 'u', 'l'] // Same as spore (Should not differ)
};
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var menus = {
   width: 900,
   top: 0,
   padding: 0,
   color: { r: 240, g: 240, b: 240 },
   header: {
      padding: 9,
      height: 32,
      backgroundColor: { r: 0, g: 0, b: 0 },
      color: { r: 255, g: 255, b: 255 },
      font: 'Verdana',
      size: 16,
      weight: 'bold'
   },
   rows: {
      height: 21,
      color: { r: 255, g: 255, b: 255 },
      margin: 0,
      padding: 0
   },
   cells: {
      count: 2,
      margin: 0,
      padding: 5,
      border: {
         color: { r: 0, g: 0, b: 0 },
         width: 0,
         style: 'solid'
      }
   },
   text: {
      color: { r: 0, g: 0, b: 0 },
      font: 'Georgia, serif',
      size: 15
   },
   inputs: {
      color: { r: 0, g: 0, b: 0 },
      backgroundColor: { r: 230, g: 230, b: 230 },
      border: {
         color: { r: 50, g: 50, b: 50 },
         width: 2,
         radius: 3,
         style: 'solid'
      },
      width: 100,
      height: 26,
      font: 'serif',
      size: 14
   },
   radios: {
      width: 16,
      height: 18,
      backgroundColor: { r: 255, g: 255, b: 255 },
      selectColor: { r: 190, g: 190, b: 190 }
   },
   border: {
      color: { r: 0, g: 0, b: 0 },
      width: 0,
      style: 'solid'
   },
   button: {
      width: 95,
      height: 33,
      backgroundColor: { r: 240, g: 240, b: 240 },
      color: { r: 0, g: 0, b: 0 },
      font: 'Gerogia, serif',
      size: 16,
      weight: 'bold',
      top: 20,
      borderRadius: 2
   },
   footer: {
      backgroundColor: { r: 0, g: 0, b: 0 },
      color: { r: 255, g: 255, b: 255 },
      height: 30,
      font: 'Verdana',
      size: 15
   },
   create: {
      header: {
         text: 'Game Creation Options'
      },
      button: {
         text: 'Create'
      },
      options: ['Game Title', 'Password', 'World Type', 'World Width', 'World Height', 'Player Cap', 'Leaderboard Length', 'Game Mode'], // Team count not included because ffa is default
      values: ['text', 'text', 'list', 'number', 'number', 'number', 'number', 'list'],
      units: [undefined, undefined, 'px', 'px'],
      editNums: function editNums() {
         {
            // World Width and Height
            var widthInput = document.getElementById('World Width Input');
            var heightInput = document.getElementById('World Height Input');
            if (widthInput != null && heightInput != null) {
               // Prevents listener stacking
               widthInput.placeholder = _worldwidth;
               heightInput.placeholder = _worldheight;
               var modeInput = document.getElementById('Game Mode Input');
               if (modeInput.value == 'ctf') {
                  widthInput.min = 700;
                  heightInput.min = 700;
               } else {
                  widthInput.min = 300;
                  heightInput.min = 300;
               }
               widthInput.max = 100000;
               heightInput.max = 100000;
               var wmin = parseFloat(widthInput.min);
               var wmax = parseFloat(widthInput.max);
               var hmin = parseFloat(heightInput.min);
               var hmax = parseFloat(heightInput.max);
               widthInput.addEventListener('change', function () {
                  if (parseFloat(widthInput.value) < wmin) {
                     widthInput.value = wmin;
                  } else if (parseFloat(widthInput.value) > wmax) {
                     widthInput.value = wmax;
                  }
                  if (parseFloat(widthInput.value) != parseFloat(heightInput.value)) {
                     heightInput.value = parseFloat(widthInput.value);
                  }
               });
               heightInput.addEventListener('change', function () {
                  if (parseFloat(heightInput.value) < hmin) {
                     heightInput.value = hmin;
                  } else if (parseFloat(heightInput.value) > hmax) {
                     heightInput.value = hmax;
                  }
                  if (parseFloat(widthInput.value) != parseFloat(heightInput.value)) {
                     widthInput.value = parseFloat(heightInput.value);
                  }
               });
            }
         }{
            // Player Cap
            var pcInput = document.getElementById('Player Cap Input');
            if (pcInput != null) {
               // Prevents listener stacking
               pcInput.placeholder = _playercap;
               pcInput.min = 2;
               pcInput.addEventListener('change', function () {
                  if (parseFloat(pcInput.value) < parseFloat(pcInput.min)) {
                     pcInput.value = parseFloat(pcInput.min);
                  }
               });
            }
         }{
            // Player Minimum
            var pmInput = document.getElementById('Player Minimum Input');
            if (pmInput != null) {
               pmInput.placeholder = _playermin;
               pmInput.min = 2;
               pmInput.addEventListener('change', function () {
                  if (pmInput != null) {
                     if (parseFloat(pmInput.value) < parseFloat(pmInput.min)) {
                        pmInput.value = parseFloat(pmInput.min);
                     }
                     var _tcInput = document.getElementById('Team Count Input');
                     if (_tcInput != null) {
                        if (parseFloat(_tcInput.value) > parseFloat(pmInput.value) || pmInput.value == '') {
                           pmInput.value = parseFloat(_tcInput.value);
                        }
                     }
                  }
               });
            }
         }{
            // Leaderboard Length
            var boardLengthInput = document.getElementById('Leaderboard Length Input');
            if (boardLengthInput != null) {
               boardLengthInput.placeholder = _boardlength;
               boardLengthInput.min = 1;
               boardLengthInput.max = 20;
               boardLengthInput.addEventListener('change', function () {
                  if (boardLengthInput != null) {
                     if (parseFloat(boardLengthInput.value) < parseFloat(boardLengthInput.min)) {
                        boardLengthInput.value = parseFloat(boardLengthInput.min);
                     } else if (parseFloat(boardLengthInput.value) > parseFloat(boardLengthInput.max)) {
                        boardLengthInput.value = parseFloat(boardLengthInput.max);
                     }
                     if (parseFloat(boardLengthInput.value) % 1 != 0) {
                        // If length is not an integer
                        boardLengthInput.value = floor(parseFloat(boardLengthInput.value));
                     }
                  }
               });
            }
         }{
            // Team Count
            var _tcInput2 = document.getElementById('Team Count Input');
            if (_tcInput2 != null) {
               _tcInput2.placeholder = _teamcount;
               _tcInput2.min = 2;
               _tcInput2.max = teamColors.length; // = 4
               _tcInput2.addEventListener('change', function () {
                  if (_tcInput2 != null) {
                     if (parseFloat(_tcInput2.value) < parseFloat(_tcInput2.min)) {
                        _tcInput2.value = parseFloat(_tcInput2.min);
                     } else if (parseFloat(_tcInput2.value) > parseFloat(_tcInput2.max)) {
                        _tcInput2.value = parseFloat(_tcInput2.max);
                     }
                     if (parseFloat(_tcInput2.value) % 1 != 0) {
                        // If length is not an integer
                        _tcInput2.value = floor(parseFloat(_tcInput2.value));
                     }
                     var _pmInput = document.getElementById('Player Minimum Input');
                     if (_pmInput != null) {
                        if (parseFloat(_tcInput2.value) > parseFloat(_pmInput.value) || _pmInput.value == '') {
                           _pmInput.value = parseFloat(_tcInput2.value);
                        }
                     }
                  }
               });
            }
         }
      },
      editLists: function editLists() {
         {
            // World Type
            var wtInput = document.getElementById('World Type Input');
            if (wtInput != null) {
               // Prevents listener stacking
               var rectOption = document.createElement('option');
               wtInput.appendChild(rectOption);
               rectOption.value = 'Rectangle';
               rectOption.selected = 'selected';
               rectOption.innerHTML = 'Square';
               var ellipseOption = document.createElement('option');
               wtInput.appendChild(ellipseOption);
               ellipseOption.value = 'Ellipse';
               ellipseOption.innerHTML = 'Circle';
            }
         }
         // { // World Color
         // 	let worldColorInput = document.getElementById('World Color Input');
         // 	let blackOption = document.createElement('option');
         // 	worldColorInput.appendChild(blackOption);
         // 	blackOption.value = 'Black';
         // 	blackOption.selected = 'selected';
         // 	blackOption.style.backgroundColor = 'rgb(0, 0, 0)';
         // 	blackOption.style.color = 'rgb(255, 255, 255)';
         // 	blackOption.innerHTML = 'Black';
         // 	let whiteOption = document.createElement('option');
         // 	worldColorInput.appendChild(whiteOption);
         // 	whiteOption.value = 'White';
         // 	whiteOption.style.backgroundColor = 'rgb(255, 255, 255)';
         // 	whiteOption.style.color = 'rgb(0, 0, 0)';
         // 	whiteOption.innerHTML = 'White';
         // }
         {
            // Game Mode
            var modeInput = document.getElementById('Game Mode Input');
            if (modeInput != null) {
               // Prevents listener stacking
               var ffaOption = document.createElement('option');
               ffaOption.value = 'ffa';
               ffaOption.selected = 'selected';
               ffaOption.innerHTML = 'Free for All';
               modeInput.appendChild(ffaOption);
               var skmOption = document.createElement('option');
               skmOption.value = 'skm';
               skmOption.innerHTML = 'Skirmish';
               modeInput.appendChild(skmOption);
               var srvOption = document.createElement('option');
               srvOption.value = 'srv';
               srvOption.innerHTML = 'Survival';
               modeInput.appendChild(srvOption);
               var ctfOption = document.createElement('option');
               ctfOption.value = 'ctf';
               ctfOption.innerHTML = 'Capture the Flag';
               ctfOption.disabled = 'disabled';
               modeInput.appendChild(ctfOption);
               var infOption = document.createElement('option');
               infOption.value = 'inf';
               infOption.innerHTML = 'Infection';
               infOption.disabled = 'disabled';
               modeInput.appendChild(infOption);
               var kthOption = document.createElement('option');
               kthOption.value = 'kth';
               kthOption.innerHTML = 'King of the Hill';
               kthOption.disabled = 'disabled';
               modeInput.appendChild(kthOption);
               modeInput.addEventListener('change', function () {
                  // Leaderboard Length & Team Count
                  if (modeInput.value == 'ctf') {
                     // Set world width and height
                     var widthInput = document.getElementById('World Width Input');
                     var heightInput = document.getElementById('World Height Input');
                     var _width = parseFloat(widthInput.value);
                     var _height = parseFloat(widthInput.value);
                     var wmin = 700;
                     var hmin = 700;
                     if (_width < wmin || _height < hmin) {
                        widthInput.value = wmin;
                        heightInput.value = hmin;
                     }
                  }
                  if (modeInput.value == 'skm' || modeInput.value == 'ctf') {
                     // If team game
                     if (document.getElementById('Leaderboard Length Input') != null) {
                        // If leaderboard length input is present
                        var row = document.getElementById('Leaderboard Length Input').parentNode.parentNode;
                        row.parentNode.removeChild(row); // Remove Leaderboard Length option
                        var rows = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var i = 0; i < rows.length; i++) {
                           var _row = rows[i];
                           _row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (i % 2 == 0) {
                              _row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                     if (document.getElementById('Team Count Input') == null) {
                        // If team count input not present
                        var _modeInput = document.getElementById('Game Mode Input'); // Create Team Count Option
                        var modeCell = _modeInput.parentNode;
                        var modeRow = modeCell.parentNode;
                        var tableBody = modeRow.parentNode;
                        var _row2 = document.createElement('tr');
                        tableBody.insertBefore(_row2, modeRow);
                        left = document.createElement('td');
                        _row2.appendChild(left);
                        left.style.margin = menus.cells.margin + 'px';
                        left.style.padding = menus.cells.padding + 'px';
                        left.style.width = menus.width / 2 + 'px';
                        left.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        left.style.borderWidth = menus.cells.border.width + 'px';
                        left.style.borderStyle = menus.cells.border.style;
                        left.style.textAlign = 'right';
                        left.innerHTML = 'Team Count';
                        right = document.createElement('td');
                        _row2.appendChild(right);
                        right.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        right.style.borderWidth = menus.cells.border.width + 'px';
                        right.style.borderStyle = menus.cells.border.style;
                        tcInput = document.createElement('input');
                        right.appendChild(tcInput);
                        tcInput.id = 'Team Count Input';
                        tcInput.style.width = menus.inputs.width + 'px';
                        tcInput.style.height = menus.inputs.height + 'px';
                        tcInput.type = 'number';
                        tcInput.value = '';
                        tcInput.style.autocomplete = 'on';
                        tcInput.style.boxSizing = 'border-box';
                        tcInput.style.textAlign = 'center';
                        tcInput.style.fontFamily = menus.inputs.font;
                        tcInput.style.fontSize = menus.inputs.size + 'px';
                        tcInput.style.outline = 'none';
                        tcInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        tcInput.style.borderWidth = '0px';
                        tcInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
                        tcInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
                        tcInput.style.borderRadius = menus.inputs.border.radius + 'px';
                        tcInput.addEventListener('focus', function () {
                           tcInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
                        });
                        tcInput.addEventListener('focusout', function () {
                           tcInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        });
                        menus.create.editNums();
                        var _rows = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var _i = 0; _i < _rows.length; _i++) {
                           var _row3 = _rows[_i];
                           _row3.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (_i % 2 == 0) {
                              _row3.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                  } else {
                     // If not a team game
                     if (document.getElementById('Leaderboard Length Input') == null) {
                        // If leaderboard length input is not present
                        var _modeCell = modeInput.parentNode; // Create Leaderboard Length Option
                        var _modeRow = _modeCell.parentNode;
                        var _tableBody = _modeRow.parentNode;
                        var _row4 = document.createElement('tr');
                        _tableBody.insertBefore(_row4, _modeRow);
                        left = document.createElement('td');
                        _row4.appendChild(left);
                        left.style.margin = menus.cells.margin + 'px';
                        left.style.padding = menus.cells.padding + 'px';
                        left.style.width = menus.width / 2 + 'px';
                        left.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        left.style.borderWidth = menus.cells.border.width + 'px';
                        left.style.borderStyle = menus.cells.border.style;
                        left.style.textAlign = 'right';
                        left.innerHTML = 'Leaderboard Length';
                        right = document.createElement('td');
                        _row4.appendChild(right);
                        right.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        right.style.borderWidth = menus.cells.border.width + 'px';
                        right.style.borderStyle = menus.cells.border.style;
                        lengthInput = document.createElement('input');
                        right.appendChild(lengthInput);
                        lengthInput.id = 'Leaderboard Length Input';
                        lengthInput.style.width = menus.inputs.width + 'px';
                        lengthInput.style.height = menus.inputs.height + 'px';
                        lengthInput.type = 'number';
                        lengthInput.value = '';
                        lengthInput.style.autocomplete = 'on';
                        lengthInput.style.boxSizing = 'border-box';
                        lengthInput.style.textAlign = 'center';
                        lengthInput.style.fontFamily = menus.inputs.font;
                        lengthInput.style.fontSize = menus.inputs.size + 'px';
                        lengthInput.style.outline = 'none';
                        lengthInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        lengthInput.style.borderWidth = '0px';
                        lengthInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
                        lengthInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
                        lengthInput.style.borderRadius = menus.inputs.border.radius + 'px';
                        lengthInput.addEventListener('focus', function () {
                           lengthInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
                        });
                        lengthInput.addEventListener('focusout', function () {
                           lengthInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        });
                        menus.create.editNums();
                        var _rows2 = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var _i2 = 0; _i2 < _rows2.length; _i2++) {
                           var _row5 = _rows2[_i2];
                           _row5.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (_i2 % 2 == 0) {
                              _row5.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                     if (document.getElementById('Team Count Input') != null) {
                        // If team count input is not present
                        var _tcInput3 = document.getElementById('Team Count Input'); // Remove Team Count Option
                        var cell = _tcInput3.parentNode;
                        var _row6 = cell.parentNode;
                        _row6.parentNode.removeChild(_row6);
                        var _rows3 = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var _i3 = 0; _i3 < _rows3.length; _i3++) {
                           var _row7 = _rows3[_i3];
                           _row7.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (_i3 % 2 == 0) {
                              _row7.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                  }
                  // Player Minimum
                  var pmInput = document.getElementById('Player Minimum Input');
                  if (modeInput.value == 'ffa' || modeInput.value == 'skm') {
                     if (pmInput != null) {
                        // If player minimum option is present
                        var _cell = pmInput.parentNode; // Remove player minimum option
                        var _row8 = _cell.parentNode;
                        _row8.parentNode.removeChild(_row8);
                        var _rows4 = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var _i4 = 0; _i4 < _rows4.length; _i4++) {
                           var _row9 = _rows4[_i4];
                           _row9.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (_i4 % 2 == 0) {
                              _row9.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                  } else if (modeInput.value == 'srv' || modeInput.value == 'ctf' || modeInput.value == 'inf' || modeInput.value == 'kth') {
                     if (pmInput == null) {
                        // If player minimum option is not present
                        var capInput = document.getElementById('Player Cap Input'); // Add player minimum option
                        var capCell = capInput.parentNode;
                        var capRow = capCell.parentNode;
                        var _tableBody2 = capRow.parentNode;
                        var _row10 = document.createElement('tr');
                        _tableBody2.insertBefore(_row10, capRow);
                        left = document.createElement('td');
                        _row10.appendChild(left);
                        left.style.margin = menus.cells.margin + 'px';
                        left.style.padding = menus.cells.padding + 'px';
                        left.style.width = menus.width / 2 + 'px';
                        left.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        left.style.borderWidth = menus.cells.border.width + 'px';
                        left.style.borderStyle = menus.cells.border.style;
                        left.style.textAlign = 'right';
                        left.innerHTML = 'Player Minimum';
                        right = document.createElement('td');
                        _row10.appendChild(right);
                        right.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
                        right.style.borderWidth = menus.cells.border.width + 'px';
                        right.style.borderStyle = menus.cells.border.style;
                        pmInput = document.createElement('input');
                        right.appendChild(pmInput);
                        pmInput.id = 'Player Minimum Input';
                        pmInput.style.width = menus.inputs.width + 'px';
                        pmInput.style.height = menus.inputs.height + 'px';
                        pmInput.type = 'number';
                        pmInput.value = '';
                        pmInput.style.autocomplete = 'on';
                        pmInput.style.boxSizing = 'border-box';
                        pmInput.style.textAlign = 'center';
                        pmInput.style.fontFamily = menus.inputs.font;
                        pmInput.style.fontSize = menus.inputs.size + 'px';
                        pmInput.style.outline = 'none';
                        pmInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        pmInput.style.borderWidth = '0px';
                        pmInput.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
                        pmInput.style.borderBottomWidth = menus.inputs.border.width + 'px';
                        pmInput.style.borderRadius = menus.inputs.border.radius + 'px';
                        pmInput.addEventListener('focus', function () {
                           pmInput.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
                        });
                        pmInput.addEventListener('focusout', function () {
                           pmInput.style.backgroundColor = 'rgb(255, 255, 255)';
                        });
                        menus.create.editNums();
                        var _rows5 = document.getElementById('Menu Body').children; // Reset Row Coloration
                        for (var _i5 = 0; _i5 < _rows5.length; _i5++) {
                           var _row11 = _rows5[_i5];
                           _row11.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                           if (_i5 % 2 == 0) {
                              _row11.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                           }
                        }
                     }
                  }
               });
            }
         }
      },
      submit: function submit() {
         var ok = true; // Check for inputs' validities
         {
            // Game Title
            var title = document.getElementById('Game Title Input').value;
            if (!title) {
               // If empty
               ok = false;
               alert('Title cannot be left blank');
            } else {
               for (var i = 0; i < games.length; i++) {
                  if (title == games[i].info.title) {
                     // Find matching title to another game
                     ok = false;
                     alert('Title matches that of another game');
                     break;
                  }
               }
            }
         }{
            // World Width and Height
            var widthInput = document.getElementById('World Width Input');
            var width = parseFloat(widthInput.value);
            if (!width) {
               width = parseFloat(widthInput.placeholder);
            }
            var heightInput = document.getElementById('World Height Input');
            var height = parseFloat(heightInput.value);
            if (!height) {
               height = parseFloat(heightInput.placeholder);
            }
            if (width < parseFloat(widthInput.min) || height < parseFloat(heightInput.min)) {
               ok = false;
               alert('Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px');
            } else if (width > parseFloat(widthInput.max) || height > parseFloat(heightInput.max)) {
               ok = false;
               alert('Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px');
            }
            if (width != height) {
               ok = false;
               alert('Width and height must be equivalent');
            }
         }{
            // Player Cap
            var playerCapInput = document.getElementById('Player Cap Input');
            var cap = parseFloat(playerCapInput.value);
            var pmInput = document.getElementById('Player Minimum Input');
            if (!cap) {
               cap = playerCapInput.placeholder;
            } else if (cap < parseFloat(playerCapInput.min)) {
               ok = false;
               alert('Player cap must be at least ' + parseFloat(playerCapInput.min));
            } else if (cap % 1 != 0) {
               ok = false;
               alert('Player cap must be a whole number');
            } else if (pmInput ? cap < parseFloat(pmInput.value) : false) {
               ok = false;
               alert('Player cap cannot be less than player minimum');
            }
         }{
            // Player Minimum
            var _pmInput2 = document.getElementById('Player Minimum Input');
            if (_pmInput2 != null) {
               var minimum = parseFloat(_pmInput2.value);
               if (!minimum) {
                  minimum = parseFloat(_pmInput2.placeholder);
               } else if (minimum < parseFloat(_pmInput2.min)) {
                  ok = false;
                  alert('Player minimum must be at least ' + parseFloat(_pmInput2.min));
               } else if (minimum % 1 != 0) {
                  ok = false;
                  alert('Player minimum must be a whole number');
               }
            }
         }{
            // Leaderboard Length
            var boardLengthInput = document.getElementById('Leaderboard Length Input');
            if (boardLengthInput != null) {
               var show = parseFloat(boardLengthInput.value);
               if (!show) {
                  show = parseFloat(boardLengthInput.placeholder);
               } else if (show < parseFloat(boardLengthInput.min)) {
                  ok = false;
                  alert('Leaderboard length must be at least ' + parseFloat(boardLengthInput.min));
               } else if (show > parseFloat(boardLengthInput.max)) {
                  ok = false;
                  alert('Leaderboard length can be at most ' + parseFloat(boardLengthInput.max));
               } else if (show % 1 != 0) {
                  ok = false;
                  alert('Leaderboard length must be a whole number');
               }
            }
         }{
            // Team Count
            var _tcInput4 = document.getElementById('Team Count Input');
            if (_tcInput4 != null) {
               var teamCount = parseFloat(_tcInput4.value);
               var pcInput = document.getElementById('Player Cap Input');
               if (teamCount == '' || teamCount == undefined || teamCount == null || teamCount !== teamCount) {
                  teamCount = parseFloat(_tcInput4.placeholder);
               } else if (teamCount < parseFloat(_tcInput4.min)) {
                  ok = false;
                  alert('Team count must be at least ' + parseFloat(_tcInput4.min));
               } else if (teamCount > parseFloat(_tcInput4.max)) {
                  ok = false;
                  alert('Team count can be at most ' + parseFloat(_tcInput4.max));
               } else if (teamCount % 1 != 0) {
                  ok = false;
                  alert('Team count must be a whole number');
               } else if (teamCount > parseFloat(pcInput.value)) {
                  ok = false;
                  alert('Player cap cannot be less than the number of teams');
               }
            }
         }
         if (ok == true) {
            var password = document.getElementById('Password Input').value;
            var type = document.getElementById('World Type Input').value.toLowerCase();
            var color = 'black'; // document.getElementById('World Color Input').value.toLowerCase(); // Only black world is enabled
            var mode = document.getElementById('Game Mode Input').value;
            createGame({
               title: title,
               password: password,
               type: type,
               width: width,
               height: height,
               color: color,
               cap: cap,
               show: show,
               mode: mode,
               teamCount: teamCount,
               min: minimum
            });
         }
      }
   },
   join: {
      header: {
         text: 'Join Game Options'
      },
      button: {
         text: 'Join'
      },
      options: ['Screen Name', 'Password', 'Color', 'Skin', '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign'],
      values: ['text', 'text', 'list', '3 radio', '2 radio', '2 radio', '2 radio', 'list', '1 radio'],
      units: [],
      editTexts: function editTexts() {
         {
            // Password
            var passwordInput = document.getElementById('Password Input');
            socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
            passwordInput.addEventListener('change', function () {
               socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
            });
            if (game.info.protected == false || socket.id == game.info.host) {
               // If game is not password protected or player is host
               var passInput = document.getElementById('Password Input'); // Remove Password Field
               var cell = passInput.parentNode;
               var row = cell.parentNode;
               row.parentNode.removeChild(row);
               var rows = document.getElementById('Menu Body').children; // Reset Row Coloration
               for (var i = 0; i < rows.length; i++) {
                  var _row12 = rows[i];
                  _row12.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                  if (i % 2 == 0) {
                     _row12.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                  }
               }
            }
         }
      },
      editLists: function editLists() {
         {
            // Color
            var colorInput = document.getElementById('Color Input');
            if (game.info.mode != 'skm' && game.info.mode != 'ctf' && game.info.mode != 'inf') {
               // If not a team mode + inf
               var colorNames = [];
               var options = [];
               var colorLength = 0;
               for (var _i6 in orgColors[game.world.color]) {
                  colorLength++;
               }
               var i = 0;
               for (var j in orgColors[game.world.color]) {
                  var option = void 0;
                  if (colorInput.options.length < colorLength) {
                     // If options not already created
                     option = document.createElement('option');
                     colorInput.appendChild(option);
                  } else {
                     // If options already created
                     option = colorInput.options[i];
                  }
                  option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
                  option.style.color = 'rgb(0, 0, 0)';
                  option.innerHTML = j[0].toUpperCase() + j.slice(1);
                  i++;
               }
            } else {
               if (colorInput != undefined) {
                  // If color input not already removed
                  var cell = colorInput.parentNode;
                  var row = cell.parentNode;
                  row.parentNode.removeChild(row); // Remove color row if is a team mode
                  var rows = document.getElementById('Menu Body').children;
                  for (var _i7 = 0; _i7 < rows.length; _i7++) {
                     // Reset row coloration
                     var _row13 = rows[_i7];
                     _row13.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i7 % 2 == 0) {
                        _row13.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               }
            }
         }{
            // Team
            for (var _j = 0; _j < games.length; _j++) {
               // Update game (Normally occurs in thesocket.js @ socket.on('Game')); Used for team option updates
               if (games[_j].info.host == game.info.host) {
                  // Identify game
                  game = games[_j];
                  break;
               }
            }
            var teamInput = document.getElementById('Team Input');
            if (teamInput != undefined) {
               // If team option not already removed
               if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
                  // If not a team mode
                  var _cell2 = teamInput.parentNode;
                  var _row14 = _cell2.parentNode;
                  _row14.parentNode.removeChild(_row14); // Remove team option
                  var _rows6 = document.getElementById('Menu Body').children; // Reset row coloration
                  for (var _i8 = 0; _i8 < _rows6.length; _i8++) {
                     var _row15 = _rows6[_i8];
                     _row15.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i8 % 2 == 0) {
                        _row15.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               } else {
                  // If a team mode
                  for (var _i9 = 0; _i9 < game.teams.length; _i9++) {
                     var _option = void 0;
                     if (teamInput.options.length < game.teams.length) {
                        _option = document.createElement('option');
                        teamInput.appendChild(_option);
                     } else {
                        _option = teamInput.options[_i9];
                     }
                     _option.value = teamColors[_i9];
                     _option.innerHTML = teamColors[_i9][0].toUpperCase() + teamColors[_i9].slice(1) + ': ' + game.teams[_i9].length;
                  }
               }
            }
         }
      },
      editRadios: function editRadios() {
         {
            // Skins
            for (var i = 0; i < skins.length; i++) {
               // i < number of skin options
               var skinInput = document.getElementById('Skin Input ' + i);
               var _cell3 = skinInput.parentNode;
               var name = document.createElement('p');
               name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
               name.style.display = 'inline';
               name.style.margin = '0px';
               name.style.fontFamily = menus.text.font;
               name.style.fontSize = menus.text.size - 2 + 'px';
               name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
               _cell3.insertBefore(name, _cell3.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
            }
         }{
            // Ability Selection
            if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
               // FFA, SKM, SRV, and KTH all use standard ability set
               for (var _i10 = 0; _i10 < 3; _i10++) {
                  var ordinal = void 0;
                  if (_i10 == 0) {
                     ordinal = '1st';
                  } else if (_i10 == 1) {
                     ordinal = '2nd';
                  } else if (_i10 == 2) {
                     ordinal = '3rd';
                  }
                  for (var j = 0; j < 2; j++) {
                     var abilityInput = document.getElementById(ordinal + ' Ability Input ' + j);
                     var cell = abilityInput.parentNode;
                     for (var k in ability) {
                        if (ability[k] != undefined && k != 'tag') {
                           if (ability[k].i == _i10 && ability[k].j == j) {
                              var _name = document.createElement('p');
                              _name.innerHTML = k[0].toUpperCase() + k.slice(1);
                              _name.style.display = 'inline';
                              _name.style.margin = '0px';
                              _name.style.fontFamily = menus.text.font;
                              _name.style.fontSize = menus.text.size - 2 + 'px';
                              _name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
                              cell.insertBefore(_name, cell.getElementsByTagName('div')[2 * j + 1]); // Insert name before the div line break
                           }
                        }
                     }
                  }
               }
            } else if (game.info.mode == 'inf') {
               // INF uses 'tag'
               for (var _i11 = 0; _i11 < 3; _i11++) {
                  var _ordinal = void 0;
                  if (_i11 == 0) {
                     _ordinal = '1st';
                  } else if (_i11 == 1) {
                     _ordinal = '2nd';
                  } else if (_i11 == 2) {
                     _ordinal = '3rd';
                  }
                  var row = document.getElementById(_ordinal + ' Ability Input 0').parentNode.parentNode; // Input is first radio button; Input parent is cell
                  row.parentNode.removeChild(row);
                  var rows = document.getElementById('Menu Body').children; // Reset Row Coloration
                  for (var _i12 = 0; _i12 < rows.length; _i12++) {
                     var _row16 = rows[_i12];
                     _row16.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i12 % 2 == 0) {
                        _row16.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               }
            }
         }{
            // Auto Assign
            var autoInput = document.getElementById('Auto Assign Input 0');
            if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
               // If not a team game
               var _cell4 = autoInput.parentNode;
               var _row17 = _cell4.parentNode;
               _row17.parentNode.removeChild(_row17);
               var _rows7 = document.getElementById('Menu Body').children; // Reset Row Coloration
               for (var _i13 = 0; _i13 < _rows7.length; _i13++) {
                  var _row18 = _rows7[_i13];
                  _row18.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                  if (_i13 % 2 == 0) {
                     _row18.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                  }
               }
            } else {
               // If a team game
               autoInput.addEventListener('click', function () {
                  var teamInput = document.getElementById('Team Input');
                  if (autoInput.value == true) {
                     teamInput.disabled = true;
                  } else {
                     teamInput.disabled = false;
                  }
               });
            }
         }
      },
      submit: function submit() {
         var ok = true; // Check for inputs' validities
         {
            // Screen Name
            var name = document.getElementById('Screen Name Input').value;
            if (name == '' || name == undefined || name == null) {
               ok = false;
               alert('Screen name cannot be left empty');
            }
            for (var i = 0; i < game.info.count; i++) {
               // Requires game to be updated (in renderMenu(datA))
               if (name == game.board.list[i].name) {
                  // Name cannot match another player's name
                  ok = false;
                  alert('Name matches that of another player');
                  break;
               }
            }
         }{
            // Skins
            var skin = 'none';
            var values = [];
            for (var _i14 = 0; _i14 < skins.length; _i14++) {
               if (document.getElementById('Skin Input ' + _i14).value == true) {
                  for (var j = 0; j < values.length; j++) {
                     if (values[j] == true) {
                        ok = false;
                        alert('Only one skin can be selected');
                        break;
                     }
                  }
                  values[_i14] = true;
               } else {
                  values[_i14] = false;
               }
            }
         }{
            // Abilities
            if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
               // FFA, SKM, SRV, and KTH all use standard ability set
               var extend = document.getElementById('1st Ability Input 0');
               var compress = document.getElementById('1st Ability Input 1');
               var immortality = document.getElementById('2nd Ability Input 0');
               var freeze = document.getElementById('2nd Ability Input 1');
               var neutralize = document.getElementById('3rd Ability Input 0');
               var toxin = document.getElementById('3rd Ability Input 1');
               if (!extend.value && !compress.value || !immortality.value && !freeze.value || !neutralize.value && !toxin.value) {
                  // If both false
                  ok = false;
                  alert('Please select three abilities');
               } else if (extend.value && compress.value || immortality.value && freeze.value || neutralize.value && toxin.value) {
                  // If both true
                  ok = false;
                  alert('Only one ability of a type can be selected');
               }
            }
         }{
            // Team
            if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
               // If is a team game
               var auto = document.getElementById('Auto Assign Input 0').value;
               if (auto != true) {
                  var team = document.getElementById('Team Input').value.toLowerCase();
                  for (var _i15 = 0; _i15 < game.teams.length; _i15++) {
                     if (_i15 == teamColors.indexOf(team)) {
                        continue;
                     }
                     if (game.teams[teamColors.indexOf(team)].length > game.teams[_i15].length) {
                        if (org != undefined && org.team == team && typeof team == 'string') {
                           // If player is already on loaded team
                           break; // Allow spawn
                        }
                        ok = false;
                        alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[_i15]);
                        break;
                     }
                  }
               }
            }
         }{
            // Player Cap
            if (game.players.length >= game.info.cap) {
               ok = false;
               alert('Game is at maximum player capacity');
            }
         }{
            // Game Closed
            var closed = true;
            for (var _i16 = 0; _i16 < games.length; _i16++) {
               if (games[_i16].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               alert('The game has closed');
               renderTitle();
            }
         }{
            var deniedJoin = function deniedJoin(datA) {
               if (datA.type == 'join') {
                  // 'type' is necessary so won't run spectate code when joining game
                  ok = false;
                  var password = document.getElementById('Password Input').value;
                  if (password == '' || typeof password != 'string') {
                     alert('A password is required for this game');
                  } else {
                     alert('Password is invalid');
                  }
               }
               socket.removeListener('Permission Denied', deniedJoin);
            };

            var grantedJoin = function grantedJoin(datA) {
               if (datA.type == 'join') {
                  // 'type' is necessary so won't run spectate code when joining game
                  if (ok == true) {
                     // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
                     // Leaderboard
                     var already = false;
                     for (var _i17 = 0; _i17 < game.board.list.length; _i17++) {
                        if (game.board.list[_i17].player == socket.id) {
                           already = true;
                           break;
                        }
                     }
                     if (!already) {
                        game.board.list.push({
                           player: socket.id,
                           name: name,
                           kills: 0,
                           deaths: 0,
                           score: 0,
                           wins: 0
                        });
                     }
                     orderBoard(game.board.list);
                     socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                     // Abilities
                     if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
                        // FFA, SKM, SRV, and KTH all use standard ability set
                        ability.tag.activated = false;
                        ability.tag.can = false;
                        if (extend.value == true) {
                           ability.extend.activated = true;
                           ability.extend.can = true;
                           ability.compress.activated = false;
                           ability.compress.can = false;
                        } else if (compress.value == true) {
                           ability.compress.activated = true;
                           ability.compress.can = true;
                           ability.extend.activated = false;
                           ability.extend.can = false;
                        }
                        if (immortality.value == true) {
                           ability.immortality.activated = true;
                           ability.immortality.can = true;
                           ability.freeze.activated = false;
                           ability.freeze.can = false;
                        } else if (freeze.value == true) {
                           ability.freeze.activated = true;
                           ability.freeze.can = true;
                           ability.immortality.activated = false;
                           ability.immortality.can = false;
                        }
                        if (neutralize.value == true) {
                           ability.neutralize.activated = true;
                           ability.neutralize.can = true;
                           ability.toxin.activated = false;
                           ability.toxin.can = false;
                        } else if (toxin.value == true) {
                           ability.toxin.activated = true;
                           ability.toxin.can = true;
                           ability.neutralize.activated = false;
                           ability.neutralize.can = false;
                        }
                        ability.spore.activated = true;
                        ability.spore.can = true;
                        ability.secrete.activated = true;
                        ability.secrete.can = false;
                        for (var _i18 = 0; _i18 < ability.shoot.value.length; _i18++) {
                           ability.shoot.can[_i18] = true;
                           ability.shoot.value[_i18] = false;
                        }
                     } else if (game.info.mode == 'inf') {
                        ability.tag.activated = true;
                        ability.tag.can = true;
                        ability.extend.activated = false;
                        ability.extend.can = false;
                        ability.compress.activated = false;
                        ability.compress.can = false;
                        ability.immortality.activated = false;
                        ability.immortality.can = false;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                        ability.neutralize.activated = false;
                        ability.neutralize.can = false;
                        ability.toxin.activated = false;
                        ability.toxin.can = false;
                        ability.spore.activated = false;
                        ability.spore.can = false;
                        ability.secrete.activated = false;
                        ability.secrete.can = false;
                        for (var _i19 = 0; _i19 < ability.shoot.value.length; _i19++) {
                           if (_i19 == ability.tag.i) {
                              ability.shoot.can[_i19] = true;
                           } else {
                              ability.shoot.can[_i19] = false;
                           }
                           ability.shoot.value[_i19] = false;
                        }
                     }
                     // Skin
                     var _skin = 'none';
                     for (var _i20 = 0; _i20 < skins.length; _i20++) {
                        if (document.getElementById('Skin Input ' + _i20).value == true) {
                           _skin = skins[_i20];
                        }
                     }
                     // Team
                     if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
                        // If is a team game
                        var team;
                        var auto = document.getElementById('Auto Assign Input 0').value;
                        if (auto != true) {
                           // If auto assign is not selected
                           team = document.getElementById('Team Input').value;
                        } else {
                           // If auto assign is selected
                           var indices = [];
                           var minimum = Infinity;
                           for (var _i21 = 0; _i21 < game.teams.length; _i21++) {
                              if (game.teams[_i21].length < minimum) {
                                 // If length is less than minimum
                                 minimum = game.teams[_i21].length; // Set length as new minimum
                                 indices = [_i21]; // Clear indices and push i
                              } else if (game.teams[_i21].length == minimum) {
                                 indices.push(_i21);
                              }
                           }
                           team = teamColors[indices[floor(random(0, indices.length))]];
                        }
                        for (var _i22 = 0; _i22 < teamColors.length; _i22++) {
                           if (team == teamColors[_i22]) {
                              game.teams[_i22].push(socket.id); // Add player to selected team
                              socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
                              break;
                           }
                        }
                     }
                     // Color
                     var color;
                     if (game.info.mode == 'inf') {
                        // If inf mode
                        color = teamColorDef.green; // All players healthy by default
                     } else if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
                        // If is not a team game
                        color = document.getElementById('Color Input').value.toLowerCase();
                     } else {
                        color = teamColorDef[team]; // Color must be after Team
                     }
                     // Initialize
                     clearInterval(title.interval);
                     if (game.rounds.util == true) {
                        if (game.rounds.waiting == true) {
                           initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: _skin, team: team });
                        } else {
                           initialize(game, { spectate: true, color: orgColors[game.world.color][color], skin: _skin, team: team });
                        }
                     } else {
                        initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: _skin, team: team });
                     }
                  }
               }
               socket.removeListener('Permission Granted', grantedJoin);
            };

            // Password
            socket.emit('Check Permission', { title: game.info.title, type: 'join' });
            socket.on('Permission Denied', deniedJoin);
            socket.on('Permission Granted', grantedJoin);
         }
      }
   },
   spectate: {
      header: {
         text: 'Spectate Game Options'
      },
      button: {
         text: 'Spectate'
      },
      options: ['Screen Name', 'Password'],
      values: ['text', 'text'],
      units: [undefined, undefined],
      editTexts: function editTexts() {
         // Password
         var passwordInput = document.getElementById('Password Input');
         socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
         passwordInput.addEventListener('change', function () {
            socket.emit('Ask Permission', { pass: passwordInput.value, info: game.info }); // Initialize game as a player
         });
         if (game.info.protected == false || socket.id == game.info.host) {
            // If game is not password protected or player is host
            var passInput = document.getElementById('Password Input'); // Remove Password Field
            var cell = passInput.parentNode;
            var row = cell.parentNode;
            row.parentNode.removeChild(row);
            var rows = document.getElementById('Menu Body').children; // Reset Row Coloration
            for (var i = 0; i < rows.length; i++) {
               var _row19 = rows[i];
               _row19.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
               if (i % 2 == 0) {
                  _row19.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
               }
            }
         }
      },
      submit: function submit() {
         var ok = true;{
            // Game Closed
            var closed = true;
            for (var i = 0; i < games.length; i++) {
               if (games[i].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               alert('The game has closed');
               renderTitle();
            }
         }{
            // Screen Name
            var name = document.getElementById('Screen Name Input').value;
            if (name == '' || name == undefined || name == null) {
               ok = false;
               alert('Screen name cannot be left empty');
            }
            for (var _i23 = 0; _i23 < game.info.count; _i23++) {
               // Requires game to be updated (in renderMenu(datA))
               if (name == game.board.list[_i23].name) {
                  // Name cannot match another player's name
                  ok = false;
                  alert('Name matches that of another player');
                  break;
               }
            }
         }{
            var deniedSpectate = function deniedSpectate(datA) {
               if (datA.type == 'spectate') {
                  // 'type' is necessary so won't run join code when spectating game
                  ok = false;
                  var password = document.getElementById('Password Input').value;
                  if (password == '' || typeof password != 'string') {
                     alert('A password is required for this game');
                  } else {
                     alert('Password is invalid');
                  }
               }
               socket.removeListener('Permission Denied', deniedSpectate);
            };

            var grantedSpectate = function grantedSpectate(datA) {
               if (datA.type == 'spectate') {
                  // 'type' is necessary so won't run join code when spectating game
                  if (ok == true) {
                     // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
                     // Leaderboard
                     var already = false;
                     for (var _i24 = 0; _i24 < game.board.list.length; _i24++) {
                        if (game.board.list[_i24].player == socket.id) {
                           already = true;
                           break;
                        }
                     }
                     if (!already) {
                        game.board.list.push({ // Add player to leaderboard
                           player: socket.id,
                           name: name,
                           kills: 0,
                           deaths: 0,
                           score: 0,
                           wins: 0
                        });
                     }
                     orderBoard(game.board.list);
                     socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
                     // Initialize
                     clearInterval(title.interval);
                     initialize(game, { spectate: true, color: undefined, skin: undefined });
                  }
               }
               socket.removeListener('Permission Granted', grantedSpectate);
            };

            // Password
            socket.emit('Check Permission', { title: game.info.title, type: 'spectate' });
            socket.on('Permission Denied', deniedSpectate);
            socket.on('Permission Granted', grantedSpectate);
         }
      }
   },
   respawn: {
      header: {
         text: 'Respawn Options'
      },
      button: {
         text: 'Respawn'
      },
      options: ['Color', 'Skin', '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign'],
      values: ['list', '3 radio', '2 radio', '2 radio', '2 radio', 'list', '1 radio'],
      units: [],
      editLists: function editLists() {
         {
            // Color
            var colorInput = document.getElementById('Color Input');
            if (game.info.mode != 'skm' && game.info.mode != 'ctf' && game.info.mode != 'inf') {
               // If not a team mode + inf
               var colorNames = [];
               var options = [];
               var colorLength = 0;
               for (var _i25 in orgColors[game.world.color]) {
                  colorLength++;
               }
               var i = 0;
               for (var j in orgColors[game.world.color]) {
                  var option = void 0;
                  if (colorInput.options.length < colorLength) {
                     // If options not already created
                     option = document.createElement('option');
                     colorInput.appendChild(option);
                  } else {
                     // If options already created
                     option = colorInput.options[i];
                  }
                  option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
                  option.style.color = 'rgb(0, 0, 0)';
                  option.innerHTML = j[0].toUpperCase() + j.slice(1);
                  if (org.color != undefined) {
                     if (orgColors[game.world.color][j].r == org.color.r && orgColors[game.world.color][j].g == org.color.g && orgColors[game.world.color][j].b == org.color.b) {
                        // If is current org color
                        option.selected = 'selected'; // Pre-Select current org color
                     }
                  }
                  i++;
               }
            } else {
               if (colorInput != undefined) {
                  // If color input not already removed
                  var cell = colorInput.parentNode;
                  var row = cell.parentNode;
                  row.parentNode.removeChild(row); // Remove color row if is a team mode
                  var rows = document.getElementById('Menu Body').children;
                  for (var _i26 = 0; _i26 < rows.length; _i26++) {
                     // Reset row coloration
                     var _row20 = rows[_i26];
                     _row20.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i26 % 2 == 0) {
                        _row20.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               }
            }
         }{
            // Team
            for (var _j2 = 0; _j2 < games.length; _j2++) {
               // Update game (Normally occurs in thesocket.js socket.on('Game')); Used for team option updates
               if (games[_j2].info.host == game.info.host) {
                  // Identify game
                  game = games[_j2];
                  break;
               }
            }
            var teamInput = document.getElementById('Team Input');
            if (teamInput != undefined) {
               // If team option not already removed
               if (game.info.mode != 'skm' && game.info.mode != 'ctf' && teamInput != undefined) {
                  // If not a team mode
                  var _cell5 = teamInput.parentNode;
                  var _row21 = _cell5.parentNode;
                  _row21.parentNode.removeChild(_row21); // Remove team option
                  var _rows8 = document.getElementById('Menu Body').children; // Reset row coloration
                  for (var _i27 = 0; _i27 < _rows8.length; _i27++) {
                     var _row22 = _rows8[_i27];
                     _row22.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i27 % 2 == 0) {
                        _row22.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               } else {
                  // If a team mode
                  for (var _i28 = 0; _i28 < game.teams.length; _i28++) {
                     var _option2 = void 0;
                     if (teamInput.options.length < game.teams.length) {
                        // If options not yet created
                        _option2 = document.createElement('option');
                        teamInput.appendChild(_option2);
                        if (_i28 == teamColors.indexOf(org.team)) {
                           _option2.selected = 'selected';
                        }
                     } else {
                        // If updating previously created options
                        _option2 = teamInput.options[_i28];
                     }
                     _option2.value = teamColors[_i28];
                     _option2.innerHTML = teamColors[_i28][0].toUpperCase() + teamColors[_i28].slice(1) + ': ' + game.teams[_i28].length;
                  }
               }
            }
         }
      },
      editRadios: function editRadios() {
         {
            // Skins
            for (var i = 0; i < skins.length; i++) {
               // i < number of skin options
               var skinInput = document.getElementById('Skin Input ' + i);
               var _cell6 = skinInput.parentNode;
               var name = document.createElement('p');
               name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
               name.style.display = 'inline';
               name.style.margin = '0px';
               name.style.fontFamily = menus.text.font;
               name.style.fontSize = menus.text.size - 2 + 'px';
               name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
               _cell6.insertBefore(name, _cell6.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
               if (org.skin == skins[i]) {
                  skinInput.value = true;
                  skinInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
               }
            }
         }{
            // Ability Selection
            if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
               // FFA, SKM, SRV, and KTH all use standard ability set
               for (var _i29 = 0; _i29 < 3; _i29++) {
                  var ordinal = void 0;
                  if (_i29 == 0) {
                     ordinal = '1st';
                  } else if (_i29 == 1) {
                     ordinal = '2nd';
                  } else if (_i29 == 2) {
                     ordinal = '3rd';
                  }
                  for (var j = 0; j < 2; j++) {
                     var abilityInput = document.getElementById(ordinal + ' Ability Input ' + j);
                     var cell = abilityInput.parentNode;
                     for (var k in ability) {
                        if (ability[k] != undefined && k != 'tag') {
                           if (ability[k].i == _i29 && ability[k].j == j) {
                              var _name2 = document.createElement('p');
                              _name2.innerHTML = k[0].toUpperCase() + k.slice(1);
                              _name2.style.display = 'inline';
                              _name2.style.margin = '0px';
                              _name2.style.fontFamily = menus.text.font;
                              _name2.style.fontSize = menus.text.size - 2 + 'px';
                              _name2.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
                              cell.insertBefore(_name2, cell.getElementsByTagName('div')[2 * j + 1]); // Insert name before the div line break
                              if (ability[k].activated == true) {
                                 // Load previous ability configuration to default
                                 abilityInput.value = true;
                                 abilityInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
                              } else if (ability[k].activated == false) {
                                 abilityInput.value = false;
                                 abilityInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
                              }
                           }
                        }
                     }
                  }
               }
            } else if (game.info.mode == 'inf') {
               // INF uses 'tag'
               for (var _i30 = 0; _i30 < 3; _i30++) {
                  var _ordinal2 = void 0;
                  if (_i30 == 0) {
                     _ordinal2 = '1st';
                  } else if (_i30 == 1) {
                     _ordinal2 = '2nd';
                  } else if (_i30 == 2) {
                     _ordinal2 = '3rd';
                  }
                  var row = document.getElementById(_ordinal2 + ' Ability Input 0').parentNode.parentNode; // Input is first radio button; Input parent is cell
                  row.parentNode.removeChild(row); // Remove ability selections
                  var rows = document.getElementById('Menu Body').children; // Reset Row Coloration
                  for (var _i31 = 0; _i31 < rows.length; _i31++) {
                     var _row23 = rows[_i31];
                     _row23.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                     if (_i31 % 2 == 0) {
                        _row23.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                     }
                  }
               }
            }
         }{
            // Auto Assign
            var autoInput = document.getElementById('Auto Assign Input 0');
            if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
               // If not a team game
               var _cell7 = autoInput.parentNode;
               var _row24 = _cell7.parentNode;
               _row24.parentNode.removeChild(_row24);
               var _rows9 = document.getElementById('Menu Body').children; // Reset Row Coloration
               for (var _i32 = 0; _i32 < _rows9.length; _i32++) {
                  var _row25 = _rows9[_i32];
                  _row25.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                  if (_i32 % 2 == 0) {
                     _row25.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                  }
               }
            } else {
               // If a team game
               autoInput.addEventListener('click', function () {
                  var teamInput = document.getElementById('Team Input');
                  if (autoInput.value == true) {
                     teamInput.disabled = true;
                  } else {
                     teamInput.disabled = false;
                  }
               });
            }
         }
      },
      submit: function submit() {
         var ok = true;{
            // Skins
            var skin = 'none';
            var values = [];
            for (var i = 0; i < skins.length; i++) {
               if (document.getElementById('Skin Input ' + i).value == true) {
                  for (var j = 0; j < values.length; j++) {
                     if (values[j] == true) {
                        ok = false;
                        alert('Only one skin can be selected');
                        break;
                     }
                  }
                  values[i] = true;
               } else {
                  values[i] = false;
               }
            }
         }{
            // Abilities
            if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
               // FFA, SKM, SRV, and KTH all use standard ability set
               var extend = document.getElementById('1st Ability Input 0');
               var compress = document.getElementById('1st Ability Input 1');
               var immortality = document.getElementById('2nd Ability Input 0');
               var freeze = document.getElementById('2nd Ability Input 1');
               var neutralize = document.getElementById('3rd Ability Input 0');
               var toxin = document.getElementById('3rd Ability Input 1');
               if (extend.value == false && compress.value == false || immortality.value == false && freeze.value == false || neutralize.value == false && toxin.value == false) {
                  // If both false
                  ok = false;
                  alert('Please select three abilities');
               } else if (extend.value == true && compress.value == true || immortality.value == true && freeze.value == true || neutralize.value == true && toxin.value == true) {
                  // If both true
                  ok = false;
                  alert('Only one ability of a type can be selected');
               }
            } else if (game.info.mode == 'inf') {// INF uses tag

            }
         }{
            // Team
            if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
               // If is a team game
               var team;
               var auto = document.getElementById('Auto Assign Input 0').value;
               if (auto != true) {
                  // If auto assign is not selected
                  team = document.getElementById('Team Input').value;
                  for (var _i33 = 0; _i33 < game.teams.length; _i33++) {
                     if (_i33 == teamColors.indexOf(team)) {
                        continue;
                     }
                     if (game.teams[teamColors.indexOf(team)].length > game.teams[_i33].length) {
                        if (org.team == team && typeof team == 'string') {
                           // If player is already on loaded team
                           break; // Allow spawn
                        }
                        ok = false;
                        alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[_i33]);
                        break;
                     }
                  }
               } else {
                  // If auto assign is selected
                  var indices = [];
                  var minimum = Infinity;
                  for (var _i34 = 0; _i34 < game.teams.length; _i34++) {
                     var l = game.teams[_i34].length;
                     if (game.teams[_i34].indexOf(socket.id) != -1) {
                        // If player is on given team
                        l--; // Do not include player as part of the team, so if even numbers before, will replace back on the same team and not add extra to other team
                     }
                     if (l < minimum) {
                        // If length is less than minimum
                        minimum = l; // Set length as new minimum
                        indices = [_i34]; // Clear indices and push i
                     } else if (l == minimum) {
                        indices.push(_i34);
                     }
                  }
                  team = teamColors[indices[floor(random(0, indices.length))]];
               }
            }
         }{
            // Game Closed
            var closed = true;
            for (var _i35 = 0; _i35 < games.length; _i35++) {
               if (games[_i35].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok == true) {
            socket.emit('Spectator Spawned', game);
            // Abilities
            if (game.info.mode == 'ffa' || game.info.mode == 'skm' || game.info.mode == 'srv' || game.info.mode == 'kth') {
               // FFA, SKM, SRV, and KTH all use standard ability set
               if (extend.value == true) {
                  ability.extend.activated = true;
                  ability.extend.can = true;
                  ability.compress.activated = false;
                  ability.compress.can = false;
               } else if (compress.value == true) {
                  ability.compress.activated = true;
                  ability.compress.can = true;
                  ability.extend.activated = false;
                  ability.extend.can = false;
               }
               if (immortality.value == true) {
                  ability.immortality.activated = true;
                  ability.immortality.can = true;
                  ability.freeze.activated = false;
                  ability.freeze.can = false;
               } else if (freeze.value == true) {
                  ability.freeze.activated = true;
                  ability.freeze.can = true;
                  ability.immortality.activated = false;
                  ability.immortality.can = false;
               }
               if (neutralize.value == true) {
                  ability.neutralize.activated = true;
                  ability.neutralize.can = true;
                  ability.toxin.activated = false;
                  ability.toxin.can = false;
               } else if (toxin.value == true) {
                  ability.toxin.activated = true;
                  ability.toxin.can = true;
                  ability.neutralize.activated = false;
                  ability.neutralize.can = false;
               }
               ability.spore.activated = true;
               ability.spore.can = true;
               ability.secrete.activated = true;
               ability.secrete.can = false;
            } else if (game.info.mode == 'inf') {
               ability.extend.activated = false;
               ability.extend.can = false;
               ability.compress.activated = false;
               ability.compress.can = false;
               ability.immortality.activated = false;
               ability.immortality.can = false;
               ability.freeze.activated = false;
               ability.freeze.can = false;
               ability.neutralize.activated = false;
               ability.neutralize.can = false;
               ability.toxin.activated = false;
               ability.toxin.can = false;
               ability.spore.activated = false;
               ability.spore.can = false;
               ability.secrete.activated = false;
               ability.secrete.can = false;
            }
            // Skin
            var _skin2 = 'none';
            for (var _i36 = 0; _i36 < skins.length; _i36++) {
               if (document.getElementById('Skin Input ' + _i36).value == true) {
                  _skin2 = skins[_i36];
               }
            }
            // Team
            if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
               // If is a team game
               if (org.team != team) {
                  // Only add player to team if not already on team
                  game.teams[teamColors.indexOf(team)].push(socket.id); // Add player to selected team
                  game.teams[teamColors.indexOf(org.team)].splice(game.teams[teamColors.indexOf(org.team)].indexOf(socket.id), 1);
                  socket.emit('Teams', { teams: game.teams, host: game.info.host }); // Host is for identification
               }
            }
            // Color
            var color;
            if (game.info.mode == 'inf') {
               // If inf mode
               color = teamColorDef.green; // All players healthy by default
            } else if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
               // If is not a team mode	
               color = document.getElementById('Color Input').value.toLowerCase();
            } else {
               color = teamColorDef[team]; // Color must be after Team
            }
            // Initialize
            initialize(game, { spectate: false, color: orgColors[game.world.color][color], skin: _skin2, team: team });
         }
      }
   },
   pauseGame: {
      header: {
         text: 'Pause Options'
      },
      button: {
         text: 'Return'
      },
      options: ['Color', 'Skin', 'Name Labels', 'Messages', 'Leave Game'],
      values: ['list', '3 radio', '1 radio', '1 radio', 'button'],
      units: [],
      editLists: function editLists() {
         {
            // Color
            var colorInput = document.getElementById('Color Input');
            if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
               // If not a team mode
               var colorNames = [];
               var options = [];
               for (var j in orgColors[game.world.color]) {
                  var option = document.createElement('option');
                  colorInput.appendChild(option);
                  option.style.backgroundColor = 'rgb(' + orgColors[game.world.color][j].r + ', ' + orgColors[game.world.color][j].g + ', ' + orgColors[game.world.color][j].b + ')';
                  option.style.color = 'rgb(0, 0, 0)';
                  option.innerHTML = j[0].toUpperCase() + j.slice(1);
                  if (org.color != undefined) {
                     if (orgColors[game.world.color][j].r == org.color.r && orgColors[game.world.color][j].g == org.color.g && orgColors[game.world.color][j].b == org.color.b) {
                        // If is current org color
                        option.selected = 'selected'; // Pre-Select current org color
                     }
                  }
               }
            } else {
               var cell = colorInput.parentNode;
               var row = cell.parentNode;
               row.parentNode.removeChild(row); // Remove color row if is a team mode
               var rows = document.getElementById('Menu Body').children;
               for (var i = 0; i < rows.length; i++) {
                  // Reset row coloration
                  var _row26 = rows[i];
                  _row26.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
                  if (i % 2 == 0) {
                     _row26.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
                  }
               }
            }
         }
      },
      editRadios: function editRadios() {
         {
            // Skins
            for (var i = 0; i < skins.length; i++) {
               // i < number of skin options
               var skinInput = document.getElementById('Skin Input ' + i);
               var cell = skinInput.parentNode;
               var name = document.createElement('p');
               name.innerHTML = skins[i][0].toUpperCase() + skins[i].slice(1);
               name.style.display = 'inline';
               name.style.margin = '0px';
               name.style.fontFamily = menus.text.font;
               name.style.fontSize = menus.text.size - 2 + 'px';
               name.style.color = 'rgb(' + menus.text.color.r + ', ' + menus.text.color.g + ', ' + menus.text.color.b + ')';
               cell.insertBefore(name, cell.getElementsByTagName('div')[2 * i + 1]); // Insert name before the div line break
               if (org.skin == skins[i]) {
                  skinInput.value = true;
                  skinInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
               }
            }
         }{
            // Name Labels
            var labelsInput = document.getElementById('Name Labels Input 0');
            if (Labels == true) {
               labelsInput.value = true;
               labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
            } else if (Labels == false) {
               labelsInput.value = false;
               labelsInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
            }
         }{
            // Messages
            var messagesInput = document.getElementById('Messages Input 0');
            if (Messages == true) {
               messagesInput.value = true;
               messagesInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
            } else if (Messages == false) {
               messagesInput.value = false;
               messagesInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
            }
         }
      },
      editButtons: function editButtons() {
         var buttonInput = document.getElementById('Leave Game Input');
         buttonInput.addEventListener('click', function () {
            socket.emit('Leave Game', game);
            org.clearIntervals(); // Copied from die()
            for (var i in ability) {
               // Reset Ability Cooldowns
               if (_typeof(ability[i]) == 'object' && i !== 'shoot') {
                  // If is a usable ability
                  clearTimeout(ability[i].timeout);
                  ability[i].value = false;
                  ability[i].can = true;
                  ability[i].cooling = false;
                  ability[i].start = undefined;
                  ability[i].end = undefined;
               }
            }
            for (var _i37 = 0; _i37 < 3; _i37++) {
               // Reset shoots
               clearTimeout(ability.shoot.timeout[_i37]);
               ability.shoot.value[_i37] = false;
               ability.shoot.can[_i37] = true;
               ability.shoot.spore[_i37] = undefined;
               ability.shoot.secrete[_i37] = {};
               ability.shoot.start[_i37] = undefined;
               ability.shoot.end[_i37] = undefined;
            }
            for (var _i38 = 0; _i38 < game.board.list.length; _i38++) {
               if (game.board.list[_i38].player == socket.id) {
                  // Find player in leaderboard
                  game.board.list.splice(_i38, 1); // Remove player from leaderboard
                  orderBoard(game.board.list); // Sort the list
                  socket.emit('Board', game.board); // Send updated board to server
                  break;
               }
            }
            org = undefined;
            renderTitle();
         });
      },
      submit: function submit() {
         var ok = true;{
            // Skins
            var skin = 'none';
            var values = [];
            for (var i = 0; i < skins.length; i++) {
               if (document.getElementById('Skin Input ' + i).value == true) {
                  for (var j = 0; j < values.length; j++) {
                     if (values[j] == true) {
                        ok = false;
                        alert('Only one skin can be selected');
                        break;
                     }
                  }
                  values[i] = true;
               } else {
                  values[i] = false;
               }
            }
         }{
            // Game Closed
            var closed = true;
            for (var _i39 = 0; _i39 < games.length; _i39++) {
               if (games[_i39].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok == true) {
            {
               // Color
               if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
                  // If is not a team mode
                  var color = document.getElementById('Color Input').value.toLowerCase();
                  org.color = orgColors[game.world.color][color];
               } // Cannot change team in pause menu
            }{
               // Skin
               var _skin3 = 'none';
               for (var _i40 = 0; _i40 < skins.length; _i40++) {
                  if (document.getElementById('Skin Input ' + _i40).value == true) {
                     _skin3 = skins[_i40];
                  }
               }
               org.skin = _skin3;
            }{
               // Name Labels
               var labelsInput = document.getElementById('Name Labels Input 0');
               Labels = labelsInput.value;
            }{
               // Messages
               var messagesInput = document.getElementById('Messages Input 0');
               Messages = messagesInput.value;
            }
            // Initialize
            var page = document.body.parentNode; // Clear Body
            page.removeChild(document.body);
            body = document.createElement('body');
            page.appendChild(body);
            body.style.overflow = 'hidden'; // Apply Canvas Styling
            body.style.margin = '0px';
            body.style.border = '0px';
            body.style.padding = '0px';
            cnv = createCanvas(window.innerWidth, window.innerHeight); // Create Canvas
            canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
            canvas.style.visibility = 'visible';
            body.appendChild(canvas);
            center = {
               x: width / 2,
               y: height / 2
            };
            rectMode(CENTER);
            ellipseMode(RADIUS);
            angleMode(DEGREES);
            textAlign(LEFT);
            var skip = false;
            for (var _i41 = 0; _i41 < game.players.length; _i41++) {
               if (game.players[_i41] == socket.id) {
                  // If still is a player
                  state = 'game';
                  skip = true;
                  break;
               }
            }
            if (skip == false) {
               for (var _i42 = 0; _i42 < game.spectators.length; _i42++) {
                  if (game.spectators[_i42] == socket.id) {
                     state = 'spectate';
                     break;
                  }
               }
            }
         }
      }
   },
   pauseSpectate: {
      header: {
         text: 'Pause Options'
      },
      button: {
         text: 'Return'
      },
      options: ['Name Labels', 'Messages', 'Leave Game'],
      values: ['1 radio', '1 radio', 'button'],
      units: [],
      editRadios: function editRadios() {
         {
            // Name Labels
            var labelsInput = document.getElementById('Name Labels Input 0');
            if (Labels == true) {
               labelsInput.value = true;
               labelsInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
            } else if (Labels == false) {
               labelsInput.value = false;
               labelsInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
            }
         }{
            // Messages
            var messagesInput = document.getElementById('Messages Input 0');
            if (Messages == true) {
               messagesInput.value = true;
               messagesInput.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
            } else if (Messages == false) {
               messagesInput.value = false;
               messagesInput.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
            }
         }
      },
      editButtons: function editButtons() {
         {
            // Leave Game
            var buttonInput = document.getElementById('Leave Game Input');
            buttonInput.addEventListener('click', function () {
               socket.emit('Leave Game', game);
               org.clearIntervals(); // Copied from die() (Ability resets not necessary for spectate leave)
               for (var i = 0; i < game.board.list.length; i++) {
                  if (game.board.list[i].player == socket.id) {
                     // Find player in leaderboard
                     game.board.list.splice(i, 1); // Remove player from leaderboard
                     orderBoard(game.board.list); // Sort the list
                     socket.emit('Board', game.board); // Send updated board to server
                     break;
                  }
               }
               org = undefined;
               renderTitle();
            });
         }
      },
      submit: function submit() {
         var ok = true;{
            // Game Closed
            var closed = true;
            for (var i = 0; i < games.length; i++) {
               if (games[i].info.host == game.info.host) {
                  closed = false;
                  break;
               }
            }
            if (closed == true) {
               ok = false;
               alert('The game has closed');
               renderTitle();
            }
         }
         if (ok == true) {
            {
               // Name Labels
               var labelsInput = document.getElementById('Name Labels Input 0');
               if (labelsInput != null) {
                  Labels = labelsInput.value;
               }
            }{
               // Messages
               var messagesInput = document.getElementById('Messages Input 0');
               if (messagesInput != null) {
                  Messages = messagesInput.value;
               }
            }
            // Initialize
            var page = document.body.parentNode; // Clear Body
            page.removeChild(document.body);
            body = document.createElement('body');
            page.appendChild(body);
            body.style.overflow = 'hidden'; // Apply Canvas Styling
            body.style.margin = '0px';
            body.style.border = '0px';
            body.style.padding = '0px';
            cnv = createCanvas(window.innerWidth, window.innerHeight); // Create Canvas
            canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
            canvas.style.visibility = 'visible';
            body.appendChild(canvas);
            center = {
               x: width / 2,
               y: height / 2
            };
            rectMode(CENTER);
            ellipseMode(RADIUS);
            angleMode(DEGREES);
            textAlign(LEFT);
            state = 'spectate';
         }
      }
   },
   pauseTutorial: {
      header: {
         text: 'Pause Options'
      },
      button: {
         text: 'Return'
      },
      options: ['Leave Game'],
      values: ['button'],
      units: [],
      editButtons: function editButtons() {
         {
            // Leave Game
            var leaveInput = document.getElementById('Leave Game Input');
            leaveInput.addEventListener('click', function () {
               tutorial.clear();
               ability = new Ability({ player: socket.id }); // Reconstruct in case tutorial caused any problem in ability object
               org = undefined;
               renderTitle();
            });
         }
      },
      submit: function submit() {
         var ok = true;
         if (ok == true) {
            // Initialize
            cnvClear();
            rectMode(CENTER);
            ellipseMode(RADIUS);
            angleMode(DEGREES);
            textAlign(LEFT);
            state = 'tutorial';
         }
      }
   }
};

function renderMenu(typE, datA) {
   var type = typE;
   if (type == 'join' || type == 'spectate' || type == 'respawn') {
      game = datA;
   }
   // Clear Body
   var page = document.body.parentNode;
   page.addEventListener('mouseup', function () {
      button.down = false;
   });
   cnvClear(); // Removes all elements from body but for canvas elements
   var body = document.body;{
      state = type + 'Menu';
      var shade = new Shade();
      body.appendChild(shade.elt);
      var container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0px';
      container.style.left = '0px';
      container.style.width = '100%';
      container.style.height = '100%';
      body.appendChild(container);
      var header = document.createElement('div');
      container.appendChild(header);
      header.id = type + 'Header';
      header.style.height = menus.header.height + 'px';
      header.style.width = '100%';
      header.style.paddingTop = menus.header.padding + 'px';
      header.style.paddingBottom = menus.header.padding + 'px';
      header.style.backgroundColor = 'rgb(' + menus.header.backgroundColor.r + ', ' + menus.header.backgroundColor.g + ', ' + menus.header.backgroundColor.b + ')';
      var headerText = document.createElement('h2');
      header.appendChild(headerText);
      headerText.style.margin = '0px';
      headerText.style.position = 'relative';
      headerText.style.top = (menus.header.height - menus.header.padding - menus.header.size * 3 / 4) / 2 + 'px';
      headerText.style.color = 'rgb(' + menus.header.color.r + ', ' + menus.header.color.g + ', ' + menus.header.color.b + ')';
      headerText.style.fontFamily = menus.header.font;
      headerText.style.fontSize = menus.header.size + 'px';
      headerText.style.textAlign = 'center';
      headerText.style.fontWeight = menus.header.weight;
      headerText.innerHTML = menus[type].header.text;
      var content = document.createElement('div');
      container.appendChild(content);
      content.style.paddingBottom = menus.footer.height + 'px';
      content.style.overflow = 'auto';
      var table = document.createElement('table');
      content.appendChild(table);
      table.id = type + 'Table';
      table.style.width = '100%';
      table.style.margin = '0px';
      table.style.marginTop = menus.top + 'px';
      table.style.padding = menus.padding + 'px';
      table.style.backgroundColor = 'rgb(' + menus.color.r + ', ' + menus.color.g + ', ' + menus.color.b + ')';
      table.style.opacity = '.9';
      table.style.borderCollapse = 'collapse';
      table.style.borderColor = 'rgb(' + menus.border.color.r + ', ' + menus.border.color.g + ', ' + menus.border.color.b + ')';
      table.style.borderWidth = menus.border.width + 'px';
      table.style.borderStyle = menus.border.style;
      var tableBody = document.createElement('tbody');
      tableBody.id = 'Menu Body';
      tableBody.style.fontFamily = menus.text.font;
      tableBody.style.fontSize = menus.text.size + 'pt';
      table.appendChild(tableBody);
      for (var i = 0; i < menus[type].options.length; i++) {
         var row = tableBody.insertRow(-1);
         row.row = i;
         row.id = i;
         row.style.height = menus.rows.height + 'px';
         row.style.backgroundColor = 'rgb(' + menus.rows.color.r + ', ' + menus.rows.color.g + ', ' + menus.rows.color.b + ')';
         if (i % 2 == 0) {
            row.style.backgroundColor = 'rgb(' + (menus.rows.color.r - 15) + ', ' + (menus.rows.color.g - 15) + ', ' + (menus.rows.color.b - 15) + ')';
         }
         row.style.width = 'inherit';
         row.style.margin = menus.rows.margin + 'px';
         row.style.padding = menus.rows.padding + 'px';
         for (var j = 0; j < menus.cells.count; j++) {
            var cell = row.insertCell(j);
            cell.style.margin = menus.cells.margin + 'px';
            cell.style.padding = menus.cells.padding + 'px';
            cell.style.width = menus.width / 2 + 'px';
            cell.style.borderColor = 'rgb(' + menus.cells.border.color.r + ', ' + menus.cells.border.color.g + ', ' + menus.cells.border.color.b + ')';
            cell.style.borderWidth = menus.cells.border.width + 'px';
            cell.style.borderStyle = menus.cells.border.style;
            if (j == 0) {
               cell.style.textAlign = 'right';
               if (menus[type].values[i].indexOf(' ') == 0) {
                  // If ' ' is first character (Empty space for entire value)
                  cell.style.fontWeight = 'bold';
               }
               cell.innerHTML = menus[type].options[i];
            } else if (j == 1) {
               cell.id = menus[type].options[i] + ' Cell';
               cell.style.textAlign = 'left';
               if (menus[type].values[i] == 'text') {
                  var textInput = new Text(type, i).elt;
               } else if (menus[type].values[i] == 'number') {
                  var numInput = new Num(type, i).elt;
                  // cell.appendChild(numInput);
               } else if (menus[type].values[i] == 'list') {
                  var listInput = new List(type, i).elt;
                  // cell.appendChild(listInput);
               } else if (menus[type].values[i].indexOf('radio') != -1) {
                  // If 'radio' is anywhere within string
                  for (var k = 0; k < parseInt(menus[type].values[i]); k++) {
                     // Creates integer of radio inputs as specified in value string
                     var radioInput = new Radio(type, i, k).elt;
                     // cell.appendChild(radioInput);
                  }
               } else if (menus[type].values[i] == 'button') {
                  var buttonInput = new Button(type, i).elt;
                  // cell.appendChild(buttonInput);
               } else {
                  cell.style.fontFamily = menus.text.font;
                  cell.style.fontSize = menus.text.size + 'px';
                  cell.innerHTML = menus[type].values[i];
               }
               if (menus[type].units[i] != undefined) {
                  var unitText = document.createElement('span');
                  // cell.appendChild(unitText);
                  unitText.innerHTML = ' ' + menus[type].units[i];
               }
            }
         }
      }
      if (typeof menus[type].editTexts == 'function') {
         menus[type].editTexts(datA);
      }
      if (typeof menus[type].editNums == 'function') {
         menus[type].editNums(datA);
      }
      if (typeof menus[type].editLists == 'function') {
         menus[type].editLists(datA);
      }
      if (typeof menus[type].editRadios == 'function') {
         menus[type].editRadios(datA);
      }
      if (typeof menus[type].editButtons == 'function') {
         menus[type].editButtons(datA);
      }
      var button = document.createElement('button');
      content.appendChild(button);
      button.id = type + 'Button';
      button.type = 'button';
      button.style.cursor = 'pointer';
      button.style.width = menus.button.width + 'px';
      button.style.height = menus.button.height + 'px';
      button.style.position = 'relative';
      button.style.left = (window.innerWidth - menus.button.width) / 2 + 'px';
      button.style.marginTop = menus.button.top + 'px';
      button.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
      button.style.borderRadius = menus.button.borderRadius + 'px';
      button.style.display = 'block';
      button.style.boxSizing = 'border-box';
      button.style.padding = '0px';
      button.style.borderWidth = '0px';
      button.style.borderBottomWidth = '2px';
      button.style.borderRaidus = '4px';
      button.style.borderColor = 'rgb(0, 0, 0)';
      button.style.outline = 'none';
      button.addEventListener('mouseover', function () {
         if (button.down != true) {
            button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
         } else {
            button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
         }
      });
      button.addEventListener('mouseout', function () {
         button.style.backgroundColor = 'rgb(' + menus.button.backgroundColor.r + ', ' + menus.button.backgroundColor.g + ', ' + menus.button.backgroundColor.b + ')';
      });
      button.addEventListener('mousedown', function () {
         button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 40) + ', ' + (menus.button.backgroundColor.g - 40) + ', ' + (menus.button.backgroundColor.b - 40) + ')';
         button.down = true;
      });
      button.addEventListener('mouseup', function () {
         button.style.backgroundColor = 'rgb(' + (menus.button.backgroundColor.r - 20) + ', ' + (menus.button.backgroundColor.g - 20) + ', ' + (menus.button.backgroundColor.b - 20) + ')';
         button.down = false;
      });
      button.addEventListener('click', function () {
         menus[type].submit(datA);
      });
      var buttonText = document.createElement('p');
      button.appendChild(buttonText);
      buttonText.style.margin = '0px';
      buttonText.style.padding = '0px';
      buttonText.style.color = 'rgb(' + menus.button.color.r + ', ' + menus.button.color.g + ', ' + menus.button.color.b + ')';
      buttonText.style.fontFamily = menus.button.font;
      buttonText.style.fontWeight = menus.button.weight;
      buttonText.style.fontSize = menus.button.size + 'px';
      buttonText.style.textAlign = 'center';
      buttonText.innerHTML = menus[type].button.text;
   }
   var footerDiv = document.createElement('div');
   container.appendChild(footerDiv);
   footerDiv.id = 'footerDiv';
   footerDiv.style.position = 'absolute';
   var footer = document.createElement('footer');
   footerDiv.appendChild(footer);
   footer.id = 'footer';
   footer.style.position = 'fixed';
   footer.style.bottom = '0px';
   footer.style.width = '100%';
   footer.style.height = menus.footer.height + 'px';
   footer.style.backgroundColor = 'rgb(' + menus.footer.backgroundColor.r + ', ' + menus.footer.backgroundColor.g + ', ' + menus.footer.backgroundColor.b + ')';
   footer.style.cursor = 'pointer';
   footer.addEventListener('click', function () {
      // Back link on footer so the entire height of the footer is link
      switch (type) {
         case 'create':
            title.return();
            break;
         case 'join':
            if (game.info.host == socket.id) {
               // If player is host (If player is joining directly after creating the game)
               socket.emit('Game Ended', game);
               title.return();
            } else {
               renderBrowser();
            }
            break;
         case 'spectate':
            renderBrowser();
            break;
         case 'respawn':
            menus.pauseSpectate.submit();
            break;
         case 'pauseGame':
            menus.pauseGame.submit();
            break;
         case 'pauseSpectate':
            menus.pauseSpectate.submit();
            break;
         case 'pauseTutorial':
            menus.pauseTutorial.submit();
            break;
      }
   });
   var back = document.createElement('p');
   footer.appendChild(back);
   back.style.position = 'relative';
   back.style.top = '50%';
   back.style.transform = 'translateY(-50%)';
   back.style.margin = '0px';
   back.style.marginLeft = '10px';
   back.style.color = 'rgb(' + menus.footer.color.r + ', ' + menus.footer.color.g + ', ' + menus.footer.color.b + ')';
   back.style.fontFamily = menus.footer.font;
   back.style.fontSize = menus.footer.size + 'px';
   back.innerHTML = '&larr; Back';
}

var Text = function Text(type, i) {
   var _this = this;

   var cell = document.getElementById('Menu Body').children[i].children[1];
   this.elt = document.createElement('input');
   cell.appendChild(this.elt);
   this.elt.id = menus[type].options[i] + ' Input';
   this.elt.style.width = menus.inputs.width + 'px';
   this.elt.style.height = menus.inputs.height + 'px';
   this.elt.type = 'text';
   this.elt.value = '';
   this.elt.style.autocomplete = 'on';
   this.elt.style.boxSizing = 'border-box';
   this.elt.style.textAlign = 'center';
   this.elt.style.fontFamily = menus.inputs.font;
   this.elt.style.fontSize = menus.inputs.size + 'px';
   this.elt.style.outline = 'none';
   this.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   this.elt.style.borderWidth = '0px';
   this.elt.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
   this.elt.style.borderBottomWidth = menus.inputs.border.width + 'px';
   this.elt.style.borderRadius = menus.inputs.border.radius + 'px';
   this.elt.addEventListener('focus', function () {
      _this.elt.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
   });
   this.elt.addEventListener('focusout', function () {
      _this.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   });
};

var Num = function Num(type, i) {
   var _this2 = this;

   var cell = document.getElementById('Menu Body').children[i].children[1];
   this.elt = document.createElement('input');
   cell.appendChild(this.elt);
   this.elt.id = menus[type].options[i] + ' Input';
   this.elt.style.width = menus.inputs.width + 'px';
   this.elt.style.height = menus.inputs.height + 'px';
   this.elt.type = 'number';
   this.elt.value = '';
   this.elt.style.autocomplete = 'on';
   this.elt.style.boxSizing = 'border-box';
   this.elt.style.textAlign = 'center';
   this.elt.style.fontFamily = menus.inputs.font;
   this.elt.style.fontSize = menus.inputs.size + 'px';
   this.elt.style.outline = 'none';
   this.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   this.elt.style.borderWidth = '0px';
   this.elt.style.borderBottomColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
   this.elt.style.borderBottomWidth = menus.inputs.border.width + 'px';
   this.elt.style.borderRadius = menus.inputs.border.radius + 'px';
   this.elt.addEventListener('focus', function () {
      _this2.elt.style.backgroundColor = 'rgb(' + menus.inputs.backgroundColor.r + ', ' + menus.inputs.backgroundColor.g + ', ' + menus.inputs.backgroundColor.b + ')';
   });
   this.elt.addEventListener('focusout', function () {
      _this2.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   });
};

var List = function List(type, i) {
   var cell = document.getElementById('Menu Body').children[i].children[1];
   this.elt = document.createElement('select');
   cell.appendChild(this.elt);
   this.elt.id = menus[type].options[i] + ' Input';
   this.elt.style.width = menus.inputs.width + 'px';
   this.elt.style.height = menus.inputs.height + 'px';
   this.elt.style.outline = 'none';
   this.elt.style.borderWidth = '0px';
   this.elt.style.borderBottomWidth = menus.inputs.border.width + 'px';
   this.elt.style.borderStyle = menus.inputs.border.style;
   this.elt.style.borderColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
   this.elt.style.borderRadius = menus.inputs.border.radius + 'px';
   this.elt.style.fontFamily = menus.inputs.font;
   this.elt.style.fontSize = menus.inputs.size + 'px';
};

var Radio = function Radio(type, i, k) {
   var _this3 = this;

   this.width = 16;
   this.height = 18;
   this.backgroundColor = { r: 255, g: 255, b: 255 };
   this.selectColor = { r: 190, g: 190, b: 190 };
   var cell = document.getElementById('Menu Body').children[i].children[1];
   this.elt = document.createElement('div');
   cell.appendChild(this.elt);
   this.elt.id = menus[type].options[i] + ' Input ' + k;
   this.elt.type = 'radio';
   this.order = k;
   this.value = false;
   this.elt.style.display = 'inline-block';
   this.elt.style.boxSizing = 'border-box';
   this.elt.style.position = 'relative';
   this.elt.style.top = '4px';
   this.elt.style.margin = '0px 5px 0px 5px';
   this.elt.style.width = menus.radios.width + 'px';
   this.elt.style.height = menus.radios.height + 'px';
   this.elt.style.outline = 'none';
   this.elt.style.borderWidth = '0px';
   this.elt.style.borderBottomWidth = menus.inputs.border.width + 'px';
   this.elt.style.borderStyle = menus.inputs.border.style;
   this.elt.style.borderColor = 'rgb(' + menus.inputs.border.color.r + ', ' + menus.inputs.border.color.g + ', ' + menus.inputs.border.color.b + ')';
   this.elt.style.borderRadius = menus.inputs.border.radius + 'px';
   this.elt.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
   this.elt.addEventListener('click', function () {
      _this3.elt.value = !_this3.elt.value;
      if (_this3.elt.value == false) {
         _this3.elt.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
      } else if (_this3.elt.value == true) {
         _this3.elt.style.backgroundColor = 'rgb(' + menus.radios.selectColor.r + ', ' + menus.radios.selectColor.g + ', ' + menus.radios.selectColor.b + ')';
      }
      for (var l = 0; l < parseInt(menus[type].values[i]); l++) {
         if (l == _this3.order) {
            continue;
         }
         var other = document.getElementById(menus[type].options[i] + ' Input ' + l);
         other.value = false;
         other.style.backgroundColor = 'rgb(' + menus.radios.backgroundColor.r + ', ' + menus.radios.backgroundColor.g + ', ' + menus.radios.backgroundColor.b + ')';
      }
   });
   var lineBreak = document.createElement('div');
   cell.appendChild(lineBreak);
   lineBreak.style.display = 'block';
   if (k + 1 < parseInt(menus[type].values[i])) {
      // All but last
      lineBreak.style.height = '2px';
   } else {
      // Last
      lineBreak.style.height = '6px';
   }
};

var Button = function Button(type, i) {
   var _this4 = this;

   this.backgroundColor = { r: 240, g: 240, b: 240 };
   this.border = menus.inputs.border;
   this.border = menus.inputs.border;
   var cell = document.getElementById('Menu Body').children[i].children[1];
   this.elt = document.createElement('button');
   cell.appendChild(this.elt);
   this.elt.id = menus[type].options[i] + ' Input';
   this.elt.type = 'button';
   this.elt.style.cursor = 'pointer';
   this.elt.style.position = 'relative';
   this.elt.style.top = '2px';
   this.elt.style.width = 45 + 'px';
   this.elt.style.height = menus.radios.height + 4 + 'px';
   this.elt.style.outline = 'none';
   this.elt.style.padding = '0px';
   this.elt.style.boxSizing = 'border-box';
   this.elt.style.borderWidth = '0px';
   this.elt.style.borderBottomWidth = this.border.width + 'px';
   this.elt.style.borderStyle = this.border.style;
   this.elt.style.borderColor = 'rgb(' + this.border.color.r + ', ' + this.border.color.g + ', ' + this.border.color.b + ')';
   this.elt.style.borderRadius = this.border.radius + 'px';
   this.elt.backgroundColor = { r: 240, g: 240, b: 240 };
   this.elt.style.backgroundColor = 'rgb(' + this.backgroundColor.r + ', ' + this.backgroundColor.g + ', ' + this.backgroundColor.b + ')';
   this.elt.addEventListener('mouseover', function () {
      if (_this4.elt.down != true) {
         _this4.elt.style.backgroundColor = 'rgb(' + (_this4.elt.backgroundColor.r - 20) + ', ' + (_this4.elt.backgroundColor.g - 20) + ', ' + (_this4.elt.backgroundColor.b - 20) + ')';
      } else {
         _this4.elt.style.backgroundColor = 'rgb(' + (_this4.elt.backgroundColor.r - 40) + ', ' + (_this4.elt.backgroundColor.g - 40) + ', ' + (_this4.elt.backgroundColor.b - 40) + ')';
      }
   });
   this.elt.addEventListener('mouseout', function () {
      _this4.elt.style.backgroundColor = 'rgb(' + _this4.elt.backgroundColor.r + ', ' + _this4.elt.backgroundColor.g + ', ' + _this4.elt.backgroundColor.b + ')';
   });
   this.elt.addEventListener('mousedown', function () {
      _this4.elt.style.backgroundColor = 'rgb(' + (_this4.elt.backgroundColor.r - 40) + ', ' + (_this4.elt.backgroundColor.g - 40) + ', ' + (_this4.elt.backgroundColor.b - 40) + ')';
      _this4.elt.down = true;
   });
   this.elt.addEventListener('mouseup', function () {
      _this4.elt.style.backgroundColor = 'rgb(' + (_this4.elt.backgroundColor.r - 20) + ', ' + (_this4.elt.backgroundColor.g - 20) + ', ' + (_this4.elt.backgroundColor.b - 20) + ')';
      _this4.elt.down = false;
   });
};
'use strict';

var getMessage = function getMessage() {
   var message = void 0;
   if (state == 'game' || state == 'spectate') {
      if (org.alive == true) {
         if (game.rounds.util == true) {
            if (game.rounds.waiting == true && game.rounds.delayed == false) {
               if (game.rounds.min - game.info.count == 1) {
                  message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
               } else {
                  message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
               }
            } else if (game.rounds.waiting == true && game.rounds.delayed == true) {
               // Delay at round start
               message = 'Round begins in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            } else if (game.rounds.waiting == false && game.rounds.delayed == true) {
               // Delay at round end
               message = 'Round ends in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            }
         }
      } else if (org.alive == false) {
         if (game.rounds.util == true) {
            if (game.rounds.waiting == true && game.rounds.delayed == false) {
               // Waiting for more players to join, not counting down yet
               if (game.rounds.min - game.info.count == 1) {
                  message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
               } else {
                  message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
               }
            } else if (game.rounds.waiting == true && game.rounds.delayed == true) {
               // Enough players have joined, counting down
               message = 'Round begins in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            } else if (game.rounds.waiting == false && game.rounds.delayed == false) {
               // Round in progress
               message = 'Wait for the round to complete';
            } else if (game.rounds.waiting == false && game.rounds.delayed == true) {
               message = 'Round ends in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
            }
         } else {
            message = 'Press \'' + Controls.respawn.key + '\' to Spawn';
         }
      }
   } else if (state == 'tutorial') {
      switch (tutorial.task) {
         case 'move':
            {
               message = 'Use W-A-S-D (recommended) or the arrow keys to move';
               break;
            }
         case 'survive':
            {
               message = 'If the crosshair is too far from the organism, it will die';
               break;
            }
         case 'extend':
            {
               message = 'Use the EXTEND ability to increase the organism\'s size';
               break;
            }
         case 'immortality':
            {
               message = 'The IMMORTALITY ability will stop the natural atrophe of cells';
               break;
            }
         case 'neutralize':
            {
               message = 'NEUTRALIZE will create a bubble of safety from enemy attacks';
               break;
            }
         case 'shoot':
            {
               message = 'To COMPRESS or FREEZE an enemy, press the ability key to launch a spore in the direction of the cursor\nThen press it again to activate the ability';
               break;
            }
         case 'compress':
            {
               message = 'On hit, COMPRESS shrinks the size of the targeted enemy';
               break;
            }
         case 'freeze':
            {
               message = 'On hit, FREEZE halts all natural processes within the enemy organism';
               break;
            }
         case 'toxin':
            {
               message = 'TOXIN creates a localized bubble in which only you can survive';
               break;
            }
         case 'spore':
            {
               if (tutorial.stopped == true) {
                  message = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
               } else {
                  message = 'Use SPORE to jettison outer cells in all directions (Space Bar)';
               }
               break;
            }
         case 'secrete':
            {
               message = 'Reactivate the ability to cause all spores to secrete an acid, killing enemy cells';
               break;
            }
         case 'done':
            {
               message = 'Now that you\'re ready, press ESC to return to the menu';
               break;
            }
      }
   }
   return message;
};

function renderMessages() {
   if (Messages == true) {
      var message = getMessage();
      if (message != undefined) {
         var src = getSrc();
         fill(src.world.background.r, src.world.background.g, src.world.background.b); // Message shadows are rendered in renderWorld()
         stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
         strokeWeight(1);
         textFont('Helvetica');
         textSize(14);
         if (src.world.color == 'black') {
            textStyle(NORMAL);
         } else if (src.world.color == 'white') {
            textStyle(BOLD);
         }
         var breaks = freq(message, '\n');
         var width = messageWidth(message);
         rect(25 + width / 2, 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
         fill(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b); // Same color as border to maintain contrast with background
         noStroke();
         text(message, 25, 30);
      }
   }
}

var messageWidth = function messageWidth(messagE) {
   var message = messagE;
   var lines = message.split('\n');
   var count = lines.length;
   var lengths = [];
   for (var i = 0; i < count; i++) {
      lengths.push(lines[i].length);
   }
   return textWidth(lines[lengths.indexOf(max(lengths))]);
};
'use strict';

var org;
var Org = function Org(datA) {
   var _this = this;

   // datA: { player: , color: , skin: , team: , spectate: , pos: , title: } (color and skin are required)
   this.player = datA.player;
   this.color = datA.color;
   this.skin = datA.skin;
   this.team = datA.team;
   var src = getSrc();
   if (src != undefined && src.src == 'game') {
      if (game.rounds.util == true) {
         this.ready = false; // org.ready ensures that org will only be forcibly respawned once
      }
      if (game.info.mode == 'srv' && game.rounds.waiting == false) {
         this.spawn = false;
      } else {
         this.spawn = true; // Allowance to spawn
      }
      for (var i = 0; i < game.board.list.length; i++) {
         if (game.board.list[i].player == this.player) {
            // Find player name in leaderboard list
            this.name = game.board.list[i].name;
         }
      }
   }
   if (datA.spectate == true) {
      this.speed = _spectatespeed; // Faster movement when spectating
   } else {
      this.speed = _movespeed; // Speed of position movement
   }
   this.cells = [];
   this.count = 0;
   this.x = function () {
      // The average of all cell x values 
      var sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].x;
      }
      var average = sum / this.count;
      return average;
   };
   this.y = function () {
      // The average of all cell y values
      var sum = 0;
      for (var i = 0; i < this.count; i++) {
         sum += this.cells[i].y;
      }
      var average = sum / this.count;
      return average;
   };
   if (datA.pos != undefined) {
      this.pos = datA.pos;
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
         for (var _i = 0; _i < game.info.count; _i++) {
            // Org Overlap
            for (var j = 0; j < game.orgs[_i].count; j++) {
               if (game.orgs[_i].cells[j].x - game.orgs[_i].cells[j].width <= this.pos.x && game.orgs[_i].cells[j].x + game.orgs[_i].cells[j].width >= this.pos.x && game.orgs[_i].cells[j].y - game.orgs[_i].cells[j].height <= this.pos.y && game.orgs[_i].cells[j].y + game.orgs[_i].cells[j].height >= this.pos.y) {
                  // If position collides with enemy cell (Full width buffer is intended)
                  rePos = true;
                  break;
               }
            }
            if (rePos == true) {
               break;
            }
            var abilitY = game.abilities[_i];
            if (abilitY.secrete.value == true) {
               // Spore Secretions Overlap
               for (var _j = 0; _j < abilitY.spore.count; _j++) {
                  var cell = abilitY.spore.spores[_j];
                  if (sqrt(sq(this.pos.x - cell.x) + sq(this.pos.y - cell.y)) <= abilitY.secrete.radius) {
                     rePos = true;
                     break;
                  }
               }
            }
            for (var _j2 = 0; _j2 < 3; _j2++) {
               // Shoot Secretions Overlap
               if (abilitY.shoot.secrete[_j2].value == true) {
                  var _cell = abilitY.shoot.spore[_j2];
                  var sec = abilitY.shoot.secrete[_j2];
                  if (sqrt(sq(this.pos.x - _cell.x) + sq(this.pos.y - _cell.y)) <= sec.radius) {
                     rePos = true;
                     break;
                  }
               }
            }
            if (abilitY.toxin.value == true) {
               // Toxin Overlap
               if (sqrt(sq(this.pos.x - abilitY.toxin.x) + sq(this.pos.y - abilitY.toxin.y)) <= abilitY.toxin.radius) {
                  rePos = true;
               }
            }
            if (rePos == true) {
               break;
            }
         }
      } while (rePos == true);
   }
   this.off = { // Offset is the difference between pos and center
      x: this.pos.x - center.x,
      y: this.pos.y - center.y
   };
   this.col = 10; // Collision radius (square) for crosshair
   this.target = undefined; // ID of player which this org is currently targeting
   this.clickbox = { // Targeting box for other orgs to click
      width: undefined,
      height: undefined,
      x: undefined,
      y: undefined,
      left: this.pos.x,
      right: this.pos.x,
      top: this.pos.y,
      bottom: this.pos.y,
      buffer: _cellwidth / 2,
      color: this.color
   };
   this.coefficient = -27.5;
   this.range = 50;
   this.alive = false;
   this.hit = undefined;
   this.count = this.cells.length;
   this.intervals = [];
   this.clearIntervals = function () {
      for (var _i2 = 0; _i2 < _this.intervals.length; _i2++) {
         clearInterval(_this.intervals[_i2]);
      }
      _this.intervals = [];
   };
   this.tracker = {
      start: undefined,
      end: undefined,
      elap: undefined
   };
};

var Cell = function Cell(X, Y, orG) {
   this.player = orG.player;
   this.width = _cellwidth; // or 3x3
   this.height = _cellwidth;
   this.x = X;
   this.y = Y;
   this.color = orG.color;
   this.r = function () {
      // Distance from org center
      var distance = sqrt(sq(this.x - org.x()) + sq(this.y - org.y()));
      return distance;
   };
   this.d = function (orG) {
      // Distance from target (Position in world)
      var distance = sqrt(sq(this.x - orG.pos.x) + sq(this.y - orG.pos.y));
      return distance;
   };
};

function renderOrgs() {
   var src = getSrc();
   for (var i = 0; i < src.orgs.length; i++) {
      for (var j = 0; j < src.orgs[i].count; j++) {
         var cell = src.orgs[i].cells[j];
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

var getRegionInfo = function getRegionInfo(orG) {
   var enclosed = [];
   var exposed = [];
   var adjacent = [];
   for (var i = 0; i < orG.count; i++) {
      var test = { x: undefined, y: undefined };
      var left = false;
      var top = false;
      var right = false;
      var bottom = false;
      for (var _j3 = 0; _j3 < orG.count; _j3++) {
         if (i != _j3) {
            test = { // Left
               x: orG.cells[i].x - orG.cells[i].width,
               y: orG.cells[i].y
            };
            if (test.x == orG.cells[_j3].x && test.y == orG.cells[_j3].y) {
               left = true; // There is a friendly cell to the left
            }
            test = { // Top
               x: orG.cells[i].x,
               y: orG.cells[i].y - orG.cells[i].height
            };
            if (test.x == orG.cells[_j3].x && test.y == orG.cells[_j3].y) {
               top = true; // There is a friendly cell to the top
            }
            test = { // Right
               x: orG.cells[i].x + orG.cells[i].width,
               y: orG.cells[i].y
            };
            if (test.x == orG.cells[_j3].x && test.y == orG.cells[_j3].y) {
               right = true; // There is a friendly cell to the right
            }
            test = { // Bottom
               x: orG.cells[i].x,
               y: orG.cells[i].y + orG.cells[i].height
            };
            if (test.x == orG.cells[_j3].x && test.y == orG.cells[_j3].y) {
               bottom = true; // There is a friendly cell to the bottom
            }
         }
      }
      if (left == true && top == true && right == true && bottom == true) {
         // If cell is enclosed on all sides by friendly cells
         enclosed.push(orG.cells[i]);
      } else {
         // If cell is not enclosed on all sides by friendly cells
         exposed.push(orG.cells[i]);
      }
      if (left == false) {
         // Push all empty regions adjacent to org
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
   for (var j = 0; j < adjacent.length; j++) {
      // Splice out empty regions adjacent to multiple cells
      for (var k = 0; k < adjacent.length; k++) {
         if (j != k) {
            // If adjacent[j] and adjacent[k] are different regions
            if (adjacent[k].x == adjacent[j].x && adjacent[k].y == adjacent[j].y) {
               // If region is repeated
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
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function spawn(datA) {
   state = 'game';
   org = new Org({ player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, spectate: false });
   org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
   org.count++;
   socket.emit('Player Joined', { info: game.info, org: org, ability: ability });
}

function spectate(datA) {
   state = 'spectate';
   socket.emit('Spectator Joined', game);
   org = new Org({ player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, pos: datA.pos, spectate: true });
}

function renderUI() {
   var src = getSrc();
   // Crosshair
   if (src.src != 'tutorial') {
      noFill();
      stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
      strokeWeight(1);
      line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
      line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);
   }

   // Targeting
   if (org.target != undefined) {
      // If org is targenting a player
      for (var i = 0; i < src.orgs.length; i++) {
         if (src.orgs[i].player == org.target) {
            // Find targeted org
            noFill();
            stroke(src.orgs[i].clickbox.color.r, src.orgs[i].clickbox.color.g, src.orgs[i].clickbox.color.b);
            strokeWeight(1);
            rect(src.orgs[i].clickbox.x, src.orgs[i].clickbox.y, src.orgs[i].clickbox.width, src.orgs[i].clickbox.height, 2); // Draw Target Box
         }
      }
   }

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

      var _loop = function _loop(_i) {
         for (var j = 0; j < game.board.list.length; j++) {
            if (game.orgs[_i].player == game.board.list[j].player) {
               var x = function x() {
                  // x() and y() cannot be accessed through orgs array, so code is copied and edited from org file
                  var sum = 0;
                  for (var k = 0; k < game.orgs[_i].count; k++) {
                     sum += game.orgs[_i].cells[k].x;
                  }
                  var average = sum / game.orgs[_i].count;
                  return average;
               };
               var y = function y() {
                  var sum = 0;
                  for (var k = 0; k < game.orgs[_i].count; k++) {
                     sum += game.orgs[_i].cells[k].y;
                  }
                  var average = sum / game.orgs[_i].count;
                  return average;
               };
               if (game.board.list[j].name.length <= 30) {
                  text(game.board.list[j].name, x() - textWidth(game.board.list[j].name) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[_i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               } else {
                  text(game.board.list[j].name.slice(0, 20) + '...', x() - textWidth(game.board.list[j].name.slice(0, 20)) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[_i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
               }
            }
         }
      };

      for (var _i = 0; _i < game.info.count; _i++) {
         _loop(_i);
      }
   }

   // Ability Cooldowns
   if (src.stopped != true) {
      for (var _i2 in ability) {
         // Regular Cooldowns
         if (_typeof(ability[_i2]) == 'object' && _i2 !== 'shoot') {
            if (ability[_i2].cooling == true) {
               cooldown(ability[_i2]);
            }
         }
      }
      for (var _i3 = 0; _i3 < ability.shoot.value.length; _i3++) {
         // Shoot Cooldown
         if (ability.shoot.cooling[_i3] == true) {
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
      for (var _i4 = 0; _i4 < 4; _i4++) {
         for (var j in ability) {
            if (_typeof(ability[j]) == 'object') {
               if (ability[j].i == _i4) {
                  // Find corresponding ability set to tooltip
                  if (ability[j].activated == true) {
                     // Find corresponding activated ability to tooltip
                     if (j == 'spore' && ability.secrete.value == true) {
                        continue; // Do not draw spore
                     }
                     if (j == 'secrete' && ability.secrete.value == false) {
                        continue; // Do not draw secrete
                     }
                     fill(215);
                     stroke(0);
                     strokeWeight(1);
                     rect(center.x - 150 + _i4 * 100, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
                     var letter = void 0;
                     if (_i4 == 0) {
                        letter = Controls.ability1.key;
                     } else if (_i4 == 1) {
                        letter = Controls.ability2.key;
                     } else if (_i4 == 2) {
                        letter = Controls.ability3.key;
                     } else if (_i4 == 3) {
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
                     text(letter, center.x - 150 + _i4 * 100 - textWidth(letter) / 2, height * 9 / 10 + 30 + 13);
                     fill(0);
                     stroke(0);
                     strokeWeight(1);
                     ellipse(center.x - 150 + _i4 * 100, height * 9 / 10, 30); // Background ellipse; Necessary to cover the key tip
                     fill(215);
                     noStroke();
                     if (ability[j].j == 0) {
                        // If defensive ability (or spore)
                        // Ability
                        if (ability[j].value == true) {
                           // If during ability
                           arc(center.x - 150 + _i4 * 100, height * 9 / 10, 29, 29, -90, -90 - (current - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                        } else if (ability[j].value == false && ability[j].can == false) {
                           // If during cooldown
                           arc(center.x - 150 + _i4 * 100, height * 9 / 10, 29, 29, -90, -90 + (current - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                        } else if (ability[j].value == false && ability[j].can == true) {
                           // If idling
                           ellipse(center.x - 150 + _i4 * 100, height * 9 / 10, 29);
                        }
                     } else if (ability[j].j == 1) {
                        // If offensive ability
                        if (ability[j].i < 3) {
                           // If one of first three abilities (not secrete)
                           noStroke();
                           // Ability
                           if (ability[j].can == true) {
                              // Idle
                              ellipse(center.x - 150 + _i4 * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && current - ability[j].start <= ability[j].time) {
                              // If during ability
                              arc(center.x - 150 + _i4 * 100, height * 9 / 10, 29, 29, -90, -90 - (current - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                           } else if (ability[j].can == false && current - ability[j].start > ability[j].time) {
                              // If during cooldown
                              arc(center.x - 150 + _i4 * 100, height * 9 / 10, 29, 29, -90, -90 + (current - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                           }
                           // Shoot
                           if (j != 'toxin') {
                              // Toxin does not shoot
                              stroke(0);
                              if (ability.shoot.value[_i4] == false && ability.shoot.can[_i4] == true) {
                                 // Idle
                                 ellipse(center.x - 150 + _i4 * 100 - 41, height * 9 / 10, 8);
                              } else if (ability.shoot.value[_i4] == true && ability.shoot.can[_i4] == false) {
                                 // If is shooting
                                 arc(center.x - 150 + _i4 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (current - ability.shoot.start[_i4]) / ability.shoot.time * 360); // Ability timeout timer
                              } else if (ability.shoot.secrete[_i4].value == true) {
                                 // If is secreting
                                 arc(center.x - 150 + _i4 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (ability.shoot.end[_i4] - ability.shoot.start[_i4]) / ability.shoot.time * 360 - (current - ability.shoot.secrete[_i4].start) / ability.secrete.time * (360 - (ability.shoot.end[_i4] - ability.shoot.start[_i4]) / ability.shoot.time * 360)); // Secretion timer
                              } else if (current - ability.shoot.secrete[_i4].end < ability.shoot.cooldown[_i4]) {
                                 arc(center.x - 150 + _i4 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 + (current - ability.shoot.secrete[_i4].end) / ability.shoot.cooldown[_i4] * 360); // Shoot cooldown timer (if no hit)
                              }
                           }
                        } else if (ability[j].i == 3) {
                           // Secrete
                           if (ability[j].can == true) {
                              // Idle
                              ellipse(center.x - 150 + _i4 * 100, height * 9 / 10, 29);
                           } else if (ability[j].can == false && current - ability[j].start <= ability[j].time) {
                              // If during ability
                              arc(center.x - 150 + _i4 * 100, height * 9 / 10, 29, 29, -90, -90 - (ability.spore.end - ability.spore.start) / ability.spore.time * 360 - (current - ability[j].start) / ability[j].time * (360 - (ability.spore.end - ability.spore.start) / ability.spore.time * 360)); // Ability cooldown timer
                           }
                        }
                     }
                     itemize(items[j], 1, { r: 0, g: 0, b: 0 }, center.x - 150 + _i4 * 100, height * 9 / 10);
                  }
                  if (ability[j].value == true && ability[j].i < 3) {
                     // Ability Activated Tooltip (Not for spore/secrete)
                     if (ability[j].j == 0 || ability[j].i == 3) {
                        // If defensive ability (+ secrete)
                        fill(66, 244, 176); // Green
                        noStroke();
                        ellipse(center.x - 150 + _i4 * 100 - 9, height * 9 / 10 - 37, 5, 5);
                     } else if (ability[j].j == 1 && ability[j].i != 3) {
                        // If offensive ability (No secrete)
                        fill(255, 141, 135); // Red
                        noStroke();
                        ellipse(center.x - 150 + _i4 * 100 + 9, height * 9 / 10 - 37, 5, 5);
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
      var _letter = void 0;
      if (ability.tag.i == 0) {
         _letter = Controls.ability1.key;
      } else if (ability.tag.i == 1) {
         _letter = Controls.ability2.key;
      } else if (ability.tag.i == 2) {
         _letter = Controls.ability3.key;
      } else if (ability.tag.i == 3) {
         if (Controls.ability4.key == ' ') {
            _letter = '_';
         } else {
            _letter = Controls.ability4.key;
         }
      }
      fill(0);
      noStroke();
      textSize(14);
      textFont('Consolas');
      textStyle(BOLD);
      text(_letter, center.x - textWidth(_letter) / 2, height * 9 / 10 + 30 + 13); // Letter text
      // Ability Circles
      fill(0);
      stroke(0);
      strokeWeight(1);
      ellipse(center.x, height * 9 / 10, 30); // Background ellipse
      fill(215);
      noStroke();
      if (ability.tag.can == true) {
         // Idle
         ellipse(center.x, height * 9 / 10, 29);
      } else if (ability.tag.can == false && current - ability.tag.start <= ability.tag.time) {
         // If during ability
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 - (current - ability.tag.start) / ability.tag.time * 360); // Ability timeout timer
      } else if (ability.tag.can == false && current - ability.tag.start > ability.tag.time) {
         // If during cooldown
         arc(center.x, height * 9 / 10, 29, 29, -90, -90 + (current - ability.tag.end) / ability.tag.cooldown * 360); // Ability cooldown timer
      }
      itemize(items.tag, 1, { r: 0, g: 0, b: 0 }, center.x, height * 9 / 10);
      // Shoot
      fill(215);
      stroke(0);
      if (ability.shoot.value[ability.tag.i] == false && ability.shoot.can[ability.tag.i] == true) {
         // Idle
         ellipse(center.x - 41, height * 9 / 10, 8);
      } else if (ability.shoot.value[ability.tag.i] == true && ability.shoot.can[ability.tag.i] == false) {
         // If is shooting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (current - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360); // Ability timeout timer
      } else if (ability.shoot.secrete[ability.tag.i].value == true) {
         // If is secreting
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360 - (current - ability.shoot.secrete[ability.tag.i].start) / ability.secrete.time * (360 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360)); // Secretion timer
      } else if (current - ability.shoot.secrete[ability.tag.i].end < ability.shoot.cooldown[ability.tag.i]) {
         arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 + (current - ability.shoot.secrete[ability.tag.i].end) / ability.shoot.cooldown[ability.tag.i] * 360); // Shoot cooldown timer (if no hit)
      }
      if (ability.tag.value == true) {
         // Ability Activated Tooltip (only green for tag)
         fill(66, 244, 176); // Green
         noStroke();
         ellipse(center.x - 9, height * 9 / 10 - 37, 5, 5);
      }
   }
   translate(-org.off.x, -org.off.y);
}

var getSrc = function getSrc() {
   var src = void 0;
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
   var keys = '';
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
   if (!org.intervals.length) {
      // org.intervals array must be of length 0
      org.intervals.push(setInterval(function () {
         return runLoop();
      }, _ofrequency));
   }
}

function runLoop() {
   // Rounds
   var current = new Date();
   if (game.rounds.util == true) {
      if (game.info.host == socket.id) {
         // Only if player is host
         if (game.rounds.waiting == true && game.rounds.delayed == false && game.info.count >= game.rounds.min) {
            // If waiting, not delayed, and have minimum players
            socket.emit('Round Delay', game);
            game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
         } else if (game.rounds.waiting == true && game.rounds.delayed == true && current - game.rounds.delaystart >= game.rounds.delaytime - 1000 && org.ready == false) {
            // Only host; If 1 second left in round-begin delay
            socket.emit('Force Spawn', game.info);
         }
      }
      if (game.info.mode == 'srv') {
         // Survival End-Game
         if (game.rounds.waiting == false && game.rounds.delayed == false && game.info.count == 1 && game.players[0] == socket.id) {
            // If during game and player is winner
            for (var i = 0; i < game.board.list.length; i++) {
               if (game.board.list[i].player == socket.id) {
                  socket.emit('Round End', game.info);
                  game.board.list[i].wins++;
                  orderBoard(game.board.list);
                  socket.emit('Board', game.board);
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
   if (game.info.mode == 'ctf') {
      if (game.flag.carried == false) {
         if (org.pos.x - org.col > game.flag.x - game.flag.width / 2 && org.pos.x + org.col < game.flag.x + game.flag.width / 2 && org.pos.y - org.col > game.flag.y - game.flag.height / 2 && org.pos.y + org.col < game.flag.y + game.flag.height / 2) {
            game.flag.carried = true;
            game.flag.carrier = socket.id;
            socket.emit('Flag', game);
         }
      }
   }

   // Dots
   // for (let i = 0; i < game.world.dots.count; i++) {
   //    let dot = game.world.dots.array[i];
   //    let broken = false;
   //    for (let j = 0; j < org.count; j++) {
   //       let cell = org.cells[j];
   //       if (dot.x >= cell.x - cell.width / 2 && dot.x <= cell.x + cell.width / 2 && dot.y >= cell.y - cell.height / 2 && dot.y <= cell.y + cell.height / 2) {
   //          let doT = {
   //             i: dot.i, 
   //             r: random(game.world.dots.r.min, game.world.dots.r.max), 
   //             x: random(0, game.world.x + game.world.width), 
   //             y: random(0, game.world.y + game.world.height)
   //          };
   //          game.world.dots.array.splice(dot.i, 1, doT); // Replace eaten dot with new random doT
   //          socket.emit('World', game.world);
   //          broken = true;
   //          break;
   //       }
   //    }
   //    if (broken == true) {
   //       break;
   //    }
   // }

   socket.emit('Org', org);
   if (org.count == 0) {
      for (var _i5 = 0; _i5 < game.board.list.length; _i5++) {
         if (game.board.list[_i5].player == socket.id) {
            // Add death to leaderboard
            game.board.list[_i5].deaths++; // Add 1 to deaths counter
            orderBoard(game.board.list); // Sort the list by kills then deaths
            socket.emit('Board', game.board); // Send updated board to server
         }
      }
      if (org.hit != org.player) {
         // Cannot gain kill for suicide
         for (var _i6 = 0; _i6 < game.board.list.length; _i6++) {
            if (game.board.list[_i6].player == org.hit) {
               // Find killer in leaderboard list
               game.board.list[_i6].kills++;
               orderBoard(game.board.list);
               socket.emit('Board', game.board);
               break;
            }
         }
      }
      die(true);
   }
}

function grow(orG) {
   var org = orG;
   // Avoid double intervals
   if (org.tracker.start) {
      // If tracker has been started
      org.tracker.end = Date.now();
      org.tracker.elap = org.tracker.end - org.tracker.start;
   }
   if (org.tracker.elap < _ofrequency * .6) {
      switch (state) {
         case 'game': // Only necessary in game, others states may be added
         case 'pauseGameMenu':
            org.clearIntervals();
            org.intervals.push(setInterval(function () {
               return runLoop();
            }, _ofrequency));
            break;
      }
   }
   var src = getSrc();
   var ability = void 0;
   for (var i = 0; i < src.abilities.length; i++) {
      if (src.abilities[i].player == org.player) {
         ability = src.abilities[i];
         break;
      }
   }
   // Birth
   var regions = getRegionInfo(org);
   if (ability.freeze.value == false) {
      // If org is not Frozen (cannot birth or die naturally)
      // for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
      // if (ability.poison.value == true) {
      // 	if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
      // 		continue;
      // 	}
      // }
      for (var _i7 = 0; _i7 < regions.adjacent.length; _i7++) {
         // Only Adjacent Regions Can Produce New Cells
         // Don't birth new cell outside world boundary
         if (src.world != undefined) {
            if (src.world.type == 'rectangle') {
               if (regions.adjacent[_i7].x - _cellwidth / 2 <= src.world.x || regions.adjacent[_i7].x + _cellwidth / 2 >= src.world.x + src.world.width || regions.adjacent[_i7].y - _cellwidth / 2 <= src.world.x || regions.adjacent[_i7].y + _cellwidth / 2 >= src.world.y + src.world.height) {
                  // If new cell would be outside world boundary
                  continue;
               }
            } else if (src.world.type == 'ellipse') {
               var a = src.world.width / 2;
               var b = src.world.height / 2;
               var x = regions.adjacent[_i7].x - _cellwidth / 2 - a;
               var y = regions.adjacent[_i7].y - _cellwidth / 2 - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) {
                  // If top-left corner is outside ellipse
                  continue;
               }
               x = regions.adjacent[_i7].x + _cellwidth / 2 - a;
               y = regions.adjacent[_i7].y - _cellwidth / 2 - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) {
                  // If top-right corner is outside ellipse
                  continue;
               }
               x = regions.adjacent[_i7].x + _cellwidth / 2 - a;
               y = regions.adjacent[_i7].y + _cellwidth / 2 - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) {
                  // If bottom-right corner is outside ellipse
                  continue;
               }
               x = regions.adjacent[_i7].x - _cellwidth / 2 - a;
               y = regions.adjacent[_i7].y + _cellwidth / 2 - b;
               if (sq(x) / sq(a) + sq(y) / sq(b) >= 1) {
                  // If bottom-left corner is outside ellipse
                  continue;
               }
            }
         }
         // Don't birth new cell on top of an opponent org
         var overlap = false;
         for (var j = 0; j < src.orgs.length; j++) {
            if (src.orgs[j].player == org.player) {
               // If org is player's org
               continue;
            }
            for (var k = 0; k < src.orgs[j].count; k++) {
               if (regions.adjacent[_i7].x + _cellwidth / 2 >= src.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[_i7].x + _cellwidth / 2 <= src.orgs[j].cells[k].x + _cellwidth / 2) {
                  // If right side collides
                  if (regions.adjacent[_i7].y + _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y + _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) {
                     // If bottom side collides
                     overlap = true;
                  } else if (regions.adjacent[_i7].y - _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y - _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) {
                     // If top side collides
                     overlap = true;
                  }
               } else if (regions.adjacent[_i7].x - _cellwidth / 2 >= src.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[_i7].x - _cellwidth / 2 <= src.orgs[j].cells[k].x + _cellwidth / 2) {
                  // If left side collides
                  if (regions.adjacent[_i7].y + _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y + _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) {
                     // If bottom side collides
                     overlap = true;
                  } else if (regions.adjacent[_i7].y - _cellwidth / 2 >= src.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y - _cellwidth / 2 <= src.orgs[j].cells[k].y + _cellwidth / 2) {
                     // If top side collides
                     overlap = true;
                  }
               }
            }
         }
         if (overlap == true) {
            continue;
         }
         // Birth new cell accordingly
         if (ability.compress.value ^ ability.extend.value == 0) {
            // compress.value NOT XOR extend.value
            org.coefficient = -27.5;
            org.range = _range;
         } else if (ability.compress.value == true) {
            org.coefficient = -31.5;
            org.range = _range - 10;
         } else if (ability.extend.value == true) {
            org.coefficient = -25.5;
            org.range = _range + 20;
         }
         var chance = org.coefficient * Math.log(sqrt(sq(regions.adjacent[_i7].x - org.pos.x) + sq(regions.adjacent[_i7].y - org.pos.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100
         if (random(0, 100) <= chance) {
            var repeat = false;
            for (var _j = 0; _j < org.count; _j++) {
               if (regions.adjacent[_i7].x == org.cells[_j].x && regions.adjacent[_i7].y == org.cells[_j].y) {
                  repeat = true;
                  break;
               }
            }
            if (repeat == false) {
               org.cells.push(new Cell(regions.adjacent[_i7].x, regions.adjacent[_i7].y, org));
               org.count++;
            }
         }
      }
   }

   // Natural Death
   if (ability.freeze.value == false) {
      // If org is not Frozen (cannot birth or die naturally)
      if (ability.immortality.value == false) {
         // If org is not Immortal
         for (var _i8 = 0; _i8 < regions.exposed.length; _i8++) {
            // Only Exposed Cells Can Die
            var _chance = org.coefficient * Math.log(-regions.exposed[_i8].d(org) + (org.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
            if (regions.exposed[_i8].d(org) > org.range) {
               // If exposed cell is outside maximum radius
               for (var _j2 = 0; _j2 < org.count; _j2++) {
                  if (regions.exposed[_i8].x == org.cells[_j2].x && regions.exposed[_i8].y == org.cells[_j2].y) {
                     // Find exposed cell within org cells array
                     org.cells.splice(_j2, 1);
                     org.count--;
                     regions.exposed.splice(_i8, 1);
                     _i8--;
                     _j2--;
                     break;
                  }
               }
               continue;
            }
            if (src.world.type == 'rectangle' && (regions.exposed[_i8].x < src.world.x || regions.exposed[_i8].x > src.world.x + src.world.width || regions.exposed[_i8].y < src.world.y || regions.exposed[_i8].y > src.world.y + src.world.height)) {
               // If cell is outside rectangular world
               for (var _j3 = 0; _j3 < org.count; _j3++) {
                  if (regions.exposed[_i8].x == org.cells[_j3].x && regions.exposed[_i8].y == org.cells[_j3].y) {
                     org.cells.splice(_j3, 1);
                     org.count--;
                     regions.exposed.splice(_i8, 1);
                     _i8--;
                     _j3--;
                     break;
                  }
               }
            } else if (src.world.type == 'ellipse' && sq(regions.exposed[_i8].x - src.world.x - src.world.width / 2) / sq(src.world.width / 2) + sq(regions.exposed[_i8].y - src.world.y - src.world.height / 2) / sq(src.world.height / 2) > 1) {
               // If outside elliptical world
               for (var _j4 = 0; _j4 < org.count; _j4++) {
                  if (regions.exposed[_i8].x == org.cells[_j4].x && regions.exposed[_i8].y == org.cells[_j4].y) {
                     // Identify cell
                     org.cells.splice(_j4, 1);
                     org.count--;
                     regions.exposed.splice(_i8, 1);
                     _i8--;
                     _j4--;
                     break;
                  }
               }
            }
            if (random(0, 100) <= _chance) {
               for (var _j5 = 0; _j5 < org.count; _j5++) {
                  if (regions.exposed[_i8].x == org.cells[_j5].x && regions.exposed[_i8].y == org.cells[_j5].y) {
                     org.cells.splice(_j5, 1);
                     org.count--;
                     regions.exposed.splice(_i8, 1);
                     _i8--;
                     _j5--;
                     break;
                  }
               }
            }
         }
      }
   }

   // Abilities
   for (var _i9 = 0; _i9 < src.orgs.length; _i9++) {
      if (src.orgs[_i9].team == org.team && typeof team == 'string' && src.orgs[_i9].player != socket.id) {
         // If is friendly org but not own org
         continue; // No friendly fire but can hurt self
      }
      if (src.abilities[_i9].secrete.value == true) {
         // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
         for (var _j6 = 0; _j6 < org.count; _j6++) {
            for (var _k = 0; _k < src.abilities[_i9].spore.count; _k++) {
               if (sqrt(sq(org.cells[_j6].x - src.abilities[_i9].spore.spores[_k].x) + sq(org.cells[_j6].y - src.abilities[_i9].spore.spores[_k].y)) <= src.abilities[_i9].secrete.radius) {
                  // If center of cell is within secrete circle (subject to change)
                  var skip = false;
                  for (var l = 0; l < src.abilities.length; l++) {
                     if (src.abilities[l].neutralize.value == true && sqrt(sq(org.cells[_j6].x - src.abilities[l].neutralize.x) + sq(org.cells[_j6].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) {
                        // If center of cell is within neutralize circle
                        skip = true;
                        break;
                     }
                  }
                  if (skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.cells.splice(_j6, 1);
                  org.count--;
                  _j6--;
                  org.hit = src.abilities[_i9].player;
                  break;
               }
            }
         }
      }
      for (var _j7 = 0; _j7 < 3; _j7++) {
         // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
         if (src.abilities[_i9].shoot.secrete[_j7].value == true) {
            for (var _k2 = 0; _k2 < org.count; _k2++) {
               if (sqrt(sq(org.cells[_k2].x - src.abilities[_i9].shoot.spore[_j7].x) + sq(org.cells[_k2].y - src.abilities[_i9].shoot.spore[_j7].y)) <= src.abilities[_i9].shoot.secrete[_j7].radius) {
                  // If center of cell is within shoot circle (subject to change)
                  var _skip = false;
                  for (var _l = 0; _l < src.abilities.length; _l++) {
                     if (src.abilities[_l].neutralize.value == true && sqrt(sq(org.cells[_j7].x - src.abilities[_l].neutralize.x) + sq(org.cells[_j7].y - src.abilities[_l].neutralize.y)) <= src.abilities[_l].neutralize.radius) {
                        // If center of cell is within neutralize circle
                        _skip = true;
                        break;
                     }
                  }
                  if (_skip == true) {
                     continue; // Acid is ineffectual when neutralized
                  }
                  org.cells.splice(_k2, 1);
                  org.count--;
                  _k2--;
                  org.hit = src.abilities[_i9].player;
                  // break; // Break causes cells to die one at a time (not default)
               }
            }
         }
      }
      if (src.abilities[_i9].toxin.value == true) {
         // Toxin
         for (var _j8 = 0; _j8 < org.count; _j8++) {
            if (org.player == src.abilities[_i9].player) {
               // If is own org's toxin
               continue; // Do not kill own cells
            }
            if (sqrt(sq(org.cells[_j8].x - src.abilities[_i9].toxin.x) + sq(org.cells[_j8].y - src.abilities[_i9].toxin.y)) <= src.abilities[_i9].toxin.radius) {
               // If center of cell is within toxin circle
               var _skip2 = false;
               for (var _l2 = 0; _l2 < src.abilities.length; _l2++) {
                  if (src.abilities[_l2].neutralize.value == true && sqrt(sq(org.cells[_j8].x - src.abilities[_l2].neutralize.x) + sq(org.cells[_j8].y - src.abilities[_l2].neutralize.y)) <= src.abilities[_l2].neutralize.radius) {
                     // If center of cell is within neutralize circle
                     _skip2 = true;
                     break;
                  }
               }
               if (_skip2 == true) {
                  continue; // Acid is ineffectual when neutralized
               }
               org.cells.splice(_j8, 1); // Kill cell
               org.count--;
               _j8--;
               org.hit = src.abilities[_i9].player;
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
   for (var i in ability) {
      // Reset Ability Cooldowns
      if (_typeof(ability[i]) == 'object' && i !== 'shoot') {
         // Avoid reference error
         if (ability[i].activated != undefined && ability[i].activated == true) {
            // If is a usable ability
            clearTimeout(ability[i].timeout);
            ability[i].value = false;
            ability[i].can = true;
            ability[i].cooling = false;
            ability[i].start = undefined;
            ability[i].end = undefined;
         }
      }
   }
   for (var _i10 = 0; _i10 < 3; _i10++) {
      // Reset shoots
      clearTimeout(ability.shoot.timeout[_i10]);
      ability.shoot.value[_i10] = false;
      ability.shoot.can[_i10] = true;
      ability.shoot.spore[_i10] = undefined;
      ability.shoot.secrete[_i10] = {};
      ability.shoot.start[_i10] = undefined;
      ability.shoot.end[_i10] = undefined;
   }
   socket.emit('Ability', ability);
}

function keyPressed() {
   // if (keyCode == 65 || keyCode == 37 || keyCode == 87 || keyCode == 38 || keyCode == 68 || keyCode == 39 || keyCode == 83 || keyCode == 40) { // If a directional key
   // 	if (keyCode == 65 || keyCode == 37) { // A or LEFT_ARROW
   // 		org.pos.x -= 15; // Move the position 15 pixels in the indicated direction
   // 	} else if (keyCode == 87 || keyCode == 38) { // W or UP_ARROW
   // 		org.pos.y -= 15;
   // 	} else if (keyCode == 68 || keyCode == 39) { // D or RIGHT_ARROW
   // 		org.pos.x += 15;
   // 	} else if (keyCode == 83 || keyCode == 40) { // S or DOWN_ARROW
   // 		org.pos.y += 15;
   // 	}
   // 	org.off.x = org.pos.x - center.x;
   // 	org.off.y = org.pos.y - center.y;
   // }
   switch (keyCode) {
      case Controls.ability1.code:
         // X by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            if (ability.extend.activated == true && ability.extend.can == true) {
               extend(org.player); // Extend self
            } else if (ability.compress.activated == true && ability.compress.can == true) {
               shoot(0, 1);
               // for (let i = 0; i < game.info.count; i++) {
               // 	if (org.target == game.players[i]) { // Find targeted org
               // 		compress(org.target); // Compress targeted org
               // 		break;
               // 	}
               // }
            } else if (ability.tag.activated == true && ability.tag.can == true) {
               shoot(0, 1);
            }
            // if (ability.speed.activated == true) { (Not updated)
            // 	speed(org.player);
            // } else if (ability.slow.activated == true) {
            // 	slow(org.target);
            // }
         }
         break;
      case Controls.ability2.code:
         // C by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            if (ability.immortality.activated == true && ability.immortality.can == true) {
               immortality(org.player); // Immortalize self
            } else if (ability.freeze.activated == true && ability.freeze.can == true) {
               shoot(1, 1);
               // for (let i = 0; i < game.info.count; i++) {
               // 	if (org.target == game.players[i]) { // Find targeted org
               // 		freeze(org.target); // Freeze targeted org
               // 		break;
               // 	}
               // }
            }
         }
         break;
      case Controls.ability3.code:
         // V by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            // if (ability.stimulate.activated == true && ability.stimulate.can == true) { // Stimulate/Poison OLD
            // 	stimulate(org.player); // Stimulate self
            // } else if (ability.poison.activated == true && ability.poison.can == true) {
            // 	shoot(2, 1);
            // 	// for (let i = 0; i < game.info.count; i++) {
            // 	// 	if (org.target == game.players[i]) { // Find targeted org
            // 	// 		poison(org.target); // Poison targeted org
            // 	// 		break;
            // 	// 	}
            // 	// }
            // }
            if (ability.neutralize.activated == true && ability.neutralize.can == true) {
               neutralize(org.player);
            } else if (ability.toxin.activated == true && ability.toxin.can == true) {
               toxin(org.player);
            }
         }
         break;
      case Controls.ability4.code:
         // SPACE by default
         if ((state == 'game' || state == 'tutorial') && org.alive == true) {
            if (ability.spore.value == false && ability.secrete.value == false) {
               spore();
            } else if (ability.spore.value == true && ability.secrete.value == false) {
               secrete();
            }
         }
         break;
      case Controls.respawn.code:
         // R by default
         if (state == 'spectate' && org.alive == false && org.spawn == true) {
            if (game.players.length < game.info.cap) {
               socket.emit('Spectator Left', game.info);
               renderMenu('respawn', game);
            } else {
               alert('Game is at maximum player capacity');
            }
         }
         break;
      case Controls.pause.code:
         {
            // ESC by default
            var action = { // Speedy conditionality
               createMenu: function createMenu() {
                  return title.return();
               },
               browser: function browser() {
                  return title.return();
               },
               joinMenu: function joinMenu() {
                  if (game.info.host == socket.id) {
                     // If player is host (If player is joining directly after creating the game)
                     socket.emit('Game Ended', game);
                     title.return();
                  } else {
                     renderBrowser();
                  }
               },
               spectateMenu: function spectateMenu() {
                  return renderBrowser();
               },
               game: function (_game) {
                  function game() {
                     return _game.apply(this, arguments);
                  }

                  game.toString = function () {
                     return _game.toString();
                  };

                  return game;
               }(function () {
                  return renderMenu('pauseGame', game);
               }),
               spectate: function spectate() {
                  return renderMenu('pauseSpectate', game);
               },
               tutorial: function (_tutorial) {
                  function tutorial() {
                     return _tutorial.apply(this, arguments);
                  }

                  tutorial.toString = function () {
                     return _tutorial.toString();
                  };

                  return tutorial;
               }(function () {
                  return renderMenu('pauseTutorial', tutorial);
               }),
               respawnMenu: function respawnMenu() {
                  return menus.pauseSpectate.submit();
               },
               pauseGameMenu: function pauseGameMenu() {
                  return menus.pauseGame.submit();
               },
               pauseSpectateMenu: function pauseSpectateMenu() {
                  return menus.pauseSpectate.submit();
               },
               pauseTutorialMenu: function pauseTutorialMenu() {
                  return menus.pauseTutorial.submit();
               }
            };
            if (typeof action[state] == 'function') {
               action[state]();
            }
            break;
         }
   }
   // Hard key codes are separate from variable codes, so in the case of overlap, hard codes will always run
   switch (keyCode) {
      case 13:
         // ENTER
         switch (state) {
            case 'createMenu':
               menus.create.submit();
               break;
            case 'joinMenu':
               menus.join.submit(game);
               break;
            case 'spectateMenu':
               menus.spectate.submit(game);
               break;
            case 'respawnMenu':
               menus.respawn.submit(game);
               break;
            case 'pauseMenu':
               menus.pause.submit(game);
               break;
         }
         break;
      case 27 !== Controls.pause.code ? 27 : '':
         // ESCAPE only if variable pause key is not ESCAPE
         switch (state) {// Used as the back key for menus (variable pause key may be used as well)
            case 'createMenu':
               title.return();
               break;
            case 'browser':
               title.return();
               break;
            case 'joinMenu':
               if (game.info.host == socket.id) {
                  // If player is host (If player is joining directly after creating the game)
                  socket.emit('Game Ended', game);
                  title.return();
               } else {
                  renderBrowser();
               }
               break;
            case 'spectateMenu':
               renderBrowser();
               break;
            case 'respawnMenu':
               menus.pauseSpectate.submit();
               break;
            case 'pauseGameMenu':
               menus.pauseGame.submit();
               break;
            case 'pauseSpectateMenu':
               menus.pauseSpectate.submit();
               break;
            case 'pauseTutorialMenu':
               menus.pauseTutorial.submit();
               break;
         }
         break;
   }
}

function mouseClicked() {
   if (mouseButton == LEFT) {
      // if (state == 'game') { // DO NOT DELETE
      //    { // Targeting
      //       org.target = undefined; // Clear target if click not on opponent org
      //       for (let i = 0; i < game.info.count; i++) {
      //          if (game.orgs[i].player == org.player) { // If org is player's org
      //             continue; // Cannot target oneself
      //          }
      //          if (mouseX + org.off.x >= game.orgs[i].clickbox.left && mouseX + org.off.x <= game.orgs[i].clickbox.right && mouseY + org.off.y >= game.orgs[i].clickbox.top && mouseY + org.off.y <= game.orgs[i].clickbox.bottom) { // If clicked another org
      //             org.target = game.orgs[i].player;
      //             break;
      //          }
      //       }
      //    }
      // }
      return false;
   } else if (mouseButton == RIGHT) {
      return false;
   } else if (mouseButton == CENTER) {
      return false;
   }
}
'use strict';

var socket; // Initialize in global scope
var gamesInterval; // Initialize in global scope
function connectSocket() {
   if (DEV) {
      socket = io.connect('localhost'); // Local server (Development only)
   } else {
      if (HEROKU) {
         socket = io.connect('https://bacter.herokuapp.com/'); // Heroku Server
      } else {
         socket = io.connect('24.55.26.67'); // Local Server
      }
   }

   gamesInterval = setInterval(function () {
      if (state != 'game' && state != 'spectate') {
         socket.emit('Games Request');
      }
   }, 250);

   socket.on('Games', function (datA) {
      games = datA.games;
      connections = datA.connections;
      if (state == 'browser') {
         renderBrowser('games');
      } else if (state == 'joinMenu') {
         menus.join.editLists();
      } else if (state == 'respawnMenu') {
         menus.respawn.editLists();
      }
   });

   socket.on('Enter', function () {
      return run();
   }); // Begin growth

   socket.on('Force Spawn', function () {
      die(false); // 'false' parameter tells server not to emit 'Spectate' back to client
      for (var i = 0; i < game.spectators.length; i++) {
         if (game.spectators[i] == socket.id) {
            // If player is spectator
            socket.emit('Spectator Left', game.info); // Remove spectator from spectators array
         }
      }
      if (state == 'pauseSpectateMenu') {
         renderMenu('pauseGame', game); // Move to correct menu if on spectate menu
      } else if (state == 'respawnMenu') {
         renderMenu('pauseGame', game);
         menus.pauseGame.submit();
      }
      spawn({ color: org.color, skin: org.skin, team: org.team, spectate: false }); // Respawn all players on round start
      org.spawn = false;
      org.ready = true; // org.ready ensures that org will only be forcibly respawned once
   });

   socket.on('Game', function (gamE) {
      game = gamE;
      if (ability.spore.value == true) {
         ability.spore.interval();
      }
      for (var i = 0; i < 3; i++) {
         if (ability.shoot.value[i] == true) {
            ability.shoot.interval[i]();
         }
      }
      switch (state) {
         case 'game':
         case 'pauseGameMenu':
            {
               translate(-org.off.x, -org.off.y);
               renderWorld();
               for (var _i = 0; _i < game.info.count; _i++) {
                  renderToxin(game.abilities[_i]);
               }
               for (var _i2 = 0; _i2 < game.info.count; _i2++) {
                  renderSecretions(game.abilities[_i2]);
               }
               for (var _i3 = 0; _i3 < game.info.count; _i3++) {
                  renderNeutralize(game.abilities[_i3]);
               }
               renderOrgs();
               for (var _i4 = 0; _i4 < game.info.count; _i4++) {
                  renderSpores(game.abilities[_i4]);
               }
               renderUI();
               renderLeaderboard();
               translate(org.off.x, org.off.y);
            }
            renderMessages(); // Render messages outside translation
            if (state == 'game') {
               move(); // Move goes at the end so player does not render his movements before others
            }
            break;
         case 'spectate':
         case 'pauseSpectateMenu':
         case 'respawnMenu':
            {
               translate(-org.off.x, -org.off.y);
               renderWorld();
               for (var _i5 = 0; _i5 < game.info.count; _i5++) {
                  renderToxin(game.abilities[_i5]);
               }
               for (var _i6 = 0; _i6 < game.info.count; _i6++) {
                  renderSecretions(game.abilities[_i6]);
               }
               for (var _i7 = 0; _i7 < game.info.count; _i7++) {
                  renderNeutralize(game.abilities[_i7]);
               }
               renderOrgs(); // Orgs render over neutralize and toxin but under other abilities
               for (var _i8 = 0; _i8 < game.info.count; _i8++) {
                  renderSpores(game.abilities[_i8]);
               }
               renderLeaderboard();
               translate(org.off.x, org.off.y);
            }
            renderMessages();
            if (state == 'spectate') {
               move(); // Move is after messages so everything has same offset
            }
            break;
      }
   });

   socket.on('Game Ended', function (gamE) {
      if (gamE.info.host != socket.id) {
         // Don't alert host (he already knows)
         alert('The game has ended');
      }
      renderTitle();
   });

   socket.on('Spectate', function () {
      return spectate({ color: org.color, gridded: org.gridded, pos: org.pos, skin: org.skin, team: org.team });
   });

   {
      // Abilities
      socket.on('Tag', function () {
         ability.tag.value = true;
         clearTimeout(ability.tag.timeout);
         socket.emit('Ability', ability);
         if (game.info.mode == '') {
            ability.tag.timeout = setTimeout(function () {
               ability.tag.value = false;
               socket.emit('Ability', ability);
            }, ability.tag.time);
         }
      });

      socket.on('Extend', function () {
         ability.extend.value = true;
         clearTimeout(ability.extend.timeout);
         ability.extend.start = new Date();
         socket.emit('Ability', ability);
         ability.extend.timeout = setTimeout(function () {
            // End ability
            ability.extend.value = false;
            ability.extend.end = new Date();
            ability.extend.cooling = true;
            socket.emit('Ability', ability);
         }, ability.extend.time);
      });

      socket.on('Compress', function () {
         ability.compress.value = true;
         clearTimeout(ability.compress.timeout);
         socket.emit('Ability', ability);
         ability.compress.timeout = setTimeout(function () {
            ability.compress.value = false;
            socket.emit('Ability', ability);
         }, ability.compress.time);
      });

      // socket.on('Speed', () => { // Not updated
      // 	ability.speed.value = true;
      // 	org.speed *= ability.speed.factor;
      // 	clearTimeout(ability.speed.timeout);
      // 	socket.emit('Ability', ability);
      // 	ability.speed.timeout = setTimeout(() => { // End ability
      // 		org.speed /= ability.speed.factor;
      // 		ability.speed.value = false;
      // 		socket.emit('Ability', ability);
      // 	}, ability.speed.time);
      // });

      // socket.on('Slow', () => { // Not updated
      // 	ability.slow.value = true;
      // 	org.speed /= ability.slow.factor; // Divide speed by factor
      // 	clearTimeout(ability.slow.timeout);
      // 	socket.emit('Ability', ability);
      // 	ability.slow.timeout = setTimeout(() => { // End ability
      // 		org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
      // 		ability.slow.value = false;
      // 		socket.emit('Ability', ability);
      // 	}, ability.slow.time);
      // });

      socket.on('Immortality', function () {
         ability.immortality.value = true;
         clearTimeout(ability.immortality.timeout);
         ability.immortality.start = new Date();
         socket.emit('Ability', ability);
         ability.immortality.timeout = setTimeout(function () {
            // End ability
            ability.immortality.value = false;
            ability.immortality.end = new Date();
            ability.immortality.cooling = true;
         }, ability.immortality.time);
      });

      socket.on('Freeze', function () {
         ability.freeze.value = true;
         clearTimeout(ability.freeze.timeout);
         socket.emit('Ability', ability);
         ability.freeze.timeout = setTimeout(function () {
            // End ability
            ability.freeze.value = false;
            socket.emit('Ability', ability);
         }, ability.freeze.time);
      });

      // socket.on('Stimulate', () => {
      // 	ability.stimulate.value = true;
      // 	clearTimeout(ability.stimulate.timeout);
      // 	ability.stimulate.start = new Date();
      // 	socket.emit('Ability', ability);
      // 	ability.stimulate.timeout = setTimeout(() => { // End ability
      // 		ability.stimulate.value = false;
      // 		ability.stimulate.end = new Date();
      // 		ability.stimulate.cooling = true;
      // 		socket.emit('Ability', ability);
      // 	}, ability.stimulate.time);
      // });

      // socket.on('Poison', () => {
      // 	ability.poison.value = true;
      // 	clearTimeout(ability.poison.timeout);
      // 	socket.emit('Ability', ability);
      // 	ability.poison.timeout = setTimeout(() => { // End ability
      // 		ability.poison.value = false;
      // 		socket.emit('Ability', ability);
      // 	}, ability.poison.time);
      // });

      socket.on('Neutralize', function () {
         ability.neutralize.value = true;
         ability.neutralize.start = new Date();
         clearTimeout(ability.neutralize.timeout);
         ability.neutralize.x = org.x();
         ability.neutralize.y = org.y();
         socket.emit('Ability', ability);
         ability.neutralize.timeout = setTimeout(function () {
            ability.neutralize.value = false;
            ability.neutralize.end = new Date();
            ability.neutralize.cooling = true;
            socket.emit('Ability', ability);
         }, ability.neutralize.time);
      });

      socket.on('Toxin', function () {
         ability.toxin.value = true;
         ability.toxin.start = new Date();
         clearTimeout(ability.toxin.timeout);
         ability.toxin.x = org.x();
         ability.toxin.y = org.y();
         socket.emit('Ability', ability);
         ability.toxin.timeout = setTimeout(function () {
            ability.toxin.value = false;
            ability.toxin.end = new Date();
            ability.toxin.cooling = true;
            socket.emit('Ability', ability);
         }, ability.toxin.time);
      });
   }
}
'use strict';

var title; // Initialize in global scope
var Title = function Title() {
   var _this = this;

   state = 'title';
   this.src = 'title';
   this.cnv = createCanvas(window.innerWidth, window.innerHeight);
   this.canvas = this.cnv.elt; // HTML Node is stored in p5 canvas' .elt property
   this.canvas.style.visibility = 'visible';
   this.canvas.style.zIndex = '-1';
   center = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
   };
   document.body.appendChild(canvas);
   this.margin = _margin;
   this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin });
   this.orgs = [];
   this.abilities = [];
   var quadrants = [];
   for (var i = 0; i < _dummies; i++) {
      var colors = [];
      for (var j in orgColors.black) {
         colors.push(orgColors.black[j]);
      }
      var color = random(colors);
      var arr = skins.slice();
      arr.push('none');
      var skin = random(arr);
      var xoff = void 0;
      var yoff = void 0;
      var quadrant = void 0;
      do {
         quadrant = random();
         if (quadrant < .25) {
            quadrant = 1;
            xoff = 0;
            yoff = 0;
         } else if (quadrant < .5) {
            quadrant = 2;
            xoff = 1;
            yoff = 0;
         } else if (quadrant < .75) {
            quadrant = 3;
            xoff = 1;
            yoff = 1;
         } else if (quadrant < 1) {
            quadrant = 4;
            xoff = 0;
            yoff = 1;
         }
         quadrants[i] = quadrant;
      } while (freq(quadrants, quadrant) > floor(_dummies / 4) + 1);
      var pos = {
         x: random(this.world.x + _cellwidth + this.world.width / 2 * xoff, this.world.x - _cellwidth + this.world.width / 2 * (xoff + 1)), // 80 is edge buffer
         y: random(this.world.y + _cellwidth + this.world.height / 2 * yoff, this.world.y - _cellwidth + this.world.height / 2 * (yoff + 1))
      };
      this.orgs[i] = new Org({ player: i, color: color, skin: skin, team: null, pos: pos, title: true });
      this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]); // Title must exist to create new Cell()
      this.orgs[i].count++;
      this.abilities[i] = new Ability({ player: i });
   }
   this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2);
   this.interval = setInterval(function () {
      {
         // Render
         // Background
         background(_this.world.backdrop.r, _this.world.backdrop.g, _this.world.backdrop.b);

         // Shadows
         fill(_this.world.backdrop.r - 20, _this.world.backdrop.g - 20, _this.world.backdrop.b - 20);
         noStroke();
         rect(_this.world.x + _this.world.width / 2 + 7, _this.world.y + _this.world.height / 2 + 6, _this.world.width, _this.world.height); // World

         // World
         fill(_this.world.background.r, _this.world.background.g, _this.world.background.b);
         stroke(_this.world.border.color.r, _this.world.border.color.g, _this.world.border.color.b);
         strokeWeight(1);
         rect(_this.world.x + _this.world.width / 2, _this.world.y + _this.world.height / 2, _this.world.width, _this.world.height);

         // Orgs
         renderOrgs();
      }{
         // Calculate
         for (var _i = 0; _i < _this.orgs.length; _i++) {
            grow(_this.orgs[_i]);
         }
      }
   }, _ofrequency);
   this.resize = function (x, y, w, h) {
      var old_x = this.world.x - this.margin;
      var old_y = this.world.y - this.margin;
      for (var _i2 = 0; _i2 < this.orgs.length; _i2++) {
         this.orgs[_i2].pos.x = (this.orgs[_i2].pos.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly
         this.orgs[_i2].pos.y = (this.orgs[_i2].pos.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size
         this.orgs[_i2].cells = [];
         this.orgs[_i2].cells[0] = new Cell(this.orgs[_i2].pos.x, this.orgs[_i2].pos.y, this.orgs[_i2]);
         this.orgs[_i2].count = 1;
      }
      this.world = new World({ width: w - this.margin * 2, height: h - this.margin * 2, type: 'rectangle', color: 'black', x: x + this.margin, y: y + this.margin });
      if (state == 'title') {
         this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2);
      }
   };
   this.return = function () {
      cnvClear();
      this.menu = new TitleMenu(center.x, center.y);
      state = 'title';
   };
};

var TitleMenu = function TitleMenu(X, Y) {
   var former = document.getElementById('Title Menu');
   if (former != null) {
      document.body.removeChild(former);
   }
   this.x = X;
   this.y = Y;
   this.width = 170;
   this.height = 150;
   this.r = 1;
   this.background = { r: 10, g: 10, b: 10 };
   this.borderColor = { r: 255, g: 255, b: 255 };
   this.elt = document.createElement('div'); // Menu Block
   this.elt.id = 'Title Menu';
   this.elt.style.position = 'fixed';
   this.elt.style.left = this.x - this.width / 2 + 'px';
   this.elt.style.top = this.y - this.height / 2 + 'px';
   this.elt.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.elt.style.borderColor = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.elt.style.borderWidth = '1px';
   this.elt.style.borderStyle = 'solid';
   this.elt.style.width = this.width + 'px';
   this.elt.style.height = this.height + 'px';
   this.elt.style.maxWidth = this.width + 'px';
   this.elt.style.maxHeight = this.height + 'px';
   this.elt.style.borderRadius = this.r + 'px';
   this.host = document.createElement('div'); // Host Button
   this.host.id = 'Title Host Button';
   this.host.style.cursor = 'pointer';
   this.host.width = this.width / 3 * 2;
   this.host.height = 25;
   this.host.style.width = this.host.width + 'px';
   this.host.style.height = this.host.height + 'px';
   this.host.style.position = 'fixed';
   this.host.style.left = this.x - this.host.width / 2 + 'px';
   this.host.style.top = this.y - this.height / 2 + 29 + 'px';
   this.host.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.host.style.borderWidth = '0px';
   this.host.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.host.style.textAlign = 'center';
   this.host.style.fontFamily = '_bacter';
   this.host.style.fontSize = '29px';
   this.host.innerHTML = 'Host';
   this.host.addEventListener('click', function () {
      renderMenu('create');
   });
   this.join = document.createElement('div'); // Host Button
   this.join.id = 'Title Host Button';
   this.join.style.cursor = 'pointer';
   this.join.width = this.width / 3 * 2;
   this.join.height = 25;
   this.join.style.width = this.host.width + 'px';
   this.join.style.height = this.host.height + 'px';
   this.join.style.position = 'fixed';
   this.join.style.left = this.x - this.host.width / 2 + 'px';
   this.join.style.top = this.y - this.height / 2 + 29 + this.host.height * 3 / 2 + 'px';
   this.join.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.join.style.borderWidth = '0px';
   this.join.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.join.style.textAlign = 'center';
   this.join.style.fontFamily = '_bacter';
   this.join.style.fontSize = '29px';
   this.join.innerHTML = 'Join';
   this.join.addEventListener('click', function () {
      renderBrowser();
   });
   this.tutorial = document.createElement('div'); // Host Button
   this.tutorial.id = 'Title Host Button';
   this.tutorial.style.cursor = 'pointer';
   this.tutorial.width = this.width / 3 * 2;
   this.tutorial.height = 25;
   this.tutorial.style.width = this.host.width + 'px';
   this.tutorial.style.height = this.host.height + 'px';
   this.tutorial.style.position = 'fixed';
   this.tutorial.style.left = this.x - this.host.width / 2 + 'px';
   this.tutorial.style.top = this.y - this.height / 2 + 29 + this.host.height * 3 / 2 * 2 + 'px';
   this.tutorial.style.backgroundColor = 'rgb(' + this.background.r + ', ' + this.background.g + ', ' + this.background.b + ')';
   this.tutorial.style.borderWidth = '0px';
   this.tutorial.style.color = 'rgb(' + this.borderColor.r + ', ' + this.borderColor.g + ', ' + this.borderColor.b + ')';
   this.tutorial.style.textAlign = 'center';
   this.tutorial.style.fontFamily = '_bacter';
   this.tutorial.style.fontSize = '29px';
   this.tutorial.innerHTML = 'Tutorial';
   this.tutorial.addEventListener('click', function () {
      tutorial = new Tutorial();
   });
   this.elt.appendChild(this.host);
   this.elt.appendChild(this.join);
   this.elt.appendChild(this.tutorial);
   var body = document.body;
   body.appendChild(this.elt);
};

var FullButton = function FullButton() {
   this.elt = document.createElement('div');
};

function renderTitle() {
   // Clear Body
   var page = document.body.parentNode;
   page.removeChild(document.body);
   var body = document.createElement('body');
   page.appendChild(body);

   // Apply Canvas Styling
   body.style.overflow = 'hidden';
   body.style.margin = '0px';
   body.style.border = '0px';
   body.style.padding = '0px';

   // Initialize Title
   if (title != undefined) {
      clearInterval(title.interval);
   }
   title = new Title();
}

var Shade = function Shade() {
   this.elt = document.createElement('div');
   this.elt.id = 'shade';
   this.elt.style.position = 'fixed';
   this.elt.style.left = '0px';
   this.elt.style.top = '0px';
   this.elt.style.width = '100%';
   this.elt.style.height = '100%';
   this.elt.style.backgroundColor = 'rgb(255, 255, 255)';
   this.elt.style.opacity = '.5';
   this.elt.style.zIndex = '0';
};
'use strict';

var tutorial;
var Tutorial = function Tutorial() {
   var _this = this;

   clearInterval(title.interval);
   cnvClear();
   state = 'tutorial';
   this.src = 'tutorial';
   this.task = 'move';
   this.taskTimeout = undefined;
   this.margin = _margin;
   this.world = new World({ width: window.innerWidth - this.margin * 2, height: window.innerHeight - this.margin * 2, type: 'rectangle', color: 'black', x: this.margin, y: this.margin });{
      // Org
      var colors = [];
      for (var j in orgColors.black) {
         if (j != 'sun' && j != 'sky') {
            // No bright colors which would obscure the crosshair in tutorial to minimize confusion
            colors.push(orgColors.black[j]);
         }
      }
      var color = random(colors);
      org = new Org({ player: socket.id, color: color, skin: 'none', spectate: false, pos: { x: center.x, y: center.y }, title: false });
      org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
      org.count++;
   }
   this.orgs = [org];
   this.abilities = [ability];
   this.ointerval = setInterval(function () {
      for (var i = 0; i < _this.orgs.length; i++) {
         grow(_this.orgs[i]);
         if (org.count == 0) {
            _this.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
            _this.orgs[i].count++;
         }
      }
   }, _ofrequency); // 70ms
   this.rinterval = setInterval(function () {
      {
         // Render
         // Background
         background(_this.world.backdrop.r, _this.world.backdrop.g, _this.world.backdrop.b);

         // Shadows
         {
            // World
            fill(_this.world.backdrop.r - 20, _this.world.backdrop.g - 20, _this.world.backdrop.b - 20);
            noStroke();
            rect(_this.world.x + _this.world.width / 2 + 7, _this.world.y + _this.world.height / 2 + 6, _this.world.width, _this.world.height);
         }{
            // Messages
            if (Messages == true) {
               textFont('Helvetica');
               textStyle(NORMAL);
               var message = getMessage();
               if (message != undefined) {
                  var breaks = freq(message, '\n');
                  var width = messageWidth(message);
                  rect(5 + 25 + width / 2, 4 + 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
               }
            }
         }

         // World
         fill(_this.world.background.r, _this.world.background.g, _this.world.background.b);
         stroke(_this.world.border.color.r, _this.world.border.color.g, _this.world.border.color.b);
         strokeWeight(1);
         rect(_this.world.x + _this.world.width / 2, _this.world.y + _this.world.height / 2, _this.world.width, _this.world.height);

         // Game
         renderToxin(ability);
         renderSecretions(ability);
         renderNeutralize(ability);
         renderOrgs();
         renderSpores(ability);
         if (_this.task != 'move' && _this.task != 'survive') {
            translate(-org.off.x, -org.off.y);
            renderUI();
            translate(org.off.x, org.off.y);
         }
         noFill(); // Crosshair
         stroke(_this.world.border.color.r, _this.world.border.color.g, _this.world.border.color.b);
         strokeWeight(1);
         line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
         line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);
         renderMessages(); // Render messages outside translation
      }{
         // Calculate
         if (_this.stopped == false) {
            if (ability.spore.value == true) {
               ability.spore.interval();
            }
            for (var i = 0; i < 3; i++) {
               if (ability.shoot.value[i] == true) {
                  ability.shoot.interval[i]();
               }
            }
            if (state == 'tutorial') {
               move();
            }
         }
         _this.detect();
      }
   }, _rfrequency); // 40ms
   this.clear = function () {
      clearInterval(this.ointerval);
      clearInterval(this.rinterval);
   };
   this.stopped = false;
   this.stopdate = undefined;
   this.stop = function () {
      this.stopped = true;
      this.stopdate = new Date();
      clearInterval(this.ointerval);
   };
   this.resize = function (x, y, w, h) {
      var old_x = this.world.x - this.margin;
      var old_y = this.world.y - this.margin;
      for (var i = 0; i < this.orgs.length; i++) {
         this.orgs[i].pos.x = (this.orgs[i].pos.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly
         this.orgs[i].pos.y = (this.orgs[i].pos.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size
         this.orgs[i].cells = [];
         this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]);
         this.orgs[i].count = 1;
      }
      this.world = new World({ width: w - this.margin * 2, height: h - this.margin * 2, type: 'rectangle', color: 'black', x: x + this.margin, y: y + this.margin });
   };
   this.detect = function () {
      var _this2 = this;

      switch (this.task) {
         case 'move':
            {
               if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code) || keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code) || keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code) || keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) {
                  // If a directional key is pressed
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        _this2.task = 'survive';
                     }, _taskdelay); // 3000ms
                  }
               }
               break;
            }
         case 'survive':
            {
               if (this.taskTimeout == undefined) {
                  this.taskTimeout = setTimeout(function () {
                     _this2.taskTimeout = undefined;
                     _this2.task = 'extend';
                     ability.extend.activated = true;
                     ability.extend.can = true;
                     socket.emit('Ability', ability);
                  }, 4500);
               }
               break;
            }
         case 'extend':
            {
               if (keyIsDown(Controls.ability1.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.extend.activated = false;
                        ability.extend.can = false;
                        _this2.task = 'immortality';
                        ability.immortality.activated = true;
                        ability.immortality.can = true;
                        socket.emit('Ability', ability);
                     }, ability.extend.time);
                  }
               }
               break;
            }
         case 'immortality':
            {
               if (keyIsDown(Controls.ability2.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.immortality.activated = false;
                        ability.immortality.can = false;
                        _this2.task = 'neutralize';
                        ability.neutralize.activated = true;
                        ability.neutralize.can = true;
                        socket.emit('Ability', ability);
                     }, ability.immortality.time);
                  }
               }
               break;
            }
         case 'neutralize':
            {
               if (keyIsDown(Controls.ability3.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.neutralize.activated = false;
                        ability.neutralize.can = false;
                        _this2.task = 'shoot';
                        ability.compress.activated = true;
                        ability.compress.can = true;
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        socket.emit('Ability', ability);
                     }, ability.neutralize.time);
                  }
               }
               break;
            }
         case 'shoot':
            {
               if (this.taskTimeout == undefined) {
                  this.taskTimeout = setTimeout(function () {
                     _this2.taskTimeout = undefined;
                     ability.freeze.activated = false;
                     ability.freeze.can = false;
                     _this2.task = 'compress';
                     ability.compress.activated = true; // Redundancy
                     ability.compress.can = true; // Redundancy
                  }, 10000);
               }
               break;
            }
         case 'compress':
            {
               if (this.orgs.length == 1) {
                  var _colors = [];
                  for (var _j in orgColors.black) {
                     if (_j != 'sun' && _j != 'lime') _colors.push(orgColors.black[_j]);
                  }
                  var _color = random(_colors);
                  var pos = void 0;
                  do {
                     pos = { x: random(this.world.width), y: random(this.world.height) };
                  } while (sqrt(sq(pos.x - org.pos.x) + sq(pos.y - org.pos.y)) < _range + 30); // _range + 20 is maximum extend range
                  this.orgs.push(new Org({ player: 'bot' + 1, color: _color, skin: 'none', spectate: false, pos: pos, title: false }));
                  this.orgs[1].cells[0] = new Cell(this.orgs[1].pos.x, this.orgs[1].pos.y, this.orgs[1]); // Create first cell in org
                  this.orgs[1].count++;
                  this.abilities[1] = new Ability({ player: 'bot' + 1 });
               }
               if (ability.compress.applied == true) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.compress.activated = false;
                        ability.compress.can = false;
                        ability.freeze.activated = true;
                        ability.freeze.can = true;
                        _this2.task = 'freeze';
                     }, ability.compress.time);
                  }
               }
               break;
            }
         case 'freeze':
            {
               if (ability.freeze.applied == true) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.freeze.activated = false;
                        ability.freeze.can = false;
                        ability.toxin.activated = true;
                        ability.toxin.can = true;
                        _this2.task = 'toxin';
                     }, ability.freeze.time);
                  }
               }
               break;
            }
         case 'toxin':
            {
               if (keyIsDown(Controls.ability3.code)) {
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.toxin.activated = false;
                        ability.toxin.can = false; // All ability can values are reset to true after task change by cooldown; not a problem at the moment; can = false is useless at the moment
                        _this2.task = 'spore';
                        ability.spore.activated = true;
                        ability.spore.can = true;
                        ability.secrete.activated = true; // .can = false
                        socket.emit('Ability', ability);
                     }, ability.toxin.time);
                  }
               }
               break;
            }
         case 'spore':
            {
               var current = new Date();
               if (ability.secrete.value == true) {
                  if (this.stopped == true) {
                     this.stopped = false;
                     this.ointerval = setInterval(function () {
                        // Restart
                        for (var i = 0; i < _this2.orgs.length; i++) {
                           grow(_this2.orgs[i]);
                           if (org.count == 0) {
                              _this2.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
                              _this2.orgs[i].count++;
                           }
                        }
                     }, _ofrequency); // 70ms
                     ability.spore.end = new Date();
                     ability.secrete.start = new Date();
                  }
                  if (this.taskTimeout == undefined) {
                     this.taskTimeout = setTimeout(function () {
                        _this2.taskTimeout = undefined;
                        ability.spore.activated = false;
                        ability.spore.can = false;
                        ability.secrete.activated = false;
                        ability.secrete.can = false;
                        _this2.task = 'done';
                     }, ability.secrete.time);
                  }
               } else if (ability.spore.value == true && current - ability.spore.start >= ability.spore.time / 2) {
                  if (this.stopped == false) {
                     clearInterval(ability.spore.interval);
                     clearTimeout(ability.spore.timeout);
                     this.stop();
                  }
               }
               break;
            }
      }
   };
};
'use strict';

var World = function World(datA) {
   // datA: { width: , height: , type: , color: , x: , y: }
   var data = datA;
   this.host = socket.id; // Cannot call game.info.host since game is not fully constructed yet; World() can only be called by host, so socket.id is ok
   this.width = data.width;
   this.height = data.height;
   if (data.x != undefined) {
      // Coordinates are for top left corner
      this.x = data.x;
   } else {
      this.x = 0;
   }
   if (data.y != undefined) {
      this.y = data.y;
   } else {
      this.y = 0;
   }
   this.type = data.type;
   this.color = data.color;
   for (var i in worldColors) {
      if (i == this.color) {
         this.background = worldColors[i];
         break;
      }
   }
   this.interval = undefined;
   this.border = {
      color: undefined,
      weight: 1
   };
   this.grid = {
      width: 100
   };
   this.backdrop = { r: 70, g: 70, b: 70 };
   this.border.weight = 1;
   if (this.color == 'black') {
      this.border.color = { r: 255, g: 255, b: 255 };
   } else if (this.color == 'white') {
      this.border.color = { r: 0, g: 0, b: 0 };
   }
   // dots = {
   // 	r: {
   // 		min: .5, 
   // 		max: 2
   // 	}, 
   // 	prob: .2, 
   // 	array: [], 
   // 	count: 0
   // };
};

function renderWorld() {
   // Background
   background(game.world.backdrop.r, game.world.backdrop.g, game.world.backdrop.b);

   // Shadows
   fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
   noStroke();{
      // World
      if (game.world.type == 'rectangle') {
         // World
         rect(game.world.x + game.world.width / 2 + 7, game.world.y + game.world.height / 2 + 6, game.world.width, game.world.height);
      } else if (game.world.type == 'ellipse') {
         ellipse(game.world.x + game.world.width / 2 + 5, game.world.y + game.world.height / 2 + 4, game.world.width / 2, game.world.height / 2);
      }
   }{
      // Leaderboard
      translate(org.off.x, org.off.y); // Shadows in renderWorld() so it will render behind world
      rectMode(CORNER);
      game.board.y = game.board.marginTop; // Leaderboard Head
      switch (game.info.mode) {
         case 'ffa':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
               game.board.count = min(game.board.show, game.board.list.length);
               break;
            }
         case 'skm':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
               game.board.count = game.teams.length;
               break;
            }
         case 'srv':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
               game.board.count = min(game.board.show, game.board.list.length);
               break;
            }
         case 'ctf':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
               game.board.count = game.teams.length;
               break;
            }
         case 'inf':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
               game.board.count = min(game.board.show, game.board.list.length);
               break;
            }
         case 'kth':
            {
               game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
               rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
               game.board.count = min(game.board.show, game.board.list.length);
               break;
            }
      }
      var a = 0;
      for (var i = 0; i < game.board.count; i++) {
         // Leaderboard Body
         if (game.info.mode != 'skm' && game.info.mode != 'ctf') {
            // If not a team mode
            var spectator = false;
            for (var j = 0; j < game.spectators.length; j++) {
               if (game.board.list[i].player == game.spectators[j]) {
                  spectator = true;
                  break;
               }
            }
            if (spectator == true) {
               if (i < game.board.count) {
                  if (game.board.count < game.info.count) {
                     game.board.count++; // Extend leaderboard length to include the next player
                     i++; // Do not render leaderboard status if player is a spectator
                  } else {
                     continue;
                  }
               }
            }
         }
         switch (game.info.mode) {
            case 'ffa':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
                  break;
               }
            case 'skm':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
                  break;
               }
            case 'srv':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
                  break;
               }
            case 'ctf':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
                  break;
               }
            case 'inf':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
                  break;
               }
            case 'kth':
               {
                  rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
                  break;
               }
         }
         a++;
      }
      translate(-org.off.x, -org.off.y);
      rectMode(CENTER);
   }{
      // Messages
      translate(org.off.x, org.off.y);
      if (Messages == true) {
         textFont('Helvetica');
         textStyle(NORMAL);
         var message = getMessage();
         if (message != undefined) {
            var breaks = freq(message, '\n');
            var _width = messageWidth(message);
            rect(5 + 25 + _width / 2, 4 + 25 + 9 * breaks, 25 + _width, 26 + 18 * breaks);
         }
      }
      translate(-org.off.x, -org.off.y);
   }

   // World
   fill(game.world.background.r, game.world.background.g, game.world.background.b);
   stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
   strokeWeight(game.world.border.weight);
   if (game.world.type == 'rectangle') {
      rect(game.world.x + game.world.width / 2, game.world.y + game.world.height / 2, game.world.width, game.world.height); // World border
   } else if (game.world.type == 'ellipse') {
      ellipse(game.world.x + game.world.width / 2, game.world.y + game.world.height / 2, game.world.width / 2, game.world.height / 2); // World border
   }

   // CTF
   if (game.info.mode == 'ctf') {
      // Bases
      for (var _i = 1; _i < game.teams.length + 1; _i++) {
         var color = teamColorDef[teamColors[_i - 1]];
         stroke(orgColors[game.world.color][color].r, orgColors[game.world.color][color].g, orgColors[game.world.color][color].b);
         strokeWeight(3);
         var bin = _i.toString(2); // Convert i to binary string
         if (bin.length < 2) {
            bin = '0' + bin; // Add zero to front to form equivalent two-length binary number
         }
         var x = game.world.x + game.world.width * parseInt(bin[bin.length - 1]);
         var y = game.world.y + game.world.height * parseInt(bin[bin.length - 2]);
         var theta = void 0;
         if (bin == '01') {
            theta = 270;
         } else if (bin == '10') {
            theta = 90;
         } else if (bin == '11') {
            theta = 180;
         } else if (bin == '100') {
            theta = 0;
         }
         var l = 150;
         if (game.world.type == 'rectangle') {
            arc(x, y, l, l, -theta + 1, -theta + 89); // -1 to avoid world border overlap with a degree cushion either side
         } else if (game.world.type == 'ellipse') {
            var r = game.world.width / 2;
            var h = x + cos(-theta + 45) * r * (root2 - 1); // l = r(root2 - 1); length from circle to square corner
            var k = y + sin(-theta + 45) * r * (root2 - 1); // yoff = l*sin(-theta + 45); -theta + 45 gives angle to center
            var _a = game.world.x + r; // a is world center x
            var b = game.world.y + r; // b is world center y
            var diffs = [];
            var points = [/*{ p: Number, q: Number }*/];
            for (var _j = 0; _j < 720; _j++) {
               var alpha = _j;
               var p = h + l * cos(alpha);
               var q = k + l * sin(alpha);
               var d = abs(sqrt(sq(p - _a) + sq(q - b)) - r); // Calculate distance of point on base circle to world circle
               diffs.push(d); // Store all distances to array
               points.push({ p: p, q: q }); // Store all points to array
            }
            var point = points[diffs.indexOf(min(diffs))]; // Find closest point to world circle (points and diffs are analogous)
            var phi = atan(abs(point.q - k) / abs(point.p - h));
            if (phi > 45) {
               phi = 90 - phi;
            }
            arc(h, k, l, l, -theta - phi + 1, -theta + 90 + phi - 1); // -1 to avoid world border overlap
         }
      }
      // Flag
      noFill();
      stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
      strokeWeight(2);
      line(game.flag.x - game.flag.width / 2, game.flag.y - game.flag.height / 2, game.flag.x - game.flag.width / 2, game.flag.y + game.flag.height / 2);
      fill(game.flag.color.r, game.flag.color.g, game.flag.color.b);
      strokeWeight(1);
      triangle(game.flag.x - game.flag.width / 2, game.flag.y - game.flag.height / 2, game.flag.x - game.flag.width / 2, game.flag.y, game.flag.x + game.flag.width / 2, game.flag.y - game.flag.height / 4);
   }

   // Dots
   // fill(random(150, 220));
   // noStroke();
   // for (let i = 0; i < game.world.dots.count; i++) {
   // 	let dot = game.world.dots.array[i];
   // 	ellipse(dot.x, dot.y, dot.r);
   // }

   // Grid
   // for (let i = 0; i < game.world.height / game.world.grid.width; i++) { // Same color as border so is adaptable to variable world colors
   // 	line(game.world.x, game.world.y + i * game.world.grid.width + (game.world.height % game.world.grid.width / 2), game.world.x + game.world.width, game.world.y + i * game.world.grid.width + (game.world.height % game.world.grid.width / 2));
   // }
   // for (let i = 0; i < game.world.width / game.world.grid.width; i++) {
   // 	line(game.world.x + i * game.world.grid.width + (game.world.width % game.world.grid.width / 2), game.world.y, game.world.x + i * game.world.grid.width + (game.world.width % game.world.grid.width / 2), game.world.y + game.world.height);
   // }
}

//# sourceMappingURL=bundle.js.map