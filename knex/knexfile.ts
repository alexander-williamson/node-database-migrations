import type { Knex } from "knex";

// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  local: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      database: "basket",
      port: 3306,
      user: "basket",
      password: "basket",
    },
  },
};

module.exports = config;
