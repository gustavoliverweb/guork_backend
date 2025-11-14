import { Router } from "express";
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from "./profilesController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();

/**
 * @swagger
 * /profiles:
 *   post:
 *     summary: Create a new profile
 *     tags: [Profiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProfile'
 *     responses:
 *       201:
 *         description: Profile created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       400:
 *         description: Invalid input
 */
router.post("/",authMiddleware, createProfile);
/**
 * @swagger
 * /profiles:
 *   get:
 *     summary: Get all profiles
 *     tags: [Profiles]
 *     responses:
 *       200:
 *         description: List of profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Profile'
 */
router.get("/", authMiddleware, getAllProfiles);
/**
 * @swagger
 * /profiles/{id}:
 *   get:
 *     summary: Get profile by ID
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Profile found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.get("/:id", authMiddleware, getProfileById);
/**
 * @swagger
 * /profiles/{id}:
 *   put:
 *     summary: Update a profile
 *     tags: [Profiles]
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
 *             $ref: '#/components/schemas/UpdateProfile'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Profile'
 *       404:
 *         description: Profile not found
 */
router.put("/:id", authMiddleware, updateProfile);
/**
 * @swagger
 * /profiles/{id}:
 *   delete:
 *     summary: Delete a profile
 *     tags: [Profiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       404:
 *         description: Profile not found
 */
router.delete("/:id", authMiddleware, deleteProfile);

export default router;
