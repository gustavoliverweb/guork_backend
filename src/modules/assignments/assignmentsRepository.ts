import AssignmentModel from "./models/assignmentModel";
import { AssignmentCreation } from "./assignmentsTypes";
import { PaginationRequest } from "../../shared/types/paginationRequest";
import { Op, Sequelize, WhereOptions } from "sequelize";
import RequestModel from "../requests/models/requestModel";
import UserModel from "../users/models/userModel";
import { ProfileModel } from "../../models";

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
          { "$assigned.first_name$": { [Op.iLike]: q } },
          { "$assigned.last_name$": { [Op.iLike]: q } },
          { "$assigned.email$": { [Op.iLike]: q } },
          { "$assigned.dni$": { [Op.iLike]: q } },
          { "$request.employment_type$": { [Op.iLike]: q } },
          { "$request.status$": { [Op.iLike]: q } },
          { "$request.profile.name$": { [Op.iLike]: q } },
          { "$request.requester.first_name$": { [Op.iLike]: q } },
          { "$request.requester.last_name$": { [Op.iLike]: q } },
          { "$request.requester.email$": { [Op.iLike]: q } },
          { "$request.requester.dni$": { [Op.iLike]: q } },
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
        {
          model: RequestModel,
          as: "request",
          include: [
            {
              model: ProfileModel,
              as: "profile",
            },
            {
              model: UserModel,
              as: "requester",
              attributes: { exclude: ["password"] },
            },
          ],
        },
      ],
      distinct: true,
      subQuery: false,
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
  async findBySub(subId: string): Promise<AssignmentModel | null> {
    return await AssignmentModel.findOne({
      where: {
        idSuscription: subId,
      },
      attributes: [
        "id",
        [Sequelize.col("assigned.profile_img"), "assignedProfileImg"],
        [Sequelize.col("assigned.first_name"), "assignedFirstName"],
        [Sequelize.col("assigned.last_name"), "assignedLastName"],
        [Sequelize.col("request.profile.name"), "profileName"],
        [Sequelize.col("request.employment_type"), "requestEmploymentType"],
      ],
      include: [
        {
          model: UserModel,
          as: "assigned",

          attributes: [],
        },
        {
          model: RequestModel,
          as: "request",
          attributes: [],
          required: true,
          include: [
            {
              model: ProfileModel,
              attributes: [],
              as: "profile",
            },
          ],
        },
      ],
    });
  }
  async findByRequestId(id: string): Promise<AssignmentModel[] | null> {
    var resul = await AssignmentModel.findAll({
      where: {
        status: "assigned",
      },
      attributes: [
        "id",
        [Sequelize.col("assigned.profile_img"), "assignedProfileImg"],
        [Sequelize.col("assigned.first_name"), "assignedFirstName"],
        [Sequelize.col("assigned.last_name"), "assignedLastName"],
        [Sequelize.col("request.profile.name"), "profileName"],
        [Sequelize.col("request.employment_type"), "requestEmploymentType"],
      ],
      include: [
        {
          model: UserModel,
          as: "assigned",

          attributes: [],
        },
        {
          model: RequestModel,
          as: "request",
          attributes: [],
          where: {
            requesterId: id,
          },
          required: true,
          include: [
            {
              model: ProfileModel,
              attributes: [],
              as: "profile",
            },
          ],
        },
      ],
    });
    return resul;
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
