import { Router } from "express";
import {
  createRequest,
  getAllRequests,
  getRequestById,
  updateRequest,
  deleteRequest,
  createIntentPayStripe,
  createSuscriptionStripe,
} from "./requestsController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();

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
router.post("/", authMiddleware, createRequest);

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
router.get("/", authMiddleware, getAllRequests);

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
router.get("/:id", authMiddleware, getRequestById);

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
router.put("/:id", authMiddleware, updateRequest);

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
router.delete("/:id", authMiddleware, deleteRequest);

router.post("/createIntentStripe", authMiddleware, createIntentPayStripe);
router.post("/createSuscriptionStripe", authMiddleware, createSuscriptionStripe);
export default router;
