'use client';

/**
 * Hook to safely consume onboarding context
 * Prevents usage outside provider with helpful error message
 */
import { useContext } from 'react';

import { OnboardingContext } from '../contexts';
import type { OnboardingContextType } from '../types';

export function useOnboardingContext(): OnboardingContextType {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      'useOnboardingContext must be used within OnboardingProvider',
    );
  }
  return context;
}
