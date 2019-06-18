var db = require('../utils/db');
module.exports = {
    uploadProfile : entity => {
        return db.add('Comments', entity);
    },
}