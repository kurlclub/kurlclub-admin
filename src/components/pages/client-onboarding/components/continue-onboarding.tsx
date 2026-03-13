'use client';

import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

import {
  AlertCircle,
  BookOpen,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Zap,
} from 'lucide-react';

import { OnboardingProvider } from '../contexts';
import type { ContinueOnboardingProps } from '../types';
import {
  calculateOnboardingProgress,
  getEstimatedTimeRemaining,
} from '../utils';
import {
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
} from './steps';

type StepConfig = {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

export function ContinueOnboardingModule({
  clientName,
  currentStep: initialStep,
  totalSteps,
  onComplete,
}: ContinueOnboardingProps) {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(
    new Set(Array.from({ length: initialStep - 1 }, (_, i) => i + 1)),
  );

  const stepsConfig = useMemo<StepConfig[]>(
    () => [
      {
        id: 1,
        name: 'Client Information',
        description: 'Basic company and contact details',
        icon: <Building2 className="w-5 h-5" />,
        component: <OnboardingStep1 />,
      },
      {
        id: 2,
        name: 'Account Setup',
        description: 'Create primary account credentials',
        icon: <Zap className="w-5 h-5" />,
        component: <OnboardingStep2 />,
      },
      {
        id: 3,
        name: 'Select Plan',
        description: 'Choose subscription tier',
        icon: <Check className="w-5 h-5" />,
        component: <OnboardingStep3 />,
      },
      {
        id: 4,
        name: 'Configure Gyms',
        description: 'Add sub-gym locations',
        icon: <Building2 className="w-5 h-5" />,
        component: <OnboardingStep4 />,
      },
      {
        id: 5,
        name: 'Review & Activate',
        description: 'Verify and activate account',
        icon: <Check className="w-5 h-5" />,
        component: <OnboardingStep5 />,
      },
    ],
    [],
  );

  const handleStepComplete = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const handleFinish = useCallback(() => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]));
    onComplete();
  }, [currentStep, onComplete]);

  const handleStepClick = useCallback(
    (stepId: number) => {
      if (completedSteps.has(stepId) || stepId === currentStep) {
        setCurrentStep(stepId);
      }
    },
    [completedSteps, currentStep],
  );

  const progress = calculateOnboardingProgress(currentStep, totalSteps);
  const isLastStep = currentStep === totalSteps;
  const currentStepConfig = stepsConfig[currentStep - 1];
  const timeRemaining = getEstimatedTimeRemaining(currentStep, totalSteps);

  return (
    <OnboardingProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Resume Onboarding
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {clientName} • Step {currentStep} of {totalSteps}
                </p>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {timeRemaining}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-primary to-accent transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Steps Navigation */}
            <aside className="lg:col-span-1">
              <div className="sticky top-32 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                  Steps
                </h3>
                <nav className="space-y-2">
                  {stepsConfig.map((step) => {
                    const isCompleted = completedSteps.has(step.id);
                    const isActive = currentStep === step.id;
                    const isPending = step.id > currentStep;

                    return (
                      <button
                        key={step.id}
                        onClick={() => handleStepClick(step.id)}
                        disabled={isPending}
                        className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                          isActive
                            ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                            : isCompleted
                              ? 'border-green-500/50 bg-green-500/5 hover:bg-green-500/10'
                              : isPending
                                ? 'border-border opacity-50 cursor-not-allowed'
                                : 'border-border hover:bg-secondary/50 hover:border-primary/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                              isCompleted
                                ? 'bg-green-500 text-white'
                                : isActive
                                  ? 'bg-primary text-primary-foreground'
                                  : isPending
                                    ? 'bg-border text-muted-foreground'
                                    : 'bg-secondary text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              step.id
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                            >
                              {step.name}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Content Area */}
            <main className="lg:col-span-3 space-y-8">
              {/* Step Card */}
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                {/* Step Header */}
                <div className="border-b border-border bg-secondary/30 px-8 py-6">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      {currentStepConfig?.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-foreground">
                        {currentStepConfig?.name}
                      </h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {currentStepConfig?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step Content */}
                <div className="px-8 py-8 min-h-96">
                  {currentStepConfig?.component}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-6 rounded-lg border border-border bg-secondary/30">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  aria-label="Go to previous step"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="text-xs text-muted-foreground">
                  Step {currentStep} of {totalSteps}
                </div>

                <button
                  onClick={isLastStep ? handleFinish : handleStepComplete}
                  aria-label={
                    isLastStep ? 'Complete onboarding' : 'Go to next step'
                  }
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 font-medium text-sm shadow-lg shadow-primary/30"
                >
                  {isLastStep ? (
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

              {/* Help Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="#help"
                  className="group p-4 rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Documentation
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        View step-by-step guides and best practices
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  href="#support"
                  className="group p-4 rounded-lg border border-border bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50 transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="font-medium text-foreground text-sm">
                        Need Help?
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Contact support or check FAQ section
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    </OnboardingProvider>
  );
}
