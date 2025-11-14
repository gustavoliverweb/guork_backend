"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsService = void 0;
const assignmentsRepository_1 = require("./assignmentsRepository");
class AssignmentsService {
    constructor() {
        this.assignmentsRepository = new assignmentsRepository_1.AssignmentsRepository();
    }
    async createAssignment(data) {
        const record = await this.assignmentsRepository.create({
            ...data,
            status: data.status || "assigned",
        });
        return record;
    }
    async getAllAssignments(pagination) {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.assignmentsRepository.findAll(pagination);
        return {
            items: rows,
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
    }
    async getAssignmentById(id) {
        const record = await this.assignmentsRepository.findById(id);
        if (!record)
            throw new Error("Assignment not found");
        return record;
    }
    async updateAssignment(id, data) {
        const record = await this.assignmentsRepository.update(id, data);
        if (!record)
            throw new Error("Assignment not found");
        return record;
    }
    async deleteAssignment(id) {
        const deleted = await this.assignmentsRepository.delete(id);
        if (!deleted)
            throw new Error("Assignment not found");
    }
}
exports.AssignmentsService = AssignmentsService;
