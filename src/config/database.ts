import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";
import { models } from "../models";

dotenv.config({ quiet: true });

// --- MODIFICACIÓN CLAVE ---
// 1. Definimos una configuración base, asumiendo que el dialecto es Postgres.
const dialectConfig: any = {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
    // 2. Usamos 'require' condicionalmente para el driver 'pg'.
    // Esto previene que Sequelize intente cargar 'pg' al inicio si Vercel lo borró.
    // Esto es un hack común para Vercel/Serverless
    // El try/catch es para entornos que no permiten require dinámico
    driver: (() => {
      try {
        return require('pg');
      } catch (e) {
        console.warn("Could not load 'pg' driver dynamically. Assuming it will be available at runtime.");
        return 'pg';
      }
    })(),
  },
};
// ----------------------------


const sequelize = new Sequelize(process.env.DATABASE_URL || "", {
  ...dialectConfig, // Aplicamos la configuración modificada
  logging: false,
  models,
});

export default sequelize;
