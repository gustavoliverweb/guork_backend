import { Router } from "express";
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} from "./assignmentsController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();

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
router.post("/", authMiddleware, createAssignment);

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
router.get("/", authMiddleware, getAllAssignments);

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
router.get("/:id", authMiddleware, getAssignmentById);

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
router.put("/:id", authMiddleware, updateAssignment);

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
router.delete("/:id", authMiddleware, deleteAssignment);

export default router;
