"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("./authService");
const usersZodSchema_1 = require("../users/schemas/usersZodSchema");
const authZodSchema_1 = require("./schemas/authZodSchema");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersService_1 = require("../users/usersService");
const mailChimpService_1 = require("../../shared/services/mailChimpService");
class AuthController {
    constructor() {
        this.register = async (req, res) => {
            try {
                const validatedData = usersZodSchema_1.createUserSchema.parse(req.body);
                const ip = req.headers["x-forwarded-for"] ||
                    req.socket.remoteAddress ||
                    "unknown";
                if (req.file) {
                    // Si se ha subido un archivo, asignar la ruta al campo avatarUrl
                }
                const result = await this.authService.register(validatedData, ip);
                this.mandrill.sendRegisterSuccess(req.body.email, '', 'Proceso de registro éxitoso');
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
                if (!req.body.token) {
                    req.body.token = "";
                }
                const validatedData = authZodSchema_1.loginSchema.parse(req.body);
                const ip = req.headers["x-forwarded-for"] ||
                    req.socket.remoteAddress ||
                    "unknown";
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
        this.loginByGoogle = async (req, res) => {
            try {
                console.log("asd");
                const ip = req.headers["x-forwarded-for"] ||
                    req.socket.remoteAddress ||
                    "unknown";
                const result = await this.authService.loginByGoogle(req.body, ip);
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
        this.resetPasswordCtrl = async (req, res) => {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ message: "Email es requerido" });
                    return;
                }
                const user = await this.userService.getUserByEmail(email);
                if (!user) {
                    res.status(404).json({ message: "Usuario no encontrado" });
                    return;
                }
                const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET);
                console.log("Token de restablecimiento de contraseña generado:", token);
                // Guardar el token en la base de datos
                await this.authService.createPasswordResetRequest(token, user.id);
                // Enviar el email de restablecimiento de contraseña
                await this.mandrill.sendPasswordResetRequest(email, `https://panel.guork.es/forgotPassword?token=${token}`, 'Restablece tu contraseña');
                res
                    .status(200)
                    .json({ message: "Email de restablecimiento de contraseña enviado" });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({
                    message: "Error al enviar el request de restablecimiento de contraseña",
                });
            }
        };
        this.updatePasswordCtrl = async (req, res) => {
            try {
                const { newPassword, token } = req.body;
                if (!newPassword || !token) {
                    res
                        .status(400)
                        .json({ message: "Nueva contraseña y token son requeridos" });
                    return;
                }
                // const user = await this.userService.getUserByEmail(email);
                // if (!user) {
                //   res.status(404).json({ message: "Usuario no encontrado" });
                //   return;
                // }
                const passwordReset = await this.authService.findPasswordResetRequestByToken(token);
                if (!passwordReset) {
                    res
                        .status(404)
                        .json({ message: "Token de restablecimiento no encontrado" });
                    return;
                }
                // if (passwordReset.userId !== user.id) {
                //   res.status(403).json({ message: "Token no válido para este usuario" });
                //   return;
                // }
                await this.authService.deletePasswordResetRequest(token);
                const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
                await this.userService.updateUser(passwordReset.userId, {
                    password: passwordHash,
                });
                // Enviar confirmación de cambio de contraseña
                res.status(200).json({ message: "Contraseña actualizada exitosamente" });
            }
            catch (error) {
                res.status(500).json({ message: "Error al actualizar la contraseña" });
            }
        };
        this.authService = new authService_1.AuthService();
        this.userService = new usersService_1.UserService();
        this.mandrill = new mailChimpService_1.MailChimpService();
    }
}
exports.AuthController = AuthController;
