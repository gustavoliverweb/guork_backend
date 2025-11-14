import serverless from "serverless-http";
import app from "../src/app";
import sequelize from "../src/config/database";

const handler = serverless(app);

// Conexión Fire-and-Forget
(async () => {
  try {
    console.log("Attempting DB connection...");
    await sequelize.authenticate();
    console.log("✅ Database connected (fire-and-forget)");
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
})();

// Exporta el handler directamente
export default async (req: any, res: any) => {
  // Este wrapper asegura que cualquier error no bloquee la función
  try {
    return await handler(req, res);
  } catch (err) {
    console.error("Handler error:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal Serverless Error" });
    }
  }
};
