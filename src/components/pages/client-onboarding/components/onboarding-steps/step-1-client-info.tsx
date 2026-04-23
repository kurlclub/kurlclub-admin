'use client';

import type React from 'react';
import { useEffect, useMemo, useRef } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  FieldGrid,
  Form,
  KFormField,
  KFormFieldType,
} from '@kurlclub/ui-components';
import { Country, State } from 'country-state-city';
import { Building2, ClipboardList, User } from 'lucide-react';
import { type DeepPartial, useForm, useWatch } from 'react-hook-form';

import { useOnboardingContext } from '@/hooks/onboarding';
import { useAdminFormData } from '@/hooks/use-admin-form-data';
import { useAuth } from '@/providers/auth-provider';
import type { LeadDraftSchemaInput } from '@/schemas/onboarding.schema';
import { leadDraftSchema } from '@/schemas/onboarding.schema';
import type { LeadDraftData } from '@/types/onboarding';

import { StepWrapper } from './stepper-wrapper';

const isLeadEqual = (a: LeadDraftData, b: LeadDraftData) =>
  a.contactName === b.contactName &&
  a.email === b.email &&
  a.phoneNumber === b.phoneNumber &&
  a.notes === b.notes &&
  a.assignedAdminId === b.assignedAdminId &&
  a.leadData.gymName === b.leadData.gymName &&
  a.leadData.gymLocation === b.leadData.gymLocation &&
  a.leadData.gymContactNumber === b.leadData.gymContactNumber &&
  a.leadData.country === b.leadData.country &&
  a.leadData.region === b.leadData.region;

const normalizeAssignedAdminId = (value: unknown) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const normalizeLeadValues = (
  values: DeepPartial<LeadDraftSchemaInput>,
  fallback: LeadDraftData,
): LeadDraftData => ({
  email: values.email ?? fallback.email,
  contactName: values.contactName ?? fallback.contactName,
  phoneNumber: values.phoneNumber ?? fallback.phoneNumber,
  notes: values.notes ?? fallback.notes,
  assignedAdminId: normalizeAssignedAdminId(values.assignedAdminId),
  leadData: {
    gymName: values.leadData?.gymName ?? fallback.leadData.gymName,
    gymLocation: values.leadData?.gymLocation ?? fallback.leadData.gymLocation,
    gymContactNumber:
      values.leadData?.gymContactNumber ?? fallback.leadData.gymContactNumber,
    country: values.leadData?.country ?? fallback.leadData.country,
    region: values.leadData?.region ?? fallback.leadData.region,
  },
});

export function OnboardingStep1() {
  const { formData, setFormData, registerStepValidator } =
    useOnboardingContext();
  const { user } = useAuth();
  const { adminFormData, loading: adminFormLoading } = useAdminFormData();
  const { lead } = formData;
  const canAssignAdmin = user?.userRole === 'super_admin';
  const form = useForm<LeadDraftSchemaInput, unknown, LeadDraftData>({
    resolver: zodResolver(leadDraftSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: lead,
  });
  const watchedLead = useWatch({ control: form.control });
  const previousCountryRef = useRef<string | null>(null);
  const countries = useMemo(() => Country.getAllCountries(), []);
  const countryOptions = useMemo(
    () =>
      [...countries]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((country) => ({
          label: country.name,
          value: country.name,
        })),
    [countries],
  );
  const selectedCountry = useMemo(
    () =>
      countries.find(
        (country) => country.name === watchedLead?.leadData?.country,
      ),
    [countries, watchedLead?.leadData?.country],
  );
  const regionOptions = useMemo(() => {
    if (!selectedCountry) return [];
    return State.getStatesOfCountry(selectedCountry.isoCode)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((region) => ({
        label: region.name,
        value: region.name,
      }));
  }, [selectedCountry]);
  const regionDisabled =
    !watchedLead?.leadData?.country || regionOptions.length === 0;
  const adminOptions = useMemo(() => {
    const admins = adminFormData?.adminUsers ?? [];
    return [...admins]
      .filter((admin) => typeof admin?.name === 'string')
      .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
      .map((admin) => ({
        label: admin.name,
        value: String(admin.id),
      }));
  }, [adminFormData?.adminUsers]);
  const adminOptionsEmpty = adminOptions.length === 0;

  useEffect(() => {
    const currentValues = form.getValues();
    const normalizedValues = normalizeLeadValues(currentValues, lead);
    if (!isLeadEqual(normalizedValues, lead)) {
      form.reset(lead);
    }
  }, [form, lead]);

  useEffect(() => {
    if (!watchedLead) return;
    const nextLead = normalizeLeadValues(watchedLead, lead);

    if (isLeadEqual(nextLead, lead)) return;

    setFormData({
      ...formData,
      lead: nextLead,
    });
  }, [formData, lead, setFormData, watchedLead]);

  useEffect(() => {
    const country = watchedLead?.leadData?.country ?? '';
    if (previousCountryRef.current === null) {
      previousCountryRef.current = country;
      return;
    }
    if (previousCountryRef.current !== country) {
      form.setValue('leadData.region', '');
      previousCountryRef.current = country;
    }
  }, [form, watchedLead?.leadData?.country]);

  useEffect(() => {
    const unregister = registerStepValidator(1, () =>
      form.trigger(undefined, { shouldFocus: true }),
    );
    return unregister;
  }, [form, registerStepValidator]);

  return (
    <StepWrapper
      title="Lead Intake"
      description="Capture the lead details before moving into onboarding."
      className="max-w-180 mx-auto"
    >
      <Form {...form}>
        <form className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <SectionHeader
            title="Primary Contact"
            icon={<User className="w-4 h-4" />}
          />
          <FieldGrid columns={1} smColumns={2} gap="md">
            <KFormField
              fieldType={KFormFieldType.INPUT}
              control={form.control}
              name="contactName"
              label="Contact Name"
              mandatory
            />
            <KFormField
              fieldType={KFormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              type="email"
            />
            <KFormField
              fieldType={KFormFieldType.PHONE_INPUT}
              control={form.control}
              name="phoneNumber"
              label="Contact Number"
              mandatory
            />
            {canAssignAdmin && (
              <KFormField
                fieldType={KFormFieldType.SELECT}
                control={form.control}
                name="assignedAdminId"
                label="Assigned Team Member"
                options={adminOptions}
                floating={false}
                disabled={adminFormLoading || adminOptionsEmpty}
                placeholder={
                  adminFormLoading
                    ? 'Loading team members...'
                    : 'Select a team member (optional)'
                }
              />
            )}
          </FieldGrid>

          <SectionHeader
            title="Club Overview"
            icon={<Building2 className="w-4 h-4" />}
          />
          <FieldGrid columns={1} smColumns={2} gap="md">
            <KFormField
              fieldType={KFormFieldType.INPUT}
              control={form.control}
              name="leadData.gymName"
              label="Club Name"
              mandatory
            />
            <KFormField
              fieldType={KFormFieldType.INPUT}
              control={form.control}
              name="leadData.gymLocation"
              label="Club Location"
              mandatory
            />
            <KFormField
              fieldType={KFormFieldType.PHONE_INPUT}
              control={form.control}
              name="leadData.gymContactNumber"
              label="Club Contact Number"
              mandatory
            />
            <KFormField
              fieldType={KFormFieldType.SELECT}
              control={form.control}
              name="leadData.country"
              label="Country"
              options={countryOptions}
              mandatory
            />
            <KFormField
              fieldType={KFormFieldType.SELECT}
              control={form.control}
              name="leadData.region"
              label="Region / State / Province"
              options={regionOptions}
              disabled={regionDisabled}
              mandatory
            />
          </FieldGrid>

          <SectionHeader
            title="Notes"
            icon={<ClipboardList className="w-4 h-4" />}
          />
          <KFormField
            fieldType={KFormFieldType.TEXTAREA}
            control={form.control}
            name="notes"
            label="Notes"
            placeholder="Add any notes (optional)..."
          />
        </form>
      </Form>
    </StepWrapper>
  );
}

function SectionHeader({
  title,
  icon,
}: {
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 w-full text-secondary-blue-200">
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-secondary-blue-500/60 border border-secondary-blue-400">
        {icon}
      </span>
      <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
        {title}
      </span>
      <div className="h-px flex-1 bg-secondary-blue-400/40" />
    </div>
  );
}
