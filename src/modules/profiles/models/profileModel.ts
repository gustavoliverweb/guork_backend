import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  BelongsToMany,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import UserModel from "../../users/models/userModel";
import UserProfileModel from "../../users/models/userProfileModel";

@Table({ tableName: "profiles", timestamps: true, underscored: true })
export default class ProfileModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  name!: string;

  @Column({ type: DataType.TEXT, allowNull: false, defaultValue: "available" })
  status!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  descriptions?: string;

  @Column({ type: DataType.DECIMAL(10, 2), allowNull: false, defaultValue: 0.0 })
  amount!: number;

  @BelongsToMany(() => UserModel, () => UserProfileModel)
  users!: UserModel[];
}
