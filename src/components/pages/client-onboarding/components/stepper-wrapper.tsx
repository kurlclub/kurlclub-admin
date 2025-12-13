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
  className?: string;
  cardWrapper?: string;
  gymCount?: string;
}

export function StepWrapper({
  title,
  description,
  children,
  className = '',
  cardWrapper = '',
  gymCount,
}: StepWrapperProps) {
  return (
    <div className={`flex flex-col gap-7 ${className}`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4 justify-between">
          <h3 className="text-[20px] font-medium leading-[109%] text-white">
            {title}
          </h3>
          <span className="text-sm text-secondary-blue-50 leading-[109%]">
            {gymCount}
          </span>
        </div>
        {/* TODO: color missing in library */}
        <p className="text-base leading-[109%] text-[#F8F8F8]">{description}</p>
      </div>

      {/* Main content area */}
      <div
        className={`rounded-lg p-2 border border-secondary-blue-500 ${cardWrapper}`}
      >
        {children}
      </div>
    </div>
  );
}
