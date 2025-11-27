import { z } from "zod";

export const createRequestSchema = z.object({
  employmentType: z.string().min(1),
  amount: z.number().min(0),
  requesterId: z.string().uuid(),
  status: z.string().min(1).optional(),
  profileId: z.string().uuid(),
  urlAgent: z.string().min(1)
});

export const updateRequestSchema = z.object({
  employmentType: z.string().min(1).optional(),
  amount: z.number().min(0).optional(),
  requesterId: z.string().uuid().optional(),
  status: z.string().min(1).optional(),
  profileId: z.string().uuid().optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
