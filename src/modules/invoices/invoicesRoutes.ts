import { Router } from "express";
import {
  getAllInvoices,
  getInvoicesByRequesterId,
  downloadInvoice,
} from "./invoiceController";
import { authMiddleware } from "../../shared/middlewares/authMiddleware";

const router = Router();

router.get("/", authMiddleware, getAllInvoices);
router.post("/download", authMiddleware, downloadInvoice);
router.get("/byRequest/:id", authMiddleware, getInvoicesByRequesterId);

export default router;
