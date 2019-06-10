var db = require('../untils/db');
module.exports = {
    all:()=>{
        return db.load('select * from posts');
    }
}