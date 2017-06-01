/**
 *
 */
function ConsoleMonome() {
    console.log('Monome created');
}

ConsoleMonome.prototype = {
    key(x, y, s) {
        console.log(x, y, s);
    },
    refresh(updateArray) {
        console.log(updateArray);
    }
};

module.exports = ConsoleMonome;