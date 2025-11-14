import ProfileModel from "./models/profileModel";
import { ProfileCreation } from "./profilesTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { Op, WhereOptions } from "sequelize";

export class ProfilesRepository {
  async create(data: ProfileCreation): Promise<ProfileModel> {
    return await ProfileModel.create(data);
  }

  async findAll(
    pagination: PaginationRequest
  ): Promise<{ rows: ProfileModel[]; count: number }> {
    const limit = pagination.pageSize;
    const offset = (pagination.page - 1) * pagination.pageSize;
    const allowedSort: Record<string, string> = {
      id: "id",
      name: "name",
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
          { name: { [Op.iLike]: `%${pagination.search}%` } },
          // { status: { [Op.iLike]: `%${pagination.search}%` } },
        ],
      });
    }

    if (pagination.status && pagination.status.trim() !== "") {
      andConditions.push({ status: pagination.status });
    }

    where = andConditions.length ? { [Op.and]: andConditions } : undefined;

    const result = await ProfileModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField as any, orderDirection]],
    });

    return { rows: result.rows, count: result.count };
  }

  async findById(id: string): Promise<ProfileModel | null> {
    return await ProfileModel.findByPk(id);
  }

  async update(
    id: string,
    data: Partial<ProfileCreation>
  ): Promise<ProfileModel | null> {
    const record = await ProfileModel.findByPk(id);
    if (!record) return null;
    return await record.update(data);
  }

  async delete(id: string): Promise<boolean> {
    const record = await ProfileModel.findByPk(id);
    if (!record) return false;
    await record.destroy();
    return true;
  }
}
