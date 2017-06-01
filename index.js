var ConsoleMonome = require('./lib/consoleMonome');

var width = 16;
var height = 8;

var CoinGrab = require('./games/demo/coingrab');
var coinGrab = new CoinGrab({width, height, monome: new ConsoleMonome()});

coinGrab.play();