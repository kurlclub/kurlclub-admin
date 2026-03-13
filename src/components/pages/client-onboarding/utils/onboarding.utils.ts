/**
 * Business logic utilities for onboarding
 * Credential generation, tier management, calculations
 */
import type {
  SubscriptionPlan,
  SubscriptionTier,
  SubscriptionTierInfo,
} from '../types';

export const generateUsername = (gymName: string): string => {
  const sanitized = gymName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .slice(0, 10);
  const timestamp = Date.now().toString().slice(-4);
  return `${sanitized}_${timestamp}`;
};

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

export const getGymLimitByTier = (tier: SubscriptionTier): number => {
  switch (tier) {
    case 'Starter':
      return 1;
    case 'Professional':
      return 5;
    case 'Enterprise':
      return 999;
    default:
      return 1;
  }
};

export const getSubscriptionTierInfo = (
  tier: SubscriptionTier,
): SubscriptionTierInfo => {
  const tiers: Record<SubscriptionTier, SubscriptionTierInfo> = {
    Starter: {
      tier: 'Starter',
      price: 299,
      maxGyms: 1,
      features: [
        'Up to 500 members',
        '1 location',
        'Basic reporting',
        'Email support',
      ],
    },
    Professional: {
      tier: 'Professional',
      price: 699,
      maxGyms: 5,
      features: [
        'Up to 2000 members',
        'Up to 5 locations',
        'Advanced reporting',
        'Priority support',
        'Custom branding',
      ],
    },
    Enterprise: {
      tier: 'Enterprise',
      price: 0,
      maxGyms: 999,
      features: [
        'Unlimited members',
        'Unlimited locations',
        'Custom integrations',
        '24/7 dedicated support',
        'Advanced analytics',
        'White-label options',
      ],
    },
  };
  return tiers[tier];
};

export const getSubscriptionPlans = (): SubscriptionPlan[] => {
  return [
    {
      id: 'Starter',
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'Perfect for small gyms',
      features: [
        'Up to 500 members',
        '1 location',
        'Basic reporting',
        'Email support',
      ],
    },
    {
      id: 'Professional',
      name: 'Professional',
      price: '$699',
      period: '/month',
      description: 'Most popular choice',
      features: [
        'Up to 2000 members',
        'Up to 5 locations',
        'Advanced reporting',
        'Priority support',
        'Custom branding',
      ],
      badge: 'Popular',
    },
    {
      id: 'Enterprise',
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large networks',
      features: [
        'Unlimited members',
        'Unlimited locations',
        'Custom integrations',
        '24/7 dedicated support',
        'Advanced analytics',
        'White-label options',
      ],
    },
  ];
};

export const calculateOnboardingProgress = (
  currentStep: number,
  totalSteps: number,
): number => {
  return Math.round((currentStep / totalSteps) * 100);
};

export const getEstimatedTimeRemaining = (
  currentStep: number,
  totalSteps: number,
): string => {
  const remaining = totalSteps - currentStep;
  const minutesPerStep = 2.5;
  const minutes = Math.ceil(remaining * minutesPerStep);
  return `${minutes}-${minutes + 5} minutes`;
};
