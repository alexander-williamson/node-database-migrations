import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("basket", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("basket");
}
