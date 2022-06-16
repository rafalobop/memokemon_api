const nameModule = "games/";

module.exports = (define) => {
    define(nameModule+'startProgress/' , require('./src/start-progress'));
    define(nameModule+'saveGameResult/' , require('./src/save-gameResult'));
    define(nameModule+'continueGame/' , require('./src/continue-game'));
    define(nameModule+'deleteProgress/' , require('./src/delete-game'));

};