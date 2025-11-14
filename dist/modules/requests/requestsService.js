"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsService = void 0;
const requestsRepository_1 = require("./requestsRepository");
class RequestsService {
    constructor() {
        this.requestsRepository = new requestsRepository_1.RequestsRepository();
    }
    async createRequest(data) {
        const record = await this.requestsRepository.create({
            ...data,
            status: data.status || "in-progress",
        });
        return record;
    }
    async getAllRequests(pagination) {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.requestsRepository.findAll(pagination);
        return {
            items: rows,
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
    }
    async getRequestById(id) {
        const record = await this.requestsRepository.findById(id);
        if (!record)
            throw new Error("Request not found");
        return record;
    }
    async updateRequest(id, data) {
        const record = await this.requestsRepository.update(id, data);
        if (!record)
            throw new Error("Request not found");
        return record;
    }
    async deleteRequest(id) {
        const deleted = await this.requestsRepository.delete(id);
        if (!deleted)
            throw new Error("Request not found");
    }
}
exports.RequestsService = RequestsService;
