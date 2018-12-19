"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var ability;

var Ability = function Ability(data) {
  // data: { player: }
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
  }; // speed: { // Not updated
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
  }; // stimulate: {
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
    color: {
      r: 0,
      g: 179,
      b: 12
    },
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
    color: {
      r: 255,
      g: 111,
      b: 92
    },
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
    color: {
      r: undefined,
      g: undefined,
      b: undefined
    },
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
    secrete: [{}, {}, {} // { // Sets values on use
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

    var regions = org.getRegionInfo(); // Get region data

    var theta;

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

    var min;

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
    ability.shoot.spore[I].theta = theta; // Interval

    ability.shoot.interval[I] = function () {
      ability.shoot.spore[I].x += ability.shoot.spore[I].speed * cos(ability.shoot.spore[I].theta);
      ability.shoot.spore[I].y += ability.shoot.spore[I].speed * sin(ability.shoot.spore[I].theta);
      socket.emit('Ability', ability);
    }; // Timeout


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
    ability.shoot.secrete[I].color = org.color; // Hit (Apply Ability) (Hit detection on local machine)

    var src = getSrc();

    for (var _i3 = 0; _i3 < src.orgs.length; _i3++) {
      if (src.orgs[_i3].player == socket.id || org.team && src.orgs[_i3].team === org.team) {
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
      ability.shoot.secrete[I].end = new Date();
      {
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
} // function speed(playeR) {
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
} // function stimulate(playeR) {
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
  if (ability.spore.can == true) {
    // If spore is allowed
    ability.spore.value = true;
    clearTimeout(ability.spore.timeout);
    ability.spore.can = false;
    ability.secrete.can = true;
    ability.spore.start = new Date();
    var regions = org.getRegionInfo();
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
      ability.secrete.can = true;
      {
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
"use strict";

// Repertoires
var worldColors = {
  black: {
    r: 0,
    g: 0,
    b: 0
  },
  // Only black is currently in use
  white: {
    r: 230,
    g: 230,
    b: 230
  },
  blue: {
    r: 247,
    g: 250,
    b: 255
  }
};
var orgColors = {
  black: {
    fire: {
      r: 255,
      g: 90,
      b: 81
    },
    camel: {
      r: 232,
      g: 183,
      b: 155
    },
    clay: {
      r: 232,
      g: 145,
      b: 95
    },
    sun: {
      r: 255,
      g: 246,
      b: 86
    },
    leaf: {
      r: 125,
      g: 255,
      b: 200
    },
    lime: {
      r: 57,
      g: 249,
      b: 86
    },
    sky: {
      r: 48,
      g: 210,
      b: 255
    },
    lake: {
      r: 142,
      g: 182,
      b: 255
    },
    ocean: {
      r: 102,
      g: 136,
      b: 244
    },
    royal: {
      r: 175,
      g: 132,
      b: 255
    },
    petal: {
      r: 250,
      g: 122,
      b: 255
    },
    hot: {
      r: 232,
      g: 2,
      b: 216
    }
  },
  white: {
    fire: {
      r: 240,
      g: 75,
      b: 66
    },
    camel: {
      r: 232,
      g: 183,
      b: 155
    },
    clay: {
      r: 232,
      g: 145,
      b: 95
    },
    burnt: {
      r: 196,
      g: 99,
      b: 19
    },
    lime: {
      r: 57,
      g: 249,
      b: 86
    },
    forest: {
      r: 0,
      g: 114,
      b: 38
    },
    peacock: {
      r: 16,
      g: 143,
      b: 147
    },
    sky: {
      r: 48,
      g: 210,
      b: 255
    },
    lake: {
      r: 104,
      g: 157,
      b: 255
    },
    ocean: {
      r: 102,
      g: 136,
      b: 244
    },
    royal: {
      r: 175,
      g: 132,
      b: 255
    },
    petal: {
      r: 250,
      g: 122,
      b: 255
    },
    hot: {
      r: 232,
      g: 2,
      b: 216
    }
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
  // Conversion between team name to color name
  red: 'fire',
  blue: 'sky',
  green: 'lime',
  pink: 'petal'
};
var firsts = ['Extend', 'Compress'];
var seconds = ['Immortality', 'Freeze'];
var thirds = ['Neutralize', 'Toxin']; // Math

var cos45 = 0.70710678118;
var root2 = 1.41421356; // Configurations

var _orgfrequency = 70; // Org update frequency

var _renderfrequency = 40; // Rendering update frequency

var _range = 50; // Org default maximum size

var _cellwidth = 6; // Width of single cell (pixels)

var _movespeed = 1.7; // Crosshair movement speed

var _spectatespeed = 2.5; // Crosshair movement speed in spectate mode

var _rounddelay = 10000; // Delay time (in milliseconds) before survival round starts

var _dummies = 10; // Number of dummy orgs in title screen

var _margin = 25; // Title screen margin
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
var Defaults = {
  worldwidth: 800,
  worldheight: 800,
  playercap: 16,
  playermin: 4,
  boardlength: 10,
  teamcount: 2
};
"use strict";

var game; // Initialize in global scope

var Game = function Game(datA) {
  var data = datA;
  this.src = 'game';
  this.players = [];
  {
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
    if (!data.password) // If there is no password
      this.info.protected = false;else // If there is a password
      this.info.protected = true;
  }
  {
    // Teams
    this.teams = [];

    if (this.info.mode === 'skm' || this.info.mode === 'ctf') {
      for (var i = 0; i < this.info.teamCount; i++) {
        this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
      }
    } else if (this.info.mode === 'inf') {
      for (var _i = 0; _i < 2; _i++) {
        // Only can be two teams in infection (healthy/infected)
        this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
      }
    }
  }
  {
    // Rounds
    this.rounds = {
      host: undefined,
      // Identification purposes
      util: false,
      // If game utilizes rounds
      waiting: true,
      delayed: false,
      delaystart: undefined,
      rounddelay: _rounddelay,
      start: undefined,
      min: undefined,
      // Min players
      winner: undefined
    };

    if (this.info.mode === 'srv' || this.info.mode === 'ctf' || this.info.mode === 'inf' || this.info.mode === 'kth') {
      // If game mode utilizes round system
      this.rounds.util = true;
      this.rounds.host = this.info.host;
      this.rounds.min = data.min;
      this.rounds.waiting = true;
    }
  }
  this.board = new Board(data);
  this.world = new World(data);
  if (this.info.mode === 'ctf') this.flag = new Flag(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2, this.world.border.color);
  this.players = [];
  this.spectators = [];
  this.orgs = [];
  this.abilities = [];
};

function createGame(datA) {
  game = new Game(datA);
  socket.emit('Game Created', game);
  if (game.info.protected) // If game is password protected
    socket.emit('Password Created', {
      pass: datA.password,
      info: game.info
    });
}
"use strict";

var games = [];
var state;
var mouseDown = false;

function setup() {
  state = 'setup';
  noCanvas(); // Canvas settings

  rectMode(CENTER); // "

  ellipseMode(RADIUS); // "

  angleMode(DEGREES); // "

  textAlign(LEFT); // "

  connectSocket();
  var page = document.body.parentNode; // Edit global variable mouseDown to determine if mouse is down or up anywhere on the page

  var md = function md() {
    return mouseDown = true;
  }; // "


  page.removeEventListener('mousedown', md); // "

  page.addEventListener('mousedown', md); // "

  var mu = function mu() {
    return mouseDown = false;
  }; // "


  page.removeEventListener('mouseup', mu); // "

  page.addEventListener('mouseup', mu); // "

  var socketInterval = setInterval(function () {
    // Create instance of Ability, but socket object must exist first, so loop until socket exists
    ability = new Ability({
      player: socket.id
    }); // Create new instance of Ability

    if (socket.id) {
      // If socket.id has loaded
      clearInterval(socketInterval); // End the loop
    }
  }, 50);
  center = {
    // Set coordinates of center of window (and canvas)
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  renderTitle();
  title = new Title();
}
/**
 * Initialize game
 * @param  object game_ game object holding all game-wide info
 * @param  object data: {
 *                         spectate: boolean true: initialize as spectator, false: initialize as player
 *                      }
 * @return void
 */


function initialize(game_, data) {
  ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
  game = game_;

  if (data.spectate !== true) {
    // Field can be left undefined
    spawn({
      color: data.color,
      skin: data.skin,
      team: data.team
    });
  } else if (data.spectate === true) {
    spectate({
      color: data.color,
      skin: data.skin,
      team: data.team
    });
  }
}
/**
 * Event listener called when user presses a key
 * @return boolean false: disables default behaviors
 */


function keyPressed() {
  switch (keyCode) {
    case Controls.ability1.code:
      // X by default
      if ((state == 'game' || state == 'tutorial') && org.alive == true) {
        if (ability.extend.activated == true && ability.extend.can == true) {
          extend(org.player); // Extend self
        } else if (ability.compress.activated == true && ability.compress.can == true) {
          shoot(0, 1); // for (let i = 0; i < game.info.count; i++) {
          //    if (org.target == game.players[i]) { // Find targeted org
          //       compress(org.target); // Compress targeted org
          //       break;
          //    }
          // }
        } else if (ability.tag.activated == true && ability.tag.can == true) {
          shoot(0, 1);
        } // if (ability.speed.activated == true) { // Speed/Slow; OLD
        //    speed(org.player);
        // } else if (ability.slow.activated == true) {
        //    slow(org.target);
        // }

      }

      break;

    case Controls.ability2.code:
      // C by default
      if ((state == 'game' || state == 'tutorial') && org.alive == true) {
        if (ability.immortality.activated == true && ability.immortality.can == true) {
          immortality(org.player); // Immortalize self
        } else if (ability.freeze.activated == true && ability.freeze.can == true) {
          shoot(1, 1); // for (let i = 0; i < game.info.count; i++) {
          //    if (org.target == game.players[i]) { // Find targeted org
          //       freeze(org.target); // Freeze targeted org
          //       break;
          //    }
          // }
        }
      }

      break;

    case Controls.ability3.code:
      // V by default
      if ((state == 'game' || state == 'tutorial') && org.alive == true) {
        // if (ability.stimulate.activated == true && ability.stimulate.can == true) { // Stimulate/Poison OLD
        //    stimulate(org.player); // Stimulate self
        // } else if (ability.poison.activated == true && ability.poison.can == true) {
        //    shoot(2, 1);
        //    // for (let i = 0; i < game.info.count; i++) {
        //    //    if (org.target == game.players[i]) { // Find targeted org
        //    //       poison(org.target); // Poison targeted org
        //    //       break;
        //    //    }
        //    // }
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
      if ((state === 'game' || state === 'tutorial') && org.alive) {
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
          renderMenu('respawn', game); // Load respawn menu
        } else {
          alert('Game is at maximum player capacity'); // Return to spectate mode
        }
      }

      break;

    case Controls.pause.code:
      {
        // ESC by default
        switch (state) {
          // Used as the back key for menus (variable pause key may be used as well)
          case 'createMenu':
          case 'browser':
            renderTitle(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering

            break;

          case 'joinMenu':
            if (game.info.host === socket.id) {
              // If player is host (If player is joining directly after creating the game)
              socket.emit('Game Ended', game);
              renderTitle();
            } else {
              renderBrowser();
            }

            break;

          case 'spectateMenu':
            renderBrowser();
            break;

          case 'game':
            renderMenu('pauseGame', game);
            break;

          case 'spectate':
            renderMenu('pauseSpectate', game);
            break;

          case 'tutorial':
            renderMenu('pauseTutorial', tutorial);
            break;

          case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()

          case 'respawnMenu':
            // Respawn is included because 'back' for respawn should return to spectate
            state = 'spectate';
            ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
            break;

          case 'pauseGameMenu':
            var skip = false;

            for (var i = 0; i < game.players.length; i++) {
              if (game.players[i] === socket.id) {
                // If still is a player
                state = 'game';
                skip = true;
                break;
              }
            }

            if (!skip) {
              for (var _i = 0; _i < game.spectators.length; _i++) {
                if (game.spectators[_i] === socket.id) {
                  state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu

                  break;
                }
              }
            }

            ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
            break;

          case 'pauseTutorialMenu':
            state = 'tutorial';
            ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
            break;
        }

        break;
      }
  } // Hard key codes are separate from variable codes, so in the case of overlap, hard codes will always run


  switch (keyCode) {
    case 27 !== Controls.pause.code ? 27 : '':
      // ESCAPE only if variable pause key is not ESCAPE (keyCode cannot be a string)
      switch (state) {
        // Used as the back key for menus (variable pause key may be used as well)
        case 'createMenu':
        case 'browser':
          renderTitle(); // unmountComponentAtNode() is unnecessary since ReactDOM.render() clears container before rendering

          break;

        case 'joinMenu':
          if (game.info.host === socket.id) {
            // If player is host (If player is joining directly after creating the game)
            socket.emit('Game Ended', game);
            renderTitle();
          } else {
            renderBrowser();
          }

          break;

        case 'spectate':
          renderBrowser();
          break;

        case 'pauseSpectateMenu': // Cannot access instance of <Menu> component class to bind as this keyword in submit()

        case 'respawnMenu':
          // Respawn is included because 'back' for respawn should return to spectate
          state = 'spectate';
          ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
          break;

        case 'pauseGameMenu':
          var _skip = false;

          for (var _i2 = 0; _i2 < game.players.length; _i2++) {
            if (game.players[_i2] === socket.id) {
              // If still is a player
              state = 'game';
              _skip = true;
              break;
            }
          }

          if (!_skip) {
            for (var _i3 = 0; _i3 < game.spectators.length; _i3++) {
              if (game.spectators[_i3] === socket.id) {
                state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu

                break;
              }
            }
          }

          ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
          break;

        case 'pauseTutorialMenu':
          state = 'tutorial';
          ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
          break;
      }

      break;
  }
}
/**
 * Event listener called when any mouse button is clicked
 *    Not currently in use
 * @return boolean false should disable default behaviors
 */


function mouseClicked() {
  if (mouseButton == LEFT) {
    // if (state == 'game') { // DO NOT DELETE (Click detection is very long)
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
    return false; // Supposedly negates default behavior
  } else if (mouseButton == RIGHT) {
    return false; // Supposedly negates default behavior
  } else if (mouseButton == CENTER) {
    return false; // Supposedly negates default behavior
  }
}
/**
 * Event listener for when the browser's window frame is resized
 *    Resizes the canvas to match the window
 *    Resizes the world to match the canvas
 *    Updates variables to match changes
 * @return void
 */


function windowResized() {
  center = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };
  var src = getSrc();

  if (state === 'title' || state === 'browser' || state === 'tutorial') {
    src.resize(0, 0, window.innerWidth, window.innerHeight);
  } else if (state === 'game' || state === 'spectate') {
    org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly

    org.off.y = org.pos.y - center.y;
    ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
  } else if (state.indexOf('Menu') !== -1) {
    var type = state.slice(0, -4); // To make state string, 'Menu' is concatenated to the end of menu type, remove 'Menu' from state to get menu type

    var data = type === 'join' || type === 'spectate' || type === 'respawn' ? game : null; // Only join, spectate, and respawn menus use game variable as data

    renderMenu(type, data); // <div id='cont'><Menu type={} data={} /></div>

    if (src.src === 'title') {
      // ^^ Cut out Menu at end of state string for menu type; Send game as data if src is 'game'; Send tutorial as data is src is 'tutorial'
      src.resize(0, 0, window.innerWidth, window.innerHeight);
    } else if (src.src === 'game') {
      // If menu during game (player or spectator)
      org.off.x = org.pos.x - center.x; // Reposition org (camera) correctly

      org.off.y = org.pos.y - center.y;
    } else if (src.src === 'tutorial') {
      src.resize(0, 0, window.innerWidth, window.innerHeight);
    } // Resize the content of the canvas in the background of menus

  }
}
"use strict";

var org;

var Org = function Org(data) {
  var _this = this;

  // data: { player: , color: , skin: , team: , spectating: , pos: , title: } (color and skin are required)
  this.player = data.player;
  this.color = data.color;
  this.skin = data.skin;
  this.team = data.team;
  var src = getSrc();

  if (src != undefined && src.src == 'game') {
    if (game.rounds.util) {
      this.ready = false; // org.ready ensures that org will only be forcibly respawned once
    }

    if (game.info.mode === 'srv' && !game.rounds.waiting) {
      this.spawn = false;
    } else {
      this.spawn = true; // Allowance to spawn
    }

    for (var i = 0; i < game.board.list.length; i++) {
      if (game.board.list[i].player === this.player) {
        // Find player name in leaderboard list
        this.name = game.board.list[i].name;
      }
    }
  }

  if (data.spectating) {
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
      this.pos = {
        // Position is the target's location in the world
        x: floor(random(game.world.x + 50 + _cellwidth / 2, game.world.x + game.world.width - 50 - _cellwidth / 2)),
        // +- 50 acts as buffer
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

  this.off = {
    // Offset is the difference between pos and center
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

  this.tracker = {
    // Used to ensure no double org growth intervals
    start: undefined,
    end: undefined,
    elap: undefined
  }; // Helper Functions

  /**
   * Compress the org object into only the data that must be sent to the server
   *    In order to reduce latency, data sent through web socket should be minimized
   *    Currently, only the following properties are updated each tick:
   *       alive, cells, off, pos, color, skin, team, coefficient, range
   * @return {Object} contains only attributes of org, no functional properties
   */

  this.getCompressed = function () {
    return {
      player: _this.player,
      // Properties are listed here in the order they appear above in this file (/public/js/org.js)
      color: _this.color,
      skin: _this.skin,
      team: _this.team,
      ready: _this.ready,
      spawn: _this.spawn,
      name: _this.name,
      speed: _this.speed,
      cells: _this.cells,
      count: _this.count,
      pos: _this.pos,
      off: _this.off,
      col: _this.col,
      // target: this.target,
      // clickbox: this.clickbox,
      coefficient: _this.coefficient,
      range: _this.range,
      alive: _this.alive,
      hit: _this.hit,
      intervals: _this.intervals,
      tracker: _this.tracker
    };
  };

  this.clearIntervals = function () {
    for (var _i2 = 0; _i2 < _this.intervals.length; _i2++) {
      clearInterval(_this.intervals[_i2]);
    }

    _this.intervals = [];
  };

  this.x = function () {
    // The average of all cell x values 
    var sum = 0;

    for (var i = 0; i < _this.count; i++) {
      sum += _this.cells[i].x;
    }

    var average = sum / _this.count;
    return average;
  };

  this.y = function () {
    // The average of all cell y values
    var sum = 0;

    for (var i = 0; i < _this.count; i++) {
      sum += _this.cells[i].y;
    }

    var average = sum / _this.count;
    return average;
  };

  this.checkAlive = function () {
    if (_this.count > 0) _this.alive = true;else if (_this.count === 0) _this.alive = false;else console.error('(org).checkAlive(): (org).count < 0');
  }; // this.setClickbox = () => { // DO NOT DELETE
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


  this.getRegionInfo = function () {
    var enclosed = [];
    var exposed = [];
    var adjacent = [];

    for (var _i3 = 0; _i3 < _this.count; _i3++) {
      var test = {
        x: undefined,
        y: undefined
      };
      var left = false;
      var top = false;
      var right = false;
      var bottom = false;

      for (var _j3 = 0; _j3 < _this.count; _j3++) {
        if (_i3 != _j3) {
          test = {
            // Left
            x: _this.cells[_i3].x - _this.cells[_i3].width,
            y: _this.cells[_i3].y
          };

          if (test.x == _this.cells[_j3].x && test.y == _this.cells[_j3].y) {
            left = true; // There is a friendly cell to the left
          }

          test = {
            // Top
            x: _this.cells[_i3].x,
            y: _this.cells[_i3].y - _this.cells[_i3].height
          };

          if (test.x == _this.cells[_j3].x && test.y == _this.cells[_j3].y) {
            top = true; // There is a friendly cell to the top
          }

          test = {
            // Right
            x: _this.cells[_i3].x + _this.cells[_i3].width,
            y: _this.cells[_i3].y
          };

          if (test.x == _this.cells[_j3].x && test.y == _this.cells[_j3].y) {
            right = true; // There is a friendly cell to the right
          }

          test = {
            // Bottom
            x: _this.cells[_i3].x,
            y: _this.cells[_i3].y + _this.cells[_i3].height
          };

          if (test.x == _this.cells[_j3].x && test.y == _this.cells[_j3].y) {
            bottom = true; // There is a friendly cell to the bottom
          }
        }
      }

      if (left == true && top == true && right == true && bottom == true) {
        // If cell is enclosed on all sides by friendly cells
        enclosed.push(_this.cells[_i3]);
      } else {
        // If cell is not enclosed on all sides by friendly cells
        exposed.push(_this.cells[_i3]);
      }

      if (left == false) {
        // Push all empty regions adjacent to org
        adjacent.push({
          x: _this.cells[_i3].x - _this.cells[_i3].width,
          y: _this.cells[_i3].y
        });
      }

      if (top == false) {
        adjacent.push({
          x: _this.cells[_i3].x,
          y: _this.cells[_i3].y - _this.cells[_i3].height
        });
      }

      if (right == false) {
        adjacent.push({
          x: _this.cells[_i3].x + _this.cells[_i3].width,
          y: _this.cells[_i3].y
        });
      }

      if (bottom == false) {
        adjacent.push({
          x: _this.cells[_i3].x,
          y: _this.cells[_i3].y + _this.cells[_i3].height
        });
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

  this.grow = function () {
    // Avoid double intervals
    if (_this.tracker.start) {
      // If tracker has been started
      _this.tracker.end = Date.now();
      _this.tracker.elap = _this.tracker.end - _this.tracker.start;
    }

    if (_this.tracker.elap < _orgfrequency * .6) {
      // If org is growing ~twice as frequently as it should
      switch (state) {
        // Recreate org growth interval (stored in an array so if multiple intervals are created accidentally, they can be cleared)
        case 'game': // Only necessary in states where orgs are growing (game and game pause menu), others states may be added

        case 'pauseGameMenu':
          _this.clearIntervals();

          _this.intervals.push(setInterval(function () {
            return runLoop();
          }, _orgfrequency));

          break;
      }
    }

    var src = getSrc();
    var ability;

    for (var _i4 = 0; _i4 < src.abilities.length; _i4++) {
      if (src.abilities[_i4].player == _this.player) {
        ability = src.abilities[_i4];
        break;
      }
    }

    _this.birth();

    _this.naturalDeath();

    _this.checkAbilities();

    _this.checkAlive();

    socket.emit('Org Update', [_this.alive, // Only the following attributes of org need to be updated
    _this.cells, // Latency is decreased by only sending necessary data
    _this.off, // Order of this array matters and is encoded in /src/app.js @ socket.on('Org Update')
    _this.pos, _this.color, _this.skin, _this.team, _this.coefficient, _this.range]);

    if (_this.count === 0) {
      for (var _i5 = 0; _i5 < game.board.list.length; _i5++) {
        if (game.board.list[_i5].player === socket.id) {
          // Add death to leaderboard
          game.board.list[_i5].deaths++; // Add 1 to deaths counter

          orderBoard(game.board.list); // Sort the list by kills then deaths

          socket.emit('Board', {
            list: game.board.list,
            host: game.board.host
          }); // Send updated board to server
        }
      }

      if (_this.hit !== _this.player) {
        // Cannot gain kill for suicide
        for (var _i6 = 0; _i6 < game.board.list.length; _i6++) {
          if (game.board.list[_i6].player === _this.hit) {
            // Find killer in leaderboard list
            game.board.list[_i6].kills++;
            orderBoard(game.board.list);
            socket.emit('Board', {
              list: game.board.list,
              host: game.board.host
            });
            break;
          }
        }
      }

      die(true);
    }

    _this.tracker.start = Date.now();
  };
  /**
   * Determine if and where cells should be born during a single tick
   * @return void
   */


  this.birth = function () {
    var src = getSrc();

    var regions = _this.getRegionInfo();

    if (ability.freeze.value === false) {
      // If org is not Frozen (cannot birth or die naturally)
      // for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
      // if (ability.poison.value == true) {
      //    if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
      //       continue;
      //    }
      // }
      for (var _i7 = 0; _i7 < regions.adjacent.length; _i7++) {
        // Only Adjacent Regions Can Produce New Cells
        // Don't birth new cell outside world boundary
        if (src.world) {
          if (src.world.type === 'rectangle') {
            if (regions.adjacent[_i7].x - _cellwidth / 2 <= src.world.x || regions.adjacent[_i7].x + _cellwidth / 2 >= src.world.x + src.world.width || regions.adjacent[_i7].y - _cellwidth / 2 <= src.world.x || regions.adjacent[_i7].y + _cellwidth / 2 >= src.world.y + src.world.height) {
              // If new cell would be outside world boundary
              continue;
            }
          } else if (src.world.type === 'ellipse') {
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
        } // Don't birth new cell on top of an opponent org


        var overlap = false;

        for (var _j4 = 0; _j4 < src.orgs.length; _j4++) {
          if (src.orgs[_j4].player === _this.player) {
            // If org is player's org
            continue;
          }

          for (var k = 0; k < src.orgs[_j4].count; k++) {
            if (regions.adjacent[_i7].x + _cellwidth / 2 >= src.orgs[_j4].cells[k].x - _cellwidth / 2 && regions.adjacent[_i7].x + _cellwidth / 2 <= src.orgs[_j4].cells[k].x + _cellwidth / 2) {
              // If right side collides
              if (regions.adjacent[_i7].y + _cellwidth / 2 >= src.orgs[_j4].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y + _cellwidth / 2 <= src.orgs[_j4].cells[k].y + _cellwidth / 2) {
                // If bottom side collides
                overlap = true;
              } else if (regions.adjacent[_i7].y - _cellwidth / 2 >= src.orgs[_j4].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y - _cellwidth / 2 <= src.orgs[_j4].cells[k].y + _cellwidth / 2) {
                // If top side collides
                overlap = true;
              }
            } else if (regions.adjacent[_i7].x - _cellwidth / 2 >= src.orgs[_j4].cells[k].x - _cellwidth / 2 && regions.adjacent[_i7].x - _cellwidth / 2 <= src.orgs[_j4].cells[k].x + _cellwidth / 2) {
              // If left side collides
              if (regions.adjacent[_i7].y + _cellwidth / 2 >= src.orgs[_j4].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y + _cellwidth / 2 <= src.orgs[_j4].cells[k].y + _cellwidth / 2) {
                // If bottom side collides
                overlap = true;
              } else if (regions.adjacent[_i7].y - _cellwidth / 2 >= src.orgs[_j4].cells[k].y - _cellwidth / 2 && regions.adjacent[_i7].y - _cellwidth / 2 <= src.orgs[_j4].cells[k].y + _cellwidth / 2) {
                // If top side collides
                overlap = true;
              }
            }
          }
        }

        if (overlap === true) {
          continue;
        } // Birth new cell accordingly


        if (ability.compress.value ^ ability.extend.value == 0) {
          // compress.value NOT XOR extend.value
          _this.coefficient = -27.5;
          _this.range = _range;
        } else if (ability.compress.value == true) {
          _this.coefficient = -31.5;
          _this.range = _range - 10;
        } else if (ability.extend.value == true) {
          _this.coefficient = -25.5;
          _this.range = _range + 20;
        }

        var chance = _this.coefficient * Math.log(sqrt(sq(regions.adjacent[_i7].x - _this.pos.x) + sq(regions.adjacent[_i7].y - _this.pos.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100

        if (random(0, 100) <= chance) {
          var repeat = false;

          for (var _j5 = 0; _j5 < _this.count; _j5++) {
            if (regions.adjacent[_i7].x == _this.cells[_j5].x && regions.adjacent[_i7].y == _this.cells[_j5].y) {
              repeat = true;
              break;
            }
          }

          if (repeat === false) {
            _this.cells.push(new Cell(regions.adjacent[_i7].x, regions.adjacent[_i7].y, _this));

            _this.count++;
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


  this.naturalDeath = function () {
    var src = getSrc();

    var regions = _this.getRegionInfo();

    if (ability.freeze.value === false) {
      // If org is not Frozen (cannot birth or die naturally)
      if (ability.immortality.value === false) {
        // If org is not Immortal
        for (var _i8 = 0; _i8 < regions.exposed.length; _i8++) {
          // Only Exposed Cells Can Die
          var chance = _this.coefficient * Math.log(-regions.exposed[_i8].d(_this) + (_this.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100

          if (regions.exposed[_i8].d(_this) > _this.range) {
            // If exposed cell is outside maximum radius
            for (var _j6 = 0; _j6 < _this.count; _j6++) {
              if (regions.exposed[_i8].x === _this.cells[_j6].x && regions.exposed[_i8].y === _this.cells[_j6].y) {
                // Find exposed cell within org cells array
                _this.cells.splice(_j6, 1);

                _this.count--;
                regions.exposed.splice(_i8, 1);
                _i8--;
                _j6--;
                break;
              }
            }

            continue;
          }

          if (src.world.type == 'rectangle' && (regions.exposed[_i8].x < src.world.x || regions.exposed[_i8].x > src.world.x + src.world.width || regions.exposed[_i8].y < src.world.y || regions.exposed[_i8].y > src.world.y + src.world.height)) {
            // If cell is outside rectangular world
            for (var _j7 = 0; _j7 < _this.count; _j7++) {
              if (regions.exposed[_i8].x === _this.cells[_j7].x && regions.exposed[_i8].y === _this.cells[_j7].y) {
                _this.cells.splice(_j7, 1);

                _this.count--;
                regions.exposed.splice(_i8, 1);
                _i8--;
                _j7--;
                break;
              }
            }
          } else if (src.world.type === 'ellipse' && sq(regions.exposed[_i8].x - src.world.x - src.world.width / 2) / sq(src.world.width / 2) + sq(regions.exposed[_i8].y - src.world.y - src.world.height / 2) / sq(src.world.height / 2) > 1) {
            // If outside elliptical world
            for (var _j8 = 0; _j8 < _this.count; _j8++) {
              if (regions.exposed[_i8].x === _this.cells[_j8].x && regions.exposed[_i8].y === _this.cells[_j8].y) {
                // Identify cell
                _this.cells.splice(_j8, 1);

                _this.count--;
                regions.exposed.splice(_i8, 1);
                _i8--;
                _j8--;
                break;
              }
            }
          }

          if (random(0, 100) <= chance) {
            for (var _j9 = 0; _j9 < _this.count; _j9++) {
              if (regions.exposed[_i8].x === _this.cells[_j9].x && regions.exposed[_i8].y === _this.cells[_j9].y) {
                _this.cells.splice(_j9, 1);

                _this.count--;
                regions.exposed.splice(_i8, 1);
                _i8--;
                _j9--;
                break;
              }
            }
          }
        }
      }
    }
  };

  this.checkAbilities = function () {
    var src = getSrc();

    for (var _i9 = 0; _i9 < src.orgs.length; _i9++) {
      if (src.orgs[_i9].team === _this.team && typeof team === 'string' && src.orgs[_i9].player !== socket.id) {
        // If is friendly org but not own org
        continue; // No friendly fire but can hurt self
      }

      if (src.abilities[_i9].secrete.value === true) {
        // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
        for (var _j10 = 0; _j10 < _this.count; _j10++) {
          for (var k = 0; k < src.abilities[_i9].spore.count; k++) {
            if (sqrt(sq(_this.cells[_j10].x - src.abilities[_i9].spore.spores[k].x) + sq(_this.cells[_j10].y - src.abilities[_i9].spore.spores[k].y)) <= src.abilities[_i9].secrete.radius) {
              // If center of cell is within secrete circle (subject to change)
              var skip = false;

              for (var l = 0; l < src.abilities.length; l++) {
                if (src.abilities[l].neutralize.value === true && sqrt(sq(_this.cells[_j10].x - src.abilities[l].neutralize.x) + sq(_this.cells[_j10].y - src.abilities[l].neutralize.y)) <= src.abilities[l].neutralize.radius) {
                  // If center of cell is within neutralize circle
                  skip = true;
                  break;
                }
              }

              if (skip) {
                continue; // Acid is ineffectual when neutralized
              }

              _this.hit = src.abilities[_i9].player;

              if (src.src === 'game' && _this.hit !== _this.player) {
                // Only for game; Only for other player hits
                for (var _l = 0; _l < src.teams.length; _l++) {
                  // Search teams
                  if (src.teams[_l].indexOf(_this.hit) !== -1 && src.teams[_l].indexOf(_this.player) !== -1) {
                    // If player and hitter are on same team
                    skip = true;
                    break;
                  }
                }
              }

              if (skip) {
                continue; // Acid is ineffectual when neutralized
              }

              _this.cells.splice(_j10, 1);

              _this.count--;
              _j10--;
              break;
            }
          }
        }
      }

      for (var _j11 = 0; _j11 < 3; _j11++) {
        // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
        if (src.abilities[_i9].shoot.secrete[_j11].value == true) {
          for (var _k = 0; _k < _this.count; _k++) {
            if (sqrt(sq(_this.cells[_k].x - src.abilities[_i9].shoot.spore[_j11].x) + sq(_this.cells[_k].y - src.abilities[_i9].shoot.spore[_j11].y)) <= src.abilities[_i9].shoot.secrete[_j11].radius) {
              // If center of cell is within shoot circle (subject to change)
              var _skip = false;

              for (var _l2 = 0; _l2 < src.abilities.length; _l2++) {
                if (src.abilities[_l2].neutralize.value == true && sqrt(sq(_this.cells[_j11].x - src.abilities[_l2].neutralize.x) + sq(_this.cells[_j11].y - src.abilities[_l2].neutralize.y)) <= src.abilities[_l2].neutralize.radius) {
                  // If center of cell is within neutralize circle
                  _skip = true;
                  break;
                }
              }

              if (_skip) {
                continue; // Acid is ineffectual when neutralized
              }

              _this.hit = src.abilities[_i9].player;

              if (src.src === 'game' && _this.hit !== _this.player) {
                // Only for game; Only for other player hits
                for (var _l3 = 0; _l3 < src.teams.length; _l3++) {
                  // Search teams
                  if (src.teams[_l3].indexOf(_this.hit) !== -1 && src.teams[_l3].indexOf(_this.player) !== -1) {
                    // If player and hitter are on same team
                    _skip = true;
                    break;
                  }
                }
              }

              if (_skip) {
                continue; // Acid is ineffectual when neutralized
              }

              _this.cells.splice(_k, 1);

              _this.count--;
              _k--; // break; // Break causes cells to die one at a time (not default)
            }
          }
        }
      }

      if (src.abilities[_i9].toxin.value == true) {
        // Toxin
        for (var _j12 = 0; _j12 < _this.count; _j12++) {
          if (_this.player == src.abilities[_i9].player) {
            // If is own org's toxin
            continue; // Do not kill own cells
          }

          if (sqrt(sq(_this.cells[_j12].x - src.abilities[_i9].toxin.x) + sq(_this.cells[_j12].y - src.abilities[_i9].toxin.y)) <= src.abilities[_i9].toxin.radius) {
            // If center of cell is within toxin circle
            var _skip2 = false;

            for (var _l4 = 0; _l4 < src.abilities.length; _l4++) {
              if (src.abilities[_l4].neutralize.value == true && sqrt(sq(_this.cells[_j12].x - src.abilities[_l4].neutralize.x) + sq(_this.cells[_j12].y - src.abilities[_l4].neutralize.y)) <= src.abilities[_l4].neutralize.radius) {
                // If center of cell is within neutralize circle
                _skip2 = true;
                break;
              }
            }

            if (_skip2) {
              continue; // Acid is ineffectual when neutralized
            }

            _this.hit = src.abilities[_i9].player;

            if (src.src === 'game' && _this.hit !== _this.player) {
              // Only for game; Only for other player hits
              for (var _l5 = 0; _l5 < src.teams.length; _l5++) {
                // Search teams
                if (src.teams[_l5].indexOf(_this.hit) !== -1 && src.teams[_l5].indexOf(_this.player) !== -1) {
                  // If player and hitter are on same team
                  _skip2 = true;
                  break;
                }
              }
            }

            if (_skip2) {
              continue; // Acid is ineffectual when neutralized
            }

            _this.cells.splice(_j12, 1); // Kill cell


            _this.count--;
            _j12--; // break; // Break causes cells to die one at a time (not default)
          }
        }
      }
    }
  };
};

var Cell = function Cell(x, y, org) {
  this.player = org.player;
  this.width = _cellwidth; // or 3x3

  this.height = _cellwidth;
  this.x = x;
  this.y = y;
  this.color = org.color;

  this.r = function () {
    // Distance from org center
    var distance = sqrt(sq(this.x - org.x()) + sq(this.y - org.y()));
    return distance;
  };

  this.d = function (org) {
    // Distance from target (Position in world)
    var distance = sqrt(sq(this.x - org.pos.x) + sq(this.y - org.pos.y));
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
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function spawn(data) {
  // data: { color: {}, skin: '', team: '' }
  state = 'game';
  org = new Org({
    player: socket.id,
    color: data.color,
    skin: data.skin,
    team: data.team,
    spectating: false
  });
  org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org

  org.count++;
  var compressedOrg = org.getCompressed();
  socket.emit('Player Joined', {
    info: game.info,
    org: compressedOrg,
    ability: ability
  });
}

function spectate(data) {
  // data: { color: {}, pos: {}, skin: '', team: '' }
  state = 'spectate';
  socket.emit('Spectator Joined', game);
  org = new Org({
    player: socket.id,
    color: data.color,
    skin: data.skin,
    team: data.team,
    pos: data.pos,
    spectating: true
  });
}

function renderUI() {
  var src = getSrc(); // Crosshair

  if (src.src != 'tutorial') {
    noFill();
    stroke(src.world.border.color.r, src.world.border.color.g, src.world.border.color.b);
    strokeWeight(1);
    line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
    line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);
  } // // Render Clickbox
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

    var _loop = function _loop(i) {
      for (var j = 0; j < game.board.list.length; j++) {
        if (game.orgs[i].player == game.board.list[j].player) {
          var x = function x() {
            // x() and y() cannot be accessed through orgs array, so code is copied and edited from org file
            var sum = 0;

            for (var k = 0; k < game.orgs[i].count; k++) {
              sum += game.orgs[i].cells[k].x;
            }

            var average = sum / game.orgs[i].count;
            return average;
          };

          var y = function y() {
            var sum = 0;

            for (var k = 0; k < game.orgs[i].count; k++) {
              sum += game.orgs[i].cells[k].y;
            }

            var average = sum / game.orgs[i].count;
            return average;
          };

          if (game.board.list[j].name.length <= 30) {
            text(game.board.list[j].name, x() - textWidth(game.board.list[j].name) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
          } else {
            text(game.board.list[j].name.slice(0, 20) + '...', x() - textWidth(game.board.list[j].name.slice(0, 20)) / 2, y() + sqrt(sq(_cellwidth) * game.orgs[i].count / PI) + 2 * _cellwidth + 8); // sqrt expression approximates radius as a circle; 6 is buffer
          }
        }
      }
    };

    for (var i = 0; i < game.info.count; i++) {
      _loop(i);
    }
  } // Ability Cooldowns


  if (!src.stopped) {
    for (var i in ability) {
      // Regular Cooldowns
      if (_typeof(ability[i]) == 'object' && i !== 'shoot') {
        if (ability[i].cooling == true) {
          cooldown(ability[i]);
        }
      }
    }

    for (var _i = 0; _i < ability.shoot.value.length; _i++) {
      // Shoot Cooldown
      if (ability.shoot.cooling[_i] == true) {
        cooldown(ability.shoot);
        break;
      }
    }
  } // Ability Tooltips


  translate(org.off.x, org.off.y);
  var currentTime;

  if (src.stopped == true) {
    currentTime = src.stopdate;
  } else {
    currentTime = new Date(); // Set current time
  }

  if (!ability.tag.activated) {
    for (var _i2 = 0; _i2 < 4; _i2++) {
      for (var j in ability) {
        if (_typeof(ability[j]) === 'object') {
          if (ability[j].i === _i2) {
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
              rect(center.x - 150 + _i2 * 100, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box

              var letter = void 0;

              if (_i2 == 0) {
                letter = Controls.ability1.key;
              } else if (_i2 == 1) {
                letter = Controls.ability2.key;
              } else if (_i2 == 2) {
                letter = Controls.ability3.key;
              } else if (_i2 == 3) {
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
              text(letter, center.x - 150 + _i2 * 100 - textWidth(letter) / 2, height * 9 / 10 + 30 + 13);
              fill(0);
              stroke(0);
              strokeWeight(1);
              ellipse(center.x - 150 + _i2 * 100, height * 9 / 10, 30); // Background ellipse; Necessary to cover the key tip

              fill(215);
              noStroke();

              if (ability[j].j == 0) {
                // If defensive ability (or spore)
                // Ability
                if (ability[j].value == true) {
                  // If during ability
                  arc(center.x - 150 + _i2 * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                } else if (ability[j].value == false && ability[j].can == false) {
                  // If during cooldown
                  arc(center.x - 150 + _i2 * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                } else if (ability[j].value == false && ability[j].can == true) {
                  // If idling
                  ellipse(center.x - 150 + _i2 * 100, height * 9 / 10, 29);
                }
              } else if (ability[j].j == 1) {
                // If offensive ability
                if (ability[j].i < 3) {
                  // If one of first three abilities (not secrete)
                  noStroke(); // Ability

                  if (ability[j].can == true) {
                    // Idle
                    ellipse(center.x - 150 + _i2 * 100, height * 9 / 10, 29);
                  } else if (ability[j].can == false && currentTime - ability[j].start <= ability[j].time) {
                    // If during ability
                    arc(center.x - 150 + _i2 * 100, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability[j].start) / ability[j].time * 360); // Ability timeout timer
                  } else if (ability[j].can == false && currentTime - ability[j].start > ability[j].time) {
                    // If during cooldown
                    arc(center.x - 150 + _i2 * 100, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
                  } // Shoot


                  if (j != 'toxin') {
                    // Toxin does not shoot
                    stroke(0);

                    if (ability.shoot.value[_i2] == false && ability.shoot.can[_i2] == true) {
                      // Idle
                      ellipse(center.x - 150 + _i2 * 100 - 41, height * 9 / 10, 8);
                    } else if (ability.shoot.value[_i2] == true && ability.shoot.can[_i2] == false) {
                      // If is shooting
                      arc(center.x - 150 + _i2 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[_i2]) / ability.shoot.time * 360); // Ability timeout timer
                    } else if (ability.shoot.secrete[_i2].value == true) {
                      // If is secreting
                      arc(center.x - 150 + _i2 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (ability.shoot.end[_i2] - ability.shoot.start[_i2]) / ability.shoot.time * 360 - (currentTime - ability.shoot.secrete[_i2].start) / ability.secrete.time * (360 - (ability.shoot.end[_i2] - ability.shoot.start[_i2]) / ability.shoot.time * 360)); // Secretion timer
                    } else if (currentTime - ability.shoot.secrete[_i2].end < ability.shoot.cooldown[_i2]) {
                      arc(center.x - 150 + _i2 * 100 - 41, height * 9 / 10, 8, 8, -90, -90 + (currentTime - ability.shoot.secrete[_i2].end) / ability.shoot.cooldown[_i2] * 360); // Shoot cooldown timer (if no hit)
                    }
                  }
                } else if (ability[j].i == 3) {
                  // Secrete
                  if (ability[j].can == true) {
                    // Idle
                    ellipse(center.x - 150 + _i2 * 100, height * 9 / 10, 29);
                  } else if (ability[j].can == false && currentTime - ability[j].start <= ability[j].time) {
                    // If during ability
                    arc(center.x - 150 + _i2 * 100, height * 9 / 10, 29, 29, -90, -90 - (ability.spore.end - ability.spore.start) / ability.spore.time * 360 - (currentTime - ability[j].start) / ability[j].time * (360 - (ability.spore.end - ability.spore.start) / ability.spore.time * 360)); // Ability cooldown timer
                  }
                }
              }

              itemize(items[j], 1, {
                r: 0,
                g: 0,
                b: 0
              }, center.x - 150 + _i2 * 100, height * 9 / 10);
            }

            if (ability[j].value == true && ability[j].i < 3) {
              // Ability Activated Tooltip (Not for spore/secrete)
              if (ability[j].j == 0 || ability[j].i == 3) {
                // If defensive ability (+ secrete)
                fill(66, 244, 176); // Green

                noStroke();
                ellipse(center.x - 150 + _i2 * 100 - 9, height * 9 / 10 - 37, 5, 5);
              } else if (ability[j].j == 1 && ability[j].i != 3) {
                // If offensive ability (No secrete)
                fill(255, 141, 135); // Red

                noStroke();
                ellipse(center.x - 150 + _i2 * 100 + 9, height * 9 / 10 - 37, 5, 5);
              }
            } // fill(215);
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

    var _letter;

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
    } else if (ability.tag.can == false && currentTime - ability.tag.start <= ability.tag.time) {
      // If during ability
      arc(center.x, height * 9 / 10, 29, 29, -90, -90 - (currentTime - ability.tag.start) / ability.tag.time * 360); // Ability timeout timer
    } else if (ability.tag.can == false && currentTime - ability.tag.start > ability.tag.time) {
      // If during cooldown
      arc(center.x, height * 9 / 10, 29, 29, -90, -90 + (currentTime - ability.tag.end) / ability.tag.cooldown * 360); // Ability cooldown timer
    }

    itemize(items.tag, 1, {
      r: 0,
      g: 0,
      b: 0
    }, center.x, height * 9 / 10); // Shoot

    fill(215);
    stroke(0);

    if (ability.shoot.value[ability.tag.i] == false && ability.shoot.can[ability.tag.i] == true) {
      // Idle
      ellipse(center.x - 41, height * 9 / 10, 8);
    } else if (ability.shoot.value[ability.tag.i] == true && ability.shoot.can[ability.tag.i] == false) {
      // If is shooting
      arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (currentTime - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360); // Ability timeout timer
    } else if (ability.shoot.secrete[ability.tag.i].value == true) {
      // If is secreting
      arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360 - (currentTime - ability.shoot.secrete[ability.tag.i].start) / ability.secrete.time * (360 - (ability.shoot.end[ability.tag.i] - ability.shoot.start[ability.tag.i]) / ability.shoot.time * 360)); // Secretion timer
    } else if (currentTime - ability.shoot.secrete[ability.tag.i].end < ability.shoot.cooldown[ability.tag.i]) {
      arc(center.x - 41, height * 9 / 10, 8, 8, -90, -90 + (currentTime - ability.shoot.secrete[ability.tag.i].end) / ability.shoot.cooldown[ability.tag.i] * 360); // Shoot cooldown timer (if no hit)
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
  var src;

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
/**
 * Enter game by starting game interval (runLoop()) (with org growth)
 * @return void
 */


function enter() {
  if (!org.intervals.length) {
    // org.intervals array must be of length 0
    org.intervals.push(setInterval(function () {
      return runLoop();
    }, _orgfrequency));
  }
}

function runLoop() {
  roundBehaviors();
  org.grow(); // org.setClickbox();
  // CTF

  if (game.info.mode === 'ctf') {
    game.flag.detectPickup();
  }
}

function roundBehaviors() {
  var currentTime = new Date();

  if (game.rounds.util) {
    if (game.info.host === socket.id) {
      // Only if player is host
      if (game.rounds.waiting && !game.rounds.delayed && game.info.count >= game.rounds.min) {
        // If waiting, not delayed, and have minimum players
        socket.emit('Round Delay', game);
        game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
      } else if (game.rounds.waiting && game.rounds.delayed && currentTime - game.rounds.delaystart >= game.rounds.rounddelay - 1000 && org.ready == false) {
        // Only host; If 1 second left in round-begin delay
        socket.emit('Force Spawn', game.info);
      }
    }

    if (game.info.mode === 'srv' && !game.rounds.waiting && !game.rounds.delayed && game.info.count <= 1 && game.players[0] === socket.id) {
      // Survival end-game: if during game and player is winner; count <= 1 (rather than === 1) in case multiple players die on last tick, setting count to 0
      for (var i = 0; i < game.board.list.length; i++) {
        if (game.board.list[i].player == socket.id) {
          socket.emit('Round End', game.info);
          game.board.list[i].wins++;
          orderBoard(game.board.list);
          socket.emit('Board', {
            list: game.board.list,
            host: game.board.host
          });
        }
      }
    }
  }
}

function die(spectating) {
  socket.emit('Dead', spectating);
  org.clearIntervals();

  for (var i in ability) {
    // Reset Ability Cooldowns
    if (_typeof(ability[i]) === 'object' && i !== 'shoot') {
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

  for (var _i3 = 0; _i3 < 3; _i3++) {
    // Reset shoots
    clearTimeout(ability.shoot.timeout[_i3]);
    ability.shoot.value[_i3] = false;
    ability.shoot.can[_i3] = true;
    ability.shoot.spore[_i3] = undefined;
    ability.shoot.secrete[_i3] = {};
    ability.shoot.start[_i3] = undefined;
    ability.shoot.end[_i3] = undefined;
  }

  socket.emit('Ability', ability);
}
"use strict";

var socket; // Initialize in global scope

var gamesInterval; // "
// let emitGameInterval; // "

function connectSocket() {
  socket = io.connect();
  gamesInterval = setInterval(function () {
    if (state !== 'game' && state !== 'spectate') {
      socket.emit('Games Request');
    }
  }, 250); // emitGameInterval = setInterval(() => {
  //    if (state === 'game' || state === 'spectate') {
  //       socket.emit('Game', { game: game });
  //    }
  // }, _renderfrequency);

  socket.on('Games', function (data) {
    // data: { games: , connections: }
    games = data.games;
    connections = data.connections;
    if (state === 'browser') renderBrowser();
  });
  socket.on('Enter', function () {
    return enter();
  }); // Begin growth

  socket.on('Force Spawn', function () {
    die(false); // 'false' parameter tells server not to emit 'Spectate' back to client

    for (var i = 0; i < game.spectators.length; i++) {
      if (game.spectators[i] === socket.id) {
        // If player is spectator
        socket.emit('Spectator Left', game.info); // Remove spectator from spectators array
      }
    }

    if (state === 'pauseSpectateMenu') {
      renderMenu('pauseGame', game); // Move to correct menu if on spectate menu
    } else if (state === 'respawnMenu') {
      renderMenu('pauseGame', game);
      menus.pauseGame.submit();
    }

    spawn({
      color: org.color,
      skin: org.skin,
      team: org.team
    }); // Respawn all players on round start

    org.spawn = false;
    org.ready = true; // org.ready ensures that org will only be forcibly respawned once
  });
  socket.on('Game', function (gamE) {
    game = gamE;

    if (ability.spore.value === true) {
      ability.spore.interval();
    }

    for (var i = 0; i < 3; i++) {
      if (ability.shoot.value[i] === true) {
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

        if (state === 'game') {
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

        if (state === 'spectate') {
          move(); // Move is after messages so everything has same offset
        }

        break;
    }
  });
  socket.on('Game Ended', function (game) {
    if (game.info.host !== socket.id) {
      // Don't alert host (he already knows)
      alert('The game has ended');
    }

    renderTitle();
  });
  socket.on('Spectate', function () {
    return spectate({
      color: org.color,
      pos: org.pos,
      skin: org.skin,
      team: org.team
    });
  });
  {
    // Abilities
    socket.on('Tag', function () {
      ability.tag.value = true;
      clearTimeout(ability.tag.timeout);
      socket.emit('Ability', ability);

      if (game.info.mode === '') {
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
    }); // socket.on('Speed', () => { // Not updated
    //    ability.speed.value = true;
    //    org.speed *= ability.speed.factor;
    //    clearTimeout(ability.speed.timeout);
    //    socket.emit('Ability', ability);
    //    ability.speed.timeout = setTimeout(() => { // End ability
    //       org.speed /= ability.speed.factor;
    //       ability.speed.value = false;
    //       socket.emit('Ability', ability);
    //    }, ability.speed.time);
    // });
    // socket.on('Slow', () => { // Not updated
    //    ability.slow.value = true;
    //    org.speed /= ability.slow.factor; // Divide speed by factor
    //    clearTimeout(ability.slow.timeout);
    //    socket.emit('Ability', ability);
    //    ability.slow.timeout = setTimeout(() => { // End ability
    //       org.speed *= ability.slow.factor; // Multiply speed by factor to reset to original
    //       ability.slow.value = false;
    //       socket.emit('Ability', ability);
    //    }, ability.slow.time);
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
    }); // socket.on('Stimulate', () => {
    //    ability.stimulate.value = true;
    //    clearTimeout(ability.stimulate.timeout);
    //    ability.stimulate.start = new Date();
    //    socket.emit('Ability', ability);
    //    ability.stimulate.timeout = setTimeout(() => { // End ability
    //       ability.stimulate.value = false;
    //       ability.stimulate.end = new Date();
    //       ability.stimulate.cooling = true;
    //       socket.emit('Ability', ability);
    //    }, ability.stimulate.time);
    // });
    // socket.on('Poison', () => {
    //    ability.poison.value = true;
    //    clearTimeout(ability.poison.timeout);
    //    socket.emit('Ability', ability);
    //    ability.poison.timeout = setTimeout(() => { // End ability
    //       ability.poison.value = false;
    //       socket.emit('Ability', ability);
    //    }, ability.poison.time);
    // });

    socket.on('Neutralize', function () {
      ability.neutralize.value = true;
      ability.neutralize.start = new Date();
      clearTimeout(ability.neutralize.timeout);
      ability.neutralize.x = org.pos.x;
      ability.neutralize.y = org.pos.y;
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
      ability.toxin.x = org.pos.x;
      ability.toxin.y = org.pos.y;
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
"use strict";

var tutorial;

function renderTutorial() {
  clearInterval(title.interval);
  ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
  state = 'tutorial';
}

var Tutorial = function Tutorial() {
  var _this = this;

  this.src = 'tutorial';
  this.task = 'move';
  this.taskTimeout = undefined;
  this.margin = _margin;
  this.world = new World({
    width: window.innerWidth - this.margin * 2,
    height: window.innerHeight - this.margin * 2,
    type: 'rectangle',
    color: 'black',
    x: this.margin,
    y: this.margin
  });
  {
    // Org
    var colors = [];

    for (var j in orgColors.black) {
      if (j != 'sun' && j != 'sky') {
        // No bright colors which would obscure the crosshair in tutorial to minimize confusion
        colors.push(orgColors.black[j]);
      }
    }

    var color = random(colors);
    org = new Org({
      player: socket.id,
      color: color,
      skin: 'none',
      spectating: false,
      pos: {
        x: center.x,
        y: center.y
      },
      title: false
    });
    org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org

    org.count++;
  }
  this.orgs = [org];
  this.abilities = [ability];
  this.ointerval = setInterval(function () {
    for (var i = 0; i < _this.orgs.length; i++) {
      _this.orgs[i].grow();

      if (org.count == 0) {
        _this.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org

        _this.orgs[i].count++;
      }
    }
  }, _orgfrequency); // 70ms

  this.rinterval = setInterval(function () {
    {
      // Render
      // Background
      background(_this.world.backdrop.r, _this.world.backdrop.g, _this.world.backdrop.b); // Shadows

      {
        // World
        fill(_this.world.backdrop.r - 20, _this.world.backdrop.g - 20, _this.world.backdrop.b - 20);
        noStroke();
        rect(_this.world.x + _this.world.width / 2 + 7, _this.world.y + _this.world.height / 2 + 6, _this.world.width, _this.world.height);
      }
      {
        // Messages
        if (Messages == true) {
          textFont('Helvetica');
          textStyle(NORMAL);
          var message = currentMessage();

          if (message != undefined) {
            var breaks = freq(message, '\n');
            var width = messageWidth(message);
            rect(5 + 25 + width / 2, 4 + 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
          }
        }
      } // World

      fill(_this.world.background.r, _this.world.background.g, _this.world.background.b);
      stroke(_this.world.border.color.r, _this.world.border.color.g, _this.world.border.color.b);
      strokeWeight(1);
      rect(_this.world.x + _this.world.width / 2, _this.world.y + _this.world.height / 2, _this.world.width, _this.world.height); // Game

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
    }
    {
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
  }, _renderfrequency); // 40ms

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
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;
    var old_x = this.world.x - this.margin;
    var old_y = this.world.y - this.margin;

    for (var i = 0; i < this.orgs.length; i++) {
      this.orgs[i].pos.x = (this.orgs[i].pos.x - this.margin - old_x) / this.world.width * (w - this.margin * 2) + (this.margin + x); // Reposition org correctly

      this.orgs[i].pos.y = (this.orgs[i].pos.y - this.margin - old_y) / this.world.height * (h - this.margin * 2) + (this.margin + y); // Must be before new world creation so can find percentage of former world size

      this.orgs[i].cells = [];
      this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]);
      this.orgs[i].count = 1;
    }

    this.world = new World({
      width: w - this.margin * 2,
      height: h - this.margin * 2,
      type: 'rectangle',
      color: 'black',
      x: x + this.margin,
      y: y + this.margin
    });
    if (state === 'tutorial') renderTutorial(); // Only render if state is 'tutorial'; otherwise, will render over pause menu
  };

  this.detect = function () {
    var _this2 = this;

    switch (this.task) {
      case 'move':
        {
          if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code) || keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code) || keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code) || keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) {
            // If a directional key is pressed
            this.task = 'fullscreen';

            if (this.taskTimeout == undefined) {
              this.taskTimeout = setTimeout(function () {
                _this2.taskTimeout = undefined;
                _this2.task = 'survive';
              }, 3500);
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

            var pos;

            do {
              pos = {
                x: random(this.world.width),
                y: random(this.world.height)
              };
            } while (sqrt(sq(pos.x - org.pos.x) + sq(pos.y - org.pos.y)) < _range + 30); // _range + 20 is maximum extend range


            this.orgs.push(new Org({
              player: 'bot' + 1,
              color: _color,
              skin: 'none',
              spectating: false,
              pos: pos,
              title: false
            }));
            this.orgs[1].cells[0] = new Cell(this.orgs[1].pos.x, this.orgs[1].pos.y, this.orgs[1]); // Create first cell in org

            this.orgs[1].count++;
            this.abilities[1] = new Ability({
              player: 'bot' + 1
            });
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
                  _this2.orgs[i].grow();

                  if (org.count == 0) {
                    _this2.orgs[i].cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org

                    _this2.orgs[i].count++;
                  }
                }
              }, _orgfrequency); // 70ms

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
"use strict";

var Board = function Board(datA) {
  var data = datA;
  this.host = socket.id; // Cannot call game.info.host since game is not fully constructed yet; World() can only be called by host, so socket.id is ok

  this.list = [// {
    //    player: undefined, // ID of player
    //    name: undefined, // Screen name of player
    //    kills: undefined, // Kills as defined by number of enemy cells killed
    //    deaths: undefined, // Deaths as defined by number of org deaths
    //    ratio: undefined, // Ratio of kills to deaths
    //    score: undefined, // Flag captures (ctf), time score (kth)
    //    wins: undefined // Round wins (srv, ctf, inf, kth)
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
    color: {
      r: 0,
      g: 0,
      b: 0
    }
  };
  this.nameWidth = 170;
  this.oneWidth = 46;
  this.twoWidth = 46;
  this.threeWidth = 46;
  this.rowHeight = 22;
  this.tableWeight = 1;
  this.headWeight = 1;
  this.cellWeight = 1;
  this.headColor = {
    r: 200,
    g: 200,
    b: 200
  };
  this.cellColor = {
    r: 245,
    g: 245,
    b: 245
  };
  this.stroke = {
    r: 0,
    g: 0,
    b: 0
  };
};

function orderBoard(lisT) {
  lisT.sort(function (a, b) {
    // Sorts in descending order of K:D ratio
    var N;

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
    } // Cell Boxes


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
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var connections;

var Browser =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Browser, _React$Component);

  function Browser(props) {
    var _this;

    _classCallCheck(this, Browser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Browser).call(this, props));
    _this.state = {
      games: props.games
    };
    return _this;
  }

  _createClass(Browser, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      if (next.games) this.setState({
        games: next.games
      });
    }
  }, {
    key: "render",
    value: function render() {
      var gamerows = [];

      for (var i = 0; i < this.state.games.length; i++) {
        if (this.state.games[i].players.length == 0 && this.state.games[i].spectators.length == 0 && this.state.games[i].info.count == 0) {
          // If host has not yet joined the game
          continue;
        }

        gamerows.push(React.createElement(GameRow, {
          key: i,
          game: this.state.games[i],
          row: i,
          forceUp: !mouseDown
        }));
      }

      return React.createElement("div", {
        id: "browsercont"
      }, React.createElement(Shade, null), React.createElement(CanvasCont, null), React.createElement("div", {
        id: "content"
      }, React.createElement("table", {
        id: "browser"
      }, React.createElement("thead", null, React.createElement("tr", {
        id: "head"
      }, React.createElement("th", {
        id: "title",
        colSpan: "1"
      }, "Title"), React.createElement("th", {
        id: "mode",
        colSpan: "1"
      }, "Mode"), React.createElement("th", {
        id: "players",
        colSpan: "1"
      }, "Players"), React.createElement("th", {
        id: "spectators",
        colSpan: "1"
      }, "Spectators"), React.createElement("th", {
        id: "playercap",
        colSpan: "1"
      }, "Player Cap"), React.createElement("th", {
        id: "join-spectate",
        colSpan: "2"
      }, "Bacter"))), React.createElement("tbody", {
        id: "browserBody"
      }, gamerows))), React.createElement("div", {
        className: "backfooter"
      }, React.createElement("footer", {
        onClick: renderTitle
      }, React.createElement("p", {
        id: "back"
      }, "\u2190 Back"), React.createElement("p", {
        id: "displayconnections"
      }, 'Online Clients: ' + (connections ? connections : 0)))));
    }
  }]);

  return Browser;
}(React.Component);

var GameRow =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(GameRow, _React$Component2);

  function GameRow(props) {
    var _this2;

    _classCallCheck(this, GameRow);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(GameRow).call(this, props));
    _this2.row = props.row;
    return _this2;
  }

  _createClass(GameRow, [{
    key: "render",
    value: function render() {
      var game = this.props.game;
      return React.createElement("tr", null, React.createElement("td", {
        className: "title"
      }, game.info.title), React.createElement("td", {
        className: "mode"
      }, modes[game.info.mode]), React.createElement("td", {
        className: "players"
      }, game.players.length), React.createElement("td", {
        className: "spectators"
      }, game.spectators.length), React.createElement("td", {
        className: "playercap"
      }, game.info.cap), React.createElement(TableButton, {
        forceUp: this.props.forceUp,
        row: this.row,
        inner: "Join"
      }), React.createElement(TableButton, {
        forceUp: this.props.forceUp,
        row: this.row,
        inner: "Spectate"
      }));
    }
  }]);

  return GameRow;
}(React.Component);

var TableButton =
/*#__PURE__*/
function (_React$Component3) {
  _inherits(TableButton, _React$Component3);

  function TableButton(props) {
    var _this3;

    _classCallCheck(this, TableButton);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(TableButton).call(this, props));
    _this3.state = {
      down: false,
      backgroundColor: 'rgb(255, 255, 255)'
    };
    _this3.row = props.row;
    _this3.handleMouseDown = _this3.handleMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this3))); // Preserve this reference value in handler functions

    _this3.handleMouseUp = _this3.handleMouseUp.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleMouseOver = _this3.handleMouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleMouseOut = _this3.handleMouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    _this3.handleClick = _this3.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this3)));
    return _this3;
  }

  _createClass(TableButton, [{
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      this.setState({
        down: true,
        backgroundColor: 'rgb(210, 210, 210)'
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(e) {
      this.setState({
        down: false,
        backgroundColor: 'rgb(230, 230, 230)'
      });
    }
  }, {
    key: "handleMouseOver",
    value: function handleMouseOver(e) {
      this.setState({
        backgroundColor: this.state.down ? 'rgb(210, 210, 210)' : 'rgb(230, 230, 230)'
      });
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut(e) {
      this.setState({
        backgroundColor: 'rgb(255, 255, 255)'
      });
    }
  }, {
    key: "handleClick",
    value: function handleClick(e) {
      switch (this.props.inner) {
        case 'Join':
          renderMenu('join', games[this.row]);
          break;

        case 'Spectate':
          renderMenu('spectate', games[this.row]);
          break;
      }
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement("td", {
        className: "TableButton",
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onMouseOver: this.handleMouseOver,
        onMouseOut: this.handleMouseOut,
        onClick: this.handleClick,
        style: {
          backgroundColor: this.state.backgroundColor
        }
      }, this.props.inner);
    }
  }]);

  return TableButton;
}(React.Component);

function renderBrowser() {
  state = 'browser';
  ReactDOM.render(React.createElement(Browser, {
    games: games
  }), eid('cont'));
}
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var cnv;
var center = {
  x: undefined,
  y: undefined
};

var CanvasCont =
/*#__PURE__*/
function (_React$Component) {
  _inherits(CanvasCont, _React$Component);

  function CanvasCont(props) {
    var _this;

    _classCallCheck(this, CanvasCont);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasCont).call(this, props));
    _this.state = {
      width: props.width ? props.width : window.innerWidth,
      // Width defaults to window width but can be set by props.width
      height: props.height ? props.height : window.innerHeight // Height defaults to window height but can be set by props.height

    };
    _this.style = {
      zIndex: '-2' // Canvas is furthest back (-2); Shade is -1; UI is 1

    };
    var body = document.body; // Set body style for canvas to fill screen

    body.style.overflow = 'hidden';
    body.style.margin = 'none';
    body.style.padding = 'none';
    body.style.border = 'none';
    body.style.outline = 'none';
    return _this;
  }

  _createClass(CanvasCont, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // Runs only after initial mount
      cnv = createCanvas(this.state.width, this.state.height); // Create p5 canvas

      cnv.parent('#canvascont'); // Set CanvasCont as p5 canvas parent
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      var nextWidth = next.width ? next.width : window.innerWidth;
      var nextHeight = next.height ? next.height : window.innerHeight;

      if (nextWidth !== this.state.width || nextHeight !== this.state.height) {
        // If new dimensions are inequal, create new canvas element
        cnv = createCanvas(nextWidth, nextHeight); // Create p5 canvas

        cnv.parent('#canvascont'); // Set CanvasCont as p5 canvas parent
      }

      this.setState({
        // Resize when re-rendered
        width: nextWidth,
        // Width defaults to window width but can be set by props.width
        height: nextHeight // Height defaults to window height but can be set by props.height

      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.props.style) {
        style[i] = this.props.style[i];
      }

      style.zIndex = this.style.zIndex;
      return React.createElement("div", {
        id: "canvascont",
        className: "canvas",
        style: style
      }) // Container for p5's (createCanvas(), parent())
      ;
    }
  }]);

  return CanvasCont;
}(React.Component);

;
"use strict";

var Flag = function Flag(X, Y, coloR) {
  var _this = this;

  // Attributes
  this.x = X;
  this.y = Y;
  this.color = coloR;
  this.carried = false; // True: flag is being carried by a player; False: flag is dropped

  this.carrier = undefined;
  this.height = 20;
  this.width = 9; // Helper Functions

  this.detectPickup = function () {
    if (!_this.carried) {
      // If flag is unposessed
      if (org.pos.x - org.col > _this.x - _this.width / 2 && org.pos.x + org.col < _this.x + _this.width / 2 && org.pos.y - org.col > _this.y - _this.height / 2 && org.pos.y + org.col < _this.y + _this.height / 2) {
        // If org collides with flag
        _this.pickup(socket.id); // Org picks up flag

      }
    }
  };

  this.pickup = function (carrier) {
    _this.carried = true; // Org picks up flag

    _this.carrier = carrier;
    socket.emit('Flag', {
      flag: _this,
      host: game.info.host
    });
  };
};
"use strict";

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
    if (item[i] === 0) {
      x -= width;
    } else if (item[i] === 1) {
      y -= width;
    } else if (item[i] === 3) {
      x += width;
    } else if (item[i] === 2) {
      y += width;
    } else {
      console.error("Itemize(): Directional value out of bounds\n\t".concat(item[i], " !== 0, 1, 2, or 3"));
    }

    rect(x, y, width, width);
  }
}
/**
 * Contains list of directions to draw pixels like a pen
 * Encoding:
 *    0: Left
 *    1: Up
 *    2: Down
 *    3: Right
 * @type {Object}
 */


var items = {
  tag: [1, 0, 2, 0, 0, 3, 3, 2, 3, 2, 2, 1, 1, 3, 1, 3, 3, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 2, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 2, 3, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 1, 3, 1, 1, 1, 1, 1, 1, 0, 3, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 1, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 3, 1, 3, 3, 3, 2, 0, 2, 2, 2, 2, 2, 2, 3],
  extend: [2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 1, 1, 1, 1, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 2, 2, 2, 2, 2, 1, 0, 1, 1, 1, 1, 2, 0, 2, 2, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 3, 2, 2, 2, 3, 1, 1, 1, 3, 2, 2, 2, 3, 1, 1, 1, 3, 2, 2, 2, 3, 1, 1, 1, 3, 2, 3, 1, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 2, 3, 2, 2],
  compress: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 2, 2, 2, 2, 2, 2, 1, 3, 1, 1, 1, 1, 2, 3, 2, 2, 3, 2, 1, 1, 1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 3, 2, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 3, 1, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 1, 0, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1, 3, 2, 2, 2, 2, 3, 1, 1, 1, 1],
  // speed: [], 
  // slow: [], 
  immortality: [2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 0, 2, 2, 3, 0, 0, 2, 0, 0, 1, 3, 3, 1, 0, 0, 0, 2, 0, 1, 3, 1, 0, 0, 2, 1, 0, 1, 3, 0, 0, 1, 3, 0, 0, 1, 3, 1, 0, 1, 3, 1, 0, 3, 3, 1, 0, 3, 3, 1, 0, 3, 3, 3, 1, 0, 0, 3, 1, 3, 3, 1, 2, 2, 3, 1, 1, 3, 2, 2, 3, 1, 3, 2, 2, 0, 3, 3, 1, 2, 3, 2, 0, 3, 3, 2, 0, 3, 2, 3, 1, 3, 2, 1, 3, 1, 0, 3, 1, 3, 2, 1, 1, 3, 1, 3, 2, 2, 0, 3, 1, 3, 1, 1, 3, 2, 2, 3, 1, 1, 2, 3, 3, 2, 0, 2, 3, 3, 1, 2, 2, 3, 1, 2, 3, 2, 0, 3, 3, 2, 0, 2, 3, 2, 0, 2, 3, 0, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 2, 2, 0, 1, 1, 2, 0, 2, 2, 0, 1, 1, 0, 2, 2, 1, 0, 1, 1, 0, 2, 2, 1, 0, 1, 1, 0, 2, 1, 1, 0, 2, 1, 1],
  freeze: [3, 3, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 1, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0, 3, 3, 3, 1, 3, 2, 3, 1, 3, 2, 3, 1, 2, 2, 3, 1, 3, 2, 3, 1, 2, 2, 3, 1, 3, 2, 3, 2, 0, 3, 3, 2, 0, 2, 3, 3, 2, 0, 2, 3, 2, 3, 2, 0, 2, 3, 2, 0, 2, 3, 0, 2, 0, 2, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 3, 3, 3, 3, 2, 0, 0, 0, 2, 3, 3, 0, 0, 0, 0, 0, 2, 3, 3, 3, 0, 0, 0, 2, 0, 1, 0, 2, 0, 1, 0, 2, 1, 1, 0, 2, 0, 1, 0, 2, 1, 1, 0, 2, 0, 1, 0, 1, 3, 0, 0, 1, 3, 1, 0, 0, 1, 3, 1, 0, 1, 3, 0, 0, 1, 3, 1, 0, 1, 3, 1, 0, 3, 1, 3, 1, 0, 1, 3],
  // stimulate: [3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 1, 1, 0, 1, 0, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 1, 0, 1, 0, 1, 0, 0, 0, 2, 0, 3, 3, 3, 2, 0, 0, 0, 0, 2, 3, 3, 3, 0, 0, 0, 0, 0, 1, 2, 0, 2, 0, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 0, 2, 0, 2, 0, 1, 0, 0, 2, 0, 2, 0, 2, 2, 0, 1], 
  // poison: [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 3, 3, 3, 2, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0], 
  neutralize: [3, 3, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 3, 1, 1, 0, 1, 0, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 1, 0, 1, 0, 1, 0, 0, 0, 2, 0, 3, 3, 3, 2, 0, 0, 0, 0, 2, 3, 3, 3, 0, 0, 0, 0, 0, 1, 2, 0, 2, 0, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 0, 3, 2, 3, 3, 3, 3, 3, 0, 2, 0, 2, 0, 1, 0, 0, 2, 0, 2, 0, 2, 2, 0, 1],
  toxin: [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 0, 0, 0, 3, 3, 3, 3, 2, 3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 0, 0],
  // Same as stimulate
  spore: [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 3, 1, 3, 3, 3, 3, 2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 2, 0, 0, 2, 3, 0, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2, 3, 2, 0, 3, 2, 3, 2, 0, 2, 3, 3, 2, 0, 3, 3, 2, 0, 3, 3, 3, 2, 0, 0, 3, 3, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 1, 3, 3, 3, 1, 0, 0, 3, 3, 3, 1, 0, 3, 3, 1, 0, 3, 3, 1, 0, 1, 3, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 0, 1, 0, 1, 3, 1, 0, 0, 1, 3, 0, 0, 1, 3, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 0, 2, 0, 2, 2, 3, 3, 1, 3, 1, 3, 3, 3, 3, 2, 2, 2, 0, 0, 0, 0, 3, 3, 3, 3, 2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 3, 2, 3, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 3, 1, 3, 1, 1, 0, 0, 2, 0, 2, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 2, 3, 2, 3, 3, 2, 2, 3, 3, 1, 1, 0],
  secrete: [1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 3, 1, 3, 3, 3, 3, 2, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3, 3, 3, 0, 0, 2, 0, 0, 2, 3, 0, 0, 2, 3, 2, 0, 2, 0, 2, 3, 2, 0, 2, 3, 2, 0, 3, 2, 3, 2, 0, 2, 3, 3, 2, 0, 3, 3, 2, 0, 3, 3, 3, 2, 0, 0, 3, 3, 3, 2, 3, 1, 3, 2, 3, 1, 3, 2, 1, 3, 3, 3, 1, 0, 0, 3, 3, 3, 1, 0, 3, 3, 1, 0, 3, 3, 1, 0, 1, 3, 1, 3, 1, 0, 1, 3, 1, 0, 1, 3, 0, 1, 0, 1, 3, 1, 0, 0, 1, 3, 0, 0, 1, 3, 0, 0, 0, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 3, 3, 3, 2, 2, 2, 2, 0, 2, 0, 2, 2, 3, 3, 1, 3, 1, 3, 3, 3, 3, 2, 2, 2, 0, 0, 0, 0, 3, 3, 3, 3, 2, 2, 2, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 3, 2, 3, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 3, 1, 3, 1, 1, 0, 0, 2, 0, 2, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 0, 0, 0, 0, 1, 1, 1, 3, 3, 3, 3, 2, 3, 2, 3, 3, 2, 2, 3, 3, 1, 1, 0] // Same as spore (Should not differ)

};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Button =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Button, _React$Component);

  function Button(props) {
    var _this;

    _classCallCheck(this, Button);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Button).call(this, props));
    _this.state = {
      down: false,
      // Is mouse down?
      backgroundColor: 'rgb(240, 240, 240)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React

    };
    _this.style = {};
    _this.menuType = props.menuType;
    _this.instance = props.instance; // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this))); // Bind this. reference value to class functions

    _this.handleMouseOver = _this.handleMouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseOut = _this.handleMouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Button, [{
    key: "handleClick",
    value: function handleClick() {
      switch (this.instance) {
        case 'leave game':
        case 'leave tutorial':
          org.clearIntervals(); // ability = new Ability({ player: socket.id }); // Ability reset occurs already in renderTitle()

          if (getSrc().src === 'game') {
            // No game object in pause tutorial menu
            socket.emit('Leave Game', game);

            for (var i = 0; i < game.board.list.length; i++) {
              if (game.board.list[i].player == socket.id) {
                // Find player in leaderboard
                game.board.list.splice(i, 1); // Remove player from leaderboard

                orderBoard(game.board.list); // Sort the list

                socket.emit('Board', {
                  list: game.board.list,
                  host: game.board.host
                }); // Send updated board to server

                break;
              }
            }
          }

          if (getSrc().src === 'tutorial') {
            tutorial.clear(); // Clear tutorial intervals
          }

          org = undefined; // Clear org variable

          renderTitle();
          title = new Title();
          break;
      }
    }
  }, {
    key: "handleMouseOver",
    value: function handleMouseOver() {
      var page = document.body.parentNode;

      if (!mouseDown || !this.state.down) {
        // If the mouse was lifted not over the button, state should not be down, but won't be detected as such by the button, hence mouseDown defined elsewhere
        this.setState({
          down: false,
          backgroundColor: 'rgb(220, 220, 220)'
        });
      } else {
        if (this.state.down) {
          this.setState({
            backgroundColor: 'rgb(200, 200, 200)'
          });
          mouseDown = true;
        }
      }
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut() {
      this.setState({
        backgroundColor: 'rgb(240, 240, 240)'
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp() {
      this.style.backgroundColor = 'rgb(220, 220, 220)';
      this.setState({
        down: false
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown() {
      this.setState({
        backgroundColor: 'rgb(200, 200, 200)'
      });
      this.setState({
        down: true
      });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var page = document.body.parentNode;
      if (!mouseDown) this.setState({
        down: false
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.style) {
        style[i] = this.style[i];
      }

      style.backgroundColor = this.state.backgroundColor;
      return React.createElement("button", {
        id: this.instance + ' input',
        className: "menubutton",
        type: "button",
        style: style,
        onMouseOver: this.handleMouseOver,
        onMouseOut: this.handleMouseOut,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp,
        onClick: this.handleClick
      });
    }
  }]);

  return Button;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var List =
/*#__PURE__*/
function (_React$Component) {
  _inherits(List, _React$Component);

  function List(props) {
    var _this;

    _classCallCheck(this, List);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(List).call(this, props));
    _this.state = {
      value: props.value,
      // Currently selected list item
      options: [],
      focused: false,
      // focused by cursor
      backgroundColor: 'rgb(255, 255, 255)'
    };
    _this.style = {};
    _this.menuType = props.menuType;
    _this.instance = props.instance; // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Gets index of input within menu - Not currently in use

    _this.applyInstance = _this.applyInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(List, [{
    key: "applyInstance",
    value: function applyInstance() {
      var info = []; // Info array holds config data for option elements to be created later

      var unset = true; // If value is unset initially, will set value to first in list

      switch (this.instance) {
        case 'world type':
          info = [{
            value: 'rectangle',
            inner: 'Square'
          }, {
            value: 'ellipse',
            inner: 'Circle'
          }];
          break;

        case 'game mode':
          for (var i in modes) {
            var mode = modes[i];
            var disabled = false;
            if (i === 'ctf' || i === 'inf' || i === 'kth') disabled = true; // CTF, INF, and KTH modes are currently not available

            info.push({
              value: i,
              inner: modes[i],
              disabled: disabled
            });
          }

          break;

        case 'color':
          for (var _i in orgColors[game.world.color]) {
            // Renders all colors as a ffa game; If it is a team mode, rendering should be blocked in Menu.render()
            var color = _i; // Key: Color name: String

            var rgb = orgColors[game.world.color][_i]; // Value: RGB: Object

            info.push({
              value: color,
              inner: color[0].toUpperCase() + color.slice(1),
              style: {
                backgroundColor: 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')'
              }
            });
          }

          if (this.menuType === 'respawn' || this.menuType === 'pauseGame') {
            for (var _i2 = 0; _i2 < info.length; _i2++) {
              var _color = void 0;

              for (var j in orgColors[game.world.color]) {
                if (orgColors[game.world.color][j] === org.color) {
                  _color = j;
                  break;
                }
              }

              if (_color === info[_i2].value) {
                this.setState({
                  value: info[_i2].value
                });
                unset = false;
                break;
              }
            }
          }

          break;

        case 'team':
          if (getSrc().src === 'title') {
            // If in title, set game value to game in games array
            for (var _i3 = 0; _i3 < games.length; _i3++) {
              // Update game on-load (Normally occurs in socket.js @ socket.on('Game')); Used for team option updates
              if (games[_i3].info.host === game.info.host) {
                // Identify game
                game = games[_i3]; // Set game to updated game from server array

                break;
              }
            }
          }

          for (var _i4 = 0; _i4 < game.teams.length; _i4++) {
            // If is not a team mode, rendering should be blocked in Menu.render()
            info.push({
              value: teamColors[_i4],
              inner: teamColors[_i4][0].toUpperCase() + teamColors[_i4].slice(1) + ': ' + game.teams[_i4].length
            });
          }

          if (this.menuType === 'join') {
            // Team auto-selection in join menu
            var lengths = game.teams.map(function (team) {
              return team.length;
            }); // Array which records the number of players on each team

            var min = _defineProperty({}, 0, lengths[0]); // min is an object whose only key is the index of the smallest team and whose value is the size of that team (start with first team by default)


            for (var _i5 = 0; _i5 < info.length; _i5++) {
              // Must keep track of index of minimum team within teams array, so index is key within min
              if (min[_i5] > lengths[_i5 + 1]) {
                delete min[_i5]; // Remove previous team key-value pair (it is not minimum size)

                min[_i5 + 1] = lengths[_i5 + 1];
              }
            }

            for (var _i6 in min) {
              // For-in loop only used so key in min object can be accessed
              this.setState({
                value: info[parseInt(_i6)].value
              }); // i is of type string, so parseInt must be used to make type number

              unset = false;
            }
          } else if (this.menuType === 'respawn' || this.menuType === 'pauseGame') {
            // Team auto-selection in respawn menu
            for (var _i7 = 0; _i7 < info.length; _i7++) {
              if (org.team === teamColors[_i7]) {
                this.setState({
                  value: info[_i7].value
                });
                unset = false;
                break;
              }
            }
          }

          break;
      }

      if (unset) this.setState({
        value: info[0].value
      }); // If no value has been set, set first option to select element's value

      var ops = info.map(function (inf) {
        return React.createElement("option", {
          key: inf.value,
          value: inf.value,
          disabled: inf.disabled,
          style: inf.style
        }, inf.inner);
      }); // Create option elements from info

      this.setState({
        options: ops
      });
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      this.props.update(this.instance, e.target.value); // Update local value and menu based on current instance and value
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      if (e.type === 'focus') {
        // e.type: the type of event (focus or blur); typeof e.type is DOMString:
        this.setState({
          focused: true,
          backgroundColor: 'rgb(230, 230, 230)'
        });
      } else if (e.type === 'blur') {
        this.setState({
          focused: false,
          backgroundColor: 'rgb(255, 255, 255)'
        });
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
        this.props.submit(this.menuType);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      // Does not run when component is merely changed, only on initial mount
      this.applyInstance();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.update(this.instance, this.state.value); // Update internal values of this and other inputs
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        value: next.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.style) {
        style[i] = this.style[i];
      }

      style.backgroundColor = this.state.backgroundColor;
      return React.createElement("select", {
        id: this.instance + ' input',
        className: "menuinput",
        value: this.state.value,
        style: style,
        onChange: this.handleChange,
        onFocus: this.handleFocus,
        onBlur: this.handleFocus,
        onKeyDown: this.handleKeyDown
      }, this.state.options);
    }
  }]);

  return List;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Menu =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Menu, _React$Component);

  function Menu(props) {
    var _this;

    _classCallCheck(this, Menu);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Menu).call(this, props));
    _this.state = {
      instances: [],
      // Array of instances which should be displayed
      values: Array(menus[props.type].options.length).fill(''),
      // Array of input values; includes all possible inputs, not just those rendered
      issues: Array(menus[props.type].options.length + 1).fill([]) // +1 because issues includes issues which do not apply to any one instance

    }; // Component state - not game state

    _this.type = props.type;
    _this.data = props.data;
    _this.instantiate = _this.instantiate.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.update = _this.update.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.issue = _this.issue.bind(_assertThisInitialized(_assertThisInitialized(_this)));

    if (_this.type === 'join' || _this.type === 'spectate' || _this.type === 'respawn') {
      game = props.data;
    } // join, spectate, and respawn are the only menu types which use the data property


    _this.instantiate(); // Set initial instances


    return _this;
  }

  _createClass(Menu, [{
    key: "instantiate",
    value: function instantiate() {
      // Set initial instances of menus; called only inside constructor (do not use setState(), change state literally)
      var insts = menus[this.type].options.map(function (op) {
        return op.toLowerCase();
      }); // Set instances to all possible options to start

      switch (this.type) {
        case 'create':
          insts.splice(insts.indexOf('player minimum'), 1); // Remove player min (ffa is selected by default)

          insts.splice(insts.indexOf('team count'), 1); // Remove team count (ffa is selected by default)

          break;

        case 'join':
          if (!this.data.info.protected || this.data.info.host === socket.id) // If the game is not password-protected; If player is host (If player just created the game and is now joining his own game)
            insts.splice(insts.indexOf('password'), 1); // Remove the password input (there is no password necessary) (may be confusing if not removed)

          switch (this.data.info.mode) {
            // Data is game object; instances of join menu are determined by game mode
            case 'ffa':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'skm':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)

              break;

            case 'srv':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'ctf':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)

              break;

            case 'inf':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by assigned infected status)

              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'kth':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;
          }

          break;

        case 'spectate':
          if (!this.data.info.protected || this.data.info.host === socket.id) // If the game is not password-protected; If player is host (If player just created the game and is now joining his own game)
            insts.splice(insts.indexOf('password'), 1); // Remove the password input (there is no password necessary) (may be confusing if not removed)

          break;

        case 'respawn':
          switch (this.data.info.mode) {
            // Data is game object; instances of join menu are determined by game mode
            case 'ffa':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'skm':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)

              break;

            case 'srv':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'ctf':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by team selection)

              break;

            case 'inf':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set by assigned infected status)

              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;

            case 'kth':
              insts.splice(insts.indexOf('team'), 1); // Remove team selection (not team mode)

              insts.splice(insts.indexOf('auto assign'), 1); // Remove auto assign to team (not team mode)

              break;
          }

          break;

        case 'pauseGame':
          switch (this.data.info.mode) {
            // Data is game object; instances of join menu are determined by game mode
            case 'skm': // If players are sorted into teams/groups

            case 'ctf':
            case 'inf':
              insts.splice(insts.indexOf('color'), 1); // Remove color selection (color set automatically)

              break;
          }

          break;
        // case 'pauseSpectate': break; // All possible optons are always used in pause spectate menu
        // case 'pauseTutorial': break; // All possible optons are always used in pause tutorial menu
      }

      this.state.instances = insts; // Only set state value literally in constructor, else use setState()
    }
  }, {
    key: "update",
    value: function update(instance, valuE) {
      // The purpose of update is to update the state of the menu depending on input values
      var value = valuE;
      var insts = menus[this.type].options.map(function (op) {
        return op.toLowerCase();
      }); // Set local instances to lowercase options

      var vals = this.state.values;
      var index = menus[this.type].options.indexOf(capitalize(instance));
      var elt = eid(instance + ' input'); // DOM node of instance input

      var wInput = eid('world width input'); // Width input DOM node

      var hInput = eid('world height input'); // Height input DOM node

      var pmInput = eid('player minimum input'); // Player minimum input DOM node

      var tcInput = eid('team count input'); // Team count input DOM node

      var teamInput = eid('team input'); // Team selections input DOM node

      var wI = menus[this.type].options.indexOf('World Width'); // Width input index (options and state values)

      var hI = menus[this.type].options.indexOf('World Height'); // Height input index (options and state values)

      var pmI = menus[this.type].options.indexOf('Player Minimum'); // Player minimum input index (options and state values)

      var tcI = menus[this.type].options.indexOf('Team Count'); // Team count input index (options and state values)

      if (menus[this.type].values[index] === 'number') {
        // Special editorial actions for number inputs only
        value = parseFloat(value) ? parseFloat(value) : 0;

        if (value % 1 !== 0) {
          // If value is not an integer, set it to the greatest integer
          value = floor(value);
        }
      }

      vals[index] = value; // Update input value

      switch (instance) {
        case 'world width':
          vals[hI] = value; // Set world height value to given world width value (hI is hInput index in options array)

          break;

        case 'world height':
          vals[wI] = value; // Set world width value to given world height value (wI is wInput index in options array)

          break;

        case 'player minimum':
          if (tcInput && parseFloat(vals[tcI]) > value) // If team count is greater than player minimum
            vals[tcI] = value; // Reduce team count to player minimum value (tcI is tcInput index in options array)

          break;

        case 'team count':
          if (pmInput && parseFloat(vals[pmI]) > value) // If player minimum is greater than team count
            vals[pmI] = value; // Reduce player minimum to team count (pmI is pmInput index in options array)

          break;

        case 'game mode':
          // Updates based upon game mode input changes
          // Set displayed instances and special attributes
          if (wInput) wInput.min = 300; // Set default width minimum value

          if (hInput) hInput.min = 300; // Set default height minimum value

          switch (value) {
            case 'ffa':
              insts.splice(insts.indexOf('player minimum'), 1); // Remove player min

              insts.splice(insts.indexOf('team count'), 1); // Remove team count

              break;

            case 'skm':
              insts.splice(insts.indexOf('player minimum'), 1); // Remove player min

              insts.splice(insts.indexOf('leaderboard length'), 1); // Remove leaderboard length

              break;

            case 'srv':
              insts.splice(insts.indexOf('team count'), 1); // Remove team count

              break;

            case 'ctf':
              insts.splice(insts.indexOf('leaderboard length'), 1); // Remove leaderboard length

              if (wInput) wInput.min = 700; // Dimensional minimums increase in ctf mode

              if (hInput) hInput.min = 700;
              break;

            case 'inf':
              insts.splice(insts.indexOf('team count'), 1); // Remove team count

              break;

            case 'kth':
              insts.splice(insts.indexOf('team count'), 1); // Remove team count

              break;
          }

          this.setState({
            instances: insts
          });
          break;

        case 'auto assign':
          if (value) teamInput.disabled = true; // If auto assign is selected, disable team selection input
          else teamInput.disabled = false;
          break;
      }

      for (var i = 0; i < vals.length; i++) {
        if (vals[i] === 0) // If number (only number because of type comparison in ===) input value is 0 or empty (if empty would have already converted to 0)
          vals[i] = ''; // Replace with an empty string so placeholder is rendered instead of 0
      }

      this.setState({
        values: vals
      }); // Update values in state
    }
  }, {
    key: "issue",
    value: function issue(issues) {
      // issues: Array[ { instance: 'message' } ]
      var count = issues.length;
      var stateIssues = []; // Issues array to be stored in state: Array1[ Array2[ 'message0', ..., 'messageN' ] ] (index of Array1 refers to instance as in options array) (different format than incoming issues)

      for (var i = 0; i < menus[this.type].options.length; i++) {
        var instance = menus[this.type].options[i].toLowerCase(); // Save instance value from options into instance variable

        stateIssues.push([]); // There exists an issues array for each possible option

        for (var j = 0; j < count; j++) {
          if (getKeys(issues[j])[0] === instance) {
            // If instance of issue is instance from options array
            stateIssues[i].push(issues[j][instance]); // Add issue to messages array within instance index of state issues array

            issues.splice(j, 1); // Remove issue from inputted issues array so it is not unnecessarily looped through

            count--; // count must be reduced since length of issues is reduced

            j--; // j must be reduced since the entire array is shifted back after splicing, so j need not be incremented (always do this after splicing iterated array)
          }
        }
      }

      stateIssues.push([]); // Add an option non-specific array to the end of state issues to be rendered at the end of the menu; Buffer of empty array is necessary

      if (issues.length) {
        // If there are any remaining issues (issues with instance '' which do not apply to any single input)
        for (var _i = 0; _i < count; _i++) {
          // count is the number of remaining issues
          var key = getKeys(issues[_i])[0];
          stateIssues[stateIssues.length - 1].push(issues[_i][key]); // Add reamining issues to last index of state issues array because they are displayed after all other issues at the bottom of the menu
        }
      }

      this.setState({
        issues: stateIssues
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var rows = [];

      var _loop = function _loop(i) {
        var instance = menus[_this2.type].options[i].toLowerCase(); // instance: name of input for identification purposes


        if (_this2.state.instances.indexOf(instance) === -1) {
          // If local instance is not found within stated instances of the menu
          return "continue"; // it should not be rendered in the menu
        } // Allows menus[type].xxxx[i] to be used in this loop without having to check if it should exist within the menu


        var input = void 0;

        if (menus[_this2.type].values[i] === 'text') {
          input = React.createElement(Text, {
            key: instance,
            menuType: _this2.type,
            instance: instance,
            value: _this2.state.values[i],
            update: _this2.update,
            submit: submit.bind(_this2)
          }); // menuType: which menu is to be rendered
        } else if (menus[_this2.type].values[i] === 'number') {
          input = React.createElement(Num, {
            key: instance,
            menuType: _this2.type,
            instance: instance,
            value: _this2.state.values[i],
            update: _this2.update,
            submit: submit.bind(_this2)
          });
        } else if (menus[_this2.type].values[i] === 'list') {
          input = React.createElement(List, {
            key: instance,
            menuType: _this2.type,
            instance: instance,
            value: _this2.state.values[i],
            update: _this2.update,
            submit: submit.bind(_this2)
          }); // instance: name of list to tell what to render
        } else if (menus[_this2.type].values[i].indexOf('radio') !== -1) {
          // If 'radio' is anywhere within string
          input = React.createElement(Radios, {
            key: instance,
            menuType: _this2.type,
            instance: instance,
            value: _this2.state.values[i],
            update: _this2.update,
            submit: submit.bind(_this2),
            count: parseInt(menus[_this2.type].values[i])
          });
        } else if (menus[_this2.type].values[i] === 'button') {
          input = React.createElement(Button, {
            key: instance,
            menuType: _this2.type,
            instance: instance
          }); // Button does not need update since it has no internal value
        } else {
          input = menus[_this2.type].values[i];
        }

        var issues = _this2.state.issues[i].map(function (issues, ix) {
          return React.createElement("p", {
            key: ix,
            style: {
              color: 'red',
              display: _this2.state.issues[i].length ? 'block' : 'none',
              margin: '5px 0px 3px 0px'
            }
          }, issues);
        });

        var row = React.createElement("tr", {
          className: "menurow",
          key: instance
        }, React.createElement("td", {
          className: "menucell",
          key: 0,
          style: {
            textAlign: 'right'
          }
        }, menus[_this2.type].options[i]), React.createElement("td", {
          className: "menucell",
          key: 1,
          style: {
            textAlign: 'left'
          }
        }, input, issues));
        rows.push(row);
      };

      for (var i = 0; i < menus[this.type].options.length; i++) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }

      if (this.state.issues[this.state.issues.length - 1].length) {
        // If there are non-specific issues, display them in an additional row at the bottom of the menu
        var row = React.createElement("tr", {
          className: "menurow",
          key: 'nonspecissues'
        }, React.createElement("td", {
          className: "menucell",
          key: 0
        }), React.createElement("td", {
          className: "menucell",
          key: 1,
          style: {
            textAlign: 'left'
          }
        }, this.state.issues[this.state.issues.length - 1].map(function (issues, ix) {
          return React.createElement("p", {
            key: ix,
            style: {
              color: 'red',
              display: 'block',
              margin: '5px 0px 3px 0px'
            }
          }, issues);
        })));
        rows.push(row);
      }

      return (// CanvasCont: zIndex = '-2'; Shade: z-index = '-1'; Menu: zIndex = '1'; (Unpredictable behavior if shade is 0)
        React.createElement("div", {
          id: "menu"
        }, React.createElement(Shade, null), React.createElement(CanvasCont, null), React.createElement("div", {
          id: this.type + 'Header',
          className: "header",
          style: {
            zIndex: '1',
            opacity: '.95'
          }
        }, React.createElement("h2", {
          className: "headertext"
        }, menus[this.type].header)), React.createElement("div", {
          className: "content",
          style: {
            zIndex: '1'
          }
        }, React.createElement("table", {
          id: this.type + 'Table',
          className: "menutable"
        }, React.createElement("tbody", {
          id: "Menu Body"
        }, rows)), React.createElement(MenuSubmit, {
          menuType: this.type,
          values: this.state.values,
          submit: submit.bind(this)
        })), React.createElement(MenuFooter, {
          menuType: this.type,
          submit: submit.bind(this)
        }))
      );
    }
  }]);

  return Menu;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var MenuFooter =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MenuFooter, _React$Component);

  function MenuFooter(props) {
    var _this;

    _classCallCheck(this, MenuFooter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuFooter).call(this, props));
    _this.state = {};
    _this.style = {
      zIndex: '1',
      position: 'absolute',
      opacity: '.95'
    };
    _this.menuType = props.menuType;
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(MenuFooter, [{
    key: "handleClick",
    value: function handleClick() {
      // Click is handled on footer rather than back text so click applies to entire footer
      switch (this.menuType) {
        case 'create':
          renderTitle();
          break;

        case 'join':
          if (game.info.host == socket.id) {
            // If player is host (If player is joining directly after creating the game)
            socket.emit('Game Ended', game);
            renderTitle();
          } else {
            renderBrowser();
          }

          break;

        case 'spectate':
          renderBrowser();
          break;

        case 'pauseSpectate': // Do not use submit() so changes are not saved when using back button

        case 'respawn':
          state = 'spectate';
          ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
          break;

        case 'pauseGame':
          {
            var skip = false;

            for (var i = 0; i < game.players.length; i++) {
              if (game.players[i] === socket.id) {
                // If still is a player
                state = 'game';
                skip = true;
                break;
              }
            }

            if (!skip) {
              for (var _i = 0; _i < game.spectators.length; _i++) {
                if (game.spectators[_i] === socket.id) {
                  state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu

                  break;
                }
              }
            }

            ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
            break;
          }

        case 'pauseTutorial':
          state = 'tutorial';
          ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
          break;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.style) {
        style[i] = this.style[i];
      }

      return React.createElement("div", {
        id: "footerDiv",
        style: style,
        onClick: this.handleClick
      }, React.createElement("footer", {
        id: "footer",
        className: "menufooter"
      }, React.createElement("p", {
        className: "menufootertext"
      }, "\u2190 Back")));
    }
  }]);

  return MenuFooter;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var MenuSubmit =
/*#__PURE__*/
function (_React$Component) {
  _inherits(MenuSubmit, _React$Component);

  // Button for submitting menu information
  function MenuSubmit(props) {
    var _this;

    _classCallCheck(this, MenuSubmit);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MenuSubmit).call(this, props));
    _this.state = {
      down: false,
      // Is mouse down?
      backgroundColor: 'rgb(240, 240, 240)',
      // Initialize backgroundColor style in state so it can be edited and re-rendered with React
      left: (window.innerWidth - 95) / 2 + 'px' // Submit width is 95px

    };
    _this.menuType = props.menuType;
    _this.handleClick = _this.handleClick.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseOver = _this.handleMouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseOut = _this.handleMouseOut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseDown = _this.handleMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleMouseUp = _this.handleMouseUp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(MenuSubmit, [{
    key: "handleClick",
    value: function handleClick(e) {
      // Submit functions based upon menu type
      this.props.submit(this.menuType);
    }
  }, {
    key: "handleMouseOver",
    value: function handleMouseOver(e) {
      var page = document.body.parentNode;

      if (!mouseDown || !this.state.down) {
        // If the mouse was lifted not over the button, state should not be down, but won't be detected as such by the button, hence mouseDown defined elsewhere
        this.setState({
          down: false,
          backgroundColor: 'rgb(220, 220, 220)'
        });
      } else {
        if (this.state.down) {
          this.setState({
            backgroundColor: 'rgb(200, 200, 200)'
          });
          mouseDown = true;
        }
      }
    }
  }, {
    key: "handleMouseOut",
    value: function handleMouseOut(e) {
      this.setState({
        backgroundColor: 'rgb(240, 240, 240)'
      });
    }
  }, {
    key: "handleMouseDown",
    value: function handleMouseDown(e) {
      this.setState({
        down: true,
        backgroundColor: 'rgb(200, 200, 200)'
      });
    }
  }, {
    key: "handleMouseUp",
    value: function handleMouseUp(e) {
      this.setState({
        down: false,
        backgroundColor: 'rgb(240, 240, 240)'
      });
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var page = document.body.parentNode;
      if (!mouseDown) this.setState({
        down: false
      });
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        left: (window.innerWidth - 95) / 2 + 'px'
      }); // Center submit button on the screen
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};
      style.backgroundColor = this.state.backgroundColor;
      style.left = this.state.left;
      return React.createElement("button", {
        id: this.menuType + 'Button',
        className: "menusubmit",
        type: "button",
        style: style,
        onClick: this.handleClick,
        onMouseOver: this.handleMouseOver,
        onMouseOut: this.handleMouseOut,
        onMouseDown: this.handleMouseDown,
        onMouseUp: this.handleMouseUp
      }, React.createElement("p", {
        style: {
          margin: 0
        }
      }, menus[this.menuType].button));
    }
  }]);

  return MenuSubmit;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Num =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Num, _React$Component);

  function Num(props) {
    var _this;

    _classCallCheck(this, Num);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Num).call(this, props));
    _this.state = {
      value: props.value,
      // Actuall value of the input field
      focused: false,
      // If the user is focused on the field
      backgroundColor: 'rgb(255, 255, 255)',
      display: 'table-row' // Indicates whether 'display: none' property will be set on the container table row

    };
    _this.style = {};
    _this.menuType = props.menuType; // Type of menu rendered inside

    _this.instance = props.instance; // Name of input
    // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

    _this.placeholder = null;
    _this.applyInstance = _this.applyInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Num, [{
    key: "applyInstance",
    value: function applyInstance() {
      switch (this.instance) {
        case 'world width':
          this.placeholder = Defaults.worldwidth;
          this.min = 300;
          this.max = 100000;
          break;

        case 'world height':
          this.placeholder = Defaults.worldheight;
          this.min = 300;
          this.max = 100000;
          break;

        case 'player minimum':
          this.placeholder = Defaults.playermin;
          this.min = 2;
          break;

        case 'player cap':
          this.placeholder = Defaults.playercap;
          this.min = 2;
          break;

        case 'leaderboard length':
          this.placeholder = Defaults.boardlength;
          this.min = 1;
          this.max = 20;
          break;

        case 'team count':
          this.placeholder = Defaults.teamcount;
          this.min = 2;
          this.max = teamColors.length;
          break;
      }
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      if (e.type === 'focus') {
        // If focus in
        this.setState({
          focused: true,
          backgroundColor: 'rgb(230, 230, 230)'
        }); // Darken
      } else if (e.type === 'blur') {
        // If focus out
        this.setState({
          focused: false,
          backgroundColor: 'rgb(255, 255, 255)'
        }); // Lighten
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      var val = e.target.value; // Create local, editable value

      if (e.target.value % 1 !== 0) // If value is not an integer
        val = floor(val); // Set value to greatest integer

      this.props.update(this.instance, val); // Update local value and rest of menu if applicable
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
        this.props.submit(this.menuType);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      // Runs on initial mount, not every update
      this.applyInstance();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.update(this.instance, this.state.value);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        value: next.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.style) {
        style[i] = this.style[i];
      }

      style.backgroundColor = this.state.backgroundColor;
      return React.createElement("input", {
        id: this.instance + ' input',
        className: "menuinput",
        type: "number",
        value: this.state.value,
        placeholder: this.placeholder,
        min: this.min,
        max: this.max,
        autoComplete: "off",
        style: style,
        onFocus: this.handleFocus,
        onBlur: this.handleFocus,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      });
    }
  }]);

  return Num;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Radio =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Radio, _React$Component);

  function Radio(props) {
    var _this;

    _classCallCheck(this, Radio);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Radio).call(this, props));
    _this.state = {
      value: props.value
    };
    _this.style = {};
    _this.instance = props.instance;
    _this.order = props.order; // Index of radio within radio group (for identification purposes)

    return _this;
  }

  _createClass(Radio, [{
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        value: next.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};
      if (this.state.value) style.backgroundColor = 'rgb(190, 190, 190)';else style.backgroundColor = 'rgb(255, 255, 255)';
      return React.createElement("div", {
        id: this.instance + ' input ' + this.order,
        className: "menuradio",
        type: "radio",
        style: style,
        onClick: this.props.onClick
      });
    }
  }]);

  return Radio;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Radios =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Radios, _React$Component);

  function Radios(props) {
    var _this;

    _classCallCheck(this, Radios);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Radios).call(this, props));
    _this.state = {
      value: props.value,
      // Value is represented as index of radio which is selected (only one is selected at once) (null if none are selected)
      selections: Array(props.count).fill(false) // Boolean array to show selection state of radios

    };
    _this.count = props.count;
    _this.menuType = props.menuType;
    _this.instance = props.instance; // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

    _this.applyInstance = _this.applyInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Radios, [{
    key: "applyInstance",
    value: function applyInstance() {
      // this.props.update should not be run within applyInstance since component is not yet mounted
      switch (this.instance) {
        case 'skin':
          this.set = skins; // Set is an array of text to be displayed next to the radio inputs

          if (this.menuType === 'respawn' || this.menuType === 'pauseGame') {
            // Placed outside and after above for loop so the above will occur by defualt and this will overwrite if applicable
            for (var i = 0; i < skins.length; i++) {
              if (org && org.skin === skins[i]) {
                var sels = this.state.selections; // Create copy of state selections array

                sels.fill(false); // Set entire array to false

                sels[i] = true; // Set current skin to value true

                this.setState({
                  value: org.skin,
                  selections: sels
                });
                break;
              }
            }
          }

          break;

        case '1st ability':
          this.set = firsts; // Defined in config.js

          if (this.menuType === 'respawn') {
            var index;
            var _sels = this.state.selections; // Create copy of state selections array

            _sels.fill(false);

            if (ability.extend.activated) index = 0; // Set index value of selected radio in radios
            else if (ability.compress.activated) index = 1; // Set index value of selected radio in radios

            _sels[index] = true;
            this.setState({
              value: this.set[index],
              selections: _sels
            });
          }

          break;

        case '2nd ability':
          this.set = seconds; // Defined in config.js

          if (this.menuType === 'respawn') {
            var _index;

            var _sels2 = this.state.selections; // Create copy of state selections array

            _sels2.fill(false);

            if (ability.immortality.activated) _index = 0; // Set index value of selected radio in radios
            else if (ability.freeze.activated) _index = 1; // Set index value of selected radio in radios

            _sels2[_index] = true;
            this.setState({
              value: this.set[_index],
              selections: _sels2
            });
          }

          break;

        case '3rd ability':
          this.set = thirds; // Defined in config.js

          if (this.menuType === 'respawn') {
            var _index2;

            var _sels3 = this.state.selections; // Create copy of state selections array

            _sels3.fill(false);

            if (ability.neutralize.activated) _index2 = 0; // Set index value of selected radio in radios
            else if (ability.toxin.activated) _index2 = 1; // Set index value of selected radio in radios

            _sels3[_index2] = true;
            this.setState({
              value: this.set[_index2],
              selections: _sels3
            });
          }

          break;

        case 'auto assign':
          this.set = ['']; // Do not display any text adjacent to name label radio

          if (this.menuType === 'respawn') {
            if (ability.auto) this.setState({
              value: 'auto assign',
              selections: [true]
            });else this.setState({
              value: '',
              selections: [false]
            });
          }

          break;

        case 'name labels':
          this.set = ['']; // Do not display any text adjacent to name label radio

          if (Labels) // If name labels setting is on
            this.setState({
              value: this.instance,
              selections: [true]
            }); // Set value of Radios to instance value ('name labels') and select the radio
          else this.setState({
              value: '',
              selections: [false]
            }); // Set value of Radios to '' (no value) and deselect the radio

          break;

        case 'messages':
          this.set = ['']; // Do not display any text adjacent to name label radio

          if (Messages) // If messages setting is on
            this.setState({
              value: this.instance,
              selections: [true]
            }); // Set value of Radios to instance value ('messages') and select the radio
          else this.setState({
              value: '',
              selections: [false]
            }); // Set value of Radios to '' (no value) and deselect the radio

          break;
      }
    }
  }, {
    key: "handleClick",
    value: function handleClick(index) {
      var selections = this.state.selections.slice(); // Copy state selections array into selections

      var newValue = !selections[index]; // Flip selected radio value

      selections.fill(false); // Set all selections to false

      selections[index] = newValue; // Apply new value to selections array

      var val;
      if (this.set.length === 1 && this.set[0] === '') // If there is no text labeling radio, and there is only one radio in a set, set value to instance
        val = selections[index] ? this.instance : ''; // If radio is selected, set value to instance; If deselected, value is empty string
      else val = selections[index] ? this.set[index] : ''; // If radio is selected, set value to radio label; If deselected, value is empty string

      this.props.update(this.instance, val); // Update state value

      this.setState({
        selections: selections
      }); // Update selections
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.applyInstance();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      // Does not run when component is merely changed
      this.props.update(this.instance, this.state.value);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        value: next.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var radios = [];

      var _loop = function _loop(i) {
        radios.push(React.createElement(Radio, {
          key: i,
          instance: _this2.instance,
          order: i,
          value: _this2.state.selections[i],
          onClick: function onClick() {
            return _this2.handleClick(i);
          }
        })); // Uses arrow function syntax so 'i' can be passed rather than event parameter
      };

      for (var i = 0; i < this.count; i++) {
        _loop(i);
      }

      var elts = radios.map(function (radio, index) {
        return (// Add spacers under radio buttons; Last spacer is twice as high
          React.createElement("div", {
            key: index,
            onKeyDown: _this2.handleKeyDown
          }, radio, React.createElement("p", {
            className: "menuradiotext"
          }, _this2.set[index] ? _this2.set[index][0].toUpperCase() + _this2.set[index].slice(1) : null), React.createElement("div", {
            style: {
              display: 'block',
              height: index === radios.length - 1 ? '6px' : '3px'
            }
          }))
        );
      }); // If this.set[index] is empty, do not render text (inner HTML of <p> is null)

      return React.createElement("div", {
        id: this.instance + ' input',
        value: this.state.value
      }, elts);
    }
  }]);

  return Radios;
}(React.Component);
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var Text =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Text, _React$Component);

  // Each input-type component renders a table row containing the input type
  function Text(props) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, props));
    _this.state = {
      value: props.value,
      focused: false,
      // If the user is focused on the field
      backgroundColor: 'rgb(255, 255, 255)' // Initialize backgroundColor style in state so it can be edited and re-rendered with React

    };
    _this.style = {};
    _this.menuType = props.menuType;
    _this.instance = props.instance; // this.index = menus[this.menuType].options.indexOf(capitalize(this.instance)); // Not currently in use

    _this.applyInstance = _this.applyInstance.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleFocus = _this.handleFocus.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.handleKeyDown = _this.handleKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(Text, [{
    key: "applyInstance",
    value: function applyInstance() {
      switch (this.instance) {
        case 'password':
          if (this.menuType === 'join' || this.menuType === 'spectate') // Caution: password instance exists in create and join/spectate menus
            socket.emit('Ask Permission', {
              pass: this.state.value,
              info: game.info
            }); // Add player to permissed list on server (if there is no password for game)

          break;
      }
    }
  }, {
    key: "handleFocus",
    value: function handleFocus(e) {
      if (e.type === 'focus') {
        this.setState({
          focused: true,
          backgroundColor: 'rgb(230, 230, 230)'
        });
      } else if (e.type === 'blur') {
        this.setState({
          focused: false,
          backgroundColor: 'rgb(255, 255, 255)'
        });
      }
    }
  }, {
    key: "handleChange",
    value: function handleChange(e) {
      // e.target is dom element of target
      this.props.update(this.instance, e.target.value);

      if (this.instance === 'password' && (this.menuType === 'join' || this.menuType === 'spectate')) {
        socket.emit('Ask Permission', {
          pass: e.target.value,
          info: game.info
        }); // Add player to permissed list on server (if correct password)
      }
    }
  }, {
    key: "handleKeyDown",
    value: function handleKeyDown(e) {
      if (e.keyCode === 13) // If ENTER key is down
        this.props.submit(this.menuType);
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      this.applyInstance();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.update(this.instance, this.state.value);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(next) {
      this.setState({
        value: next.value
      });
    }
  }, {
    key: "render",
    value: function render() {
      var style = {};

      for (var i in this.style) {
        style[i] = this.style[i];
      }

      style.backgroundColor = this.state.backgroundColor;
      return React.createElement("input", {
        id: this.instance + ' input',
        className: "menuinput",
        type: "text",
        value: this.state.value,
        autoComplete: "off",
        style: style,
        onFocus: this.handleFocus,
        onBlur: this.handleFocus,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      });
    }
  }]);

  return Text;
}(React.Component);
"use strict";

var menus = {
  create: {
    header: 'Game Creation Options',
    button: 'Create',
    options: ['Game Title', 'Password', 'World Type', 'World Width', 'World Height', 'Player Minimum', 'Player Cap', 'Team Count', 'Leaderboard Length', 'Game Mode'],
    values: ['text', 'text', 'list', 'number', 'number', 'number', 'number', 'number', 'number', 'list']
  },
  join: {
    header: 'Join Game Options',
    button: 'Join',
    options: ['Screen Name', 'Password', 'Color', 'Skin', '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign'],
    values: ['text', 'text', 'list', '3 radio', '2 radio', '2 radio', '2 radio', 'list', '1 radio']
  },
  spectate: {
    header: 'Spectate Game Options',
    button: 'Spectate',
    options: ['Screen Name', 'Password'],
    values: ['text', 'text']
  },
  respawn: {
    header: 'Spawn Options',
    button: 'Spawn',
    options: ['Color', 'Skin', '1st Ability', '2nd Ability', '3rd Ability', 'Team', 'Auto Assign', 'Leave Game'],
    values: ['list', '3 radio', '2 radio', '2 radio', '2 radio', 'list', '1 radio', 'button']
  },
  pauseGame: {
    header: 'Pause Options',
    button: 'Apply',
    options: ['Color', 'Skin', 'Name Labels', 'Messages', 'Leave Game'],
    values: ['list', '3 radio', '1 radio', '1 radio', 'button']
  },
  pauseSpectate: {
    header: 'Pause Options',
    button: 'Apply',
    options: ['Name Labels', 'Messages', 'Leave Game'],
    values: ['1 radio', '1 radio', 'button']
  },
  pauseTutorial: {
    header: 'Pause Options',
    button: 'Back',
    options: ['Leave Tutorial'],
    values: ['button']
  }
};

function renderMenu(type, data) {
  if (state.indexOf('Menu') !== -1 && type !== state.slice(0, -4)) {
    // If current state is a menu and menu to be rendered is a different menu, unmount menu and re-render
    ReactDOM.unmountComponentAtNode(eid('cont')); // Must first unmount component so Menu() will construct new instance rather than re-rendering (easier than re-constructing in componentWillReceiveProps() when rendering a menu from another menu)
  }

  ReactDOM.render(React.createElement(Menu, {
    type: type,
    data: data
  }), eid('cont')); // Render instance of Menu component class in container with id 'cont'

  state = type + 'Menu'; // Game state - not component state
}
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function submit(menuType) {
  var issues = []; // Array of objects [ { [instance]: 'error message' } ] (instance of input to render error message next to)

  var ok = true; // Check for inputs' validities

  var tInput = eid('game title input');
  var pInput = eid('password input');
  var typeInput = eid('world type input');
  var widthInput = eid('world width input');
  var heightInput = eid('world height input');
  var pcInput = eid('player cap input');
  var pmInput = eid('player minimum input');
  var boardLengthInput = eid('leaderboard length input');
  var tcInput = eid('team count input');
  var modeInput = eid('game mode input');
  var snInput = eid('screen name input');
  var cInput = eid('color input');
  var teamInput = eid('team input');
  var gametitle = tInput ? tInput.value : null; // Reading values is ok, but do not edit direct to the DOM

  var password = pInput ? pInput.value : null;
  var type = typeInput ? typeInput.value.toLowerCase() : null;
  var width = widthInput ? parseFloat(widthInput.value) : null;
  var height = heightInput ? parseFloat(heightInput.value) : null;
  var cap = pcInput ? parseFloat(pcInput.value) : null;
  var minimum = pmInput ? parseFloat(pmInput.value) : null;
  var show = boardLengthInput ? parseFloat(boardLengthInput.value) : null;
  var teamCount = tcInput ? parseFloat(tcInput.value) : null;
  var mode = modeInput ? modeInput.value : null;
  var name = snInput ? snInput.value : null;
  var color = cInput ? cInput.value.toLowerCase() : null;
  var first = this.state.values[menus[this.type].options.indexOf('1st Ability')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)

  var second = this.state.values[menus[this.type].options.indexOf('2nd Ability')]; // Value of second ability input

  var third = this.state.values[menus[this.type].options.indexOf('3rd Ability')]; // Valeu of third ability input

  first = first ? first.toLowerCase() : ''; // toLowerCase() is separated so entire getting of first value need not be repeated in ternary expression

  second = second ? second.toLowerCase() : '';
  third = third ? third.toLowerCase() : '';
  var skin = this.state.values[menus[this.type].options.indexOf('Skin')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)

  skin = skin || 'none'; // If no skin is selected, set value of skin to 'none'

  var team = teamInput ? teamInput.value.toLowerCase() : null;
  var auto = this.state.values[menus[this.type].options.indexOf('Auto Assign')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)

  auto = auto ? true : false; // Set auto assign to Boolean value

  var label = this.state.values[menus[this.type].options.indexOf('Name Labels')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)

  label = label === 'name labels' ? true : false; // Set label to Boolean value

  var message = this.state.values[menus[this.type].options.indexOf('Messages')]; // this value must be instance of Menu component (bind this in submit property in menuSubmit rendering)

  message = message === 'messages' ? true : false; // Set messages to Boolean value

  switch (menuType) {
    case 'create':
      {
        // Game Title
        if (tInput) {
          // If title input exists
          if (!gametitle) {
            // If empty
            ok = false;
            issues.push(_defineProperty({}, 'game title', 'Title cannot be left blank')); // alert('Title cannot be left blank');
          } else {
            for (var i = 0; i < games.length; i++) {
              if (gametitle === games[i].info.title) {
                // Find matching title to another game
                ok = false;
                issues.push(_defineProperty({}, 'game title', 'Title matches that of another game')); // alert('Title matches that of another game');

                break;
              }
            }
          }
        }
      }
      {
        // World Width and Height
        if (widthInput && heightInput) {
          // If width and height inputs exist
          if (!width && width !== 0) {
            // If width input is empty
            width = parseFloat(widthInput.placeholder); // Set width to default (rendered in placeholder)
          }

          if (!height && height !== 0) {
            // If height input is empty
            height = parseFloat(heightInput.placeholder); // Set height to default (rendered in placeholder)
          }

          if (width < parseFloat(widthInput.min) || height < parseFloat(heightInput.min)) {
            ok = false;
            issues.push(_defineProperty({}, 'world width', 'Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px'));
            issues.push(_defineProperty({}, 'world height', 'Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px')); // alert('Dimensions must be at least ' + widthInput.min + ' x ' + heightInput.min + ' px');
          } else if (width > parseFloat(widthInput.max) || height > parseFloat(heightInput.max)) {
            ok = false;
            issues.push(_defineProperty({}, 'world width', 'Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px'));
            issues.push(_defineProperty({}, 'world height', 'Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px')); // alert('Dimensions can be at most ' + widthInput.max + ' x ' + heightInput.max + ' px');
          }

          if (width % 1 !== 0 || height % 1 !== 0) {
            ok = false;
            issues.push(_defineProperty({}, 'world width', 'Width and height must be whole numbers'));
            issues.push(_defineProperty({}, 'world height', 'Width and height must be whole numbers')); // alert('Width and height must be whole numbers');
          }

          if (width != height) {
            ok = false;
            issues.push(_defineProperty({}, 'world width', 'Width and height must be equivalent'));
            issues.push(_defineProperty({}, 'world height', 'Width and height must be equivalent')); // alert('Width and height must be equivalent');
          }
        }
      }
      {
        // Player Cap
        if (pcInput) {
          // If player cap input exists
          if (!cap && cap !== 0) {
            // If player cap input is left empty
            cap = parseFloat(pcInput.placeholder); // Set cap to default as rendered as placeholder
          } else if (cap < parseFloat(pcInput.min)) {
            ok = false;
            issues.push(_defineProperty({}, 'player cap', 'Player cap must be at least ' + parseFloat(pcInput.min))); // alert('Player cap must be at least ' + parseFloat(pcInput.min));
          } else if (cap % 1 !== 0) {
            ok = false;
            issues.push(_defineProperty({}, 'player cap', 'Player cap must be a whole number')); // alert('Player cap must be a whole number');
          } else if (pmInput ? cap < parseFloat(pmInput.value) : false) {
            // If player minimum input exists and player cap is less than player minimum value
            ok = false;
            issues.push(_defineProperty({}, 'player cap', 'Player cap cannot be less than player minimum')); // alert('Player cap cannot be less than player minimum');
          }
        }
      }
      {
        // Player Minimum
        if (pmInput) {
          // If player minimum input exists
          if (!minimum && minimum !== 0) {
            // If player minimum input is left empty
            minimum = parseFloat(pmInput.placeholder); // Set player minimum to default rendered as placeholder
          } else if (minimum < parseFloat(pmInput.min)) {
            ok = false;
            issues.push(_defineProperty({}, 'player minimum', 'Player minimum must be at least ' + parseFloat(pmInput.min))); // alert('Player minimum must be at least ' + parseFloat(pmInput.min));
          } else if (minimum % 1 !== 0) {
            ok = false;
            issues.push(_defineProperty({}, 'player minimum', 'Player minimum must be a whole number')); // alert('Player minimum must be a whole number');
          }
        }
      }
      {
        // Leaderboard Length
        if (boardLengthInput) {
          // If leaderboard length input exists
          if (!show && show !== 0) {
            // If input is left blank
            show = parseFloat(boardLengthInput.placeholder);
          } else if (show < parseFloat(boardLengthInput.min)) {
            ok = false;
            issues.push(_defineProperty({}, 'leaderboard length', 'Leaderboard length must be at least ' + parseFloat(boardLengthInput.min))); // alert('Leaderboard length must be at least ' + parseFloat(boardLengthInput.min));
          } else if (show > parseFloat(boardLengthInput.max)) {
            ok = false;
            issues.push(_defineProperty({}, 'leaderboard length', 'Leaderboard length can be at most ' + parseFloat(boardLengthInput.max))); // alert('Leaderboard length can be at most ' + parseFloat(boardLengthInput.max));
          } else if (show % 1 !== 0) {
            ok = false;
            issues.push(_defineProperty({}, 'leaderboard length', 'Leaderboard length must be a whole number')); // alert('Leaderboard length must be a whole number');
          }
        }
      }
      {
        // Team Count
        if (tcInput) {
          // If team count input exists
          if (!teamCount && teamCount !== 0) {
            // If team count input is left empty
            teamCount = parseFloat(tcInput.placeholder); // Set team count to default rendered as placeholder
          } else if (teamCount < parseFloat(tcInput.min)) {
            ok = false;
            issues.push(_defineProperty({}, 'team count', 'Team count must be at least ' + parseFloat(tcInput.min))); // alert('Team count must be at least ' + parseFloat(tcInput.min));
          } else if (teamCount > parseFloat(tcInput.max)) {
            ok = false;
            issues.push(_defineProperty({}, 'team count', 'Team count can be at most ' + parseFloat(tcInput.max))); // alert('Team count can be at most ' + parseFloat(tcInput.max));
          } else if (teamCount % 1 !== 0) {
            ok = false;
            issues.push(_defineProperty({}, 'team count', 'Team count must be a whole number')); // alert('Team count must be a whole number');
          } else if (teamCount > parseFloat(pcInput.value)) {
            ok = false;
            issues.push(_defineProperty({}, 'team count', 'Player cap cannot be less than the number of teams')); // alert('Player cap cannot be less than the number of teams');
          }
        }
      }

      if (ok) {
        var _color = 'black'; // eid('World color input').value.toLowerCase(); // Only black world is enabled

        createGame({
          title: gametitle,
          password: password,
          type: type,
          width: width,
          height: height,
          color: _color,
          cap: cap,
          show: show,
          mode: mode,
          teamCount: teamCount,
          min: minimum
        });
        renderMenu('join', game); // Pass in game data for certain menu information
      } else {
        this.issue(issues);
      }

      break;

    case 'join':
      {
        // Screen Name
        if (!name) {
          // If screen name input is left empty
          ok = false;
          issues.push(_defineProperty({}, 'screen name', 'Screen name cannot be left empty')); // alert('Screen name cannot be left empty');
        }

        for (var _i = 0; _i < game.info.count; _i++) {
          // Requires game to be updated (in renderMenu(datA))
          if (name == game.board.list[_i].name) {
            // Name cannot match another player's name
            ok = false;
            issues.push(_defineProperty({}, 'screen name', 'Name matches that of another player')); // alert('Name matches that of another player');

            break;
          }
        }
      } // Skins

      if (skins.indexOf(skin) === -1 && skin !== 'none') {
        // If the skin value is not 'none' or any other possible skin (should never occur)
        ok = false;
        issues.push({
          skin: 'There is an issue with the skin selection'
        });
      }

      {
        // Abilities
        if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') {
          // FFA, SKM, SRV, CTF, and KTH all use standard ability set
          if (!first) {
            ok = false;
            issues.push(_defineProperty({}, '1st ability', 'Select a first ability'));
          } else if (first !== 'extend' && first !== 'compress') {
            ok = false;
            issues.push(_defineProperty({}, '1st ability', 'There is an issue with the first ability selection'));
          }

          if (!second) {
            ok = false;
            issues.push(_defineProperty({}, '2nd ability', 'Select a second ability'));
          } else if (second !== 'immortality' && second !== 'freeze') {
            ok = false;
            issues.push(_defineProperty({}, '2nd ability', 'There is an issue with the second ability selection'));
          }

          if (!third) {
            ok = false;
            issues.push(_defineProperty({}, '3rd ability', 'Select a third ability'));
          } else if (third !== 'neutralize' && third !== 'toxin') {
            ok = false;
            issues.push(_defineProperty({}, '3rd ability', 'There is an issue with the third ability selection'));
          }
        }
      }
      {
        // Team
        if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
          // If is a team game
          if (!auto) {
            for (var _i2 = 0; _i2 < game.teams.length; _i2++) {
              if (_i2 === teamColors.indexOf(team)) {
                // If i is selected team
                continue;
              }

              if (game.teams[teamColors.indexOf(team)].length > game.teams[_i2].length) {
                // If there are more players on selected team than another
                if (org && typeof team === 'string' && org.team === team) {
                  // If player is already on selected team
                  break; // Allow spawn
                }

                ok = false;
                issues.push(_defineProperty({}, 'auto assign', 'Cannot join ' + team + ' team because it already has more players than ' + teamColors[_i2])); // alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);

                break;
              }
            }

            if (org && org.team !== team && game.teams[teamColors.indexOf(org.team)].length === game.teams[teamColors.indexOf(team)].length) {
              ok = false;
              issues.push(_defineProperty({}, 'auto assign', 'Cannot join ' + team + ' team because it will have more players than ' + org.team)); // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
            }
          }
        }
      }
      {
        // Player Cap
        if (game.players.length >= game.info.cap) {
          ok = false;
          issues.push(_defineProperty({}, 'player cap', 'Game is at maximum player capacity')); // alert('Game is at maximum player capacity');
        }
      }
      {
        // Game Closed
        var closed = true;

        for (var _i3 = 0; _i3 < games.length; _i3++) {
          if (games[_i3].info.host == game.info.host) {
            closed = false;
            break;
          }
        }

        if (closed) {
          ok = false; // issues.push({ ['']: 'The game has closed' }); // Empty quotes for game closed instance because it is not specific to a single input

          alert('The game has closed');
          renderTitle();
        }
      }
      {
        var deniedJoin = function deniedJoin() {
          socket.off('Permission Denied');
          socket.off('Permission Granted');
          ok = false;

          if (password === '' || typeof password !== 'string') {
            issues.push(_defineProperty({}, 'password', 'A password is required for this game')); // alert('A password is required for this game');
          } else {
            issues.push(_defineProperty({}, 'password', 'Password is invalid')); // alert('Password is invalid');
          }

          this.issue(issues);
        };

        var grantedJoin = function grantedJoin() {
          // Function is defined locally so it cannot be called from the global scope (slightly better security)
          socket.off('Permission Denied');
          socket.off('Permission Granted');

          if (ok) {
            // Inside grantedJoin() so can only be triggered once 'Permission Granted' has been received
            // Leaderboard
            var already = false;

            for (var _i4 = 0; _i4 < game.board.list.length; _i4++) {
              if (game.board.list[_i4].player == socket.id) {
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
            socket.emit('Board', {
              list: game.board.list,
              host: game.board.host
            }); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
            // Abilities

            if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') {
              // FFA, SKM, SRV, CTF, and KTH all use standard ability set
              ability.tag.activated = false;
              ability.tag.can = false;

              if (first === 'extend') {
                ability.extend.activated = true;
                ability.extend.can = true;
                ability.compress.activated = false;
                ability.compress.can = false;
              } else if (first === 'compress') {
                ability.compress.activated = true;
                ability.compress.can = true;
                ability.extend.activated = false;
                ability.extend.can = false;
              }

              if (second === 'immortality') {
                ability.immortality.activated = true;
                ability.immortality.can = true;
                ability.freeze.activated = false;
                ability.freeze.can = false;
              } else if (second === 'freeze') {
                ability.freeze.activated = true;
                ability.freeze.can = true;
                ability.immortality.activated = false;
                ability.immortality.can = false;
              }

              if (third === 'neutralize') {
                ability.neutralize.activated = true;
                ability.neutralize.can = true;
                ability.toxin.activated = false;
                ability.toxin.can = false;
              } else if (third === 'toxin') {
                ability.toxin.activated = true;
                ability.toxin.can = true;
                ability.neutralize.activated = false;
                ability.neutralize.can = false;
              }

              ability.spore.activated = true;
              ability.spore.can = true;
              ability.secrete.activated = true;
              ability.secrete.can = false;

              for (var _i5 = 0; _i5 < ability.shoot.value.length; _i5++) {
                ability.shoot.can[_i5] = true;
                ability.shoot.value[_i5] = false;
              }
            } else if (game.info.mode === 'inf') {
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

              for (var _i6 = 0; _i6 < ability.shoot.value.length; _i6++) {
                if (_i6 == ability.tag.i) {
                  ability.shoot.can[_i6] = true;
                } else {
                  ability.shoot.can[_i6] = false;
                }

                ability.shoot.value[_i6] = false;
              }
            } // Team


            if (game.info.mode === 'skm' || game.info.mode === 'ctf') {
              // If is a team game
              ability.auto = auto; // auto variable is Boolean

              if (auto) {
                // If auto assign is selected
                var indices = [];
                var _minimum = Infinity;

                for (var _i7 = 0; _i7 < game.teams.length; _i7++) {
                  // Find team(s) with the fewest players and store their indices within game.teams array into indices array
                  if (game.teams[_i7].length < _minimum) {
                    // If length is less than minimum
                    _minimum = game.teams[_i7].length; // Set length as new minimum

                    indices = [_i7]; // Clear indices and push i
                  } else if (game.teams[_i7].length == _minimum) {
                    indices.push(_i7);
                  }
                }

                team = teamColors[indices[floor(random(0, indices.length))]]; // Set team to the team with the fewest players; If there are multiple, choose one at random
              }

              for (var _i8 = 0; _i8 < teamColors.length; _i8++) {
                if (team === teamColors[_i8]) {
                  game.teams[_i8].push(socket.id); // Add player to selected team


                  socket.emit('Teams', {
                    teams: game.teams,
                    host: game.info.host
                  }); // Update server teams; host is for identification

                  break;
                }
              }
            } // Color


            var color;

            if (game.info.mode === 'inf') {
              // If inf mode
              color = teamColorDef.green; // All players healthy by default
            } else if (game.info.mode !== 'skm' && game.info.mode !== 'ctf' && eid('color input')) {
              // If is not a team game and there is a color input field
              color = eid('color input').value.toLowerCase();
            } else {
              color = teamColorDef[team]; // Color must be after Team
            } // Initialize


            clearInterval(title.interval);

            if (game.rounds.util) {
              if (game.rounds.waiting) {
                initialize(game, {
                  spectate: false,
                  color: orgColors[game.world.color][color],
                  skin: skin,
                  team: team
                });
              } else {
                initialize(game, {
                  spectate: true,
                  color: orgColors[game.world.color][color],
                  skin: skin,
                  team: team
                });
              }
            } else {
              initialize(game, {
                spectate: false,
                color: orgColors[game.world.color][color],
                skin: skin,
                team: team
              });
            }
          } else {
            this.issue(issues);
          }
        };

        // Password
        socket.emit('Check Permission', {
          title: game.info.title
        });
        socket.on('Permission Denied', deniedJoin.bind(this)); // Call bound function so this.issues() can be called from within

        socket.on('Permission Granted', grantedJoin.bind(this));
      }
      break;

    case 'spectate':
      {
        // Game Closed
        var _closed = true;

        for (var _i9 = 0; _i9 < games.length; _i9++) {
          if (games[_i9].info.host === game.info.host) {
            _closed = false;
            break;
          }
        }

        if (_closed) {
          ok = false; // issues.push({ ['']: 'The game has closed' });

          alert('The game has closed');
          renderTitle();
        }
      }
      {
        // Screen Name
        if (!name) {
          ok = false;
          issues.push(_defineProperty({}, 'screen name', 'Screen name cannot be left empty')); // alert('Screen name cannot be left empty');
        }

        for (var _i10 = 0; _i10 < game.info.count; _i10++) {
          // Requires game to be updated (in renderMenu(datA))
          if (name === game.board.list[_i10].name) {
            // Name cannot match another player's name
            ok = false;
            issues.push(_defineProperty({}, 'screen name', 'Name matches that of another player')); // alert('Name matches that of another player');

            break;
          }
        }
      }
      {
        var deniedSpectate = function deniedSpectate() {
          socket.off('Permission Denied');
          socket.off('Permission Granted');
          ok = false;

          if (!password) {
            issues.push(_defineProperty({}, 'password', 'A password is required for this game')); // alert('A password is required for this game');
          } else {
            issues.push(_defineProperty({}, 'password', 'Password is invalid')); // alert('Password is invalid');
          }

          this.issue(issues);
        };

        var grantedSpectate = function grantedSpectate() {
          socket.off('Permission Denied');
          socket.off('Permission Granted');

          if (ok) {
            // Inside 'Permission Granted' so can only be triggered once 'Permission Granted' has been received
            // Leaderboard
            var already = false;

            for (var _i11 = 0; _i11 < game.board.list.length; _i11++) {
              if (game.board.list[_i11].player === socket.id) {
                already = true;
                break;
              }
            }

            if (!already) {
              game.board.list.push({
                // Add player to leaderboard
                player: socket.id,
                name: name,
                kills: 0,
                deaths: 0,
                score: 0,
                wins: 0
              });
            }

            orderBoard(game.board.list);
            socket.emit('Board', {
              list: game.board.list,
              host: game.board.host
            }); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
            // Initialize

            clearInterval(title.interval);
            initialize(game, {
              spectate: true,
              color: undefined,
              skin: undefined
            });
          } else {
            this.issue(issues);
          }
        };

        // Password
        socket.emit('Check Permission', {
          title: game.info.title
        });
        socket.on('Permission Denied', deniedSpectate.bind(this));
        socket.on('Permission Granted', grantedSpectate.bind(this));
      }
      break;

    case 'respawn':
      if (skins.indexOf(skin) === -1 && skin !== 'none') // Skins
        ok = false;
      issues.push({
        skin: 'There is an issue with the skin selection'
      });
      {
        // Abilities
        if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') {
          // FFA, SKM, SRV, CTF, and KTH all use standard ability set
          if (!first) {
            ok = false;
            issues.push(_defineProperty({}, '1st ability', 'Select a first ability'));
          } else if (first !== 'extend' && first !== 'compress') {
            ok = false;
            issues.push(_defineProperty({}, '1st ability', 'There is an issue with the first ability selection'));
          }

          if (!second) {
            ok = false;
            issues.push(_defineProperty({}, '2nd ability', 'Select a second ability'));
          } else if (second !== 'immortality' && second !== 'freeze') {
            ok = false;
            issues.push(_defineProperty({}, '2nd ability', 'There is an issue with the second ability selection'));
          }

          if (!third) {
            ok = false;
            issues.push(_defineProperty({}, '3rd ability', 'Select a third ability'));
          } else if (third !== 'neutralize' && third !== 'toxin') {
            ok = false;
            issues.push(_defineProperty({}, '3rd ability', 'There is an issue with the third ability selection'));
          }
        }
      }
      {
        // Team
        if (game.info.mode === 'skm' || game.info.mode === 'ctf') {
          // If is a team game
          ability.auto = auto; // auto variable is Boolean

          if (!auto) {
            // If auto assign is not selected
            for (var _i12 = 0; _i12 < game.teams.length; _i12++) {
              if (_i12 === teamColors.indexOf(team)) {
                continue;
              }

              if (game.teams[teamColors.indexOf(team)].length > game.teams[_i12].length) {
                // If chosen team has greater players than another team
                if (org && org.team === team && typeof team === 'string') {
                  // If player is already on loaded team
                  break; // Allow respawn
                } else {
                  ok = false; // Disallow respawn

                  issues.push(_defineProperty({}, 'team input', 'Cannot join ' + team + ' team because it already has more players than ' + teamColors[_i12])); // alert('Cannot join ' + team + ' team because it already has more players than ' + teamColors[i]);

                  break;
                }
              }

              if (org && org.team !== team && game.teams[teamColors.indexOf(org.team)].length === game.teams[teamColors.indexOf(team)].length) {
                // If chosen team has equal players as current team (and is not current team)
                ok = false; // Disallow respawn

                issues.push(_defineProperty({}, 'team input', 'Cannot join ' + team + ' team because it will have more players than ' + org.team)); // alert('Cannot join ' + team + ' team because it will have more players than ' + org.team);
              }
            }
          } else {
            // If auto assign is selected
            var indices = [];
            var _minimum2 = Infinity;

            for (var _i13 = 0; _i13 < game.teams.length; _i13++) {
              // Find team(s) with the fewest players and store their indices within game.teams array into indices array
              var l = game.teams[_i13].length;

              if (game.teams[_i13].indexOf(socket.id) != -1) {
                // If player is on given team
                l--; // Do not include player as part of the team, so if even numbers before, will replace back on the same team and not add extra to other team
              }

              if (l < _minimum2) {
                // If length is less than minimum
                _minimum2 = l; // Set length as new minimum

                indices = [_i13]; // Clear indices and push i
              } else if (l == _minimum2) {
                indices.push(_i13);
              }
            }

            team = teamColors[indices[floor(random(0, indices.length))]]; // Set team to the team with the fewest players; If there are multiple, choose one at random
          }
        }
      }
      {
        // Game Closed
        var _closed2 = true;

        for (var _i14 = 0; _i14 < games.length; _i14++) {
          if (games[_i14].info.host == game.info.host) {
            _closed2 = false;
            break;
          }
        }

        if (_closed2 == true) {
          ok = false; // issues.push({ ['']: 'The game has closed' });

          alert('The game has closed');
          renderTitle();
        }
      }

      if (ok) {
        socket.emit('Spectator Spawned', game); // Abilities

        if (game.info.mode === 'ffa' || game.info.mode === 'skm' || game.info.mode === 'srv' || game.info.mode === 'ctf' || game.info.mode === 'kth') {
          // FFA, SKM, SRV, CTF, and KTH all use standard ability set
          if (first === 'extend') {
            ability.extend.activated = true;
            ability.extend.can = true;
            ability.compress.activated = false;
            ability.compress.can = false;
          } else if (first === 'compress') {
            ability.compress.activated = true;
            ability.compress.can = true;
            ability.extend.activated = false;
            ability.extend.can = false;
          }

          if (second === 'immortality') {
            ability.immortality.activated = true;
            ability.immortality.can = true;
            ability.freeze.activated = false;
            ability.freeze.can = false;
          } else if (second === 'freeze') {
            ability.freeze.activated = true;
            ability.freeze.can = true;
            ability.immortality.activated = false;
            ability.immortality.can = false;
          }

          if (third === 'neutralize') {
            ability.neutralize.activated = true;
            ability.neutralize.can = true;
            ability.toxin.activated = false;
            ability.toxin.can = false;
          } else if (third === 'toxin') {
            ability.toxin.activated = true;
            ability.toxin.can = true;
            ability.neutralize.activated = false;
            ability.neutralize.can = false;
          }

          ability.spore.activated = true;
          ability.spore.can = true;
          ability.secrete.activated = true;
          ability.secrete.can = false;
        } else if (game.info.mode === 'inf') {
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
        } // Team


        if (game.info.mode === 'skm' || game.info.mode === 'ctf') {
          // If is a team game
          if (org.team !== team) {
            // Only add player to team if not already on team
            game.teams[teamColors.indexOf(team)].push(socket.id); // Add player to selected team

            game.teams[teamColors.indexOf(org.team)].splice(game.teams[teamColors.indexOf(org.team)].indexOf(socket.id), 1);
            socket.emit('Teams', {
              teams: game.teams,
              host: game.info.host
            }); // Host is for identification
          }
        } // Color


        if (game.info.mode === 'inf') {
          // If inf mode
          color = teamColorDef.green; // All players healthy by default
        } else if (game.info.mode !== 'skm' && game.info.mode !== 'ctf') {
          // If is not a team mode 
          color = eid('color input').value.toLowerCase();
        } else {
          color = teamColorDef[team]; // Color must be after Team
        } // Initialize


        initialize(game, {
          spectate: false,
          color: orgColors[game.world.color][color],
          skin: skin,
          team: team
        });
      } else {
        this.issue(issues);
      }

      break;

    case 'pauseGame':
      if (skins.indexOf(skin) === -1 || skin === 'none') // Skins
        issues.push({
          skin: 'There is an issue with the skin selection'
        });
      {
        // Game Closed
        var _closed3 = true;

        for (var _i15 = 0; _i15 < games.length; _i15++) {
          if (games[_i15].info.host === game.info.host) {
            _closed3 = false;
            break;
          }
        }

        if (_closed3) {
          ok = false; // issues.push({ ['']: 'The game has closed' });

          alert('The game has closed');
          renderTitle();
        }
      }

      if (ok) {
        if (game.info.mode !== 'skm' && game.info.mode !== 'ctf') {
          // If is not a team mode
          org.color = orgColors[game.world.color][color]; // Set org color
        } // Cannot change team in pause menu


        org.skin = skin; // Set org skin

        Labels = label; // Set labels setting (Boolean)

        Messages = message; // Set messages setting (Boolean)

        var skip = false;

        for (var _i16 = 0; _i16 < game.players.length; _i16++) {
          if (game.players[_i16] === socket.id) {
            // If still is a player
            state = 'game';
            skip = true;
            break;
          }
        }

        if (!skip) {
          for (var _i17 = 0; _i17 < game.spectators.length; _i17++) {
            if (game.spectators[_i17] === socket.id) {
              state = 'spectate'; // Must include spectate possibility in pause game; even though a spectator could never open pause game menu, he could be killed while in menu

              break;
            }
          }
        }

        ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
      } else {
        this.issue(issues);
      }

      break;

    case 'pauseSpectate':
      {
        // Game Closed
        var _closed4 = true;

        for (var _i18 = 0; _i18 < games.length; _i18++) {
          if (games[_i18].info.host === game.info.host) {
            _closed4 = false;
            break;
          }
        }

        if (_closed4) {
          ok = false; // issues.push({ ['']: 'The game has closed' });

          alert('The game has closed');
          renderTitle();
        }
      }

      if (ok) {
        Labels = label; // Set name labels setting (Boolean)

        Messages = message; // Set messages setting (Boolean)

        state = 'spectate';
        ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
      } else {
        this.issue(issues);
      }

      break;

    case 'pauseTutorial':
      if (ok) {
        state = 'tutorial';
        ReactDOM.render(React.createElement(CanvasCont, null), eid('cont'));
      } else {
        this.issue(issues);
      }

      break;
  }
}
"use strict";

var currentMessage = function currentMessage() {
  var message;

  if (state === 'game' || state === 'spectate') {
    if (org.alive) {
      if (game.rounds.util) {
        if (game.rounds.waiting == true && game.rounds.delayed == false) {
          if (game.rounds.min - game.info.count == 1) {
            message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
          } else {
            message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
          }
        } else if (game.rounds.waiting == true && game.rounds.delayed == true) {
          // Delay at round start
          message = 'Round begins in: ' + (1 + floor((game.rounds.rounddelay - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
        } else if (game.rounds.waiting == false && game.rounds.delayed == true) {
          // Delay at round end
          message = 'Round ends in: ' + (1 + floor((game.rounds.rounddelay - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
        }
      }
    } else if (!org.alive) {
      if (game.rounds.util) {
        if (game.rounds.waiting === true && game.rounds.delayed === false) {
          // Waiting for more players to join, not counting down yet
          if (game.rounds.min - game.info.count == 1) {
            message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
          } else {
            message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
          }
        } else if (game.rounds.waiting === true && game.rounds.delayed === true) {
          // Enough players have joined, counting down
          message = 'Round begins in: ' + (1 + floor((game.rounds.rounddelay - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
        } else if (game.rounds.waiting === false && game.rounds.delayed === false) {
          // Round in progress
          message = 'Wait for the round to complete';
        } else if (game.rounds.waiting === false && game.rounds.delayed === true) {
          message = 'Round ends in: ' + (1 + floor((game.rounds.rounddelay - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
        }
      } else {
        message = 'Press \'' + Controls.respawn.key + '\' to Spawn';
      }
    }
  } else if (state === 'tutorial') {
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
  if (Messages == true) {
    var message = currentMessage();

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

var messageWidth = function messageWidth(message) {
  var lines = message.split('\n');
  var count = lines.length;
  var lengths = [];

  for (var i = 0; i < count; i++) {
    lengths.push(lines[i].length);
  }

  return textWidth(lines[lengths.indexOf(max(lengths))]);
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var title; // Initialize in global scope

var Title = function Title() {
  var _this = this;

  state = 'title';
  this.src = 'title';
  this.margin = _margin;
  this.world = new World({
    width: window.innerWidth - this.margin * 2,
    height: window.innerHeight - this.margin * 2,
    type: 'rectangle',
    color: 'black',
    x: this.margin,
    y: this.margin
  });
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
      x: random(this.world.x + _cellwidth + this.world.width / 2 * xoff, this.world.x - _cellwidth + this.world.width / 2 * (xoff + 1)),
      // 80 is edge buffer
      y: random(this.world.y + _cellwidth + this.world.height / 2 * yoff, this.world.y - _cellwidth + this.world.height / 2 * (yoff + 1))
    };
    this.orgs[i] = new Org({
      player: i,
      color: color,
      skin: skin,
      team: null,
      pos: pos,
      title: true
    });
    this.orgs[i].cells[0] = new Cell(this.orgs[i].pos.x, this.orgs[i].pos.y, this.orgs[i]); // Title must exist to create new Cell()

    this.orgs[i].count++;
    this.abilities[i] = new Ability({
      player: i
    });
  }

  this.menu = new TitleMenu(this.world.x + this.world.width / 2, this.world.y + this.world.height / 2);
  /**
   * Interval to run title screen animations
   * @return void
   */

  this.interval = setInterval(function () {
    {
      // Render
      // Background
      background(_this.world.backdrop.r, _this.world.backdrop.g, _this.world.backdrop.b); // Shadows

      fill(_this.world.backdrop.r - 20, _this.world.backdrop.g - 20, _this.world.backdrop.b - 20);
      noStroke();
      rect(_this.world.x + _this.world.width / 2 + 7, _this.world.y + _this.world.height / 2 + 6, _this.world.width, _this.world.height); // World
      // World

      fill(_this.world.background.r, _this.world.background.g, _this.world.background.b);
      stroke(_this.world.border.color.r, _this.world.border.color.g, _this.world.border.color.b);
      strokeWeight(1);
      rect(_this.world.x + _this.world.width / 2, _this.world.y + _this.world.height / 2, _this.world.width, _this.world.height); // Orgs

      renderOrgs();
    }
    {
      // Calculate
      for (var _i = 0; _i < _this.orgs.length; _i++) {
        _this.orgs[_i].grow();
      }
    }
  }, _orgfrequency);
  /**
   * Resize the title screen to fit the window dimensions
   * @param  number x offset in x-direction from left of window
   * @param  number y offset in y-direction from top of window
   * @param  number w screen width (pixels)
   * @param  number h screen height (pixels)
   * @return void
   */

  this.resize = function (x, y, w, h) {
    center.x = window.innerWidth / 2;
    center.y = window.innerHeight / 2;
    var old_x = _this.world.x - _this.margin;
    var old_y = _this.world.y - _this.margin;

    for (var _i2 = 0; _i2 < _this.orgs.length; _i2++) {
      _this.orgs[_i2].pos.x = (_this.orgs[_i2].pos.x - _this.margin - old_x) / _this.world.width * (w - _this.margin * 2) + (_this.margin + x); // Reposition org correctly

      _this.orgs[_i2].pos.y = (_this.orgs[_i2].pos.y - _this.margin - old_y) / _this.world.height * (h - _this.margin * 2) + (_this.margin + y); // Must be before new world creation so can find percentage of former world size

      _this.orgs[_i2].cells = [];
      _this.orgs[_i2].cells[0] = new Cell(_this.orgs[_i2].pos.x, _this.orgs[_i2].pos.y, _this.orgs[_i2]);
      _this.orgs[_i2].count = 1;
    }

    _this.world = new World({
      width: w - _this.margin * 2,
      height: h - _this.margin * 2,
      type: 'rectangle',
      color: 'black',
      x: x + _this.margin,
      y: y + _this.margin
    });

    if (state === 'title') {
      renderTitle();
    } else if (state === 'browser') {
      renderBrowser();
    }
  };
};

var TitleMenu =
/*#__PURE__*/
function (_React$Component) {
  _inherits(TitleMenu, _React$Component);

  function TitleMenu(props) {
    _classCallCheck(this, TitleMenu);

    return _possibleConstructorReturn(this, _getPrototypeOf(TitleMenu).call(this, props));
  }

  _createClass(TitleMenu, [{
    key: "handleClick",
    value: function handleClick(btn) {
      switch (btn) {
        case 'host':
          renderMenu('create');
          break;

        case 'join':
          renderBrowser();
          break;

        case 'tutorial':
          renderTutorial();
          tutorial = new Tutorial();
          break;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var x = center.x;
      var y = center.y;
      var mWidth = 170; // Menu Width

      var mHeight = 150;
      var bWidth = mWidth * 2 / 3; // Button Width

      var bHeight = 25;
      var style = {
        menu: {
          left: x - mWidth / 2 + 'px',
          top: y - mHeight / 2 + 'px'
        },
        host: {
          left: x - bWidth / 2 + 'px',
          top: y - mHeight / 2 + 29 + 'px'
        },
        join: {
          left: x - bWidth / 2 + 'px',
          top: y - mHeight / 2 + 29 + bHeight * 3 / 2 + 'px'
        },
        tutorial: {
          left: x - bWidth / 2 + 'px',
          top: y - mHeight / 2 + 29 + bHeight * 3 / 2 * 2 + 'px'
        }
      };
      return React.createElement("div", {
        id: "Title Menu",
        style: style.menu
      }, React.createElement("div", {
        id: "Title Host Button",
        className: "Title Menu Button",
        onClick: function onClick() {
          return _this2.handleClick('host');
        },
        style: style.host
      }, "Host"), React.createElement("div", {
        id: "Title Join Button",
        className: "Title Menu Button",
        onClick: function onClick() {
          return _this2.handleClick('join');
        },
        style: style.join
      }, "Join"), React.createElement("div", {
        id: "Title Tutorial Button",
        className: "Title Menu Button",
        onClick: function onClick() {
          return _this2.handleClick('tutorial');
        },
        style: style.tutorial
      }, "Tutorial")); // handleClick does not need to be bound if arrow function is used; without using arrow function, 'host'/'join'/'tutorial' properties could not be sent
    }
  }]);

  return TitleMenu;
}(React.Component);

function renderTitle() {
  state = 'title';
  if (org) org.clearIntervals(); // If global org variable exists (such as after exiting a game) clear its interval(s) so as to not interfere with title animations

  ability = new Ability({
    player: socket.id
  });
  var a = ReactDOM.render( // Title rendering placed within ReactDOM.render() so Title() can be used for title and retain this. namespace
  React.createElement("div", {
    id: "title"
  }, React.createElement(CanvasCont, null), React.createElement(TitleMenu, null)), eid('cont')); // TitleMenu will not retain its this. namespace
}

var Shade = function Shade() {
  // White layer behind menus allows user to see background but unfocuses it
  var style = {
    position: 'fixed',
    left: '0px',
    top: '0px',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgb(255, 255, 255)',
    opacity: '.5',
    zIndex: '-1'
  };
  return React.createElement("div", {
    id: "shade",
    style: style
  });
};
"use strict";

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
  this.backdrop = {
    r: 70,
    g: 70,
    b: 70
  };
  this.border.weight = 1;

  if (this.color == 'black') {
    this.border.color = {
      r: 255,
      g: 255,
      b: 255
    };
  } else if (this.color == 'white') {
    this.border.color = {
      r: 0,
      g: 0,
      b: 0
    };
  }
};

function renderWorld() {
  // Background
  background(game.world.backdrop.r, game.world.backdrop.g, game.world.backdrop.b); // Shadows

  fill(game.world.backdrop.r - 20, game.world.backdrop.g - 20, game.world.backdrop.b - 20);
  noStroke();
  {
    // World
    if (game.world.type == 'rectangle') {
      // World
      rect(game.world.x + game.world.width / 2 + 7, game.world.y + game.world.height / 2 + 6, game.world.width, game.world.height);
    } else if (game.world.type == 'ellipse') {
      ellipse(game.world.x + game.world.width / 2 + 5, game.world.y + game.world.height / 2 + 4, game.world.width / 2, game.world.height / 2);
    }
  }
  {
    // Leaderboard
    translate(org.off.x, org.off.y); // Shadows in renderWorld() so it will render behind world

    rectMode(CORNER);
    game.board.y = game.board.marginTop; // Leaderboard Head

    switch (game.info.mode) {
      case 'ffa':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
        game.board.count = min(game.board.show, game.board.list.length);
        break;

      case 'skm':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
        game.board.count = game.teams.length;
        break;

      case 'srv':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
        game.board.count = min(game.board.show, game.board.list.length);
        break;

      case 'ctf':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
        game.board.count = game.teams.length;
        break;

      case 'inf':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
        game.board.count = min(game.board.show, game.board.list.length);
        break;

      case 'kth':
        game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
        rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
        game.board.count = min(game.board.show, game.board.list.length);
        break;
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
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
          break;

        case 'skm':
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
          break;

        case 'srv':
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
          break;

        case 'ctf':
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
          break;

        case 'inf':
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
          break;

        case 'kth':
          rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
          break;
      }

      a++;
    }

    translate(-org.off.x, -org.off.y);
    rectMode(CENTER);
  }
  {
    // Messages
    translate(org.off.x, org.off.y);

    if (Messages == true) {
      textFont('Helvetica');
      textStyle(NORMAL);
      var message = currentMessage();

      if (message != undefined) {
        var breaks = freq(message, '\n');

        var _width = messageWidth(message);

        rect(5 + 25 + _width / 2, 4 + 25 + 9 * breaks, 25 + _width, 26 + 18 * breaks);
      }
    }

    translate(-org.off.x, -org.off.y);
  } // World

  fill(game.world.background.r, game.world.background.g, game.world.background.b);
  stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
  strokeWeight(game.world.border.weight);

  if (game.world.type == 'rectangle') {
    rect(game.world.x + game.world.width / 2, game.world.y + game.world.height / 2, game.world.width, game.world.height); // World border
  } else if (game.world.type == 'ellipse') {
    ellipse(game.world.x + game.world.width / 2, game.world.y + game.world.height / 2, game.world.width / 2, game.world.height / 2); // World border
  } // CTF


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
        var points = [
          /*{ p: Number, q: Number }*/
        ];

        for (var _j = 0; _j < 720; _j++) {
          var alpha = _j;
          var p = h + l * cos(alpha);
          var q = k + l * sin(alpha);
          var d = abs(sqrt(sq(p - _a) + sq(q - b)) - r); // Calculate distance of point on base circle to world circle

          diffs.push(d); // Store all distances to array

          points.push({
            p: p,
            q: q
          }); // Store all points to array
        }

        var point = points[diffs.indexOf(min(diffs))]; // Find closest point to world circle (points and diffs are analogous)

        var phi = atan(abs(point.q - k) / abs(point.p - h));

        if (phi > 45) {
          phi = 90 - phi;
        }

        arc(h, k, l, l, -theta - phi + 1, -theta + 90 + phi - 1); // -1 to avoid world border overlap
      }
    } // Flag


    noFill();
    stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
    strokeWeight(2);
    line(game.flag.x - game.flag.width / 2, game.flag.y - game.flag.height / 2, game.flag.x - game.flag.width / 2, game.flag.y + game.flag.height / 2);
    fill(game.flag.color.r, game.flag.color.g, game.flag.color.b);
    strokeWeight(1);
    triangle(game.flag.x - game.flag.width / 2, game.flag.y - game.flag.height / 2, game.flag.x - game.flag.width / 2, game.flag.y, game.flag.x + game.flag.width / 2, game.flag.y - game.flag.height / 4);
  }
}

//# sourceMappingURL=bundle.js.map