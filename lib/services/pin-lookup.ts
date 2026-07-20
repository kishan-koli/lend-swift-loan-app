// Mock PIN code database with city and state mappings
const PIN_DATABASE: Record<string, { city: string; state: string }> = {
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '400002': { city: 'Mumbai', state: 'Maharashtra' },
  '400003': { city: 'Mumbai', state: 'Maharashtra' },
  '400004': { city: 'Mumbai', state: 'Maharashtra' },
  '400005': { city: 'Mumbai', state: 'Maharashtra' },
  '110001': { city: 'Delhi', state: 'Delhi' },
  '110002': { city: 'Delhi', state: 'Delhi' },
  '110003': { city: 'Delhi', state: 'Delhi' },
  '110004': { city: 'Delhi', state: 'Delhi' },
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '560002': { city: 'Bangalore', state: 'Karnataka' },
  '560034': { city: 'Bangalore', state: 'Karnataka' },
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '500002': { city: 'Hyderabad', state: 'Telangana' },
  '500003': { city: 'Hyderabad', state: 'Telangana' },
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '700002': { city: 'Kolkata', state: 'West Bengal' },
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '600002': { city: 'Chennai', state: 'Tamil Nadu' },
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '380002': { city: 'Ahmedabad', state: 'Gujarat' },
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '411002': { city: 'Pune', state: 'Maharashtra' },
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '302002': { city: 'Jaipur', state: 'Rajasthan' },
  '201001': { city: 'Noida', state: 'Uttar Pradesh' },
  '121001': { city: 'Faridabad', state: 'Haryana' },
};

export interface PINLookupResult {
  city: string;
  state: string;
  found: boolean;
}

/**
 * Simulates PIN code lookup with delay
 * Returns city and state based on PIN code
 */
export async function lookupPINCode(pinCode: string): Promise<PINLookupResult> {
  // Simulate API delay of 1.2 seconds
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const result = PIN_DATABASE[pinCode];

  if (result) {
    return {
      city: result.city,
      state: result.state,
      found: true,
    };
  }

  return {
    city: '',
    state: '',
    found: false,
  };
}

/**
 * Validates PIN code format (6 digits)
 */
export function validatePINCode(pinCode: string): boolean {
  return /^\d{6}$/.test(pinCode);
}

/**
 * Get all valid PIN codes for testing
 */
export function getValidPINCodes(): string[] {
  return Object.keys(PIN_DATABASE);
}
