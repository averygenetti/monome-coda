var Entity = require('../../lib/entity');

var Coin = function(g, x, y) {
	this.game = g;

	var model = new this.game.Grid(1, 1, [
		[15]
	]);

	var sprite = new this.game.Sprite([model]);

	this.game.Entity.call(this, 'Coin', sprite, x, y, 0, null, this.game.stage);

	this.canBePickedUp = true;
};

Coin.prototype = Object.create(Entity.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.destroy = function() {
	if (!this.destroyed) {
		this.game.coinCount--;
	}

	this.game.Entity.prototype.destroy.call(this, ...arguments);	
}

module.exports = Coin;