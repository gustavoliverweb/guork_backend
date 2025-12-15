import InvoiceModel from "./models/invoiceModel";

import { PaginationRequest } from "../../shared/types/paginationRequest";
import { Op, Sequelize, WhereOptions } from "sequelize";
import RequestModel from "../requests/models/requestModel";
import UserModel from "../users/models/userModel";
import { AssignmentModel, ProfileModel } from "../../models";
import { InvoiceCreation } from "./invoiceTypes";

export class InvoicesRepository {
    async create(data: InvoiceCreation): Promise<InvoiceModel> {
        return await InvoiceModel.create(data);
    }

    async findAll(
        pagination: PaginationRequest
    ): Promise<{ rows: InvoiceModel[]; count: number }> {
        const limit = pagination.pageSize;
        const offset = (pagination.page - 1) * pagination.pageSize;
        const allowedSort: Record<string, string> = {
            id: "id",
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

                    { "$assigned.firstName$": { [Op.iLike]: q } },

                ],
            });
        }

        if (pagination.status && pagination.status.trim() !== "") {
            andConditions.push({ status: pagination.status });
        }

        where = andConditions.length ? { [Op.and]: andConditions } : undefined;

        const result = await InvoiceModel.findAndCountAll({
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
                    model: RequestModel, include: [
                        {
                            model: ProfileModel
                        }

                    ]
                },
            ],
        });

        return { rows: result.rows, count: result.count };
    }

    async findById(id: string): Promise<InvoiceModel | null> {
        return await InvoiceModel.findByPk(id, {
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

    async findByRequestId(id: string): Promise<InvoiceModel[] | null> {
        var resul = await InvoiceModel.findAll({ // 👈 1. Empezamos en InvoiceModel

            include: [
                {
                    // A. Incluimos la Contratación (Assignment)
                    model: AssignmentModel,
                    as: "assigned", // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('assignment') ESTÉ DEFINIDO EN TU InvoiceModel
                    attributes: [], // No necesitamos campos de Assignment, solo filtrar
                    required: true, // Debe tener una Assignment

                    include: [
                        // B. Incluimos la Solicitud (Request)
                        {
                            model: RequestModel,
                            as: 'request', // 🚨 ASEGÚRATE DE QUE ESTE ALIAS ('request') ESTÉ DEFINIDO EN TU AssignmentModel
                            attributes: [],
                            where: {
                                requesterId: id // 👈 4. FILTRO CLAVE: Solo Requests de este usuario 'id'
                            },
                            required: true, // Debe tener un Request que cumpla la condición

                            include: [

                                {
                                    model: ProfileModel,
                                    attributes: [],
                                    as: 'profile',
                                }
                            ]
                        },

                        {
                            model: UserModel,
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
                [Sequelize.col('assigned.assigned.profile_img'), 'assignedProfileImg'],
                [Sequelize.col('assigned.assigned.first_name'), 'assignedFirstName'],
                [Sequelize.col('assigned.assigned.last_name'), 'assignedLastName'],
                [Sequelize.col('assigned.request.profile.name'), 'profileName'],
                [Sequelize.col('assigned.request.employment_type'), 'requestEmploymentType'],
            ],
        });
        return resul;
    }

    async update(
        id: string,
        data: Partial<InvoiceCreation>
    ): Promise<InvoiceModel | null> {
        const record = await InvoiceModel.findByPk(id);
        if (!record) return null;
        return await record.update(data);
    }

    async delete(id: string): Promise<boolean> {
        const record = await InvoiceModel.findByPk(id);
        if (!record) return false;
        await record.destroy();
        return true;
    }
}
