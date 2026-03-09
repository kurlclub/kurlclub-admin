'use client';

import type React from 'react';
import { createContext, useCallback, useState } from 'react';

import type {
  OnboardingClient,
  OnboardingContextType,
  OnboardingFormData,
  SubscriptionTier,
  ValidationError,
} from '../types';

const initialFormData: OnboardingFormData = {
  clientInfo: {
    email: '',
    phoneNumber: '',
    profilePhotoFile: null,
    profilePhotoPreview: '',
  },
  accountCreation: {
    userName: '',
    password: '',
  },
  subscription: {
    tier: 'Professional',
    billingCycle: 'monthly',
    setupFee: '',
    monthlyStudioFee: '',
  },
  subGyms: {
    gyms: [],
  },
};

export const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

export function OnboardingProvider({
  children,
  initialClient,
}: {
  children: React.ReactNode;
  initialClient?: OnboardingClient | null;
}) {
  const [formData, setFormData] = useState<OnboardingFormData>(
    initialClient
      ? {
          ...initialFormData,
          clientInfo: {
            email: initialClient.email || '',
            phoneNumber: initialClient.phone || '',
            profilePhotoFile: null,
            profilePhotoPreview: '',
          },
          accountCreation: {
            userName: initialClient.username || '',
            password: '',
          },
          subscription: {
            ...initialFormData.subscription,
            tier: initialClient.subscriptionTier || 'Professional',
            setupFee: '',
            monthlyStudioFee: '',
          },
          // For existing clients, we might fetch their gyms separately or initialize if available
          subGyms: {
            gyms: [],
          },
        }
      : initialFormData,
  );

  const [currentStep, setCurrentStep] = useState(
    initialClient ? initialClient.step : 1,
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [selectedTier, setSelectedTier] =
    useState<SubscriptionTier>('Professional');
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrors([]);
  }, []);

  const submitForm = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const { clientInfo, accountCreation, subGyms } = formData;

      const payload = new FormData();
      payload.append('Email', clientInfo.email);
      payload.append('UserName', accountCreation.userName);
      payload.append('Password', accountCreation.password || '');
      payload.append('PhoneNumber', clientInfo.phoneNumber);

      if (clientInfo.profilePhotoFile) {
        payload.append('ProfilePhoto', clientInfo.profilePhotoFile);
      }

      // Format gyms as per API: GymName, Location, ContactNumber1, ContactNumber2, Email, Status, SocialLinks
      const gymsJson = subGyms.gyms.map((gym) => ({
        GymName: gym.GymName,
        Location: gym.Location,
        ContactNumber1: gym.ContactNumber1,
        ContactNumber2: gym.ContactNumber2,
        Email: gym.Email,
        Status: gym.Status,
        SocialLinks: gym.SocialLinks.filter((link) => link.trim() !== ''),
      }));

      payload.append('GymsJson', JSON.stringify(gymsJson));

      const response = await fetch(
        'https://kurlclubcore.onrender.com/api/User/ClientOnboarding',
        {
          method: 'POST',
          headers: {
            accept: '*/*',
          },
          body: payload,
        },
      );

      if (!response.ok) {
        throw new Error('Onboarding activation failed');
      }

      return true;
    } catch (err) {
      console.error('Submit Error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const value: OnboardingContextType = {
    formData,
    currentStep,
    completedSteps,
    selectedTier,
    errors,
    isSubmitting,
    setFormData,
    setCurrentStep,
    completeStep,
    setSelectedTier,
    setErrors,
    resetForm,
    submitForm,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
