"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAssignment = exports.updateAssignment = exports.getAssignmentByRequesterId = exports.getAssignmentById = exports.getAllAssignments = exports.createAssignment = void 0;
const assignmentsService_1 = require("./assignmentsService");
const assignmentsZodSchema_1 = require("./schemas/assignmentsZodSchema");
const zod_1 = require("zod");
const assignmentsService = new assignmentsService_1.AssignmentsService();
const createAssignment = async (req, res) => {
    try {
        const validatedData = assignmentsZodSchema_1.createAssignmentSchema.parse(req.body);
        const record = await assignmentsService.createAssignment(validatedData);
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
const getAllAssignments = async (req, res) => {
    try {
        const pagination = {
            page: Number.parseInt(req.query.page || "1", 10),
            pageSize: Number.parseInt(req.query.pageSize || "10", 10),
            sortBy: req.query.sortBy || undefined,
            sortOrder: req.query.sortOrder,
            search: req.query.search || undefined,
            status: req.query.status || undefined,
        };
        const result = await assignmentsService.getAllAssignments(pagination);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllAssignments = getAllAssignments;
const getAssignmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await assignmentsService.getAssignmentById(id);
        res.json(record);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getAssignmentById = getAssignmentById;
const getAssignmentByRequesterId = async (req, res) => {
    try {
        const { id } = req.params;
        const record = await assignmentsService.getAssignmentByRequesterId(id);
        res.json(record);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getAssignmentByRequesterId = getAssignmentByRequesterId;
const updateAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = assignmentsZodSchema_1.updateAssignmentSchema.parse(req.body);
        const record = await assignmentsService.updateAssignment(id, validatedData);
        res.json(record);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(404).json({ error: error.message });
    }
};
exports.updateAssignment = updateAssignment;
const deleteAssignment = async (req, res) => {
    try {
        const { id } = req.params;
        await assignmentsService.deleteAssignment(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteAssignment = deleteAssignment;
