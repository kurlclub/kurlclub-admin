export interface AppUser {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole | string;
  createdAt?: string;
}

export type UserRole = 'super_admin' | 'admin';
