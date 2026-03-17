'use client';

import type React from 'react';
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAuth } from '@/providers/auth-provider';
import {
  completeOnboarding,
  createOnboardingDraft,
  updateOnboardingDraft,
} from '@/services/client-onboarding';
import type {
  OnboardingContextType,
  OnboardingFormData,
  OnboardingRecord,
  OnboardingStatus,
  ValidationError,
} from '@/types/onboarding';

const emptyLeadData = {
  gymName: '',
  gymLocation: '',
  gymContactNumber: '',
  country: '',
  region: '',
};

const baseFormData: OnboardingFormData = {
  lead: {
    email: '',
    contactName: '',
    phoneNumber: '',
    notes: '',
    assignedAdminId: null,
    leadData: emptyLeadData,
  },
  account: {
    userName: '',
    password: '',
    email: '',
    phoneNumber: '',
    userPhotoFile: null,
    userPhotoPreview: '',
  },
  subscription: {
    subscriptionId: '',
    subscriptionDate: '',
  },
  gyms: {
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
  initialClient?: OnboardingRecord | null;
}) {
  const { user } = useAuth();

  const assignedAdminId = useMemo(
    () => initialClient?.assignedAdminId ?? user?.userId ?? null,
    [initialClient?.assignedAdminId, user?.userId],
  );

  const getStepFromStatus = (status?: OnboardingStatus | null) => {
    switch (status) {
      case 'lead':
        return 1;
      case 'in_progress':
        return 2;
      case 'pending_review':
        return 4;
      case 'on_hold':
        return 2;
      case 'completed':
      case 'cancelled':
        return 5;
      default:
        return 1;
    }
  };

  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    if (!initialClient) {
      return {
        ...baseFormData,
        lead: {
          ...baseFormData.lead,
          assignedAdminId,
        },
      };
    }

    return {
      ...baseFormData,
      lead: {
        email: initialClient.email || '',
        contactName: initialClient.contactName || '',
        phoneNumber: initialClient.phoneNumber || '',
        notes: initialClient.notes || '',
        assignedAdminId,
        leadData: {
          gymName: initialClient.data?.gymName || '',
          gymLocation: initialClient.data?.gymLocation || '',
          gymContactNumber: initialClient.data?.gymContactNumber || '',
          country: initialClient.data?.country || '',
          region: initialClient.data?.region || '',
        },
      },
      account: {
        ...baseFormData.account,
        email: initialClient.email || '',
        phoneNumber: initialClient.phoneNumber || '',
        userName: initialClient.portalUsername || '',
      },
    };
  });

  const [currentStep, setCurrentStep] = useState(
    getStepFromStatus(initialClient?.status),
  );
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [recordId, setRecordId] = useState<number | null>(
    initialClient?.id ?? null,
  );
  const [recordStatus, setRecordStatus] = useState<OnboardingStatus | null>(
    initialClient?.status ?? null,
  );
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const stepValidatorsRef = useRef<Record<number, () => Promise<boolean>>>({});

  useEffect(() => {
    if (assignedAdminId && !formData.lead.assignedAdminId) {
      setFormData((prev) => ({
        ...prev,
        lead: {
          ...prev.lead,
          assignedAdminId,
        },
      }));
    }
  }, [assignedAdminId, formData.lead.assignedAdminId]);

  const completeStep = useCallback((step: number) => {
    setCompletedSteps((prev) => (prev.includes(step) ? prev : [...prev, step]));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      ...baseFormData,
      lead: {
        ...baseFormData.lead,
        assignedAdminId,
      },
    });
    setCurrentStep(1);
    setCompletedSteps([]);
    setErrors([]);
    setRecordId(null);
    setRecordStatus(null);
  }, [assignedAdminId]);

  const registerStepValidator = useCallback(
    (step: number, validator: () => Promise<boolean>) => {
      stepValidatorsRef.current[step] = validator;
      return () => {
        if (stepValidatorsRef.current[step] === validator) {
          delete stepValidatorsRef.current[step];
        }
      };
    },
    [],
  );

  const validateStep = useCallback(async (step: number) => {
    const validator = stepValidatorsRef.current[step];
    if (!validator) return true;
    try {
      return await validator();
    } catch (error) {
      console.warn('Validation failed:', error);
      return false;
    }
  }, []);

  const saveDraft = useCallback(async (): Promise<boolean> => {
    setIsSavingDraft(true);
    try {
      const { lead } = formData;
      const payload = {
        email: lead.email,
        contactName: lead.contactName,
        phoneNumber: lead.phoneNumber,
        notes: lead.notes,
        assignedAdminId: lead.assignedAdminId,
        data: lead.leadData
          ? {
              gymName: lead.leadData.gymName,
              gymLocation: lead.leadData.gymLocation,
              gymContactNumber: lead.leadData.gymContactNumber,
              country: lead.leadData.country,
              region: lead.leadData.region,
            }
          : null,
      };

      let saved: OnboardingRecord;
      if (recordId) {
        saved = await updateOnboardingDraft(recordId, payload);
      } else {
        saved = await createOnboardingDraft(payload);
      }

      setRecordId(saved.id);
      setRecordStatus(saved.status);

      setFormData((prev) => ({
        ...prev,
        lead: {
          ...prev.lead,
          email: saved.email || prev.lead.email,
          contactName: saved.contactName || prev.lead.contactName,
          phoneNumber: saved.phoneNumber || prev.lead.phoneNumber,
          notes: saved.notes ?? prev.lead.notes,
          assignedAdminId: saved.assignedAdminId ?? prev.lead.assignedAdminId,
          leadData: {
            gymName: saved.data?.gymName || prev.lead.leadData.gymName,
            gymLocation:
              saved.data?.gymLocation || prev.lead.leadData.gymLocation,
            gymContactNumber:
              saved.data?.gymContactNumber ||
              prev.lead.leadData.gymContactNumber,
            country: saved.data?.country || prev.lead.leadData.country,
            region: saved.data?.region || prev.lead.leadData.region,
          },
        },
        account: {
          ...prev.account,
          email: saved.email || prev.account.email,
          phoneNumber: saved.phoneNumber || prev.account.phoneNumber,
        },
      }));

      return true;
    } catch (err) {
      console.error('Draft save error:', err);
      return false;
    } finally {
      setIsSavingDraft(false);
    }
  }, [formData, recordId]);

  const submitForm = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      if (!recordId) {
        throw new Error('Draft must be created before completion.');
      }

      await completeOnboarding(recordId, formData);

      return true;
    } catch (err) {
      console.error('Submit Error:', err);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, recordId]);

  const value: OnboardingContextType = {
    formData,
    currentStep,
    completedSteps,
    errors,
    isSubmitting,
    isSavingDraft,
    recordId,
    recordStatus,
    setFormData,
    setCurrentStep,
    completeStep,
    setErrors,
    resetForm,
    saveDraft,
    submitForm,
    registerStepValidator,
    validateStep,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}
