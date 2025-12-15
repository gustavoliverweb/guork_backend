import { Router } from "express";
import { getInvoicesByRequesterId } from "./invoiceController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";
import upload from "../../shared/middlewares/uploadMiddleware";

const router = Router();

router.get("/byRequest/:id", authMiddleware, getInvoicesByRequesterId);



export default router;