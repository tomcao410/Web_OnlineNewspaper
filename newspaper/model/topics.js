var db = require('../utils/db');
module.exports = {
    all : () => {
        return db.load('select C.*, SC.* from categories as C, SubCategories as SC where SC.categoryId = C.id');
    }
}
