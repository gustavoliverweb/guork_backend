import { z } from "zod";

export const createAssignmentSchema = z.object({
  requestId: z.string().uuid(),
  status: z.string().min(1).optional(),
  assignedId: z.string().uuid(),
});

export const updateAssignmentSchema = z.object({
  requestId: z.string().uuid().optional(),
  status: z.string().min(1).optional(),
  assignedId: z.string().uuid().optional(),
});

export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentSchema>;
