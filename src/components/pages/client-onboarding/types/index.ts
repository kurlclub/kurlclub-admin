/**
 * Centralized type definitions for the onboarding feature
 * Aligned with backend API structure
 */

export type SubscriptionTier = 'Starter' | 'Professional' | 'Enterprise';
export type ClientStatus = 'In Progress' | 'Pending Activation' | 'Completed';

/* ── Gym Interface (Matches GymsJson API) ───────────── */
export interface GymLocation {
  GymName: string;
  Location: string;
  ContactNumber1: string;
  ContactNumber2: string;
  Email: string;
  Status: string;
  SocialLinks: string[];
}

export type SubGym = GymLocation; // Alias for backward compatibility if needed

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

/* ── Wizard Data Models ─────────────────────────────── */

export interface ClientInfoData {
  email: string; // Account Owner Email
  phoneNumber: string; // Account Owner Phone
  profilePhotoFile: File | null;
  profilePhotoPreview?: string;
}

export interface AccountCreationData {
  userName: string;
  password?: string;
}

export interface SubscriptionData {
  tier: SubscriptionTier;
  billingCycle: 'monthly' | 'annual';
  setupFee: string;
  monthlyStudioFee: string;
}

export interface SubGymData {
  gyms: GymLocation[];
}

export interface OnboardingFormData {
  clientInfo: ClientInfoData;
  accountCreation: AccountCreationData;
  subscription: SubscriptionData;
  subGyms: SubGymData;
}

/* ── Interfaces ─────────────────────────────────────── */

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
  isSubmitting: boolean;
  setFormData: (data: OnboardingFormData) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  setSelectedTier: (tier: SubscriptionTier) => void;
  setErrors: (errors: ValidationError[]) => void;
  resetForm: () => void;
  submitForm: () => Promise<boolean>;
}

export interface OnboardingWizardProps {
  onClose: () => void;
  initialClient?: OnboardingClient | null;
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
