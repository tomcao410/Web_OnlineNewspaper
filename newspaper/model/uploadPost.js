var db = require('../utils/db');
module.exports = {
    addPost : (entity, idField) => {
        return db.add("Posts", entity);
    },
    delPost : (idField, id) => {
        return db.delete("Posts", idField, id);
    },
    editPost: (entity, idField) => {
        return db.update("Posts", idField, entity);
    },
}