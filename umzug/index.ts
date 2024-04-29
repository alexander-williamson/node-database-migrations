import { Umzug } from "umzug";
import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: "127.0.0.1",
  username: "basket",
  password: "basket",
  database: "basket",
});

export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.ts", { cwd: __dirname }],
  },
  context: sequelize,
  logger: console,
});

export type Migration = typeof migrator._types.migration;

migrator.runAsCLI(); // expose the CLI
