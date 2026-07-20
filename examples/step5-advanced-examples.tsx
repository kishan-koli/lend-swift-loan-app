/**
 * Step 5: Advanced State Management Examples
 * Demonstrates various patterns and use cases for employment state management
 * Shows type narrowing, validation, persistence, and zero-leakage patterns
 */

'use client';

import React from 'react';
import { useEmploymentState } from '@/lib/hooks/useEmploymentState';
import { EmploymentDetailsPayload, isSalariedPayload } from '@/lib/types/employment-types';

// ============================================================================
// EXAMPLE 1: Basic Usage with Type Narrowing
// ============================================================================
export function Example1_BasicUsage() {
  const employment = useEmploymentState();

  const handleSubmit = () => {
    const payload = employment.getCleanPayload();

    if (!payload) {
      alert('Please select employment type');
      return;
    }

    if (isSalariedPayload(payload)) {
      console.log('Salaried submission:', {
        company: payload.companyName,
        salary: payload.monthlySalary,
      });
    } else if (payload.type === 'self-employed') {
      console.log('Self-employed submission:', {
        businessName: payload.businessName,
        income: payload.annualIncome,
      });
    } else {
      console.log('Business owner submission:', {
        businessName: payload.businessName,
        turnover: payload.annualTurnover,
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2>Example 1: Basic Usage</h2>
      <button onClick={() => employment.switchEmploymentType('salaried')}>
        Select Salaried
      </button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// ============================================================================
// EXAMPLE 2: Dynamic Form Validation
// ============================================================================
export function Example2_FormValidation() {
  const employment = useEmploymentState();
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateEmployment = () => {
    const newErrors: Record<string, string> = {};
    const activeFields = employment.getActiveFieldsForValidation();

    for (const field of activeFields) {
      const value = (employment.state as any)[field];
      const fieldName = field.replace(/^(salaried|selfEmployed|businessOwner)/, '');

      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = `${fieldName} is required`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="space-y-4">
      <h2>Example 2: Form Validation</h2>
      <button onClick={validateEmployment}>Validate</button>
      {Object.entries(errors).map(([field, error]) => (
        <div key={field} className="text-red-600">
          {error}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// EXAMPLE 3: Conditional Field Rendering
// ============================================================================
export function Example3_ConditionalFields() {
  const employment = useEmploymentState();

  return (
    <div className="space-y-4">
      <h2>Example 3: Conditional Fields Based on Active Type</h2>

      {employment.isFieldRelevant('salariedCompanyName') && (
        <div>
          <label>Company Name</label>
          <input
            type="text"
            value={employment.state.salariedCompanyName}
            onChange={(e) => employment.updateField('salariedCompanyName', e.target.value)}
          />
        </div>
      )}

      {employment.isFieldRelevant('selfEmployedBusinessName') && (
        <div>
          <label>Business Name</label>
          <input
            type="text"
            value={employment.state.selfEmployedBusinessName}
            onChange={(e) =>
              employment.updateField('selfEmployedBusinessName', e.target.value)
            }
          />
        </div>
      )}

      {employment.isFieldRelevant('businessOwnerNumberOfEmployees') && (
        <div>
          <label>Number of Employees</label>
          <input
            type="number"
            value={employment.state.businessOwnerNumberOfEmployees}
            onChange={(e) =>
              employment.updateField('businessOwnerNumberOfEmployees', parseInt(e.target.value))
            }
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// EXAMPLE 4: Multi-Step Form Integration
// ============================================================================
export function Example4_MultiStepForm() {
  const employment = useEmploymentState();
  const [step, setStep] = React.useState<'select' | 'details' | 'review'>('select');

  const handleNext = () => {
    if (step === 'select' && !employment.activeType) {
      alert('Please select employment type');
      return;
    }

    if (step === 'select') {
      setStep('details');
    } else if (step === 'details') {
      setStep('review');
    }
  };

  const handleBack = () => {
    if (step === 'details') {
      setStep('select');
    } else if (step === 'review') {
      setStep('details');
    }
  };

  const handleSubmit = () => {
    const payload = employment.getCleanPayload();
    console.log('Final clean submission:', payload);
  };

  return (
    <div className="space-y-4">
      <h2>Example 4: Multi-Step Form</h2>

      {step === 'select' && (
        <div>
          <p>Step 1: Select Employment Type</p>
          <button onClick={() => employment.switchEmploymentType('salaried')}>
            Salaried
          </button>
          <button onClick={() => employment.switchEmploymentType('self-employed')}>
            Self-Employed
          </button>
          <button onClick={() => employment.switchEmploymentType('business-owner')}>
            Business Owner
          </button>
        </div>
      )}

      {step === 'details' && (
        <div>
          <p>Step 2: Enter Details for {employment.activeType}</p>
          <p>Form fields would go here...</p>
        </div>
      )}

      {step === 'review' && (
        <div>
          <p>Step 3: Review & Confirm</p>
          <pre>{JSON.stringify(employment.getCleanPayload(), null, 2)}</pre>
        </div>
      )}

      <div className="flex gap-2">
        {step !== 'select' && <button onClick={handleBack}>Back</button>}
        {step !== 'review' && <button onClick={handleNext}>Next</button>}
        {step === 'review' && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Advanced Type Narrowing with Exhaustive Checking
// ============================================================================
export function Example5_AdvancedTypeNarrowing() {
  const employment = useEmploymentState();
  const payload = employment.getCleanPayload();

  const getDisplayInfo = (): string => {
    if (!payload) {
      return 'No employment data selected';
    }

    switch (payload.type) {
      case 'salaried':
        return `Employee at ${payload.companyName} earning ₹${payload.monthlySalary}/month`;

      case 'self-employed':
        return `Self-employed ${payload.businessType} with ₹${payload.annualIncome} annual income`;

      case 'business-owner':
        return `Business owner with ₹${payload.annualTurnover} turnover and ${payload.numberOfEmployees} employees`;

      default:
        const exhaustive: never = payload;
        return `Unknown type: ${exhaustive}`;
    }
  };

  return (
    <div className="space-y-4">
      <h2>Example 5: Advanced Type Narrowing</h2>
      <p>{getDisplayInfo()}</p>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
}

// ============================================================================
// EXAMPLE 6: Debug Visualization
// ============================================================================
export function Example6_DebugVisualization() {
  const employment = useEmploymentState();
  const debug = employment.getDebugSnapshot();

  return (
    <div className="space-y-4">
      <h2>Example 6: Real-Time Debug Visualization</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4">
          <div className="text-sm font-semibold">Total Fields in State</div>
          <div className="text-2xl font-bold">{debug.totalFieldsInState}</div>
        </div>

        <div className="border p-4">
          <div className="text-sm font-semibold">Active Fields</div>
          <div className="text-2xl font-bold text-green-600">{debug.activeFieldsCount}</div>
        </div>

        <div className="border p-4">
          <div className="text-sm font-semibold">Wiped Fields (Zero-Leakage)</div>
          <div className="text-2xl font-bold text-red-600">{debug.inactiveFieldsCount}</div>
        </div>
      </div>

      {debug.inactiveFields.length > 0 && (
        <div>
          <div className="text-sm font-semibold mb-2">Fields Removed from State:</div>
          <div className="flex flex-wrap gap-2">
            {debug.inactiveFields.map((field) => (
              <span key={field} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                ✕ {field}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-sm font-semibold mb-2">Clean Payload (What Gets Submitted):</div>
        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40">
          {JSON.stringify(debug.cleanPayload, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ============================================================================
// EXAMPLE 7: Batch Field Updates with Type Switch
// ============================================================================
export function Example7_BatchFieldUpdates() {
  const employment = useEmploymentState();

  const populateSalariedForm = () => {
    employment.switchEmploymentType('salaried');
    employment.updateMultipleFields({
      salariedCompanyName: 'TechCorp India Pvt Ltd',
      salariedDesignation: 'Senior Software Engineer',
      salariedIndustry: 'it',
      salariedEmploymentDuration: 5,
      salariedMonthlySalary: 150000,
    });
  };

  const populateSelfEmployedForm = () => {
    employment.switchEmploymentType('self-employed');
    employment.updateMultipleFields({
      selfEmployedBusinessName: 'My Consulting Services',
      selfEmployedBusinessType: 'sole_proprietor',
      selfEmployedBusinessDuration: 3,
      selfEmployedAnnualIncome: 3000000,
      selfEmployedGstNumber: '22AABCA1234H1Z0',
    });
  };

  return (
    <div className="space-y-4">
      <h2>Example 7: Batch Field Updates</h2>
      <button onClick={populateSalariedForm}>Pre-fill Salaried Form</button>
      <button onClick={populateSelfEmployedForm}>Pre-fill Self-Employed Form</button>
      <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-40">
        {JSON.stringify(employment.getCleanPayload(), null, 2)}
      </pre>
    </div>
  );
}

// ============================================================================
// EXAMPLE 8: State Persistence
// ============================================================================
export function Example8_StatePersistence() {
  const employment = useEmploymentState();
  const [message, setMessage] = React.useState('');

  const saveToLocalStorage = () => {
    localStorage.setItem('employment-state', JSON.stringify(employment.state));
    setMessage('State saved to localStorage');
  };

  const restoreFromLocalStorage = () => {
    const saved = localStorage.getItem('employment-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      employment.updateMultipleFields(parsed);
      setMessage('State restored from localStorage');
    }
  };

  return (
    <div className="space-y-4">
      <h2>Example 8: State Persistence</h2>
      <button onClick={saveToLocalStorage}>Save to localStorage</button>
      <button onClick={restoreFromLocalStorage}>Restore from localStorage</button>
      <button onClick={() => employment.reset()}>Clear All</button>
      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
