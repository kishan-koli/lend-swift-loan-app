/**
 * Comprehensive ID Validation Utility for LendSwift
 * Integrates Verhoeff, Luhn, and format-based validation
 */

import {
  validatePANChecksum,
  validateAadharChecksum,
  validateVerhoeffChecksum,
  validateLuhnChecksum,
  calculateVerhoeffChecksum,
  calculateLuhnChecksum,
} from './verhoeff-checksum';

export type IDType = 'pan' | 'aadhar' | 'passport' | 'dl' | 'uidai' | 'auto';

export interface ValidationRule {
  pattern: RegExp;
  minLength: number;
  maxLength: number;
  checksumAlgorithm: 'verhoeff' | 'luhn' | 'none';
  description: string;
}

export interface ValidationResult {
  valid: boolean;
  type: IDType;
  formatted: string;
  checksumValid?: boolean;
  algorithm: string;
  details: {
    formatValid: boolean;
    checksumValid: boolean;
    message: string;
  };
}

/**
 * Validation rules for different ID types
 */
const VALIDATION_RULES: Record<IDType, ValidationRule> = {
  pan: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    minLength: 10,
    maxLength: 10,
    checksumAlgorithm: 'verhoeff',
    description: 'Permanent Account Number (PAN)',
  },
  aadhar: {
    pattern: /^\d{12}$/,
    minLength: 12,
    maxLength: 12,
    checksumAlgorithm: 'verhoeff',
    description: 'Aadhar UID (12 digits)',
  },
  passport: {
    pattern: /^[A-Z]{1}[0-9]{7}$/,
    minLength: 8,
    maxLength: 8,
    checksumAlgorithm: 'none',
    description: 'Passport Number',
  },
  dl: {
    pattern: /^[A-Z]{2}[0-9]{13}$/,
    minLength: 16,
    maxLength: 16,
    checksumAlgorithm: 'none',
    description: 'Driving License Number',
  },
  uidai: {
    pattern: /^\d{4}\s?\d{4}\s?\d{4}$/,
    minLength: 12,
    maxLength: 14, // With spaces
    checksumAlgorithm: 'verhoeff',
    description: 'UIDAI (Aadhar masked format)',
  },
  auto: {
    pattern: /^.+$/,
    minLength: 1,
    maxLength: 50,
    checksumAlgorithm: 'none',
    description: 'Auto-detect ID type',
  },
};

/**
 * Formats ID string by removing spaces and converting to uppercase
 */
export function formatID(id: string): string {
  return id.trim().toUpperCase().replace(/\s/g, '');
}

/**
 * Auto-detects ID type based on format
 */
export function detectIDType(id: string): IDType {
  const formatted = formatID(id);

  // Check PAN format: 5 letters + 4 digits + 1 letter
  if (/^[A-Z]{5}\d{4}[A-Z]$/.test(formatted)) {
    return 'pan';
  }

  // Check Aadhar format: 12 digits
  if (/^\d{12}$/.test(formatted)) {
    return 'aadhar';
  }

  // Check Passport format: 1 letter + 7 digits
  if (/^[A-Z]\d{7}$/.test(formatted)) {
    return 'passport';
  }

  // Check DL format: 2 letters + 13 digits
  if (/^[A-Z]{2}\d{13}$/.test(formatted)) {
    return 'dl';
  }

  // Check UIDAI masked format: 4 digits + 4 digits + 4 digits (with optional spaces)
  if (/^\d{4}[0-9X\s]{5}\d{4}$/.test(formatted)) {
    return 'uidai';
  }

  return 'auto';
}

/**
 * Validates format using the appropriate rule
 */
export function validateFormat(id: string, type: IDType): boolean {
  const formatted = formatID(id);
  const rule = VALIDATION_RULES[type] || VALIDATION_RULES.auto;

  return (
    formatted.length >= rule.minLength &&
    formatted.length <= rule.maxLength &&
    rule.pattern.test(formatted)
  );
}

/**
 * Validates checksum based on ID type
 */
export function validateChecksum(id: string, type: IDType): boolean {
  const formatted = formatID(id);
  const rule = VALIDATION_RULES[type];

  if (!rule || rule.checksumAlgorithm === 'none') {
    return true; // No checksum validation
  }

  try {
    if (type === 'pan') {
      return validatePANChecksum(formatted);
    }
    if (type === 'aadhar' || type === 'uidai') {
      return validateAadharChecksum(formatted);
    }
  } catch (error) {
    console.error('[v0] Checksum validation error:', error);
    return false;
  }

  return true;
}

/**
 * Main validation function
 */
export function validateID(id: string, type: IDType = 'auto'): ValidationResult {
  const formatted = formatID(id);
  let detectedType = type;

  // Auto-detect if needed
  if (type === 'auto') {
    detectedType = detectIDType(formatted);
  }

  // Validate format
  const formatValid = validateFormat(formatted, detectedType);

  if (!formatValid) {
    const rule = VALIDATION_RULES[detectedType];
    return {
      valid: false,
      type: detectedType,
      formatted,
      checksumValid: false,
      algorithm: `Format validation (${rule?.description || 'unknown'})`,
      details: {
        formatValid: false,
        checksumValid: false,
        message: `Invalid ${rule?.description || 'ID'} format`,
      },
    };
  }

  // Validate checksum
  const checksumValid = validateChecksum(formatted, detectedType);
  const rule = VALIDATION_RULES[detectedType];

  return {
    valid: checksumValid,
    type: detectedType,
    formatted,
    checksumValid,
    algorithm: rule?.checksumAlgorithm === 'none' ? 'Format only' : rule?.checksumAlgorithm || 'unknown',
    details: {
      formatValid: true,
      checksumValid,
      message: checksumValid
        ? `Valid ${rule?.description || 'ID'} with ${rule?.checksumAlgorithm === 'none' ? 'format' : rule?.checksumAlgorithm} validation`
        : `Invalid ${rule?.description || 'ID'} - checksum verification failed`,
    },
  };
}

/**
 * Batch validation for multiple IDs
 */
export function batchValidateIDs(
  ids: string[],
  type: IDType = 'auto'
): ValidationResult[] {
  return ids.map((id) => validateID(id, type));
}

/**
 * Get validation info for an ID type
 */
export function getIDInfo(type: IDType): ValidationRule | null {
  return VALIDATION_RULES[type] || null;
}

/**
 * Test data for validation
 */
export const TEST_IDS = {
  validPAN: 'AAAPA0000A',
  invalidPAN: 'AAAPA0000Z',
  validAadhar: '999999990000',
  invalidAadhar: '999999990001',
  validPassport: 'A1234567',
  validDL: 'KA1234567890123',
};
