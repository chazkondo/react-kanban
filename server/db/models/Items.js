const bookshelf = require('./bookshelf')

const Items = bookshelf.Model.extend({
  tableName: 'items',
  idAttribute: 'id',
  hasTimestamps: true
})

module.exports = Items