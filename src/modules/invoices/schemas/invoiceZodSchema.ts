import { z } from "zod";

// Schema de validación para login
export const invoiceSchema = z.object({
    amount: z.number(),
    assignedId: z.uuid(),
    urlInvoice: z.string()
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
