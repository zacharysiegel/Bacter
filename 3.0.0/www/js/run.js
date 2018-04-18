function spawn(datA) {
	state = 'spawn';
	org = new Org({ player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, spectate: false });
	org.cells[0] = new Cell(org.pos.x, org.pos.y, org); // Create first cell in org
	org.count++;
	ability.player = socket.id;
	socket.emit('Player Joined', { info: game.info, org: org, ability: ability });
};

function spectate(datA) {
	state = 'spectate';
	socket.emit('Spectator Joined', game);
	org = new Org({ player: socket.id, color: datA.color, skin: datA.skin, team: datA.team, pos: datA.pos, spectate: true });
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
	if (Labels == true) {
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
	for (let i in ability) { // Regular Cooldowns
		if (ability[i].cooling == true) {
			cooldown(ability[i]);
		}
	}
	for (let i = 0; i < ability.shoot.value.length; i++) { // Shoot Cooldown
		if (ability.shoot.cooling[i] == true) {
			cooldown(ability.shoot);
			break;
		}
	}

	// Ability Tooltips
	translate(org.off.x, org.off.y);
	var current = new Date(); // Set current time
	if (ability.tag.activated == false) {
		for (let i = 0; i < 4; i++) {
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
		text(letter, center.x - textWidth(letter) / 2, height  * 9 / 10 + 30 + 13); // Letter text
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

function renderMessages() {
	if (Messages == true) {
		let message;
		if (org.alive == true) {
			if (game.rounds.util == true) {
				if (game.rounds.waiting == true && game.rounds.delayed == false) {
					if (game.rounds.min - game.info.count == 1) {
						message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
					} else {
						message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
					}
				} else if (game.rounds.waiting == true && game.rounds.delayed == true) { // Delay at round start
					message = 'Round begins in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
				} else if (game.rounds.waiting == false && game.rounds.delayed == true) { // Delay at round end
					message = 'Round ends in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
				}
			}
		} else if (org.alive == false) {
			if (game.rounds.util == true) {
				if (game.rounds.waiting == true && game.rounds.delayed == false) { // Waiting for more players to join, not counting down yet
					if (game.rounds.min - game.info.count == 1) {
						message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more player to join';
					} else {
						message = 'Waiting for ' + (game.rounds.min - game.info.count) + ' more players to join';
					}
				} else if (game.rounds.waiting == true && game.rounds.delayed == true) { // Enough players have joined, counting down
					message = 'Round begins in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
				} else if (game.rounds.waiting == false && game.rounds.delayed == false) { // Round in progress
					message = 'Wait for the round to complete';
				} else if (game.rounds.waiting == false && game.rounds.delayed == true) {
					message = 'Round ends in: ' + (1 + floor((game.rounds.delaytime - (new Date() - game.rounds.delaystart)) / 1000)); // Add 1 to make ceiling function
				}
			} else {
				message = 'Press \'' + Controls.respawn.key + '\' to Spawn';
			}
		}
		if (message != undefined) {
			fill(game.world.background.r, game.world.background.g, game.world.background.b); // Message shadows are rendered in renderWorld()
			stroke(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b);
			strokeWeight(1);
			textFont('Helvetica');
			textSize(14);
			if (game.world.color == 'black') {
				textStyle(NORMAL);
			} else if (game.world.color == 'white') {
				textStyle(BOLD);
			}
			rect(25 + textWidth(message) / 2, 25, 25 + textWidth(message), 26);
			fill(game.world.border.color.r, game.world.border.color.g, game.world.border.color.b); // Same color as border to maintain contrast with background
			noStroke();
			text(message, 25, 30);
		}
	}
}

function move() {
	if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code) || keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code) || keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code) || keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) { // If a directional key
		if ((keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code)) && (keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code))) { // Left + Up
			org.pos.x -= org.speed * cos45;
			org.pos.y -= org.speed * cos45;
		} else if ((keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code)) && (keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code))) { // Right + Up
			org.pos.x += org.speed * cos45;
			org.pos.y -= org.speed * cos45;
		} else if ((keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code)) && (keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code))) { // Right + Down
			org.pos.x += org.speed * cos45;
			org.pos.y += org.speed * cos45;
		} else if ((keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code)) && (keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code))) { // Left + Down
			org.pos.x -= org.speed * cos45;
			org.pos.y += org.speed * cos45;
		} else if (keyIsDown(Controls.left1.code) || keyIsDown(Controls.left2.code)) { // A or LEFT_ARROW
			org.pos.x -= org.speed;
		} else if (keyIsDown(Controls.up1.code) || keyIsDown(Controls.up2.code)) { // W or UP_ARROW
			org.pos.y -= org.speed;
		} else if (keyIsDown(Controls.right1.code) || keyIsDown(Controls.right2.code)) { // D or RIGHT_ARROW
			org.pos.x += org.speed;
		} else if (keyIsDown(Controls.down1.code) || keyIsDown(Controls.down2.code)) { // S or DOWN_ARROW
			org.pos.y += org.speed;
		}
		org.off.x = org.pos.x - center.x;
		org.off.y = org.pos.y - center.y;
	}
}

function grow() {
	state = 'game';
	if (org.alive == false) {
		org.alive = true;
		clearInterval(org.interval);
		org.interval = setInterval(function() {
			// Rounds
			var current = new Date();
			if (game.rounds.util == true) {
				if (game.info.host == socket.id) { // Only if player is host
					if (game.rounds.waiting == true && game.rounds.delayed == false && game.info.count >= game.rounds.min) { // If waiting, not delayed, and have minimum players
						socket.emit('Round Delay', game);
						game.rounds.delayed = true; // game will be overwritten, but this will stop host from emitting redundantly if org.interval is called again before game is updated
					} else if (game.rounds.waiting == true && game.rounds.delayed == true && current - game.rounds.delaystart >= game.rounds.delaytime - 1000 && org.ready == false) { // Only host; If 1 second left in round-begin delay
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
								socket.emit('Board', game.board);
							}
						}
					}
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
					if (game.world.type == 'rectangle') {
						if (regions.adjacent[i].x - _cellwidth / 2 <= game.world.x || regions.adjacent[i].x + _cellwidth / 2 >= game.world.x + game.world.width || regions.adjacent[i].y - _cellwidth / 2 <= game.world.x || regions.adjacent[i].y + _cellwidth / 2 >= game.world.y + game.world.height) { // If new cell would be outside world boundary
							continue;
						}
					} else if (game.world.type == 'ellipse') {
						let a = game.world.width / 2;
						let b = game.world.height / 2;
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
					// Don't birth new cell on top of an opponent org
					var overlap = false;
					for (let j = 0; j < game.info.count; j++) {
						if (game.orgs[j].player == org.player) { // If org is player's org
							continue;
						}
						for (let k = 0; k < game.orgs[j].count; k++) {
							if (regions.adjacent[i].x + _cellwidth / 2 >= game.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[i].x + _cellwidth / 2 <= game.orgs[j].cells[k].x + _cellwidth / 2) { // If right side collides
								if (regions.adjacent[i].y + _cellwidth / 2 >= game.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y + _cellwidth / 2 <= game.orgs[j].cells[k].y + _cellwidth / 2) { // If bottom side collides
									overlap = true;
								} else if (regions.adjacent[i].y - _cellwidth / 2 >= game.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y - _cellwidth / 2 <= game.orgs[j].cells[k].y + _cellwidth / 2) { // If top side collides
									overlap = true;
								}
							} else if (regions.adjacent[i].x - _cellwidth / 2 >= game.orgs[j].cells[k].x - _cellwidth / 2 && regions.adjacent[i].x - _cellwidth / 2 <= game.orgs[j].cells[k].x + _cellwidth / 2) { // If left side collides
								if (regions.adjacent[i].y + _cellwidth / 2 >= game.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y + _cellwidth / 2 <= game.orgs[j].cells[k].y + _cellwidth / 2) { // If bottom side collides
									overlap = true;
								} else if (regions.adjacent[i].y - _cellwidth / 2 >= game.orgs[j].cells[k].y - _cellwidth / 2 && regions.adjacent[i].y - _cellwidth / 2 <= game.orgs[j].cells[k].y + _cellwidth / 2) { // If top side collides
									overlap = true;
								}
							}
						}
					}
					if (overlap == true) {
						continue;
					}
					// Birth new cell accordingly
					if (ability.compress.value ^ ability.extend.value == 0) { // compress.value XOR extend.value
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
						let chance = org.coefficient * Math.log(-regions.exposed[i].d(org) + (org.range + 1)) + 100; // -27.5(ln(-(r - 51))) + 100
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
						} else if (game.world.type == 'rectangle' && (regions.exposed[i].x < game.world.x || regions.exposed[i].x > game.world.x + game.world.width || regions.exposed[i].y < game.world.y || regions.exposed[i].y > game.world.y + game.world.height)) { // If cell is outside rectangular world
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
						} else if (game.world.type == 'ellipse' && sq(regions.exposed[i].x - game.world.x - game.world.width / 2) / sq(game.world.width / 2) + sq(regions.exposed[i].y - game.world.y - game.world.height / 2) / sq(game.world.height / 2) > 1) { // If outside elliptical world
							for (let j = 0; j < org.count; j++) {
								if (regions.exposed[i].x == org.cells[j].x && regions.exposed[i].y == org.cells[j].y) { // Identify cell
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

			// Abilities
			for (let i = 0; i < game.info.count; i++) {
				if ((game.orgs[i].team == org.team && typeof team == 'string') && game.orgs[i].player != socket.id) { // If is friendly org but not own org
					continue; // No friendly fire but can hurt self
				}
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
			// 	let dot = game.world.dots.array[i];
			// 	let broken = false;
			// 	for (let j = 0; j < org.count; j++) {
			// 		let cell = org.cells[j];
			// 		if (dot.x >= cell.x - cell.width / 2 && dot.x <= cell.x + cell.width / 2 && dot.y >= cell.y - cell.height / 2 && dot.y <= cell.y + cell.height / 2) {
			// 			let doT = {
			// 				i: dot.i, 
			// 				r: random(game.world.dots.r.min, game.world.dots.r.max), 
			// 				x: random(0, game.world.x + game.world.width), 
			// 				y: random(0, game.world.y + game.world.height)
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

			socket.emit('Org', org);
			if (org.count == 0) {
				for (let i = 0; i < game.board.list.length; i++) {
					if (game.board.list[i].player == socket.id) { // Add death to leaderboard
						game.board.list[i].deaths++; // Add 1 to deaths counter
						orderBoard(game.board.list); // Sort the list by kills then deaths
						socket.emit('Board', game.board); // Send updated board to server
					}
				}
				if (org.hit != org.player) { // Cannot gain kill for suicide
					for (let i = 0; i < game.board.list.length; i++) {
						if (game.board.list[i].player == org.hit) { // Find killer in leaderboard list
							game.board.list[i].kills++;
							orderBoard(game.board.list);
							socket.emit('Board', game.board);
							break;
						}
					}
				}
				org.alive = false;
				die(true);
			}
		}, 70);
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

function die(spectatE) {
	socket.emit('Dead', spectatE);
	clearInterval(org.interval);
	for (let i in ability) { // Reset Ability Cooldowns
		if (typeof ability[i] == 'object') { // Avoid reference error
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
	if (keyCode == Controls.ability1.code) { // X by default
		if (state == 'game' && org.alive == true) {
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
	} else if (keyCode == Controls.ability2.code) { // C by default
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
	} else if (keyCode == Controls.ability3.code) { // V by default
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
	} else if (keyCode == Controls.ability4.code) { // SPACE by default
		if (state == 'game' && org.alive == true) {
			if (ability.spore.value == false && ability.secrete.value == false) {
				spore();
			} else if (ability.spore.value == true && ability.secrete.value == false) {
				secrete();
			}
		}
	} else if (keyCode == Controls.respawn.code) { // R by default
		if (state == 'spectate' && org.alive == false && org.spawn == true) {
			if (game.players.length < game.info.cap) {
				socket.emit('Spectator Left', game.info);
				renderMenu('respawn', game);
			} else {
				alert('Game is at maximum player capacity');
			}
		}
	} else if (keyCode == Controls.pause.code) { // ESC by default
		if (state == 'game') {
			renderMenu('pauseGame', game);
		} else if (state == 'spectate') {
			renderMenu('pauseSpectate', game);
		} else if (state == 'pauseGameMenu') {
			menus.pauseGame.submit();
		} else if (state == 'pauseSpectateMenu') {
			menus.pauseSpectate.submit();
		}
	}
	// Hard key codes are separate from variable codes in case of overlap
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