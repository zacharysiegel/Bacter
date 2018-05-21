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

var isHTMLElement = (elt) => {
	return (elt instanceof HTMLElement);
};

function requestFullscreen(elT) {
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

function exitFullscreen(elT) {
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

function getFullscreenElement() {
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

var lrot = function(bin, rot) { // Bitwise left rotation
	const shifted = bin.slice(rot);
	const falloff = bin.slice(0, rot);
	let fin = shifted;
	for (let i = 0; i < rot; i++) {
		fin += falloff.charAt(i);
	}
	return fin;
}