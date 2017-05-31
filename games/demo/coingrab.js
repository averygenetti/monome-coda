// coda says 'hi!'
var Coda = require('../../coda');

var Player = require('./player');
var Coin = require('./coin');

var CoinGrab = function(width, height, fps, gameSpeed) {
	Coda.call(this, width, height, fps, gameSpeed);
}

CoinGrab.prototype = Object.create(Coda.prototype);
CoinGrab.prototype.constructor = Coda;

CoinGrab.prototype.init = function() {
	Coda.prototype.init.call(this, ...arguments);
	this.bgm = null;

	this.stage.addEntity(this.playArea());

	this.player = new Player(this, 4, 4);
	this.player.sprite.play();

	this.gameOver = false;
	this.coinCount = 0;
	this.coinSpawnTime = 1000;
	this.lastCoinSpawnTime = Date.now();

	// left
	this.bind((x, y, s) => {
		this.player.left = s ? true : false;
	}, this.width - 3, this.height - 1);

	//down
	this.bind((x, y, s) => {
		this.player.down = s ? true : false;
	}, this.width - 2, this.height - 1);

	//right
	this.bind((x, y, s) => {
		this.player.right = s ? true : false;
	}, this.width - 1, this.height -1);

	//up
	this.bind((x, y, s) => {
		this.player.up = s ? true : false;
	}, this.width - 2, this.height - 2);

	//bomb
	this.bind((x, y, s) => {
		if (s) {
			this.player.bomb();
		}
	}, this.width - 4, this.height - 1);

	console.log('Game Started!');
};

CoinGrab.prototype.verticalBar = function(height, bright) {
	return new this.Grid(1, height || this.height, null, bright || 1);
}

CoinGrab.prototype.horizontalBar = function(width, bright) {
	return new this.Grid(width || this.width, 1, null, bright || 1);
}

CoinGrab.prototype.playArea = function() {
	var hitBox = new this.Grid(this.width,this.height);

	hitBox.drawImage(this.verticalBar(this.height), 0, 0);
	hitBox.drawImage(this.verticalBar(this.height), (this.width - 1), 0);

	hitBox.drawImage(this.horizontalBar(this.width), 0, 0);
	hitBox.drawImage(this.horizontalBar(this.width), 0, (this.height - 1));

	var sprite = new this.Sprite([], 0, 0, true);
	var entity = new this.Entity('arena', sprite, 0, 0, 2, hitBox);

	entity.isSolid = true;

	return entity;
}

CoinGrab.prototype.progressBar = function(x, y, progress) {
	var model = this.horizontalBar(progress, 8);

	var sprite = new this.Sprite([model], 0, 0, true);
	var entity = new this.Entity('arena', sprite, x, y, 1, null);

	entity.isSolid = true;

	return entity;
}

CoinGrab.prototype.healthBar = function() {
	if (!this.coinCount) {
		amount = this.height - 2;
	} else {
		var amount = (this.height - 2) - (Math.floor((this.coinCount / this.player.coinThreshold()) * (this.height - 2)));	
	}

	var model = this.verticalBar(amount, 8);

	var sprite = new this.Sprite([model], 0, 0, true);
	var entity = new this.Entity('arena', sprite, 0, this.height - 1 - amount, 1, null);

	entity.isSolid = true;

	return entity;
}

CoinGrab.prototype.timeSinceLastCoinSpawn = function() {
	return Date.now() - this.lastCoinSpawnTime;
}

CoinGrab.prototype.destroyAllCoins = function() {
	this.coinCount = 0;
	this.stage.entities = [this.playArea(), this.player];
}

CoinGrab.prototype.lose = function() {
	this.gameOver = true;

	var gameOverSprite = new this.Sprite([new this.Grid(this.width,this.height, null, 11)]);
	var gameOverEntity = new this.Entity('game over', gameOverSprite, 0, this.height - 1, null, null, this.stage);

	gameOverEntity.isGameOverEntity = true;
	
	this.stage.entities.forEach((entity) => {
		if (!entity.isGameOverEntity) {
			entity.destroy();	
		}
	});

	function moveUpGameOver() {
		gameOverEntity.moveUp();

		if (gameOverEntity.y >= -1 * this.height ) {
			setTimeout(() => {
				moveUpGameOver.call(this);
			}, 100);
		}
	}

	this.playBgm('./sounds/end.mp3');
	moveUpGameOver.call(this);
}

CoinGrab.prototype.tick = function(lastTime) {
	Coda.prototype.tick.call(this, ...arguments);

	if (this.healthMeter) {
		this.stage.removeEntity(this.healthMeter);	
	}

	if (!this.gameOver) {
		if (this.coinCount > this.player.coinThreshold()) {
			this.lose();
		}
		this.healthMeter = this.healthBar();
		this.stage.addEntity(this.healthMeter);

		if (this.timeSinceLastCoinSpawn() > this.coinSpawnTime) {
			this.stage.addEntity(new Coin(this, 2 + this.util.getRandom(this.width - 4), 2 + this.util.getRandom(this.height - 4)));
			this.coinCount++;
			
			this.lastCoinSpawnTime = Date.now();
		}
	}
};

module.exports = CoinGrab;