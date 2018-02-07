var org;
function spawn() {
	state = 'spawn';
	org = new Org(socket.id);
	ability.player = socket.id;
	socket.emit('Player Joined', { info: game.info, org: org, ability: ability });
};

function spectate() {
	socket.emit('Spectator Joined', game);
	state = 'spectate';
	org = new Org(socket.id);
}

function renderWorld() {
	// Background
	background(game.world.background.r, game.world.background.g, game.world.background.b);
	
	// Border
	fill(game.world.background.r, game.world.background.g, game.world.background.b);
	stroke(255);
	strokeWeight(1);
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
			stroke(game.orgs[i].color.r, game.orgs[i].color.g, game.orgs[i].color.b);
			strokeWeight(1);
			let celL = game.orgs[i].cells[j];
			rect(celL.x, celL.y, celL.width, celL.height);
		}
	}
}

function renderUI() {
	// Crosshair (Art Subject to Change)
	noFill();
	stroke(255);
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
				rect(game.orgs[i].clickbox.x, game.orgs[i].clickbox.y, game.orgs[i].clickbox.width, game.orgs[i].clickbox.height, 2);
			}
		}
	}

	// Ability Cooldowns
	for (let i in ability) {
		if (ability[i].cooling == true) {
			cooldown(ability[i]);
		}
	}

	translate(org.off.x, org.off.y);

	// Leaderboard
	fill(240);
	noStroke();

	// Ability Tooltips
	var current = new Date();
	for (let i = 0; i < 4; i++) {
		fill(215);
		stroke(0);
		strokeWeight(2);
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
		strokeWeight(2);
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

function orderBoard(lisT) {
	lisT.sort(function(a, b) { // Sorts in descending order of K:D ratio
		(b.kills / b.deaths) - (a.kills / a.deaths); // If K/D of a is greater than that of b, value will be negative, so will sort array with a before b
	});
	return lisT;
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
			if (ability.stunt.value == false) { // If org is not Stunted (cannot birth or die naturally)
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

			// Death
			if (ability.stunt.value == false) { // If org is not stunted (cannot birth or die naturally)
				if (ability.immortality.value == false) { // If org is not Immortal
					for (let i = 0; i < regions.exposed.length; i++) { // Only Exposed Cells Can Die
						if (regions.exposed[i].d(org) > org.range) {
							for (let j = 0; j < org.count; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) {
									org.cells.splice(j, 1);
									org.count--;
									regions.exposed.splice(i, 1);
									i--;
									break;
								}
							}
							continue;
						}
						let chance = org.coefficient * Math.log(-regions.exposed[i].d(org) + (org.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
						if (random(0, 100) <= chance) {
							for (let j = 0; j < org.count; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) {
									org.cells.splice(j, 1);
									org.count--;
									regions.exposed.splice(i, 1);
									i--;
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
								for (let k = 0; k < game.info.count; k++) {
									if (game.board.list[k].player == game.abilities[i].player) {
										game.board.list[k].kills++;
									}
								}
								break;
							}
							// Break causes cells to die one at a time (not default) (more complicated to implement here)
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
								for (let l = 0; l < game.info.count; l++) {
									if (game.board.list[l].player == abilities[i].player) {
										game.board.list[l].kills++;
									}
								}
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
							for (let k = 0; k < game.info.count; k++) {
								if (game.board.list[k].player == abilities[i].player) {
									game.board.list[k].kills++;
								}
							}
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
				org.alive = false;
			}
			if (org.alive == false) { // Organism is dead
				gameOver();
			} else { // Organism is alive
				if (org.count == 0) {
					console.error('Dead org sent');
				}
				socket.emit('Org', org);
			}
		}, 100);
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
	for (let i = 0; i < 3; i++) { // Reset shoot
		clearTimeout(ability.shoot.timeout[i]);
		ability.shoot.value[i] = false;
		ability.shoot.can[i] = true;
		ability.shoot.spore[i] = undefined;
		ability.shoot.secrete[i] = {};
		ability.shoot.start[i] = undefined;
		ability.shoot.end[i] = undefined;
	}
	socket.emit('Ability', ability);
	socket.emit('Dead');
	for (let i = 0; i < game.info.count; i++) {
		if (game.board.list[i].player == socket.id) { // Find player in leaderboard
			game.board.list[i].deaths++; // Add 1 to deaths counter
		}
	}
	alert('Press \'R\' to Respawn');
	// let respawn = confirm('Respawn? (Press \'R\' to Respawn Later)');
	// if (respawn == true) {
	// 	if (state == 'game' && org.alive == false) {
	// 		spawn();
	// 	}
	// }
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
		case 82: // R
			if (state == 'spectate' && org.alive == false) {
				socket.emit('Spectator Spawned', game);
				spawn();
			}
			break;
		case ABILITYKEY1: // X by default
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
			break;
		case ABILITYKEY2: // C by default
			if (state == 'game' && org.alive == true) {
				if (ability.immortality.activated == true && ability.immortality.can == true) {
					immortality(org.player); // Immortalize self
				} else if (ability.stunt.activated == true && ability.stunt.can == true) {
					shoot(1, 1);
					// for (let i = 0; i < game.info.count; i++) {
					// 	if (org.target == game.players[i]) { // Find targeted org
					// 		stunt(org.target); // Stunt targeted org
					// 		break;
					// 	}
					// }
				}
				break;
			}
		case ABILITYKEY3: // V by default
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
				break;
			}
		case ABILITYKEY4: // SPACE by default
			if (state == 'game' && org.alive == true) {
				if (ability.spore.value == false && ability.secrete.value == false) {
					spore();
				} else if (ability.spore.value == true && ability.secrete.value == false) {
					secrete();
				}
				break;
			}
	}
}

function mouseClicked() {
	if (mouseButton == LEFT) {
		if (state == 'chooseAbilities') {
			for (let i = 0; i < 3; i++) { // Ability Selection
				for (let j = 0; j < 2; j++) {
					if (mouseX >= width / 4 * (i + 1) - ability.choose.width / 2 && mouseX <= width / 4 * (i + 1) + ability.choose.width / 2 && mouseY >= height / 3 * (j + 1) - height / 30 - ability.choose.height / 2 && mouseY <= height / 3 * (j + 1) - height / 30 + ability.choose.height / 2) { // If clicks on a box
						for (let k in ability) {
							if (ability[k].i == i && ability[k].j == j) { // Find clicked ability
								if (ability[k].activated == false) {
									ability[k].activated = true; // Activate ability if it was deactivated
									ability[k].can = true;
									for (let l in ability) {
										if (ability[l].i == ability[k].i && ability[l].j != ability[k].j) {
											ability[l].activated = false; // Deactivate ability pair when other is activated
											ability[l].can = false;
										}
									}
								} else if (ability[k].activated == true) {
									ability[k].activated = false; // Deactivate ability if it was activated
									ability[k].can = false;
								}
							}
						}
					}
				}
			}
			chooseAbilities();
			if (mouseX >= center.x - width / 9 / 2 && mouseX <= center.x + width / 9 / 2 && mouseY >= height * 8 / 9 - height / 20 / 2 && mouseY <= height * 8 / 9 + height / 20 / 2) { // If clicked spawn box
				if (org.count == 0) {
					org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
					org.count++;
				}
				grow(); // Begin growth
			}
		} else if (state == 'game') {
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
		return false;
	} else if (mouseButton == RIGHT) {
		return false;
	} else if (mouseButton == CENTER) {
		return false;
	}
}