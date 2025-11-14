import { ProfilesRepository } from "./profilesRepository";
import {
  CreateProfileInput,
  UpdateProfileInput,
} from "./schemas/profilesZodSchema";
import { Profile } from "./profilesTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";

export class ProfilesService {
  private profilesRepository: ProfilesRepository;

  constructor() {
    this.profilesRepository = new ProfilesRepository();
  }

  async createProfile(data: CreateProfileInput): Promise<Profile> {
    const profile = await this.profilesRepository.create({
      ...data,
      status: data.status || "available",
    });
    return profile;
  }

  async getAllProfiles(
    pagination: PaginationRequest
  ): Promise<PaginationResponse<Profile>> {
    pagination.page = pagination.page > 0 ? pagination.page : 1;
    pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
    const { rows, count } = await this.profilesRepository.findAll(pagination);

    const response: PaginationResponse<Profile> = {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pagination.pageSize) || 1,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
    };

    return response;
  }

  async getProfileById(id: string): Promise<Profile> {
    const profile = await this.profilesRepository.findById(id);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile;
  }

  async updateProfile(id: string, data: UpdateProfileInput): Promise<Profile> {
    const profile = await this.profilesRepository.update(id, data);
    if (!profile) {
      throw new Error("Profile not found");
    }
    return profile;
  }

  async deleteProfile(id: string): Promise<void> {
    const deleted = await this.profilesRepository.delete(id);
    if (!deleted) {
      throw new Error("Profile not found");
    }
  }
}
