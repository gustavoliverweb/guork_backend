"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const usersService_1 = require("./usersService");
const usersZodSchema_1 = require("./schemas/usersZodSchema");
const zod_1 = require("zod");
const mailChimpService_1 = require("../../shared/services/mailChimpService");
const bunnyService_1 = require("../../shared/services/bunnyService");
const firebasePush_1 = __importDefault(require("../../shared/services/firebasePush"));
const models_1 = require("../../models");
class UserController {
    constructor() {
        this.createUser = async (req, res) => {
            try {
                const validatedData = usersZodSchema_1.createUserSchema.parse(req.body);
                if (req.file) {
                    const uploadResult = await this.bunny.upload(`users/profile-picture/${Date.now()}_${req.file.originalname}`, req.file.buffer, req.file.mimetype);
                    validatedData.profileImg = uploadResult.publicUrl;
                }
                const user = await this.userService.createUser(validatedData);
                res.status(201).json(user);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ errors: error.issues });
                    return;
                }
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.getAllUsers = async (req, res) => {
            try {
                const pagination = {
                    page: Number.parseInt(req.query.page || "1", 10),
                    pageSize: Number.parseInt(req.query.pageSize || "10", 10),
                    sortBy: req.query.sortBy || undefined,
                    sortOrder: req.query.sortOrder,
                    search: req.query.search || undefined,
                    role: req.query.role || undefined,
                    profile: req.query.profile || undefined,
                };
                const result = await this.userService.getAllUsers(pagination);
                res.status(200).json(result);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.getUserById = async (req, res) => {
            try {
                const { id } = req.params;
                const user = await this.userService.getUserById(id);
                res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.sendNotifications = async (req, res) => {
            try {
                if (req.body.id !== undefined && Number(req.body.id) === 0) {
                    await models_1.NotificationModel.create({
                        title: req.body.title,
                        content: req.body.content,
                        userIds: req.body.userIds,
                    });
                }
                if (req.body.userIds.length > 0) {
                    for (var i = 0; i < req.body.userIds.length; i++) {
                        const sessionTemp = await models_1.SessionModel.findAll({
                            where: { user_id: req.body.userIds[i] },
                        });
                        if (sessionTemp) {
                            for (var j = 0; j < sessionTemp.length; j++) {
                                await this.servicePush.sendNotification(sessionTemp[j].tokenPush, req.body.title, req.body.content);
                            }
                        }
                    }
                }
                else {
                    const usersAll = await models_1.UserModel.findAll();
                    for (var i = 0; i < usersAll.length; i++) {
                        const sessionTemp = await models_1.SessionModel.findAll({
                            where: { user_id: usersAll[i].id },
                        });
                        if (sessionTemp) {
                            for (var j = 0; j < sessionTemp.length; j++) {
                                await this.servicePush.sendNotification(sessionTemp[j].tokenPush, req.body.title, req.body.content);
                            }
                        }
                    }
                }
                res.status(200).json({ response: "success" });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const { id } = req.params;
                const validatedData = usersZodSchema_1.updateUserSchema.parse(req.body);
                if (req.file) {
                    if (validatedData.profileImg) {
                        await this.bunny.delete(validatedData.profileImg ?? "");
                    }
                    const uploadResult = await this.bunny.upload(`users/profile-picture/${Date.now()}_${req.file.originalname}`, req.file.buffer, req.file.mimetype);
                    validatedData.profileImg = uploadResult.publicUrl;
                }
                console.log(validatedData);
                const user = await this.userService.updateUser(id, validatedData);
                res.status(200).json(user);
            }
            catch (error) {
                if (error instanceof zod_1.ZodError) {
                    res.status(400).json({ errors: error.issues });
                    return;
                }
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.deleteUser = async (req, res) => {
            try {
                const { id } = req.params;
                await this.userService.deleteUser(id);
                res.status(200).json({ message: "User deleted successfully" });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(404).json({ message: error.message });
                    return;
                }
                res.status(500).json({ message: "Internal server error" });
            }
        };
        this.userService = new usersService_1.UserService();
        this.mandrill = new mailChimpService_1.MailChimpService();
        this.bunny = new bunnyService_1.BunnyService();
        this.servicePush = new firebasePush_1.default();
    }
}
exports.UserController = UserController;
