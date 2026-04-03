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

const studioDashboardSchema = z.object({
  Enabled: z.boolean(),
  PaymentInsights: z.boolean(),
  SkipperStats: z.boolean(),
  AttendanceStats: z.boolean(),
});

const attendanceSchema = z.object({
  Manual: z.boolean(),
  Automatic: z.boolean(),
  MemberInsights: z.boolean(),
  DeviceManagement: z.boolean(),
});

const programsSchema = z.object({
  MembershipPlans: z.boolean(),
  WorkoutPlans: z.boolean(),
});

const staffManagementSchema = z.object({
  ActivityTracking: z.boolean(),
  StaffLogin: z.boolean(),
});

const expensesSchema = z.object({
  ReportsDashboard: z.boolean(),
  ExpenseManagement: z.boolean(),
});

const helpAndSupportSchema = z.object({
  TicketingPortal: z.boolean(),
  WhatsApp: z.boolean(),
  Email: z.boolean(),
  Call: z.boolean(),
});

const whatsAppNotificationsSchema = z.object({
  PaymentReminders: z.boolean(),
  MembershipExpiry: z.boolean(),
  LowAttendance: z.boolean(),
  SpecialDays: z.boolean(),
});

const invoiceSchema = z.object({
  CustomTemplates: z.boolean(),
});

const notificationsSchema = z.object({
  Realtime: z.boolean(),
  WhatsApp: z.boolean(),
  Email: z.boolean(),
  Push: z.boolean(),
});

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
    MaxMembershipPlans: requiredNumber('Max membership plans'),
    MaxWorkoutPlans: requiredNumber('Max workout plans'),
    MaxLeadsPerMonth: requiredNumber('Max leads per month'),
  }),

  Features: z.object({
    StudioDashboard: studioDashboardSchema,
    MemberManagement: z.boolean(),
    PaymentManagement: z.boolean(),
    Attendance: attendanceSchema,
    LeadsManagement: z.boolean(),
    Programs: programsSchema,
    StaffManagement: staffManagementSchema,
    PayrollManagement: z.boolean(),
    Expenses: expensesSchema,
    HelpAndSupport: helpAndSupportSchema,
    WhatsAppNotifications: whatsAppNotificationsSchema,
    Invoice: invoiceSchema,
    Notifications: notificationsSchema,
  }),
});

export type SubscriptionSchemaInput = z.input<typeof subscriptionSchema>;
export type SubscriptionSchemaType = z.infer<typeof subscriptionSchema>;
