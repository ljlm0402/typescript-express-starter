import { Knex } from 'knex';

export const up = (knex: Knex): Promise<void> => {
  return knex.schema.createTable('users', table => {
    table.bigIncrements('id').unsigned().primary();
    table.string('email', 45).notNullable();
    table.string('password', 255).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

export const down = (knex: Knex): Promise<void> => {
  return knex.schema.dropTable('users');
};
