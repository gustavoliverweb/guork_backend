import { AssignmentsRepository } from "./assignmentsRepository";
import {
  CreateAssignmentInput,
  UpdateAssignmentInput,
} from "./schemas/assignmentsZodSchema";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import AssignmentModel from "./models/assignmentModel";

export class AssignmentsService {
  private assignmentsRepository: AssignmentsRepository;

  constructor() {
    this.assignmentsRepository = new AssignmentsRepository();
  }

  async createAssignment(
    data: CreateAssignmentInput
  ): Promise<AssignmentModel> {
    const record = await this.assignmentsRepository.create({
      ...data,
      status: data.status || "in-progress",
    });
    return record;
  }

  async getAllAssignments(
    pagination: PaginationRequest
  ): Promise<PaginationResponse<AssignmentModel>> {
    pagination.page = pagination.page > 0 ? pagination.page : 1;
    pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
    const { rows, count } = await this.assignmentsRepository.findAll(
      pagination
    );

    return {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / pagination.pageSize) || 1,
      currentPage: pagination.page,
      pageSize: pagination.pageSize,
    };
  }

  async getAssignmentById(id: string): Promise<AssignmentModel> {
    const record = await this.assignmentsRepository.findById(id);
    if (!record) throw new Error("Assignment not found");
    return record;
  }
  async getAssignmentByRequesterId(id: string): Promise<{ rows: AssignmentModel[] }> {
    const records = await this.assignmentsRepository.findByRequestId(id);
    if (!records) throw new Error("Assignment not found");
    return {
      rows: records
    };
  }

  async updateAssignment(
    id: string,
    data: UpdateAssignmentInput
  ): Promise<AssignmentModel> {
    const record = await this.assignmentsRepository.update(id, data);
    if (!record) throw new Error("Assignment not found");
    return record;
  }

  async deleteAssignment(id: string): Promise<void> {
    const deleted = await this.assignmentsRepository.delete(id);
    if (!deleted) throw new Error("Assignment not found");
  }
}
