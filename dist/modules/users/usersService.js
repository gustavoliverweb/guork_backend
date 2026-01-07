"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const usersRepository_1 = require("./usersRepository");
class UserService {
    constructor() {
        this.userRepository = new usersRepository_1.UserRepository();
    }
    async createUser(data) {
        // Verificar si el email ya existe
        const existingEmail = await this.userRepository.findByEmail(data.email);
        if (existingEmail) {
            throw new Error("Email already exists");
        }
        const profiles = JSON.parse(data.profiles || "[]");
        // Verificar si el DNI ya existe
        if (data.dni) {
            const existingDni = await this.userRepository.findByDni(data.dni);
            if (existingDni) {
                throw new Error("DNI already exists");
            }
        }
        let hashedPassword;
        const userData = { ...data, birthdate: undefined };
        // Hash password
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
        const user = await this.userRepository.create({
            ...userData,
            role: userData.role || "user",
        });
        // Asociar perfiles si llegan desde el front
        if (Array.isArray(profiles) && profiles.length > 0) {
            await user.$set("profiles", profiles);
        }
        return user.toJSON();
    }
    async getAllUsers(pagination) {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.userRepository.findAll(pagination);
        const response = {
            items: rows.map((user) => user.toJSON()),
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
        return response;
    }
    async getUserById(id) {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error("User not found");
        }
        return user.toJSON();
    }
    async updateUser(id, data) {
        const user = await this.userRepository.update(id, {
            ...data,
            birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
        });
        if (Array.isArray(data.profiles)) {
            await user.$set("profiles", data.profiles);
        }
        if (!user) {
            throw new Error("User not found");
        }
        return user.toJSON();
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findByEmail(email);
        return user ? user.toJSON() : null;
    }
    async deleteUser(id) {
        const deleted = await this.userRepository.delete(id);
        if (!deleted) {
            throw new Error("User not found");
        }
    }
}
exports.UserService = UserService;
