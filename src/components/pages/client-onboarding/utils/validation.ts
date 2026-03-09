/**
 * Validation utilities for onboarding forms
 * Centralized validation logic with type-safe error handling
 */
import type {
  AccountCreationData,
  ClientInfoData,
  GymLocation,
  SubscriptionData,
  ValidationError,
} from '../types';

export const validateClientInfo = (data: ClientInfoData): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid owner email is required' });
  }

  if (!data.phoneNumber?.trim()) {
    errors.push({
      field: 'phoneNumber',
      message: 'Owner phone number is required',
    });
  }

  return errors;
};

export const validateAccountCreation = (
  data: AccountCreationData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.userName?.trim()) {
    errors.push({ field: 'userName', message: 'Username is required' });
  } else if (data.userName.length < 3) {
    errors.push({
      field: 'userName',
      message: 'Username must be at least 3 characters',
    });
  }

  if (!data.password?.trim()) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 8) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 8 characters',
    });
  }

  return errors;
};

export const validateSubscription = (
  data: SubscriptionData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.tier) {
    errors.push({ field: 'tier', message: 'Subscription tier is required' });
  }

  if (!data.billingCycle) {
    errors.push({
      field: 'billingCycle',
      message: 'Billing cycle is required',
    });
  }

  return errors;
};

export const validateSubGyms = (
  gyms: GymLocation[],
  maxAllowed: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!gyms || gyms.length === 0) {
    errors.push({
      field: 'gyms',
      message: 'At least one gym location is required',
    });
  }

  if (gyms.length > maxAllowed) {
    errors.push({
      field: 'gyms',
      message: `Maximum ${maxAllowed} locations allowed`,
    });
  }

  gyms.forEach((gym, idx) => {
    if (!gym.GymName?.trim()) {
      errors.push({
        field: `gyms.${idx}.GymName`,
        message: 'Gym name is required',
      });
    }
    if (!gym.Location?.trim()) {
      errors.push({
        field: `gyms.${idx}.Location`,
        message: 'Location is required',
      });
    }
    if (!gym.Email?.trim()) {
      errors.push({
        field: `gyms.${idx}.Email`,
        message: 'Gym email is required',
      });
    }
  });

  return errors;
};

export const validateOnboardingData = (
  clientInfo: ClientInfoData,
  accountCreation: AccountCreationData,
  subscription: SubscriptionData,
  gyms: GymLocation[],
  maxGyms: number,
): ValidationError[] => {
  return [
    ...validateClientInfo(clientInfo),
    ...validateAccountCreation(accountCreation),
    ...validateSubscription(subscription),
    ...validateSubGyms(gyms, maxGyms),
  ];
};
