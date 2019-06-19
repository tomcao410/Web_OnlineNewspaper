var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load("select P.id, P.title, C.categoryName, SC.subCategoryName, date(P.publishDate) as publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and W.id = P.authorId and U.id = W.id order by P.publishDate desc");
    },

    pageBy : (limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and W.id = P.authorId and U.id = W.id order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    pageByCat : (catName, limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Writer as W, Users as U where C.categoryName = "${catName}" and P.sub_category = SC.id and SC.categoryId = P.category and C.id = P.category and W.id = P.authorId and U.id = W.id order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    pageBySubCat : (catName, subCatName, limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and C.categoryName = "${catName}" and SC.subCategoryName = "${subCatName}" and W.id = P.authorId and U.id = W.id order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    byCat : (catName) => {
        return db.load(`select P.* from Posts as P, Categories as C where P.category = C.id and C.categoryName = "${catName}"`);
    },
    bySubCat : (catName, subCatName) => {
        return db.load(`select P.* from Posts as P, Categories as C, SubCategories as SC where P.category = C.id and P.sub_category = SC.id and C.categoryName = "${catName}" and SC.subCategoryName = "${subCatName}"`);
    },
}