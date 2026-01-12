import { Request, Response } from "express";
import { UserService } from "./usersService";
import { createUserSchema, updateUserSchema } from "./schemas/usersZodSchema";
import { ZodError } from "zod";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import { UserResponse } from "./usersTypes";
import { MailChimpService } from "../../shared/services/mailChimpService";
import { BunnyService } from "../../shared/services/bunnyService";

export class UserController {
  private userService: UserService;
  private mandrill: MailChimpService;
  private bunny: BunnyService;
  constructor() {
    this.userService = new UserService();
    this.mandrill = new MailChimpService();
    this.bunny = new BunnyService();
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);

      if (req.file) {
        const uploadResult = await this.bunny.upload(
          `users/profile-picture/${Date.now()}_${req.file.originalname}`,
          req.file.buffer,
          req.file.mimetype
        );
        validatedData.profileImg = uploadResult.publicUrl;
      }

      const user = await this.userService.createUser(validatedData);
      res.status(201).json(user);
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

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagination: PaginationRequest = {
        page: Number.parseInt((req.query.page as string) || "1", 10),
        pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
        search: (req.query.search as string) || undefined,
        role: (req.query.role as string) || undefined,
        profile: (req.query.profile as string) || undefined,
      };

      const result: PaginationResponse<UserResponse> =
        await this.userService.getAllUsers(pagination);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const validatedData = updateUserSchema.parse(req.body);

      if (req.file) {
        if (validatedData.profileImg) {
          await this.bunny.delete(validatedData.profileImg ?? "");
        }

        const uploadResult = await this.bunny.upload(
          `users/profile-picture/${Date.now()}_${req.file.originalname}`,
          req.file.buffer,
          req.file.mimetype
        );
        validatedData.profileImg = uploadResult.publicUrl;
      }
      console.log(validatedData);
      const user = await this.userService.updateUser(id, validatedData);
      res.status(200).json(user);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ errors: error.issues });
        return;
      }
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}
