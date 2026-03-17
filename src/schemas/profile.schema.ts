import { z } from 'zod';

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

const optionalText = () =>
  z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? '');

export const profileSchema = z.object({
  name: requiredText('Full name'),
  phoneNumber: optionalText(),
  photoFile: z.any().nullable(),
});

export type ProfileSchemaInput = z.input<typeof profileSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
