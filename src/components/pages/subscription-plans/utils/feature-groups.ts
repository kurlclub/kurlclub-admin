import type {
  SubscriptionFeatures,
  SubscriptionFormFeatures,
} from '@/types/subscription';

type FeatureKey = keyof SubscriptionFeatures;
type FormFeatureKey = keyof SubscriptionFormFeatures;

export const FEATURE_GROUPS = {
  notifications: {
    title: 'Notifications',
    features: [
      { key: 'emailNotifications', label: 'Email Notifications' },
      { key: 'whatsAppNotifications', label: 'WhatsApp Notifications' },
      { key: 'realTimeNotifications', label: 'Real-time Notifications' },
    ],
  },
  attendance: {
    title: 'Attendance',
    features: [
      { key: 'manualAttendance', label: 'Manual Attendance' },
      { key: 'liveAttendance', label: 'Live Attendance' },
      { key: 'doorAccessAttendance', label: 'Door Access Attendance' },
      { key: 'qrCodeCheckIn', label: 'QR Code Check-in' },
    ],
  },
  management: {
    title: 'Management',
    features: [
      { key: 'memberManagement', label: 'Member Management' },
      { key: 'trainerManagement', label: 'Trainer Management' },
      { key: 'staffManagement', label: 'Staff Management' },
      { key: 'membershipManagement', label: 'Membership Management' },
      { key: 'roleBasedAccess', label: 'Role-based Access' },
    ],
  },
  finance: {
    title: 'Finance',
    features: [
      { key: 'paymentTracking', label: 'Payment Tracking' },
      { key: 'paymentRecording', label: 'Payment Recording' },
      { key: 'invoiceGeneration', label: 'Invoice Generation' },
      { key: 'expenseTracker', label: 'Expense Tracker' },
      { key: 'ptCollections', label: 'PT Collections' },
      { key: 'commissionTracking', label: 'Commission Tracking' },
    ],
  },
  business: {
    title: 'Business Tools',
    features: [
      { key: 'leadManagement', label: 'Lead Management' },
      { key: 'offersDiscounts', label: 'Offers & Discounts' },
      { key: 'classScheduling', label: 'Class Scheduling' },
    ],
  },
  analytics: {
    title: 'Analytics',
    features: [
      { key: 'basicReports', label: 'Basic Reports' },
      { key: 'revenueAnalytics', label: 'Revenue Analytics' },
      { key: 'advancedAnalytics', label: 'Advanced Analytics' },
      { key: 'customReports', label: 'Custom Reports' },
      { key: 'exportToExcel', label: 'Export to Excel' },
      { key: 'reportsAnalytics', label: 'Reports & Analytics' },
    ],
  },
  portals: {
    title: 'Portals',
    features: [
      { key: 'memberPortal', label: 'Member Portal' },
      { key: 'trainerPortal', label: 'Trainer Portal' },
      { key: 'mobileAppAccess', label: 'Mobile App Access' },
    ],
  },
  support: {
    title: 'Support',
    features: [
      { key: 'emailSupport', label: 'Email Support' },
      { key: 'chatSupport', label: 'Chat Support' },
      { key: 'phoneSupport', label: 'Phone Support' },
      { key: 'prioritySupport', label: 'Priority Support' },
      { key: 'prioritySupport24x7', label: '24/7 Priority Support' },
    ],
  },
} as const satisfies Record<
  string,
  { title: string; features: { key: FeatureKey; label: string }[] }
>;

export const FORM_FEATURE_GROUPS = {
  notifications: {
    title: 'Notifications',
    features: [
      { key: 'EmailNotifications', label: 'Email Notifications' },
      { key: 'WhatsAppNotifications', label: 'WhatsApp Notifications' },
      { key: 'RealTimeNotifications', label: 'Real-time Notifications' },
    ],
  },
  attendance: {
    title: 'Attendance',
    features: [
      { key: 'ManualAttendance', label: 'Manual Attendance' },
      { key: 'LiveAttendance', label: 'Live Attendance' },
      { key: 'DoorAccessAttendance', label: 'Door Access Attendance' },
      { key: 'QrCodeCheckIn', label: 'QR Code Check-in' },
    ],
  },
  management: {
    title: 'Management',
    features: [
      { key: 'MemberManagement', label: 'Member Management' },
      { key: 'TrainerManagement', label: 'Trainer Management' },
      { key: 'StaffManagement', label: 'Staff Management' },
      { key: 'MembershipManagement', label: 'Membership Management' },
      { key: 'RoleBasedAccess', label: 'Role-based Access' },
    ],
  },
  finance: {
    title: 'Finance',
    features: [
      { key: 'PaymentTracking', label: 'Payment Tracking' },
      { key: 'PaymentRecording', label: 'Payment Recording' },
      { key: 'InvoiceGeneration', label: 'Invoice Generation' },
      { key: 'ExpenseTracker', label: 'Expense Tracker' },
      { key: 'PtCollections', label: 'PT Collections' },
      { key: 'CommissionTracking', label: 'Commission Tracking' },
    ],
  },
  business: {
    title: 'Business Tools',
    features: [
      { key: 'LeadManagement', label: 'Lead Management' },
      { key: 'OffersDiscounts', label: 'Offers & Discounts' },
      { key: 'ClassScheduling', label: 'Class Scheduling' },
    ],
  },
  analytics: {
    title: 'Analytics',
    features: [
      { key: 'BasicReports', label: 'Basic Reports' },
      { key: 'RevenueAnalytics', label: 'Revenue Analytics' },
      { key: 'AdvancedAnalytics', label: 'Advanced Analytics' },
      { key: 'CustomReports', label: 'Custom Reports' },
      { key: 'ExportToExcel', label: 'Export to Excel' },
      { key: 'ReportsAnalytics', label: 'Reports & Analytics' },
    ],
  },
  portals: {
    title: 'Portals',
    features: [
      { key: 'MemberPortal', label: 'Member Portal' },
      { key: 'TrainerPortal', label: 'Trainer Portal' },
      { key: 'MobileAppAccess', label: 'Mobile App Access' },
    ],
  },
  support: {
    title: 'Support',
    features: [
      { key: 'EmailSupport', label: 'Email Support' },
      { key: 'ChatSupport', label: 'Chat Support' },
      { key: 'PhoneSupport', label: 'Phone Support' },
      { key: 'PrioritySupport', label: 'Priority Support' },
      { key: 'PrioritySupport24x7', label: '24/7 Priority Support' },
    ],
  },
} as const satisfies Record<
  string,
  { title: string; features: { key: FormFeatureKey; label: string }[] }
>;

export const FORM_LIMIT_FIELDS = [
  { key: 'DevicesPerUserLimit', label: 'Devices Per User' },
  { key: 'StaffLoginLimit', label: 'Staff Login Limit' },
  { key: 'TrainerLoginLimit', label: 'Trainer Login Limit' },
] as const satisfies readonly { key: FormFeatureKey; label: string }[];
