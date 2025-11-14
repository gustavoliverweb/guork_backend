import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { models } from "../models";

dotenv.config({ quiet: true });

const sequelize = new Sequelize(process.env.DATABASE_URL || "", {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false,
  models,
});

export default sequelize;
