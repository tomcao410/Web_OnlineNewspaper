var db = require('../utils/db');
module.exports = {
    addPost : (entity, idField) => {
        return db.add("Posts", entity);
    },
}