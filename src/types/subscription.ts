export interface SubscriptionLimits {
  maxClubs: number;
  maxMembers: number;
  maxTrainers: number;
  maxStaffs: number;
  maxMembershipPlans: number;
  maxWorkoutPlans: number;
  maxLeadsPerMonth: number;
}

export interface SubscriptionStudioDashboardFeatures {
  enabled: boolean;
  paymentInsights: boolean;
  skipperStats: boolean;
  attendanceStats: boolean;
}

export interface SubscriptionAttendanceFeatures {
  manual: boolean;
  automatic: boolean;
  memberInsights: boolean;
  deviceManagement: boolean;
}

export interface SubscriptionProgramsFeatures {
  membershipPlans: boolean;
  workoutPlans: boolean;
}

export interface SubscriptionStaffManagementFeatures {
  activityTracking: boolean;
  staffLogin: boolean;
}

export interface SubscriptionExpensesFeatures {
  reportsDashboard: boolean;
  expenseManagement: boolean;
}

export interface SubscriptionHelpAndSupportFeatures {
  ticketingPortal: boolean;
  whatsApp: boolean;
  email: boolean;
  call: boolean;
}

export interface SubscriptionWhatsAppNotificationFeatures {
  paymentReminders: boolean;
  membershipExpiry: boolean;
  lowAttendance: boolean;
  specialDays: boolean;
}

export interface SubscriptionInvoiceFeatures {
  customTemplates: boolean;
}

export interface SubscriptionNotificationFeatures {
  realtime: boolean;
  whatsApp: boolean;
  email: boolean;
  push: boolean;
}

export interface SubscriptionFeatures {
  studioDashboard: SubscriptionStudioDashboardFeatures;
  memberManagement: boolean;
  paymentManagement: boolean;
  attendance: SubscriptionAttendanceFeatures;
  leadsManagement: boolean;
  programs: SubscriptionProgramsFeatures;
  staffManagement: SubscriptionStaffManagementFeatures;
  payrollManagement: boolean;
  expenses: SubscriptionExpensesFeatures;
  helpAndSupport: SubscriptionHelpAndSupportFeatures;
  whatsAppNotifications: SubscriptionWhatsAppNotificationFeatures;
  invoice: SubscriptionInvoiceFeatures;
  notifications: SubscriptionNotificationFeatures;
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
  MaxMembershipPlans: number;
  MaxWorkoutPlans: number;
  MaxLeadsPerMonth: number;
}

export interface SubscriptionFormStudioDashboardFeatures {
  Enabled: boolean;
  PaymentInsights: boolean;
  SkipperStats: boolean;
  AttendanceStats: boolean;
}

export interface SubscriptionFormAttendanceFeatures {
  Manual: boolean;
  Automatic: boolean;
  MemberInsights: boolean;
  DeviceManagement: boolean;
}

export interface SubscriptionFormProgramsFeatures {
  MembershipPlans: boolean;
  WorkoutPlans: boolean;
}

export interface SubscriptionFormStaffManagementFeatures {
  ActivityTracking: boolean;
  StaffLogin: boolean;
}

export interface SubscriptionFormExpensesFeatures {
  ReportsDashboard: boolean;
  ExpenseManagement: boolean;
}

export interface SubscriptionFormHelpAndSupportFeatures {
  TicketingPortal: boolean;
  WhatsApp: boolean;
  Email: boolean;
  Call: boolean;
}

export interface SubscriptionFormWhatsAppNotificationFeatures {
  PaymentReminders: boolean;
  MembershipExpiry: boolean;
  LowAttendance: boolean;
  SpecialDays: boolean;
}

export interface SubscriptionFormInvoiceFeatures {
  CustomTemplates: boolean;
}

export interface SubscriptionFormNotificationFeatures {
  Realtime: boolean;
  WhatsApp: boolean;
  Email: boolean;
  Push: boolean;
}

export interface SubscriptionFormFeatures {
  StudioDashboard: SubscriptionFormStudioDashboardFeatures;
  MemberManagement: boolean;
  PaymentManagement: boolean;
  Attendance: SubscriptionFormAttendanceFeatures;
  LeadsManagement: boolean;
  Programs: SubscriptionFormProgramsFeatures;
  StaffManagement: SubscriptionFormStaffManagementFeatures;
  PayrollManagement: boolean;
  Expenses: SubscriptionFormExpensesFeatures;
  HelpAndSupport: SubscriptionFormHelpAndSupportFeatures;
  WhatsAppNotifications: SubscriptionFormWhatsAppNotificationFeatures;
  Invoice: SubscriptionFormInvoiceFeatures;
  Notifications: SubscriptionFormNotificationFeatures;
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
