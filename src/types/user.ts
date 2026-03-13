export interface AppUser {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  uid: string;
  photoURL?: string;
  isMultiClub: boolean;
  subscription?: {
    plan: {
      id: number;
      name: string;
      tier: string;
      status: 'active' | 'expired' | 'cancelled';
    };
    subscriptionId: number;
    billingCycle: 'monthly' | 'sixMonths' | 'yearly';
    startDate: string;
    endDate: string;
    usageLimits: {
      maxClubs: number;
      maxMembers: number;
      maxTrainers: number;
      maxStaffs: number;
    };
    features: Record<string, boolean | number>;
  };
  gyms: Array<{
    gymId: number;
    gymName: string;
    gymLocation: string;
  }>;
  clubs: Array<{
    gymId: number;
    gymName: string;
    location: string;
    status: number;
    gymIdentifier: string;
    photoPath: string | null;
  }>;
}

export interface GymDetails {
  id: number;
  gymName: string;
  location: string;
  contactNumber1: string;
  contactNumber2: string | null;
  email: string;
  socialLinks: string;
  gymIdentifier: string;
  gymAdminId: number;
  status: string;
  photoPath: string | null;
}
