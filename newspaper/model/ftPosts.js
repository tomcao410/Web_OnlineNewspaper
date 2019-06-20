var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, P.publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and P.approval = 1 and U.id = P.authorId and P.views < (select max(views) from Posts) order by P.views DESC limit 2');
    },
    topMost : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, P.publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and U.id = P.authorId and P.approval = 1 and P.views = (select max(views) from Posts) order by P.views DESC limit 1');
    },
    topTenTopics : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, max(P.publishDate) as publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and P.approval = 1 and U.id = P.authorId group by SC.subCategoryName, C.categoryName order by publishDate limit 10');
    },
}
