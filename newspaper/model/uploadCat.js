var db = require('../utils/db');
module.exports = {
    addCat : (entity) => {
        return db.add("Categories", entity);
    },
    addSubCat : (entity) => {
        return db.add("SubCategories", entity);
    },
    delCat: (idField, id) => {
        return db.delete("Categories", idField, id);
    },
    delSubCat: (idField, id) => {
        return db.delete("SubCategories", idField, id);
    },
    delSubCatOnly: (idField, catIdField, id, catId) => {
        return db.delSubCatOnly(idField, catIdField, id, catId);
    },
    updateTopic: (entity, idField) => {
        return db.update("Categories", idField, entity);
    },
    updateSubTopic: (catIdField, subCatIdField, catId, subCatId, newName) => {
        return db.updateSubCat(catIdField, subCatIdField, catId, subCatId, newName);
    },
}