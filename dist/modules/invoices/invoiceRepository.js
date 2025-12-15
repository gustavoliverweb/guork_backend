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
                    { "$assigned.firstName$": { [sequelize_1.Op.iLike]: q } },
                ],
            });
        }
        if (pagination.status && pagination.status.trim() !== "") {
            andConditions.push({ status: pagination.status });
        }
        where = andConditions.length ? { [sequelize_1.Op.and]: andConditions } : undefined;
        const result = await invoiceModel_1.default.findAndCountAll({
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
                    model: requestModel_1.default, include: [
                        {
                            model: models_1.ProfileModel
                        }
                    ]
                },
            ],
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
            include: [
                {
                    // A. Incluimos la Contratación (Assignment)
                    model: models_1.AssignmentModel,
                    as: "assigned", // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('assignment') ESTÉ DEFINIDO EN TU InvoiceModel
                    attributes: [], // No necesitamos campos de Assignment, solo filtrar
                    required: true, // Debe tener una Assignment
                    include: [
                        // B. Incluimos la Solicitud (Request)
                        {
                            model: requestModel_1.default,
                            as: 'request', // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('request') ESTÉ DEFINIDO EN TU AssignmentModel
                            attributes: [],
                            where: {
                                requesterId: id // 👈 4. FILTRO CLAVE: Solo Requests de este usuario 'id'
                            },
                            required: true, // Debe tener un Request que cumpla la condición
                            include: [
                                {
                                    model: models_1.ProfileModel,
                                    attributes: [],
                                    as: 'profile',
                                }
                            ]
                        },
                        {
                            model: userModel_1.default,
                            as: 'assigned',
                            attributes: [],
                        }
                    ]
                },
            ],
            attributes: [
                'id',
                'amount',
                'createdAt',
                'dueDate',
                'urlInvoice',
                [sequelize_1.Sequelize.col('assigned.assigned.profile_img'), 'assignedProfileImg'],
                [sequelize_1.Sequelize.col('assigned.assigned.first_name'), 'assignedFirstName'],
                [sequelize_1.Sequelize.col('assigned.assigned.last_name'), 'assignedLastName'],
                [sequelize_1.Sequelize.col('assigned.request.profile.name'), 'profileName'],
                [sequelize_1.Sequelize.col('assigned.request.employment_type'), 'requestEmploymentType'],
            ],
        });
        return resul;
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
