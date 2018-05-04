var freq = function(arR, elM) {
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

function cnvClear() {
	for (let i = 0; i < document.body.children.length; i++) {
		if (document.body.children[i].tagName == 'CANVAS') {
			continue;
		} else {
			document.body.removeChild(document.body.children[i]);
			i--;
		}
	}
	return document.getElementsByTagName('CANVAS')[0];
}

var getMpos = function(canvaS, evnT) {
	let canvas = canvaS;
	let evnt = evnT;
	var bound = canvas.getBoundingClientRect();
	return {
		x: evnt.clientX - bound.left,
		y: evnt.clientY - bound.top
	};
};

function requestFull(elT) {
	let elt = elT;
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

function exitFull(elT) {
	let elt = elT;
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

function getFullElement() {
	return (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null);
}

function isFull() {
	var fullElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null;
	if (fullElement === null) { // If no element is in full-screen
		return false;
	} else {
		return true;
	}
}