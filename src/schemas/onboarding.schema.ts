import { z } from 'zod';

const requiredNullableNumber = (label: string) =>
  z
    .union([z.string(), z.number(), z.null()])
    .transform((value) => {
      if (value === null) return null;
      if (typeof value === 'number') return value;

      const trimmed = value.trim();
      if (!trimmed) return null;
      const num = Number(trimmed);
      return Number.isFinite(num) ? num : NaN;
    })
    .refine((value) => value !== null, {
      message: `${label} is required`,
    })
    .refine(
      (value) =>
        value === null || (typeof value === 'number' && Number.isFinite(value)),
      {
        message: `${label} must be a number`,
      },
    );

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const optionalText = () => z.string().trim();

const requiredEmail = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .email('Valid email is required');

const optionalEmail = () =>
  z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: 'Valid email is required',
    })
    .transform((value) => value ?? '');

export const leadDraftSchema = z.object({
  contactName: requiredText('Contact name'),
  email: optionalEmail(),
  phoneNumber: requiredText('Contact number'),
  assignedAdminId: requiredNullableNumber('Assigned admin'),
  notes: requiredText('Notes'),
  leadData: z.object({
    gymName: requiredText('Club name'),
    gymLocation: requiredText('Club location'),
    gymContactNumber: requiredText('Club contact number'),
    country: requiredText('Country'),
    region: requiredText('Region'),
  }),
});

export const accountSetupSchema = z
  .object({
    userName: requiredText('Username'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    email: requiredEmail('Email'),
    phoneNumber: requiredText('Phone number'),
    userPhotoFile: z.any().nullable(),
    userPhotoPreview: optionalText(),
  })
  .superRefine((data, ctx) => {
    const hasFile =
      typeof File !== 'undefined' && data.userPhotoFile instanceof File;
    const hasPhoto = hasFile || data.userPhotoPreview.trim().length > 0;
    if (!hasPhoto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['userPhotoFile'],
        message: 'Profile photo is required',
      });
    }
  });

export const subscriptionSetupSchema = z.object({
  subscriptionId: requiredText('Subscription plan'),
  subscriptionDate: requiredText('Subscription date'),
});

export const gymDraftSchema = z
  .object({
    gymName: requiredText('Club name'),
    gymEmail: requiredEmail('Club email'),
    gymLocation: requiredText('Club location'),
    gymContactNumber: requiredText('Club contact number'),
    country: requiredText('Country'),
    region: requiredText('Region'),
    gymPhotoFile: z.any().nullable(),
    gymPhotoPreview: optionalText(),
  })
  .superRefine((data, ctx) => {
    const hasFile =
      typeof File !== 'undefined' && data.gymPhotoFile instanceof File;
    const hasPhoto = hasFile || data.gymPhotoPreview.trim().length > 0;
    if (!hasPhoto) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['gymPhotoFile'],
        message: 'Club profile photo is required',
      });
    }
  });

export const gymListSchema = z
  .array(gymDraftSchema)
  .min(1, 'At least one club location is required');

export type LeadDraftSchemaInput = z.input<typeof leadDraftSchema>;
export type LeadDraftSchemaOutput = z.infer<typeof leadDraftSchema>;
export type AccountSetupSchemaInput = z.input<typeof accountSetupSchema>;
export type SubscriptionSetupSchemaInput = z.input<
  typeof subscriptionSetupSchema
>;
export type GymDraftSchemaInput = z.input<typeof gymDraftSchema>;
