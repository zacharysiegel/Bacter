var ability = {
	index: undefined, 
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
		time: 5000, 
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
		time: 5000, 
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
		time: 3000, 
		cooldown: 6000
	}, 
	stunt: {
		value: false, 
		activated: false, 
		can: false, 
		i: 1, 
		j: 1, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		cooling: false, 
		time: 3000, 
		cooldown: 6000
	}, 
	stimulate: {
		value: false, 
		activated: false, 
		can: false, 
		i: 2, 
		j: 0, 
		factor: 4, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		cooling: false, 
		time: 3000, 
		cooldown: 5000
	}, 
	poison: {
		value: false, 
		activated: false, 
		can: false, 
		i: 2, 
		j: 1, 
		factor: 4, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		cooling: false, 
		time: 3000, 
		cooldown: 5000
	}, 
	spore: {
		value: false, 
		activated: true, 
		i: 3, 
		j: 0, 
		interval: undefined, 
		speed: 12, 
		spores: [], 
		count: 0, 
		can: true, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		cooling: false, 
		time: 2500, 
		cooldown: 7000
	}, 
	secrete: {
		value: false, 
		activated: true, 
		i: 3, 
		j: 1, 
		color: { r: undefined, g: undefined, b: undefined }, 
		radius: CELLWIDTH / cos45 * 5 / 2, 
		can: false, 
		timeout: undefined, 
		start: undefined, 
		end: undefined, 
		time: 1500
	}
};

function chooseAbilities() {
	state = 'chooseAbilities';
	clear();
	textSize(30);
	textFont('Verdana');
	textStyle(NORMAL);
	fill(0);
	noStroke();
	rect(center.x, height / 30, textWidth('Choose Three Abilities') * 4 / 3, height / 15, 0, 0, 15, 15); // Choose Abilities Box
	fill(255);
	noStroke();
	text('Choose Three Abilities', center.x - textWidth('Choose Three Abilities') / 2, height / 24); // Choose Abilities Text
	ability.choose.width = width / 5;
	ability.choose.height = height / 3.5;
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 2; j++) {
			for (let k in ability) {
				if (ability[k].i == i && ability[k].j == j) {
					if (ability[k].activated == false) {
						fill(ability.choose.color.deselected.r, ability.choose.color.deselected.g, ability.choose.color.deselected.b);
					} else if (ability[k].activated == true) {
						fill(ability.choose.color.selected.r, ability.choose.color.selected.g, ability.choose.color.selected.b);
					}
				}
			}
			stroke(0);
			strokeWeight(1);
			rect(width / 4 * (i + 1), height / 3 * (j + 1) - height / 30, ability.choose.width, ability.choose.height, 5); // Draw ability selection box
			for (let k in ability) {
				if (ability[k].i == i && ability[k].j == j) {
					fill(0);
					noStroke();
					textSize(24);
					textFont('Verdana');
					text(k[0].toUpperCase() + k.slice(1), width / 4 * (i + 1) - textWidth(k) / 2, height / 3 * (j + 1) - height / 30); // Write ability name
				}
			}
		}
	}
	noFill();
	stroke(0);
	strokeWeight(1);
	rect(center.x, height * 8 / 9, width / 9, height / 20, 6); // Spawn click box
	fill(0);
	noStroke();
	textSize(20);
	textFont('Verdana');
	text('Spawn', center.x - textWidth('Spawn') / 2, height * 8 / 9 + textSize() / 3); // Spawn Text
}

function extend(playeR) {
	socket.emit('Extend', playeR);
}

function compress(playeR) {
	socket.emit('Compress', playeR);
	ability.compress.can = false;
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
	socket.emit('Immortality', playeR);
}

function stunt(playeR) {
	socket.emit('Stunt', playeR);
	ability.stunt.can = false;
	ability.stunt.start = new Date();
	socket.emit('Ability', ability);
	setTimeout(function() {
		ability.stunt.end = new Date();
		ability.stunt.cooling = true;
	}, ability.stunt.time);
}

function stimulate(playeR) {
	socket.emit('Stimulate', playeR);
}

function poison(playeR) {
	socket.emit('Poison', playeR);
	ability.poison.can = false;
	ability.poison.start = new Date();
	socket.emit('Ability', ability);
	setTimeout(function() {
		ability.poison.end = new Date();
		ability.poison.cooling = true;
	}, ability.poison.time);
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
		ability.spore.interval = setInterval(function() {
			for (let i = 0; i < ability.spore.count; i++) {
				ability.spore.spores[i].x += ability.spore.spores[i].speed * cos(ability.spore.spores[i].theta);
				ability.spore.spores[i].y += ability.spore.spores[i].speed * sin(ability.spore.spores[i].theta);
				socket.emit('Ability', ability);
			}
		}, 80);
		ability.spore.timeout = setTimeout(function() { // End Spore
			if (ability.spore.value == true && ability.secrete.value == false) { // If secrete() has not been called
				clearInterval(ability.spore.interval); // Clear interval
				ability.spore.interval = undefined;
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
		clearInterval(ability.spore.interval);
		clearTimeout(ability.secrete.timeout);
		ability.secrete.start = new Date();
		ability.secrete.color = org.color;
		socket.emit('Ability', ability);
		ability.secrete.timeout = setTimeout(function() { // End Secrete
			ability.secrete.value = false;
			ability.secrete.can = true;
			{ // Copy of spore timeout so spore ends when secrete ends
				clearInterval(ability.spore.interval); // Clear interval
				ability.spore.interval = undefined;
				ability.spore.spores = []; // Clear spores array
				ability.spore.end = new Date();
				ability.spore.cooling = true;
			}
			ability.secrete.end = new Date();
			socket.emit('Ability', ability);
		}, ability.secrete.time);
	}
}

function renderAbilities(abilitY) {
	if (abilitY.spore.value == true || abilitY.secrete.value == true) {
		for (let i = 0; i < abilitY.spore.count; i++) {
			let celL = abilitY.spore.spores[i];
			if (abilitY.spore.value == true) {
				fill(abilitY.spore.spores[i].color.r, abilitY.spore.spores[i].color.g, abilitY.spore.spores[i].color.b);
				noStroke();
				rect(celL.x, celL.y, celL.width, celL.height);
			} else if (abilitY.secrete.value == true) {
				fill(abilitY.secrete.color.r, abilitY.secrete.color.g, abilitY.secrete.color.b);
				noStroke();
				ellipse(celL.x, celL.y, abilitY.secrete.radius);
			}
		}
	}
}

function cooldown(abilitY) {
	if (abilitY.cooling == true) { // If abilitY is cooling down
		let current = new Date(); // Get current time
		if (current - abilitY.end >= abilitY.cooldown) { // If cooldown has passed
			abilitY.can = true; // Re-enable abilitY
			abilitY.cooling = false;
			socket.emit('Ability', ability); // Update server
		}
	}
}