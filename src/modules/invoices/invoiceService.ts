
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import { InvoicesRepository } from "./invoiceRepository";
import InvoiceModel from "./models/invoiceModel";
import { InvoiceInput } from "./schemas/invoiceZodSchema";

export class InvoicesService {
    private invoicesRepository: InvoicesRepository;

    constructor() {
        this.invoicesRepository = new InvoicesRepository();
    }

    async createInvoices(
        data: InvoiceInput
    ): Promise<InvoiceModel> {
        const record = await this.invoicesRepository.create({
            ...data,
        });
        return record;
    }

    async getAllInvoicess(
        pagination: PaginationRequest
    ): Promise<PaginationResponse<InvoiceModel>> {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.invoicesRepository.findAll(
            pagination
        );

        return {
            items: rows,
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
    }

    async getInvoicesById(id: string): Promise<InvoiceModel> {
        const record = await this.invoicesRepository.findById(id);
        if (!record) throw new Error("Invoices not found");
        return record;
    }
    async getInvoicesByRequesterId(id: string): Promise<{ rows: InvoiceModel[] }> {
        const records = await this.invoicesRepository.findByRequestId(id);
        if (!records) throw new Error("Invoices not found");
        return {
            rows: records
        };
    }

    async updateInvoices(
        id: string,
        data: InvoiceInput
    ): Promise<InvoiceModel> {
        const record = await this.invoicesRepository.update(id, data);
        if (!record) throw new Error("Invoices not found");
        return record;
    }

    async deleteInvoices(id: string): Promise<void> {
        const deleted = await this.invoicesRepository.delete(id);
        if (!deleted) throw new Error("Invoices not found");
    }
}
