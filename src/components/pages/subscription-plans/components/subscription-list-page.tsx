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

const toPascalCaseKeys = (value: unknown): unknown => {
  if (Array.isArray(value)) {
    return value.map((item) => toPascalCaseKeys(item));
  }

  const isFile = typeof File !== 'undefined' && value instanceof File;
  if (!value || typeof value !== 'object' || isFile) {
    return value;
  }

  return Object.entries(value).reduce<Record<string, unknown>>(
    (acc, [key, entry]) => {
      const pascalKey = key.charAt(0).toUpperCase() + key.slice(1);
      acc[pascalKey] = toPascalCaseKeys(entry);
      return acc;
    },
    {},
  );
};

const toSubscriptionFormDefaults = (
  subscription: Subscription,
): SubscriptionSchemaInput => {
  const converted = toPascalCaseKeys(subscription) as SubscriptionSchemaInput;
  return {
    ...converted,
    Photo: subscription.photoPath ?? null,
  };
};

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
              <p className="text-sm text-secondary-blue-200 mt-1">
                Manage platform subscription plans
              </p>
            </div>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Subscription
            </Button>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
            <div className="text-center py-20">
              <p className="text-secondary-blue-300">No subscriptions found</p>
              <Button
                onClick={() => setIsCreating(true)}
                className="mt-4 gap-2"
              >
                <Plus className="w-4 h-4" />
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
          <div className="text-center py-10 text-secondary-blue-300">
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
          <div className="text-center py-10 text-secondary-blue-300">
            Unable to load subscription details.
          </div>
        )}
      </Sheet>
    </>
  );
}
