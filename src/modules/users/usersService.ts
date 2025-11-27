import bcrypt from "bcrypt";
import { UserRepository } from "./usersRepository";
import { CreateUserInput, UpdateUserInput } from "./schemas/usersZodSchema";
import { UserCreation, UserResponse } from "./usersTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import { de } from "zod/v4/locales";
import UserModel from "./models/userModel";

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserInput): Promise<UserResponse> {
    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("Email already exists");
    }

    // Verificar si el DNI ya existe
    if (data.dni) {
      const existingDni = await this.userRepository.findByDni(data.dni);
      if (existingDni) {
        throw new Error("DNI already exists");
      }
    }

    let hashedPassword;
    const userData: UserCreation = { ...data, birthdate: undefined };
    // Hash password
    if (data.password) {
      hashedPassword = await bcrypt.hash(data.password, 10);
      userData.password = hashedPassword;
    }

    if (data.birthdate) {
      userData.birthdate = new Date(data.birthdate);
    } else {
      delete userData.birthdate;
    }

    // Crear usuario
    const user = await this.userRepository.create({
      ...userData,
      role: userData.role || "user",
    });

    // Asociar perfiles si llegan desde el front
    if (Array.isArray(data.profiles) && data.profiles.length > 0) {
      await (user as any).$set("profiles", data.profiles);
    }

    return user.toJSON() as UserResponse;
  }

  async getAllUsers(
    pagination: PaginationRequest
  ): Promise<PaginationResponse<UserResponse>> {
    pagination.page = pagination.page > 0 ? pagination.page : 1;
    pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
    const { rows, count } = await this.userRepository.findAll(pagination);

    const response: PaginationResponse<UserResponse> = {
      items: rows.map((user) => user.toJSON() as UserResponse),
      totalItems: count,
      totalPages: Math.ceil(count / pagination.pageSize) || 1,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
    };

    return response;
  }

  async getUserById(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user.toJSON() as UserResponse;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<UserResponse> {
    const user = await this.userRepository.update(id, {
      ...data,
      birthdate: data.birthdate ? new Date(data.birthdate) : undefined,
    });

    if (Array.isArray(data.profiles)) {
      await (user as any).$set("profiles", data.profiles);
    }
    if (!user) {
      throw new Error("User not found");
    }
    return user.toJSON() as UserResponse;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error("User not found");
    }
  }
}
