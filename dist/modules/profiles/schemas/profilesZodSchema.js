"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.createProfileSchema = void 0;
const zod_1 = require("zod");
exports.createProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    status: zod_1.z.string().min(1).optional(),
    descriptions: zod_1.z.string().optional(),
});
exports.updateProfileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
    status: zod_1.z.string().min(1).optional(),
    descriptions: zod_1.z.string().optional(),
});
