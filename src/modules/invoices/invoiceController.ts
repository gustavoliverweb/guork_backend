import { Request, Response } from "express";
import {
    invoiceSchema
} from "./schemas/invoiceZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { InvoicesService } from "./invoiceService";

const invoicesService = new InvoicesService();

export const createAssignment = async (req: Request, res: Response) => {
    try {
        const validatedData = invoiceSchema.parse(req.body);
        const record = await invoicesService.createInvoices(validatedData);
        res.status(201).json(record);
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
export const getInvoicesByRequesterId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const record = await invoicesService.getInvoicesByRequesterId(id);
        res.json(record);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};
