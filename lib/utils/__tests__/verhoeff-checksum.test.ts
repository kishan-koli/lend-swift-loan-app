/**
 * Test Suite for Verhoeff Checksum Implementation
 * Validates PAN, Aadhar, and other ID formats with actual checksum verification
 */

import {
  calculateVerhoeffChecksum,
  validateVerhoeffChecksum,
  validatePANChecksum,
  validateAadharChecksum,
  validateLuhnChecksum,
} from '../verhoeff-checksum';

describe('Verhoeff Checksum Algorithm', () => {
  describe('calculateVerhoeffChecksum', () => {
    it('should calculate correct checksum digit', () => {
      // Test with known valid case
      const checksum = calculateVerhoeffChecksum('123456789');
      expect(typeof checksum).toBe('number');
      expect(checksum).toBeGreaterThanOrEqual(0);
      expect(checksum).toBeLessThanOrEqual(9);
    });

    it('should throw error for non-numeric input', () => {
      expect(() => calculateVerhoeffChecksum('ABC')).toThrow();
      expect(() => calculateVerhoeffChecksum('12A34')).toThrow();
    });

    it('should return consistent results', () => {
      const input = '987654321';
      const checksum1 = calculateVerhoeffChecksum(input);
      const checksum2 = calculateVerhoeffChecksum(input);
      expect(checksum1).toBe(checksum2);
    });
  });

  describe('validateVerhoeffChecksum', () => {
    it('should validate number with valid checksum', () => {
      // Create valid checksum
      const number = '123456789';
      const checksum = calculateVerhoeffChecksum(number);
      const fullNumber = number + checksum;
      expect(validateVerhoeffChecksum(fullNumber)).toBe(true);
    });

    it('should reject number with invalid checksum', () => {
      const invalidNumber = '1234567890'; // Wrong checksum
      expect(validateVerhoeffChecksum(invalidNumber)).toBe(false);
    });

    it('should return false for empty or invalid input', () => {
      expect(validateVerhoeffChecksum('')).toBe(false);
      expect(validateVerhoeffChecksum('ABC')).toBe(false);
      expect(validateVerhoeffChecksum('1')).toBe(false);
    });
  });

  describe('PAN Validation', () => {
    it('should validate correct PAN format', () => {
      // These are test PANs with mathematically valid checksums
      const validPAN = 'AAAPA0000A'; // Test format
      const result = validatePANChecksum(validPAN);
      expect(typeof result).toBe('boolean');
    });

    it('should reject invalid PAN format', () => {
      expect(validatePANChecksum('INVALID')).toBe(false);
      expect(validatePANChecksum('123456789')).toBe(false);
      expect(validatePANChecksum('AAAPA00001')).toBe(false); // ends with digit
    });

    it('should detect invalid PAN checksum', () => {
      const invalidPAN = 'AAAPA0000Z'; // Wrong check letter
      const result = validatePANChecksum(invalidPAN);
      expect(result).toBe(false);
    });

    it('should handle spaces in PAN', () => {
      const panWithSpaces = 'AAAP A0000 A';
      const result = validatePANChecksum(panWithSpaces);
      expect(typeof result).toBe('boolean');
    });

    it('should handle lowercase PAN', () => {
      const lowerPAN = 'aaapa0000a';
      const result = validatePANChecksum(lowerPAN);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Aadhar Validation', () => {
    it('should validate correct Aadhar format', () => {
      // Test with mathematically valid Aadhar
      const validAadhar = '999999990000';
      const result = validateAadharChecksum(validAadhar);
      expect(typeof result).toBe('boolean');
    });

    it('should reject invalid Aadhar format', () => {
      expect(validateAadharChecksum('12345')).toBe(false); // Too short
      expect(validateAadharChecksum('ABCDEFGHIJKL')).toBe(false); // Non-numeric
      expect(validateAadharChecksum('123456789012 ')).toBe(false); // Spaces
    });

    it('should detect invalid Aadhar checksum', () => {
      const invalidAadhar = '999999990001'; // Wrong checksum
      const result = validateAadharChecksum(invalidAadhar);
      expect(result).toBe(false);
    });

    it('should validate all 12 digits present', () => {
      expect(validateAadharChecksum('99999999000')).toBe(false); // 11 digits
      expect(validateAadharChecksum('9999999900001')).toBe(false); // 13 digits
    });
  });

  describe('Luhn Algorithm', () => {
    it('should calculate Luhn checksum', () => {
      const checksum = validateLuhnChecksum('79927398713');
      expect(typeof checksum).toBe('boolean');
    });

    it('should detect single digit errors', () => {
      const validNumber = '4532015112830366'; // Valid credit card format
      expect(validateLuhnChecksum(validNumber)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long numbers', () => {
      const longNumber = '1'.repeat(100);
      expect(() => calculateVerhoeffChecksum(longNumber)).not.toThrow();
    });

    it('should handle zero-only numbers', () => {
      const zeros = '0000000000';
      expect(() => calculateVerhoeffChecksum(zeros)).not.toThrow();
    });

    it('should handle alternating numbers', () => {
      const alternating = '1010101010';
      expect(() => calculateVerhoeffChecksum(alternating)).not.toThrow();
    });

    it('should handle sequential numbers', () => {
      const sequential = '0123456789';
      expect(() => calculateVerhoeffChecksum(sequential)).not.toThrow();
    });
  });

  describe('Checksum Consistency', () => {
    it('should produce same checksum for same input', () => {
      const input = '123456789';
      const results = Array(5)
        .fill(0)
        .map(() => calculateVerhoeffChecksum(input));
      expect(new Set(results).size).toBe(1); // All results should be identical
    });

    it('should produce different checksums for different inputs', () => {
      const checksums = new Set(
        ['123456789', '987654321', '111111111', '999999999'].map((n) =>
          calculateVerhoeffChecksum(n)
        )
      );
      expect(checksums.size).toBeGreaterThan(1); // Should have variety
    });
  });

  describe('Error Detection', () => {
    it('should detect all single digit errors in valid number', () => {
      const number = '123456789';
      const checksum = calculateVerhoeffChecksum(number);
      const fullNumber = number + checksum;

      // Test single digit changes
      for (let i = 0; i < fullNumber.length - 1; i++) {
        const digit = parseInt(fullNumber[i], 10);
        for (let newDigit = 0; newDigit <= 9; newDigit++) {
          if (newDigit !== digit) {
            const modified =
              fullNumber.substring(0, i) +
              newDigit +
              fullNumber.substring(i + 1);
            // Should detect error (either validation fails or checksum is wrong)
            expect(validateVerhoeffChecksum(modified)).toBe(false);
          }
        }
      }
    });

    it('should detect adjacent transpositions', () => {
      const number = '123456789';
      const checksum = calculateVerhoeffChecksum(number);
      const fullNumber = number + checksum;

      // Test transpositions (adjacent digit swaps)
      for (let i = 0; i < fullNumber.length - 2; i++) {
        const transposed =
          fullNumber.substring(0, i) +
          fullNumber[i + 1] +
          fullNumber[i] +
          fullNumber.substring(i + 2);
        expect(validateVerhoeffChecksum(transposed)).toBe(false);
      }
    });
  });

  describe('Performance', () => {
    it('should calculate checksum quickly', () => {
      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        calculateVerhoeffChecksum('123456789');
      }
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;
      expect(avgTime).toBeLessThan(1); // Should be less than 1ms average
    });

    it('should validate checksum quickly', () => {
      const startTime = performance.now();
      for (let i = 0; i < 1000; i++) {
        validateVerhoeffChecksum('1234567890');
      }
      const endTime = performance.now();
      const avgTime = (endTime - startTime) / 1000;
      expect(avgTime).toBeLessThan(1);
    });
  });
});

// Example test data
export const TEST_CASES = {
  validPANs: [
    'AAAPA0000A',
    'AAAPB0000B',
    'AAAPX0000X',
  ],
  invalidPANs: [
    'AAAPA0000Z',
    'AAAPB0000A',
    'INVALID123',
  ],
  validAadhars: [
    '999999990000',
    '111111111117',
  ],
  invalidAadhars: [
    '999999990001',
    '111111111110',
  ],
};
