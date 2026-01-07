"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoicesRepository = void 0;
const invoiceModel_1 = __importDefault(require("./models/invoiceModel"));
const sequelize_1 = require("sequelize");
const requestModel_1 = __importDefault(require("../requests/models/requestModel"));
const userModel_1 = __importDefault(require("../users/models/userModel"));
const models_1 = require("../../models");
class InvoicesRepository {
    async create(data) {
        return await invoiceModel_1.default.create(data);
    }
    async findAll(pagination) {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort = {
            id: "id",
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
                    { "$assignment.assigned.first_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assignment.assigned.last_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assignment.assigned.email$": { [sequelize_1.Op.iLike]: q } },
                    { "$assignment.request.requester.first_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assignment.request.requester.last_name$": { [sequelize_1.Op.iLike]: q } },
                    { "$assignment.request.requester.email$": { [sequelize_1.Op.iLike]: q } },
                ],
            });
        }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await invoiceModel_1.default.findAndCountAll({
            where,
            limit,
            offset,
            order: [[orderField, orderDirection]],
            include: [
                {
                    model: models_1.AssignmentModel,
                    as: "assignment",
                    include: [
                        {
                            model: requestModel_1.default,
                            as: "request",
                            include: [
                                {
                                    model: userModel_1.default,
                                    as: "requester",
                                    attributes: { exclude: ["password"] },
                                },
                            ],
                        },
                        {
                            model: userModel_1.default,
                            as: "assigned",
                            attributes: { exclude: ["password"] },
                        },
                    ],
                },
            ],
            distinct: true,
        });
        return { rows: result.rows, count: result.count };
    }
    async findById(id) {
        return await invoiceModel_1.default.findByPk(id, {
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
    async findByRequestId(id) {
        var resul = await invoiceModel_1.default.findAll({
            // 👈 1. Empezamos en InvoiceModel
            include: [
                {
                    // A. Incluimos la Contratación (Assignment)
                    model: models_1.AssignmentModel,
                    as: "assignment", // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('assignment') ESTÉ DEFINIDO EN TU InvoiceModel
                    attributes: [], // No necesitamos campos de Assignment, solo filtrar
                    required: true, // Debe tener una Assignment
                    include: [
                        // B. Incluimos la Solicitud (Request)
                        {
                            model: requestModel_1.default,
                            as: "request", // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('request') ESTÉ DEFINIDO EN TU AssignmentModel
                            attributes: [],
                            where: {
                                requesterId: id, // 👈 4. FILTRO CLAVE: Solo Requests de este usuario 'id'
                            },
                            required: true, // Debe tener un Request que cumpla la condición
                            include: [
                                {
                                    model: models_1.ProfileModel,
                                    attributes: [],
                                    as: "profile",
                                },
                            ],
                        },
                        {
                            model: userModel_1.default,
                            as: "assigned",
                            attributes: [],
                        },
                    ],
                },
            ],
            attributes: [
                "id",
                "amount",
                "createdAt",
                "dueDate",
                "urlInvoice",
                [
                    sequelize_1.Sequelize.col("assignment.assigned.profile_img"),
                    "assignedProfileImg",
                ],
                [sequelize_1.Sequelize.col("assignment.assigned.first_name"), "assignedFirstName"],
                [sequelize_1.Sequelize.col("assignment.assigned.last_name"), "assignedLastName"],
                [sequelize_1.Sequelize.col("assignment.request.profile.name"), "profileName"],
                [
                    sequelize_1.Sequelize.col("assignment.request.employment_type"),
                    "requestEmploymentType",
                ],
            ],
        });
        return resul;
    }
    async findLastInvoice() {
        return await invoiceModel_1.default.findOne({
            order: [["createdAt", "DESC"]],
        });
    }
    async update(id, data) {
        const record = await invoiceModel_1.default.findByPk(id);
        if (!record)
            return null;
        return await record.update(data);
    }
    async delete(id) {
        const record = await invoiceModel_1.default.findByPk(id);
        if (!record)
            return false;
        await record.destroy();
        return true;
    }
}
exports.InvoicesRepository = InvoicesRepository;
