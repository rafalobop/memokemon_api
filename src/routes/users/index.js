const nameModule = "users/";

module.exports = (define) => {
    define(nameModule+'register/' , require('./src/register'));
    define(nameModule+'login/' , require('./src/login'));
    define(nameModule+'changepass/' , require('./src/change-pass'));
    define(nameModule+'forgetpass/' , require('./src/forget-pass'));
    define(nameModule+'restorepass/', require('./src/restore-pass'))
    define(nameModule+'getRanking/' , require('./src/get-ranking'));
    define(nameModule+'deleteUser/', require('./src/delete-user'))
    define(nameModule+'updateUser/', require('./src/update-user'))
};