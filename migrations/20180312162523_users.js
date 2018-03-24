
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', table => {
        table.uuid('id').primary();
        table.string('email').notNullable().unique();
        table.string('password_digest').notNullable();
        table.boolean('confirmed').notNull().defaultTo(0);
        table.string('confirmationToken', 1000).defaultTo('');
        table.string('avatar', 1000).defaultTo('');
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
