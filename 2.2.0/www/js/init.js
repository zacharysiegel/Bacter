var cnv;
var center = {};
var game = {
	players: [], 
	info: {
		host: undefined, 
		name: undefined
	}, 
	board: {
		host: undefined, 
		list: [
			// {
			// 	player: undefined, // ID of player
			// 	name: undefined, // Screen name of player
			// 	kills: undefined, // Kills as defined by number of enemy cells killed
			// 	deaths: undefined, // Deaths as defined by number of org deaths
			// 	ratio: undefined // Ratio of kills to deaths
			// }
		], 
		show: 10, // Maximum number of players shown in leaderboard (Top __)
		x: undefined, // width - (nameWidth + killWidth + deathWidth) / 2 - marginRight
		y: undefined, // marginTop
		marginRight: 15, 
		marginTop: 15, 
		text: {
			marginLeft: 5, 
			marginTop: 15, 
			size: 11, 
			font: 'Helvetica', 
			boldFont: 'Verdana', 
			color: { r: 0, g: 0, b: 0 }
		}, 
		nameWidth: 170, 
		killWidth: 46, 
		deathWidth: 46, 
		ratioWidth: 46, 
		rowHeight: 22, 
		tableWeight: 2, 
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

	let go = pushBoard();
	if (go == true) {
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
		textAlign(LEFT);

		if (spectatE != true) { // Field can be left undefined
			spawn();
		} else if (spectatE == true) {
			spectate();
		}
	}
}

function pushBoard() {
	var namE = prompt('Enter a screen name'); // Set screen name
	if (namE == null) {
		return false;
	}
	fixName();
	function fixName() {
		if (namE == '' || namE == undefined) { // Name must contain a character
			namE = prompt('Enter a screen name\nField cannot be left blank');
			fixName();
			return;
		}
		for (let i = 0; i < game.info.count; i++) {
			if (namE == game.board.list[i].name) { // Name cannot match another player's name
				namE = prompt('Enter a screen name\nName matches that of another player');
				fixName();
				return;
			}
		}
	}
	game.board.list.push({ // Add player to leaderboard
		player: socket.id, 
		name: namE, 
		kills: 0, 
		deaths: 0
	});
	orderBoard(game.board.list);
	socket.emit('Board', game.board); // Must be before spawn because only runs when first entering server, and spawn() runs on respawn as well
	return true;
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
	game.board.host = game.info.host;
	game.board.list = [];
	socket.emit('Game Created', game);
	let passwordInput = document.getElementById('PasswordInput');
	if (passwordInput.value != '' || passwordInput != undefined || passwordInput != null) {
		socket.emit('Password Created', { pass: passwordInput.value, info: game.info });
	}
	initialize(game);
}