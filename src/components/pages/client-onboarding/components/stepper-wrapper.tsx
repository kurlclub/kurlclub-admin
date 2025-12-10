/**
 * DRY wrapper component for all onboarding steps
 * Eliminates code duplication across step components
 */
import type { ReactNode } from 'react';

import { AlertCircle, CheckCircle, Info } from 'lucide-react';

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
  helpText,
  successMessage,
  errors,
}: StepWrapperProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
      </div>

      {errors && errors.length > 0 && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex gap-3 animate-in slide-in-from-top">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-destructive mb-2">
              Please fix the following errors:
            </p>
            <ul className="space-y-1 text-sm text-destructive/80">
              {errors.map((error) => (
                <li key={`${error.field}-${error.message}`}>
                  {' '}
                  {error.message}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-sm text-green-300">{successMessage}</p>
        </div>
      )}

      {/* Main content area */}
      <div className="bg-secondary-blue-600/30 rounded-lg p-6 border border-secondary-blue-400">
        {children}
      </div>

      {helpText && (
        <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 flex gap-3">
          <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-300 leading-relaxed">{helpText}</p>
        </div>
      )}
    </div>
  );
}
