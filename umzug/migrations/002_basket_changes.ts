import { DataTypes, Sequelize } from "sequelize";
import { Migration } from "../index";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().addColumn("basket", "created_utc", {
    type: DataTypes.INTEGER,
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().removeColumn("basket", "created_utc");
};
