import RequestModel from "./models/requestModel";
import { RequestCreation } from "./requestsTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { Op, WhereOptions } from "sequelize";
import ProfileModel from "../profiles/models/profileModel";
import UserModel from "../users/models/userModel";

export class RequestsRepository {
  async create(data: RequestCreation): Promise<RequestModel> {
    return await RequestModel.create(data);
  }

  async findAll(
    pagination: PaginationRequest
  ): Promise<{ rows: RequestModel[]; count: number }> {
    const limit = pagination.pageSize;
    const offset = (pagination.page - 1) * pagination.pageSize;
    const allowedSort: Record<string, string> = {
      id: "id",
      employmentType: "employmentType",
      amount: "amount",
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
          { employmentType: { [Op.iLike]: q } },
          { status: { [Op.iLike]: q } },
          { "$requester.firstName$": { [Op.iLike]: q } },
          { "$requester.lastName$": { [Op.iLike]: q } },
          { "$requester.email$": { [Op.iLike]: q } },
          { "$requester.dni$": { [Op.iLike]: q } },
          { "$profile.name$": { [Op.iLike]: q } },
        ],
      });
    }

    if (pagination.status && pagination.status.trim() !== "") {
      andConditions.push({ status: pagination.status });
    }

    where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    const result = await RequestModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField as any, orderDirection]],
      include: [
        {
          model: UserModel,
          as: "requester",
          attributes: { exclude: ["password"] },
        },
        { model: ProfileModel },
      ],
    });

    return { rows: result.rows, count: result.count };
  }

  async findById(id: string): Promise<RequestModel | null> {
    return await RequestModel.findByPk(id, {
      include: [
        {
          model: UserModel,
          as: "requester",
          attributes: { exclude: ["password"] },
        },
        { model: ProfileModel },
      ],
    });
  }

  async update(
    id: string,
    data: Partial<RequestCreation>
  ): Promise<RequestModel | null> {
    const record = await RequestModel.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const record = await RequestModel.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
