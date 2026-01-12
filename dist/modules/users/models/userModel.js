"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const sessionModel_1 = __importDefault(require("../../auth/models/sessionModel"));
const passwordResetRequestModel_1 = __importDefault(require("../../auth/models/passwordResetRequestModel"));
const profileModel_1 = __importDefault(require("../../profiles/models/profileModel"));
const userProfileModel_1 = __importDefault(require("./userProfileModel"));
const requestModel_1 = __importDefault(require("../../requests/models/requestModel"));
const assignmentModel_1 = __importDefault(require("../../assignments/models/assignmentModel"));
let UserModel = class UserModel extends sequelize_typescript_1.Model {
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        return values;
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_1.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], UserModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "first_name" }),
    __metadata("design:type", String)
], UserModel.prototype, "firstName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "last_name" }),
    __metadata("design:type", String)
], UserModel.prototype, "lastName", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false, unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], UserModel.prototype, "phone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], UserModel.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, defaultValue: "user" }),
    __metadata("design:type", String)
], UserModel.prototype, "role", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "dni_img" }),
    __metadata("design:type", String)
], UserModel.prototype, "dniImg", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, unique: true }),
    __metadata("design:type", String)
], UserModel.prototype, "dni", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE, allowNull: true }),
    __metadata("design:type", Date)
], UserModel.prototype, "birthdate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true }),
    __metadata("design:type", String)
], UserModel.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "postal_code" }),
    __metadata("design:type", String)
], UserModel.prototype, "postalCode", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "profile_img" }),
    __metadata("design:type", String)
], UserModel.prototype, "profileImg", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => sessionModel_1.default),
    __metadata("design:type", Array)
], UserModel.prototype, "sessions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => passwordResetRequestModel_1.default),
    __metadata("design:type", Array)
], UserModel.prototype, "passwordResetRequests", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => profileModel_1.default, () => userProfileModel_1.default),
    __metadata("design:type", Array)
], UserModel.prototype, "profiles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => requestModel_1.default, { foreignKey: "requesterId", as: "requests" }),
    __metadata("design:type", Array)
], UserModel.prototype, "requests", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => assignmentModel_1.default, { foreignKey: "assignedId", as: "assignments" }),
    __metadata("design:type", Array)
], UserModel.prototype, "assignments", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], UserModel.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], UserModel.prototype, "updatedAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "page_web" }),
    __metadata("design:type", String)
], UserModel.prototype, "pageWeb", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "name_company" }),
    __metadata("design:type", String)
], UserModel.prototype, "nameCompany", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "nif" }),
    __metadata("design:type", String)
], UserModel.prototype, "nif", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: true, field: "email_company" }),
    __metadata("design:type", String)
], UserModel.prototype, "emailCompany", void 0);
UserModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "users", timestamps: false, underscored: true })
], UserModel);
exports.default = UserModel;
