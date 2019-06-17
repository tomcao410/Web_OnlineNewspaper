var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, P.publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and W.id = P.authorId and U.id = W.id and P.views < (select max(views) from Posts) order by P.views DESC limit 2');
    },
    topMost : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, P.publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and W.id = P.authorId and U.id = W.id and P.views = (select max(views) from Posts) order by P.views DESC limit 1');
    },
    topTenTopics : () => {
        return db.load('select P.id, P.title, C.categoryName, SC.subCategoryName, max(P.publishDate) as publishDate, P.postExcerpt, P.content, P.views, P.imgLink, U.fullname from Posts as P, SubCategories as SC, Categories as C, Writer as W, Users as U where P.category = C.id and P.sub_category = SC.id and SC.categoryId = P.category and W.id = P.authorId and U.id = W.id group by P.category, P.sub_category order by publishDate');
    },
}