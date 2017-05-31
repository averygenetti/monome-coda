var Coda = require('./coda.js');

var width = 16;
var height = 8;

var CoinGrab = require('./games/demo/coingrab');
var coinGrab = new CoinGrab(width, height);

coinGrab.play();