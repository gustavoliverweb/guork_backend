import { z } from "zod";

// Schema de validación para login
export const invoiceSchema = z.object({
  amount: z.number(),
  assignmentId: z.uuid(),
  purchaseOrder: z.number().optional(),
  urlInvoice: z.string(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
