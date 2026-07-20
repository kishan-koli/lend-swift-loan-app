/**
 * LendSwift Currency Utilities
 * Indian Rupee (₹) formatting with support for lakhs, crores, etc.
 */

/**
 * Format number to Indian currency format
 * Examples: 1000 -> "₹1,000", 100000 -> "₹1,00,000", 10000000 -> "₹1,00,00,000"
 */
export function formatIndianCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return '₹0';
  if (num === 0) return '₹0';

  const isNegative = num < 0;
  const absNum = Math.abs(num);

  // Split into integer and decimal parts
  const parts = absNum.toString().split('.');
  let integerPart = parts[0];
  const decimalPart = parts[1] || '';

  // Add commas in Indian style: XX,XX,XXX
  // Start from the right, first group of 3, then groups of 2
  let result = '';
  let count = 0;

  for (let i = integerPart.length - 1; i >= 0; i--) {
    if (count === 3 || (count > 3 && (count - 3) % 2 === 0)) {
      result = ',' + result;
    }
    result = integerPart[i] + result;
    count++;
  }

  const formatted = isNegative ? '-₹' + result : '₹' + result;

  if (decimalPart) {
    return formatted + '.' + decimalPart;
  }

  return formatted;
}

/**
 * Parse Indian currency string back to number
 * Examples: "₹1,00,000" -> 100000, "₹1,000" -> 1000
 */
export function parseIndianCurrency(value: string): number {
  if (!value) return 0;

  // Remove currency symbol and all commas
  const cleaned = value.replace(/[₹,\s]/g, '');
  const num = parseFloat(cleaned);

  return isNaN(num) ? 0 : num;
}

/**
 * Format currency for display with abbreviations
 * Examples: 1000000 -> "10L", 10000000 -> "1Cr"
 */
export function formatCurrencyAbbrev(value: number): string {
  const absNum = Math.abs(value);

  if (absNum >= 10000000) {
    return (value / 10000000).toFixed(1).replace(/\.0$/, '') + 'Cr';
  }
  if (absNum >= 100000) {
    return (value / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  }
  if (absNum >= 1000) {
    return (value / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }

  return value.toString();
}

/**
 * Validate if string is a valid currency input
 */
export function isValidCurrencyInput(value: string): boolean {
  // Allow digits, commas, decimal point, and rupee symbol
  const regex = /^[₹\d,.]*$/;
  return regex.test(value);
}
