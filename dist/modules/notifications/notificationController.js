"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notificationService_1 = __importDefault(require("./notificationService"));
class NotificationController {
    constructor() {
        this.getAllNtfs = async (req, res) => {
            try {
                const pagination = {
                    page: Number.parseInt(req.query.page || "1", 10),
                    pageSize: Number.parseInt(req.query.pageSize || "10", 10),
                    sortBy: req.query.sortBy || undefined,
                    sortOrder: req.query.sortOrder,
                    search: req.query.search || undefined,
                    status: req.query.status || undefined,
                };
                const data = await this.ntfService.getNotifications(pagination);
                res.status(200).json(data);
            }
            catch (error) {
                res.status(400).json({ error });
            }
        };
        this.ntfService = new notificationService_1.default();
    }
}
exports.default = NotificationController;
