export interface Gym {
  id: number;
  gymName: string;
  location: string;
  contactNumber1: string;
  contactNumber2?: string | null;
  email: string;
  gymIdentifier: string;
  status: string;
  gymAdminId: number;
  memberCount?: number;
  createdAt?: string;
  socialLinks?: string | null;
}

export interface GymFormData {
  gymName: string;
  location: string;
  contactNumber1: string;
  contactNumber2?: string;
  email: string;
  gymAdminId: number;
  status: string;
  gymIdentifier: string;
  socialLinks?: string;
}
