import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";


@Table({ tableName: "notifications", timestamps: false })
export default class NotificationModel extends Model {
    @PrimaryKey
    @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
    id!: string;



    @Column({ type: DataType.TEXT, allowNull: false })
    title!: string;


    @Column({ type: DataType.TEXT, allowNull: false })
    content!: string;
    @Column({ type: DataType.JSONB, allowNull: false })
    userIds!: string[];
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    })
    createdAt!: Date;
    @Column({
        type: DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    })
    updatedAt!: Date;
}
