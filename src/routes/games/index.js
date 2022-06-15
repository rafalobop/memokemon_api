const nameModule = "games/";

module.exports = (define) => {
    define(nameModule+'startProgress/' , require('./src/start-progress'));
    define(nameModule+'newGame/' , require('./src/new-game'));
    define(nameModule+'continueGame/' , require('./src/continue-game'));
    define(nameModule+'deleteProgress/' , require('./src/delete-game'));

};