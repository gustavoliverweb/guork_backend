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
const requestModel_1 = __importDefault(require("../../requests/models/requestModel"));
const userModel_1 = __importDefault(require("../../users/models/userModel"));
let AssignmentModel = class AssignmentModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_1.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], AssignmentModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => requestModel_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: "request_id" }),
    __metadata("design:type", String)
], AssignmentModel.prototype, "requestId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        defaultValue: "in-progress",
    }),
    __metadata("design:type", String)
], AssignmentModel.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => userModel_1.default),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: true, field: "assigned_id" }),
    __metadata("design:type", String)
], AssignmentModel.prototype, "assignedId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => requestModel_1.default),
    __metadata("design:type", requestModel_1.default)
], AssignmentModel.prototype, "request", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => userModel_1.default, { foreignKey: "assignedId", as: "assigned" }),
    __metadata("design:type", userModel_1.default)
], AssignmentModel.prototype, "assigned", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], AssignmentModel.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], AssignmentModel.prototype, "updatedAt", void 0);
AssignmentModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "assignments", timestamps: true, underscored: true })
], AssignmentModel);
exports.default = AssignmentModel;
