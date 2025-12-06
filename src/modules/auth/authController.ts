import { Request, Response } from "express";
import { AuthService } from "./authService";
import { createUserSchema } from "../users/schemas/usersZodSchema";
import { loginSchema } from "./schemas/authZodSchema";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthenticatedRequest } from "../../shared/types/authenticatedRequest";
import { UserService } from "../users/usersService";

export class AuthController {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    this.authService = new AuthService();
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";

      if (req.file) {
        // Si se ha subido un archivo, asignar la ruta al campo avatarUrl
      }

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
      console.log("asd");
      const validatedData = loginSchema.parse(req.body);
      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";
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
  loginByGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("asd");
      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        "unknown";
      const result = await this.authService.loginByGoogle(req.body, ip);
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

  resetPasswordCtrl = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ message: "Email es requerido" });
        return;
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }
      const token = jwt.sign({ email }, process.env.JWT_SECRET!);
      console.log("Token de restablecimiento de contraseña generado:", token);

      // Guardar el token en la base de datos
      await this.authService.createPasswordResetRequest(user.id, token);

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
      console.log("Reset URL:", resetUrl);

      // Enviar el email de restablecimiento de contraseña

      res
        .status(200)
        .json({ message: "Email de restablecimiento de contraseña enviado" });
    } catch (error: any) {
      res.status(500).json({
        message: "Error al enviar el request de restablecimiento de contraseña",
      });
    }
  };

  updatePasswordCtrl = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { email, newPassword, token } = req.body;

      if (!email || !newPassword || !token) {
        res
          .status(400)
          .json({ message: "Email, nueva contraseña y token son requeridos" });
        return;
      }

      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: "Usuario no encontrado" });
        return;
      }

      const passwordReset =
        await this.authService.findPasswordResetRequestByToken(token);

      if (!passwordReset) {
        res
          .status(404)
          .json({ message: "Token de restablecimiento no encontrado" });
        return;
      }

      if (passwordReset.userId !== user.id) {
        res.status(403).json({ message: "Token no válido para este usuario" });
        return;
      }

      await this.authService.deletePasswordResetRequest(token);

      const passwordHash = await bcrypt.hash(newPassword, 10);

      await this.userService.updateUser(user.id, {
        password: passwordHash,
      });

      // Enviar confirmación de cambio de contraseña

      res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    } catch (error: any) {
      res.status(500).json({ message: "Error al actualizar la contraseña" });
    }
  };
}
