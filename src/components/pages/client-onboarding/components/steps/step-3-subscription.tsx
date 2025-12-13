/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

'use client';

import { useOnboardingContext } from '../../hooks';
import { useOnboardingForm } from '../../hooks';
import type { SubscriptionData, SubscriptionTier } from '../../types';
import { getSubscriptionPlans } from '../../utils';
import { validateSubscription } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

export function OnboardingStep3() {
  const { formData, setFormData, setSelectedTier } = useOnboardingContext();
  const { data, handleFieldChange, errors } =
    useOnboardingForm<SubscriptionData>(formData.subscription, {
      onValidate: validateSubscription,
    });

  const handleTierChange = (tier: SubscriptionTier) => {
    const newData = { ...data, tier };
    handleFieldChange('tier', tier);
    setFormData({ ...formData, subscription: newData });
    setSelectedTier(tier);
  };

  const handleBillingChange = (cycle: 'monthly' | 'annual') => {
    const newData = { ...data, billingCycle: cycle };
    handleFieldChange('billingCycle', cycle);
    setFormData({ ...formData, subscription: newData });
  };

  const plans = getSubscriptionPlans();

  return (
    <div className="flex flex-col gap-8 max-w-[1040px] mx-auto">
      <StepWrapper
        title="Active Onboarding Queue"
        description="Enter the basic details about the gym client you're onboarding."
        errors={errors}
        cardWrapper="p-0! border-none"
      >
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleTierChange(plan.id)}
              className={`rounded-lg border cursor-pointer transition-all overflow-hidden hover:border-primary-green-500 k-transition
              ${
                data.tier === plan.id
                  ? 'border-primary-green-500 bg-secondary-blue-400 scale-[1.01]'
                  : ''
              }
              `}
            >
              <div className="flex flex-col gap-4 p-5 bg-secondary-blue-500">
                <h4 className="font-medium text-[24px] leading-[109%]">
                  {plan.name}
                </h4>
                <span className="text-primary-green-200 font-medium text-[32px] leading-[109%]">
                  ₹299
                  <span className="text-primary-blue-50 text-base leading-[109%]">
                    /month
                  </span>
                </span>
              </div>
              <div className="flex flex-col gap-5 m-5 mt-6">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-foreground font-medium leading-[130%]"
                  >
                    <span className="w-3.5 h-3.5 rounded-full border-3 border-primary-green-100" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </StepWrapper>
      {/* TODO: radio component missing in Library */}
      <div className="flex flex-col gap-5 w-fit">
        <label className="block text-base font-semibold leading-[109%] text-white">
          Billing Cycle
        </label>

        <div className="flex gap-[22px] items-center">
          {/* Monthly */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="billing"
              checked={data.billingCycle === 'monthly'}
              onChange={() => handleBillingChange('monthly')}
              className="hidden"
            />
            <span
              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors
        ${
          data.billingCycle === 'monthly'
            ? 'border-primary-green-500'
            : 'border-[#5A5F73]'
        }
        group-hover:border-primary-green-500
      `}
            >
              {data.billingCycle === 'monthly' && (
                <span className="h-2.5 w-2.5 rounded-full bg-primary-green-500"></span>
              )}
            </span>
            <span className="text-white font-base leading-[109%]">Monthly</span>
          </label>

          {/* Annual */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="billing"
              checked={data.billingCycle === 'annual'}
              onChange={() => handleBillingChange('annual')}
              className="hidden"
            />
            <span
              className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors
        ${
          data.billingCycle === 'annual'
            ? 'border-primary-green-500'
            : 'border-[#5A5F73]'
        }
        group-hover:border-primary-green-500
      `}
            >
              {data.billingCycle === 'annual' && (
                <span className="h-2.5 w-2.5 rounded-full bg-primary-green-500"></span>
              )}
            </span>
            <span className="text-white font-base leading-[109%]">Annual</span>
          </label>
        </div>
      </div>
    </div>
  );
}
