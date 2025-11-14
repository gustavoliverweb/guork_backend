"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssignmentSchema = exports.createAssignmentSchema = void 0;
const zod_1 = require("zod");
exports.createAssignmentSchema = zod_1.z.object({
    requestId: zod_1.z.string().uuid(),
    status: zod_1.z.string().min(1).optional(),
    assignedId: zod_1.z.string().uuid(),
});
exports.updateAssignmentSchema = zod_1.z.object({
    requestId: zod_1.z.string().uuid().optional(),
    status: zod_1.z.string().min(1).optional(),
    assignedId: zod_1.z.string().uuid().optional(),
});
