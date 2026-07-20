/**
 * useEmploymentState Hook
 * Advanced state management with zero-leakage data isolation
 * Ensures complete field isolation between employment types
 */

import { useState, useCallback, useEffect } from 'react';
import {
  EmploymentFormState,
  EmploymentType,
  EmploymentDetailsPayload,
  createEmptyFormState,
  resetUnrelatedFields,
  extractCleanPayload,
} from '@/lib/types/employment-types';

export interface EmploymentStateDebug {
  currentType: EmploymentType | null;
  totalFieldsInState: number;
  activeFieldsCount: number;
  inactiveFieldsCount: number;
  inactiveFields: string[];
  cleanPayload: EmploymentDetailsPayload | null;
  timestamp: number;
}

export interface UseEmploymentStateReturn {
  // Form state
  state: EmploymentFormState;
  activeType: EmploymentType | null;

  // Field setters
  updateField: (field: keyof EmploymentFormState, value: any) => void;
  updateMultipleFields: (updates: Partial<EmploymentFormState>) => void;

  // Type switching with automatic field wiping
  switchEmploymentType: (newType: EmploymentType) => void;

  // Clean payload extraction
  getCleanPayload: () => EmploymentDetailsPayload | null;

  // Debug information
  getDebugSnapshot: () => EmploymentStateDebug;

  // Reset everything
  reset: () => void;

  // Validation
  getActiveFieldsForValidation: () => string[];
  isFieldRelevant: (fieldName: string) => boolean;
}

/**
 * Main hook for employment state management
 * Implements strict zero-leakage architecture
 */
export function useEmploymentState(initialState?: Partial<EmploymentFormState>): UseEmploymentStateReturn {
  const [state, setState] = useState<EmploymentFormState>(() => ({
    ...createEmptyFormState(),
    ...initialState,
  }));

  // =========================================================================
  // SINGLE FIELD UPDATE
  // =========================================================================
  const updateField = useCallback((field: keyof EmploymentFormState, value: any) => {
    setState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }, []);

  // =========================================================================
  // MULTIPLE FIELDS UPDATE
  // =========================================================================
  const updateMultipleFields = useCallback((updates: Partial<EmploymentFormState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
    }));
  }, []);

  // =========================================================================
  // EMPLOYMENT TYPE SWITCH WITH ZERO-LEAKAGE
  // =========================================================================
  /**
   * When switching employment types, immediately wipe all unrelated fields
   * This ensures zero leakage - only active fields remain in state
   */
  const switchEmploymentType = useCallback((newType: EmploymentType) => {
    setState((prevState) => {
      // Reset unrelated fields based on new employment type
      const cleanedState = resetUnrelatedFields(prevState, newType);
      console.log('[v0] Employment type switched to:', newType);
      console.log('[v0] State cleaned - inactive fields removed');
      return cleanedState;
    });
  }, []);

  // =========================================================================
  // CLEAN PAYLOAD EXTRACTION
  // =========================================================================
  /**
   * Extract only relevant fields based on employment type
   * This is what gets submitted - guaranteed zero leakage
   */
  const getCleanPayload = useCallback((): EmploymentDetailsPayload | null => {
    return extractCleanPayload(state);
  }, [state]);

  // =========================================================================
  // DETERMINE WHICH FIELDS ARE RELEVANT
  // =========================================================================
  const getActiveFieldsForValidation = useCallback((): string[] => {
    const fields: string[] = [];

    switch (state.employmentType) {
      case 'salaried':
        fields.push(
          'salariedCompanyName',
          'salariedDesignation',
          'salariedIndustry',
          'salariedEmploymentDuration',
          'salariedMonthlySalary'
        );
        break;

      case 'self-employed':
        fields.push(
          'selfEmployedBusinessName',
          'selfEmployedBusinessType',
          'selfEmployedBusinessDuration',
          'selfEmployedAnnualIncome',
          'selfEmployedGstNumber'
        );
        break;

      case 'business-owner':
        fields.push(
          'businessOwnerBusinessName',
          'businessOwnerBusinessType',
          'businessOwnerBusinessDuration',
          'businessOwnerAnnualTurnover',
          'businessOwnerNumberOfEmployees',
          'businessOwnerGstNumber'
        );
        break;
    }

    return fields;
  }, [state.employmentType]);

  // =========================================================================
  // CHECK IF FIELD IS RELEVANT TO CURRENT TYPE
  // =========================================================================
  const isFieldRelevant = useCallback(
    (fieldName: string): boolean => {
      return getActiveFieldsForValidation().includes(fieldName);
    },
    [getActiveFieldsForValidation]
  );

  // =========================================================================
  // DEBUG SNAPSHOT
  // =========================================================================
  /**
   * Returns detailed debug information about current state
   * Shows which fields are active vs inactive
   * Demonstrates zero-leakage by showing removed fields
   */
  const getDebugSnapshot = useCallback((): EmploymentStateDebug => {
    const activeFields = getActiveFieldsForValidation();
    const allStateFields = Object.keys(state).filter((k) => k !== 'employmentType');

    // Calculate inactive fields (fields that exist in state but aren't active)
    const inactiveFields = allStateFields.filter(
      (field) => !activeFields.includes(field) && (state as any)[field] !== ''
    );

    return {
      currentType: state.employmentType,
      totalFieldsInState: allStateFields.length,
      activeFieldsCount: activeFields.length,
      inactiveFieldsCount: inactiveFields.length,
      inactiveFields,
      cleanPayload: getCleanPayload(),
      timestamp: Date.now(),
    };
  }, [state, getActiveFieldsForValidation, getCleanPayload]);

  // =========================================================================
  // RESET EVERYTHING
  // =========================================================================
  const reset = useCallback(() => {
    setState(createEmptyFormState());
  }, []);

  return {
    state,
    activeType: state.employmentType,
    updateField,
    updateMultipleFields,
    switchEmploymentType,
    getCleanPayload,
    getDebugSnapshot,
    reset,
    getActiveFieldsForValidation,
    isFieldRelevant,
  };
}
