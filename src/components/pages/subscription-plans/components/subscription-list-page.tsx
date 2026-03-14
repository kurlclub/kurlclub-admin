'use client';

import { useState } from 'react';

import { Button, Sheet, Spinner } from '@kurlclub/ui-components';
import { Plus } from 'lucide-react';

import { StudioLayout } from '@/components/shared/layout';
import {
  useCreateSubscription,
  useDeleteSubscription,
  useSubscriptions,
  useUpdateSubscription,
} from '@/services/subscription';
import type { SubscriptionFormData } from '@/types/subscription';

import { SubscriptionCard } from './subscription-card';
import { SubscriptionDetails } from './subscription-details';
import { SubscriptionForm } from './subscription-form';

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
    if (editId) {
      await updateMutation.mutateAsync({ id: editId, data });
      setEditId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this subscription plan?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const selectedSubscription = subscriptions?.find((s) => s.id === viewId);
  const editingSubscription = subscriptions?.find((s) => s.id === editId);
  const createFormId = 'subscription-create-form';
  const editFormId = 'subscription-edit-form';

  return (
    <>
      <StudioLayout>
        <div className="space-y-6">
          {/* Header */}
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

          {/* Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Spinner />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions?.map((subscription) => (
                <SubscriptionCard
                  key={subscription.id}
                  subscription={subscription}
                  onView={setViewId}
                  onEdit={setEditId}
                  onDelete={handleDelete}
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

      {/* View Details Sheet */}
      <Sheet
        isOpen={!!viewId}
        onClose={() => setViewId(null)}
        title={selectedSubscription?.name}
        description={selectedSubscription?.subtitle}
        width="lg"
      >
        {selectedSubscription && (
          <SubscriptionDetails subscription={selectedSubscription} />
        )}
      </Sheet>

      {/* Create Sheet */}
      <Sheet
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="Create Subscription"
        description="Add a new subscription plan"
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

      {/* Edit Sheet */}
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
        {editingSubscription && (
          <SubscriptionForm
            defaultValues={editingSubscription}
            onSubmit={handleUpdate}
            onCancel={() => setEditId(null)}
            isLoading={updateMutation.isPending}
            formId={editFormId}
            showActions={false}
          />
        )}
      </Sheet>
    </>
  );
}
