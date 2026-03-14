export interface SubscriptionLimits {
  maxClubs: number;
  maxMembers: number;
  maxTrainers: number;
  maxStaffs: number;
}

export interface SubscriptionFeatures {
  // Notifications
  emailNotifications: boolean;
  whatsAppNotifications: boolean;
  realTimeNotifications: boolean;

  // Attendance
  manualAttendance: boolean;
  liveAttendance: boolean;
  doorAccessAttendance: boolean;
  qrCodeCheckIn: boolean;

  // Management
  memberManagement: boolean;
  trainerManagement: boolean;
  staffManagement: boolean;
  membershipManagement: boolean;
  roleBasedAccess: boolean;

  // Finance
  paymentTracking: boolean;
  paymentRecording: boolean;
  invoiceGeneration: boolean;
  expenseTracker: boolean;
  ptCollections: boolean;
  commissionTracking: boolean;

  // Business Tools
  leadManagement: boolean;
  offersDiscounts: boolean;
  classScheduling: boolean;

  // Analytics
  basicReports: boolean;
  revenueAnalytics: boolean;
  advancedAnalytics: boolean;
  customReports: boolean;
  exportToExcel: boolean;
  reportsAnalytics: boolean;

  // Portals
  memberPortal: boolean;
  trainerPortal: boolean;
  mobileAppAccess: boolean;

  // Support
  emailSupport: boolean;
  chatSupport: boolean;
  phoneSupport: boolean;
  prioritySupport: boolean;
  prioritySupport24x7: boolean;

  // Limits
  devicesPerUserLimit: number;
  staffLoginLimit: number;
  trainerLoginLimit: number;
}

export interface Subscription {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  monthlyPrice: number;
  sixMonthsPrice: number;
  yearlyPrice: number;
  isPopular: boolean;
  badge?: string;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
}

export interface SubscriptionFormData {
  name: string;
  subtitle: string;
  description: string;
  badge?: string;
  isPopular: boolean;
  monthlyPrice: number;
  sixMonthsPrice: number;
  yearlyPrice: number;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
}
