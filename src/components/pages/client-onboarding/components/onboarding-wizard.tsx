'use client';

import { useState } from 'react';

import { Button } from '@kurlclub/ui-components';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import { OnboardingProvider } from '../contexts';
import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
} from './steps';

interface OnboardingWizardProps {
  onClose: () => void;
}

const STEPS = [
  { id: 1, name: 'Client Info', description: 'Basic information', icon: '📋' },
  {
    id: 2,
    name: 'Account Setup',
    description: 'Create credentials',
    icon: '👤',
  },
  { id: 3, name: 'Subscription', description: 'Choose plan', icon: '💳' },
  { id: 4, name: 'Gym Locations', description: 'Add sub-gyms', icon: '🏢' },
  { id: 5, name: 'Review', description: 'Confirm & activate', icon: '✓' },
] as const;

export function OnboardingWizard({ onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = STEPS.length;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= currentStep) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;
      case 3:
        return <OnboardingStep3 />;
      case 4:
        return <OnboardingStep4 />;
      case 5:
        return <OnboardingStep5 />;
      default:
        return null;
    }
  };

  return (
    <OnboardingProvider>
      <div className="bg-secondary-blue-600 z-60 w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-10 py-8 px-5 border-b border-secondary-blue-400">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {STEPS.map((step, idx) => {
              const isCompleted = step.id < currentStep;
              const isActive = step.id === currentStep;
              const isLocked = step.id > currentStep;

              return (
                <div key={step.id} className="flex items-center shrink-0">
                  <button
                    onClick={() => handleStepClick(step.id)}
                    disabled={isLocked}
                    className={`flex items-center gap-2 text-sm font-semibold leading-[109%]
                      `}
                  >
                    {/* TODO: #68729A Color not added in library */}
                    <span
                      className={`h-7 w-7 border-[#68729A] border rounded-full flex items-center justify-center text-primary-blue-50 font-semibold text-sm leading-[109%] 
    ${isActive || isCompleted ? 'bg-primary-green-500 text-black! border-primary-green-500' : ''}`}
                    >
                      {step.id}
                    </span>
                    {step.name}
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-3.5 mx-2 rounded-full transition-all bg-secondary-blue-50`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-3">
            <h2 className="text-[32px] font-semibold leading-[109%] text-white">
              New client onboarding
            </h2>
            <p className="text-base text-[#F8F8F8] leading-[109%]">
              {
                "Enter the basic details about the gym client you're onboarding."
              }
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-8 bg-primary-blue-500">
          <div className="animate-in fade-in duration-300 mx-auto">
            {renderStepContent()}
          </div>
          <div
            className={`flex items-center justify-between mx-auto mt-6 ${currentStep == 1 || currentStep == 2 ? 'max-w-[635px]' : 'max-w-[1040px] mt-9!'}`}
          >
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
            >
              <ArrowLeft className="h-3 w-3" /> Back
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm leading-[109%] text-primary-blue-100">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}
