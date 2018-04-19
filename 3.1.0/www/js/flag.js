var Flag = function(X, Y, coloR) {
	this.x = X;
	this.y = Y;
	this.color = coloR;
	this.carried = false; // True: flag is being carried by a player; False: flag is dropped
	this.carrier = undefined;
	this.height = 20;
	this.width = 9;
};