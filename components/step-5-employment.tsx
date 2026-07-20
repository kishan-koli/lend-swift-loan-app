'use client';

import React, { useState } from 'react';
import { FormInput } from './form-input';
import { Select, type SelectOption } from './select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { useStepStore } from '@/lib/store/step-store';
import { Users, Briefcase } from 'lucide-react';

type EmploymentType = 'salaried' | 'self-employed' | 'business-owner';

export const Step5Employment = () => {
  const { employmentInfo, updateEmploymentInfo } = useStepStore();
  const [activeTab, setActiveTab] = useState<EmploymentType>(
    (employmentInfo.employmentType as EmploymentType) || 'salaried'
  );

  const employmentTabs = [
    { id: 'salaried', label: 'Salaried', icon: Users },
    { id: 'self-employed', label: 'Self-Employed', icon: Briefcase },
    { id: 'business-owner', label: 'Business Owner', icon: Briefcase },
  ];

  const industryOptions: SelectOption[] = [
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

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Step 5: Employment Details</h3>
        <p className="text-sm text-muted-foreground">
          Provide detailed information about your employment or business
        </p>
      </div>

      {/* Employment Type Tabs */}
      <div className="flex gap-2 border-b border-border overflow-x-auto pb-2">
        {employmentTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as EmploymentType)}
            className={`px-4 py-2 font-medium text-sm transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-primary border-b-2 border-primary -mb-2'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Salaried Employment - Completely Mounted/Unmounted */}
      {activeTab === 'salaried' && (
        <Card className="animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Salaried Employment</CardTitle>
            <CardDescription>Complete your employment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Company Name"
              placeholder="ABC Corporation Ltd."
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
              label="Designation / Job Title"
              placeholder="Senior Software Engineer"
              value={employmentInfo.salaried?.designation || ''}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'salaried',
                  salaried: { ...employmentInfo.salaried, designation: e.target.value },
                })
              }
              helperText="Your current position at the company"
              required
            />

            <Select
              label="Industry"
              options={industryOptions}
              value={employmentInfo.salaried?.industry || ''}
              onChange={(value) =>
                updateEmploymentInfo({
                  employmentType: 'salaried',
                  salaried: { ...employmentInfo.salaried, industry: value },
                })
              }
              placeholder="Select your industry"
              required
            />

            <FormInput
              label="Years of Employment"
              placeholder="5"
              type="number"
              min="0"
              step="0.5"
              value={String(employmentInfo.salaried?.employmentDuration || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'salaried',
                  salaried: {
                    ...employmentInfo.salaried,
                    employmentDuration: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="Minimum 1 year required at current company"
              required
            />

            <FormInput
              label="Monthly Salary (Net)"
              placeholder="₹75,000"
              type="number"
              value={String(employmentInfo.salaried?.monthlySalary || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'salaried',
                  salaried: {
                    ...employmentInfo.salaried,
                    monthlySalary: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="Your monthly take-home salary"
              required
            />
          </CardContent>
        </Card>
      )}

      {/* Self-Employed - Completely Mounted/Unmounted */}
      {activeTab === 'self-employed' && (
        <Card className="animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Self-Employed Business</CardTitle>
            <CardDescription>Provide details about your business operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Business Name"
              placeholder="Your Business Name"
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
              label="Nature of Business"
              placeholder="e.g., Consulting, Freelance Services, Trading"
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
              min="0"
              step="0.5"
              value={String(employmentInfo.selfEmployed?.businessDuration || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'self-employed',
                  selfEmployed: {
                    ...employmentInfo.selfEmployed,
                    businessDuration: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="Minimum 2 years of business operation required"
              required
            />

            <FormInput
              label="Annual Income (ITR)"
              placeholder="₹20,00,000"
              type="number"
              value={String(employmentInfo.selfEmployed?.annualIncome || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'self-employed',
                  selfEmployed: {
                    ...employmentInfo.selfEmployed,
                    annualIncome: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="As per last filed Income Tax Return"
              required
            />

            <FormInput
              label="GST Number"
              placeholder="18AABCU9603R1Z0"
              value={employmentInfo.selfEmployed?.gstNumber || ''}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'self-employed',
                  selfEmployed: { ...employmentInfo.selfEmployed, gstNumber: e.target.value },
                })
              }
              helperText="Leave blank if GST not applicable"
            />
          </CardContent>
        </Card>
      )}

      {/* Business Owner - Completely Mounted/Unmounted */}
      {activeTab === 'business-owner' && (
        <Card className="animate-in fade-in duration-300">
          <CardHeader>
            <CardTitle>Business Ownership</CardTitle>
            <CardDescription>Share details about your enterprise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormInput
              label="Business Name"
              placeholder="Your Company Ltd."
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
              label="Nature of Business"
              placeholder="e.g., Manufacturing, Services, Retail"
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
              label="Years of Business Operation"
              placeholder="5"
              type="number"
              min="0"
              step="0.5"
              value={String(employmentInfo.businessOwner?.businessDuration || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'business-owner',
                  businessOwner: {
                    ...employmentInfo.businessOwner,
                    businessDuration: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="Minimum 3 years of operation required"
              required
            />

            <FormInput
              label="Annual Turnover"
              placeholder="₹1,00,00,000"
              type="number"
              value={String(employmentInfo.businessOwner?.annualTurnover || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'business-owner',
                  businessOwner: {
                    ...employmentInfo.businessOwner,
                    annualTurnover: parseFloat(e.target.value) || 0,
                  },
                })
              }
              helperText="As per last fiscal year"
              required
            />

            <FormInput
              label="Number of Employees"
              placeholder="15"
              type="number"
              min="0"
              value={String(employmentInfo.businessOwner?.numberOfEmployees || '')}
              onChange={(e) =>
                updateEmploymentInfo({
                  employmentType: 'business-owner',
                  businessOwner: {
                    ...employmentInfo.businessOwner,
                    numberOfEmployees: parseFloat(e.target.value) || 0,
                  },
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
  );
};
