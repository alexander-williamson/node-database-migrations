import { DataTypes } from "sequelize";
import { Migration } from "../index";

export const up: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("basket", {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

export const down: Migration = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("basket");
};
