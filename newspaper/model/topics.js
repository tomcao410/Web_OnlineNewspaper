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
    catById : (id) => {
        return db.load(`select C.* from Categories as C where C.id = ${id}`);
    }, 
    subCatByCatId : (id) => {
        return db.load(`select SC.* from SubCategories as SC, Categories as C where SC.categoryId = C.id and C.id = ${id}`);
    },
    subCatDetail: (catId, subCatId) => {
        return db.load(`select SC.* from SubCategories as SC where SC.id = ${subCatId} and SC.categoryId = ${catId}`);
    },
    topicMng : () => {
        return db.load('select SC.categoryId, SC.id, SC.subCategoryName, C.categoryName from categories as C, subCategories as SC where SC.categoryId = C.id');
    }
}
