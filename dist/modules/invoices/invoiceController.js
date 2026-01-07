"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadInvoice = exports.getInvoicesByRequesterId = exports.createAssignment = exports.getAllInvoices = void 0;
const invoiceZodSchema_1 = require("./schemas/invoiceZodSchema");
const zod_1 = require("zod");
const invoiceService_1 = require("./invoiceService");
const bunnyService_1 = require("../../shared/services/bunnyService");
const invoicesService = new invoiceService_1.InvoicesService();
const bunny = new bunnyService_1.BunnyService();
const getAllInvoices = async (req, res) => {
    try {
        const pagination = {
            page: Number.parseInt(req.query.page || "1", 10),
            pageSize: Number.parseInt(req.query.pageSize || "10", 10),
            sortBy: req.query.sortBy || undefined,
            sortOrder: req.query.sortOrder,
            search: req.query.search || undefined,
            status: req.query.status || undefined,
        };
        const result = await invoicesService.getAllInvoices(pagination);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllInvoices = getAllInvoices;
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
const downloadInvoice = async (req, res) => {
    const { file } = req.body;
    try {
        const response = await bunny.download(file);
        return res.status(200).send(response);
    }
    catch (error) {
        return res.status(500).send({
            response: "Ha ocurrido un error descargando el archivo: " + error,
        });
    }
};
exports.downloadInvoice = downloadInvoice;
