/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

'use client';

import type React from 'react';
import { createContext, useCallback, useState } from 'react';

import type {
  OnboardingContextType,
  OnboardingFormData,
  SubscriptionTier,
  ValidationError,
} from '../types';

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

/**
 * Global state management for onboarding workflow
 * Context provider and state mutations
 */

const initialFormData: OnboardingFormData = {
  clientInfo: {
    gymName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  },
  accountCreation: {
    username: '',
    tempPassword: '',
  },
  subscription: {
    tier: 'Professional',
    billingCycle: 'monthly',
  },
  subGyms: {
    subGyms: [{ id: 1, name: 'Main Location', city: '', country: '' }],
  },
};

export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

export function OnboardingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedTier, setSelectedTier] =
    useState<SubscriptionTier>('Professional');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrors([]);
  }, []);

  const value: OnboardingContextType = {
    formData,
    currentStep,
    completedSteps,
    selectedTier,
    errors,
    setFormData,
    setCurrentStep,
    completeStep,
    setSelectedTier,
    setErrors,
    resetForm,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
