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
  name: z.string().min(1, 'Plan name is required'),
  subtitle: z.string().min(1, 'Subtitle is required'),
  description: z.string().min(1, 'Description is required'),
  badge: z.string().optional(),
  isPopular: z.boolean().default(false),

  monthlyPrice: requiredNumber('Monthly price'),
  sixMonthsPrice: requiredNumber('6 months price'),
  yearlyPrice: requiredNumber('Yearly price'),

  limits: z.object({
    maxClubs: requiredNumber('Max clubs'),
    maxMembers: requiredNumber('Max members'),
    maxTrainers: requiredNumber('Max trainers'),
    maxStaffs: requiredNumber('Max staff'),
  }),

  features: z.object({
    emailNotifications: z.boolean(),
    whatsAppNotifications: z.boolean(),
    realTimeNotifications: z.boolean(),
    manualAttendance: z.boolean(),
    liveAttendance: z.boolean(),
    doorAccessAttendance: z.boolean(),
    qrCodeCheckIn: z.boolean(),
    memberManagement: z.boolean(),
    trainerManagement: z.boolean(),
    staffManagement: z.boolean(),
    membershipManagement: z.boolean(),
    roleBasedAccess: z.boolean(),
    paymentTracking: z.boolean(),
    paymentRecording: z.boolean(),
    invoiceGeneration: z.boolean(),
    expenseTracker: z.boolean(),
    ptCollections: z.boolean(),
    commissionTracking: z.boolean(),
    leadManagement: z.boolean(),
    offersDiscounts: z.boolean(),
    classScheduling: z.boolean(),
    basicReports: z.boolean(),
    revenueAnalytics: z.boolean(),
    advancedAnalytics: z.boolean(),
    customReports: z.boolean(),
    exportToExcel: z.boolean(),
    reportsAnalytics: z.boolean(),
    memberPortal: z.boolean(),
    trainerPortal: z.boolean(),
    mobileAppAccess: z.boolean(),
    emailSupport: z.boolean(),
    chatSupport: z.boolean(),
    phoneSupport: z.boolean(),
    prioritySupport: z.boolean(),
    prioritySupport24x7: z.boolean(),
    devicesPerUserLimit: requiredNumber('Devices per user'),
    staffLoginLimit: requiredNumber('Staff login limit'),
    trainerLoginLimit: requiredNumber('Trainer login limit'),
  }),
});

export type SubscriptionSchemaInput = z.input<typeof subscriptionSchema>;
export type SubscriptionSchemaType = z.infer<typeof subscriptionSchema>;
