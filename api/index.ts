import serverless from "serverless-http";
import app from "../src/app";
import sequelize from "../src/config/database";

let isDBConnected = false;

// Middleware antes de Express
app.use(async (req, res, next) => {
  if (!isDBConnected) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected for this request");
      isDBConnected = true;
    } catch (err) {
      console.error("❌ DB connection failed:", err);
    }
  }
  next();
});

// El handler FINAL (sin envolver nada más)
export const handler = serverless(app);
export default handler;
