"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceSchema = void 0;
const zod_1 = require("zod");
// Schema de validación para login
exports.invoiceSchema = zod_1.z.object({
    amount: zod_1.z.number(),
    assignedId: zod_1.z.uuid(),
    urlInvoice: zod_1.z.string()
});
