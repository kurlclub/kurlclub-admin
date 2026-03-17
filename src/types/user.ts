export interface AppUser {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole | string;
  phoneNumber?: string | null;
  photoPath?: string | null;
  createdAt?: string;
}

export type UserRole = 'super_admin' | 'admin';
