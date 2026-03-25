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
  attendanceTracking: boolean;

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
  basicDashboard: boolean;
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
  customBranding: boolean;

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
  photoPath?: string | null;
  createdAt?: string;
  updatedAt?: string;
  limits: SubscriptionLimits;
  features: SubscriptionFeatures;
}

export interface SubscriptionFormLimits {
  MaxClubs: number;
  MaxMembers: number;
  MaxTrainers: number;
  MaxStaffs: number;
}

export interface SubscriptionFormFeatures {
  // Notifications
  EmailNotifications: boolean;
  WhatsAppNotifications: boolean;
  RealTimeNotifications: boolean;

  // Attendance
  ManualAttendance: boolean;
  LiveAttendance: boolean;
  DoorAccessAttendance: boolean;
  QrCodeCheckIn: boolean;
  AttendanceTracking: boolean;

  // Management
  MemberManagement: boolean;
  TrainerManagement: boolean;
  StaffManagement: boolean;
  MembershipManagement: boolean;
  RoleBasedAccess: boolean;

  // Finance
  PaymentTracking: boolean;
  PaymentRecording: boolean;
  InvoiceGeneration: boolean;
  ExpenseTracker: boolean;
  PtCollections: boolean;
  CommissionTracking: boolean;

  // Business Tools
  LeadManagement: boolean;
  OffersDiscounts: boolean;
  ClassScheduling: boolean;

  // Analytics
  BasicDashboard: boolean;
  BasicReports: boolean;
  RevenueAnalytics: boolean;
  AdvancedAnalytics: boolean;
  CustomReports: boolean;
  ExportToExcel: boolean;
  ReportsAnalytics: boolean;

  // Portals
  MemberPortal: boolean;
  TrainerPortal: boolean;
  MobileAppAccess: boolean;
  CustomBranding: boolean;

  // Support
  EmailSupport: boolean;
  ChatSupport: boolean;
  PhoneSupport: boolean;
  PrioritySupport: boolean;
  PrioritySupport24x7: boolean;

  // Limits
  DevicesPerUserLimit: number;
  StaffLoginLimit: number;
  TrainerLoginLimit: number;
}

export interface SubscriptionFormData {
  Name: string;
  Subtitle: string;
  Description: string;
  Badge?: string;
  IsPopular: boolean;
  MonthlyPrice: number;
  SixMonthsPrice: number;
  YearlyPrice: number;
  Photo?: File | string | null;
  Limits: SubscriptionFormLimits;
  Features: SubscriptionFormFeatures;
}
