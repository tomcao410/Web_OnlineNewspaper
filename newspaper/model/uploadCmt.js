var db = require('../utils/db');
module.exports = {
    addComment : entity => {
        return db.add('Comments', entity);
    },
}