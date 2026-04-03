'use client';

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
  InfoBanner,
  KFormField,
  KFormFieldType,
  ProfileUploader,
  Switch,
} from '@kurlclub/ui-components';
import { useForm } from 'react-hook-form';

import {
  type SubscriptionSchemaInput,
  subscriptionSchema,
} from '@/schemas/subscription.schema';
import type { SubscriptionFormData } from '@/types/subscription';

import {
  SUBSCRIPTION_FEATURE_GROUPS,
  SUBSCRIPTION_LIMIT_FIELDS,
} from '../utils/feature-groups';

interface SubscriptionFormProps {
  defaultValues?: Partial<SubscriptionSchemaInput>;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  formId?: string;
  showActions?: boolean;
}

const DEFAULT_VALUES: SubscriptionSchemaInput = {
  Name: '',
  Subtitle: '',
  Description: '',
  Badge: '',
  IsPopular: false,
  Photo: null,
  MonthlyPrice: '',
  SixMonthsPrice: '',
  YearlyPrice: '',
  Limits: {
    MaxClubs: '',
    MaxMembers: '',
    MaxTrainers: '',
    MaxStaffs: '',
    MaxMembershipPlans: '',
    MaxWorkoutPlans: '',
    MaxLeadsPerMonth: '',
  },
  Features: {
    StudioDashboard: {
      Enabled: false,
      PaymentInsights: false,
      SkipperStats: false,
      AttendanceStats: false,
    },
    MemberManagement: false,
    PaymentManagement: false,
    Attendance: {
      Manual: false,
      Automatic: false,
      MemberInsights: false,
      DeviceManagement: false,
    },
    LeadsManagement: false,
    Programs: {
      MembershipPlans: false,
      WorkoutPlans: false,
    },
    StaffManagement: {
      ActivityTracking: false,
      StaffLogin: false,
    },
    PayrollManagement: false,
    Expenses: {
      ReportsDashboard: false,
      ExpenseManagement: false,
    },
    HelpAndSupport: {
      TicketingPortal: false,
      WhatsApp: false,
      Email: false,
      Call: false,
    },
    WhatsAppNotifications: {
      PaymentReminders: false,
      MembershipExpiry: false,
      LowAttendance: false,
      SpecialDays: false,
    },
    Invoice: {
      CustomTemplates: false,
    },
    Notifications: {
      Realtime: false,
      WhatsApp: false,
      Email: false,
      Push: false,
    },
  },
};

export function SubscriptionForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  formId,
  showActions = true,
}: SubscriptionFormProps) {
  const form = useForm<SubscriptionSchemaInput, unknown, SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: defaultValues || DEFAULT_VALUES,
  });

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldStack gap="lg">
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                Basic Information
              </h3>
              <FormField
                control={form.control}
                name="IsPopular"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 space-y-0">
                    <FormControl>
                      <Switch
                        label="Mark as Popular Plan"
                        labelClass="text-xs text-secondary-blue-200"
                        checked={Boolean(field.value)}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FieldGrid columns={1} smColumns={2} gap="md">
              <FieldGridItem smSpan={2}>
                <KFormField
                  fieldType={KFormFieldType.SKELETON}
                  control={form.control}
                  name="Photo"
                  renderSkeleton={(field) => (
                    <ProfileUploader
                      files={field.value instanceof File ? field.value : null}
                      existingImageUrl={
                        typeof field.value === 'string' ? field.value : null
                      }
                      onChange={(file) => field.onChange(file)}
                    />
                  )}
                />
              </FieldGridItem>

              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Name"
                label="Plan Name"
                placeholder="e.g., Professional Plan"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Subtitle"
                label="Subtitle"
                placeholder="e.g., Perfect for growing gyms"
                mandatory
              />

              <FieldGridItem smSpan={2}>
                <KFormField
                  fieldType={KFormFieldType.RICH_TEXT_EDITOR}
                  control={form.control}
                  name="Description"
                  label="Description"
                  placeholder="Detailed plan description..."
                  toolbarPreset="standard"
                />
              </FieldGridItem>

              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Badge"
                label="Badge Text"
                placeholder="e.g., Most Popular"
              />

              <FieldGridItem smSpan={2}>
                <InfoBanner
                  variant="info"
                  showIcon
                  message="Badge text appears on the plan card. Leave it blank to hide the badge."
                />
              </FieldGridItem>
            </FieldGrid>
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Pricing
            </h3>
            <FieldGrid columns={1} smColumns={2} lgColumns={3} gap="md">
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="MonthlyPrice"
                label="Monthly Price (₹)"
                placeholder="299"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="SixMonthsPrice"
                label="6 Months Price (₹)"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="YearlyPrice"
                label="Yearly Price (₹)"
                type="number"
                mandatory
              />
            </FieldGrid>
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Limits
            </h3>
            <FieldGrid columns={1} smColumns={2} lgColumns={3} gap="md">
              {SUBSCRIPTION_LIMIT_FIELDS.map((field) => (
                <KFormField
                  key={field.formKey}
                  fieldType={KFormFieldType.INPUT}
                  control={form.control}
                  name={field.formKey}
                  label={field.label}
                  type="number"
                  mandatory
                />
              ))}
            </FieldGrid>
          </section>

          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="mb-4 text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
              Features
            </h3>
            <FieldStack gap="lg">
              {SUBSCRIPTION_FEATURE_GROUPS.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h4 className="text-xs font-semibold text-primary-green-400 uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <FieldGrid columns={1} smColumns={2} gap="md">
                    {group.features.map((feature) => (
                      <FormField
                        key={feature.formKey}
                        control={form.control}
                        name={feature.formKey}
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                              <Switch
                                label={feature.label}
                                checked={Boolean(field.value)}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    ))}
                  </FieldGrid>
                </div>
              ))}
            </FieldStack>
          </section>

          {showActions && (
            <div className="flex justify-end gap-4 border-t border-secondary-blue-400/70 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Subscription'}
              </Button>
            </div>
          )}
        </FieldStack>
      </form>
    </Form>
  );
}
