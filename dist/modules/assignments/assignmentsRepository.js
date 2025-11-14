"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentsRepository = void 0;
const assignmentModel_1 = __importDefault(require("./models/assignmentModel"));
const sequelize_1 = require("sequelize");
const requestModel_1 = __importDefault(require("../requests/models/requestModel"));
const userModel_1 = __importDefault(require("../users/models/userModel"));
class AssignmentsRepository {
    async create(data) {
        return await assignmentModel_1.default.create(data);
    }
    async findAll(pagination) {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort = {
            id: "id",
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
                    { status: { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.firstName$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.lastName$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.email$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.dni$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.employmentType$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.status$": { [sequelize_1.Op.iLike]: q } },
                ],
            });
        }
        if (pagination.status && pagination.status.trim() !== "") {
            andConditions.push({ status: pagination.status });
        }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await assignmentModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]],
            include: [
                {
                    model: userModel_1.default,
                    as: "assigned",
                    attributes: { exclude: ["password"] },
                },
                { model: requestModel_1.default },
            ],
        });
        return { rows: result.rows, count: result.count };
    }
    async findById(id) {
        return await assignmentModel_1.default.findByPk(id, {
            include: [
                {
                    model: userModel_1.default,
                    as: "assigned",
                    attributes: { exclude: ["password"] },
                },
                { model: requestModel_1.default },
            ],
        });
    }
    async update(id, data) {
        const record = await assignmentModel_1.default.findByPk(id);
        if (!record)
            return null;
        return await record.update(data);
    }
    async delete(id) {
        const record = await assignmentModel_1.default.findByPk(id);
        if (!record)
            return false;
        await record.destroy();
        return true;
    }
}
exports.AssignmentsRepository = AssignmentsRepository;
