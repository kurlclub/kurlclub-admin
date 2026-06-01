'use client';

import { Button } from '@kurlclub/ui-components';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle,
  CreditCard,
  MapPin,
  User,
  X,
} from 'lucide-react';

import { useOnboardingContext } from '@/hooks/onboarding';
import type { OnboardingRecord } from '@/types/onboarding';

import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
} from './steps';

interface OnboardingWizardProps {
  onClose: () => void;
  initialClient?: OnboardingRecord | null;
}

const STEPS = [
  {
    id: 1,
    name: 'Lead Intake',
    description: 'Capture lead details',
    icon: <Building2 className="w-4 h-4" />,
  },
  {
    id: 2,
    name: 'Account Setup',
    description: 'Portal access',
    icon: <User className="w-4 h-4" />,
  },
  {
    id: 3,
    name: 'Subscription',
    description: 'Assign plan',
    icon: <CreditCard className="w-4 h-4" />,
  },
  {
    id: 4,
    name: 'Gyms',
    description: 'Setup locations',
    icon: <MapPin className="w-4 h-4" />,
  },
  {
    id: 5,
    name: 'Review',
    description: 'Confirm & complete',
    icon: <CheckCircle className="w-4 h-4" />,
  },
] as const;

const STEP_COMPONENTS: Record<number, React.ReactNode> = {
  1: <OnboardingStep1 />,
  2: <OnboardingStep2 />,
  3: <OnboardingStep3 />,
  4: <OnboardingStep4 />,
  5: <OnboardingStep5 />,
};

export function OnboardingWizard({
  onClose,
  initialClient,
}: OnboardingWizardProps) {
  const {
    currentStep,
    setCurrentStep,
    submitForm,
    saveDraft,
    isSubmitting,
    isSavingDraft,
    validateStep,
  } = useOnboardingContext();
  const totalSteps = STEPS.length;

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    if (currentStep === 1) {
      const success = await saveDraft();
      if (success) setCurrentStep(2);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    const success = await submitForm();
    if (success) onClose();
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else onClose();
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) setCurrentStep(stepId);
  };

  return (
    <div className="h-full flex flex-col bg-primary-blue-500 overflow-hidden">
      {/* ── Top Bar ───────────────────────────────────── */}
      <div className="shrink-0 bg-secondary-blue-600 border-b border-secondary-blue-400">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">
              {initialClient
                ? `Resuming: ${initialClient.data?.gymName || initialClient.contactName || `#${initialClient.id}`}`
                : 'New Client Onboarding'}
            </h1>
            <p className="text-xs text-secondary-blue-200 mt-0.5">
              Step {currentStep} of {totalSteps} — {STEPS[currentStep - 1].name}
            </p>
          </div>

          {/* Center: stepper */}
          <nav className="hidden md:flex items-center gap-1">
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isAccessible = step.id <= currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  {idx > 0 && (
                    <div
                      className={`w-10 h-px mx-1 transition-colors ${
                        step.id <= currentStep
                          ? 'bg-primary-green-500'
                          : 'bg-secondary-blue-400'
                      }`}
                    />
                  )}
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={!isAccessible}
                    className="flex items-center gap-2 group outline-none"
                    title={step.description}
                  >
                    <div
                      className={`
                        relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                        transition-all duration-200
                        ${
                          isCompleted
                            ? 'bg-primary-green-500 text-primary-blue-500 shadow-lg shadow-primary-green-500/30'
                            : isActive
                              ? 'bg-primary-green-500/20 border-2 border-primary-green-500 text-primary-green-400'
                              : 'bg-secondary-blue-500 border border-secondary-blue-300 text-secondary-blue-200 group-hover:border-secondary-blue-100'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        step.icon
                      )}
                      {isActive && (
                        <span className="absolute -inset-1 rounded-full border-2 border-primary-green-500/30 animate-pulse" />
                      )}
                    </div>
                    {isActive && (
                      <span className="text-xs font-semibold text-white hidden lg:block whitespace-nowrap">
                        {step.name}
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </nav>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-secondary-blue-200 hover:text-white hover:bg-secondary-blue-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile step indicator */}
        <div className="md:hidden px-6 pb-3">
          <div className="flex gap-1">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`h-1 flex-1 rounded-full transition-all ${
                  step.id < currentStep
                    ? 'bg-primary-green-500'
                    : step.id === currentStep
                      ? 'bg-primary-green-400'
                      : 'bg-secondary-blue-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-5xl mx-auto px-6 py-8 animate-in fade-in duration-300">
          {STEP_COMPONENTS[currentStep]}
        </div>
      </div>

      {/* ── Footer Navigation ─────────────────────────── */}
      <div className="shrink-0 bg-secondary-blue-600 border-t border-secondary-blue-400 mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant={currentStep === 1 ? 'destructive' : 'outline'}
            onClick={handlePrevious}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {/* Step dots for small screens */}
          <div className="flex items-center gap-1.5 md:hidden">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  s.id === currentStep
                    ? 'bg-primary-green-500 scale-125'
                    : s.id < currentStep
                      ? 'bg-primary-green-700'
                      : 'bg-secondary-blue-400'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="gap-2 min-w-40"
            disabled={isSubmitting || isSavingDraft}
          >
            {isSubmitting || isSavingDraft ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {currentStep === 1 ? 'Saving...' : 'Completing...'}
              </>
            ) : currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                Complete Onboarding
              </>
            ) : (
              <>
                {currentStep === 1 ? 'Save & Continue' : 'Continue'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
