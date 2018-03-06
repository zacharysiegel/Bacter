const DEVMODE = true;

// Aesthetics
const worldColors = {
	black: { r: 0, g: 0, b: 0 }, 
	white: { r: 255, g: 255, b: 255 }, 
	blue: { r: 247, g: 250, b: 255 }
};
const orgColors = {
	black: {
		fire: 			{ r: 255, 	g: 90, 	b: 81  }, 
		camel: 			{ r: 232, 	g: 183, 	b: 155 }, 
		clay: 			{ r: 232, 	g: 145, 	b: 95  }, 
		sun: 				{ r: 255, 	g: 246, 	b: 86  }, 
		leaf: 			{ r: 125, 	g: 255, 	b: 200 }, 
		lime: 			{ r: 57, 	g: 249, 	b: 86  }, 
		sky: 				{ r: 48, 	g: 210, 	b: 255 }, 
		lake: 			{ r: 104, 	g: 157, 	b: 255 }, 
		ocean: 			{ r: 102, 	g: 136, 	b: 244 }, 
		royal: 			{ r: 175, 	g: 132, 	b: 255 }, 
		pink: 			{ r: 250, 	g: 122, 	b: 255 }, 
		hot: 				{ r: 232, 	g: 2, 	b: 216 }
	}, 
	white: {
		fire: 			{ r: 255, 	g: 90, 	b: 81  }, 
		camel: 			{ r: 232, 	g: 183, 	b: 155 }, 
		clay: 			{ r: 232, 	g: 145, 	b: 95  }, 
		burnt: 			{ r: 196, 	g: 99, 	b: 19  }, 
		lime: 			{ r: 57, 	g: 249, 	b: 86  }, 
		forest: 			{ r: 0, 		g: 114, 	b: 38  }, 
		peacock: 		{ r: 16, 	g: 143, 	b: 147 }, 
		sky: 				{ r: 48, 	g: 210, 	b: 255 }, 
		lake: 			{ r: 104, 	g: 157, 	b: 255 }, 
		ocean: 			{ r: 102, 	g: 136, 	b: 244 }, 
		royal: 			{ r: 175, 	g: 132, 	b: 255 }, 
		pink: 			{ r: 250, 	g: 122, 	b: 255 }, 
		hot: 				{ r: 232, 	g: 2, 	b: 216 }
	}
};

// Math
const cos45 = 0.70710678118;

// Defaults
const CELLWIDTH = 6; // 6 Default
const MOVESPEED = 2.4; // 2.4 Default
const SPECTATESPEED = 4; // 4 Default
const WORLDWIDTH = 800; // 800 Default
const PLAYERCAP = 10; // 10 Default
const BOARDLENGTH = 10; // 10 Default

// Settings
var ABILITYKEY1 = 'X';
var ABILITYCODE1 = 88;
var ABILITYKEY2 = 'C';
var ABILITYCODE2 = 67;
var ABILITYKEY3 = 'V';
var ABILITYCODE3 = 86;
var ABILITYKEY4 = ' ';
var ABILITYCODE4 = 32;
var RESPAWNKEY = 'R';
var RESPAWNCODE = 82;
var PAUSEKEY = 'ESC';
var PAUSECODE = 27;
var LABELS = true;