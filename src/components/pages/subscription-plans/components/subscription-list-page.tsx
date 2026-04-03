'use client';

import { useState } from 'react';

import { Button, Sheet, Spinner } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import type { SubscriptionSchemaInput } from '@/schemas/subscription.schema';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscription,
  useSubscriptions,
  useUpdateSubscription,
} from '@/services/subscription';
import type { Subscription, SubscriptionFormData } from '@/types/subscription';

import { SubscriptionCard } from './subscription-card';
import { SubscriptionDetails } from './subscription-details';
import { SubscriptionForm } from './subscription-form';

const toSubscriptionFormDefaults = (
  subscription: Subscription,
): SubscriptionSchemaInput => ({
  Name: subscription.name ?? '',
  Subtitle: subscription.subtitle ?? '',
  Description: subscription.description ?? '',
  Badge: subscription.badge ?? '',
  IsPopular: subscription.isPopular ?? false,
  Photo: subscription.photoPath ?? null,
  MonthlyPrice: subscription.monthlyPrice,
  SixMonthsPrice: subscription.sixMonthsPrice,
  YearlyPrice: subscription.yearlyPrice,
  Limits: {
    MaxClubs: subscription.limits.maxClubs,
    MaxMembers: subscription.limits.maxMembers,
    MaxTrainers: subscription.limits.maxTrainers,
    MaxStaffs: subscription.limits.maxStaffs,
    MaxMembershipPlans: subscription.limits.maxMembershipPlans,
    MaxWorkoutPlans: subscription.limits.maxWorkoutPlans,
    MaxLeadsPerMonth: subscription.limits.maxLeadsPerMonth,
  },
  Features: {
    StudioDashboard: {
      Enabled: subscription.features.studioDashboard.enabled,
      PaymentInsights: subscription.features.studioDashboard.paymentInsights,
      SkipperStats: subscription.features.studioDashboard.skipperStats,
      AttendanceStats: subscription.features.studioDashboard.attendanceStats,
    },
    MemberManagement: subscription.features.memberManagement,
    PaymentManagement: subscription.features.paymentManagement,
    Attendance: {
      Manual: subscription.features.attendance.manual,
      Automatic: subscription.features.attendance.automatic,
      MemberInsights: subscription.features.attendance.memberInsights,
      DeviceManagement: subscription.features.attendance.deviceManagement,
    },
    LeadsManagement: subscription.features.leadsManagement,
    Programs: {
      MembershipPlans: subscription.features.programs.membershipPlans,
      WorkoutPlans: subscription.features.programs.workoutPlans,
    },
    StaffManagement: {
      ActivityTracking: subscription.features.staffManagement.activityTracking,
      StaffLogin: subscription.features.staffManagement.staffLogin,
    },
    PayrollManagement: subscription.features.payrollManagement,
    Expenses: {
      ReportsDashboard: subscription.features.expenses.reportsDashboard,
      ExpenseManagement: subscription.features.expenses.expenseManagement,
    },
    HelpAndSupport: {
      TicketingPortal: subscription.features.helpAndSupport.ticketingPortal,
      WhatsApp: subscription.features.helpAndSupport.whatsApp,
      Email: subscription.features.helpAndSupport.email,
      Call: subscription.features.helpAndSupport.call,
    },
    WhatsAppNotifications: {
      PaymentReminders:
        subscription.features.whatsAppNotifications.paymentReminders,
      MembershipExpiry:
        subscription.features.whatsAppNotifications.membershipExpiry,
      LowAttendance: subscription.features.whatsAppNotifications.lowAttendance,
      SpecialDays: subscription.features.whatsAppNotifications.specialDays,
    },
    Invoice: {
      CustomTemplates: subscription.features.invoice.customTemplates,
    },
    Notifications: {
      Realtime: subscription.features.notifications.realtime,
      WhatsApp: subscription.features.notifications.whatsApp,
      Email: subscription.features.notifications.email,
      Push: subscription.features.notifications.push,
    },
  },
});

export function SubscriptionListPage() {
  const { data: subscriptions, isLoading } = useSubscriptions();
  const createMutation = useCreateSubscription();
  const updateMutation = useUpdateSubscription();
  const deleteMutation = useDeleteSubscription();

  const [viewId, setViewId] = useState<number | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (data: SubscriptionFormData) => {
    await createMutation.mutateAsync(data);
    setIsCreating(false);
  };

  const handleUpdate = async (data: SubscriptionFormData) => {
    if (!editId) return;
    await updateMutation.mutateAsync({ id: editId, data });
    setEditId(null);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      await deleteMutation.mutateAsync(id);
      return true;
    }
    return false;
  };

  const { data: selectedSubscription, isLoading: isDetailsLoading } =
    useSubscription(viewId ?? 0);
  const { data: editingSubscription, isLoading: isEditLoading } =
    useSubscription(editId ?? 0);

  const createFormId = 'subscription-create-form';
  const editFormId = 'subscription-edit-form';

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
              <p className="mt-1 text-sm text-secondary-blue-200">
                Manage platform subscription plans
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Subscription
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {subscriptions?.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onView={setViewId}
                />
              ))}
            </div>
          )}

          {!isLoading && subscriptions?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-secondary-blue-300">No subscriptions found</p>
              <Button
                onClick={() => setIsCreating(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Create First Subscription
              </Button>
            </div>
          )}
        </div>
      </StudioLayout>

      <Sheet
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
        title={
          selectedSubscription?.name ?? (
            <span className="sr-only">Subscription details</span>
          )
        }
        width="lg"
        footer={
          viewId ? (
            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={async () => {
                  const deleted = await handleDelete(viewId);
                  if (deleted) {
                    setViewId(null);
                  }
                }}
              >
                Delete Subscription
              </Button>
            </div>
          ) : null
        }
      >
        {isDetailsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : selectedSubscription ? (
          <SubscriptionDetails
            subscription={selectedSubscription}
            onEdit={() => {
              setEditId(selectedSubscription.id);
              setViewId(null);
            }}
          />
        ) : (
          <div className="py-10 text-center text-secondary-blue-300">
            Unable to load subscription details.
          </div>
        )}
      </Sheet>

      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create Subscription"
        width="xl"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={createFormId}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Saving...' : 'Save Subscription'}
            </Button>
          </div>
        }
      >
        <SubscriptionForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreating(false)}
          isLoading={createMutation.isPending}
          formId={createFormId}
          showActions={false}
        />
      </Sheet>

      <Sheet
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        title="Edit Subscription"
        description="Update subscription plan details"
        width="xl"
        footer={
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditId(null)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={editFormId}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Subscription'}
            </Button>
          </div>
        }
      >
        {isEditLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner />
          </div>
        ) : editingSubscription ? (
          <SubscriptionForm
            defaultValues={toSubscriptionFormDefaults(editingSubscription)}
            onSubmit={handleUpdate}
            onCancel={() => setEditId(null)}
            isLoading={updateMutation.isPending}
            formId={editFormId}
            showActions={false}
          />
        ) : (
          <div className="py-10 text-center text-secondary-blue-300">
            Unable to load subscription details.
          </div>
        )}
      </Sheet>
    </>
  );
}
