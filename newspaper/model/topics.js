var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load('select C.*, SC.* from categories as C, SubCategories as SC where SC.categoryId = C.id');
    },
    subCat : () => {
        return db.load('select * from SubCategories');
    },
    cat : () => {
        return db.load('select * from Categories');
    },
    subCatByCatId : (id) => {
        return db.load(`select SC.* from SubCategories as SC, Categories as C where SC.categoryId = C.id and C.id = 1`);
    },
    topicMng : () => {
        return db.load('select SC.categoryId, SC.id, SC.subCategoryName, C.categoryName from categories as C, subCategories as SC where SC.categoryId = C.id');
    }
}
