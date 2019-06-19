var db = require('../utils/db');
module.exports = {
    search : () => {
        return db.load("select P.*, SC.subcategoryName, C.categoryName from posts as P, subcategories as SC, categories as C where P.category = C.id and P.sub_category = SC.id and SC.categoryId = C.id and (P.title like '%"+ searchtxt +"%' or P.postExcerpt like '%"+ searchtxt +"%' or P.content like '%"+ searchtxt +"%')");
    },
    searchByPage : (limit, offset, searchtxt) => {
        return db.load(`select P.*, SC.subcategoryName, C.categoryName from posts as P, subcategories as SC, categories as C where P.category = C.id and P.sub_category = SC.id and SC.categoryId = C.id and (P.title like '%${searchtxt}%' or P.postExcerpt like '%${searchtxt}%' or P.content like '%${searchtxt}%') limit ${limit} offset ${offset}`);
    },
}