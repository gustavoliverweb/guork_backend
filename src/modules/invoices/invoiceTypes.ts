
import { Assignment } from "../assignments/assignmentsTypes";
import { User } from "../users/usersTypes";

export interface Invoice {
    id: string;
    assignedId?: string;
    assigned: Assignment;
    amount: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface InvoiceCreation
    extends Omit<
        Invoice,
        "id" | "createdAt" | "updatedAt" | "assigned"
    > { }
