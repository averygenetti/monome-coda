'use strict';

const player = require('play-sound')({});

const getRandom = function(max) {
	max = max || 16;
	return Math.floor((Math.random() * max));
}

const createGrid = function (width, height, value) {
	let newGrid = [];

	for (var y=0;y<height;y++) {
	  newGrid[y] = [];
	  for (var x=0;x<width;x++)
	    newGrid[y][x] = value;
	}

	return newGrid;
};

function playSound(name) {
	return player.play(name, function(err){
	  if (err && !err.killed) throw err
	});
};

module.exports = {
	getRandom: getRandom,
	playSound: playSound,
	createGrid: createGrid
};