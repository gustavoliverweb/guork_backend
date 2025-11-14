"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const assignmentsController_1 = require("./assignmentsController");
const authMiddleware_1 = require("../../shared/middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAssignment'
 *     responses:
 *       201:
 *         description: Assignment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       400:
 *         description: Invalid input
 */
router.post("/", authMiddleware_1.authMiddleware, assignmentsController_1.createAssignment);
/**
 * @swagger
 * /assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: List of assignments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Assignment'
 */
router.get("/", authMiddleware_1.authMiddleware, assignmentsController_1.getAllAssignments);
/**
 * @swagger
 * /assignments/{id}:
 *   get:
 *     summary: Get assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Assignment found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 */
router.get("/:id", authMiddleware_1.authMiddleware, assignmentsController_1.getAssignmentById);
/**
 * @swagger
 * /assignments/{id}:
 *   put:
 *     summary: Update an assignment
 *     tags: [Assignments]
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
 *             $ref: '#/components/schemas/UpdateAssignment'
 *     responses:
 *       200:
 *         description: Assignment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Assignment'
 *       404:
 *         description: Assignment not found
 */
router.put("/:id", authMiddleware_1.authMiddleware, assignmentsController_1.updateAssignment);
/**
 * @swagger
 * /assignments/{id}:
 *   delete:
 *     summary: Delete an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Assignment deleted successfully
 *       404:
 *         description: Assignment not found
 */
router.delete("/:id", authMiddleware_1.authMiddleware, assignmentsController_1.deleteAssignment);
exports.default = router;
