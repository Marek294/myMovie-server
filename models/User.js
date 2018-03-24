const bookshelf = require('../bookshelf');

bookshelf.plugin(require('bookshelf-uuid'))

module.exports = bookshelf.Model.extend({
    tableName: 'users',
    uuid: true,
    hasTimestamps: true
})