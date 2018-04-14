var cnv;
var center = {};
var game = {
	players: [], 
	info: {
		host: undefined, 
		title: undefined, 
		count: undefined, 
		cap: undefined, 
		mode: undefined
	}, 
	teams: [], 
	rounds: {
		host: undefined, // Identification purposes
		util: false, // If game utilizes rounds
		waiting: true, 
		delayed: false, 
		delaystart: undefined, 
		delaytime: _delaytime, 
		start: undefined, 
		min: undefined, // Min players
		winner: undefined
	}, 
	board: {
		host: undefined, // Identification purposes
		list: [
			// {
			// 	player: undefined, // ID of player
			// 	name: undefined, // Screen name of player
			// 	kills: undefined, // Kills as defined by number of enemy cells killed
			// 	deaths: undefined, // Deaths as defined by number of org deaths
			// 	ratio: undefined, // Ratio of kills to deaths
			// 	score: undefined, // Flag captures (ctf), time score (kth)
			// 	wins: undefined // Round wins (srv, ctf, inf, kth)
			// }
		], 
		count: undefined, 
		show: undefined, // Maximum number of players shown in leaderboard (Top __)
		x: undefined, // width - (nameWidth + oneWidth + twoWidth) / 2 - marginRight
		y: undefined, // marginTop
		marginRight: 15, 
		marginTop: 13, 
		text: {
			marginLeft: 5, 
			marginTop: 15, 
			size: 11, 
			font: 'Helvetica', 
			boldFont: 'Verdana', 
			color: { r: 0, g: 0, b: 0 }
		}, 
		nameWidth: 170, 
		oneWidth: 46, 
		twoWidth: 46, 
		threeWidth: 46, 
		rowHeight: 22, 
		tableWeight: 1, 
		headWeight: 1, 
		cellWeight: 1, 
		headColor: { r: 200, g: 200, b: 200 }, 
		cellColor: { r: 245, g: 245, b: 245 }, 
		stroke: { r: 0, g: 0, b: 0 }
	}, 
	world: {
		host: undefined, 
		width: undefined, 
		height: undefined, 
		x: undefined, 
		y: undefined, 
		color: undefined, 
		background: undefined, 
		interval: undefined, 
		border: {
			color: undefined, 
			weight: 1
		}, 
		grid: {
			width: 100
		}, 
		// dots: {
		// 	r: {
		// 		min: .5, 
		// 		max: 2
		// 	}, 
		// 	prob: .2, 
		// 	array: [], 
		// 	count: 0
		// }
	}, 
	orgs: [], 
	abilities: []
};
function initialize(gamE, datA) {
	state = 'initialize';
	game = gamE;

	// Clear Body
	var page = document.body.parentNode;
	page.removeChild(document.body);
	body = document.createElement('body');
	page.appendChild(body);

	// Apply Canvas Styling
	body.style.overflow = 'hidden';
	body.style.margin = '0px';
	body.style.border = '0px';
	body.style.padding = '0px';

	// Initialize Game
	cnv = createCanvas(window.innerWidth, window.innerHeight);
	canvas = cnv.elt; // HTML Node is stored in p5 canvas' .elt property
	canvas.style.visibility = 'visible';
	body.appendChild(canvas);
	center = {
		x: width / 2, 
		y: height / 2
	};
	rectMode(CENTER);
	ellipseMode(RADIUS);
	angleMode(DEGREES);
	textAlign(LEFT);

	if (datA.spectate != true) { // Field can be left undefined
		spawn({ color: datA.color, skin: datA.skin, team: datA.team });
	} else if (datA.spectate == true) {
		spectate({ color: datA.color, skin: datA.skin, team: datA.team });
	}
}

function createGame(datA) {
	game.info = {
		host: socket.id, 
		title: datA.title, 
		protected: undefined, 
		count: 0, 
		cap: datA.cap, 
		mode: datA.mode, 
		teamCount: datA.teamCount
	};
	if (datA.password == '' || datA.password == undefined || datA.password == null || datA.password !== datA.password) {
		game.info.protected = false;
	} else {
		game.info.protected = true;
	}
	game.world.host = game.info.host;
	game.world.type = datA.type;
	game.world.width = datA.width;
	game.world.height = datA.height;
	game.world.x = 0;
	game.world.y = 0;
	game.world.color = datA.color;
	{
		for (let i in worldColors) {
			if (i == game.world.color) {
				game.world.background = worldColors[i];
				break;
			}
		}
	}
	game.world.backdrop = { r: 70, g: 70, b: 70 };
	game.world.border.weight = 1;
	{
		if (game.world.color == 'black') {
			game.world.border.color = { r: 255, g: 255, b: 255 };
		} else if (game.world.color == 'white') {
			game.world.border.color = { r: 0, g: 0, b: 0 };
		}
	}
	game.players = [];
	game.spectators = [];
	game.orgs = [];
	game.abilities = [];
	// for (let i = 0; i < game.world.width; i++) { // Dots
	// 	if (random() < game.world.dots.prob) { // About every five pixels, draw dot
	// 		let dot = {
	// 			i: game.world.dots.array.length, 
	// 			r: random(game.world.dots.r.min, game.world.dots.r.max), 
	// 			x: i, 
	// 			y: random(0, game.world.height)
	// 		};
	// 		game.world.dots.array.push(dot);
	// 	}
	// }
	// game.world.dots.count = game.world.dots.array.length;
	game.board.host = game.info.host;
	game.board.list = [];
	{ // Teams
		game.teams = [];
		if (game.info.mode == 'skm' || game.info.mode == 'ctf') {
			for (let i = 0; i < game.info.teamCount; i++) {
				game.teams.push([]); // Outer array contains teams, inner arrays contain player ids
			}
		} else if (game.info.mode == 'inf') {
			for (let i = 0; i < 2; i++) { // Only can be two teams in infection (healthy/infected)
				game.teams.push([]); // Outer array contains teams, inner arrays contain player ids
			}
		}
	}
	{ // Leaderboard Length
		if (game.teams.length != 0) { // If is a team game
			game.board.show = game.teams.length;
		} else {
			game.board.show = datA.show;
		}
	}
	{ // Rounds
		if (game.info.mode == 'srv' || game.info.mode == 'ctf' || game.info.mode == 'inf' || game.info.mode == 'kth') {
			game.rounds.util = true;
			game.rounds.host = game.info.host;
			game.rounds.min = datA.min;
			game.rounds.waiting = true;
		}
	}
	socket.emit('Game Created', game);
	if (game.info.protected == true) {
		socket.emit('Password Created', { pass: datA.password, info: game.info });
	}
	renderMenu('join', game);
}