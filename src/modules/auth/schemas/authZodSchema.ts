import { z } from "zod";

// Schema de validación para login
export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
  token: z.string(),
});

export type LoginInput = z.infer<typeof loginSchema>;
