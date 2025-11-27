import "reflect-metadata";
import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import sequelize from "./config/database";
import { swaggerSpecs } from "./config/swagger";
import usersRoutes from "./modules/users/usersRoutes";
import profilesRoutes from "./modules/profiles/profilesRoutes";
import authRoutes from "./modules/auth/authRoutes";
import requestsRoutes from "./modules/requests/requestsRoutes";
import assignmentsRoutes from "./modules/assignments/assignmentsRoutes";
import cors from "cors";

dotenv.config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 3000;
const API_NAME = process.env.API_NAME || "api";
const API_VERSION = process.env.API_VERSION || "v1";
const BASE_PATH = `/${API_NAME}/${API_VERSION}`;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

// Swagger documentation
app.use(`${BASE_PATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// API Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/users`, usersRoutes);
app.use(`${BASE_PATH}/profiles`, profilesRoutes);
app.use(`${BASE_PATH}/requests`, requestsRoutes);
app.use(`${BASE_PATH}/assignments`, assignmentsRoutes);

// Initialize database
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Unable to connect to database:", error);
    console.log("⚠️  Server will start without database connection");
  }

  // Start server regardless of database connection
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(
      `📚 API Docs available at http://localhost:${PORT}${BASE_PATH}/docs`
    );
  });
};

startServer();

export default app;
