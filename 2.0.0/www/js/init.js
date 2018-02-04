var cnv;
var center = {};
var game = {
	players: [], 
	info: {
		host: undefined, 
		name: undefined
	}, 
	world: {
		host: undefined, 
		width: undefined, 
		height: undefined, 
		x: undefined, 
		y: undefined, 
		background: undefined, 
		grid: {
			width: 100
		}, 
		dots: {
			r: {
				min: .5, 
				max: 2
			}, 
			prob: .2, 
			array: [], 
			count: 0
		}
	}, 
	orgs: [], 
	abilities: []
};
function initialize(gamE, spectatE) {
	state = 'initialize';
	game = gamE;

	// Clear Body
	var page = document.body.parentNode;
	page.removeChild(document.body);
	blank = document.createElement('body');
	page.appendChild(blank);

	// Apply Canvas Styling
	blank.style.overflow = 'hidden';
	blank.style.margin = '0px';
	blank.style.border = '0px';
	blank.style.padding = '0px';

	// Initialize Game
	defaultCanvas.style.display = 'block';
	cnv = createCanvas(window.innerWidth, window.innerHeight);
	center = {
		x: width / 2, 
		y: height / 2
	};
	rectMode(CENTER);
	ellipseMode(RADIUS);
	angleMode(DEGREES);

	if (spectatE != true) {
		spawn();
	} else if (spectatE == true) {
		spectate();
	}
}

function createGame() {
	game.info = {
		host: socket.id, 
		name: nameInput.value, 
		count: 0
	};
	game.world.host = game.info.host;
	game.world.width = WORLDWIDTH;
	game.world.height = WORLDWIDTH;
	game.world.x = 0;
	game.world.y = 0;
	{ // game.world.background
		var j = 0;
		for (let i in worldColors) {
			j++;
		}
		let colorIndex = floor(random(0, j));
		var k = 0;
		for (let i in worldColors) {
			if (k == colorIndex) {
				game.world.background = worldColors[i];
				break;
			} else {
				k++;
			}
		}
	}
	game.players = [];
	game.spectators = [];
	game.orgs = [];
	game.abilities = [];
	for (let i = 0; i < game.world.width; i++) {
		if (random() < game.world.dots.prob) { // About every five pixels, draw dot
			let dot = {
				i: game.world.dots.array.length, 
				r: random(game.world.dots.r.min, game.world.dots.r.max), 
				x: i, 
				y: random(0, game.world.height)
			};
			game.world.dots.array.push(dot);
		}
	}
	game.world.dots.count = game.world.dots.array.length;
	socket.emit('Game Created', game);
	let passwordInput = document.getElementById('PasswordInput');
	if (passwordInput.value != '' || passwordInput != undefined || passwordInput != null) {
		socket.emit('Password Created', { pass: passwordInput.value, info: game.info });
	}
	initialize(game);
}