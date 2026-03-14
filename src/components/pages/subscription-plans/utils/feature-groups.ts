import type { SubscriptionFeatures } from '@/types/subscription';

type FeatureKey = keyof SubscriptionFeatures;

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

export const LIMIT_FIELDS = [
  { key: 'devicesPerUserLimit', label: 'Devices Per User' },
  { key: 'staffLoginLimit', label: 'Staff Login Limit' },
  { key: 'trainerLoginLimit', label: 'Trainer Login Limit' },
] as const satisfies readonly { key: FeatureKey; label: string }[];
