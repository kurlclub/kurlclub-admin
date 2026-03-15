import { z } from 'zod';

const toNumberOrNull = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const num = Number(trimmed);
    return Number.isNaN(num) ? NaN : num;
  }
  if (typeof value === 'number') return value;
  return NaN;
};

const requiredNumber = (label: string) =>
  z.preprocess(
    toNumberOrNull,
    z
      .custom<number | null>(
        (value) =>
          value === null ||
          (typeof value === 'number' && Number.isFinite(value)),
        { message: `${label} must be a number` },
      )
      .refine((value) => value !== null, {
        message: `${label} is required`,
      })
      .refine((value) => value === null || value >= 0, {
        message: `${label} must be at least 0`,
      })
      .transform((value) => value as number),
  );

export const subscriptionSchema = z.object({
  Name: z.string().min(1, 'Plan name is required'),
  Subtitle: z.string().min(1, 'Subtitle is required'),
  Description: z.string().min(1, 'Description is required'),
  Badge: z.string().optional(),
  IsPopular: z.boolean().default(false),
  Photo: z.any().optional(),

  MonthlyPrice: requiredNumber('Monthly price'),
  SixMonthsPrice: requiredNumber('6 months price'),
  YearlyPrice: requiredNumber('Yearly price'),

  Limits: z.object({
    MaxClubs: requiredNumber('Max clubs'),
    MaxMembers: requiredNumber('Max members'),
    MaxTrainers: requiredNumber('Max trainers'),
    MaxStaffs: requiredNumber('Max staff'),
  }),

  Features: z.object({
    EmailNotifications: z.boolean(),
    WhatsAppNotifications: z.boolean(),
    RealTimeNotifications: z.boolean(),
    ManualAttendance: z.boolean(),
    LiveAttendance: z.boolean(),
    DoorAccessAttendance: z.boolean(),
    QrCodeCheckIn: z.boolean(),
    MemberManagement: z.boolean(),
    TrainerManagement: z.boolean(),
    StaffManagement: z.boolean(),
    MembershipManagement: z.boolean(),
    RoleBasedAccess: z.boolean(),
    PaymentTracking: z.boolean(),
    PaymentRecording: z.boolean(),
    InvoiceGeneration: z.boolean(),
    ExpenseTracker: z.boolean(),
    PtCollections: z.boolean(),
    CommissionTracking: z.boolean(),
    LeadManagement: z.boolean(),
    OffersDiscounts: z.boolean(),
    ClassScheduling: z.boolean(),
    BasicReports: z.boolean(),
    RevenueAnalytics: z.boolean(),
    AdvancedAnalytics: z.boolean(),
    CustomReports: z.boolean(),
    ExportToExcel: z.boolean(),
    ReportsAnalytics: z.boolean(),
    MemberPortal: z.boolean(),
    TrainerPortal: z.boolean(),
    MobileAppAccess: z.boolean(),
    EmailSupport: z.boolean(),
    ChatSupport: z.boolean(),
    PhoneSupport: z.boolean(),
    PrioritySupport: z.boolean(),
    PrioritySupport24x7: z.boolean(),
    DevicesPerUserLimit: requiredNumber('Devices per user'),
    StaffLoginLimit: requiredNumber('Staff login limit'),
    TrainerLoginLimit: requiredNumber('Trainer login limit'),
  }),
});

export type SubscriptionSchemaInput = z.input<typeof subscriptionSchema>;
export type SubscriptionSchemaType = z.infer<typeof subscriptionSchema>;
