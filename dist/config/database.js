"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv_1 = __importDefault(require("dotenv"));
const models_1 = require("../models");
dotenv_1.default.config({ quiet: true });
// --- MODIFICACIÓN CLAVE ---
// 1. Definimos una configuración base, asumiendo que el dialecto es Postgres.
const dialectConfig = {
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
            }
            catch (e) {
                console.warn("Could not load 'pg' driver dynamically. Assuming it will be available at runtime.");
                return 'pg';
            }
        })(),
    },
};
// ----------------------------
const sequelize = new sequelize_typescript_1.Sequelize(process.env.DATABASE_URL || "", {
    ...dialectConfig, // Aplicamos la configuración modificada
    logging: false,
    models: models_1.models,
});
exports.default = sequelize;
