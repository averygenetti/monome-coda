'use strict';

var Stage = function(coda, entities) {
	this.coda = coda;
	this.entities = entities || [];
};

Stage.prototype.clear = function() {
	this.entities = [];
};

Stage.prototype.addEntity = function(entity) {
	this.entities.push(entity);
	entity.stage = this;
};

Stage.prototype.removeEntity = function(entity) {
	this.entities = this.entities.filter((spr) => {
		return spr != entity;
	});

	entity.stage = null;
};

module.exports = Stage;