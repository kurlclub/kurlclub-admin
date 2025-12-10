'use client';

import { useMemo, useState } from 'react';

import { Check, ChevronLeft, ChevronRight, Lock, X } from 'lucide-react';

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

  const progressPercent = useMemo(
    () => (currentStep / totalSteps) * 100,
    [currentStep, totalSteps],
  );

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
      {/* <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"> */}
      <div className="bg-secondary-blue-500 h-screen fixed inset-0 z-60 w-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-between gap-10 pt-10 pb-10.5 px-5 border-b border-secondary-blue-400">
          {/* TODO: todo next */}

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
                    // className={`relative flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                    //   isActive
                    //     ? 'bg-primary-green-500/20 border border-primary-green-500/50'
                    //     : isCompleted
                    //       ? 'bg-primary-green-500/10 border border-primary-green-500/30 hover:bg-primary-green-500/15 cursor-pointer'
                    //       : 'bg-secondary-blue-600 border border-secondary-blue-400 cursor-not-allowed opacity-50'
                    // }`}
                    className=""
                  >
                    {/* TODO: #68729A Color not added in library */}
                    <span className="h-7 w-7 border-[#68729A] border rounded-full flex items-center justify-center text-primary-blue-50 font-semibold text-sm leading-[109%]">
                      {step.id}
                    </span>
                    {step.name}
                    {/* <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm transition-all ${
                        isActive
                          ? 'bg-primary-green-500 text-primary-blue-500 scale-110'
                          : isCompleted
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-secondary-blue-600 text-gray-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        step.id
                      )}
                    </div> */}

                    {/* <div className="text-center">
                      <p className="text-xs font-semibold text-white whitespace-nowrap">
                        {step.name}
                      </p>
                      <p className="text-xs text-gray-400 whitespace-nowrap">
                        {step.description}
                      </p>
                    </div> */}
                  </button>

                  {idx < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-3.5 mx-2 rounded-full transition-all ${
                        currentStep > step.id
                          ? 'bg-primary-green-500'
                          : 'bg-secondary-blue-50'
                      }`}
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
              Enter the basic details about the gym client you're onboarding.
            </p>
          </div>
          {/* <button
              onClick={onClose}
              className="p-2 absolute top-3 hover:bg-secondary-blue-600 rounded-lg transition-all hover:scale-110 duration-200"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button> */}
        </div>

        {/* <div className="px-8 pt-6 pb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Progress
              </span>
              <span className="text-xs font-bold text-primary-green-500">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-secondary-blue-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-green-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div> */}

        <div className="flex-1 overflow-auto p-8 bg-secondary-blue-900">
          <div className="animate-in fade-in duration-300">
            {renderStepContent()}
          </div>
        </div>

        <div className="flex items-center justify-between p-8 border-t bg-secondary-blue-900 border-secondary-blue-400 bg-secondary-blue-600/50 backdrop-blur-sm">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-secondary-blue-400 text-white hover:bg-secondary-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }).map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 w-1.5 rounded-full transition-all ${
                  idx + 1 <= currentStep
                    ? 'bg-primary-green-500 w-6'
                    : 'bg-secondary-blue-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-green-500 text-primary-blue-500 hover:bg-primary-green-600 transition-all duration-200 hover:scale-105 font-medium shadow-lg"
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                Complete
              </>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
      {/* </div> */}
    </OnboardingProvider>
  );
}
