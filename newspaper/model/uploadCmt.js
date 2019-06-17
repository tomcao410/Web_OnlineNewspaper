var db = require('../utils/db');
module.exports = {
    addComment : () => {
        return db.add('Comments', entity);
    },
}