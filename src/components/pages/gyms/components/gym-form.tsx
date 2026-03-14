'use client';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldGrid,
  FieldGridItem,
  FieldStack,
  Form,
  FormControl,
  FormField,
  FormItem,
  KFormField,
  KFormFieldType,
} from '@kurlclub/ui-components';
import { useForm } from 'react-hook-form';

import { type GymSchemaInput, gymSchema } from '@/schemas/gym.schema';
import { useClients } from '@/services/clients';
import type { GymFormData } from '@/types/gym';

type GymFormDefaults = Partial<
  Omit<GymSchemaInput, 'contactNumber2' | 'socialLinks' | 'gymAdminId'>
> & {
  contactNumber2?: string | null;
  socialLinks?: string | null;
  gymAdminId?: number | string | null;
};

interface GymFormProps {
  defaultValues?: GymFormDefaults;
  onSubmit: (data: GymFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  formId?: string;
  showActions?: boolean;
}

const DEFAULT_VALUES: GymSchemaInput = {
  gymName: '',
  location: '',
  contactNumber1: '',
  contactNumber2: '',
  email: '',
  gymAdminId: '' as unknown as number,
  status: 'Active',
  gymIdentifier: '',
  socialLinks: '',
};

const STATUS_OPTIONS = ['Active', 'Inactive', 'Pending'];

export function GymForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  formId,
  showActions = true,
}: GymFormProps) {
  const resolvedDefaults = useMemo(() => {
    const merged = {
      ...DEFAULT_VALUES,
      ...defaultValues,
    } as GymSchemaInput & GymFormDefaults;

    return {
      ...merged,
      contactNumber2: merged.contactNumber2 ?? '',
      socialLinks: merged.socialLinks ?? '',
    } as GymSchemaInput;
  }, [defaultValues]);

  const form = useForm<GymSchemaInput, unknown, GymFormData>({
    resolver: zodResolver(gymSchema),
    defaultValues: resolvedDefaults,
  });

  const { data: clients, isLoading: clientsLoading } = useClients();

  useEffect(() => {
    form.reset(resolvedDefaults);
  }, [form, resolvedDefaults]);

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldStack gap="lg">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
              Gym Details
            </h3>
            <FieldGrid columns={1} smColumns={2} gap="md">
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="gymName"
                label="Gym Name"
                placeholder="e.g., Kurl Club Downtown"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="gymIdentifier"
                label="Gym Identifier"
                placeholder="e.g., KC-DOWN"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="location"
                label="Location"
                placeholder="City, State"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                placeholder="gym@example.com"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="contactNumber1"
                label="Contact Number 1"
                placeholder="+1 555 0100"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="contactNumber2"
                label="Contact Number 2"
                placeholder="Optional"
              />
              <FieldGridItem smSpan={2}>
                <FormField
                  control={form.control}
                  name="gymAdminId"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
                        Gym Admin (Client)
                      </label>
                      <FormControl>
                        <select
                          className="h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                          value={
                            field.value === null ||
                            field.value === undefined ||
                            field.value === ''
                              ? ''
                              : String(field.value)
                          }
                          onChange={(event) =>
                            field.onChange(event.target.value)
                          }
                          disabled={clientsLoading}
                        >
                          <option value="" className="text-black">
                            {clientsLoading
                              ? 'Loading clients...'
                              : 'Select client'}
                          </option>
                          {clients?.map((client) => (
                            <option
                              key={client.id}
                              value={client.id}
                              className="text-black"
                            >
                              {client.userName} ({client.email})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      {form.formState.errors.gymAdminId && (
                        <p className="text-xs text-alert-red-400">
                          {form.formState.errors.gymAdminId.message as string}
                        </p>
                      )}
                    </FormItem>
                  )}
                />
              </FieldGridItem>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-xs font-semibold text-secondary-blue-200 uppercase tracking-wider">
                      Status
                    </label>
                    <FormControl>
                      <select
                        className="h-11 w-full rounded-lg border border-secondary-blue-400 bg-secondary-blue-600/60 px-3 text-sm text-white outline-hidden focus:border-primary-green-500/60"
                        value={field.value ?? ''}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="text-black"
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    {form.formState.errors.status && (
                      <p className="text-xs text-alert-red-400">
                        {form.formState.errors.status.message as string}
                      </p>
                    )}
                  </FormItem>
                )}
              />
              <FieldGridItem smSpan={2}>
                <KFormField
                  fieldType={KFormFieldType.INPUT}
                  control={form.control}
                  name="socialLinks"
                  label="Social Links"
                  placeholder="Instagram, Facebook, or website URLs"
                />
              </FieldGridItem>
            </FieldGrid>
          </section>

          {showActions && (
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Gym'}
              </Button>
            </div>
          )}
        </FieldStack>
      </form>
    </Form>
  );
}
