"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const database_1 = __importDefault(require("./config/database"));
const swagger_1 = require("./config/swagger");
const usersRoutes_1 = __importDefault(require("./modules/users/usersRoutes"));
const profilesRoutes_1 = __importDefault(require("./modules/profiles/profilesRoutes"));
const authRoutes_1 = __importDefault(require("./modules/auth/authRoutes"));
const requestsRoutes_1 = __importDefault(require("./modules/requests/requestsRoutes"));
const assignmentsRoutes_1 = __importDefault(require("./modules/assignments/assignmentsRoutes"));
dotenv_1.default.config({ quiet: true });
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const API_NAME = process.env.API_NAME || "api";
const API_VERSION = process.env.API_VERSION || "v1";
const BASE_PATH = `/${API_NAME}/${API_VERSION}`;
// Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Swagger documentation
app.use(`${BASE_PATH}/docs`, swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpecs));
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
// API Routes
app.use(`${BASE_PATH}/auth`, authRoutes_1.default);
app.use(`${BASE_PATH}/users`, usersRoutes_1.default);
app.use(`${BASE_PATH}/profiles`, profilesRoutes_1.default);
app.use(`${BASE_PATH}/requests`, requestsRoutes_1.default);
app.use(`${BASE_PATH}/assignments`, assignmentsRoutes_1.default);
// Initialize database
const startServer = async () => {
    try {
        // Test database connection
        await database_1.default.authenticate();
        console.log("✅ Database connected successfully");
    }
    catch (error) {
        console.error("❌ Unable to connect to database:", error);
        console.log("⚠️  Server will start without database connection");
    }
    // Start server regardless of database connection
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📚 API Docs available at http://localhost:${PORT}${BASE_PATH}/docs`);
    });
};
startServer();
exports.default = app;
