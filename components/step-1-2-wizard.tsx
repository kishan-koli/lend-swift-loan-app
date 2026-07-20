'use client';

import React, { useState, useCallback } from 'react';
import { FormInput } from './form-input';
import { Select, type SelectOption } from './select';
import { RadioGroup, type RadioOption } from './radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { useStepStore } from '@/lib/store/step-store';
import { Home, Users, Briefcase, Calendar } from 'lucide-react';

type EmploymentType = 'salaried' | 'self-employed' | 'business-owner';

/**
 * Premium Custom Slider Component
 * With vibrant brand blue fill and smooth interactions
 */
const PremiumSlider = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  suffix = '',
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-foreground tracking-tight">
          {label}
        </label>
        <span className="text-lg font-bold text-primary">
          {value.toLocaleString()} {suffix}
        </span>
      </div>

      <div className="relative">
        <div className="absolute inset-x-0 h-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg top-4" />
        <div
          className="absolute inset-x-0 h-2 bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 rounded-lg top-4 transition-all duration-100"
          style={{ width: `${percentage}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full h-10 bg-transparent rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500 z-10 slider"
          style={{
            WebkitAppearance: 'slider-horizontal',
          }}
        />
      </div>
    </div>
  );
};

// Custom CSS for slider styling
const sliderStyles = `
  input[type="range"].slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #2563eb;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    transition: all 0.2s ease;
  }

  input[type="range"].slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
  }

  input[type="range"].slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    border: 3px solid #2563eb;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
    transition: all 0.2s ease;
  }

  input[type="range"].slider::-moz-range-thumb:hover {
    transform: scale(1.15);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.5);
  }

  .dark input[type="range"].slider::-webkit-slider-thumb {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  }

  .dark input[type="range"].slider::-webkit-slider-thumb:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
  }

  .dark input[type="range"].slider::-moz-range-thumb {
    border-color: #3b82f6;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  }

  .dark input[type="range"].slider::-moz-range-thumb:hover {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.6);
  }
`;

export const Step1and2 = () => {
  const {
    personalInfo,
    loanDetails,
    employmentInfo,
    updatePersonalInfo,
    updateLoanDetails,
    updateEmploymentInfo,
  } = useStepStore();

  const [employmentTab, setEmploymentTab] = useState<EmploymentType>(
    (employmentInfo.employmentType as EmploymentType) || 'salaried'
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    if (!dob) return 0;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirthChange = (value: string) => {
    const age = calculateAge(value);
    if (age < 18) {
      setErrors((prev) => ({ ...prev, dateOfBirth: 'You must be at least 18 years old' }));
    } else if (age > 75) {
      setErrors((prev) => ({ ...prev, dateOfBirth: 'Age cannot exceed 75 years' }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.dateOfBirth;
        return newErrors;
      });
    }
    updatePersonalInfo({ dateOfBirth: value, age });
  };

  const loanTypeOptions: RadioOption[] = [
    {
      value: 'personal',
      label: 'Personal Loan',
      description: 'For personal expenses, travel, and needs',
      icon: Users,
    },
    {
      value: 'home',
      label: 'Home Loan',
      description: 'For purchasing or constructing property',
      icon: Home,
    },
    {
      value: 'business',
      label: 'Business Loan',
      description: 'For business expansion and working capital',
      icon: Briefcase,
    },
  ];

  // Dynamic tenure options based on loan type
  const getTenureOptions = (): SelectOption[] => {
    const baseOptions: SelectOption[] = [
      { value: '6', label: '6 months' },
      { value: '12', label: '1 year' },
      { value: '24', label: '2 years' },
      { value: '36', label: '3 years' },
      { value: '60', label: '5 years' },
    ];

    if (loanDetails.loanType === 'home') {
      return [
        ...baseOptions,
        { value: '120', label: '10 years' },
        { value: '180', label: '15 years' },
        { value: '240', label: '20 years' },
      ];
    }

    if (loanDetails.loanType === 'business') {
      return [
        { value: '12', label: '1 year' },
        { value: '24', label: '2 years' },
        { value: '36', label: '3 years' },
        { value: '60', label: '5 years' },
      ];
    }

    return baseOptions;
  };

  const employmentTabs = [
    { id: 'salaried', label: 'Salaried', icon: Users },
    { id: 'self-employed', label: 'Self-Employed', icon: Briefcase },
    { id: 'business-owner', label: 'Business Owner', icon: Briefcase },
  ];

  return (
    <div className="space-y-8">
      <style>{sliderStyles}</style>

      {/* Step 1: Loan Type & Personal Information */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Step 1: Select Loan Type</h3>
          <p className="text-sm text-muted-foreground mt-1">Choose the type of loan you need</p>
        </div>

        <RadioGroup
          options={loanTypeOptions}
          value={loanDetails.loanType || ''}
          onChange={(value) => updateLoanDetails({ loanType: value as any })}
          label="Loan Type"
          isRequired
        />

        <div className="space-y-4">
          <FormInput
            label="Full Name"
            placeholder="John Doe"
            value={personalInfo.fullName || ''}
            onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
            required
          />

          <FormInput
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            value={personalInfo.email || ''}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            helperText="We'll send loan updates to this email"
            required
          />

          <FormInput
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={personalInfo.phone || ''}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            required
          />

          <FormInput
            label="Date of Birth"
            type="date"
            value={personalInfo.dateOfBirth || ''}
            onChange={(e) => handleDateOfBirthChange(e.target.value)}
            error={errors.dateOfBirth}
            required
          />
        </div>
      </div>

      {/* Step 2: Loan Details - Premium Interactive Section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Step 2: Loan Details</h3>
          <p className="text-sm text-muted-foreground mt-1">Specify your loan amount and tenure</p>
        </div>

        <div className="space-y-6">
          {loanDetails.loanType && (
            <>
              <Select
                label="Loan Tenure"
                options={getTenureOptions()}
                value={String(loanDetails.tenure || '')}
                onChange={(value) => updateLoanDetails({ tenure: parseInt(String(value)) })}
                placeholder="Select tenure"
                required
              />

              {/* Premium Loan Amount Slider */}
              <div className="pt-2">
                <PremiumSlider
                  label="Loan Amount Required"
                  value={loanDetails.amount || 0}
                  onChange={(value) => updateLoanDetails({ amount: value })}
                  min={0}
                  max={
                    loanDetails.loanType === 'personal'
                      ? 2500000
                      : loanDetails.loanType === 'home'
                        ? 10000000
                        : 5000000
                  }
                  step={10000}
                  suffix="₹"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {loanDetails.loanType === 'personal'
                    ? 'Personal loans up to ₹25,00,000'
                    : loanDetails.loanType === 'home'
                      ? 'Home loans up to ₹1,00,00,000'
                      : 'Business loans up to ₹50,00,000'}
                </p>
              </div>

              <FormInput
                label="Loan Purpose"
                placeholder="e.g., Home renovation, Business expansion"
                value={loanDetails.purpose || ''}
                onChange={(e) => updateLoanDetails({ purpose: e.target.value })}
                required
              />

              {/* Premium Micro-widgets: Summary Grid - Sharp Geometric Design */}
              {loanDetails.amount && loanDetails.tenure && (
                <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t-2 border-slate-100 dark:border-slate-700">
                  {/* Monthly EMI - Primary Widget */}
                  <div className="group relative overflow-hidden bg-white dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Monthly EMI
                      </p>
                      <p className="text-3xl font-bold text-primary mt-3">
                        ₹{Math.round((loanDetails.amount / (loanDetails.tenure || 1)) * 1.05).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">per month</p>
                    </div>
                  </div>

                  {/* Interest Rate - Accent Widget */}
                  <div className="group relative overflow-hidden bg-white dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:border-emerald-300 dark:hover:border-emerald-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Interest Rate
                      </p>
                      <p className="text-3xl font-bold text-accent mt-3">
                        {loanDetails.loanType === 'personal'
                          ? '9.5%'
                          : loanDetails.loanType === 'home'
                            ? '7.5%'
                            : '11.5%'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">per annum</p>
                    </div>
                  </div>

                  {/* Total Interest - Neutral Widget */}
                  <div className="group relative overflow-hidden bg-white dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent dark:from-slate-700/20 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Total Interest
                      </p>
                      <p className="text-3xl font-bold text-foreground mt-3">
                        ₹{Math.round(loanDetails.amount * 0.05 * (loanDetails.tenure || 1) / 12).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">over tenure</p>
                    </div>
                  </div>

                  {/* Total Payable - Highlight Widget */}
                  <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/20 rounded-xl p-5 border border-blue-200 dark:border-blue-700 transition-all duration-300 hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 to-transparent dark:from-blue-700/30 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
                        Total Payable
                      </p>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-3">
                        ₹{Math.round(loanDetails.amount * 1.05 * (loanDetails.tenure || 1) / 12).toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600/70 dark:text-blue-300/70 mt-2">complete amount</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Employment Type Selection - Premium Tab UI */}
      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground tracking-tight">Employment Type</h3>
          <p className="text-sm text-muted-foreground mt-1">Select your employment status</p>
        </div>

        {/* Premium Employment Tabs */}
        <div className="flex gap-2 border-b-2 border-slate-100 dark:border-slate-700">
          {employmentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setEmploymentTab(tab.id as EmploymentType)}
              className={`px-4 py-3 font-semibold text-sm transition-all duration-300 flex items-center gap-2 border-b-3 -mb-[2px] ${
                employmentTab === tab.id
                  ? 'text-primary border-b-primary'
                  : 'text-muted-foreground border-b-transparent hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Employment Type Content - Completely Mounted/Unmounted */}
        <div className="transition-all duration-300">
          {employmentTab === 'salaried' && (
            <Card>
              <CardHeader>
                <CardTitle>Salaried Employment</CardTitle>
                <CardDescription>Enter your employment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  label="Company Name"
                  placeholder="ABC Corporation"
                  value={employmentInfo.salaried?.companyName || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'salaried',
                      salaried: { ...employmentInfo.salaried, companyName: e.target.value },
                    })
                  }
                  required
                />
                <FormInput
                  label="Designation"
                  placeholder="Senior Developer"
                  value={employmentInfo.salaried?.designation || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'salaried',
                      salaried: { ...employmentInfo.salaried, designation: e.target.value },
                    })
                  }
                  required
                />
                <Select
                  label="Industry"
                  options={[
                    { value: 'it', label: 'Information Technology' },
                    { value: 'finance', label: 'Finance' },
                    { value: 'healthcare', label: 'Healthcare' },
                    { value: 'manufacturing', label: 'Manufacturing' },
                    { value: 'retail', label: 'Retail' },
                    { value: 'education', label: 'Education' },
                    { value: 'other', label: 'Other' },
                  ]}
                  value={employmentInfo.salaried?.industry || ''}
                  onChange={(value) =>
                    updateEmploymentInfo({
                      employmentType: 'salaried',
                      salaried: { ...employmentInfo.salaried, industry: String(value) },
                    })
                  }
                  placeholder="Select industry"
                  required
                />
                <FormInput
                  label="Years of Employment"
                  placeholder="5"
                  type="number"
                  value={String(employmentInfo.salaried?.employmentDuration || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'salaried',
                      salaried: { ...employmentInfo.salaried, employmentDuration: parseFloat(e.target.value) },
                    })
                  }
                  helperText="Minimum 1 year required"
                  required
                />
                <FormInput
                  label="Monthly Salary"
                  placeholder="₹50,000"
                  type="number"
                  value={String(employmentInfo.salaried?.monthlySalary || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'salaried',
                      salaried: { ...employmentInfo.salaried, monthlySalary: parseFloat(e.target.value) },
                    })
                  }
                  required
                />
              </CardContent>
            </Card>
          )}

          {employmentTab === 'self-employed' && (
            <Card>
              <CardHeader>
                <CardTitle>Self-Employed</CardTitle>
                <CardDescription>Enter your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  label="Business Name"
                  placeholder="My Business"
                  value={employmentInfo.selfEmployed?.businessName || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'self-employed',
                      selfEmployed: { ...employmentInfo.selfEmployed, businessName: e.target.value },
                    })
                  }
                  required
                />
                <FormInput
                  label="Business Type"
                  placeholder="e.g., Consulting, Retail"
                  value={employmentInfo.selfEmployed?.businessType || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'self-employed',
                      selfEmployed: { ...employmentInfo.selfEmployed, businessType: e.target.value },
                    })
                  }
                  required
                />
                <FormInput
                  label="Years in Business"
                  placeholder="3"
                  type="number"
                  value={String(employmentInfo.selfEmployed?.businessDuration || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'self-employed',
                      selfEmployed: { ...employmentInfo.selfEmployed, businessDuration: parseFloat(e.target.value) },
                    })
                  }
                  helperText="Minimum 2 years required"
                  required
                />
                <FormInput
                  label="Annual Income"
                  placeholder="₹10,00,000"
                  type="number"
                  value={String(employmentInfo.selfEmployed?.annualIncome || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'self-employed',
                      selfEmployed: { ...employmentInfo.selfEmployed, annualIncome: parseFloat(e.target.value) },
                    })
                  }
                  required
                />
                <FormInput
                  label="GST Number (Optional)"
                  placeholder="18AABCU9603R1Z0"
                  value={employmentInfo.selfEmployed?.gstNumber || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'self-employed',
                      selfEmployed: { ...employmentInfo.selfEmployed, gstNumber: e.target.value },
                    })
                  }
                />
              </CardContent>
            </Card>
          )}

          {employmentTab === 'business-owner' && (
            <Card>
              <CardHeader>
                <CardTitle>Business Owner</CardTitle>
                <CardDescription>Enter your business details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormInput
                  label="Business Name"
                  placeholder="My Company Ltd."
                  value={employmentInfo.businessOwner?.businessName || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, businessName: e.target.value },
                    })
                  }
                  required
                />
                <FormInput
                  label="Business Type"
                  placeholder="e.g., Manufacturing, Services"
                  value={employmentInfo.businessOwner?.businessType || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, businessType: e.target.value },
                    })
                  }
                  required
                />
                <FormInput
                  label="Years in Business"
                  placeholder="5"
                  type="number"
                  value={String(employmentInfo.businessOwner?.businessDuration || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, businessDuration: parseFloat(e.target.value) },
                    })
                  }
                  helperText="Minimum 3 years required"
                  required
                />
                <FormInput
                  label="Annual Turnover"
                  placeholder="₹50,00,000"
                  type="number"
                  value={String(employmentInfo.businessOwner?.annualTurnover || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, annualTurnover: parseFloat(e.target.value) },
                    })
                  }
                  required
                />
                <FormInput
                  label="Number of Employees"
                  placeholder="10"
                  type="number"
                  value={String(employmentInfo.businessOwner?.numberOfEmployees || '')}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, numberOfEmployees: parseFloat(e.target.value) },
                    })
                  }
                  required
                />
                <FormInput
                  label="GST Number"
                  placeholder="18AABCU9603R1Z0"
                  value={employmentInfo.businessOwner?.gstNumber || ''}
                  onChange={(e) =>
                    updateEmploymentInfo({
                      employmentType: 'business-owner',
                      businessOwner: { ...employmentInfo.businessOwner, gstNumber: e.target.value },
                    })
                  }
                  required
                />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
