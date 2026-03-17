'use client';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Badge,
  Button,
  FieldGrid,
  Form,
  KFormField,
  KFormFieldType,
  ProfileUploader,
  Spinner,
  formatDateTime,
  getProfilePictureSrc,
} from '@kurlclub/ui-components';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { StudioLayout } from '@/components/shared/layout';
import { ROLE_LABELS, normalizeRole } from '@/lib/authz';
import { useAuth } from '@/providers/auth-provider';
import type {
  ProfileFormData,
  ProfileSchemaInput,
} from '@/schemas/profile.schema';
import { profileSchema } from '@/schemas/profile.schema';
import { useUpdateAdminProfile } from '@/services/auth/auth';

const formatValue = (value?: string | null) =>
  value && value.trim().length > 0 ? value : '—';

export function ProfilePage() {
  const { user, isReady, refreshUser } = useAuth();
  const updateMutation = useUpdateAdminProfile();

  const defaultValues = useMemo<ProfileSchemaInput>(
    () => ({
      name: user?.userName ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      photoFile: null,
    }),
    [user?.phoneNumber, user?.userName],
  );

  const form = useForm<ProfileSchemaInput, unknown, ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues,
  });

  const watchedName = useWatch({ control: form.control, name: 'name' });
  const watchedPhone = useWatch({ control: form.control, name: 'phoneNumber' });
  const watchedPhoto = useWatch({ control: form.control, name: 'photoFile' });
  const hasPhotoChange = watchedPhoto instanceof File;

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const photoSrc = useMemo(() => {
    const normalizedPhotoPath = user?.photoPath?.trim() || null;
    return getProfilePictureSrc(null, normalizedPhotoPath) ?? null;
  }, [user?.photoPath]);

  const normalizedRole = normalizeRole(user?.userRole);
  const roleLabel = normalizedRole
    ? ROLE_LABELS[normalizedRole]
    : user?.userRole || 'Admin';

  const displayName = watchedName?.trim() || user?.userName || 'Admin User';

  const displayEmail = user?.userEmail || '—';
  const displayPhone = watchedPhone ?? user?.phoneNumber ?? '';
  const createdAtLabel = user?.createdAt
    ? formatDateTime(user.createdAt, 'date')
    : '—';

  const handleReset = () => {
    form.reset(defaultValues);
  };

  const handleSubmit = async (values: ProfileFormData) => {
    if (!user) return;
    try {
      await updateMutation.mutateAsync({
        id: user.userId,
        name: values.name?.trim() ?? '',
        phoneNumber: values.phoneNumber ?? '',
        type: user.userRole,
        photoFile: values.photoFile ?? null,
      });
      const refreshed = await refreshUser();
      if (!refreshed.success) {
        toast.success('Profile updated. Refresh failed, please reload.');
        return;
      }
      toast.success('Profile updated successfully.');
      form.reset({
        name: values.name ?? '',
        phoneNumber: values.phoneNumber ?? '',
        photoFile: null,
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile.');
    }
  };

  const isBusy = updateMutation.isPending;
  const canSubmit = form.formState.isDirty || hasPhotoChange;

  return (
    <StudioLayout
      title="Profile"
      description="Update your admin profile and profile picture"
    >
      {!isReady ? (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      ) : !user ? (
        <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-6 text-center text-secondary-blue-200">
          Unable to load profile details. Please sign in again.
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="w-full max-w-5xl space-y-6">
              <section className="relative overflow-hidden rounded-2xl border border-secondary-blue-200/20 bg-linear-to-br from-secondary-blue-200/10 via-secondary-blue-600/20 to-secondary-blue-600/5 p-5 shadow-md">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="shrink-0">
                    <KFormField
                      fieldType={KFormFieldType.SKELETON}
                      control={form.control}
                      name="photoFile"
                      renderSkeleton={(field) => (
                        <ProfileUploader
                          files={
                            field.value instanceof File ? field.value : null
                          }
                          existingImageUrl={photoSrc}
                          onChange={(file) => {
                            field.onChange(file);
                            form.setValue('photoFile', file, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                          }}
                          isSmall
                        />
                      )}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-lg font-semibold text-white truncate">
                        {displayName}
                      </div>
                      <Badge variant="secondary" className="text-[11px]">
                        {roleLabel}
                      </Badge>
                    </div>
                    <div className="text-sm text-secondary-blue-200 truncate">
                      {displayEmail}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-secondary-blue-100">
                      <span className="rounded-full border border-secondary-blue-300/40 bg-secondary-blue-700/40 px-3 py-1">
                        Phone: {formatValue(displayPhone)}
                      </span>
                      <span className="rounded-full border border-secondary-blue-300/40 bg-secondary-blue-700/40 px-3 py-1">
                        Member Since: {createdAtLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-0 bg-linear-to-t from-primary-green-500/5 via-transparent to-primary-green-400/5 pointer-events-none opacity-50" />
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary-blue-200/50 to-transparent" />
              </section>

              <section className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/50 p-5">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-semibold text-secondary-blue-200 uppercase tracking-wider">
                      Personal Details
                    </h2>
                    <p className="text-xs text-secondary-blue-300 mt-1">
                      Keep your profile information up to date.
                    </p>
                  </div>
                </div>

                <FieldGrid columns={1} smColumns={2} gap="md">
                  <KFormField
                    fieldType={KFormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="e.g., Hafis N"
                    mandatory
                  />
                  <KFormField
                    fieldType={KFormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="+91 96567 46975"
                  />
                </FieldGrid>

                <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    disabled={isBusy || !canSubmit}
                  >
                    Reset
                  </Button>
                  <Button type="submit" disabled={isBusy || !canSubmit}>
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </section>
            </div>
          </form>
        </Form>
      )}
    </StudioLayout>
  );
}
