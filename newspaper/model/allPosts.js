var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load("select P.id, P.title, C.categoryName, SC.subCategoryName, date(P.publishDate) as publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and U.id = P.authorId and P.approval = 1 order by P.publishDate desc");
    },
    allDefault : () => {
        return db.load("select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, SubCategories as SC, Categories as C, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = C.id and U.id = P.authorId order by P.id desc");
    },
    pageBy : (limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and U.id = P.authorId and P.approval = 1 order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    pageByCat : (catName, limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Users as U where C.categoryName = "${catName}" and P.sub_category = SC.id and SC.categoryId = P.category and C.id = P.category and P.approval = 1 and U.id = P.authorId order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    pageBySubCat : (catName, subCatName, limit, offset) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName, U.fullname from Posts as P, Categories as C, SubCategories as SC, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and P.approval = 1 and C.categoryName = "${catName}" and SC.subCategoryName = "${subCatName}" and U.id = P.authorId order by P.publishDate desc limit ${limit} offset ${offset}`);
    },
    byCat : (catName) => {
        return db.load(`select P.* from Posts as P, Categories as C where P.category = C.id and C.categoryName = "${catName}" and P.approval = 1`);
    },
    bySubCat : (catName, subCatName) => {
        return db.load(`select P.* from Posts as P, Categories as C, SubCategories as SC where P.category = C.id and P.approval = 1 and P.sub_category = SC.id and C.categoryName = "${catName}" and SC.subCategoryName = "${subCatName}"`);
    },
    byPostId : (id) => {
        return db.load(`select P.*, C.categoryName, SC.subCategoryName from Posts as P, Categories as C, SubCategories as SC where P.id = ${id} and C.id = SC.categoryId and C.id = P.category and SC.id = P.sub_category`);
    },
    newestPostId: () => {
        return db.load("select max(id) as id from Posts");
    },
    
    loadtags : () =>{
        return db.load("select * from tags;");
    },

}