"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("./authService");
const usersZodSchema_1 = require("../users/schemas/usersZodSchema");
const authZodSchema_1 = require("./schemas/authZodSchema");
const zod_1 = require("zod");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const validatedData = usersZodSchema_1.createUserSchema.parse(req.body);
                const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
                const result = await this.authService.register(validatedData, ip);
                res.status(201).json(result);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ errors: error.issues });
                    return;
                }
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.login = async (req, res) => {
            try {
                const validatedData = authZodSchema_1.loginSchema.parse(req.body);
                const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
                const result = await this.authService.login(validatedData, ip);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ errors: error.issues });
                    return;
                }
                if (error instanceof Error) {
                    res.status(401).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.logout = async (req, res) => {
            try {
                const token = req.headers.authorization?.split(" ")[1];
                if (!token) {
                    res.status(401).json({ message: "Token not provided" });
                    return;
                }
                await this.authService.logout(token);
                res.status(200).json({ message: "Logout successful" });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.authService = new authService_1.AuthService();
    }
}
exports.AuthController = AuthController;
