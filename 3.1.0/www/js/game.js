 var game; // Initialize in global scope
 var Game = function(datA) {
	let data = datA;
	this.src = 'game';
	this.players = [];
	{ // Info
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
	}
	{ // Teams
		this.teams = [];
		if (this.info.mode == 'skm' || this.info.mode == 'ctf') {
			for (let i = 0; i < this.info.teamCount; i++) {
				this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
			}
		} else if (this.info.mode == 'inf') {
			for (let i = 0; i < 2; i++) { // Only can be two teams in infection (healthy/infected)
				this.teams.push([]); // Outer array contains teams, inner arrays contain player ids
			}
		}
	}
	{ // Rounds
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
	// 	for (let i = 0; i < game.world.width; i++) {
	// 		if (random() < game.world.dots.prob) { // About every five pixels, draw dot
	// 			let dot = {
	// 				i: game.world.dots.array.length, 
	// 				r: random(game.world.dots.r.min, game.world.dots.r.max), 
	// 				x: i, 
	// 				y: random(0, game.world.height)
	// 			};
	// 			game.world.dots.array.push(dot);
	// 		}
	// 	}
	// 	game.world.dots.count = game.world.dots.array.length;
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