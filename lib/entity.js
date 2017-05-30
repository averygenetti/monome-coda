'use strict';

const Grid = require('./grid');

var Entity = function(name, sprite, x, y, hitboxMode, alternateHitbox, stage) {
	this.sprite = sprite;

	this.name = name || 'Entity';

	this.x = x || 0;
	this.y = y || 0;

	// 0: box is solid
	// 1: only lit pixels are solid
	// 2: use alternate hitbox
	this.hitboxMode = hitboxMode || 0;

	// pass in a grid object to function as an alternate hitbox
	this.alternateHitbox = alternateHitbox || null;

	this.animationInterval = null;
	this.stage = null;

	this.destroyed = false;

	if (stage) {
		stage.addEntity(this);
	}
};

Entity.prototype.width = function() {
	return this.sprite.width();
}

Entity.prototype.height = function() {
	return this.sprite.height();
}

Entity.prototype.getFrame = function() {
	return this.sprite.getFrame();
}

Entity.prototype.getHitbox = function(flat) {
	let hitbox;

	switch (this.hitboxMode) {
		case 0:
			hitbox = new Grid(this.width(), this.height(), null, 1);
			break;
		case 1:
			hitbox = new Grid(this.width(), this.height(), this.getFrame().data, 0);
			break;
		case 2:
			hitbox = this.alternateHitbox;
			break;
	}

	if (flat) {
		return hitbox.flatten().map((cell) => {
			return {
				x: cell.x + this.x,
				y: cell.y + this.y,
				v: this.v
			};
		});
	} else {
		return hitbox;
	}
}

Entity.prototype.tick = function(delta) {
	// do a thing
	var collisions = this.collisions();

	if (collisions.length) {
		this.collide(collisions);	
	}
}

Entity.prototype.destroy = function() {
	this.destroyed = true;

	if (this.stage) {
		this.stage.removeEntity(this);
	}
}

Entity.prototype.collide = function(collisions) {

};

Entity.prototype.moveUp = function() {
	if (this.destroyed) {
		return;
	}

	let origY = this.y;

	this.y = this.y - 1;
	
	let solidCollisions = this.solidCollisions();
	let viewportCollisions = this.viewportCollisions();

	if (solidCollisions.length || viewportCollisions.length) {
		this.y = origY;
	}
}

Entity.prototype.moveDown = function() {
	if (this.destroyed) {
		return;
	}

	let origY = this.y;

	this.y = this.y + 1;

	let solidCollisions = this.solidCollisions();
	let viewportCollisions = this.viewportCollisions();

	if (solidCollisions.length || viewportCollisions.length) {
		this.y = origY;
	}
}

Entity.prototype.moveLeft = function() {
	if (this.destroyed) {
		return;
	}

	let origX = this.x;

	this.x = this.x - 1;
	
	let solidCollisions = this.solidCollisions();
	let viewportCollisions = this.viewportCollisions();

	if (solidCollisions.length || viewportCollisions.length) {
		this.x = origX;
	}
}

Entity.prototype.moveRight = function() {
	if (this.destroyed) {
		return;
	}

	let origX = this.x;

	this.x = this.x + 1;

	let solidCollisions = this.solidCollisions();
	let viewportCollisions = this.viewportCollisions();

	if (solidCollisions.length || viewportCollisions.length) {
		this.x = origX;
	}
}

Entity.prototype.collisions = function() {
	let thisHitbox = this.getHitbox(true);
	let collisions = [];

	if (this.stage) {
		let viewport = this.stage.coda.viewport;	

		let vpx1 = viewport.x;
		let vpx2 = vpx1 + viewport.width;

		let vpy1 = viewport.y;
		let vpy2 = vpy1 + viewport.height;

		thisHitbox.forEach((thisCell) => {
			if (thisCell.x < vpx1 || thisCell.x >= vpx2 || thisCell.y < vpy1 || thisCell.y >= vpy2) {
				collisions.push({
					x: thisCell.x,
					y: thisCell.y,
					viewport: viewport
				})
			}
		});

		if (this.stage.entities.length) {
			this.stage.entities.forEach((entity) => {
				if (entity == this) {
					return;
				}

				let hitbox = entity.getHitbox(true);

				hitbox.forEach((cell) => {
					let collision = thisHitbox.filter((thisCell) => {
						return cell.x == thisCell.x && cell.y == thisCell.y;
					}).length > 0;

					if (collision) {
						collisions.push({
							x: cell.x,
							y: cell.y,
							entity: entity
						});
					}
				});
			});
		}
	}

	return collisions;
}

Entity.prototype.solidCollisions = function() {
	let collisions = this.collisions();

	if (this.isSolid && collisions.length) {
		return collisions.filter((collision) => {
			return collision.entity && collision.entity.isSolid;
		});
	} else {
		return [];
	}
}

Entity.prototype.viewportCollisions = function() {
	let collisions = this.collisions();

	if (this.collidesWithViewport && collisions.length) {
		return collisions.filter((collision) => {
			return collision.viewport;
		});
	} else {
		return [];
	}
}

module.exports = Entity;

