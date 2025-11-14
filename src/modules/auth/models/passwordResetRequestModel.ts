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
import UserModel from "../../users/models/userModel";

@Table({
  tableName: "password_reset_requests",
  timestamps: false,
  underscored: true,
})
export default class PasswordResetRequestModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  token!: string;

  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
  userId!: string;

  @BelongsTo(() => UserModel)
  user!: UserModel;

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
