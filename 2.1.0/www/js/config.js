const worldColors = {
	// blue: { r: 247, g: 250, b: 255 }
	// white: { r: 255, g: 255, b: 255 }
	black: { r: 0, g: 0, b: 0 }
};

const orgColors = {
	turquoise: { r: 48, g: 210, b: 255 }, 
	lime: { r: 125, g: 255, b: 200 }, 
	pepper: { r: 255, g: 192, b: 56 }, 
	red: { r: 255, g: 90, b: 81 }, 
	blue: { r: 104, g: 157, b: 255 }, 
	purple: { r: 164, g: 122, b: 255 }, 
	pink: { r: 250, g: 122, b: 255 }
};

const cos45 = 0.70710678118;

const CELLWIDTH = 6; // 6 Default
const MOVESPEED = 2; // 2 Default
const SPECTATESPEED = 4; // 4 Default (Twice MOVESPEED)
const WORLDWIDTH = 800; // 800 Default

const ABILITYLETTER1 = 'X'; // Ability Letters
const ABILITYLETTER2 = 'C';
const ABILITYLETTER3 = 'V';
const ABILITYLETTER4 = ' ';
const ABILITYKEY1 = 88; // Ability Letter-Corresponding Key Codes
const ABILITYKEY2 = 67;
const ABILITYKEY3 = 86;
const ABILITYKEY4 = 32;