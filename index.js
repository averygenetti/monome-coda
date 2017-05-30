// coda says 'hi!'
var Coda = require('./coda');

var width = 16;
var height = 16;

// 60 FPS!
var game = new Coda(width, height, 60, 60);

// Player class!

var Player = function(x, y) {
	var playerModel1 = new game.Grid(2, 2, [
		[1,1],
		[1,1]
	]);

	var playerSprite = new game.Sprite([playerModel1]);

	game.Entity.call(this, 'Player', playerSprite, x, y, 0, null, game.stage);

	this.speed = 7;
	this.score = 0;
	this.exp = 0;
	this.level = 1;
	
	this.isSolid = true;
	this.collidesWithViewport = true;
	this.isPlayer = true;

	this.lastMove = Date.now();
};

Player.prototype = Object.create(game.Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.levelUp = function() {
	this.level++;
	this.speed++;
	this.exp = 0;
	game.coinSpawnTime = game.coinSpawnTime * 0.85;

	game.coinCount = 0;

	game.stage.entities = [game.playArea(), this];

	if (game.levelMeter) {
		game.stage.removeEntity(game.levelMeter);	
	}
	
	game.levelMeter = game.progressBar(1, 15, this.level - 1);
	game.stage.addEntity(game.levelMeter);

	game.util.playSound('./sounds/levelup.wav');
	console.log('Level up! Level:', this.level);
}

Player.prototype.collide = function(collisions) {
	collisions.forEach((collision) => {
		if (collision.entity && !collision.entity.destroyed && collision.entity.canBePickedUp) {
			game.util.playSound('./sounds/coin.wav');

			this.score = this.score + this.level;
			this.exp++;

			collision.entity.destroy();

			if (this.exp >= this.expForNextLevel()) {
				this.levelUp();
			}

			if (game.levelUpMeter) {
				game.stage.removeEntity(game.levelUpMeter);	
			}
			
			if (this.levelProgress()) {
				game.levelUpMeter = game.progressBar(1, 0, this.levelProgress());
				game.stage.addEntity(game.levelUpMeter);				
			}
		}
	});
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
	return Math.floor((this.exp / this.expForNextLevel()) * 14);
}

Player.prototype.timeSinceLastMove = function() {
	return Date.now() - this.lastMove;
}

Player.prototype.tick = function(delta) {
	game.Entity.prototype.tick.call(this, ...arguments);

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

// Item class!

var Coin = function(x, y) {
	var model = new game.Grid(1, 1, [
		[1]
	]);

	var sprite = new game.Sprite([model]);

	game.Entity.call(this, 'Coin', sprite, x, y, 0, null, game.stage);

	this.canBePickedUp = true;
};

Coin.prototype = Object.create(game.Entity.prototype);
Coin.prototype.constructor = Coin;

Coin.prototype.destroy = function() {
	if (!this.destroyed) {
		game.coinCount--;
	}

	game.Entity.prototype.destroy.call(this, ...arguments);	
}

// Initialize our game

game.init = function() {
	Coda.prototype.init.call(this, ...arguments);
	this.bgm = null;

	this.stage.addEntity(this.playArea());

	this.player = new Player(4, 4);
	this.player.sprite.play();

	this.gameOver = false;
	this.coinCount = 0;
	this.coinSpawnTime = 1000;
	this.lastCoinSpawnTime = Date.now();

	// left
	this.bind((x, y, s) => {
		this.player.left = s ? true : false;
	}, 13, 15);

	//down
	this.bind((x, y, s) => {
		this.player.down = s ? true : false;
	}, 14, 15);

	//right
	this.bind((x, y, s) => {
		this.player.right = s ? true : false;
	}, 15, 15);

	//up
	this.bind((x, y, s) => {
		this.player.up = s ? true : false;
	}, 14, 14);

	console.log('Game Started!');
};

game.verticalBar = function(height) {
	return new game.Grid(1, height || 16, null, 1);
}

game.horizontalBar = function(width) {
	return new game.Grid(width || 16, 1, null, 1);
}

game.playArea = function() {
	var model = new game.Grid(16,16, null, 0);

	var hitBox = new game.Grid(16, 16, [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	]);

	var sprite = new game.Sprite([model], 0, 0, true);
	var entity = new game.Entity('arena', sprite, 0, 0, 2, hitBox);

	entity.isSolid = true;

	return entity;
}

game.progressBar = function(x, y, progress) {
	var model = this.horizontalBar(progress);

	var sprite = new game.Sprite([model], 0, 0, true);
	var entity = new game.Entity('arena', sprite, x, y, 1, null);

	entity.isSolid = true;

	return entity;
}

game.healthBar = function() {
	if (!this.coinCount) {
		amount = 14;
	} else {
		var amount = 14 - (Math.floor((this.coinCount / this.player.coinThreshold()) * 14));	
	}

	var model = this.verticalBar(amount);

	var sprite = new game.Sprite([model], 0, 0, true);
	var entity = new game.Entity('arena', sprite, 0, 15 - amount, 1, null);

	entity.isSolid = true;

	return entity;
}

game.timeSinceLastCoinSpawn = function() {
	return Date.now() - this.lastCoinSpawnTime;
}

game.lose = function() {
	this.gameOver = true;

	var gameOverSprite = new game.Sprite([new game.Grid(16, 16, null, 1)]);
	var gameOverEntity = new game.Entity('game over', gameOverSprite, 0, 15, null, null, game.stage);

	gameOverEntity.isGameOverEntity = true;
	
	game.stage.entities.forEach((entity) => {
		if (!entity.isGameOverEntity) {
			entity.destroy();	
		}
	});

	function moveUpGameOver() {
		gameOverEntity.moveUp();

		if (gameOverEntity.y >= -16 ) {
			setTimeout(() => {
				moveUpGameOver();
			}, 100);
		} else {
			// game.init();
			// game.stop();
			// game.play();
		}
	}

	game.playBgm('./sounds/end.mp3');
	moveUpGameOver();
}

game.tick = function(lastTime) {
	Coda.prototype.tick.call(this, ...arguments);

	if (game.healthMeter) {
		game.stage.removeEntity(game.healthMeter);	
	}

	if (!this.gameOver) {
		if (this.coinCount > this.player.coinThreshold()) {
			this.lose();
		}
		game.healthMeter = game.healthBar();
		game.stage.addEntity(game.healthMeter);

		if (this.timeSinceLastCoinSpawn() > this.coinSpawnTime) {
			this.stage.addEntity(new Coin(3 + game.util.getRandom(11), 3 + game.util.getRandom(11)));
			this.coinCount++;
			
			this.lastCoinSpawnTime = Date.now();
			// this.coinSpawnTime = this.coinSpawnTime * 0.99;
		}
	}
};

game.play();