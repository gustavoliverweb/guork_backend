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
const models_1 = require("../../models");
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
                    { "$assigned.first_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.last_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.email$": { [sequelize_1.Op.iLike]: q } },
                    { "$assigned.dni$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.employment_type$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.status$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.profile.name$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.requester.first_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.requester.last_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.requester.email$": { [sequelize_1.Op.iLike]: q } },
                    { "$request.requester.dni$": { [sequelize_1.Op.iLike]: q } },
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
                {
                    model: requestModel_1.default,
                    as: "request",
                    include: [
                        {
                            model: models_1.ProfileModel,
                            as: "profile",
                        },
                        {
                            model: userModel_1.default,
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
    async findBySub(subId) {
        return await assignmentModel_1.default.findOne({
            where: {
                idSuscription: subId,
            },
            attributes: [
                "id",
                'requestId',
                [sequelize_1.Sequelize.col("assigned.profile_img"), "assignedProfileImg"],
                [sequelize_1.Sequelize.col("assigned.first_name"), "assignedFirstName"],
                [sequelize_1.Sequelize.col("assigned.last_name"), "assignedLastName"],
                [sequelize_1.Sequelize.col("request.profile.name"), "profileName"],
                [sequelize_1.Sequelize.col("request.employment_type"), "requestEmploymentType"],
            ],
            include: [
                {
                    model: userModel_1.default,
                    as: "assigned",
                    attributes: [],
                },
                {
                    model: requestModel_1.default,
                    as: "request",
                    attributes: [],
                    required: true,
                    include: [
                        {
                            model: models_1.ProfileModel,
                            attributes: [],
                            as: "profile",
                        },
                    ],
                },
            ],
        });
    }
    async findByRequestId(id) {
        var resul = await assignmentModel_1.default.findAll({
            where: {
                status: "assigned",
            },
            attributes: [
                "id",
                [sequelize_1.Sequelize.col("assigned.profile_img"), "assignedProfileImg"],
                [sequelize_1.Sequelize.col("assigned.first_name"), "assignedFirstName"],
                [sequelize_1.Sequelize.col("assigned.last_name"), "assignedLastName"],
                [sequelize_1.Sequelize.col("request.profile.name"), "profileName"],
                [sequelize_1.Sequelize.col("request.employment_type"), "requestEmploymentType"],
            ],
            include: [
                {
                    model: userModel_1.default,
                    as: "assigned",
                    attributes: [],
                },
                {
                    model: requestModel_1.default,
                    as: "request",
                    attributes: [],
                    where: {
                        requesterId: id,
                    },
                    required: true,
                    include: [
                        {
                            model: models_1.ProfileModel,
                            attributes: [],
                            as: "profile",
                        },
                    ],
                },
            ],
        });
        return resul;
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
