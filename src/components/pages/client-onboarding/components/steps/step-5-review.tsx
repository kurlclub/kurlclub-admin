/**
 * Step 5: Review & Activate
 * Final confirmation before onboarding activation
 */

'use client';

import { CheckCircle2, Mail } from 'lucide-react';

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

export function OnboardingStep5() {
  const { formData } = useOnboardingContext();

  return (
    <StepWrapper
      title="Review & Activate"
      description="Review all information before completing the onboarding."
    >
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">
                {formData.clientInfo.gymName}
              </p>
              <p className="text-sm text-muted-foreground">
                Owner: {formData.clientInfo.ownerName}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Email</p>
            <p className="font-medium text-foreground text-sm">
              {formData.clientInfo.email}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Subscription</p>
            <p className="font-medium text-foreground text-sm">
              {formData.subscription.tier}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Username</p>
            <p className="font-medium text-foreground font-mono text-sm">
              {formData.accountCreation.username}
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Sub-Gyms</p>
            <p className="font-medium text-foreground text-sm">
              {formData.subGyms.subGyms.length} Locations
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-foreground">
              Send welcome email with credentials
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
            <span className="text-sm text-foreground">
              Schedule onboarding call
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded" />
            <span className="text-sm text-foreground">
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
