import { Profile } from "../profiles/profilesTypes";
import { User } from "../users/usersTypes";

export interface Request {
  id: string;
  employmentType: string;
  amount: number;
  requesterId: string;
  status: string;
  profileId: string;
  requester?: User;
  profile?: Profile;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RequestCreation
  extends Omit<Request, "id" | "createdAt" | "updatedAt" | "requester" | "profile"> {}
