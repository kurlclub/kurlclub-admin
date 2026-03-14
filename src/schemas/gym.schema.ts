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
      .transform((value) => value as number),
  );

const requiredText = (label: string) =>
  z.string().min(1, `${label} is required`);

export const gymSchema = z.object({
  gymName: requiredText('Gym name'),
  location: requiredText('Location'),
  contactNumber1: requiredText('Contact number 1'),
  contactNumber2: z.string().optional().or(z.literal('')),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  gymAdminId: requiredNumber('Gym admin'),
  status: requiredText('Status'),
  gymIdentifier: requiredText('Gym identifier'),
  socialLinks: z.string().optional().or(z.literal('')),
});

export type GymSchemaInput = z.input<typeof gymSchema>;
export type GymSchemaType = z.infer<typeof gymSchema>;
