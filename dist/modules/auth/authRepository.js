"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRepository = void 0;
const models_1 = require("../../models");
const sessionModel_1 = __importDefault(require("./models/sessionModel"));
class AuthRepository {
    async createSession(token, ip, userId, tokenPush) {
        return await sessionModel_1.default.create({ token, ip, userId, tokenPush });
    }
    async findSessionByToken(token) {
        return await sessionModel_1.default.findOne({ where: { token } });
    }
    async deleteSession(token) {
        const session = await sessionModel_1.default.findOne({ where: { token } });
        if (!session)
            return false;
        await session.destroy();
        return true;
    }
    async deleteUserSessions(userId) {
        return await sessionModel_1.default.destroy({ where: { userId } });
    }
    async createPasswordResetRequest(token, userId) {
        return await models_1.PasswordResetRequestModel.create({ token, userId });
    }
    async findPasswordResetRequestByToken(token) {
        return await models_1.PasswordResetRequestModel.findOne({ where: { token } });
    }
}
exports.AuthRepository = AuthRepository;
