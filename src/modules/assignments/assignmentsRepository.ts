import AssignmentModel from "./models/assignmentModel";
import { AssignmentCreation } from "./assignmentsTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { Op, WhereOptions } from "sequelize";
import RequestModel from "../requests/models/requestModel";
import UserModel from "../users/models/userModel";

export class AssignmentsRepository {
  async create(data: AssignmentCreation): Promise<AssignmentModel> {
    return await AssignmentModel.create(data);
  }

  async findAll(
    pagination: PaginationRequest
  ): Promise<{ rows: AssignmentModel[]; count: number }> {
    const limit = pagination.pageSize;
    const offset = (pagination.page - 1) * pagination.pageSize;
    const allowedSort: Record<string, string> = {
      id: "id",
      status: "status",
      createdAt: "createdAt",
    };
    const orderField =
      (pagination.sortBy && allowedSort[pagination.sortBy]) || "createdAt";
    const orderDirection = (pagination.sortOrder || "desc").toUpperCase() as
      | "ASC"
      | "DESC";

    let where: WhereOptions | undefined;
    const andConditions: WhereOptions[] = [];

    if (pagination.search && pagination.search.trim() !== "") {
      const q = `%${pagination.search}%`;
      andConditions.push({
        [Op.or]: [
          { status: { [Op.iLike]: q } },
          { "$assigned.firstName$": { [Op.iLike]: q } },
          { "$assigned.lastName$": { [Op.iLike]: q } },
          { "$assigned.email$": { [Op.iLike]: q } },
          { "$assigned.dni$": { [Op.iLike]: q } },
          { "$request.employmentType$": { [Op.iLike]: q } },
          { "$request.status$": { [Op.iLike]: q } },
        ],
      });
    }

    if (pagination.status && pagination.status.trim() !== "") {
      andConditions.push({ status: pagination.status });
    }

    where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    const result = await AssignmentModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField as any, orderDirection]],
      include: [
        {
          model: UserModel,
          as: "assigned",
          attributes: { exclude: ["password"] },
        },
        { model: RequestModel },
      ],
    });

    return { rows: result.rows, count: result.count };
  }

  async findById(id: string): Promise<AssignmentModel | null> {
    return await AssignmentModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "assigned",
          attributes: { exclude: ["password"] },
        },
        { model: RequestModel },
      ],
    });
  }

  async update(
    id: string,
    data: Partial<AssignmentCreation>
  ): Promise<AssignmentModel | null> {
    const record = await AssignmentModel.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const record = await AssignmentModel.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
