"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requestsController_1 = require("./requestsController");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRequest'
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware_1.authMiddleware, requestsController_1.createRequest);
/**
 * @swagger
 * /requests:
 *   get:
 *     summary: Get all requests
 *     tags: [Requests]
 *     responses:
 *       200:
 *         description: List of requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Request'
 */
router.get("/", authMiddleware_1.authMiddleware, requestsController_1.getAllRequests);
/**
 * @swagger
 * /requests/{id}:
 *   get:
 *     summary: Get request by ID
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Request found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
router.get("/:id", authMiddleware_1.authMiddleware, requestsController_1.getRequestById);
/**
 * @swagger
 * /requests/{id}:
 *   put:
 *     summary: Update a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRequest'
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       404:
 *         description: Request not found
 */
router.put("/:id", authMiddleware_1.authMiddleware, requestsController_1.updateRequest);
/**
 * @swagger
 * /requests/{id}:
 *   delete:
 *     summary: Delete a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Request deleted successfully
 *       404:
 *         description: Request not found
 */
router.delete("/:id", authMiddleware_1.authMiddleware, requestsController_1.deleteRequest);
router.post("/createIntentStripe", authMiddleware_1.authMiddleware, requestsController_1.createIntentPayStripe);
router.post("/createSuscriptionStripe", authMiddleware_1.authMiddleware, requestsController_1.createSuscriptionStripe);
exports.default = router;
