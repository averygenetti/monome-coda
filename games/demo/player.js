var Entity = require('../../lib/entity');

var Player = function(g, x, y) {
	this.game = g;

	var playerModel1 = new this.game.Grid(2, 2, [
		[7,7],
		[7,7]
	]);

	var playerSprite = new this.game.Sprite([playerModel1]);

	this.game.Entity.call(this, 'Player', playerSprite, x, y, 0, null, this.game.stage);

	this.speed = 12;
	this.score = 0;
	this.exp = 0;
	this.level = 1;
	
	this.isSolid = true;
	this.collidesWithViewport = true;
	this.isPlayer = true;

	this.lastMove = Date.now();
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.levelUp = function() {
	this.level++;
	this.exp = 0;
	this.game.coinSpawnTime = this.game.coinSpawnTime * 0.85;

	this.game.destroyAllCoins();

	if (this.game.levelMeter) {
		this.game.stage.removeEntity(this.game.levelMeter);	
	}
	
	this.game.levelMeter = this.game.progressBar(1, this.game.height - 1, (this.level - 1)%(this.game.width - 4));
	this.game.stage.addEntity(this.game.levelMeter);

	this.game.util.playSound('./sounds/levelup.wav');
}

Player.prototype.collide = function(collisions) {
	collisions.forEach((collision) => {
		if (collision.entity && !collision.entity.destroyed && collision.entity.canBePickedUp) {
			this.game.util.playSound('./sounds/coin.wav');

			this.score = this.score + this.level;
			this.exp++;

			collision.entity.destroy();

			if (this.exp >= this.expForNextLevel()) {
				this.levelUp();
			}

			if (this.game.levelUpMeter) {
				this.game.stage.removeEntity(this.game.levelUpMeter);	
			}
			
			if (this.levelProgress()) {
				this.game.levelUpMeter = this.game.progressBar(1, 0, this.levelProgress());
				this.game.stage.addEntity(this.game.levelUpMeter);				
			}
		}
	});
}

Player.prototype.bomb = function() {
	if (this.levelProgress() > 7) {
		this.game.util.playSound('./sounds/bomb.wav');
		this.exp = 0;

		this.game.destroyAllCoins();

		var bombSprite = new this.game.Sprite([new this.game.Grid(this.game.width, this.game.height, null, 1)]);
		var bombEntity = new this.game.Entity('bomb', bombSprite, 0, this.game.height - 1, null, null, this.game.stage);

		function moveUpBomb() {
			bombEntity.moveUp();

			if (bombEntity.y >= -1 * this.game.height ) {
				setTimeout(() => {
					moveUpBomb.call(this);
				}, 10);
			} else {
				bombEntity.destroy();
			}
		}

		moveUpBomb.call(this);
	}
}

Player.prototype.expForNextLevel = function(level) {
	if (level == 0) {
		return 0;
	} else {
		level = level || this.level;
	}

	return 5 + level*2;
}

Player.prototype.levelProgress = function() {
	return Math.floor((this.exp / this.expForNextLevel()) * this.game.width - 2);
}

Player.prototype.timeSinceLastMove = function() {
	return Date.now() - this.lastMove;
}

Player.prototype.tick = function(delta) {
	this.game.Entity.prototype.tick.call(this, ...arguments);

	var threshold = 1000 / this.speed;

	if (this.timeSinceLastMove() >= threshold) {
		if (this.up) {
			this.moveUp();
		} else if (this.down) {
			this.moveDown();
		}
		
		if (this.left) {
			this.moveLeft();	
		} else if (this.right) {
			this.moveRight();	
		}

		this.lastMove = Date.now();
	}
}

Player.prototype.coinThreshold = function() {
	return this.expForNextLevel() / 2;
}

module.exports = Player;