'use client';

import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  FieldGrid,
  Form,
  KFormField,
  KFormFieldType,
  ProfileUploader,
} from '@kurlclub/ui-components';
import { ShieldCheck } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { useOnboardingContext } from '@/hooks/onboarding';
import { generatePassword } from '@/lib/utils/onboarding.utils';
import { accountSetupSchema } from '@/schemas/onboarding.schema';
import type { AccountSetupData } from '@/types/onboarding';

import { StepWrapper } from './stepper-wrapper';

const isAccountEqual = (a: AccountSetupData, b: AccountSetupData) =>
  a.userName === b.userName &&
  a.password === b.password &&
  a.email === b.email &&
  a.phoneNumber === b.phoneNumber &&
  a.userPhotoFile === b.userPhotoFile &&
  a.userPhotoPreview === b.userPhotoPreview;

export function OnboardingStep2() {
  const { formData, setFormData, registerStepValidator } =
    useOnboardingContext();
  const { account } = formData;
  const form = useForm<AccountSetupData>({
    resolver: zodResolver(accountSetupSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: account,
  });
  const watchedAccount = useWatch({ control: form.control });
  const preview = useWatch({
    control: form.control,
    name: 'userPhotoPreview',
  });

  useEffect(() => {
    const currentValues = form.getValues();
    if (!isAccountEqual(currentValues, account)) {
      form.reset(account);
    }
  }, [account, form]);

  useEffect(() => {
    if (!watchedAccount) return;
    const nextAccount: AccountSetupData = {
      ...account,
      ...watchedAccount,
    };

    if (isAccountEqual(nextAccount, account)) return;

    setFormData({
      ...formData,
      account: nextAccount,
    });
  }, [account, formData, setFormData, watchedAccount]);

  useEffect(() => {
    const unregister = registerStepValidator(2, () =>
      form.trigger(undefined, { shouldFocus: true }),
    );
    return unregister;
  }, [form, registerStepValidator]);

  const applyGeneratedPassword = () => {
    form.setValue('password', generatePassword(), {
      shouldDirty: true,
    });
  };

  return (
    <StepWrapper
      title="Account Setup"
      description="Create the client portal credentials and attach a profile photo."
      className="max-w-180 mx-auto"
    >
      <Form {...form}>
        <form className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <div className="flex items-center gap-3 text-secondary-blue-200">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Portal Identity
              </span>
            </div>
            <KFormField
              fieldType={KFormFieldType.SKELETON}
              control={form.control}
              name="userPhotoFile"
              renderSkeleton={(field) => (
                <ProfileUploader
                  files={field.value instanceof File ? field.value : null}
                  existingImageUrl={
                    typeof preview === 'string' && preview ? preview : null
                  }
                  onChange={(file) => {
                    if (!file) {
                      field.onChange(null);
                      form.setValue('userPhotoPreview', '');
                      return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      form.setValue(
                        'userPhotoPreview',
                        typeof reader.result === 'string' ? reader.result : '',
                        {
                          shouldDirty: true,
                        },
                      );
                    };
                    reader.readAsDataURL(file);
                    field.onChange(file);
                  }}
                />
              )}
            />
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary-blue-200">
                Credentials
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={applyGeneratedPassword}
                  className="h-8 px-3 text-[10px]"
                >
                  Generate Password
                </Button>
              </div>
            </div>

            <FieldGrid columns={1} smColumns={2} gap="md">
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="userName"
                label="Username"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.PASSWORD}
                control={form.control}
                name="password"
                label="Temporary Password"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email Address"
                type="email"
                mandatory
              />
              <KFormField
                fieldType={KFormFieldType.PHONE_INPUT}
                control={form.control}
                name="phoneNumber"
                label="Phone Number"
                mandatory
              />
            </FieldGrid>
          </div>
        </form>
      </Form>
    </StepWrapper>
  );
}
