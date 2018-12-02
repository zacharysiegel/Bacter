var ability;
var Ability = function(data) { // data: { player: }
   this.player = data.player;
   this.auto = false;
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
         //    value: false, 
         //    color: undefined, 
         //    radius: _cellwidth / cos45 * 2.7 / 2, // Half 'secrete'
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
};

function shoot(I, J) { // Both parameters are required
   if (ability.shoot.value[I] == false && ability.shoot.can[I] == true) { // If not currently shooting and if can shoot specified ability (Should have been checked before this point)
      ability.shoot.value[I] = true;
      ability.shoot.can[I] = false;
      ability.shoot.secrete[I].value = false;
      clearTimeout(ability.shoot.timeout[I]); // Reset timeout
      ability.shoot.start[I] = new Date(); // Set start time

      // Get Spore
      let regions = getRegionInfo(org); // Get region data
      let theta;
      if (mouseX == Infinity || mouseY == Infinity) {
         let mpos = getMpos();
         mouseX = mpos.x;
         mouseY = mpos.y;
      }
      if (state != 'tutorial') {
         theta = atan((mouseY - center.y) / (mouseX - center.x)); // Get angle (theta) from mouse pointer
         if (mouseX < center.x) { // If mouse is in second or third quadrants
            theta += 180; // Correct theta for negative x
         }
      } else {
         theta = atan((mouseY - org.pos.y) / (mouseX - org.pos.x));
         if (mouseX < org.pos.x) { // If mouse is in second or third quadrants
            theta += 180; // Correct theta for negative x
         }
      }
      let deltas = [];
      for (let i = 0; i < regions.exposed.length; i++) { // Loop through exposed cells
         let phi = atan((regions.exposed[i].y - org.y()) / (regions.exposed[i].x - org.x())); // Get angle (phi) of each exposed cell
         if (regions.exposed[i].x - org.x() < 0) {
            phi += 180;
         }
         deltas.push(abs(theta - phi)); // Calculate difference between theta and phi and collect in 'deltas' array
      }
      let min;
      for (let i = 0; i < deltas.length; i++) {
         if (i == 0) {
            min = deltas[i]; // Set first delta as min for comparison value
            continue;
         } else if (min > deltas[i]) { // Calculate minimum delta
            min = deltas[i];
         }
      }
      ability.shoot.spore[I] = regions.exposed[deltas.indexOf(min)]; // Set spore as the cell with angle phi closest to mouse angle theta
      for (let i = 0; i < org.count; i++) {
         if (ability.shoot.spore[I].x == org.cells[i].x && ability.shoot.spore[I].y == org.cells[i].y) { // Find spore in org
            org.cells.splice(i, 1); // Remove spore cell from org
            org.count--;
            i--;
            break;
         }
      }
      ability.shoot.spore[I].speed = ability.shoot.speed;
      ability.shoot.spore[I].theta = theta;

      // Interval
      ability.shoot.interval[I] = () => {
         ability.shoot.spore[I].x += ability.shoot.spore[I].speed * cos(ability.shoot.spore[I].theta);
         ability.shoot.spore[I].y += ability.shoot.spore[I].speed * sin(ability.shoot.spore[I].theta);
         socket.emit('Ability', ability);
      };

      // Timeout
      ability.shoot.timeout[I] = setTimeout(() => {
         if (ability.shoot.value[I] == true && ability.shoot.secrete[I].value == false) {
            ability.shoot.value[I] = false;
            ability.shoot.spore[I] = undefined;
            ability.shoot.cooling[I] = true;
            ability.shoot.end[I] = new Date();
            ability.shoot.secrete[I].end = new Date();
            socket.emit('Ability', ability);
         }
      }, ability.shoot.time);

   } else if (ability.shoot.value[I] == true) { // If currently shooting (secrete)
      ability.shoot.end[I] = new Date();
      ability.shoot.value[I] = false;
      ability.shoot.secrete[I].radius = _cellwidth / cos45 * 2.9 / 2; // Not predefined (Half secrete)
      ability.shoot.secrete[I].hit = false;
      ability.shoot.secrete[I].time = 800; // Not predefined (Same as secrete)
      clearTimeout(ability.shoot.timeout[I]);
      ability.shoot.secrete[I].start = new Date();
      ability.shoot.secrete[I].color = org.color;

      // Hit (Apply Ability) (Hit detection on local machine)
      let src = getSrc();
      for (let i = 0; i < src.orgs.length; i++) {
         if (src.orgs[i].player == socket.id || org.team && src.orgs[i].team === org.team) { // Do not apply ability to self or teammate
            continue;
         }
         for (let j = 0; j < src.orgs[i].count; j++) {
            if (sqrt(sq(src.orgs[i].cells[j].x - ability.shoot.spore[I].x) + sq(src.orgs[i].cells[j].y - ability.shoot.spore[I].y)) < ability.shoot.secrete[I].radius) { // If center of cell is within circle (subject to change)
               if (src.abilities[i].neutralize.value == true && sqrt(sq(src.orgs[i].cells[j].x - src.abilities[i].neutralize.x) + sq(src.orgs[i].cells[j].y - src.abilities[i].neutralize.y)) <= src.abilities[i].neutralize.radius) { // If center of cell is within neutralize circle
                  continue;
               }
               use(I, J, src.orgs[i].player); // Apply ability to target
               ability.shoot.secrete[I].hit = true;
               break;
            }
         }
      }

      ability.shoot.secrete[I].value = true; // Value after hit detection so 'grow' hit detection does not run before initial
      socket.emit('Ability', ability);
      ability.shoot.secrete[I].timeout = setTimeout(() => {
         ability.shoot.secrete[I].value = false;
         ability.shoot.secrete[I].end = new Date(); { // Copy of 'shoot' timeout
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
   setTimeout(() => {
      ability.tag.end = new Date();
      ability.tag.cooling = true;
   }, ability.tag.time);
}

function extend(playeR) {
   ability.extend.can = false;
   socket.emit('Extend', playeR);
}

function compress(playeR) {
   let src = getSrc();
   if (src.src == 'tutorial') { // Since orgs are locally grown in tutorial, abilities must be locally applied
      for (let i = 0; i < src.abilities.length; i++) {
         if (src.abilities[i].player == playeR) {
            src.abilities[i].compress.value = true;
            clearTimeout(src.abilities[i].compress.timeout);
            src.abilities[i].compress.timeout = setTimeout(() => {
               src.abilities[i].compress.value = false;
            }, src.abilities[i].compress.time);
         }
      }
   } else {
      socket.emit('Compress', playeR);
   }
   ability.compress.applied = true;
   ability.compress.can = false; // Redundancy
   ability.compress.start = new Date();
   socket.emit('Ability', ability);
   setTimeout(() => {
      ability.compress.end = new Date();
      ability.compress.applied = false;
      ability.compress.cooling = true;
   }, ability.compress.time);
}

// function speed(playeR) {
//    socket.emit('Speed', playeR);
// }

// function slow(playeR) {
//    socket.emit('Slow', playeR);
// }

function immortality(playeR) {
   ability.immortality.can = false;
   socket.emit('Immortality', playeR);
}

function freeze(playeR) {
   let src = getSrc();
   if (src.src == 'tutorial') { // Since orgs are locally grown in tutorial, abilities must be locally applied
      for (let i = 0; i < src.abilities.length; i++) {
         if (src.abilities[i].player == playeR) {
            src.abilities[i].freeze.value = true;
            clearTimeout(src.abilities[i].freeze.timeout);
            src.abilities[i].freeze.timeout = setTimeout(() => {
               src.abilities[i].freeze.value = false;
            }, src.abilities[i].freeze.time);
         }
      }
   } else {
      socket.emit('Freeze', playeR);
   }
   ability.freeze.applied = true;
   ability.freeze.can = false; // Redundancy
   ability.freeze.start = new Date();
   socket.emit('Ability', ability);
   setTimeout(() => {
      ability.freeze.end = new Date();
      ability.freeze.applied = false;
      ability.freeze.cooling = true;
   }, ability.freeze.time);
}

// function stimulate(playeR) {
//    ability.stimulate.can = false;
//    socket.emit('Stimulate', playeR);
// }

// function poison(playeR) {
//    socket.emit('Poison', playeR);
//    ability.poison.can = false; // Redundancy
//    ability.poison.start = new Date();
//    socket.emit('Ability', ability);
//    setTimeout(() => {
//       ability.poison.end = new Date();
//       ability.poison.cooling = true;
//    }, ability.poison.time);
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
   if (ability.spore.can == true) { // If spore is allowed
      ability.spore.value = true;
      clearTimeout(ability.spore.timeout);
      ability.spore.can = false;
      ability.secrete.can = true;
      ability.spore.start = new Date();
      var regions = getRegionInfo(org);
      ability.spore.spores = regions.exposed; // All exposed cells become spores
      ability.spore.count = ability.spore.spores.length;
      for (let i = 0; i < ability.spore.count; i++) {
         ability.spore.spores[i].color = org.color;
         ability.spore.spores[i].theta = atan((ability.spore.spores[i].y - org.y()) / (ability.spore.spores[i].x - org.x())); // Generate angle value
         if (ability.spore.spores[i].x < org.x()) {
            ability.spore.spores[i].theta += 180;
         }
         ability.spore.spores[i].speed = ability.spore.speed; // Set spore speed to constant (subject to change)
         for (let j = 0; j < org.count; j++) {
            if (ability.spore.spores[i].x == org.cells[j].x && ability.spore.spores[i].y == org.cells[j].y) { // Find corresponding cell to spore
               org.cells.splice(j, 1); // Remove spore cells from org
               org.count--;
               j--;
            }
         }
      }
      ability.spore.interval = () => {
         for (let i = 0; i < ability.spore.count; i++) {
            ability.spore.spores[i].x += ability.spore.spores[i].speed * cos(ability.spore.spores[i].theta);
            ability.spore.spores[i].y += ability.spore.spores[i].speed * sin(ability.spore.spores[i].theta);
         }
         socket.emit('Ability', ability);
      };
      ability.spore.timeout = setTimeout(() => { // End Spore
         if (ability.spore.value == true && ability.secrete.value == false) { // If secrete() has not been called
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
   if (ability.secrete.can == true) { // If not already secreting and spores are activated
      ability.secrete.value = true;
      ability.secrete.can = false;
      ability.spore.value = false;
      ability.spore.end = new Date(); // Set spore end date for secrete timer calculations
      clearTimeout(ability.secrete.timeout);
      ability.secrete.start = new Date();
      ability.secrete.color = org.color;
      socket.emit('Ability', ability);
      ability.secrete.timeout = setTimeout(() => { // End Secrete
         ability.secrete.value = false;
         ability.secrete.can = true; { // Copy of spore timeout so spore ends when secrete ends
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
   let src = getSrc();
   if (abilitY.spore.value == true) {
      for (let i = 0; i < abilitY.spore.count; i++) {
         let cell = abilitY.spore.spores[i];
         for (let j = 0; j < src.orgs.length; j++) {
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
   for (let i = 0; i < 3; i++) {
      if (abilitY.shoot.value[i] == true) {
         let cell = abilitY.shoot.spore[i];
         for (let j = 0; j < src.orgs.length; j++) {
            if (src.orgs[j].player == abilitY.player) {
               if (src.orgs[j].skin == 'circles') {
                  fill(cell.color.r, cell.color.g, cell.color.b);
                  noStroke();
                  ellipse(cell.x, cell.y, cell.width / 2 * .8, cell.height / 2 * .8); // .8 (default) size of spore (so as to differentiate between the two)
               } else if (src.orgs[j].skin == 'ghost') {
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

function renderSecretions(abilitY) { // abilitY is src.abilities[x]
   let src = getSrc();
   for (let i = 0; i < src.orgs.length; i++) {
      if (abilitY.player == src.orgs[i].player) { // Identify org of abilitY
         if (abilitY.secrete.value == true) {
            for (let j = 0; j < abilitY.spore.count; j++) {
               let spore = abilitY.spore.spores[j];
               if (src.orgs[i].skin == 'ghost') {
                  noFill();
                  stroke(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
                  strokeWeight(2);
                  ellipse(spore.x, spore.y, abilitY.secrete.radius);
               } else {
                  fill(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
                  noStroke();
                  ellipse(spore.x, spore.y, abilitY.secrete.radius);
               }
            }
         }
         for (let j = 0; j < abilitY.shoot.value.length; j++) {
            if (abilitY.shoot.secrete[j].value == true) {
               let spore = abilitY.shoot.spore[j];
               if (src.orgs[i].skin == 'ghost') {
                  noFill();
                  stroke(abilitY.shoot.secrete[j].color.r, abilitY.shoot.secrete[j].color.g, abilitY.shoot.secrete[j].color.b);
                  strokeWeight(2);
                  ellipse(spore.x, spore.y, abilitY.shoot.secrete[j].radius);
               } else {
                  fill(abilitY.shoot.secrete[j].color.r, abilitY.shoot.secrete[j].color.g, abilitY.shoot.secrete[j].color.b);
                  noStroke();
                  ellipse(spore.x, spore.y, abilitY.shoot.secrete[j].radius);
               }
            }
         }
         break;
      }
   }
}

function renderNeutralize(abilitY) {
   if (abilitY.neutralize.value == true) { // Render neutralize (not toxin) over shoots, spores, and secretes of opponents
      fill(100);
      stroke(abilitY.neutralize.color.r, abilitY.neutralize.color.g, abilitY.neutralize.color.b);
      strokeWeight(abilitY.neutralize.weight);
      ellipse(abilitY.neutralize.x, abilitY.neutralize.y, abilitY.neutralize.radius);
   }
}

function renderToxin(abilitY) {
   if (abilitY.toxin.value == true) { // Toxin renders at bottom
      fill(100);
      stroke(abilitY.toxin.color.r, abilitY.toxin.color.g, abilitY.toxin.color.b);
      strokeWeight(abilitY.toxin.weight);
      ellipse(abilitY.toxin.x, abilitY.toxin.y, abilitY.toxin.radius);
   }
}

function cooldown(abilitY) { // abilitY is ability.xxxxx, not (games[i].)ability
   if (typeof abilitY.value != 'object') { // If is not shoot (typeof [] == 'object')
      if (abilitY.cooling == true) { // If abilitY is cooling down
         let current = new Date(); // Get current time
         if (current - abilitY.end >= abilitY.cooldown) { // If cooldown has passed
            abilitY.can = true; // Re-enable abilitY
            abilitY.cooling = false;
            socket.emit('Ability', ability); // Update server
         }
      }
   } else { // If is shoot
      for (let i = 0; i < abilitY.value.length; i++) {
         if (abilitY.cooling[i] == true) { // If abilitY is cooling down
            let current = new Date(); // Get current time
            if (current - abilitY.end[i] >= abilitY.cooldown[i]) { // If cooldown has passed
               abilitY.can[i] = true; // Re-enable abilitY
               abilitY.cooling[i] = false;
               socket.emit('Ability', ability); // Update server
            }
         }
      }
   }
}