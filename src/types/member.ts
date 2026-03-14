export interface GymMember {
  memberId?: number;
  memberIdentifier: string;
  memberName: string;
  phone: string;
  gender: string;
  package: string;
  feeStatus: string;
  status: string;
}

export interface GymMembersResult {
  members: GymMember[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount?: number;
}

export interface MemberDetails {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  membershipPlanId: number | string;
  feeStatus: string;
  daysRemaining: number;
  bufferDaysRemaining: number;
  amountPaid: number;
  height: string | number;
  weight: string | number;
  personalTrainer: string;
  fitnessGoal: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  status?: string;
  memberIdentifier?: string;
}
