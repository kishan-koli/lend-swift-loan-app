# Multi-Step Wizard - Complete Implementation Guide

## Overview

This document details the complete implementation of the LendSwift multi-step wizard with sophisticated form handling, KYC verification, address lookup, and dynamic employment type switching.

## Architecture

### Zustand Store Enhancement (`lib/store/step-store.ts`)

Extended the existing step store with comprehensive form data management:

```typescript
// New Type Definitions
export type LoanType = 'personal' | 'home' | 'business' | null;
export type EmploymentType = 'salaried' | 'self-employed' | 'business-owner' | null;

// Form Data Interfaces
- PersonalInfo: fullName, email, phone, dateOfBirth, age
- LoanDetails: loanType, amount, tenure, purpose
- KYCData: documentType, documentNumber, verificationStatus
- AddressData: permanent & correspondence addresses with PIN lookup
- EmploymentInfo: polymorphic structure for 3 employment types
- SalariedEmploymentData: company, designation, industry, salary
- SelfEmployedData: business details, GST, income
- BusinessOwnerData: enterprise details, turnover, employees
```

**Store Actions:**
- `updatePersonalInfo()`, `updateLoanDetails()`, `updateKYCData()`, `updateAddressData()`, `updateEmploymentInfo()`
- All data persists to localStorage automatically

### Components

#### Step 1 & 2: Loan Type & Employment Selection

**File:** `components/step-1-2-wizard.tsx` (492 lines)

**Features:**
- Loan type selection with RadioGroup (Personal/Home/Business)
- Personal info collection with age validation (18-75 years)
- Dynamic tenure dropdowns based on loan type:
  - Personal: 6mo-5yr
  - Home: 6mo-20yr
  - Business: 12mo-5yr
- Employment type tabs with complete field mount/unmount:
  - Salaried: Company, designation, industry, salary
  - Self-Employed: Business name, GST, annual income
  - Business Owner: Turnover, employees, GST

**Key Logic:**
```typescript
const handleDateOfBirthChange = (value: string) => {
  const age = calculateAge(value);
  if (age < 18 || age > 75) {
    setErrors(...);
  }
};

// Dynamic tenure based on loan type
const getTenureOptions = (): SelectOption[] => {
  if (loanDetails.loanType === 'home') {
    return [...baseOptions, '10yr', '15yr', '20yr'];
  }
  // ...
};
```

#### Step 3: KYC Verification

**File:** `components/step-3-kyc.tsx` (154 lines)

**Features:**
- Document type selection (PAN/Aadhar)
- Format validation on blur:
  - PAN: `[A-Z]{5}[0-9]{4}[A-Z]` (e.g., AAAPL5055K)
  - Aadhar: 12 digits
- 1.5-second simulated verification loader with pulse animation
- Verified/Failed badge display
- 90% success simulation for better UX

**Verification Flow:**
```typescript
const handleDocumentBlur = async () => {
  setIsVerifying(true);
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const isVerified = Math.random() > 0.1; // 90% success
  updateKYCData({
    verificationStatus: isVerified ? 'verified' : 'failed'
  });
};
```

#### Step 4: Address Information

**File:** `components/step-4-address.tsx` (265 lines)

**Features:**
- PIN code lookup simulation with 1.2-second delay
- Auto-population of City & State based on PIN
- "Same as Permanent Address" checkbox logic
- Separate correspondence address when checkbox unchecked
- Loading spinner during PIN lookup

**PIN Database:**
```typescript
// 30+ PIN codes mapped to cities/states
'400001': { city: 'Mumbai', state: 'Maharashtra' }
'110001': { city: 'Delhi', state: 'Delhi' }
// ... etc
```

**Auto-population Logic:**
```typescript
const handlePermanentPinBlur = async (value: string) => {
  const result = await lookupPINCode(value);
  updateAddressData({
    permanentCity: result.city,
    permanentState: result.state
  });
  
  if (addressData.sameAsPerminent) {
    // Auto-populate correspondence
    updateAddressData({
      correspondencePinCode: value,
      correspondenceCity: result.city,
      correspondenceState: result.state,
      correspondenceAddress: addressData.permanentAddress
    });
  }
};
```

#### Step 5: Employment Details

**File:** `components/step-5-employment.tsx` (349 lines)

**Critical Feature: Complete Mount/Unmount of Field Sets**

When switching tabs, the component completely unmounts the previous employment type's card and mounts the new one:

```typescript
// Salaried Employment - Completely Mounted/Unmounted
{activeTab === 'salaried' && (
  <Card className="animate-in fade-in duration-300">
    {/* All salaried fields here */}
  </Card>
)}

// Self-Employed - Completely Mounted/Unmounted
{activeTab === 'self-employed' && (
  <Card className="animate-in fade-in duration-300">
    {/* All self-employed fields here */}
  </Card>
)}

// Business Owner - Completely Mounted/Unmounted
{activeTab === 'business-owner' && (
  <Card className="animate-in fade-in duration-300">
    {/* All business owner fields here */}
  </Card>
)}
```

**Why Complete Mount/Unmount?**
1. Prevents field state bleeding between tabs
2. Clean validation per employment type
3. Smooth fade-in animations
4. Better performance (no hidden fields)
5. Clear separation of concerns

### Utility Services

#### PIN Code Lookup Service (`lib/services/pin-lookup.ts`)

```typescript
export async function lookupPINCode(pinCode: string): Promise<PINLookupResult> {
  // Simulates 1.2-second API delay
  await new Promise((resolve) => setTimeout(resolve, 1200));
  
  return {
    city: result.city,
    state: result.state,
    found: !!result
  };
}

export function validatePINCode(pinCode: string): boolean {
  return /^\d{6}$/.test(pinCode); // 6-digit validation
}
```

#### Verification Loader Component (`components/verification-loader.tsx`)

Premium UI with:
- Pulse animation (1.5-second cycle)
- Spinning border animation
- Beautiful verified/failed badge
- Green accent for success, red for failure
- Smooth opacity transitions

```typescript
{isVerifying ? (
  // Pulse loading with rotating border
) : (
  // Verified/Failed badge with icon
)}
```

## Workflow

### Step 1-2: Loan Selection & Employment Type

1. User selects loan type (Personal/Home/Business)
2. Fills personal information with age validation
3. Selects employment type (Salaried/Self-Employed/Business Owner)
4. Completely different form fields mount based on selection
5. All data saved to Zustand store & localStorage

### Step 3: KYC Verification

1. Choose document type (PAN/Aadhar)
2. Enter document number
3. On blur, format validation occurs
4. 1.5-second verification animation
5. Shows verified or failed status
6. Verified badge appears on success

### Step 4: Address

1. Enter permanent PIN code
2. System queries lookup service (1.2-second delay)
3. City & State auto-populate
4. User fills full address
5. Option to use same for correspondence
6. If checked, correspondence auto-populates
7. If unchecked, separate form appears for correspondence

### Step 5: Employment

1. Select employment type tab
2. Previous employment card completely unmounts
3. New employment card mounts with fade animation
4. All fields are fresh (no state from previous tab)
5. Fill employment-specific details

## Key Implementation Details

### Type-Based Rule Logic (Steps 1-2)

**Age Validation:**
```typescript
if (age < 18) setErrors('You must be at least 18 years old');
if (age > 75) setErrors('Age cannot exceed 75 years');
```

**Dynamic Tenure by Loan Type:**
```typescript
Personal: [6mo, 12mo, 24mo, 36mo, 60mo]
Home: [..., 120mo, 180mo, 240mo]
Business: [12mo, 24mo, 36mo, 60mo]
```

**Employment Tab Switching (Complete Mount/Unmount):**
```typescript
{activeTab === 'salaried' && <SalariedCard />}
{activeTab === 'self-employed' && <SelfEmployedCard />}
{activeTab === 'business-owner' && <BusinessOwnerCard />}
```

### KYC Verification with Loader

**Format Validation:**
- PAN: `AAAPL5055K` format
- Aadhar: 12-digit number

**Loader Sequence:**
1. User blurs input
2. 1.5-second pulse spinner shows
3. Verification badge appears
4. Success (90%) or Failure (10%) displayed

### PIN Lookup Simulation

**Database:** 30+ PIN codes covering major Indian cities

**Lookup Sequence:**
1. User enters PIN code
2. On blur, validation checks 6 digits
3. 1.2-second simulated API delay
4. City & State auto-populate if found
5. Loader spinner visible during delay

**Same Address Logic:**
```typescript
if (sameAsPerminent) {
  // Auto-populate all correspondence fields
  correspondencePinCode = permanentPinCode;
  correspondenceCity = permanentCity;
  correspondenceState = permanentState;
  correspondenceAddress = permanentAddress;
}
```

### Employment Type Mounting

**Complete Field Set Mount/Unmount:**

Each employment type has its own complete form:

**Salaried:**
- Company Name
- Designation
- Industry (select)
- Years of Employment
- Monthly Salary

**Self-Employed:**
- Business Name
- Nature of Business
- Years in Business
- Annual Income (ITR)
- GST Number (optional)

**Business Owner:**
- Business Name
- Nature of Business
- Years of Business Operation
- Annual Turnover
- Number of Employees
- GST Number

## Data Persistence

All form data automatically persists to localStorage via Zustand middleware:
- Storage key: `lendswift-wizard-store`
- Survives page refreshes
- Resets when user clicks "Start New Application"

## Testing Checklist

- [x] Loan type selection changes tenure options
- [x] Age validation works (18-75 years)
- [x] Employment tabs completely unmount/mount fields
- [x] Self-Employed tab shows different fields than Salaried
- [x] Business Owner tab shows enterprise-specific fields
- [x] PAN/Aadhar format validation works
- [x] KYC verification loader animates (1.5s)
- [x] Verified badge appears on success
- [x] PIN lookup auto-populates City & State
- [x] "Same as Permanent Address" logic works
- [x] Correspondence form hides when checkbox is checked
- [x] All data persists to localStorage
- [x] Form data flows through Zustand store correctly

## Usage Example

```typescript
import { Step1and2 } from '@/components/step-1-2-wizard';
import { Step3KYC } from '@/components/step-3-kyc';
import { Step4Address } from '@/components/step-4-address';
import { Step5Employment } from '@/components/step-5-employment';
import { useStepStore } from '@/lib/store/step-store';

export function MyWizard() {
  const { currentStep } = useStepStore();

  return (
    <>
      {currentStep === 1 || currentStep === 2 && <Step1and2 />}
      {currentStep === 3 && <Step3KYC />}
      {currentStep === 4 && <Step4Address />}
      {currentStep === 5 && <Step5Employment />}
    </>
  );
}
```

## Files Created/Modified

### New Components
- `components/step-1-2-wizard.tsx` - Combined Steps 1 & 2
- `components/step-3-kyc.tsx` - KYC verification
- `components/step-4-address.tsx` - Address with PIN lookup
- `components/step-5-employment.tsx` - Tabbed employment
- `components/verification-loader.tsx` - Pulse loader & badge
- `lib/services/pin-lookup.ts` - PIN code database & lookup service

### Modified
- `lib/store/step-store.ts` - Extended with form data management
- `app/wizard/page.tsx` - Updated to use new step components

## Performance Considerations

1. **Field Mount/Unmount:** Each tab switch completely remounts fields for clean state
2. **Async Operations:** PIN lookup simulates real API delays (1.2s)
3. **Verification:** KYC verification shows smooth 1.5-second animation
4. **Local Storage:** Zustand middleware handles persistence automatically
5. **Animations:** CSS-based fade-in animations on tab switches

## Future Enhancements

1. Real API integration for PIN code lookup
2. Real KYC verification with document upload
3. GST validation API integration
4. Income verification (ITR/salary slip upload)
5. Address verification API
6. Credit score integration
7. Real-time eligibility checking
