"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const notificationController_1 = __importDefault(require("./notificationController"));
const router = (0, express_1.Router)();
const ntfC = new notificationController_1.default();
router.get("/", authMiddleware_1.authMiddleware, ntfC.getAllNtfs);
exports.default = router;
