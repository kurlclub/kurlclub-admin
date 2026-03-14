export interface ClientGymSummary {
  id: number;
  gymName: string;
  location: string;
  contactNumber1: string;
  email: string;
  status: string;
  gymIdentifier: string;
}

export interface Client {
  id?: number;
  clientId?: number;
  userId?: number;
  userName: string;
  email: string;
  phoneNumber: string;
  subscriptionPlanName: string;
  createdAt: string;
  lastLoginAt: string | null;
  gyms?: ClientGymSummary[];
  gymsCount?: number;
  photoURL?: string;
}

export interface ClientDetails extends Client {
  gyms: ClientGymSummary[];
}
