var cnv;
var center = {};
var game = {
	players: [], 
	info: {
		host: undefined, 
		name: undefined
	}, 
	world: {
		width: undefined, 
		height: undefined, 
		x: undefined, 
		y: undefined, 
		background: undefined, 
		grid: {
			width: 20
		}
	}, 
	orgs: [], 
	abilities: []
};
function initialize(gamE) {
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
	cnv = createCanvas(window.innerWidth, window.innerHeight);
	center = {
		x: width / 2, 
		y: height / 2
	};
	rectMode(CENTER);
	ellipseMode(RADIUS);
	angleMode(DEGREES);

	spawn();
}

function createGame() {
	game.players = [];
	game.info = {
		host: socket.id, 
		name: nameInput.value, 
		count: 0
	};
	game.world.width = 500;
	game.world.height = 500;
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
	game.orgs = [];
	game.abilities = [];
	socket.emit('Game Created', game);
	initialize(game);
}