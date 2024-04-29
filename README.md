# node-database-migrations

A comparison of various database migration tools in NodeJs with examples

# Umzug

> Umzug is currently my personal choice in Node database migration libraries as it's so flexible, supports async/await and TypeScript.

Supports async TypeScript & CLI support. Based on Sequelise but you aren't forced to use the ORM side. You can use raw SQL or use a fluent interface.

- GitHub Repository - https://github.com/sequelize/umzug
- TypeScript Examples folder - https://github.com/sequelize/umzug/tree/main/examples/1-sequelize-typescript

First create a Sequelize context:

```typescript
const sequelize = new Sequelize({
  dialect: "mysql",
  host: "127.0.0.1",
  username: "basket",
  password: "basket",
  database: "basket",
});
```

Then pass that to an Umzug instance:

```typescript
export const migrator = new Umzug({
  migrations: {
    glob: ["migrations/*.ts", { cwd: __dirname }],
  },
  context: sequelize,
  logger: console,
});
```

Which needs to be exposed as a CLI if you wish to use it that way (otherwise you could use it programatically):

```typescript
migrator.runAsCLI(); // expose the CLI
```

Here's an example migration file `migrations/002_basket_changes.ts`:

```typescript
import { DataTypes } from "sequelize";
import { Migration } from "../index";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn("basket", "created_utc", {
    type: DataTypes.INTEGER,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn("basket", "created_utc");
};
```
