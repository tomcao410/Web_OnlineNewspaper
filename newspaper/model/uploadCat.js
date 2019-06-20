var db = require('../utils/db');
module.exports = {
    addCat : (entity) => {
        return db.add("Categories", entity);
    },
    addSubCat : (entity) => {
        return db.add("SubCategories", entity);
    },
}