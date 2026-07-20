'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type StepStatus = 'pending' | 'current' | 'completed';
export type LoanType = 'personal' | 'home' | 'business' | null;
export type EmploymentType = 'salaried' | 'self-employed' | 'business-owner' | null;

export interface Step {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

// Form Data Interfaces
export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
}

export interface LoanDetails {
  loanType: LoanType;
  amount: number;
  tenure: number;
  purpose: string;
}

export interface KYCData {
  documentType: 'pan' | 'aadhar' | null;
  documentNumber: string;
  documentName: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
}

export interface AddressData {
  permanentPinCode: string;
  permanentCity: string;
  permanentState: string;
  permanentAddress: string;
  correspondencePinCode: string;
  correspondenceCity: string;
  correspondenceState: string;
  correspondenceAddress: string;
  sameAsPerminent: boolean;
}

export interface SalariedEmploymentData {
  companyName?: string;
  designation?: string;
  industry?: string;
  employmentDuration?: number;
  monthlySalary?: number;
}

export interface SelfEmployedData {
  businessName?: string;
  businessType?: string;
  businessDuration?: number;
  annualIncome?: number;
  gstNumber?: string;
}

export interface BusinessOwnerData {
  businessName?: string;
  businessType?: string;
  businessDuration?: number;
  annualTurnover?: number;
  numberOfEmployees?: number;
  gstNumber?: string;
}

export interface EmploymentInfo {
  employmentType: EmploymentType;
  salaried: SalariedEmploymentData;
  selfEmployed: SelfEmployedData;
  businessOwner: BusinessOwnerData;
}

interface StepState {
  steps: Step[];
  currentStep: number;
  
  // Form Data
  personalInfo: Partial<PersonalInfo>;
  loanDetails: Partial<LoanDetails>;
  kycData: Partial<KYCData>;
  addressData: Partial<AddressData>;
  employmentInfo: Partial<EmploymentInfo>;
  
  // Actions - Step Navigation
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (stepId: number) => void;
  completeStep: (stepId: number) => void;
  resetWizard: () => void;
  setSteps: (steps: Step[]) => void;
  
  // Actions - Form Data Updates
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void;
  updateLoanDetails: (data: Partial<LoanDetails>) => void;
  updateKYCData: (data: Partial<KYCData>) => void;
  updateAddressData: (data: Partial<AddressData>) => void;
  updateEmploymentInfo: (data: Partial<EmploymentInfo>) => void;
  
  // Getters
  getCurrentStep: () => Step;
  getProgress: () => number;
  isLastStep: () => boolean;
  isFirstStep: () => boolean;
  canProceedToStep: (stepId: number) => boolean;
}

const TOTAL_STEPS = 8;

const initializeSteps = (): Step[] => [
  { id: 1, title: 'Loan Type & Personal Info', description: 'Select loan type and enter your details', status: 'current' },
  { id: 2, title: 'Loan Details', description: 'Amount, tenure, and employment type', status: 'pending' },
  { id: 3, title: 'KYC Verification', description: 'Government ID verification', status: 'pending' },
  { id: 4, title: 'Address Information', description: 'Permanent and correspondence address', status: 'pending' },
  { id: 5, title: 'Employment Details', description: 'Complete employment information', status: 'pending' },
  { id: 6, title: 'Financial Details', description: 'Income and expenses information', status: 'pending' },
  { id: 7, title: 'Review & Confirm', description: 'Verify all your information', status: 'pending' },
  { id: 8, title: 'Application Submitted', description: 'Your application has been sent', status: 'pending' },
];

const initializeFormData = () => ({
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    age: 0,
  },
  loanDetails: {
    loanType: null,
    amount: 0,
    tenure: 12,
    purpose: '',
  },
  kycData: {
    documentType: null,
    documentNumber: '',
    documentName: '',
    verificationStatus: 'pending' as const,
  },
  addressData: {
    permanentPinCode: '',
    permanentCity: '',
    permanentState: '',
    permanentAddress: '',
    correspondencePinCode: '',
    correspondenceCity: '',
    correspondenceState: '',
    correspondenceAddress: '',
    sameAsPerminent: false,
  },
  employmentInfo: {
    employmentType: null,
    salaried: {
      companyName: '',
      designation: '',
      industry: '',
      employmentDuration: 0,
      monthlySalary: 0,
    },
    selfEmployed: {
      businessName: '',
      businessType: '',
      businessDuration: 0,
      annualIncome: 0,
      gstNumber: '',
    },
    businessOwner: {
      businessName: '',
      businessType: '',
      businessDuration: 0,
      annualTurnover: 0,
      numberOfEmployees: 0,
      gstNumber: '',
    },
  },
});

export const useStepStore = create<StepState>()(
  persist(
    (set, get) => ({
      steps: initializeSteps(),
      currentStep: 1,
      ...initializeFormData(),

      nextStep: () => {
        set((state) => {
          const nextStepNum = Math.min(state.currentStep + 1, TOTAL_STEPS);
          if (nextStepNum !== state.currentStep) {
            // Mark current step as completed and move to next
            const updatedSteps: Step[] = state.steps.map((step) => ({
              ...step,
              status:
                step.id === state.currentStep
                  ? 'completed'
                  : step.id === nextStepNum
                    ? 'current'
                    : step.status === 'completed'
                      ? 'completed'
                      : 'pending',
            }));
            return {
              steps: updatedSteps,
              currentStep: nextStepNum,
            };
          }
          return state;
        });
      },

      previousStep: () => {
        set((state) => {
          const prevStepNum = Math.max(state.currentStep - 1, 1);
          if (prevStepNum !== state.currentStep) {
            const updatedSteps = state.steps.map((step) => ({
              ...step,
              status:
                step.id === prevStepNum
                  ? 'current'
                  : step.id === state.currentStep
                    ? 'pending'
                    : step.status,
            }));
            return {
              steps: updatedSteps,
              currentStep: prevStepNum,
            };
          }
          return state;
        });
      },

      goToStep: (stepId: number) => {
        set((state) => {
          if (stepId < 1 || stepId > TOTAL_STEPS || stepId === state.currentStep) {
            return state;
          }

          // Only allow going to completed steps or the next incomplete step
          if (!get().canProceedToStep(stepId)) {
            return state;
          }

          const updatedSteps = state.steps.map((step) => ({
            ...step,
            status:
              step.id === stepId
                ? 'current'
                : step.id < stepId && step.status === 'completed'
                  ? 'completed'
                  : step.id > state.currentStep
                    ? 'pending'
                    : step.status,
          }));

          return {
            steps: updatedSteps,
            currentStep: stepId,
          };
        });
      },

      completeStep: (stepId: number) => {
        set((state) => {
          const updatedSteps: Step[] = state.steps.map((step) =>
            step.id === stepId ? { ...step, status: 'completed' } : step
          );
          return { steps: updatedSteps };
        });
      },

      resetWizard: () => {
        set({
          steps: initializeSteps(),
          currentStep: 1,
          ...initializeFormData(),
        });
      },

      setSteps: (steps: Step[]) => {
        set({ steps });
      },

      updatePersonalInfo: (data) => {
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...data },
        }));
      },

      updateLoanDetails: (data) => {
        set((state) => ({
          loanDetails: { ...state.loanDetails, ...data },
        }));
      },

      updateKYCData: (data) => {
        set((state) => ({
          kycData: { ...state.kycData, ...data },
        }));
      },

      updateAddressData: (data) => {
        set((state) => ({
          addressData: { ...state.addressData, ...data },
        }));
      },

      updateEmploymentInfo: (data) => {
        set((state) => ({
          employmentInfo: { ...state.employmentInfo, ...data },
        }));
      },

      getCurrentStep: () => {
        return get().steps.find((step) => step.id === get().currentStep) || get().steps[0];
      },

      getProgress: () => {
        const completed = get().steps.filter((step) => step.status === 'completed').length;
        return Math.round((completed / TOTAL_STEPS) * 100);
      },

      isLastStep: () => {
        return get().currentStep === TOTAL_STEPS;
      },

      isFirstStep: () => {
        return get().currentStep === 1;
      },

      canProceedToStep: (stepId: number) => {
        const { currentStep, steps } = get();
        if (stepId === currentStep) return true;
        if (stepId < currentStep) return true;
        // Can only proceed to next incomplete step
        return stepId === currentStep + 1 || steps[stepId - 2]?.status === 'completed';
      },
    }),
    {
      name: 'lendswift-wizard-store',
      version: 1,
    }
  )
);
