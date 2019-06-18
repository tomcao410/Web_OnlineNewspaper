var db = require('../utils/db');


module.exports = {
    all : () => {
        return db.load('select * from users');
    },

    findUser: username => {
      return db.findUser(username);
    },

    register : (username, password, fullname, dob, email) => {
      return db.register(username, password, fullname, dob, email);
    }
}
