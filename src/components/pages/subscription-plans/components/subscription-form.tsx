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
  Switch,
} from '@kurlclub/ui-components';
import { type FieldPath, useForm } from 'react-hook-form';

import {
  type SubscriptionSchemaInput,
  subscriptionSchema,
} from '@/schemas/subscription.schema';
import type {
  SubscriptionFeatures,
  SubscriptionFormData,
} from '@/types/subscription';

import { FEATURE_GROUPS, LIMIT_FIELDS } from '../utils/feature-groups';

interface SubscriptionFormProps {
  defaultValues?: Partial<SubscriptionSchemaInput>;
  onSubmit: (data: SubscriptionFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  formId?: string;
  showActions?: boolean;
}

const DEFAULT_VALUES: SubscriptionSchemaInput = {
  name: '',
  subtitle: '',
  description: '',
  badge: '',
  isPopular: false,
  monthlyPrice: '',
  sixMonthsPrice: '',
  yearlyPrice: '',
  limits: {
    maxClubs: '',
    maxMembers: '',
    maxTrainers: '',
    maxStaffs: '',
  },
  features: {
    emailNotifications: false,
    whatsAppNotifications: false,
    realTimeNotifications: false,
    manualAttendance: false,
    liveAttendance: false,
    doorAccessAttendance: false,
    qrCodeCheckIn: false,
    memberManagement: false,
    trainerManagement: false,
    staffManagement: false,
    membershipManagement: false,
    roleBasedAccess: false,
    paymentTracking: false,
    paymentRecording: false,
    invoiceGeneration: false,
    expenseTracker: false,
    ptCollections: false,
    commissionTracking: false,
    leadManagement: false,
    offersDiscounts: false,
    classScheduling: false,
    basicReports: false,
    revenueAnalytics: false,
    advancedAnalytics: false,
    customReports: false,
    exportToExcel: false,
    reportsAnalytics: false,
    memberPortal: false,
    trainerPortal: false,
    mobileAppAccess: false,
    emailSupport: false,
    chatSupport: false,
    phoneSupport: false,
    prioritySupport: false,
    prioritySupport24x7: false,
    devicesPerUserLimit: '',
    staffLoginLimit: '',
    trainerLoginLimit: '',
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
  const toFeaturePath = (key: keyof SubscriptionFeatures) =>
    `features.${key}` as FieldPath<SubscriptionFormData>;

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
                name="isPopular"
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
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Plan Name"
                placeholder="e.g., Professional Plan"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="subtitle"
                label="Subtitle"
                placeholder="e.g., Perfect for growing gyms"
                mandatory
              />
              <FieldGridItem smSpan={2}>
                <KFormField
                  fieldType={KFormFieldType.RICH_TEXT_EDITOR}
                  control={form.control}
                  name="description"
                  label="Description"
                  placeholder="Detailed plan description..."
                  toolbarPreset="standard"
                />
              </FieldGridItem>
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="badge"
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
                name="monthlyPrice"
                label="Monthly Price (₹)"
                placeholder="299"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="sixMonthsPrice"
                label="6 Months Price (₹)"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="yearlyPrice"
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
                name="limits.maxClubs"
                label="Max Clubs"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="limits.maxMembers"
                label="Max Members"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="limits.maxTrainers"
                label="Max Trainers"
                type="number"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="limits.maxStaffs"
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
              {Object.entries(FEATURE_GROUPS).map(([groupKey, group]) => (
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
                  {LIMIT_FIELDS.map((field) => (
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
