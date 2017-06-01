/**
 *
 */
function ConsoleMonome() {
    console.log('Monome created');
}

ConsoleMonome.prototype = {
    key(eventHandler){
        this.eventHandler = eventHandler;
    },
    refresh(updateArray) {
        console.log(updateArray);
    }
};

module.exports = ConsoleMonome;