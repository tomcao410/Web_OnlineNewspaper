var db = require('../utils/db');

module.exports = {
    all : () => {
        return db.load('select * from users');
    },
    login : (username, password) => {
        return db.login(username, password);
    }
}