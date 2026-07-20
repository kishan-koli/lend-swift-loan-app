'use client';

import React from 'react';
import { FormInput } from './form-input';
import { Select, type SelectOption } from './select';
import { RadioGroup, type RadioOption } from './radio-group';
import { useStepStore } from '@/lib/store/step-store';
import { Home, Users, Briefcase } from 'lucide-react';

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
      <div className="flex justify-between">
        <label className="font-semibold">{label}</label>
        <span className="font-bold text-primary">
          {value.toLocaleString()} {suffix}
        </span>
      </div>

      <div className="relative">
        <div className="absolute top-4 h-2 w-full rounded bg-slate-200" />

        <div
          className="absolute top-4 h-2 rounded bg-blue-600"
          style={{ width: `${percentage}%` }}
        />

        <input
          type="range"
          className="slider relative z-10 h-10 w-full bg-transparent"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

const sliderStyles = `
.slider::-webkit-slider-thumb{
-webkit-appearance:none;
width:22px;
height:22px;
border-radius:50%;
background:#fff;
border:3px solid #2563eb;
cursor:pointer;
}
.slider::-moz-range-thumb{
width:22px;
height:22px;
border-radius:50%;
background:#fff;
border:3px solid #2563eb;
cursor:pointer;
}
`;

export default function Step1LoanType() {

const {
loanDetails,
updateLoanDetails,
} = useStepStore();

const loanTypeOptions: RadioOption[] = [
    {
      value: 'personal',
      label: 'Personal Loan',
      description: 'For personal expenses, travel and other needs',
      icon: Users,
    },
    {
      value: 'home',
      label: 'Home Loan',
      description: 'Purchase or construct a property',
      icon: Home,
    },
    {
      value: 'business',
      label: 'Business Loan',
      description: 'Business expansion and working capital',
      icon: Briefcase,
    },
  ];

  const getTenureOptions = (): SelectOption[] => {
    if (loanDetails.loanType === 'home') {
      return [
        { value: '60', label: '5 Years' },
        { value: '120', label: '10 Years' },
        { value: '180', label: '15 Years' },
        { value: '240', label: '20 Years' },
      ];
    }

    if (loanDetails.loanType === 'business') {
      return [
        { value: '12', label: '1 Year' },
        { value: '24', label: '2 Years' },
        { value: '36', label: '3 Years' },
        { value: '60', label: '5 Years' },
      ];
    }

    return [
      { value: '6', label: '6 Months' },
      { value: '12', label: '1 Year' },
      { value: '24', label: '2 Years' },
      { value: '36', label: '3 Years' },
      { value: '60', label: '5 Years' },
    ];
  };

  return (
    <>
      <style>{sliderStyles}</style>

      <div className="space-y-6">

        <RadioGroup
          label="Loan Type"
          isRequired
          options={loanTypeOptions}
          value={loanDetails.loanType || ''}
          onChange={(value) =>
            updateLoanDetails({
              loanType: value as any,
            })
          }
        />

        <Select
          label="Loan Tenure"
          placeholder="Select tenure"
          required
          options={getTenureOptions()}
          value={String(loanDetails.tenure || '')}
          onChange={(value) =>
            updateLoanDetails({
              tenure: parseInt(String(value)),
            })
          }
        />

        <PremiumSlider
          label="Loan Amount Required"
          value={loanDetails.amount || 0}
          onChange={(value) =>
            updateLoanDetails({
              amount: value,
            })
          }
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

        <FormInput
          label="Loan Purpose"
          placeholder="Home Renovation / Business Expansion"
          value={loanDetails.purpose || ''}
          onChange={(e) =>
            updateLoanDetails({
              purpose: e.target.value,
            })
          }
          required
        />

        {(loanDetails.amount ?? 0) > 0 && (loanDetails.tenure ?? 1) > 0 && (
          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Monthly EMI
              </p>

              <h3 className="text-2xl font-bold">
                ₹
                {Math.round(
                  ((loanDetails.amount ?? 0) /
                    (loanDetails.tenure ?? 1)) *
                    1.05
                ).toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Interest Rate
              </p>

              <h3 className="text-2xl font-bold text-blue-600">
                {loanDetails.loanType === 'personal'
                  ? '9.5%'
                  : loanDetails.loanType === 'home'
                  ? '7.5%'
                  : '11.5%'}
              </h3>
            </div>

            <div className="rounded-xl border p-4">
              <p className="text-xs text-muted-foreground">
                Total Interest
              </p>

              <h3 className="text-2xl font-bold">
                ₹
                {Math.round(
                  (loanDetails.amount ?? 0) *
                    0.05 *
                    (loanDetails.tenure ?? 1) /
                    12
                ).toLocaleString()}
              </h3>
            </div>

            <div className="rounded-xl border border-blue-300 bg-blue-50 p-4">
              <p className="text-xs text-blue-700">
                Total Payable
              </p>

              <h3 className="text-2xl font-bold text-blue-700">
                ₹
                {Math.round(
                  (loanDetails.amount ?? 0) *
                    1.05 *
                    (loanDetails.tenure ?? 1) /
                    12
                ).toLocaleString()}
              </h3>
            </div>

          </div>
        )}

      </div>
    </>
  );
}