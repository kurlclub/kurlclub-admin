/**
 * Centralized type definitions for the onboarding feature
 * Single source of truth for all TypeScript interfaces
 */

export type SubscriptionTier = 'Starter' | 'Professional' | 'Enterprise';
export type ClientStatus = 'In Progress' | 'Pending Activation' | 'Completed';

export interface OnboardingClient {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  status: ClientStatus;
  step: number;
  totalSteps: number;
  createdAt: string;
  subscriptionTier: SubscriptionTier;
  subGyms: number;
  contactNumber: string;
  tempPassword?: string;
  username?: string;
}

export interface ClientInfoData {
  gymName: string;
  ownerName: string;
  email: string;
  phone: string;
  address: string;
  country: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AccountCreationData {
  username: string;
  tempPassword: string;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
}

export interface SubGym {
  id: number | string;
  name: string;
  city: string;
  country: string;
}

export interface SubGymData {
  subGyms: SubGym[];
}

export interface OnboardingFormData {
  clientInfo: ClientInfoData;
  accountCreation: AccountCreationData;
  subscription: SubscriptionData;
  subGyms: SubGymData;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface OnboardingContextType {
  formData: OnboardingFormData;
  currentStep: number;
  completedSteps: number[];
  selectedTier: SubscriptionTier;
  errors: ValidationError[];
  setFormData: (data: OnboardingFormData) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  setSelectedTier: (tier: SubscriptionTier) => void;
  setErrors: (errors: ValidationError[]) => void;
  resetForm: () => void;
}

export interface OnboardingModuleProps {
  onResumeClient?: (client: OnboardingClient) => void;
}

export interface OnboardingWizardProps {
  onClose: () => void;
}

export interface ContinueOnboardingProps {
  clientId: number;
  clientName: string;
  currentStep: number;
  totalSteps: number;
  subscriptionTier: SubscriptionTier;
  onComplete: () => void;
}

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
}

export interface SubscriptionTierInfo {
  tier: SubscriptionTier;
  price: number;
  maxGyms: number;
  features: string[];
}
