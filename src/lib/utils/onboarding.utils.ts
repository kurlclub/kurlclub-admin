/**
 * Business logic utilities for onboarding
 * Credential generation, tier management, calculations
 */
import type { OnboardingStatus } from '@/types/onboarding';

export const generatePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*';
  const allChars = uppercase + lowercase + numbers + symbols;

  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];

  for (let i = 0; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
};

export const getStatusLabel = (status: OnboardingStatus): string => {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getStatusVariant = (
  status: OnboardingStatus,
): 'success' | 'warning' | 'info' | 'error' => {
  switch (status) {
    case 'completed':
      return 'success';
    case 'pending_review':
    case 'on_hold':
      return 'warning';
    case 'in_progress':
    case 'lead':
      return 'info';
    case 'cancelled':
    default:
      return 'error';
  }
};

export const formatOnboardingDate = (value?: string | null): string => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};
