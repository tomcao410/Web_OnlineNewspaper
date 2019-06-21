var db = require('../utils/db');

module.exports = {
    loadall : () => {
        return db.load('SELECT postId,tagName, count(tagName) as SoLan FROM tags GROUP by tagName');
    },
    loadtitle :() => {
        return db.load('SELECT tags.postId,posts.title,tags.tagName from tags, posts where tags.postId = posts.id');
    },
    delTag : (tagField, tagName) => {
        return db.delete("tags", tagField, tagName);
    },
    updateTag: () => {
        console.log('toi day');
        return db.load('update tags set tags.tag ='+OldTagName+'+ where tags.tag = '+NewTagName+';');
    },
}