/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

'use client';

import type React from 'react';

import { Input, Textarea } from '@kurlclub/ui-components';

import { useOnboardingContext, useOnboardingForm } from '../../hooks';
import type { ClientInfoData } from '../../types';
import { validateClientInfo } from '../../utils';
import { StepWrapper } from '../stepper-wrapper';

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

export function OnboardingStep1() {
  const { formData, setFormData } = useOnboardingContext();
  const { data, handleChange, errors } = useOnboardingForm<ClientInfoData>(
    formData.clientInfo,
    {
      onValidate: validateClientInfo,
    },
  );

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const tempData = { ...data, [e.target.name]: e.target.value };
    const validationErrors = validateClientInfo(tempData);
    if (validationErrors.length === 0) {
      setFormData({ ...formData, clientInfo: tempData });
    }
  };

  return (
    <StepWrapper
      title="Active Onboarding Queue"
      description="Enter the basic details about the gym client you're onboarding."
      errors={errors}
      helpText="This information will be used to create the client account and send welcome communications."
      className="max-w-[635px] mx-auto"
    >
      <div className="flex flex-col gap-5 max-w-[635px]">
        {/* TODO: Required star missing in input */}
        <Input
          label="Gym name *"
          required
          value={data.gymName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <Input
          label="Owner name *"
          required
          value={data.ownerName}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Email"
            className="w-full"
            value={data.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="Phone"
            className="w-full"
            value={data.phone}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
        <Textarea
          label="Address *"
          value={data.address}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <div className="flex items-center gap-3">
          <Input
            label="Country"
            className="w-full"
            value={data.country}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="State/ Province"
            className="w-full"
            value={data.state}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="City"
            className="w-full"
            value={data.city}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          <Input
            label="Pincode"
            className="w-full"
            value={data.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
