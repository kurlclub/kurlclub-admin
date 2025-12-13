/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

'use client';

import { Input } from '@kurlclub/ui-components';

import { useOnboardingContext } from '../../hooks';
import { useOnboardingForm } from '../../hooks';
import type { AccountCreationData } from '../../types';
import { validateAccountCreation } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

/**
 * Step 2: Account Creation
 * Generates username and temporary password
 */

export function OnboardingStep2() {
  const { formData, setFormData } = useOnboardingContext();
  const { data, errors } = useOnboardingForm<AccountCreationData>(
    formData.accountCreation,
    {
      onValidate: validateAccountCreation,
    },
  );

  return (
    <StepWrapper
      title="Account Creation"
      description="Generate credentials for the client. These will be sent to them via email."
      errors={errors}
      helpText="The temporary password will expire after first login. Client must set a new password on first access."
      className="max-w-[635px] mx-auto"
    >
      <div className="flex flex-col gap-5">
        <Input label="Username" value={data.username} />
        <Input label="Temporary Password" value={data.tempPassword} />
      </div>
    </StepWrapper>
  );
}
