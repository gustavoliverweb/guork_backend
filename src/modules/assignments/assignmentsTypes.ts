import { Request } from "../requests/requestsTypes";
import { User } from "../users/usersTypes";

export interface Assignment {
  id: string;
  requestId: string;
  status: string;
  assignedId?: string;
  request?: Request;
  idSuscription?: string,
  assigned?: User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AssignmentCreation
  extends Omit<
    Assignment,
    "id" | "createdAt" | "updatedAt" | "request" | "assigned"
  > { }
