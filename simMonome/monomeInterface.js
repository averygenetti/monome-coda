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
        for (var row = 0; row < this.height; row++) {
            for (var col = 0; col < this.width; col++) {
                $("<button/>").
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
    }
};

module.exports = MonomeInterface;