import { Request, Response } from "express";
import { RequestsService } from "./requestsService";
import {
  createRequestSchema,
  updateRequestSchema,
} from "./schemas/requestsZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";

const requestsService = new RequestsService();

export const createRequest = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const validatedData = createRequestSchema.parse(req.body);
    const record = await requestsService.createRequest(validatedData);
    res.status(201).json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllRequests = async (req: Request, res: Response) => {
  try {
    const pagination: PaginationRequest = {
      page: Number.parseInt((req.query.page as string) || "1", 10),
      pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
      sortBy: (req.query.sortBy as string) || undefined,
      sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
      search: (req.query.search as string) || undefined,
      status: (req.query.status as string) || undefined,
    } as any;

    const result = await requestsService.getAllRequests(pagination);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await requestsService.getRequestById(id);
    res.json(record);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateRequestSchema.parse(req.body);
    const record = await requestsService.updateRequest(id, validatedData);
    res.json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(404).json({ error: error.message });
  }
};

export const deleteRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await requestsService.deleteRequest(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
