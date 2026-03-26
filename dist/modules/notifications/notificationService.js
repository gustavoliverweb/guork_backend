"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationModel_1 = __importDefault(require("./module/notificationModel"));
const sequelize_1 = require("sequelize");
class NotificationsService {
    constructor() { }
    async getNotifications(dataPag) {
        const limit = dataPag.pageSize;
        const offset = (dataPag.page - 1) * dataPag.pageSize;
        const allowedSort = {
            id: "id",
            createdAt: "createdAt",
        };
        const orderField = (dataPag.sortBy && allowedSort[dataPag.sortBy]) || "createdAt";
        const orderDirection = (dataPag.sortOrder || "desc").toUpperCase();
        let where = undefined;
        if (dataPag.search) {
            where = {};
            where[sequelize_1.Op.or] = [
                { title: { [sequelize_1.Op.iLike]: `%${dataPag.search}%` } },
                { content: { [sequelize_1.Op.iLike]: `%${dataPag.search}%` } },
            ];
        }
        const { rows, count } = await notificationModel_1.default.findAndCountAll({
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
exports.default = NotificationsService;
