var World = function(datA) { // datA: { width: , height: , type: , color: , x: , y: }
	let data = datA;
	this.host = socket.id; // Cannot call game.info.host since game is not fully constructed yet; World() can only be called by host, so socket.id is ok
	this.width = data.width;
	this.height = data.height;
	if (data.x != undefined) { // Coordinates are for top left corner
		this.x = data.x;
	} else {
		this.x = 0;
	}
	if (data.y != undefined) {
		this.y = data.y;
	} else {
		this.y = 0;
	}
	this.type = data.type
	this.color = data.color;
	for (let i in worldColors) {
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
	noStroke();
	{ // World
		if (game.world.type == 'rectangle') { // World
			rect(game.world.x + game.world.width / 2 + 7, game.world.y + game.world.height / 2 + 6, game.world.width, game.world.height);
		} else if (game.world.type == 'ellipse') {
			ellipse(game.world.x + game.world.width / 2 + 5, game.world.y + game.world.height / 2 + 4, game.world.width / 2, game.world.height / 2);
		}
	}
	{ // Leaderboard
		translate(org.off.x, org.off.y); // Shadows in renderWorld() so it will render behind world
		rectMode(CORNER);
		game.board.y = game.board.marginTop; // Leaderboard Head
		switch (game.info.mode) {
			case 'ffa': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
				game.board.count = min(game.board.show, game.board.list.length);
				break;
			} case 'skm': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
				game.board.count = game.teams.length;
				break;
			} case 'srv': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
				game.board.count = min(game.board.show, game.board.list.length);
				break;
			} case 'ctf': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
				game.board.count = game.teams.length;
				break;
			} case 'inf': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
				game.board.count = min(game.board.show, game.board.list.length);
				break;
			} case 'kth': {
				game.board.x = width - (game.board.nameWidth + game.board.oneWidth + game.board.twoWidth) - game.board.marginRight;
				rect(game.board.x + 4, game.board.y + 3, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
				game.board.count = min(game.board.show, game.board.list.length);
				break;
			}
		}
		var a = 0;
		for (let i = 0; i < game.board.count; i++) { // Leaderboard Body
			if (game.info.mode != 'skm' && game.info.mode != 'ctf') { // If not a team mode
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
			}
			switch (game.info.mode) {
				case 'ffa': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
					break;
				} case 'skm': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth + game.board.threeWidth, game.board.rowHeight);
					break;
				} case 'srv': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
					break;
				} case 'ctf': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
					break;
				} case 'inf': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth, game.board.rowHeight);
					break;
				} case 'kth': {
					rect(game.board.x + 4, game.board.y + 3 + (a + 1) * game.board.rowHeight, game.board.nameWidth + game.board.oneWidth + game.board.twoWidth, game.board.rowHeight);
					break;
				}
			}
			a++;
		}
		translate(-org.off.x, -org.off.y);
		rectMode(CENTER);
	}
	{ // Messages
		translate(org.off.x, org.off.y);
		if (Messages == true) {
			textFont('Helvetica');
			textStyle(NORMAL);
			let message = getMessage();
			if (message != undefined) {
				let breaks = freq(message, '\n');
				let width = messageWidth(message);
				rect(5 + 25 + width / 2, 4 + 25 + 9 * breaks, 25 + width, 26 + 18 * breaks);
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
		for (let i = 1; i < game.teams.length + 1; i++) {
			let color = teamColorDef[teamColors[i - 1]];
			stroke(orgColors[game.world.color][color].r, orgColors[game.world.color][color].g, orgColors[game.world.color][color].b);
			strokeWeight(3);
			let bin = i.toString(2); // Convert i to binary string
			if (bin.length < 2) {
				bin = '0' + bin; // Add zero to front to form equivalent two-length binary number
			}
			let x = game.world.x + (game.world.width * parseInt(bin[bin.length - 1]));
			let y = game.world.y + (game.world.height * parseInt(bin[bin.length - 2]));
			let theta;
			if (bin == '01') {
				theta = 270;
			} else if (bin == '10') {
				theta = 90;
			} else if (bin == '11') {
				theta = 180;
			} else if (bin == '100') {
				theta = 0;
			}
			let l = 150;
			if (game.world.type == 'rectangle') {
				arc(x, y, l, l, -theta + 1, -theta + 89); // -1 to avoid world border overlap with a degree cushion either side
			} else if (game.world.type == 'ellipse') {
				let r = game.world.width / 2;
				let h = x + cos(-theta + 45) * r * (root2 - 1); // l = r(root2 - 1); length from circle to square corner
				let k = y + sin(-theta + 45) * r * (root2 - 1); // yoff = l*sin(-theta + 45); -theta + 45 gives angle to center
				let a = game.world.x + r; // a is world center x
				let b = game.world.y + r; // b is world center y
				let diffs = [];
				let points = [/*{ p: Number, q: Number }*/];
				for (let j = 0; j < 720; j++) {
					let alpha = j;
					let p = h + l * cos(alpha);
					let q = k + l * sin(alpha);
					let d = abs(sqrt(sq(p - a) + sq(q - b)) - r); // Calculate distance of point on base circle to world circle
					diffs.push(d); // Store all distances to array
					points.push({ p: p, q: q }); // Store all points to array
				}
				let point = points[diffs.indexOf(min(diffs))]; // Find closest point to world circle (points and diffs are analogous)
				let phi = atan(abs(point.q - k) / abs(point.p - h));
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