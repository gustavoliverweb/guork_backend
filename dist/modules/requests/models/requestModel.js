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
const userModel_1 = __importDefault(require("../../users/models/userModel"));
const profileModel_1 = __importDefault(require("../../profiles/models/profileModel"));
const assignmentModel_1 = __importDefault(require("../../assignments/models/assignmentModel"));
let RequestModel = class RequestModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_1.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], RequestModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false, field: "employment_type", defaultValue: "full-time" }),
    __metadata("design:type", String)
], RequestModel.prototype, "employmentType", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.FLOAT, allowNull: false, defaultValue: 0 }),
    __metadata("design:type", Number)
], RequestModel.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => userModel_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: "requester_id" }),
    __metadata("design:type", String)
], RequestModel.prototype, "requesterId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT, allowNull: false, defaultValue: "in-progress" }),
    __metadata("design:type", String)
], RequestModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => profileModel_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: "profile_id" }),
    __metadata("design:type", String)
], RequestModel.prototype, "profileId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => userModel_1.default, { foreignKey: "requesterId" }),
    __metadata("design:type", userModel_1.default)
], RequestModel.prototype, "requester", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => profileModel_1.default),
    __metadata("design:type", profileModel_1.default)
], RequestModel.prototype, "profile", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => assignmentModel_1.default, { foreignKey: "requestId", as: "assignment" }),
    __metadata("design:type", assignmentModel_1.default)
], RequestModel.prototype, "assignment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], RequestModel.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], RequestModel.prototype, "updatedAt", void 0);
RequestModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "requests", timestamps: true, underscored: true })
], RequestModel);
exports.default = RequestModel;
