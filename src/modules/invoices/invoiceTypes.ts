import { Assignment } from "../assignments/assignmentsTypes";
import { User } from "../users/usersTypes";

export interface Invoice {
  id: string;
  purchaseOrder?: number;
  assignmentId?: string;
  assignment?: Assignment;
  amount: number;
  urlInvoice?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvoiceCreation
  extends Omit<Invoice, "id" | "createdAt" | "updatedAt" | "assignment"> {}
