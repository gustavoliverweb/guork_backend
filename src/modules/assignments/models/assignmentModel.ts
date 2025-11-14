import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo } from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import RequestModel from "../../requests/models/requestModel";
import UserModel from "../../users/models/userModel";

@Table({ tableName: "assignments", timestamps: true, underscored: true })
export default class AssignmentModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @ForeignKey(() => RequestModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "request_id" })
  requestId!: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: "assigned" })
  status!: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "assigned_id" })
  assignedId!: string;

  @BelongsTo(() => RequestModel)
  request!: RequestModel;

  @BelongsTo(() => UserModel, { foreignKey: "assignedId", as: "assigned" })
  assigned!: UserModel;

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
