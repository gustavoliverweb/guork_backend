"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestsRepository = void 0;
const requestModel_1 = __importDefault(require("./models/requestModel"));
const sequelize_1 = require("sequelize");
const profileModel_1 = __importDefault(require("../profiles/models/profileModel"));
const userModel_1 = __importDefault(require("../users/models/userModel"));
class RequestsRepository {
    async create(data) {
        return await requestModel_1.default.create(data);
    }
    async findAll(pagination) {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort = {
            id: "id",
            employmentType: "employmentType",
            amount: "amount",
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
                    { employmentType: { [sequelize_1.Op.iLike]: q } },
                    { status: { [sequelize_1.Op.iLike]: q } },
                    { "$requester.firstName$": { [sequelize_1.Op.iLike]: q } },
                    { "$requester.lastName$": { [sequelize_1.Op.iLike]: q } },
                    { "$requester.email$": { [sequelize_1.Op.iLike]: q } },
                    { "$requester.dni$": { [sequelize_1.Op.iLike]: q } },
                    { "$profile.name$": { [sequelize_1.Op.iLike]: q } },
                ],
            });
        }
        if (pagination.status && pagination.status.trim() !== "") {
            andConditions.push({ status: pagination.status });
        }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await requestModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]],
            include: [
                {
                    model: userModel_1.default,
                    as: "requester",
                    attributes: { exclude: ["password"] },
                },
                { model: profileModel_1.default },
            ],
        });
        return { rows: result.rows, count: result.count };
    }
    async findById(id) {
        return await requestModel_1.default.findByPk(id, {
            include: [
                {
                    model: userModel_1.default,
                    as: "requester",
                    attributes: { exclude: ["password"] },
                },
                { model: profileModel_1.default },
            ],
        });
    }
    async update(id, data) {
        const record = await requestModel_1.default.findByPk(id);
        if (!record)
            return null;
        return await record.update(data);
    }
    async delete(id) {
        const record = await requestModel_1.default.findByPk(id);
        if (!record)
            return false;
        await record.destroy();
        return true;
    }
}
exports.RequestsRepository = RequestsRepository;
