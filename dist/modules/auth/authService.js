"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const usersRepository_1 = require("../users/usersRepository");
const authRepository_1 = require("./authRepository");
class AuthService {
    constructor() {
        this.userRepository = new usersRepository_1.UserRepository();
        this.authRepository = new authRepository_1.AuthRepository();
    }
    userToResponse(user) {
        const { password, createdAt, updatedAt, ...userResponse } = user.toJSON();
        return userResponse;
    }
    async register(data, ip) {
        // Verificar si el email ya existe
        const existingEmail = await this.userRepository.findByEmail(data.email);
        if (existingEmail) {
            throw new Error("Email already exists");
        }
        // Verificar si el DNI ya existe
        if (data.dni) {
            const existingDni = await this.userRepository.findByDni(data.dni);
            if (existingDni) {
                throw new Error("DNI already exists");
            }
        }
        // Hash password
        let hashedPassword;
        const userData = { ...data, birthdate: undefined };
        if (data.password) {
            hashedPassword = await bcrypt_1.default.hash(data.password, 10);
            userData.password = hashedPassword;
        }
        if (data.birthdate) {
            userData.birthdate = new Date(data.birthdate);
        }
        else {
            delete userData.birthdate;
        }
        // Crear usuario
        let user = await this.userRepository.create({
            ...userData,
            role: data.role || "user",
        });
        // Asociar perfiles si llegan desde el front
        if (Array.isArray(data.profiles) && data.profiles.length > 0) {
            await user.$set("profiles", data.profiles);
            // Recargar usuario con perfiles incluidos para la respuesta
            user = (await this.userRepository.findById(user.id));
        }
        // Generar token
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
        // Guardar sesión
        await this.authRepository.createSession(token, ip, user.id, '');
        return {
            user: this.userToResponse(user),
            token,
        };
    }
    async login(data, ip) {
        // Buscar usuario
        const user = await this.userRepository.findByEmail(data.email);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        // Verificar password
        const isValid = await bcrypt_1.default.compare(data.password, user.password || "");
        if (!isValid) {
            throw new Error("Invalid credentials");
        }
        // Generar token
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET);
        // Guardar sesión
        await this.authRepository.createSession(token, ip, user.id, data.token);
        return {
            user: this.userToResponse(user),
            token,
        };
    }
    async logout(token) {
        const deleted = await this.authRepository.deleteSession(token);
        if (!deleted) {
            throw new Error("Session not found");
        }
    }
}
exports.AuthService = AuthService;
