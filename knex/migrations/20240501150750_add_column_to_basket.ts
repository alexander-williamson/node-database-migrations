import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("basket", (table) => {
    table.dateTime("created_utc").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("basket", (table) => {
    table.dropColumn("created_utc");
  });
}
