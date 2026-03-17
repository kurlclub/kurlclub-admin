'use client';

import { useEffect, useMemo } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  KFormField,
  KFormFieldType,
  Spinner,
} from '@kurlclub/ui-components';
import { CreditCard } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import { useOnboardingContext } from '@/hooks/onboarding';
import { subscriptionSetupSchema } from '@/schemas/onboarding.schema';
import { useSubscriptions } from '@/services/subscription';
import type { SubscriptionSetupData } from '@/types/onboarding';
import type { Subscription } from '@/types/subscription';

import { StepWrapper } from './stepper-wrapper';

const resolveSubscriptions = (
  payload: Subscription[] | { data?: Subscription[] } | undefined | null,
): Subscription[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

const isSubscriptionEqual = (
  a: SubscriptionSetupData,
  b: SubscriptionSetupData,
) =>
  a.subscriptionId === b.subscriptionId &&
  a.subscriptionDate === b.subscriptionDate;

const normalizeSubscriptionDate = (value: string) => {
  if (!value) return '';
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(value)) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return value;
};

export function OnboardingStep3() {
  const { formData, setFormData, registerStepValidator } =
    useOnboardingContext();
  const { subscription } = formData;
  const form = useForm<SubscriptionSetupData>({
    resolver: zodResolver(subscriptionSetupSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    defaultValues: subscription,
  });
  const watchedSubscription = useWatch({ control: form.control });
  const { data: subscriptionResponse, isLoading } = useSubscriptions();

  const subscriptions = useMemo(
    () => resolveSubscriptions(subscriptionResponse),
    [subscriptionResponse],
  );

  useEffect(() => {
    const currentValues = form.getValues();
    if (!isSubscriptionEqual(currentValues, subscription)) {
      form.reset(subscription);
    }
  }, [form, subscription]);

  useEffect(() => {
    if (!watchedSubscription) return;
    const nextSubscription: SubscriptionSetupData = {
      ...subscription,
      ...watchedSubscription,
      subscriptionDate: normalizeSubscriptionDate(
        watchedSubscription.subscriptionDate ?? '',
      ),
    };

    if (isSubscriptionEqual(nextSubscription, subscription)) return;

    setFormData({
      ...formData,
      subscription: nextSubscription,
    });
  }, [formData, setFormData, subscription, watchedSubscription]);

  useEffect(() => {
    const unregister = registerStepValidator(3, () =>
      form.trigger(undefined, { shouldFocus: true }),
    );
    return unregister;
  }, [form, registerStepValidator]);

  return (
    <StepWrapper
      title="Subscription Assignment"
      description="Pick the plan and activation date."
      className="max-w-225 mx-auto"
    >
      <Form {...form}>
        <form className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-center gap-3 text-secondary-blue-200">
            <CreditCard className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
              Subscription Plans
            </span>
          </div>

          <KFormField
            fieldType={KFormFieldType.SKELETON}
            control={form.control}
            name="subscriptionId"
            renderSkeleton={(field) => {
              const selectedId = field.value ? Number(field.value) : null;
              if (isLoading) {
                return (
                  <div className="flex items-center justify-center py-12">
                    <Spinner />
                  </div>
                );
              }

              if (subscriptions.length === 0) {
                return (
                  <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/40 p-6 text-sm text-secondary-blue-200">
                    No subscription plans available.
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {subscriptions.map((plan) => {
                    const isSelected = selectedId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => field.onChange(String(plan.id))}
                        className={`group w-full text-left rounded-2xl border px-4 py-3 transition-all ${
                          isSelected
                            ? 'border-primary-green-400 bg-primary-green-500/10 shadow-[0_0_0_1px_rgba(211,247,2,0.25)]'
                            : 'border-secondary-blue-400 bg-secondary-blue-600/40 hover:border-primary-green-400/50 hover:bg-secondary-blue-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                {plan.name}
                              </p>
                              {plan.badge ? (
                                <span className="rounded-full border border-primary-green-500/30 px-2 py-0.5 text-[10px] font-semibold text-primary-green-300">
                                  {plan.badge}
                                </span>
                              ) : null}
                            </div>
                            {plan.subtitle ? (
                              <p className="text-[11px] text-secondary-blue-200 mt-0.5 line-clamp-1">
                                {plan.subtitle}
                              </p>
                            ) : null}
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary-green-400 leading-none">
                              ₹{plan.monthlyPrice}
                            </p>
                            <p className="text-[10px] text-secondary-blue-300 uppercase tracking-[0.2em] mt-1">
                              Monthly
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-secondary-blue-300">
                          <span className="rounded-full bg-secondary-blue-500/60 px-2 py-0.5">
                            Clubs {plan.limits.maxClubs}
                          </span>
                          <span className="rounded-full bg-secondary-blue-500/60 px-2 py-0.5">
                            Members {plan.limits.maxMembers}
                          </span>
                          <span className="rounded-full bg-secondary-blue-500/60 px-2 py-0.5">
                            Staff {plan.limits.maxStaffs}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            }}
          />

          <div className="rounded-2xl border border-secondary-blue-400 bg-secondary-blue-600/40 p-4">
            <KFormField
              fieldType={KFormFieldType.DATE_PICKER}
              control={form.control}
              name="subscriptionDate"
              label="Subscription Date"
              mode="single"
              floating
              showYearSelector
              showPresets={false}
              mandatory
            />
          </div>
        </form>
      </Form>
    </StepWrapper>
  );
}
