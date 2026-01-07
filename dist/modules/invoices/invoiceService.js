"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesService = void 0;
const invoiceRepository_1 = require("./invoiceRepository");
class InvoicesService {
    constructor() {
        this.invoicesRepository = new invoiceRepository_1.InvoicesRepository();
    }
    async createInvoices(data) {
        const record = await this.invoicesRepository.create({
            ...data,
        });
        return record;
    }
    async getAllInvoices(pagination) {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.invoicesRepository.findAll(pagination);
        return {
            items: rows,
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
    }
    async getInvoicesById(id) {
        const record = await this.invoicesRepository.findById(id);
        if (!record)
            throw new Error("Invoices not found");
        return record;
    }
    async getLastInvoice() {
        const record = await this.invoicesRepository.findLastInvoice();
        if (!record)
            throw new Error("Invoices not found");
        return record;
    }
    async getInvoicesByRequesterId(id) {
        const records = await this.invoicesRepository.findByRequestId(id);
        if (!records)
            throw new Error("Invoices not found");
        return {
            rows: records,
        };
    }
    async updateInvoices(id, data) {
        const record = await this.invoicesRepository.update(id, data);
        if (!record)
            throw new Error("Invoices not found");
        return record;
    }
    async deleteInvoices(id) {
        const deleted = await this.invoicesRepository.delete(id);
        if (!deleted)
            throw new Error("Invoices not found");
    }
}
exports.InvoicesService = InvoicesService;
