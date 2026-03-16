/**
 * Validation utilities for onboarding forms
 * Centralized validation logic with type-safe error handling
 */
import type {
  AccountSetupData,
  GymDraft,
  LeadDraftData,
  SubscriptionSetupData,
  ValidationError,
} from '../types';

export const validateLeadDraft = (data: LeadDraftData): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.email && !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (!data.contactName?.trim()) {
    errors.push({ field: 'contactName', message: 'Contact name is required' });
  }

  if (!data.phoneNumber?.trim()) {
    errors.push({ field: 'phoneNumber', message: 'Phone number is required' });
  }

  if (!data.leadData.gymName?.trim()) {
    errors.push({ field: 'gymName', message: 'Gym name is required' });
  }

  if (!data.leadData.gymContactNumber?.trim()) {
    errors.push({
      field: 'gymContactNumber',
      message: 'Club contact number is required',
    });
  }

  if (!data.leadData.gymLocation?.trim()) {
    errors.push({ field: 'gymLocation', message: 'Gym location is required' });
  }

  if (!data.leadData.country?.trim()) {
    errors.push({ field: 'country', message: 'Country is required' });
  }

  if (!data.leadData.region?.trim()) {
    errors.push({ field: 'region', message: 'Region is required' });
  }

  return errors;
};

export const validateAccountSetup = (
  data: AccountSetupData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.userName?.trim()) {
    errors.push({ field: 'userName', message: 'Username is required' });
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
  data: SubscriptionSetupData,
): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!data.subscriptionId?.trim()) {
    errors.push({
      field: 'subscriptionId',
      message: 'Subscription ID is required',
    });
  }

  return errors;
};

export const validateGyms = (gyms: GymDraft[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (!gyms || gyms.length === 0) {
    errors.push({
      field: 'gyms',
      message: 'At least one gym location is required',
    });
  }

  gyms.forEach((gym, idx) => {
    if (!gym.gymName?.trim()) {
      errors.push({
        field: `gyms.${idx}.gymName`,
        message: 'Gym name is required',
      });
    }
    if (!gym.gymLocation?.trim()) {
      errors.push({
        field: `gyms.${idx}.gymLocation`,
        message: 'Gym location is required',
      });
    }
    if (!gym.gymContactNumber?.trim()) {
      errors.push({
        field: `gyms.${idx}.gymContactNumber`,
        message: 'Club contact number is required',
      });
    }
    if (!gym.country?.trim()) {
      errors.push({
        field: `gyms.${idx}.country`,
        message: 'Country is required',
      });
    }
    if (!gym.region?.trim()) {
      errors.push({
        field: `gyms.${idx}.region`,
        message: 'Region is required',
      });
    }
  });

  return errors;
};
