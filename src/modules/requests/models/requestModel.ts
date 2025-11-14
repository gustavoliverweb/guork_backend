import { Table, Column, Model, DataType, PrimaryKey, ForeignKey, BelongsTo, HasOne } from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import UserModel from "../../users/models/userModel";
import ProfileModel from "../../profiles/models/profileModel";
import AssignmentModel from "../../assignments/models/assignmentModel";

@Table({ tableName: "requests", timestamps: true, underscored: true })
export default class RequestModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false, field: "employment_type", defaultValue: "full-time" })
  employmentType!: string;

  @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
  amount!: number;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "requester_id" })
  requesterId!: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: "in-progress" })
  status!: string;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "profile_id" })
  profileId!: string;

  @BelongsTo(() => UserModel, { foreignKey: "requesterId" })
  requester!: UserModel;

  @BelongsTo(() => ProfileModel)
  profile!: ProfileModel;

  @HasOne(() => AssignmentModel, { foreignKey: "requestId", as: "assignment" })
  assignment?: AssignmentModel;

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
