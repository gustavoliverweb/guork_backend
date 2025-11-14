// api/index.ts
import serverless from "serverless-http";
import app from "../src/app";
import sequelize from "../src/config/database";

let isDBConnected = false;

// Wrapper que asegura conexión a DB antes de responder
const handler = serverless(async (req: any, res: any) => {
  if (!isDBConnected) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected for this request");
      isDBConnected = true;
    } catch (err) {
      console.error("❌ DB connection failed:", err);
      // opcional: responder con error
      // return res.status(500).json({ error: "DB connection failed" });
    }
  }

  return app(req, res);
});

export default handler;
