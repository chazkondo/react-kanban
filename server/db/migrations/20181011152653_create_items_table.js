exports.up = function(knex, Promise) {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('task').notNullable();
    table.string('priority').notNullable();
    table.string('description').notNullable();
    table.string('type').notNullable();
    table.string('sortingid').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    
  }) 
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('items')
};