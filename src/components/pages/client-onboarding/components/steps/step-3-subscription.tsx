/**
 * Step 3: Subscription Selection
 * Choose tier and billing cycle
 */

'use client';

import { Check } from 'lucide-react';

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
    <StepWrapper
      title="Select Subscription"
      description="Choose the subscription plan that best fits the client's needs."
      errors={errors}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => handleTierChange(plan.id)}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                data.tier === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-foreground">{plan.name}</h4>
                {plan.badge && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    {plan.badge}
                  </span>
                )}
              </div>

              <p className="text-2xl font-bold text-foreground mb-1">
                {plan.price}
                <span className="text-xs text-muted-foreground ml-1">
                  {plan.period}
                </span>
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                {plan.description}
              </p>

              <div className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Billing Cycle
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="billing"
                checked={data.billingCycle === 'monthly'}
                onChange={() => handleBillingChange('monthly')}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Monthly</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="billing"
                checked={data.billingCycle === 'annual'}
                onChange={() => handleBillingChange('annual')}
                className="w-4 h-4"
              />
              <span className="text-sm text-foreground">Annual (Save 20%)</span>
            </label>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
