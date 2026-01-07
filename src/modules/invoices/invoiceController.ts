import { Request, Response } from "express";
import { invoiceSchema } from "./schemas/invoiceZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { InvoicesService } from "./invoiceService";
import { BunnyService } from "../../shared/services/bunnyService";

const invoicesService = new InvoicesService();
const bunny = new BunnyService();

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const pagination: PaginationRequest = {
      page: Number.parseInt((req.query.page as string) || "1", 10),
      pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
      sortBy: (req.query.sortBy as string) || undefined,
      sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
      search: (req.query.search as string) || undefined,
      status: (req.query.status as string) || undefined,
    } as any;

    const result = await invoicesService.getAllInvoices(pagination);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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

export const downloadInvoice = async (req: Request, res: Response) => {
  const { file } = req.body;

  try {
    const response = await bunny.download(file);

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({
      response: "Ha ocurrido un error descargando el archivo: " + error,
    });
  }
};
