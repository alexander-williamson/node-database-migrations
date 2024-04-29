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
  db.createTable(
    "basket",
    {
      id: { type: "int", primaryKey: true },
      user_id: "int",
    },
    callback
  );
};

exports.down = function (db) {
  return db.dropTable("basket");
};

exports._meta = {
  version: 1,
};
