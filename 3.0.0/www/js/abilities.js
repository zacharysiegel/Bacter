var ability = {
	player: undefined, 
	choose: {
		width: undefined, 
		height: undefined, 
		color: {
			deselected: { r: 139, g: 237, b: 173 }, 
			selected: { r: 69, g: 204, b: 113 }
		}
	}, 
	extend: {
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
	}, 
	compress: {
		value: false, 
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
	}, 
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
	immortality: {
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
	}, 
	freeze: {
		value: false, 
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
	}, 
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
	neutralize: {
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
		time: 4000, 
		cooldown: 6000
	}, 
	toxin: {
		value: false, 
		activated: false, 
		can: false, 
		i: 2, 
		j: 1, 
		radius: 60, 
		color: { r: 255, g: 111, b: 92}, 
		weight: 3, 
		x: undefined, 
		y: undefined, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		cooling: false, 
		time: 4000, 
		cooldown: 6000
	}, 
	spore: {
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
		time: 1900, 
		cooldown: 7500 // 7500 default
	}, 
	secrete: {
		value: false, 
		activated: false, 
		i: 3, 
		j: 1, 
		color: { r: undefined, g: undefined, b: undefined }, 
		radius: CELLWIDTH / cos45 * 2.9, 
		can: false, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		time: 800
	}, 
	shoot: {
		value: [ false, false, false ], 
		can: [ true, true, true ], 
		secrete: [ {}, {}, {}
			// { // Sets values on use
			// 	value: false, 
			// 	color: undefined, 
			// 	radius: CELLWIDTH / cos45 * 2.7 / 2, // Half 'secrete'
			// 	hit: false, 
			// 	timeout: undefined, 
			// 	start: undefined, 
			// 	end: undefined, 
			// 	time: 800 // Same as 'secrete'
			// }
		], 
		spore: [ undefined, undefined, undefined ], 
		speed: 5, 
		interval: [ undefined, undefined, undefined ], 
		timeout: [ undefined, undefined, undefined ], 
		start: [ undefined, undefined, undefined ], 
		end: [ undefined, undefined, undefined ], 
		time: 2000, 
		cooling: [ false, false, false ], 
		cooldown: [ 2000, 2000, 2000 ]
	}, 
	tag: {
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
	}
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
	if (ability.shoot.value[I] == false && ability.shoot.can[I] == true) { // If not currently shooting and if can shoot specified ability (Should have been checked before this point)
		ability.shoot.value[I] = true;
		ability.shoot.can[I] = false;
		ability.shoot.secrete[I].value = false;
		clearTimeout(ability.shoot.timeout[I]); // Reset timeout
		ability.shoot.start[I] = new Date(); // Set start time

		// Get Spore
		let regions = getRegionInfo(org); // Get region data
		let theta = atan((mouseY - center.y) / (mouseX - center.x)); // Get angle (theta) from mouse pointer
		if (mouseX < center.x) { // If mouse is in second or third quadrants
			theta += 180; // Correct theta for negative x
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
		ability.shoot.interval[I] = function() {
			ability.shoot.spore[I].x += ability.shoot.spore[I].speed * cos(ability.shoot.spore[I].theta);
			ability.shoot.spore[I].y += ability.shoot.spore[I].speed * sin(ability.shoot.spore[I].theta);
			socket.emit('Ability', ability);
		};

		// Timeout
		ability.shoot.timeout[I] = setTimeout(function() {
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
		ability.shoot.secrete[I].radius = CELLWIDTH / cos45 * 2.9 / 2; // Not predefined (Half secrete)
		ability.shoot.secrete[I].hit = false;
		ability.shoot.secrete[I].time = 800; // Not predefined (Same as secrete)
		clearTimeout(ability.shoot.timeout[I]);
		ability.shoot.secrete[I].start = new Date();
		ability.shoot.secrete[I].color = org.color;

		// Hit (Apply Ability) (Hit detection on local machine)
		for (let i = 0; i < game.info.count; i++) {
			if (game.orgs[i].player == socket.id || game.orgs[i].team == org.team && typeof team == 'string') { // Do not apply ability to self or teammate
				continue;
			}
			for (let j = 0; j < game.orgs[i].count; j++) {
				if (sqrt(sq(game.orgs[i].cells[j].x - ability.shoot.spore[I].x) + sq(game.orgs[i].cells[j].y - ability.shoot.spore[I].y)) < ability.shoot.secrete[I].radius) { // If center of cell is within circle (subject to change)
					if (game.abilities[i].neutralize.value == true && sqrt(sq(game.orgs[i].cells[j].x - game.abilities[i].neutralize.x) + sq(game.orgs[i].cells[j].y - game.abilities[i].neutralize.y)) <= game.abilities[i].neutralize.radius) { // If center of cell is within neutralize circle
						continue;
					}
					use(I, J, game.orgs[i].player); // Apply ability to target
					ability.shoot.secrete[I].hit = true;
					break;
				}
			}
		}
		
		ability.shoot.secrete[I].value = true; // Value after hit detection so 'grow' hit detection does not run before initial
		socket.emit('Ability', ability);
		ability.shoot.secrete[I].timeout = setTimeout(function() {
			ability.shoot.secrete[I].value = false;
			ability.shoot.secrete[I].end = new Date();
			{ // Copy of 'shoot' timeout
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
	setTimeout(function() {
		ability.tag.end = new Date();
		ability.tag.cooling = true;
	}, ability.tag.time);
}

function extend(playeR) {
	ability.extend.can = false;
	socket.emit('Extend', playeR);
}

function compress(playeR) {
	socket.emit('Compress', playeR);
	ability.compress.can = false; // Redundancy
	ability.compress.start = new Date();
	socket.emit('Ability', ability);
	setTimeout(function() {
		ability.compress.end = new Date();
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
	socket.emit('Freeze', playeR);
	ability.freeze.can = false; // Redundancy
	ability.freeze.start = new Date();
	socket.emit('Ability', ability);
	setTimeout(function() {
		ability.freeze.end = new Date();
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
// 	setTimeout(function() {
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
		ability.spore.interval = function() {
			for (let i = 0; i < ability.spore.count; i++) {
				ability.spore.spores[i].x += ability.spore.spores[i].speed * cos(ability.spore.spores[i].theta);
				ability.spore.spores[i].y += ability.spore.spores[i].speed * sin(ability.spore.spores[i].theta);
			}
			socket.emit('Ability', ability);
		};
		ability.spore.timeout = setTimeout(function() { // End Spore
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
		ability.secrete.timeout = setTimeout(function() { // End Secrete
			ability.secrete.value = false;
			ability.secrete.can = true;
			{ // Copy of spore timeout so spore ends when secrete ends
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
	if (abilitY.spore.value == true) {
		for (let i = 0; i < abilitY.spore.count; i++) {
			let cell = abilitY.spore.spores[i];
			fill(cell.color.r, cell.color.g, cell.color.b);
			noStroke();
			for (let j = 0; j < game.info.count; j++) {
				if (game.orgs[j].player == abilitY.player) {
					if (game.orgs[j].skin == 'circles') {
						ellipse(cell.x, cell.y, cell.width / 2, cell.height / 2);
					} else {
						rect(cell.x, cell.y, cell.width, cell.height);
					}
				}
			}
		}
	}
	for (let i = 0; i < 3; i++) {
		if (abilitY.shoot.value[i] == true) {
			let cell = abilitY.shoot.spore[i];
			fill(cell.color.r, cell.color.g, cell.color.b);
			noStroke();
			for (let j = 0; j < game.info.count; j++) {
				if (game.orgs[j].player == abilitY.player) {
					if (game.orgs[j].skin == 'circles') {
						ellipse(cell.x, cell.y, cell.width / 2 * .8, cell.height / 2 * .8); // .8 (default) size of spore (so as to differentiate between the two)
					} else {
						rect(cell.x, cell.y, cell.width * .8, cell.height * .8);
					}
				}
			}
		}
	}
}

function renderSecretions(abilitY) {
	if (abilitY.secrete.value == true) {
		for (let i = 0; i < abilitY.spore.count; i++) {
			let cell = abilitY.spore.spores[i];
			fill(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
			noStroke();
			ellipse(cell.x, cell.y, abilitY.secrete.radius);
		}
	}
	for (let i = 0; i < 3; i++) {
		if (abilitY.shoot.secrete[i].value == true) {
			let cell = abilitY.shoot.spore[i];
			fill(abilitY.shoot.secrete[i].color.r, abilitY.shoot.secrete[i].color.g, abilitY.shoot.secrete[i].color.b);
			noStroke();
			ellipse(cell.x, cell.y, abilitY.shoot.secrete[i].radius);
		}
	}
}

function renderNeutralize(abilitY) {
	if (abilitY.neutralize.value == true) { // Render neutralize (not toxin) over shoots, spores, and secretes of opponents
		for (let i = 0; i < game.info.count; i++) {
			if (game.orgs[i].player == abilitY.player) {
				let orG = game.orgs[i];
			}
		}
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