import { PaginationRequest } from "../../shared/types/paginationRequest";
import { PaginationResponse } from "../../shared/types/paginationResponse";
import NotificationModel from "./module/notificationModel";
import { Op, Sequelize, WhereOptions } from "sequelize";
export default class NotificationsService {
  constructor() {}

  async getNotifications(
    dataPag: PaginationRequest,
  ): Promise<PaginationResponse<NotificationModel>> {
    const limit = dataPag.pageSize;
    const offset = (dataPag.page - 1) * dataPag.pageSize;
    const allowedSort: Record<string, string> = {
      id: "id",
      createdAt: "createdAt",
    };
    const orderField =
      (dataPag.sortBy && allowedSort[dataPag.sortBy]) || "createdAt";
    const orderDirection = (dataPag.sortOrder || "desc").toUpperCase() as
      | "ASC"
      | "DESC";

    let where: any = undefined;
    if (dataPag.search) {
      where = {};
      where[Op.or] = [
        { title: { [Op.iLike]: `%${dataPag.search}%` } },
        { content: { [Op.iLike]: `%${dataPag.search}%` } },
      ];
    }

    const { rows, count } = await NotificationModel.findAndCountAll({
      where,
      limit,
      offset,
      order: [[orderField, orderDirection]],
    });

    return {
      items: rows,
      totalItems: count,
      totalPages: Math.ceil(count / limit) || 1,
      currentPage: dataPag.page,
      pageSize: limit,
    };
  }
}
