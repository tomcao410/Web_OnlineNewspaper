var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load('select * from posts');
    },
    category : () => {
        return db.load('select P.* from posts as P, subCategories as SC where P.category = SC.categoryId and P.sub_category = SC.id');
    }
}