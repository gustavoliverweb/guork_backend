"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInvoicesByRequesterId = exports.createAssignment = void 0;
const invoiceZodSchema_1 = require("./schemas/invoiceZodSchema");
const zod_1 = require("zod");
const invoiceService_1 = require("./invoiceService");
const invoicesService = new invoiceService_1.InvoicesService();
const createAssignment = async (req, res) => {
    try {
        const validatedData = invoiceZodSchema_1.invoiceSchema.parse(req.body);
        const record = await invoicesService.createInvoices(validatedData);
        res.status(201).json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createAssignment = createAssignment;
const getInvoicesByRequesterId = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await invoicesService.getInvoicesByRequesterId(id);
        res.json(record);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getInvoicesByRequesterId = getInvoicesByRequesterId;
