const DEVMODE = true;

// Aesthetics
const worldColors = {
	// blue: { r: 247, g: 250, b: 255 }
	// white: { r: 255, g: 255, b: 255 }
	black: { r: 0, g: 0, b: 0 }
};
const orgColors = {
	lightblue: 		{ r: 48, 	g: 210, 	b: 255 }, 
	lightgreen: 	{ r: 125, 	g: 255, 	b: 200 }, 
	kiwigreen: 		{ r: 32, 	g: 246, 	b: 86 }, 
	limegreen: 		{ r: 57, 	g: 249, 	b: 86 }, 
	yellow: 			{ r: 255, 	g: 246, 	b: 86 }, 
	lightbrown: 	{ r: 232, 	g: 183, 	b: 155 }, 
	midbrown: 		{ r: 232, 	g: 145, 	b: 95 }, 
	red: 				{ r: 255, 	g: 90, 	b: 81 }, 
	blue: 			{ r: 104, 	g: 157, 	b: 255 }, 
	darkblue: 		{ r: 102, 	g: 136, 	b: 244 }, 
	turquoise: 		{ r: 14, 	g: 186, 	b: 186 }, 
	purple: 			{ r: 175, 	g: 132, 	b: 255 }, 
	pink: 			{ r: 250, 	g: 122, 	b: 255 }, 
	hotpink: 		{ r: 232, 	g: 2, 	b: 216 }
};

// Math
const cos45 = 0.70710678118;

// Specifications
const CELLWIDTH = 6; // 6 Default
const MOVESPEED = 2.4; // 2 Default
const SPECTATESPEED = 4; // 4 Default (Twice MOVESPEED)
const WORLDWIDTH = 800; // 800 Default

// Settings
const ABILITYLETTER1 = 'X';
const ABILITYKEY1 = 88;
const ABILITYLETTER2 = 'C';
const ABILITYKEY2 = 67;
const ABILITYLETTER3 = 'V';
const ABILITYKEY3 = 86;
const ABILITYLETTER4 = ' ';
const ABILITYKEY4 = 32;
const RESPAWNLETTER = 'R';
const RESPAWNKEY = 82;