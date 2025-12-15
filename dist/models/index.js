"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.models = exports.InvoiceModel = exports.AssignmentModel = exports.RequestModel = exports.UserProfileModel = exports.ProfileModel = exports.PasswordResetRequestModel = exports.SessionModel = exports.UserModel = void 0;
const userModel_1 = __importDefault(require("../modules/users/models/userModel"));
exports.UserModel = userModel_1.default;
const sessionModel_1 = __importDefault(require("../modules/auth/models/sessionModel"));
exports.SessionModel = sessionModel_1.default;
const passwordResetRequestModel_1 = __importDefault(require("../modules/auth/models/passwordResetRequestModel"));
exports.PasswordResetRequestModel = passwordResetRequestModel_1.default;
const profileModel_1 = __importDefault(require("../modules/profiles/models/profileModel"));
exports.ProfileModel = profileModel_1.default;
const userProfileModel_1 = __importDefault(require("../modules/users/models/userProfileModel"));
exports.UserProfileModel = userProfileModel_1.default;
const requestModel_1 = __importDefault(require("../modules/requests/models/requestModel"));
exports.RequestModel = requestModel_1.default;
const assignmentModel_1 = __importDefault(require("../modules/assignments/models/assignmentModel"));
exports.AssignmentModel = assignmentModel_1.default;
const invoiceModel_1 = __importDefault(require("../modules/invoices/models/invoiceModel"));
exports.InvoiceModel = invoiceModel_1.default;
exports.models = [
    userModel_1.default,
    sessionModel_1.default,
    passwordResetRequestModel_1.default,
    profileModel_1.default,
    userProfileModel_1.default,
    requestModel_1.default,
    assignmentModel_1.default, invoiceModel_1.default
];
