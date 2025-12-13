/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

'use client';

import { Input } from '@kurlclub/ui-components';
import { Check, Mail } from 'lucide-react';

import { useOnboardingContext } from '../../hooks';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

export function OnboardingStep5() {
  const { formData } = useOnboardingContext();

  return (
    <StepWrapper
      title="Review & Activate"
      description="Review all information before completing the onboarding."
      className="max-w-[754px] mx-auto"
    >
      <div className="flex flex-col gap-5">
        {/* TODO: Readonly not working in input */}
        <Input label="Owner" value={formData.clientInfo.ownerName} readOnly />
        <Input label="Gym name" value={formData.clientInfo.gymName} readOnly />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Email" value={formData.clientInfo.email} readOnly />
          <Input
            label="Subscription"
            value={formData.subscription.tier}
            readOnly
          />
          <Input
            label="Username"
            value={formData.accountCreation.username}
            readOnly
          />
          <Input
            label="Sub-Gyms"
            value={formData.subGyms.subGyms.length}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-3">
          {/* TODO: Checkbox missing in ui Library */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <span
              className="h-4 w-4 rounded-[3px] border flex items-center justify-center
      border-primary-blue-300
      transition-all
      group-hover:border-primary-green-500
      peer-checked:border-primary-green-500
      peer-checked:bg-primary-green-500"
            >
              <Check
                className="
        w-3 h-3 text-transparent transition-all
        group-has-[input:checked]:text-black
      "
                strokeWidth={3}
              />
            </span>
            <span className="text-sm text-white leading-[109%]">
              Send welcome email with credentials
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <span
              className="h-4 w-4 rounded-[3px] border flex items-center justify-center
      border-primary-blue-300
      transition-all
      group-hover:border-primary-green-500
      peer-checked:border-primary-green-500
      peer-checked:bg-primary-green-500"
            >
              <Check
                className="
        w-3 h-3 text-transparent transition-all
        group-has-[input:checked]:text-black
      "
                strokeWidth={3}
              />
            </span>
            <span className="text-sm text-white leading-[109%]">
              Schedule onboarding call
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" defaultChecked className="peer sr-only" />
            <span
              className="h-4 w-4 rounded-[3px] border flex items-center justify-center
      border-primary-blue-300
      transition-all
      group-hover:border-primary-green-500
      peer-checked:border-primary-green-500
      peer-checked:bg-primary-green-500"
            >
              <Check
                className="
        w-3 h-3 text-transparent transition-all
        group-has-[input:checked]:text-black
      "
                strokeWidth={3}
              />
            </span>
            <span className="text-sm text-white leading-[109%]">
              Assign account manager
            </span>
          </label>
        </div>

        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3">
          <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Activation Email
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A welcome email with account credentials will be sent to the
              client upon completion.
            </p>
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
