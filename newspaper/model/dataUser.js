var db = require('../utils/db');
module.exports = {
    comments : () => {
        return db.load('select C.*, P.title, P.id, U.fullname from comments as C, posts as P, users as U where P.id = C.postId and C.userId = U.id');
    },
    newestCmtId : () => {
        return db.load('select C.* from comments as C where C.commentId = (select max(commentId) from comments)');
    },
    inforuser : () =>{
        return db.load('select * from users where id = 1');
    }
}