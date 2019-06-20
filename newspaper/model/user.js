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
    },

    update : (idField, entity) => {
      return db.update('users', idField, entity);
    },

    loadPosts : userID => {
      return db.load(`SELECT *, DATE_FORMAT(publishDate, "%Y-%m-%d") as publishDate FROM posts WHERE authorID = ${userID}`);
    }
}
