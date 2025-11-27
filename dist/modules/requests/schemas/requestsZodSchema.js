"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRequestSchema = exports.createRequestSchema = void 0;
const zod_1 = require("zod");
exports.createRequestSchema = zod_1.z.object({
    employmentType: zod_1.z.string().min(1),
    amount: zod_1.z.number().min(0),
    requesterId: zod_1.z.string().uuid(),
    status: zod_1.z.string().min(1).optional(),
    profileId: zod_1.z.string().uuid(),
    urlAgent: zod_1.z.string().min(1)
});
exports.updateRequestSchema = zod_1.z.object({
    employmentType: zod_1.z.string().min(1).optional(),
    amount: zod_1.z.number().min(0).optional(),
    requesterId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.string().min(1).optional(),
    profileId: zod_1.z.string().uuid().optional(),
});
