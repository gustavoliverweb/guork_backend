import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import { AssignmentModel } from "../../../models";
import moment from "moment";

@Table({ tableName: "invoices", timestamps: false })
export default class InvoiceModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
    id!: string;

    @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, })
    amount!: string;

    @Column({ type: DataType.TEXT, allowNull: false, defaultValue: '' })
    urlInvoice!: string;
    @ForeignKey(() => AssignmentModel)
    @Column({ type: DataType.UUID, allowNull: false, })
    assignedId!: string;

    @BelongsTo(() => AssignmentModel)
    assigned!: AssignmentModel;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    })
    createdAt!: Date;

    @Column({
        type: DataType.VIRTUAL,
        get(this: any) {

            const creationDate = this.getDataValue('createdAt');

            if (creationDate) {

                return moment(creationDate).add(1, 'month').toDate();
            }
            return null;
        }
    })
    dueDate!: Date;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    })
    updatedAt!: Date;
}
