var Org = function(datA) {
	this.player = datA.player;
	this.color = datA.color;
	this.skin = datA.skin;
	this.team = datA.team;
	if (datA.spectate == true) {
		this.speed = _spectatespeed; // Faster movement when spectating
	} else {
		this.speed = _movespeed; // Speed of position movement
	}
	if (game.info.mode == 'srv' && game.rounds.waiting == false) {
		this.spawn = false;
	} else {
		this.spawn = true; // Allowance to spawn
	}
	{ // this.name
		for (let i = 0; i < game.board.list.length; i++) {
			if (game.board.list[i].player == this.player) { // Find player name in leaderboard list
				this.name = game.board.list[i].name;
			}
		}
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
	if (datA.pos != undefined) {
		this.pos = datA.pos;
	} else {
		do {
			this.pos = { // Position is the target's location in the world
				x: floor(random(game.world.x + 50, game.world.x + game.world.width - 50)), // +- 50 acts as buffer
				y: floor(random(game.world.x + 50, game.world.x + game.world.height - 50))
			};
			var rePos = false;
			if (game.world.type == 'ellipse') {
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
	this.interval = undefined;
};

var Cell = function(X, Y, orG) {
	this.player = orG.player;
	this.width = _cellwidth; // or 3x3
	this.height = _cellwidth;
	this.x = X;
	this.y = Y;
	{ // this.color
		for (let i = 0; i < game.info.count; i++) {
			if (game.orgs[i].player == socket.id) {
				this.color = game.orgs[i].color;
			}
		}
	}
	this.r = function(orG) { // Distance from org center
		for (let i = 0; i < game.info.count; i++) {
			if (orG.player == game.orgs[i].player) { // Find orG in game.orgs
				let distance = sqrt(sq(this.x - game.orgs[i].x()) + sq(this.y - game.orgs[i].y()));
				return distance;
			}
		}
	};
	this.d = function(orG) { // Distance from target (Position in world)
		for (let i = 0; i < game.info.count; i++) {
			if (orG.player == game.orgs[i].player) { // Find orG in game.orgs
				let distance = sqrt(sq(this.x - game.orgs[i].pos.x) + sq(this.y - game.orgs[i].pos.y));
				return distance;
			}
		}
	};
};