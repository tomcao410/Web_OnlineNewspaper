var db = require('../utils/db');
module.exports = {
    comments : () => {
        return db.load('select C.*, P.title, U.fullname from comments as C, posts as P, users as U where P.id = C.postId and C.userId = U.id');
    },
}