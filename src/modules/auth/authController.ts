import { Request, Response } from "express";
import { AuthService } from "./authService";
import { createUserSchema } from "../users/schemas/usersZodSchema";
import { loginSchema } from "./schemas/authZodSchema";
import { ZodError } from "zod";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
      const result = await this.authService.register(validatedData, ip);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const ip = (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress || "unknown";
      const result = await this.authService.login(validatedData, ip);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      if (error instanceof Error) {
        res.status(401).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        res.status(401).json({ message: "Token not provided" });
        return;
      }
      await this.authService.logout(token);
      res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
