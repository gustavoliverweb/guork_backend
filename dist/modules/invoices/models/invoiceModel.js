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
const models_1 = require("../../../models");
const moment_1 = __importDefault(require("moment"));
let InvoiceModel = class InvoiceModel extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_1.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], InvoiceModel.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
        defaultValue: 1,
        field: "purchase_order",
    }),
    __metadata("design:type", Number)
], InvoiceModel.prototype, "purchaseOrder", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2), allowNull: false }),
    __metadata("design:type", String)
], InvoiceModel.prototype, "amount", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.TEXT,
        allowNull: false,
        defaultValue: "",
        field: "url_invoice",
    }),
    __metadata("design:type", String)
], InvoiceModel.prototype, "urlInvoice", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => models_1.AssignmentModel),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, field: "assignment_id" }),
    __metadata("design:type", String)
], InvoiceModel.prototype, "assignmentId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => models_1.AssignmentModel),
    __metadata("design:type", models_1.AssignmentModel)
], InvoiceModel.prototype, "assignment", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "created_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], InvoiceModel.prototype, "createdAt", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.VIRTUAL,
        get() {
            const creationDate = this.getDataValue("createdAt");
            if (creationDate) {
                return (0, moment_1.default)(creationDate).add(1, "month").toDate();
            }
            return null;
        },
    }),
    __metadata("design:type", Date)
], InvoiceModel.prototype, "dueDate", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
        allowNull: false,
        field: "updated_at",
        defaultValue: new Date(),
    }),
    __metadata("design:type", Date)
], InvoiceModel.prototype, "updatedAt", void 0);
InvoiceModel = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "invoices", timestamps: false })
], InvoiceModel);
exports.default = InvoiceModel;
