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
    disapprovePost : (idField, id) => {
        return db.disapprovalUpdate(idField, id);
    },
    approvePost : (idField, id) => {
        return db.approvalUpdate(idField, id);
    },
    publishDateUpdate : (idField, id, dateString) => {
        return db.publishDateUpdate(idField, id, dateString);
    }
}