'use strict';

const Grid = require('./grid');

var Viewport = function(width, height, x, y) {
	this.width = width || 0;
	this.height = height || 0;

	this.x = x || 0;
	this.y = y || 0;

	this.redraw = true;
	this.lastFrame = null;
};

Viewport.prototype.clear = function() {
	this.lastFrame = new Grid(this.width, this.height, null, 0);
}

Viewport.prototype.draw = function(stage) {
	let output;

	if (this.redraw || !this.lastFrame) {
		output = new Grid(this.width, this.height, null, 0);
	} else {
		output = new Grid(this.width, this.height, this.lastFrame.data);
	}

	stage.entities.forEach((entity) => {
		let frame = entity.getFrame();
		if (frame) {
			output.drawImage(frame, entity.x - this.x, entity.y - this.y, entity.sprite.transparent);	
		}
	});

	this.lastFrame = output;

	return output;
};

module.exports = Viewport;