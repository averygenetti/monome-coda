/**
 * Builds the monome
 */

var $ = require('jquery');

var monomeContainer = $("#monomeContainer");

var width = 16;
var height = 16;

var MonomeInterface = require('./monomeInterface');
var monomeInterface = new MonomeInterface({width, height, container: monomeContainer});

var CoinGrab = require('../games/demo/coingrab');
var coinGrab = new CoinGrab({width, height, monome: monomeInterface});

coinGrab.play();