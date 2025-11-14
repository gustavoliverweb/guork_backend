export interface Profile {
  id: string;
  name: string;
  status: string;
  descriptions?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileCreation
  extends Omit<Profile, "id" | "createdAt" | "updatedAt"> {}
