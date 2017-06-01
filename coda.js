'use strict';

// hello! it's coda!
const Coda = function({width, height, fps, gameSpeed, monome} = {}) {
	this.monome = monome || require('monome-grid')();

	this.util = require('./lib/util');
	this.Grid = require('./lib/grid');
	this.Sprite = require('./lib/sprite');
	this.Entity = require('./lib/entity');
	this.Stage = require('./lib/stage');
	this.Viewport = require('./lib/viewport');

	this.fps = fps || 60;
	this.width = width || 16;
	this.height = height || 16;
	this.gameSpeed = gameSpeed || 120;

	this.playing = false;

	this.bgmObj = null;

	this.bindings = new this.Grid(this.width, this.height);

	this.monome.key((x, y, s) => {
		let binding = this.bindings.getPoint(x, y);

		if (binding) {
			binding.call(this, x,y,s);
		}
	});
}

// Logic loop
Coda.prototype.tick = function(lastTime) {
	let time = Date.now();
	let delta = time - lastTime;

	if (this.playing) {
		if (this.stage) {
			this.stage.entities.forEach((entity) => {
				entity.tick(delta);
			});
		}
	
		setTimeout(() => {
			this.tick(time);
		}, 1000 / this.gameSpeed);
	}
}

// Render loop
Coda.prototype.drawFrame = function() {
	if (!this.playing) {
		return;
	}

	let buffer = this.viewport.draw(this.stage);

	this.monome.refresh(buffer.data);

	setTimeout(() => {
		this.drawFrame();
	}, 1000 / this.fps);
}

// I don't have looping yet :(
Coda.prototype.playBgm = function(bgm) {
	this.bgm = bgm || this.bgm;

	if (this.bgm) {
		this.bgmObj = this.util.playSound(this.bgm);
	}
}

Coda.prototype.stopBgm = function() {
	if (this.bgmObj) {
		this.bgmObj.kill();
	}

	this.bgmObj = null;
}

Coda.prototype.init = function() {
	this.stage = new this.Stage(this);
	this.viewport = new this.Viewport(this.width, this.height);
}

Coda.prototype.play = function() {
	if (!this.playing) {
		this.init();

		this.bgm ? this.playBgm() : this.stopBgm();

		this.playing = true;
		this.tick();
		this.drawFrame();
	}
}

Coda.prototype.stop = function() {
	this.playing = false;
	if (this.bgmObj) {
		this.bgmObj.kill();
	}
	this.bgmObj = null;
}

// f is the callback to execute on key.
// the callback gets passed a horizontal coord, a vertical coord, and a state (1 or 0)
Coda.prototype.bind = function(f, x, y, width, height) {
	width = width || 1;
	height = height || 1;
	let bindings = this.bindings;

	bindings.paint((i, j, v) => {
		bindings.setPoint(x, y, f);
	}, x, y, width, height);
}

module.exports = Coda;