/**
 * Centralized type definitions for the onboarding feature
 * Aligned with backend API structure
 */

export type OnboardingStatus =
  | 'lead'
  | 'in_progress'
  | 'pending_review'
  | 'on_hold'
  | 'completed'
  | 'cancelled';

export interface LeadData {
  gymName: string;
  gymLocation: string;
  gymContactNumber: string;
  country: string;
  region: string;
}

export interface LeadFormData {
  gymName: string;
  gymLocation: string;
  gymContactNumber: string;
  country: string;
  region: string;
}

export interface OnboardingRecord {
  id: number;
  status: OnboardingStatus;
  email: string;
  contactName: string;
  phoneNumber: string;
  notes: string | null;
  assignedAdminId: number | null;
  completedUserId: number | null;
  portalUsername: string | null;
  data: LeadData | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface OnboardingBoardData {
  lead: OnboardingRecord[];
  inProgress: OnboardingRecord[];
  pendingReview: OnboardingRecord[];
  onHold: OnboardingRecord[];
  completed: OnboardingRecord[];
  cancelled: OnboardingRecord[];
}

/* ── Wizard Data Models ─────────────────────────────── */

export interface LeadDraftData {
  email: string;
  contactName: string;
  phoneNumber: string;
  notes: string;
  assignedAdminId: number | null;
  leadData: LeadFormData;
}

export interface AccountSetupData {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  userPhotoFile: File | null;
  userPhotoPreview: string;
}

export interface SubscriptionSetupData {
  subscriptionId: string;
  subscriptionDate: string;
}

export interface GymDraft {
  gymName: string;
  gymEmail: string;
  gymLocation: string;
  gymContactNumber: string;
  country: string;
  region: string;
  gymPhotoFile: File | null;
  gymPhotoPreview: string;
}

export interface GymSetupData {
  gyms: GymDraft[];
}

export interface OnboardingFormData {
  lead: LeadDraftData;
  account: AccountSetupData;
  subscription: SubscriptionSetupData;
  gyms: GymSetupData;
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
  errors: ValidationError[];
  isSubmitting: boolean;
  isSavingDraft: boolean;
  recordId: number | null;
  recordStatus: OnboardingStatus | null;
  setFormData: (data: OnboardingFormData) => void;
  setCurrentStep: (step: number) => void;
  completeStep: (step: number) => void;
  setErrors: (errors: ValidationError[]) => void;
  resetForm: () => void;
  saveDraft: () => Promise<boolean>;
  submitForm: () => Promise<boolean>;
  registerStepValidator: (
    step: number,
    validator: () => Promise<boolean>,
  ) => () => void;
  validateStep: (step: number) => Promise<boolean>;
}

export interface OnboardingWizardProps {
  onClose: () => void;
  initialClient?: OnboardingRecord | null;
}
