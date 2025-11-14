"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilesService = void 0;
const profilesRepository_1 = require("./profilesRepository");
class ProfilesService {
    constructor() {
        this.profilesRepository = new profilesRepository_1.ProfilesRepository();
    }
    async createProfile(data) {
        const profile = await this.profilesRepository.create({
            ...data,
            status: data.status || "available",
        });
        return profile;
    }
    async getAllProfiles(pagination) {
        pagination.page = pagination.page > 0 ? pagination.page : 1;
        pagination.pageSize = pagination.pageSize > 0 ? pagination.pageSize : 10;
        const { rows, count } = await this.profilesRepository.findAll(pagination);
        const response = {
            items: rows,
            totalItems: count,
            totalPages: Math.ceil(count / pagination.pageSize) || 1,
            currentPage: pagination.page,
            pageSize: pagination.pageSize,
        };
        return response;
    }
    async getProfileById(id) {
        const profile = await this.profilesRepository.findById(id);
        if (!profile) {
            throw new Error("Profile not found");
        }
        return profile;
    }
    async updateProfile(id, data) {
        const profile = await this.profilesRepository.update(id, data);
        if (!profile) {
            throw new Error("Profile not found");
        }
        return profile;
    }
    async deleteProfile(id) {
        const deleted = await this.profilesRepository.delete(id);
        if (!deleted) {
            throw new Error("Profile not found");
        }
    }
}
exports.ProfilesService = ProfilesService;
