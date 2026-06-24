import { z } from 'zod';

const requiredText = (label: string) =>
  z.string().trim().min(1, `${label} is required`);

export const clientSchema = z.object({
  userName: requiredText('Name'),
  email: requiredText('Email').email('Enter a valid email'),
  phoneNumber: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ''),
});

export type ClientSchemaInput = z.input<typeof clientSchema>;
export type ClientFormData = z.infer<typeof clientSchema>;
