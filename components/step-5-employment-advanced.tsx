/**
 * Step 5: Employment Details - Advanced State Management
 * Features:
 * - Zero-leakage data isolation between employment types
 * - Framer Motion animations for smooth tab transitions
 * - Real-time debug panel showing state isolation
 * - Type-safe discriminated union payloads
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormInput } from './form-input';
import { Select, type SelectOption } from './select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { useEmploymentState, EmploymentStateDebug } from '@/lib/hooks/useEmploymentState';
import { EmploymentType, isSalariedPayload, isSelfEmployedPayload, isBusinessOwnerPayload } from '@/lib/types/employment-types';
import { Users, Briefcase, Building2, ChevronDown } from 'lucide-react';

// ============================================================================
// TAB CONFIGURATION
// ============================================================================
const EMPLOYMENT_TABS = [
  {
    id: 'salaried' as const,
    label: 'Salaried',
    description: 'Employee at a company',
    icon: Users,
  },
  {
    id: 'self-employed' as const,
    label: 'Self-Employed Professional',
    description: 'Independent professional',
    icon: Briefcase,
  },
  {
    id: 'business-owner' as const,
    label: 'Business Owner',
    description: 'Own a business',
    icon: Building2,
  },
];

// ============================================================================
// INDUSTRY AND BUSINESS TYPE OPTIONS
// ============================================================================
const INDUSTRY_OPTIONS: SelectOption[] = [
  { value: 'it', label: 'Information Technology' },
  { value: 'finance', label: 'Finance & Banking' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'retail', label: 'Retail & E-Commerce' },
  { value: 'education', label: 'Education' },
  { value: 'construction', label: 'Construction' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'other', label: 'Other' },
];

const BUSINESS_TYPE_OPTIONS: SelectOption[] = [
  { value: 'sole_proprietor', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'llp', label: 'Limited Liability Partnership (LLP)' },
  { value: 'pvt_ltd', label: 'Private Limited Company' },
  { value: 'other', label: 'Other' },
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// ============================================================================
// DEBUG PANEL COMPONENT
// ============================================================================
interface DebugPanelProps {
  debug: EmploymentStateDebug;
  isExpanded: boolean;
  onToggle: () => void;
}

const DebugPanel: React.FC<DebugPanelProps> = ({ debug, isExpanded, onToggle }) => {
  return (
    <div className="mt-6 border-t border-border pt-4">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
      >
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
        Debug: State Isolation Visualization
      </button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-background border border-border rounded-lg p-4 space-y-3"
        >
          {/* Employment Type Info */}
          <div className="bg-primary/5 border border-primary/20 rounded p-3">
            <div className="text-xs font-semibold text-primary mb-2">ACTIVE EMPLOYMENT TYPE</div>
            <div className="font-mono text-sm bg-black/5 p-2 rounded">
              {debug.currentType || 'None'}
            </div>
          </div>

          {/* Field Count Summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-accent/5 border border-accent/20 rounded p-3">
              <div className="text-xs font-semibold text-accent mb-1">Total Fields in State</div>
              <div className="text-lg font-bold text-accent">{debug.totalFieldsInState}</div>
            </div>
            <div className="bg-green-500/5 border border-green-500/20 rounded p-3">
              <div className="text-xs font-semibold text-green-700 mb-1">Active Fields</div>
              <div className="text-lg font-bold text-green-700">{debug.activeFieldsCount}</div>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded p-3">
              <div className="text-xs font-semibold text-red-700 mb-1">Wiped Fields</div>
              <div className="text-lg font-bold text-red-700">{debug.inactiveFieldsCount}</div>
            </div>
          </div>

          {/* Inactive Fields (Zero Leakage) */}
          {debug.inactiveFieldsCount > 0 && (
            <div className="bg-orange-500/5 border border-orange-500/20 rounded p-3">
              <div className="text-xs font-semibold text-orange-700 mb-2">FIELDS REMOVED FROM STATE (ZERO LEAKAGE)</div>
              <div className="flex flex-wrap gap-2">
                {debug.inactiveFields.map((field) => (
                  <span
                    key={field}
                    className="text-xs bg-orange-500/20 text-orange-700 px-2 py-1 rounded font-mono"
                  >
                    ✕ {field}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Clean Payload */}
          <div className="bg-accent/10 border border-accent/30 rounded p-3">
            <div className="text-xs font-semibold text-accent mb-2">FINAL CLEAN PAYLOAD (Zero Leakage)</div>
            <pre className="font-mono text-xs bg-black/5 p-2 rounded overflow-auto max-h-40">
              {JSON.stringify(debug.cleanPayload, null, 2)}
            </pre>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-muted-foreground text-right">
            Updated at {new Date(debug.timestamp).toLocaleTimeString()}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// ============================================================================
// SALARIED EMPLOYMENT FORM
// ============================================================================
interface SalariedFormProps {
  state: ReturnType<typeof useEmploymentState>['state'];
  updateField: ReturnType<typeof useEmploymentState>['updateField'];
}

const SalariedEmploymentForm: React.FC<SalariedFormProps> = ({ state, updateField }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    key="salaried-form"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Salaried Employment Details
        </CardTitle>
        <CardDescription>Provide your employment information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          label="Company Name"
          placeholder="TechCorp India Pvt Ltd"
          value={state.salariedCompanyName}
          onChange={(e) => updateField('salariedCompanyName', e.target.value)}
          required
        />

        <FormInput
          label="Designation / Job Title"
          placeholder="Senior Software Engineer"
          value={state.salariedDesignation}
          onChange={(e) => updateField('salariedDesignation', e.target.value)}
          helperText="Your current position at the company"
          required
        />

        <Select
          label="Industry"
          options={INDUSTRY_OPTIONS}
          value={state.salariedIndustry}
          onChange={(value) => updateField('salariedIndustry', value)}
          required
        />

        <FormInput
          label="Years of Employment"
          placeholder="5"
          type="number"
          value={state.salariedEmploymentDuration.toString()}
          onChange={(e) => updateField('salariedEmploymentDuration', parseInt(e.target.value) || 0)}
          helperText="Total years in current job"
          required
        />

        <FormInput
          label="Monthly Salary"
          placeholder="₹150,000"
          value={state.salariedMonthlySalary.toString()}
          onChange={(e) => updateField('salariedMonthlySalary', parseInt(e.target.value) || 0)}
          helperText="Your current monthly gross salary"
          required
        />
      </CardContent>
    </Card>
  </motion.div>
);

// ============================================================================
// SELF-EMPLOYED PROFESSIONAL FORM
// ============================================================================
interface SelfEmployedFormProps {
  state: ReturnType<typeof useEmploymentState>['state'];
  updateField: ReturnType<typeof useEmploymentState>['updateField'];
}

const SelfEmployedProfessionalForm: React.FC<SelfEmployedFormProps> = ({ state, updateField }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    key="self-employed-form"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-primary" />
          Self-Employed Professional Details
        </CardTitle>
        <CardDescription>Provide your business information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          label="Business Name"
          placeholder="My Consulting Services"
          value={state.selfEmployedBusinessName}
          onChange={(e) => updateField('selfEmployedBusinessName', e.target.value)}
          required
        />

        <Select
          label="Business Type"
          options={BUSINESS_TYPE_OPTIONS}
          value={state.selfEmployedBusinessType}
          onChange={(value) => updateField('selfEmployedBusinessType', value)}
          required
        />

        <FormInput
          label="Years in Business"
          placeholder="3"
          type="number"
          value={state.selfEmployedBusinessDuration.toString()}
          onChange={(e) => updateField('selfEmployedBusinessDuration', parseInt(e.target.value) || 0)}
          helperText="Total years in business"
          required
        />

        <FormInput
          label="Annual Income"
          placeholder="₹30,00,000"
          value={state.selfEmployedAnnualIncome.toString()}
          onChange={(e) => updateField('selfEmployedAnnualIncome', parseInt(e.target.value) || 0)}
          helperText="Your average annual income"
          required
        />

        <FormInput
          label="GST Number (Optional)"
          placeholder="22AABCA1234H1Z0"
          value={state.selfEmployedGstNumber}
          onChange={(e) => updateField('selfEmployedGstNumber', e.target.value)}
          helperText="GST Registration Number if applicable"
        />
      </CardContent>
    </Card>
  </motion.div>
);

// ============================================================================
// BUSINESS OWNER FORM
// ============================================================================
interface BusinessOwnerFormProps {
  state: ReturnType<typeof useEmploymentState>['state'];
  updateField: ReturnType<typeof useEmploymentState>['updateField'];
}

const BusinessOwnerForm: React.FC<BusinessOwnerFormProps> = ({ state, updateField }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    key="business-owner-form"
  >
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Business Owner Details
        </CardTitle>
        <CardDescription>Provide your business ownership information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormInput
          label="Business Name"
          placeholder="TechCorp Industries Ltd"
          value={state.businessOwnerBusinessName}
          onChange={(e) => updateField('businessOwnerBusinessName', e.target.value)}
          required
        />

        <Select
          label="Business Type"
          options={BUSINESS_TYPE_OPTIONS}
          value={state.businessOwnerBusinessType}
          onChange={(value) => updateField('businessOwnerBusinessType', value)}
          required
        />

        <FormInput
          label="Years in Business"
          placeholder="7"
          type="number"
          value={state.businessOwnerBusinessDuration.toString()}
          onChange={(e) => updateField('businessOwnerBusinessDuration', parseInt(e.target.value) || 0)}
          helperText="How long you've owned this business"
          required
        />

        <FormInput
          label="Annual Turnover"
          placeholder="₹5,00,00,000"
          value={state.businessOwnerAnnualTurnover.toString()}
          onChange={(e) => updateField('businessOwnerAnnualTurnover', parseInt(e.target.value) || 0)}
          helperText="Average annual business turnover"
          required
        />

        <FormInput
          label="Number of Employees"
          placeholder="25"
          type="number"
          value={state.businessOwnerNumberOfEmployees.toString()}
          onChange={(e) => updateField('businessOwnerNumberOfEmployees', parseInt(e.target.value) || 0)}
          helperText="Total employees in your business"
          required
        />

        <FormInput
          label="GST Number (Optional)"
          placeholder="22AABCA1234H1Z0"
          value={state.businessOwnerGstNumber}
          onChange={(e) => updateField('businessOwnerGstNumber', e.target.value)}
          helperText="GST Registration Number if applicable"
        />
      </CardContent>
    </Card>
  </motion.div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export const Step5EmploymentAdvanced = () => {
  const employment = useEmploymentState();
  const [debugExpanded, setDebugExpanded] = useState(false);
  const debug = employment.getDebugSnapshot();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Step 5: Employment Details</h3>
        <p className="text-sm text-muted-foreground">
          Select your employment type and provide relevant details. All other fields are automatically removed from the form state.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-2">
        {EMPLOYMENT_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => employment.switchEmploymentType(tab.id)}
            className={`px-4 py-3 font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap rounded-t-lg border-b-2 ${
              employment.activeType === tab.id
                ? 'text-primary border-b-primary bg-primary/5'
                : 'text-muted-foreground hover:text-foreground border-b-transparent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <div className="flex flex-col items-start">
              <span>{tab.label}</span>
              <span className="text-xs font-normal opacity-75">{tab.description}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Form Content with Animations */}
      <AnimatePresence mode="wait">
        {employment.activeType === 'salaried' && (
          <SalariedEmploymentForm
            state={employment.state}
            updateField={employment.updateField}
          />
        )}
        {employment.activeType === 'self-employed' && (
          <SelfEmployedProfessionalForm
            state={employment.state}
            updateField={employment.updateField}
          />
        )}
        {employment.activeType === 'business-owner' && (
          <BusinessOwnerForm state={employment.state} updateField={employment.updateField} />
        )}
      </AnimatePresence>

      {/* Debug Panel - Zero Leakage Visualization */}
      <DebugPanel
        debug={debug}
        isExpanded={debugExpanded}
        onToggle={() => setDebugExpanded(!debugExpanded)}
      />
    </div>
  );
};
