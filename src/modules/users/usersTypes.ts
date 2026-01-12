import { Profile } from "../profiles/profilesTypes";

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
  role?: "user" | "admin" | "expert";
  dniImg?: string;
  dni?: string;
  birthdate?: Date;
  address?: string;
  postalCode?: string;
  profileImg?: string;
  pageWeb?: string;
  nameCompany?: string;
  nif?: string;
  emailCompany?: string;
  profiles?: Profile[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserCreation
  extends Omit<User, "id" | "createdAt" | "updatedAt" | "profiles"> { }

export interface UserResponse
  extends Omit<User, "password" | "createdAt" | "updatedAt"> { }
