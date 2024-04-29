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

Then to migrate up:

```bash
npm run migrate up
```

And to migrate down:

```
npm run migrate down
```

# db-migrate

> This project is no longer maintained however it's mentioned all over the place and seems pretty intuituve and simple

- GitHub Repository - https://github.com/db-migrate/node-db-migrate
- Documentation - https://db-migrate.readthedocs.io/en/latest/

You will need the base `db-migrate` and the `db-migrate-mysql` dialect package:

```bash
npm install db-migrate
npm install db-migrate-mysql
```

Create a `database.json` file and an environment (like dev, test, prod) target called `local`:

```json
{
  "local": {
    "driver": "mysql",
    "host": "127.0.0.1",
    "user": "basket",
    "password": "basket",
    "database": "basket"
  }
}
```

Based on the above your migrate command will be:

```bash
npx db-migrate --config config/database.json -e local
```

> Note: You have to specify the relative path to the config file if you add `db-migrate` as a `migrate` script in `package.json`

Use the `create-migration` helper to create a migration (note you have to specify the `--config` even though it's probably not used):

```bash
npx db-migrate create create-basket-table --config ./config/database.json -e local
```

To migrate all the way up:

```bash
db-migrate % npx db-migrate up --config ./config/database.json -e local
```

To migrate all the way down:

```bash
db-migrate % npx db-migrate down --config ./config/database.json -e local
```

If you want to migrate down one step you can pass the `-c` (count) parameter:

```bash
db-migrate % npx db-migrate down -c 1 --config ./config/database.json -e local
```
