'use strict';

var util = require('./util');

var Grid = function(width, height, data, defaultValue) {
	this.width = width || 0;
	this.height = height || 0;
	this.defaultValue = defaultValue;

	this.data = data || util.createGrid(width, height, defaultValue);
}

Grid.prototype.clear = function() {
	this.data = util.createGrid(this.width, this.height, this.defaultValue);
}

Grid.prototype.getPoint = function(x, y) {
	if (this.data[y]) {
		if (this.data[y][x]) {
			return this.data[y][x];		
		} else {
			if (this.data[y][x] != 0) {
				return null;
			} else {
				return 0;
			}
		}
	}	else {
		return null;
	}
}

Grid.prototype.paint = function(callback, xOffset, yOffset, width, height) {
	xOffset = xOffset || 0;
	yOffset = yOffset || 0;
	width = width || this.width - xOffset;
	height = height || this.height - yOffset;

	let result = new Grid(width, height, null, null);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			let x = i + xOffset;
			let y = j + yOffset;
			result.setPoint(i, j, callback(x, y, i, j, this.getPoint(x, y)));
		}
	}

	// returns a Grid that contains the results of the callbacks on each cell
	return result;
}

Grid.prototype.flatten = function(x, y, width, height, includeEmpty) {
	x = x || 0;
	y = y || 0;
	width = width || this.width - x;
	height = height || this.height - y;

	let result = [];

	this.paint((x, y, i, j, v) => {
		if (v || includeEmpty) {
			result.push({
				x: x,
				y: y,
				v: v
			});
		}
	});

	return result;
}

Grid.prototype.setPoint = function(x, y, value) {
	if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
		this.data[y][x] = value;
	}
}

Grid.prototype.setBox = function(x, y, width, height, value) {
	this.paint((x, y, i, j) => {
		this.setPoint(x, y, value);
	}, x, y, width, height);
}

Grid.prototype.drawImage = function(grid, x, y, transparent) {
	this.paint((x_, y_, i, j) => {
		if ((grid.getPoint(i, j) || !transparent)) {
			this.setPoint(x_, y_, grid.getPoint(i, j));
		}
	}, x, y, grid.width, grid.height);
}

module.exports = Grid;