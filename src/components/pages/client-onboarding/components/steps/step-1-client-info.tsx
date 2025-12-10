/**
 * Step 1: Client Information
 * Collects gym name, owner, contact details
 */

'use client';

import type React from 'react';

import { Building2, Mail, MapPin, Phone, User } from 'lucide-react';

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
      title="Client Information"
      description="Enter the basic details about the gym client you're onboarding."
      errors={errors}
      helpText="This information will be used to create the client account and send welcome communications."
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Gym Name
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="gymName"
              placeholder="Elite Fitness Studio"
              className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={data.gymName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Owner Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="ownerName"
              placeholder="John Anderson"
              className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={data.ownerName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              name="email"
              placeholder="john@elite-fitness.com"
              className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={data.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              name="phone"
              placeholder="+1 (555) 000-0000"
              className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={data.phone}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Address
          </label>
          <input
            type="text"
            name="address"
            placeholder="123 Main Street"
            className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            value={data.address}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            City
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              name="city"
              placeholder="New York"
              className="w-full bg-secondary pl-10 pr-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
              value={data.city}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            State
          </label>
          <input
            type="text"
            name="state"
            placeholder="NY"
            className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            value={data.state}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            ZIP Code
          </label>
          <input
            type="text"
            name="zipCode"
            placeholder="10001"
            className="w-full bg-secondary px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
            value={data.zipCode}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
    </StepWrapper>
  );
}
