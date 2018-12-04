let eid = function(str) {
	return document.getElementById(str);
}

var freq = function(arr, elt) { // Get the frequency of an element in an array or string
	let freq = 0;
	let index = arr.indexOf(elt);
	if (index == -1) {
		return freq;
	} else {
		do {
			freq++;
			arr = arr.slice(index + 1);
			index = arr.indexOf(elt);
		} while (index != -1);
		return freq;
	}
};

var capitalize = function(str) { // Capitalize the first character of every word in the given string
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