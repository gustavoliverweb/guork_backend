import { Table, Column, Model, DataType, ForeignKey } from "sequelize-typescript";
import UserModel from "./userModel";
import ProfileModel from "../../profiles/models/profileModel";

@Table({ tableName: "user_profiles", timestamps: true, underscored: true })
export default class UserProfileModel extends Model {
  @ForeignKey(() => UserModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "user_id" })
  userId!: string;

  @ForeignKey(() => ProfileModel)
  @Column({ type: DataType.UUID, allowNull: false, field: "profile_id" })
  profileId!: string;
}
