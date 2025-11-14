import { RequestsRepository } from "./requestsRepository";
import {
  CreateRequestInput,
  UpdateRequestInput,
} from "./schemas/requestsZodSchema";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import RequestModel from "./models/requestModel";

export class RequestsService {
  private requestsRepository: RequestsRepository;

  constructor() {
    this.requestsRepository = new RequestsRepository();
  }

  async createRequest(data: CreateRequestInput): Promise<RequestModel> {
    const record = await this.requestsRepository.create({
      ...data,
      status: data.status || "in-progress",
    });
    return record;
  }

  async getAllRequests(
    pagination: PaginationRequest
  ): Promise<PaginationResponse<RequestModel>> {
    pagination.page = pagination.page > 0 ? pagination.page : 1;
    pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
    const { rows, count } = await this.requestsRepository.findAll(pagination);

    return {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pagination.pageSize) || 1,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
    };
  }

  async getRequestById(id: string): Promise<RequestModel> {
    const record = await this.requestsRepository.findById(id);
    if (!record) throw new Error("Request not found");
    return record;
  }

  async updateRequest(
    id: string,
    data: UpdateRequestInput
  ): Promise<RequestModel> {
    const record = await this.requestsRepository.update(id, data);
    if (!record) throw new Error("Request not found");
    return record;
  }

  async deleteRequest(id: string): Promise<void> {
    const deleted = await this.requestsRepository.delete(id);
    if (!deleted) throw new Error("Request not found");
  }
}
