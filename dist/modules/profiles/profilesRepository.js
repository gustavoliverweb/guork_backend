"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesRepository = void 0;
const profileModel_1 = __importDefault(require("./models/profileModel"));
const sequelize_1 = require("sequelize");
class ProfilesRepository {
    async create(data) {
        return await profileModel_1.default.create(data);
    }
    async findAll(pagination) {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort = {
            id: "id",
            name: "name",
            status: "status",
            createdAt: "createdAt",
        };
        const orderField = (pagination.sortBy && allowedSort[pagination.sortBy]) || "createdAt";
        const orderDirection = (pagination.sortOrder || "desc").toUpperCase();
        let where;
        const andConditions = [];
        if (pagination.search && pagination.search.trim() !== "") {
            const q = `%${pagination.search}%`;
            andConditions.push({
                [sequelize_1.Op.or]: [
                    { name: { [sequelize_1.Op.iLike]: `%${pagination.search}%` } },
                    // { status: { [Op.iLike]: `%${pagination.search}%` } },
                ],
            });
        }
        if (pagination.status && pagination.status.trim() !== "") {
            andConditions.push({ status: pagination.status });
        }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await profileModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]],
        });
        return { rows: result.rows, count: result.count };
    }
    async findById(id) {
        return await profileModel_1.default.findByPk(id);
    }
    async update(id, data) {
        const record = await profileModel_1.default.findByPk(id);
        if (!record)
            return null;
        return await record.update(data);
    }
    async delete(id) {
        const record = await profileModel_1.default.findByPk(id);
        if (!record)
            return false;
        await record.destroy();
        return true;
    }
}
exports.ProfilesRepository = ProfilesRepository;
