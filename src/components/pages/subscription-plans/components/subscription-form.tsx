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
import { type FieldPath, useForm } from 'react-hook-form';

import {
  type SubscriptionSchemaInput,
  subscriptionSchema,
} from '@/schemas/subscription.schema';
import type {
  SubscriptionFormData,
  SubscriptionFormFeatures,
} from '@/types/subscription';

import {
  FORM_FEATURE_GROUPS,
  FORM_LIMIT_FIELDS,
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
  },
  Features: {
    EmailNotifications: false,
    WhatsAppNotifications: false,
    RealTimeNotifications: false,
    ManualAttendance: false,
    LiveAttendance: false,
    DoorAccessAttendance: false,
    QrCodeCheckIn: false,
    MemberManagement: false,
    TrainerManagement: false,
    StaffManagement: false,
    MembershipManagement: false,
    RoleBasedAccess: false,
    PaymentTracking: false,
    PaymentRecording: false,
    InvoiceGeneration: false,
    ExpenseTracker: false,
    PtCollections: false,
    CommissionTracking: false,
    LeadManagement: false,
    OffersDiscounts: false,
    ClassScheduling: false,
    BasicReports: false,
    RevenueAnalytics: false,
    AdvancedAnalytics: false,
    CustomReports: false,
    ExportToExcel: false,
    ReportsAnalytics: false,
    MemberPortal: false,
    TrainerPortal: false,
    MobileAppAccess: false,
    EmailSupport: false,
    ChatSupport: false,
    PhoneSupport: false,
    PrioritySupport: false,
    PrioritySupport24x7: false,
    DevicesPerUserLimit: '',
    StaffLoginLimit: '',
    TrainerLoginLimit: '',
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
  const toFeaturePath = (key: keyof SubscriptionFormFeatures) =>
    `Features.${key}` as FieldPath<SubscriptionFormData>;

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
        <FieldStack gap="lg">
          {/* Basic Information */}
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
                      showDelete
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
                  message="Badge text appears on the plan card (e.g., 'Most Popular'). Leave it blank to hide the badge."
                />
              </FieldGridItem>
            </FieldGrid>
          </section>

          {/* Pricing */}
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
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

          {/* Limits */}
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
              Limits
            </h3>
            <FieldGrid columns={1} smColumns={2} gap="md">
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Limits.MaxClubs"
                label="Max Clubs"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Limits.MaxMembers"
                label="Max Members"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Limits.MaxTrainers"
                label="Max Trainers"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="Limits.MaxStaffs"
                label="Max Staff"
                type="number"
                mandatory
              />
            </FieldGrid>
          </section>

          {/* Features */}
          <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
            <h3 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider mb-4">
              Features
            </h3>
            <FieldStack gap="lg">
              {Object.entries(FORM_FEATURE_GROUPS).map(([groupKey, group]) => (
                <div key={groupKey} className="space-y-3">
                  <h4 className="text-xs font-semibold text-primary-green-400 uppercase tracking-wider">
                    {group.title}
                  </h4>
                  <FieldGrid columns={1} smColumns={2} gap="md">
                    {group.features.map((feature) => (
                      <FormField
                        key={feature.key}
                        control={form.control}
                        name={toFeaturePath(feature.key)}
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

              {/* Numeric Limits */}
              <div className="space-y-3 pt-4 border-t border-secondary-blue-400/70">
                <h4 className="text-xs font-semibold text-primary-green-400 uppercase tracking-wider">
                  Additional Limits
                </h4>
                <FieldGrid columns={1} smColumns={2} mdColumns={3} gap="md">
                  {FORM_LIMIT_FIELDS.map((field) => (
                    <KFormField
                      key={field.key}
                      fieldType={KFormFieldType.INPUT}
                      control={form.control}
                      name={toFeaturePath(field.key)}
                      label={field.label}
                      type="number"
                      mandatory
                    />
                  ))}
                </FieldGrid>
              </div>
            </FieldStack>
          </section>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-4 justify-end border-t border-secondary-blue-400/70 pt-4">
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
