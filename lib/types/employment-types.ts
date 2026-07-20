/**
 * Type-Safe Employment Payload Definitions
 * Strict data isolation with discriminated unions
 * Zero-leakage architecture for employment types
 */

// ============================================================================
// SALARIED EMPLOYMENT PAYLOAD
// ============================================================================
export interface SalariedEmploymentPayload {
  type: 'salaried';
  companyName: string;
  designation: string;
  industry: string;
  employmentDuration: number; // years
  monthlySalary: number; // in rupees
}

// ============================================================================
// SELF-EMPLOYED PROFESSIONAL PAYLOAD
// ============================================================================
export interface SelfEmployedPayload {
  type: 'self-employed';
  businessName: string;
  businessType: string;
  businessDuration: number; // years
  annualIncome: number; // in rupees
  gstNumber: string;
}

// ============================================================================
// BUSINESS OWNER PAYLOAD
// ============================================================================
export interface BusinessOwnerPayload {
  type: 'business-owner';
  businessName: string;
  businessType: string;
  businessDuration: number; // years
  annualTurnover: number; // in rupees
  numberOfEmployees: number;
  gstNumber: string;
}

// ============================================================================
// DISCRIMINATED UNION - FINAL PAYLOAD
// ============================================================================
export type EmploymentDetailsPayload =
  | SalariedEmploymentPayload
  | SelfEmployedPayload
  | BusinessOwnerPayload;

// ============================================================================
// EMPLOYMENT TYPE DISCRIMINATOR
// ============================================================================
export type EmploymentType = 'salaried' | 'self-employed' | 'business-owner';

// ============================================================================
// INTERNAL FORM STATE (NO ISOLATION - ALL FIELDS PRESENT)
// ============================================================================
export interface EmploymentFormState {
  employmentType: EmploymentType | null;

  // Salaried fields
  salariedCompanyName: string;
  salariedDesignation: string;
  salariedIndustry: string;
  salariedEmploymentDuration: number;
  salariedMonthlySalary: number;

  // Self-Employed fields
  selfEmployedBusinessName: string;
  selfEmployedBusinessType: string;
  selfEmployedBusinessDuration: number;
  selfEmployedAnnualIncome: number;
  selfEmployedGstNumber: string;

  // Business Owner fields
  businessOwnerBusinessName: string;
  businessOwnerBusinessType: string;
  businessOwnerBusinessDuration: number;
  businessOwnerAnnualTurnover: number;
  businessOwnerNumberOfEmployees: number;
  businessOwnerGstNumber: string;
}

// ============================================================================
// FIELD VALIDATION RULES
// ============================================================================
export interface FieldValidationRules {
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  required?: boolean;
  minValue?: number;
  maxValue?: number;
}

export const EMPLOYMENT_VALIDATION_RULES: Record<string, FieldValidationRules> = {
  // Salaried
  salariedCompanyName: { required: true, minLength: 2, maxLength: 100 },
  salariedDesignation: { required: true, minLength: 2, maxLength: 50 },
  salariedIndustry: { required: true },
  salariedEmploymentDuration: { required: true, minValue: 0, maxValue: 70 },
  salariedMonthlySalary: { required: true, minValue: 10000 },

  // Self-Employed
  selfEmployedBusinessName: { required: true, minLength: 2, maxLength: 100 },
  selfEmployedBusinessType: { required: true },
  selfEmployedBusinessDuration: { required: true, minValue: 0, maxValue: 70 },
  selfEmployedAnnualIncome: { required: true, minValue: 50000 },
  selfEmployedGstNumber: { required: false, pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/ },

  // Business Owner
  businessOwnerBusinessName: { required: true, minLength: 2, maxLength: 100 },
  businessOwnerBusinessType: { required: true },
  businessOwnerBusinessDuration: { required: true, minValue: 0, maxValue: 70 },
  businessOwnerAnnualTurnover: { required: true, minValue: 100000 },
  businessOwnerNumberOfEmployees: { required: true, minValue: 1, maxValue: 10000 },
  businessOwnerGstNumber: { required: false, pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/ },
};

// ============================================================================
// TYPE GUARDS
// ============================================================================
export function isSalariedPayload(payload: EmploymentDetailsPayload): payload is SalariedEmploymentPayload {
  return payload.type === 'salaried';
}

export function isSelfEmployedPayload(payload: EmploymentDetailsPayload): payload is SelfEmployedPayload {
  return payload.type === 'self-employed';
}

export function isBusinessOwnerPayload(payload: EmploymentDetailsPayload): payload is BusinessOwnerPayload {
  return payload.type === 'business-owner';
}

// ============================================================================
// INITIAL STATE FACTORY
// ============================================================================
export function createEmptyFormState(): EmploymentFormState {
  return {
    employmentType: null,
    salariedCompanyName: '',
    salariedDesignation: '',
    salariedIndustry: '',
    salariedEmploymentDuration: 0,
    salariedMonthlySalary: 0,
    selfEmployedBusinessName: '',
    selfEmployedBusinessType: '',
    selfEmployedBusinessDuration: 0,
    selfEmployedAnnualIncome: 0,
    selfEmployedGstNumber: '',
    businessOwnerBusinessName: '',
    businessOwnerBusinessType: '',
    businessOwnerBusinessDuration: 0,
    businessOwnerAnnualTurnover: 0,
    businessOwnerNumberOfEmployees: 0,
    businessOwnerGstNumber: '',
  };
}

// ============================================================================
// PAYLOAD BUILDERS - ZERO LEAKAGE
// ============================================================================
/**
 * Extracts ONLY relevant fields from form state based on employment type
 * All other fields are completely stripped from the payload
 */
export function extractSalariedPayload(state: EmploymentFormState): SalariedEmploymentPayload {
  return {
    type: 'salaried',
    companyName: state.salariedCompanyName,
    designation: state.salariedDesignation,
    industry: state.salariedIndustry,
    employmentDuration: state.salariedEmploymentDuration,
    monthlySalary: state.salariedMonthlySalary,
  };
}

export function extractSelfEmployedPayload(state: EmploymentFormState): SelfEmployedPayload {
  return {
    type: 'self-employed',
    businessName: state.selfEmployedBusinessName,
    businessType: state.selfEmployedBusinessType,
    businessDuration: state.selfEmployedBusinessDuration,
    annualIncome: state.selfEmployedAnnualIncome,
    gstNumber: state.selfEmployedGstNumber,
  };
}

export function extractBusinessOwnerPayload(state: EmploymentFormState): BusinessOwnerPayload {
  return {
    type: 'business-owner',
    businessName: state.businessOwnerBusinessName,
    businessType: state.businessOwnerBusinessType,
    businessDuration: state.businessOwnerBusinessDuration,
    annualTurnover: state.businessOwnerAnnualTurnover,
    numberOfEmployees: state.businessOwnerNumberOfEmployees,
    gstNumber: state.businessOwnerGstNumber,
  };
}

/**
 * Main payload extractor - returns clean, isolated payload
 */
export function extractCleanPayload(state: EmploymentFormState): EmploymentDetailsPayload | null {
  if (!state.employmentType) return null;

  switch (state.employmentType) {
    case 'salaried':
      return extractSalariedPayload(state);
    case 'self-employed':
      return extractSelfEmployedPayload(state);
    case 'business-owner':
      return extractBusinessOwnerPayload(state);
    default:
      return null;
  }
}

// ============================================================================
// STATE RESET FUNCTIONS - ZERO LEAKAGE
// ============================================================================
/**
 * Completely wipes all fields NOT related to active employment type
 * This ensures zero leakage when switching between tabs
 */
export function resetUnrelatedFields(
  state: EmploymentFormState,
  activeType: EmploymentType
): EmploymentFormState {
  const resetState = { ...state, employmentType: activeType };

  switch (activeType) {
    case 'salaried':
      // Keep only salaried fields, wipe others
      return {
        ...resetState,
        selfEmployedBusinessName: '',
        selfEmployedBusinessType: '',
        selfEmployedBusinessDuration: 0,
        selfEmployedAnnualIncome: 0,
        selfEmployedGstNumber: '',
        businessOwnerBusinessName: '',
        businessOwnerBusinessType: '',
        businessOwnerBusinessDuration: 0,
        businessOwnerAnnualTurnover: 0,
        businessOwnerNumberOfEmployees: 0,
        businessOwnerGstNumber: '',
      };

    case 'self-employed':
      // Keep only self-employed fields, wipe others
      return {
        ...resetState,
        salariedCompanyName: '',
        salariedDesignation: '',
        salariedIndustry: '',
        salariedEmploymentDuration: 0,
        salariedMonthlySalary: 0,
        businessOwnerBusinessName: '',
        businessOwnerBusinessType: '',
        businessOwnerBusinessDuration: 0,
        businessOwnerAnnualTurnover: 0,
        businessOwnerNumberOfEmployees: 0,
        businessOwnerGstNumber: '',
      };

    case 'business-owner':
      // Keep only business owner fields, wipe others
      return {
        ...resetState,
        salariedCompanyName: '',
        salariedDesignation: '',
        salariedIndustry: '',
        salariedEmploymentDuration: 0,
        salariedMonthlySalary: 0,
        selfEmployedBusinessName: '',
        selfEmployedBusinessType: '',
        selfEmployedBusinessDuration: 0,
        selfEmployedAnnualIncome: 0,
        selfEmployedGstNumber: '',
      };

    default:
      return resetState;
  }
}
