import { Request, Response } from "express";
import { AssignmentsService } from "./assignmentsService";
import {
  createAssignmentSchema,
  updateAssignmentSchema,
} from "./schemas/assignmentsZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";

const assignmentsService = new AssignmentsService();

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const validatedData = createAssignmentSchema.parse(req.body);
    const record = await assignmentsService.createAssignment(validatedData);
    res.status(201).json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const pagination: PaginationRequest = {
      page: Number.parseInt((req.query.page as string) || "1", 10),
      pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
      sortBy: (req.query.sortBy as string) || undefined,
      sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
      search: (req.query.search as string) || undefined,
      status: (req.query.status as string) || undefined,
    } as any;

    const result = await assignmentsService.getAllAssignments(pagination);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const record = await assignmentsService.getAssignmentById(id);
    res.json(record);
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};

export const updateAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = updateAssignmentSchema.parse(req.body);
    const record = await assignmentsService.updateAssignment(id, validatedData);
    res.json(record);
  } catch (error: any) {
    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.issues });
    }
    res.status(404).json({ error: error.message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await assignmentsService.deleteAssignment(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(404).json({ error: error.message });
  }
};
