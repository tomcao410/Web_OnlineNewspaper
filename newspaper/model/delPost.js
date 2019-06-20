var db = require('../utils/db');
module.exports = {
    delPost : (idField) => {
        return db.delete("Posts", idField);
    },
}