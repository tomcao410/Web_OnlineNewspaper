var db = require('../utils/db');
module.exports = {
    search : () => {
        return db.load("SELECT * FROM posts WHERE title like '%"+ searchtxt + "%' or postExcerpt like '%"+ searchtxt + "%' or content like '%"+ searchtxt + "%';");
        
    }
}