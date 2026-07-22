// Mock PIN code database with city and state mappings
const PIN_DATABASE: Record<string, { city: string; state: string }> = {

  //Maharashtra
  '400001': { city: 'Mumbai', state: 'Maharashtra' },
  '400002': { city: 'Mumbai', state: 'Maharashtra' },
  '400003': { city: 'Mumbai', state: 'Maharashtra' },
  '400004': { city: 'Mumbai', state: 'Maharashtra' },
  '400005': { city: 'Mumbai', state: 'Maharashtra' },

  // Delhi
  '110001': { city: 'Delhi', state: 'Delhi' },
  '110002': { city: 'Delhi', state: 'Delhi' },
  '110003': { city: 'Delhi', state: 'Delhi' },
  '110004': { city: 'Delhi', state: 'Delhi' },
  '110005': { city: 'Delhi', state: 'Delhi' },
  '110006': { city: 'Delhi', state: 'Delhi' },
  '110007': { city: 'Delhi', state: 'Delhi' },
  '110008': { city: 'Delhi', state: 'Delhi' },
  '110009': { city: 'Delhi', state: 'Delhi' },
  '110010': { city: 'Delhi', state: 'Delhi' },

  // Noida
  '201301': { city: 'Noida', state: 'Uttar Pradesh' },
  '201303': { city: 'Noida', state: 'Uttar Pradesh' },
  '201304': { city: 'Noida', state: 'Uttar Pradesh' },
  '201305': { city: 'Noida', state: 'Uttar Pradesh' },

  // Greater Noida
  '201306': { city: 'Greater Noida', state: 'Uttar Pradesh' },
  '201308': { city: 'Greater Noida', state: 'Uttar Pradesh' },
  '201310': { city: 'Greater Noida', state: 'Uttar Pradesh' },

  // Ghaziabad
  '201001': { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  '201002': { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  '201003': { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  '201005': { city: 'Ghaziabad', state: 'Uttar Pradesh' },

  // Gurugram
  '122001': { city: 'Gurugram', state: 'Haryana' },
  '122002': { city: 'Gurugram', state: 'Haryana' },
  '122003': { city: 'Gurugram', state: 'Haryana' },
  '122004': { city: 'Gurugram', state: 'Haryana' },
  '122018': { city: 'Gurugram', state: 'Haryana' },

  //  Faridabad
  '121001': { city: 'Faridabad', state: 'Haryana' },
  '121002': { city: 'Faridabad', state: 'Haryana' },
  '121003': { city: 'Faridabad', state: 'Haryana' },

  // Sonipat
  '131001': { city: 'Sonipat', state: 'Haryana' },
  '131021': { city: 'Sonipat', state: 'Haryana' },

  // Meerut
  '250001': { city: 'Meerut', state: 'Uttar Pradesh' },
  '250002': { city: 'Meerut', state: 'Uttar Pradesh' },

  // Bangalore
  '560001': { city: 'Bangalore', state: 'Karnataka' },
  '560002': { city: 'Bangalore', state: 'Karnataka' },
  '560034': { city: 'Bangalore', state: 'Karnataka' },

  // Hydrabad
  '500001': { city: 'Hyderabad', state: 'Telangana' },
  '500002': { city: 'Hyderabad', state: 'Telangana' },
  '500003': { city: 'Hyderabad', state: 'Telangana' },

  // Kolkata
  '700001': { city: 'Kolkata', state: 'West Bengal' },
  '700002': { city: 'Kolkata', state: 'West Bengal' },

  // Chennai
  '600001': { city: 'Chennai', state: 'Tamil Nadu' },
  '600002': { city: 'Chennai', state: 'Tamil Nadu' },

  // Ahmedabad
  '380001': { city: 'Ahmedabad', state: 'Gujarat' },
  '380002': { city: 'Ahmedabad', state: 'Gujarat' },

  // Pune
  '411001': { city: 'Pune', state: 'Maharashtra' },
  '411002': { city: 'Pune', state: 'Maharashtra' },

  // Jaipur
  '302001': { city: 'Jaipur', state: 'Rajasthan' },
  '302002': { city: 'Jaipur', state: 'Rajasthan' },
  '302005': { city: 'Jaipur', state: 'Rajasthan' },
  '302006': { city: 'Jaipur', state: 'Rajasthan' },
  '302017': { city: 'Jaipur', state: 'Rajasthan' },
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
