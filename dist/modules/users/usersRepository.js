"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userModel_1 = __importDefault(require("./models/userModel"));
const sequelize_1 = require("sequelize");
const profileModel_1 = __importDefault(require("../profiles/models/profileModel"));
const requestModel_1 = __importDefault(require("../requests/models/requestModel"));
const assignmentModel_1 = __importDefault(require("../assignments/models/assignmentModel"));
class UserRepository {
    async create(data) {
        return await userModel_1.default.create(data);
    }
    async findAll(pagination) {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort = {
            id: "id",
            firstName: "firstName",
            lastName: "lastName",
            email: "email",
            role: "role",
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
                    { firstName: { [sequelize_1.Op.iLike]: q } },
                    { lastName: { [sequelize_1.Op.iLike]: q } },
                    { email: { [sequelize_1.Op.iLike]: q } },
                ],
            });
        }
        if (pagination.role && pagination.role.trim() !== "") {
            andConditions.push({ role: pagination.role });
        }
        // if (pagination.profile && pagination.profile.trim() !== "") {
        //   andConditions.push({
        //     "$profile.name$": { [Op.iLike]: `%${pagination.profile}%` },
        //   });
        // }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await userModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]],
            include: [
                {
                    model: profileModel_1.default,
                    as: "profiles",
                    through: { attributes: [] },
                    where: pagination.profile ? { id: pagination.profile } : undefined,
                },
                {
                    model: requestModel_1.default,
                    as: "requests",
                },
                {
                    model: assignmentModel_1.default,
                    as: "assignments",
                },
            ],
            distinct: true,
        });
        return { rows: result.rows, count: result.count };
    }
    async findById(id) {
        return await userModel_1.default.findByPk(id, {
            include: [
                {
                    model: profileModel_1.default,
                    through: { attributes: [] },
                },
                {
                    model: requestModel_1.default,
                    as: "requests",
                },
                {
                    model: assignmentModel_1.default,
                    as: "assignments",
                },
            ],
        });
    }
    async findByEmail(email) {
        return await userModel_1.default.findOne({
            where: { email },
            include: [
                {
                    model: profileModel_1.default,
                    through: { attributes: [] },
                },
                {
                    model: requestModel_1.default,
                    as: "requests",
                },
                {
                    model: assignmentModel_1.default,
                    as: "assignments",
                },
            ],
        });
    }
    async findByDni(dni) {
        return await userModel_1.default.findOne({
            where: { dni },
            include: [
                {
                    model: profileModel_1.default,
                    through: { attributes: [] },
                },
                {
                    model: requestModel_1.default,
                    as: "requests",
                },
                {
                    model: assignmentModel_1.default,
                    as: "assignments",
                },
            ],
        });
    }
    async update(id, data) {
        const user = await userModel_1.default.findByPk(id);
        if (!user)
            return null;
        return await user.update(data);
    }
    async delete(id) {
        const user = await userModel_1.default.findByPk(id);
        if (!user)
            return false;
        await user.destroy();
        return true;
    }
}
exports.UserRepository = UserRepository;
