export interface Profile {
  id: string;
  name: string;
  status: string;
  descriptions?: string;
  amount?: number;
  partTimeAmount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProfileCreation
  extends Omit<Profile, "id" | "createdAt" | "updatedAt"> {}
