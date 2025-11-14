import serverless from "serverless-http";
import app from "../app";
import sequelize from "../config/database";

let isDBConnected = false;

app.use(async (req, res, next) => {
  if (!isDBConnected) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected");
      isDBConnected = true;
    } catch (err) {
      console.error("❌ DB error:", err);
    }
  }
  next();
});

export const handler = serverless(app);
export default handler;