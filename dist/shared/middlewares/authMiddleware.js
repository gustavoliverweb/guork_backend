"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionModel_1 = __importDefault(require("../../modules/auth/models/sessionModel"));
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Token not provided" });
            return;
        }
        const token = authHeader.split(" ")[1];
        // Verify JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Check if session exists in database
        const session = await sessionModel_1.default.findOne({ where: { token } });
        if (!session) {
            res.status(401).json({ message: "Invalid or expired session" });
            return;
        }
        // Verify that the session belongs to the user in the token
        if (session.userId !== decoded.userId) {
            res.status(401).json({ message: "Session does not belong to user" });
            return;
        }
        // Attach user info to request for use in controllers
        req.userId = decoded.userId;
        req.role = decoded.role;
        req.token = token;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({ message: "Token expired" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.authMiddleware = authMiddleware;
