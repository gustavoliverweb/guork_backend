"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRequest = exports.updateRequest = exports.getRequestById = exports.getAllRequests = exports.createRequest = void 0;
const requestsService_1 = require("./requestsService");
const requestsZodSchema_1 = require("./schemas/requestsZodSchema");
const zod_1 = require("zod");
const requestsService = new requestsService_1.RequestsService();
const createRequest = async (req, res) => {
    try {
        console.log(req.body);
        const validatedData = requestsZodSchema_1.createRequestSchema.parse(req.body);
        const record = await requestsService.createRequest(validatedData);
        res.status(201).json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createRequest = createRequest;
const getAllRequests = async (req, res) => {
    try {
        const pagination = {
            page: Number.parseInt(req.query.page || "1", 10),
            pageSize: Number.parseInt(req.query.pageSize || "10", 10),
            sortBy: req.query.sortBy || undefined,
            sortOrder: req.query.sortOrder,
            search: req.query.search || undefined,
            status: req.query.status || undefined,
        };
        const result = await requestsService.getAllRequests(pagination);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllRequests = getAllRequests;
const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await requestsService.getRequestById(id);
        res.json(record);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getRequestById = getRequestById;
const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = requestsZodSchema_1.updateRequestSchema.parse(req.body);
        const record = await requestsService.updateRequest(id, validatedData);
        res.json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(404).json({ error: error.message });
    }
};
exports.updateRequest = updateRequest;
const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;
        await requestsService.deleteRequest(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteRequest = deleteRequest;
