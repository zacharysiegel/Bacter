var org;
function spawn(datA) {
	state = 'spawn';
	org = new Org({ player: socket.id, color: datA.color, gridded: datA.gridded });
	ability.player = socket.id;
	socket.emit('Player Joined', { info: game.info, org: org, ability: ability });
};

function spectate(datA) {
	socket.emit('Spectator Joined', game);
	state = 'spectate';
	org = new Org({ player: socket.id, color: datA.color, gridded: datA.gridded });
}

function renderWorld() {
	// Background
	background(game.world.background.r, game.world.background.g, game.world.background.b);
	
	// Border
	noFill() 
	stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
	strokeWeight(game.world.border.weight);
	rect(game.world.width / 2, game.world.height / 2, game.world.width, game.world.height); // World border box

	// Dots
	fill(random(150, 220));
	noStroke();
	for (let i = 0; i < game.world.dots.count; i++) {
		let dot = game.world.dots.array[i];
		// ellipse(dot.x, dot.y, dot.r);
	}

	// Grid
	// for (let i = 0; i < game.world.height / game.world.grid.width; i++) {
	// 	line(0, i * game.world.grid.width + (game.world.height % game.world.grid.width / 2), game.world.width, i * game.world.grid.width + (game.world.height % game.world.grid.width / 2));
	// }
	// for (let i = 0; i < game.world.width / game.world.grid.width; i++) {
	// 	line(i * game.world.grid.width + (game.world.width % game.world.grid.width / 2), 0, i * game.world.grid.width + (game.world.width % game.world.grid.width / 2), game.world.height);
	// }
}

function renderOrgs() {
	for (let i = 0; i < game.info.count; i++) {
		for (let j = 0; j < game.orgs[i].count; j++) {
			fill(game.orgs[i].color.r, game.orgs[i].color.g, game.orgs[i].color.b);
			if (game.orgs[i].gridded == true) {
				stroke(40, 40, 40); // Draw constant grid (natural grid is variable)
				strokeWeight(.25);
			} else if (game.orgs[i].gridded == false) {
				stroke(game.orgs[i].color.r, game.orgs[i].color.g, game.orgs[i].color.b); // Stroke over natural grid
				strokeWeight(1);
			}
			let celL = game.orgs[i].cells[j];
			rect(celL.x, celL.y, celL.width, celL.height);
		}
	}
}

function renderLeaderboard() {
	// Leaderboard
	translate(org.off.x, org.off.y); // Settings for entire board
	rectMode(CORNER);
	game.board.x = width - (game.board.nameWidth + game.board.killWidth + game.board.deathWidth + game.board.ratioWidth) - game.board.marginRight;
	game.board.y = game.board.marginTop;
	noFill();
	stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
	strokeWeight(game.board.tableWeight);
	textSize(game.board.text.size);
	textFont(game.board.text.font);
	fill(game.board.headColor.r, game.board.headColor.g, game.board.headColor.b); // Header
	strokeWeight(game.board.headWeight);
	rect(game.board.x, game.board.y, game.board.nameWidth, game.board.rowHeight); // Names Header
	rect(game.board.x + game.board.nameWidth, game.board.y, game.board.killWidth, game.board.rowHeight); // Kills Header
	rect(game.board.x + game.board.nameWidth + game.board.killWidth, game.board.y, game.board.deathWidth, game.board.rowHeight); // Deaths Header
	rect(game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth, game.board.y, game.board.ratioWidth, game.board.rowHeight); // Ratios Header
	fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b); // Header Text
	noStroke();
	text('Player', game.board.x + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
	text('Kills', game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
	text('Deaths', game.board.x + game.board.nameWidth + game.board.killWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
	text('K:D', game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth + game.board.text.marginLeft, game.board.y + game.board.text.marginTop);
	game.board.count = min(game.board.show, game.board.list.length);
	var a = 0;
	for (let i = 0; i < game.board.count; i++) { // Body
		var spectator = false;
		for (let j = 0; j < game.spectators.length; j++) {
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
		// Cell Boxes
		fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b);
		stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
		strokeWeight(game.board.cellWeight);
		rect(game.board.x, game.board.y + (a + 1) * game.board.rowHeight, game.board.nameWidth, game.board.rowHeight); // Names Body
		fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
		noStroke();
		if (game.board.list[i].player == socket.id) {
			textFont(game.board.text.boldFont);
		} else {
			textFont(game.board.text.font);
		}
		text(game.board.list[i].name, game.board.x + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // Screen name renders under kills box
		fill(game.board.cellColor.r, game.board.cellColor.g, game.board.cellColor.b); // Body
		stroke(game.board.stroke.r, game.board.stroke.g, game.board.stroke.b);
		strokeWeight(game.board.cellWeight);
		rect(game.board.x + game.board.nameWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.killWidth, game.board.rowHeight); // Kills Body
		rect(game.board.x + game.board.nameWidth + game.board.killWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.deathWidth, game.board.rowHeight); // Deaths Body
		rect(game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth, game.board.y + (a + 1) * game.board.rowHeight, game.board.ratioWidth, game.board.rowHeight); // Ratios Body
		// Text
		fill(game.board.text.color.r, game.board.text.color.g, game.board.text.color.b);
		noStroke();
		text(game.board.list[i].kills, game.board.x + game.board.nameWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
		text(game.board.list[i].deaths, game.board.x + game.board.nameWidth + game.board.killWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop);
		game.board.list[i].ratio = game.board.list[i].kills / game.board.list[i].deaths;
		if (game.board.list[i].ratio == Infinity) { // n / 0, n != 0 (Divide by Zero)
			text('∞', game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
		} else if (game.board.list[i].kills == 0 && game.board.list[i].deaths == 0) { // 0 / 0 (Indeterminate Form) (Ratio is NaN)
			text('0', game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
		} else { // n / m, m != 0 (Rational Number)
			text(round(game.board.list[i].ratio * 100) / 100, game.board.x + game.board.nameWidth + game.board.killWidth + game.board.deathWidth + game.board.text.marginLeft, game.board.y + (a + 1) * game.board.rowHeight + game.board.text.marginTop); // K:D Ratio (Rounded to two decimal places)
		}
		a++;
	}
	rectMode(CENTER); // Reset Mode
	translate(-org.off.x, -org.off.y);
}

function orderBoard(lisT) {
	lisT.sort(function(a, b) { // Sorts in descending order of K:D ratio
		let N = b.kills - a.kills; // If a.kills is greater than b.kills, value will be negative, so will sort a before b
		if (N == 0) {
			N = a.deaths - b.deaths; // If b.deaths is greater than a.deaths, value will be positive, so will sort b before a
		}
		return N;
	});
	return lisT;
}

function renderUI() {
	// Crosshair (Art Subject to Change)
	noFill();
	stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
	strokeWeight(1);
	line(org.pos.x - 4, org.pos.y, org.pos.x + 4, org.pos.y);
	line(org.pos.x, org.pos.y - 4, org.pos.x, org.pos.y + 4);

	// Targeting
	if (org.target != undefined) { // If org is targenting a player
		for (let i = 0; i < game.info.count; i++) {
			if (game.orgs[i].player == org.target) { // Find targeted org
				noFill();
				stroke(game.orgs[i].clickbox.color.r, game.orgs[i].clickbox.color.g, game.orgs[i].clickbox.color.b);
				strokeWeight(1);
				rect(game.orgs[i].clickbox.x, game.orgs[i].clickbox.y, game.orgs[i].clickbox.width, game.orgs[i].clickbox.height, 2); // Draw Target Box
				// fill(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b); // Same color as border to maintain contrast with background
				// noStroke();
				// textFont('Helvetica');
				// textSize(18);
				// translate(org.off.x, org.off.y);
				// text('Targeting: ' + game.orgs[i].name, 20, 20 + textSize() * 2 / 3);
				// translate(-org.off.x, -org.off.y);
			}
		}
	}

	// Screen Name Labels
	if (LABELS == true) {
		fill(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b); // Same color as border to maintain contrast with background
		noStroke();
		textFont('Helvetica');
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
					text(game.board.list[j].name, x() - textWidth(game.board.list[j].name) / 2, y() + sqrt(game.orgs[i].count) * CELLWIDTH + 6); // 6 is buffer
				}
			}
		}
	}

	// Ability Cooldowns
	for (let i in ability) {
		if (ability[i].cooling == true) {
			cooldown(ability[i]);
		}
	}

	// Ability Tooltips
	translate(org.off.x, org.off.y);
	var current = new Date();
	for (let i = 0; i < 4; i++) {
		fill(215);
		stroke(0);
		strokeWeight(1);
		rect(center.x - 150 + i * 100, height * 9 / 10 + 30, 24, 38, 0, 0, 4, 4); // Letter background box
		let letter;
		if (i == 0) {
			letter = ABILITYLETTER1;
		} else if (i == 1) {
			letter = ABILITYLETTER2;
		} else if (i == 2) {
			letter = ABILITYLETTER3;
		} else if (i == 3) {
			if (ABILITYLETTER4 == ' ') {
				letter = '_';
			} else {
				letter = ABILITYLETTER4;
			}
		}
		fill(0);
		noStroke();
		textSize(14);
		textFont('Consolas');
		textStyle(BOLD);
		text(letter, center.x - 150 + i * 100 - textWidth(letter) / 2, height  * 9 / 10 + 30 + 13);
		fill(0);
		stroke(0);
		strokeWeight(1);
		ellipse(center.x - 150 + i * 100, height * 9 / 10, 30); // Background ellipse
		for (let j in ability) {
			if (ability[j].i == i) { // Find corresponding ability set to tooltip
				if (ability[j].activated == true) { // Find corresponding activated ability to tooltip
					if (j == 'spore' && ability.secrete.value == true) {
						continue; // Do not draw spore
					}
					if (j == 'secrete' && ability.secrete.value == false) {
						continue; // Do not draw secrete
					}
					fill(215);
					noStroke();
					if (ability[j].j == 0) { // If defensive ability (or spore)
						// Ability
						if (ability[j].value == true) { // If during ability
							arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 - (current - ability[j].start) / ability[j].time * 360); // Ability timeout timer
						} else if (ability[j].value == false && ability[j].can == false) { // If during cooldown
							arc(center.x - 150 + i * 100, height * 9 / 10, 29, 29, -90, -90 + (current - ability[j].end) / ability[j].cooldown * 360); // Ability cooldown timer
						} else if (ability[j].value == false && ability[j].can == true) {
							ellipse(center.x - 150 + i * 100, height * 9 / 10, 29);
						}
					} else if (ability[j].j == 1) { // If offensive ability (or secrete)
						if (ability[j].i < 3) { // If one of first three abilities
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
							if (j != 'toxin') { // No shoot for Toxin
								stroke(0);
								if (ability.shoot.value[i] == false && ability.shoot.can[i] == true) { // Idle
									ellipse(center.x - 150 + i * 100 - 41, height * 9 / 10, 8);
								} else if (ability.shoot.value[i] == true && ability.shoot.can[i] == false) { // Timeout
									arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - (current - ability.shoot.start[i]) / ability.shoot.time * 360); // Ability timeout timer
								} else if (ability.shoot.secrete[i].value == true) { // Secrete
									arc(center.x - 150 + i * 100 - 41, height * 9 / 10, 8, 8, -90, -90 - ((ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360) + (current - ability.shoot.secrete[i].start) / ability.shoot.secrete[i].time * ((ability.shoot.end[i] - ability.shoot.start[i]) / ability.shoot.time * 360)); // Ability cooldown timer
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
			}
		}
	}
	translate(-org.off.x, -org.off.y);
}

function move() {
	if (keyIsDown(65) || keyIsDown(37) || keyIsDown(87) || keyIsDown(38) || keyIsDown(68) || keyIsDown(39) || keyIsDown(83) || keyIsDown(40)) { // If a directional key
		if ((keyIsDown(65) || keyIsDown(37)) && (keyIsDown(87) || keyIsDown(38))) { // Left + Up
			if (org.pos.x - org.speed > 0) { // Stay inside world
				org.pos.x -= org.speed * cos45;
			}
			if (org.pos.y - org.speed > 0) {
				org.pos.y -= org.speed * cos45;
			}
		} else if ((keyIsDown(68) || keyIsDown(39)) && (keyIsDown(87) || keyIsDown(38))) { // Right + Up
			if (org.pos.x + org.speed < game.world.width) {
				org.pos.x += org.speed * cos45;
			}
			if (org.pos.y - org.speed > 0) {
				org.pos.y -= org.speed * cos45;
			}
		} else if ((keyIsDown(68) || keyIsDown(39)) && (keyIsDown(83) || keyIsDown(40))) { // Right + Down
			if (org.pos.x + org.speed < game.world.width) {
				org.pos.x += org.speed * cos45;
			}
			if (org.pos.y + org.speed < game.world.height) {
				org.pos.y += org.speed * cos45;
			}
		} else if ((keyIsDown(65) || keyIsDown(37)) && (keyIsDown(83) || keyIsDown(40))) { // Left + Down
			if (org.pos.x - org.speed > 0) {
				org.pos.x -= org.speed * cos45;
			}
			if (org.pos.y + org.speed < game.world.height) {
				org.pos.y += org.speed * cos45;
			}
		} else if (keyIsDown(65) || keyIsDown(37)) { // A or LEFT_ARROW
			if (org.pos.x - org.speed > 0) { // Stay inside world
				org.pos.x -= org.speed; // Move the position org.speed pixels in the indicated direction
			}
		} else if (keyIsDown(87) || keyIsDown(38)) { // W or UP_ARROW
			if (org.pos.y - org.speed > 0) {
				org.pos.y -= org.speed;
			}
		} else if (keyIsDown(68) || keyIsDown(39)) { // D or RIGHT_ARROW
			if (org.pos.x + org.speed < game.world.width) {
				org.pos.x += org.speed;
			}
		} else if (keyIsDown(83) || keyIsDown(40)) { // S or DOWN_ARROW
			if (org.pos.y + org.speed < game.world.height) {
				org.pos.y += org.speed;
			}
		}
		org.off.x = org.pos.x - center.x;
		org.off.y = org.pos.y - center.y;
	}
}

function grow() {
	state = 'game';
	if (org.alive == false) {
		org.alive = true;
		org.interval = setInterval(function() {
			var regions = getRegionInfo(org);
			// Birth
			if (ability.freeze.value == false) { // If org is not Frozen (cannot birth or die naturally)
				// for (let a = 0; a < ability.stimulate.factor; a++) { // Multiply runs by factor of stimulate OLD
					// if (ability.poison.value == true) {
					// 	if (random(0, ability.poison.factor) >= 1) { // Divide runs by factor of poison (Runs 1 / factor)
					// 		continue;
					// 	}
					// }
				for (let i = 0; i < regions.adjacent.length; i++) { // Only Adjacent Regions Can Produce New Cells
					// Don't birth new cell outside world boundary
					if (regions.adjacent[i].x - CELLWIDTH / 2 <= 0 || regions.adjacent[i].x + CELLWIDTH / 2 >= game.world.width || regions.adjacent[i].y - CELLWIDTH / 2 <= 0 || regions.adjacent[i].y + CELLWIDTH / 2 >= game.world.height) { // If new cell would be outside world boundary
						continue;
					}

					// Don't birth new cell on top of an opponent org
					var overlap = false;
					for (let j = 0; j < game.info.count; j++) {
						if (game.orgs[j].player == org.player) { // If org is player's org
							continue;
						}
						for (let k = 0; k < game.orgs[j].count; k++) {
							if (regions.adjacent[i].x + CELLWIDTH / 2 >= game.orgs[j].cells[k].x - CELLWIDTH / 2 && regions.adjacent[i].x + CELLWIDTH / 2 <= game.orgs[j].cells[k].x + CELLWIDTH / 2) { // If right side collides
								if (regions.adjacent[i].y + CELLWIDTH / 2 >= game.orgs[j].cells[k].y - CELLWIDTH / 2 && regions.adjacent[i].y + CELLWIDTH / 2 <= game.orgs[j].cells[k].y + CELLWIDTH / 2) { // If bottom side collides
									overlap = true;
								} else if (regions.adjacent[i].y - CELLWIDTH / 2 >= game.orgs[j].cells[k].y - CELLWIDTH / 2 && regions.adjacent[i].y - CELLWIDTH / 2 <= game.orgs[j].cells[k].y + CELLWIDTH / 2) { // If top side collides
									overlap = true;
								}
							} else if (regions.adjacent[i].x - CELLWIDTH / 2 >= game.orgs[j].cells[k].x - CELLWIDTH / 2 && regions.adjacent[i].x - CELLWIDTH / 2 <= game.orgs[j].cells[k].x + CELLWIDTH / 2) { // If left side collides
								if (regions.adjacent[i].y + CELLWIDTH / 2 >= game.orgs[j].cells[k].y - CELLWIDTH / 2 && regions.adjacent[i].y + CELLWIDTH / 2 <= game.orgs[j].cells[k].y + CELLWIDTH / 2) { // If bottom side collides
									overlap = true;
								} else if (regions.adjacent[i].y - CELLWIDTH / 2 >= game.orgs[j].cells[k].y - CELLWIDTH / 2 && regions.adjacent[i].y - CELLWIDTH / 2 <= game.orgs[j].cells[k].y + CELLWIDTH / 2) { // If top side collides
									overlap = true;
								}
							}
						}
					}
					if (overlap == true) {
						continue;
					}

					// Birth new cell accordingly
					let chance = org.coefficient * Math.log(sqrt(sq(regions.adjacent[i].x - org.pos.x) + sq(regions.adjacent[i].y - org.pos.y)) + 1) + 100; // -27.5(ln(r + 1)) + 100
					if (random(0, 100) <= chance) {
						var repeat = false;
						for (let j = 0; j < org.count; j++) {
							if (regions.adjacent[i].x == org.cells[j].x && regions.adjacent[i].y == org.cells[j].y) {
								repeat = true;
								break;
							}
						}
						if (repeat == false) {
							org.cells.push(new Cell(regions.adjacent[i].x, regions.adjacent[i].y, org));
							org.count++;
						}
					}
				}
				// if (ability.stimulate.value == false) { // If org is not being stimulated
				// 	break; // Run only once
				// }
				// }
			}

			// Natural Death
			if (ability.freeze.value == false) { // If org is not Frozen (cannot birth or die naturally)
				if (ability.immortality.value == false) { // If org is not Immortal
					for (let i = 0; i < regions.exposed.length; i++) { // Only Exposed Cells Can Die
						if (regions.exposed[i].d(org) > org.range) { // If exposed cell is outside maximum radius
							for (let j = 0; j < org.count; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) { // Find exposed cell within org cells array
									org.cells.splice(j, 1);
									org.count--;
									regions.exposed.splice(i, 1);
									i--;
									j--;
									break;
								}
							}
							continue;
						} else if (regions.exposed[i].x < 0 || regions.exposed[i].x > game.world.width || regions.exposed[i].y < 0 || regions.exposed[i].y > game.world.height) {
							for (let j = 0; j < org.ocunt; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) {
									org.cells.splice(j, 1);
									org.count--;
									regions.exposed.splice(i, 1);
									i--;
									j--;
									break;
								}
							}
						}
						let chance = org.coefficient * Math.log(-regions.exposed[i].d(org) + (org.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
						if (random(0, 100) <= chance) {
							for (let j = 0; j < org.count; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) {
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
					// for (let i = 0; i < org.count; i++) { // Any Cell Can Die (Not Updated)
					// 	if (regions.exposed[i].d(org) > 50) {
					// 		for (let j = 0; j < org.count; j++) {
					// 			if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) {
					// 				org.cells.splice(j, 1);
					// 				org.count--;
					// 				regions.exposed.splice(i, 1);
					// 				i--;
					// 				break;
					// 			}
					// 		}
					// 		continue;
					// 	}
					// 	let chance = -27.5 * Math.log(-org.cells[i].d(org) + 51) + 100; // -27.5(ln(-(r - 51))) + 100
					// 	if (random(0, 100) <= chance) {
					// 		org.cells.splice(i, 1);
					// 		org.count--;
					// 	}
					// }
				}
			}

			// Targeting
			org.clickbox.left = org.x();
			org.clickbox.right = org.clickbox.left;
			org.clickbox.top = org.y();
			org.clickbox.bottom = org.clickbox.top;
			for (let i = 0; i < org.count; i++) { // Set the size of clickbox
				if (org.cells[i].x - org.cells[i].width / 2 < org.clickbox.left) {
					org.clickbox.left = org.cells[i].x - org.cells[i].width / 2;
				}
				if (org.cells[i].x + org.cells[i].width / 2 > org.clickbox.right) {
					org.clickbox.right = org.cells[i].x + org.cells[i].width / 2;
				}
				if (org.cells[i].y - org.cells[i].height / 2 < org.clickbox.top) {
					org.clickbox.top = org.cells[i].y - org.cells[i].height / 2;
				}
				if (org.cells[i].y + org.cells[i].height / 2 > org.clickbox.bottom) {
					org.clickbox.bottom = org.cells[i].y + org.cells[i].height / 2;
				}
			}
			org.clickbox.left -= org.clickbox.buffer;
			org.clickbox.right += org.clickbox.buffer;
			org.clickbox.top -= org.clickbox.buffer;
			org.clickbox.bottom += org.clickbox.buffer;
			org.clickbox.width = org.clickbox.right - org.clickbox.left;
			org.clickbox.height = org.clickbox.bottom - org.clickbox.top;
			org.clickbox.x = org.clickbox.left + org.clickbox.width / 2;
			org.clickbox.y = org.clickbox.top + org.clickbox.height / 2;

			// Abilities
			for (let i = 0; i < game.info.count; i++) {
				if (game.abilities[i].secrete.value == true) { // Secrete (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact)
					for (let j = 0; j < org.count; j++) {
						for (let k = 0; k < game.abilities[i].spore.count; k++) {
							if (sqrt(sq(org.cells[j].x - game.abilities[i].spore.spores[k].x) + sq(org.cells[j].y - game.abilities[i].spore.spores[k].y)) <= game.abilities[i].secrete.radius) { // If center of cell is within secrete circle (subject to change)
								let skip = false;
								for (let l = 0; l < game.info.count; l++) {
									if (game.abilities[l].neutralize.value == true && sqrt(sq(org.cells[j].x - game.abilities[l].neutralize.x) + sq(org.cells[j].y - game.abilities[l].neutralize.y)) <= game.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
										skip = true;
										break;
									}
								}
								if (skip == true) {
									continue; // Acid is ineffectual when neutralized
								}
								org.cells.splice(j, 1);
								org.count--;
								j--;
								org.hit = game.abilities[i].player;
								break;
							}
						}
					}
				}
				for (let j = 0; j < 3; j++) { // Shoot secretion (placed in grow interval so cells will be killed on any overlap with secretion, not just initial impact) (Shoot secretion is smaller than spore secretion)
					if (game.abilities[i].shoot.secrete[j].value == true) {
						for (let k = 0; k < org.count; k++) {
							if (sqrt(sq(org.cells[k].x - game.abilities[i].shoot.spore[j].x) + sq(org.cells[k].y - game.abilities[i].shoot.spore[j].y)) <= game.abilities[i].shoot.secrete[j].radius) { // If center of cell is within shoot circle (subject to change)
								let skip = false;
								for (let l = 0; l < game.info.count; l++) {
									if (game.abilities[l].neutralize.value == true && sqrt(sq(org.cells[j].x - game.abilities[l].neutralize.x) + sq(org.cells[j].y - game.abilities[l].neutralize.y)) <= game.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
										skip = true;
										break;
									}
								}
								if (skip == true) {
									continue; // Acid is ineffectual when neutralized
								}
								org.cells.splice(k, 1);
								org.count--;
								k--;
								org.hit = game.abilities[i].player;
								// break; // Break causes cells to die one at a time (not default)
							}
						}
					}
				}
				if (game.abilities[i].toxin.value == true) { // Toxin
					for (let j = 0; j < org.count; j++) {
						if (org.player == game.abilities[i].player) { // If is own org's toxin
							continue; // Do not kill own cells
						}
						if (sqrt(sq(org.cells[j].x - game.abilities[i].toxin.x) + sq(org.cells[j].y - game.abilities[i].toxin.y)) <= game.abilities[i].toxin.radius) { // If center of cell is within toxin circle
							let skip = false;
							for (let l = 0; l < game.info.count; l++) {
								if (game.abilities[l].neutralize.value == true && sqrt(sq(org.cells[j].x - game.abilities[l].neutralize.x) + sq(org.cells[j].y - game.abilities[l].neutralize.y)) <= game.abilities[l].neutralize.radius) { // If center of cell is within neutralize circle
									skip = true;
									break;
								}
							}
							if (skip == true) {
								continue; // Acid is ineffectual when neutralized
							}
							org.cells.splice(j, 1); // Kill cell
							org.count--;
							j--;
							org.hit = game.abilities[i].player;
							// break; // Break causes cells to die one at a time (not default)
						}
					}
				}
			}

			// Dots
			// for (let i = 0; i < game.world.dots.count; i++) {
			// 	let dot = game.world.dots.array[i];
			// 	let broken = false;
			// 	for (let j = 0; j < org.count; j++) {
			// 		let cell = org.cells[j];
			// 		if (dot.x >= cell.x - cell.width / 2 && dot.x <= cell.x + cell.width / 2 && dot.y >= cell.y - cell.height / 2 && dot.y <= cell.y + cell.height / 2) {
			// 			let doT = {
			// 				i: dot.i, 
			// 				r: random(game.world.dots.r.min, game.world.dots.r.max), 
			// 				x: random(0, game.world.width), 
			// 				y: random(0, game.world.height)
			// 			};
			// 			game.world.dots.array.splice(dot.i, 1, doT); // Replace eaten dot with new random doT
			// 			socket.emit('World', game.world);
			// 			broken = true;
			// 			break;
			// 		}
			// 	}
			// 	if (broken == true) {
			// 		break;
			// 	}
			// }

			if (org.count == 0) {
				if (org.hit != org.player) { // Cannot gain kill for suicide
					for (let i = 0; i < game.info.count; i++) {
						if (game.board.list[i].player == org.hit) { // Find killer in leaderboard list
							game.board.list[i].kills++;
							orderBoard(game.board.list);
							socket.emit('Board', game.board);
							break;
						}
					}
				}
				org.alive = false;
			}
			socket.emit('Org', org);
			if (org.alive == false) { // Organism is dead
				gameOver();
			}
		}, 80);
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

function gameOver() {
	socket.emit('Dead');
	clearInterval(org.interval);
	for (let i in ability) { // Reset Ability Cooldowns
		if (ability[i].i != undefined) { // If is a usable ability
			clearTimeout(ability[i].timeout);
			ability[i].value = false;
			ability[i].can = true;
			ability[i].cooling = false;
			ability[i].start = undefined;
			ability[i].end = undefined;
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
	for (let i = 0; i < game.board.list.length; i++) {
		if (game.board.list[i].player == socket.id) { // Find player in leaderboard
			game.board.list[i].deaths++; // Add 1 to deaths counter
			orderBoard(game.board.list); // Sort the list by kills then deaths
			socket.emit('Board', game.board); // Send updated board to server
			break;
		}
	}
	alert('Press \'' + RESPAWNLETTER + '\' to Respawn');
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
	if (keyCode == ABILITYKEY1) { // X by default
		if (state == 'game' && org.alive == true) {
			if (ability.extend.activated == true && ability.extend.can == true) {
				extend(org.player); // Extend self
			} else if (ability.compress.activated == true && ability.compress.can == true) {
				shoot(0, 1);
				// for (let i = 0; i < game.info.count; i++) {
				// 	if (org.target == game.players[i]) { // Find targeted org
				// 		compress(org.target); // Compress targetec org
				// 		break;
				// 	}
				// }
			}
			// if (ability.speed.activated == true) { (Not updated)
			// 	speed(org.player);
			// } else if (ability.slow.activated == true) {
			// 	slow(org.target);
			// }
		}
	} else if (keyCode == ABILITYKEY2) { // C by default
		if (state == 'game' && org.alive == true) {
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
	} else if (keyCode == ABILITYKEY3) { // V by default
		if (state == 'game' && org.alive == true) {
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
	} else if (keyCode == ABILITYKEY4) { // SPACE by default
		if (state == 'game' && org.alive == true) {
			if (ability.spore.value == false && ability.secrete.value == false) {
				spore();
			} else if (ability.spore.value == true && ability.secrete.value == false) {
				secrete();
			}
		}
	} else if (keyCode == RESPAWNKEY) { // R by default
		if (state == 'spectate' && org.alive == false) {
			if (game.players.length < game.info.cap) {
				socket.emit('Spectator Left', game);
				renderMenu('respawn', game);
			} else {
				alert('Game is at maximum player capacity');
			}
		}
	}
	// Hard numbers are separate from variable codes in case of overlap
	if (keyCode == 32) { // SPACE
		// if (state == 'chooseAbilities') {
		// 	let pick = [ false, false, false ];
		// 	for (let i = 0; i < 3; i++) {
		// 		for (let j = 0; j < 2; j++) {
		// 			for (let k in ability) {
		// 				if (ability[k].i == i) {
		// 					if (ability[k].j == j && ability[k].activated == true) {
		// 						pick[i] = true;
		// 						break;
		// 					}
		// 				}
		// 			}
		// 			if (pick[i] == true) { // If i dual ability already picked
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	if (pick.indexOf(false) == -1) {
		// 		if (org.count == 0) {
		// 			org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
		// 			org.count++;
		// 		}
		// 		grow(); // Begin growth
		// 	}
		// }
	} else if (keyCode == 13) { // ENTER
		if (state == 'createMenu') {
			menus.create.submit();
		} else if (state == 'joinMenu') {
			menus.join.submit(game);
		} else if (state == 'spectateMenu') {
			menus.spectate.submit(game);
		} else if (state == 'respawnMenu') {
			menus.respawn.submit(game);
		} else if (state == 'pauseMenu') {
			menus.pause.submit(game);
		}
	} else if (keyCode == 27) { // ESC
		if (state == 'game') {
			renderMenu('pauseGame', game);
		} else if (state == 'spectate') {
			renderMenu('pauseSpectate', game);
		}
	}
}

function mouseClicked() {
	if (mouseButton == LEFT) {
		if (state == 'game') {
			{ // Targeting
				org.target = undefined; // Clear target if click not on opponent org
				for (let i = 0; i < game.info.count; i++) {
					if (game.orgs[i].player == org.player) { // If org is player's org
						continue; // Cannot target oneself
					}
					if (mouseX + org.off.x >= game.orgs[i].clickbox.left && mouseX + org.off.x <= game.orgs[i].clickbox.right && mouseY + org.off.y >= game.orgs[i].clickbox.top && mouseY + org.off.y <= game.orgs[i].clickbox.bottom) { // If clicked another org
						org.target = game.orgs[i].player;
						break;
					}
				}
			}
		}
		// if (state == 'chooseAbilities') {
		// 	for (let i = 0; i < 3; i++) { // Ability Selection
		// 		for (let j = 0; j < 2; j++) {
		// 			if (mouseX >= width / 4 * (i + 1) - ability.choose.width / 2 && mouseX <= width / 4 * (i + 1) + ability.choose.width / 2 && mouseY >= height / 3 * (j + 1) - height / 30 - ability.choose.height / 2 && mouseY <= height / 3 * (j + 1) - height / 30 + ability.choose.height / 2) { // If clicks on a box
		// 				for (let k in ability) {
		// 					if (ability[k].i == i && ability[k].j == j) { // Find clicked ability
		// 						if (ability[k].activated == false) {
		// 							ability[k].activated = true; // Activate ability if it was deactivated
		// 							ability[k].can = true;
		// 							for (let l in ability) {
		// 								if (ability[l].i == ability[k].i && ability[l].j != ability[k].j) {
		// 									ability[l].activated = false; // Deactivate ability pair when other is activated
		// 									ability[l].can = false;
		// 								}
		// 							}
		// 						} else if (ability[k].activated == true) {
		// 							ability[k].activated = false; // Deactivate ability if it was activated
		// 							ability[k].can = false;
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	chooseAbilities();
		// 	if (mouseX >= center.x - width / 9 / 2 && mouseX <= center.x + width / 9 / 2 && mouseY >= height * 8 / 9 - height / 20 / 2 && mouseY <= height * 8 / 9 + height / 20 / 2) { // If clicked spawn box
		// 		let pick = [ false, false, false ];
		// 		for (let i = 0; i < 3; i++) {
		// 			for (let j = 0; j < 2; j++) {
		// 				for (let k in ability) {
		// 					if (ability[k].i == i) {
		// 						if (ability[k].j == j && ability[k].activated == true) {
		// 							pick[i] = true;
		// 							break;
		// 						}
		// 					}
		// 				}
		// 				if (pick[i] == true) { // If i dual ability already picked
		// 					break;
		// 				}
		// 			}
		// 		}
		// 		if (pick.indexOf(false) == -1) { // Cannot spawn if an ability is not yet picked
		// 			if (org.count == 0) {
		// 				org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
		// 				org.count++;
		// 			}
		// 			grow(); // Begin growth
		// 		}
		// 	}
		return false;
	} else if (mouseButton == RIGHT) {
		return false;
	} else if (mouseButton == CENTER) {
		return false;
	}
}