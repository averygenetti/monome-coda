'use strict';

var Sprite = function(frames, speed, current, transparent) {
	if (Array.isArray(frames)) {
		this.frames = frames;
	} else {
		if (frames) {
			this.frames = [frames];
		} else {
			this.frames = [];
		}
	};

	this.speed = speed || 3;
	this.current = current || 0;
	this.playing = false;

	// When drawing this sprite, treat 0 pixels as transparent, don't overwrite underlying pixels
	this.transparent = false;
};

Sprite.prototype.width = function() {
	return this.getFrame() ? this.getFrame().width : 0;
}

Sprite.prototype.height = function() {
	return this.getFrame() ? this.getFrame().height : 0;
}

Sprite.prototype.nextFrame = function() {
	if (this.current + 1 < this.frames.length) {
		this.current = this.current + 1;
	} else {
		this.current = 0;
	}

	if (this.playing) {
		setTimeout(() => {
			this.nextFrame();
		}, 1000 / this.speed);				
	}
}

Sprite.prototype.prevFrame = function() {
	if (this.current - 1 >= 0) {
		this.current = this.current - 1;
	} else {
		this.current = this.frames.length - 1;
	}
}

Sprite.prototype.getFrame = function() {
	if (this.frames[this.current]) {
		return this.frames[this.current];	
	}
}

Sprite.prototype.play = function() {
	this.playing = true;
	this.nextFrame();
}

Sprite.prototype.stop = function() {
	this.playing = false;
}

module.exports = Sprite;