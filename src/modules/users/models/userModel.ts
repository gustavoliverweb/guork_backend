import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { UUIDV4 } from "sequelize";
import SessionModel from "../../auth/models/sessionModel";
import PasswordResetRequestModel from "../../auth/models/passwordResetRequestModel";
import ProfileModel from "../../profiles/models/profileModel";
import UserProfileModel from "./userProfileModel";
import RequestModel from "../../requests/models/requestModel";
import AssignmentModel from "../../assignments/models/assignmentModel";

@Table({ tableName: "users", timestamps: false, underscored: true })
export default class UserModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: UUIDV4, allowNull: false })
  id!: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "first_name" })
  firstName?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "last_name" })
  lastName?: string;

  @Column({ type: DataType.TEXT, allowNull: false, unique: true })
  email!: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  phone?: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  password?: string;

  @Column({ type: DataType.TEXT, allowNull: true, defaultValue: "user" })
  role?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "dni_img" })
  dniImg?: string;

  @Column({ type: DataType.TEXT, allowNull: true, unique: true })
  dni?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  birthdate?: Date;

  @Column({ type: DataType.TEXT, allowNull: true })
  address?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "postal_code" })
  postalCode?: string;

  @Column({ type: DataType.TEXT, allowNull: true, field: "profile_img" })
  profileImg?: string;

  @HasMany(() => SessionModel)
  sessions!: SessionModel[];

  @HasMany(() => PasswordResetRequestModel)
  passwordResetRequests!: PasswordResetRequestModel[];

  @BelongsToMany(() => ProfileModel, () => UserProfileModel)
  profiles!: ProfileModel[];

  @HasMany(() => RequestModel, { foreignKey: "requesterId", as: "requests" })
  requests!: RequestModel[];

  @HasMany(() => AssignmentModel, { foreignKey: "assignedId", as: "assignments" })
  assignments!: AssignmentModel[];

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

  @Column({ type: DataType.TEXT, allowNull: true, field: "page_web" })
  pageWeb?: string;
  @Column({ type: DataType.TEXT, allowNull: true, field: "name_company" })
  nameCompany?: string;
  @Column({ type: DataType.TEXT, allowNull: true, field: "nif" })
  nif?: string;
  @Column({ type: DataType.TEXT, allowNull: true, field: "email_company" })
  emailCompany?: string;

  toJSON() {
    const values = { ...this.get() } as any;
    delete values.password;
    return values;
  }
}
