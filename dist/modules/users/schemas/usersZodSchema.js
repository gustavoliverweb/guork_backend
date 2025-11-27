"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
// Schema de validación para creación de usuario
exports.createUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Invalid email format"),
    phone: zod_1.z.string().optional(),
    password: zod_1.z.string().min(6).optional(),
    dni: zod_1.z.string().min(1).optional(),
    birthdate: zod_1.z.string().min(1).optional(),
    address: zod_1.z.string().min(1).optional(),
    postalCode: zod_1.z.string().optional(),
    dniImg: zod_1.z.string().optional(),
    profileImg: zod_1.z.string().optional(),
    role: zod_1.z.enum(["user", "admin", "expert"]).optional(),
    profiles: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
// Schema de validación para actualización de usuario
exports.updateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().optional(),
    dni: zod_1.z.string().optional(),
    birthdate: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    postalCode: zod_1.z.string().optional(),
    dniImg: zod_1.z.string().optional(),
    profileImg: zod_1.z.string().optional(),
    role: zod_1.z.enum(["user", "admin", "expert"]).optional(),
    profiles: zod_1.z.array(zod_1.z.string().uuid()).optional(),
});
// Schema de validación para login
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
