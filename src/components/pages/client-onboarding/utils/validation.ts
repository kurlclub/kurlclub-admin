/**
 * Validation utilities for onboarding forms
 * Centralized validation logic with type-safe error handling
 */
import type {
  AccountCreationData,
  ClientInfoData,
  SubGym,
  SubscriptionData,
  ValidationError,
} from '../types';

export const validateClientInfo = (data: ClientInfoData): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.gymName?.trim()) {
    errors.push({ field: 'gymName', message: 'Gym name is required' });
  }

  if (!data.ownerName?.trim()) {
    errors.push({ field: 'ownerName', message: 'Owner name is required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!data.phone?.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }

  if (!data.address?.trim()) {
    errors.push({ field: 'address', message: 'Address is required' });
  }

  if (!data.city?.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }

  if (!data.state?.trim()) {
    errors.push({ field: 'state', message: 'State is required' });
  }

  return errors;
};

export const validateAccountCreation = (
  data: AccountCreationData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.username?.trim()) {
    errors.push({ field: 'username', message: 'Username is required' });
  } else if (data.username.length < 3) {
    errors.push({
      field: 'username',
      message: 'Username must be at least 3 characters',
    });
  }

  if (!data.tempPassword?.trim()) {
    errors.push({ field: 'tempPassword', message: 'Password is required' });
  } else if (data.tempPassword.length < 12) {
    errors.push({
      field: 'tempPassword',
      message: 'Password must be at least 12 characters',
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
  subGyms: SubGym[],
  maxAllowed: number,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!subGyms || subGyms.length === 0) {
    errors.push({
      field: 'subGyms',
      message: 'At least one gym location is required',
    });
  }

  if (subGyms.length > maxAllowed) {
    errors.push({
      field: 'subGyms',
      message: `Maximum ${maxAllowed} locations allowed`,
    });
  }

  subGyms.forEach((gym, idx) => {
    if (!gym.name?.trim()) {
      errors.push({
        field: `subGyms.${idx}.name`,
        message: 'Gym name is required',
      });
    }
    if (!gym.city?.trim()) {
      errors.push({
        field: `subGyms.${idx}.city`,
        message: 'City is required',
      });
    }
  });

  return errors;
};

export const validateOnboardingData = (
  clientInfo: ClientInfoData,
  accountCreation: AccountCreationData,
  subscription: SubscriptionData,
  subGyms: SubGym[],
  maxGyms: number,
): ValidationError[] => {
  return [
    ...validateClientInfo(clientInfo),
    ...validateAccountCreation(accountCreation),
    ...validateSubscription(subscription),
    ...validateSubGyms(subGyms, maxGyms),
  ];
};
