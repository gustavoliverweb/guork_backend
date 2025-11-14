"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getAllProfiles = exports.createProfile = void 0;
const profilesService_1 = require("./profilesService");
const profilesZodSchema_1 = require("./schemas/profilesZodSchema");
const zod_1 = require("zod");
const profilesService = new profilesService_1.ProfilesService();
const createProfile = async (req, res) => {
    try {
        const validatedData = profilesZodSchema_1.createProfileSchema.parse(req.body);
        const profile = await profilesService.createProfile(validatedData);
        res.status(201).json(profile);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(500).json({ error: error.message });
    }
};
exports.createProfile = createProfile;
const getAllProfiles = async (req, res) => {
    try {
        const pagination = {
            page: Number.parseInt(req.query.page || "1", 10),
            pageSize: Number.parseInt(req.query.pageSize || "10", 10),
            sortBy: req.query.sortBy || undefined,
            sortOrder: req.query.sortOrder,
            search: req.query.search || undefined,
            status: req.query.status || undefined,
        };
        const result = await profilesService.getAllProfiles(pagination);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllProfiles = getAllProfiles;
const getProfileById = async (req, res) => {
    try {
        const { id } = req.params;
        const profile = await profilesService.getProfileById(id);
        res.json(profile);
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.getProfileById = getProfileById;
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const validatedData = profilesZodSchema_1.updateProfileSchema.parse(req.body);
        const profile = await profilesService.updateProfile(id, validatedData);
        res.json(profile);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ errors: error.issues });
        }
        res.status(404).json({ error: error.message });
    }
};
exports.updateProfile = updateProfile;
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
        await profilesService.deleteProfile(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(404).json({ error: error.message });
    }
};
exports.deleteProfile = deleteProfile;
