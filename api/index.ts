import serverless from "serverless-http";
import app from "../src/app";
import sequelize from "../src/config/database";

let handler: any;

const initializeDB = async () => {
  try {
    console.log("Attempting database connection...");
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
    throw err; // opcional
  }
};

export default async (req: any, res: any) => {
  if (!handler) {
    await initializeDB(); // <-- esperamos la conexión
    handler = serverless(app);
  }
  return handler(req, res);
};
