var db = require('../utils/db');
module.exports = {
    comments : () => {
        return db.load('insert into comments(postId, userId, commentContent) values');
    },
}