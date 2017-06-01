/**
 *
 */
var $ = require('jquery');

function MonomeInterface({width, height, container}) {
    this.width = width;
    this.height = height;
    this.container = container;

    this._init();
}

MonomeInterface.prototype = {
    _init() {
        this.grid = [];
        for (var row = 0; row < this.height; row++) {
            this.grid[row] = [];
            for (var col = 0; col < this.width; col++) {
                this.grid[row][col] =
                    $("<button id='" + row + "-" + col + "'/>").
                    addClass('monomeButton').
                    appendTo(this.container);
            }
            $("<br/>").appendTo(this.container);
        }
    },
    key(eventHandler){
        this.eventHandler = eventHandler;
    },
    refresh(updateArray) {
        console.log(updateArray);
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                var value = updateArray[row][col];
                var rgbValue = Math.floor(value / 15 * 255);
                this.grid[row][col].css('background-color', 'rgb(' + rgbValue + ',' + rgbValue + ',' + rgbValue +')');
            }
        }

    }
};

module.exports = MonomeInterface;