var freq = function(arR, elM) { // Get the frequency of an element in an array or string
	let arr = arR;
	let elm = elM;
	let freq = 0;
	let index = arr.indexOf(elm);
	if (index == -1) {
		return freq;
	} else {
		do {
			freq++;
			arr = arr.slice(index + 1);
			index = arr.indexOf(elm);
		} while (index != -1);
		return freq;
	}
};

var capitalize = function(stR) { // Capitalize the first character of every word in the given string
	let str = stR;
	let arr = str.split('');
	arr[0] = arr[0].toUpperCase();
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] === ' ') {
			arr[i+1] = arr[i+1].toUpperCase();
		}
	}
	str = arr.join('');
	return str;
};

var $ = function(a) { // JQuery-esque
   switch (a[0]) { // Get the type of input
      default: return document.getElementById(a); // If no special character is provided, input is interpreted as an id
      case '#': return document.getElementById(a.slice(1)); // An element id follows the # symbol (convention)
      case '.': return document.getElementsByClassName(a.slice(1)); // An element class follows the . symbol (convention)
      case '%': return document.getElementsByTagName(a.slice(1));  // An element tag name follows the % symbol
   }
};

var getKeys = function(obj) { // Returns an array of strings representing keys of an object
	let arr = [];
	for (let i in obj) {
		arr.push(i);
	}
	return arr;
};

function requestFullscreen(elt) {
	if (elt.requestFullscreen) {
		elt.requestFullscreen();
	} else if (elt.mozRequestFullScreen) {
		elt.mozRequestFullScreen();
	} else if (elt.webkitRequestFullscreen) {
		elt.webkitRequestFullscreen();
	} else if (elt.msRequestFullscreen) {
		elt.msRequestFullscreen();
	}
}

function exitFullscreen(elt) {
	if (elt.exitFullscreen) {
		elt.requestFullscreen();
	} else if (elt.mozCancelFullScreen) {
		elt.mozRequestCancelScreen();
	} else if (elt.webkitExitFullscreen) {
		elt.webkitRequestFullscreen();
	} else if (elt.msExitFullscreen) {
		elt.msRequestFullscreen();
	}
}

function getFullscreenElement() {
	return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null);
}

function isFullscreen() {
	var fullElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	if (fullElement === null) { // If no element is in full-screen
		return false;
	} else {
		return true;
	}
}