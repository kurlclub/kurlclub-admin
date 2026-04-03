import type { FieldPath } from 'react-hook-form';

import type {
  SubscriptionFeatures,
  SubscriptionFormData,
  SubscriptionLimits,
} from '@/types/subscription';

type FeatureConfig = {
  formKey: FieldPath<SubscriptionFormData>;
  responseKey: string;
  label: string;
};

type FeatureGroupConfig = {
  title: string;
  features: FeatureConfig[];
};

type LimitFieldConfig = {
  formKey: FieldPath<SubscriptionFormData>;
  responseKey: keyof SubscriptionLimits;
  label: string;
};

type FeatureRootKey = keyof SubscriptionFeatures;

export const SUBSCRIPTION_FEATURE_GROUPS = [
  {
    title: 'Studio Dashboard',
    features: [
      {
        formKey: 'Features.StudioDashboard.Enabled',
        responseKey: 'studioDashboard.enabled',
        label: 'Dashboard Access',
      },
      {
        formKey: 'Features.StudioDashboard.PaymentInsights',
        responseKey: 'studioDashboard.paymentInsights',
        label: 'Payment Insights',
      },
      {
        formKey: 'Features.StudioDashboard.SkipperStats',
        responseKey: 'studioDashboard.skipperStats',
        label: 'Skipper Stats',
      },
      {
        formKey: 'Features.StudioDashboard.AttendanceStats',
        responseKey: 'studioDashboard.attendanceStats',
        label: 'Attendance Stats',
      },
    ],
  },
  {
    title: 'Core Management',
    features: [
      {
        formKey: 'Features.MemberManagement',
        responseKey: 'memberManagement',
        label: 'Member Management',
      },
      {
        formKey: 'Features.PaymentManagement',
        responseKey: 'paymentManagement',
        label: 'Payment Management',
      },
      {
        formKey: 'Features.LeadsManagement',
        responseKey: 'leadsManagement',
        label: 'Leads Management',
      },
      {
        formKey: 'Features.PayrollManagement',
        responseKey: 'payrollManagement',
        label: 'Payroll Management',
      },
    ],
  },
  {
    title: 'Attendance',
    features: [
      {
        formKey: 'Features.Attendance.Manual',
        responseKey: 'attendance.manual',
        label: 'Manual Attendance',
      },
      {
        formKey: 'Features.Attendance.Automatic',
        responseKey: 'attendance.automatic',
        label: 'Automatic Attendance',
      },
      {
        formKey: 'Features.Attendance.MemberInsights',
        responseKey: 'attendance.memberInsights',
        label: 'Member Insights',
      },
      {
        formKey: 'Features.Attendance.DeviceManagement',
        responseKey: 'attendance.deviceManagement',
        label: 'Device Management',
      },
    ],
  },
  {
    title: 'Programs',
    features: [
      {
        formKey: 'Features.Programs.MembershipPlans',
        responseKey: 'programs.membershipPlans',
        label: 'Membership Plans',
      },
      {
        formKey: 'Features.Programs.WorkoutPlans',
        responseKey: 'programs.workoutPlans',
        label: 'Workout Plans',
      },
    ],
  },
  {
    title: 'Staff Management',
    features: [
      {
        formKey: 'Features.StaffManagement.ActivityTracking',
        responseKey: 'staffManagement.activityTracking',
        label: 'Activity Tracking',
      },
      {
        formKey: 'Features.StaffManagement.StaffLogin',
        responseKey: 'staffManagement.staffLogin',
        label: 'Staff Login',
      },
    ],
  },
  {
    title: 'Expenses',
    features: [
      {
        formKey: 'Features.Expenses.ReportsDashboard',
        responseKey: 'expenses.reportsDashboard',
        label: 'Reports Dashboard',
      },
      {
        formKey: 'Features.Expenses.ExpenseManagement',
        responseKey: 'expenses.expenseManagement',
        label: 'Expense Management',
      },
    ],
  },
  {
    title: 'Help & Support',
    features: [
      {
        formKey: 'Features.HelpAndSupport.TicketingPortal',
        responseKey: 'helpAndSupport.ticketingPortal',
        label: 'Ticketing Portal',
      },
      {
        formKey: 'Features.HelpAndSupport.WhatsApp',
        responseKey: 'helpAndSupport.whatsApp',
        label: 'WhatsApp Support',
      },
      {
        formKey: 'Features.HelpAndSupport.Email',
        responseKey: 'helpAndSupport.email',
        label: 'Email Support',
      },
      {
        formKey: 'Features.HelpAndSupport.Call',
        responseKey: 'helpAndSupport.call',
        label: 'Call Support',
      },
    ],
  },
  {
    title: 'WhatsApp Notifications',
    features: [
      {
        formKey: 'Features.WhatsAppNotifications.PaymentReminders',
        responseKey: 'whatsAppNotifications.paymentReminders',
        label: 'Payment Reminders',
      },
      {
        formKey: 'Features.WhatsAppNotifications.MembershipExpiry',
        responseKey: 'whatsAppNotifications.membershipExpiry',
        label: 'Membership Expiry',
      },
      {
        formKey: 'Features.WhatsAppNotifications.LowAttendance',
        responseKey: 'whatsAppNotifications.lowAttendance',
        label: 'Low Attendance',
      },
      {
        formKey: 'Features.WhatsAppNotifications.SpecialDays',
        responseKey: 'whatsAppNotifications.specialDays',
        label: 'Special Days',
      },
    ],
  },
  {
    title: 'Invoice',
    features: [
      {
        formKey: 'Features.Invoice.CustomTemplates',
        responseKey: 'invoice.customTemplates',
        label: 'Custom Templates',
      },
    ],
  },
  {
    title: 'Notifications',
    features: [
      {
        formKey: 'Features.Notifications.Realtime',
        responseKey: 'notifications.realtime',
        label: 'Realtime Notifications',
      },
      {
        formKey: 'Features.Notifications.WhatsApp',
        responseKey: 'notifications.whatsApp',
        label: 'WhatsApp Notifications',
      },
      {
        formKey: 'Features.Notifications.Email',
        responseKey: 'notifications.email',
        label: 'Email Notifications',
      },
      {
        formKey: 'Features.Notifications.Push',
        responseKey: 'notifications.push',
        label: 'Push Notifications',
      },
    ],
  },
] satisfies readonly FeatureGroupConfig[];

export const SUBSCRIPTION_LIMIT_FIELDS = [
  {
    formKey: 'Limits.MaxClubs',
    responseKey: 'maxClubs',
    label: 'Max Clubs',
  },
  {
    formKey: 'Limits.MaxMembers',
    responseKey: 'maxMembers',
    label: 'Max Members',
  },
  {
    formKey: 'Limits.MaxTrainers',
    responseKey: 'maxTrainers',
    label: 'Max Trainers',
  },
  {
    formKey: 'Limits.MaxStaffs',
    responseKey: 'maxStaffs',
    label: 'Max Staff',
  },
  {
    formKey: 'Limits.MaxMembershipPlans',
    responseKey: 'maxMembershipPlans',
    label: 'Max Membership Plans',
  },
  {
    formKey: 'Limits.MaxWorkoutPlans',
    responseKey: 'maxWorkoutPlans',
    label: 'Max Workout Plans',
  },
  {
    formKey: 'Limits.MaxLeadsPerMonth',
    responseKey: 'maxLeadsPerMonth',
    label: 'Max Leads / Month',
  },
] satisfies readonly LimitFieldConfig[];

export const FEATURE_ROOT_KEYS = [
  'studioDashboard',
  'memberManagement',
  'paymentManagement',
  'attendance',
  'leadsManagement',
  'programs',
  'staffManagement',
  'payrollManagement',
  'expenses',
  'helpAndSupport',
  'whatsAppNotifications',
  'invoice',
  'notifications',
] satisfies readonly FeatureRootKey[];
