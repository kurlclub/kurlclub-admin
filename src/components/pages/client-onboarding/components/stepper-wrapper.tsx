/**
 * DRY wrapper component for all onboarding steps
 * Eliminates code duplication across step components
 */
import type { ReactNode } from 'react';

interface StepWrapperProps {
  title: string;
  description: string;
  children: ReactNode;
  helpText?: string;
  successMessage?: string;
  errors?: Array<{ field: string; message: string }>;
}

export function StepWrapper({
  title,
  description,
  children,
}: StepWrapperProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>

      {/* Main content area */}
      <div className="rounded-lg p-2 border border-secondary-blue-500">
        {children}
      </div>
    </div>
  );
}
