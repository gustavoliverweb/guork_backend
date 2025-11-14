import serverless from "serverless-http";
import app from "../../src/app";
import sequelize from "../../src/config/database";

let isInitialized = false;
let handler: any;

const initializeDB = async () => {
  if (isInitialized) return;
  try {
    console.log("Attempting database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
  isInitialized = true;
};

export default async function (req: any, res: any) {
  if (!handler) {
    await initializeDB(); // Esperamos la DB antes de inicializar serverless
    handler = serverless(app);
  }
  return handler(req, res);
}
