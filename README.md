# node-database-migrations

A comparison of various database migration tools in NodeJs with examples

> Umzug or Knex Migrate are currently my personal choices in Node database migration libraries as they are so flexible, support async/await and TypeScript.

# Umzug

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

Where `migrate` is an alias for `ts-node index.ts` in `package.json`:

```
"scripts: {
  "migrate": "ts-node index.ts"
}
```

# Knex

Is a simple to use migration runner with a few typescript gotchas to start with but a sensible fluent function style migrator similar to Uzmug.

First add Knex and typescript - it also needs `ts-node`:

```bash
npm i knex typescript ts-node --save-dev
```

Create a configuration file using Typescript:

```bash
knex init -x ts
```

Setup an environment:

```typescript
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
```

Add a migration using the Knex CLI helper:

```bash
npx knex migrate:make create_basket_table
```

You can then add your implementation:

```typescript
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
```

To migrate up:

```bash
npx knex migrate:latest --env local
```

To migrate a singular step:

```bash
npx knex migrate:up --env local
```

To migrate all the way down:

```bash
npx knex migrate:rollback --env local
```

If you don't have a default environment and do not pass it via `--env <environment name>` you will get the following error:

```text
Requiring external module ts-node/register
knex: Required configuration option 'client' is missing.
Error: knex: Required configuration option 'client' is missing.
```

- See [Migration CLI documentation](https://knexjs.org/guide/migrations.html#migration-cli)

# db-migrate

> This project is no longer maintained however it's mentioned all over the place and seems pretty intuituve and simple

These migrations are old-school callbacks and pretty ugly.

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

An example migration file `migrations/20240429154243-alter-basket-table.js`:

```javascript
"use strict";

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function (db, callback) {
  db.addColumn(
    "basket",
    "created_utc",
    {
      type: "int",
    },
    callback
  );
};

exports.down = function (db) {
  return db.removeColumn("basket", "created_utc");
};

exports._meta = {
  version: 1,
};
```

To migrate all the way up:

```bash
npx db-migrate up --config ./config/database.json -e local
```

To migrate all the way down:

```bash
npx db-migrate down --config ./config/database.json -e local
```

If you want to migrate down one step you can pass the `-c` (count) parameter:

```bash
npx db-migrate down -c 1 --config ./config/database.json -e local
```
