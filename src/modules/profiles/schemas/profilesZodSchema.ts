import { z } from "zod";

export const createProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  status: z.string().min(1).optional(),
  descriptions: z.string().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  descriptions: z.string().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
