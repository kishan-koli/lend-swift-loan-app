'use client';

import React from 'react';
import { WizardLayout, WizardContent } from '@/components/wizard-layout';
import { useStepStore } from '@/lib/store/step-store';
// import { Step1and2 } from '@/components/step-1-2-wizard';
import  Step1LoanType  from '@/components/step-1-loan-type';
import  Step2PersonalDetails from '@/components/step-2-personal-details';
import { Step3KYC } from '@/components/step-3-kyc';
import { Step4Address } from '@/components/step-4-address';
import { Step5Employment } from '@/components/step-5-employment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { useEffect, useState } from "react";

export default function WizardPage() {
  const {
    currentStep,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    completeStep,
    resetWizard,
    loanDetails,
    personalInfo,
    kycData,
    addressData,
    employmentInfo,
  } = useStepStore();

  const handleNext = () => {
    completeStep(currentStep);
    nextStep();
  };

  const handlePrevious = () => {
    previousStep();
  };

  const handleSubmit = () => {
    completeStep(currentStep);
    const applicationData = {
      personalInfo,
      loanDetails,
      kycData: {
        ...kycData,
        verificationStatus: kycData.verificationStatus || 'pending',
      },
      addressData,
      employmentInfo,
    };
    alert(
      `Application submitted successfully!\n\nLoan Type: ${loanDetails.loanType}\nAmount: ₹${loanDetails.amount?.toLocaleString('en-IN')}\n\nFull data logged to console`
    );
    console.log('Application Data:', applicationData);
    resetWizard();
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);
  }, []);

  if (!mounted) {
  return null;
  }

  return (
    <WizardLayout title="LendSwift Loan Application">
      {currentStep === 1 && (
  <WizardContent
    title="Loan Type"
    description="Select your loan type and loan details"
  >
    <Step1LoanType />
  </WizardContent>
)}

{currentStep === 2 && (
  <WizardContent
    title="Personal Information"
    description="Enter your personal details"
  >
    <Step2PersonalDetails />
  </WizardContent>
)}

      {/* Step 3: KYC Verification */}
      {currentStep === 3 && (
        <WizardContent
          title="KYC Verification"
          description="Verify your identity using government-issued documents"
        >
          <Step3KYC />
        </WizardContent>
      )}

      {/* Step 4: Address Information */}
      {currentStep === 4 && (
        <WizardContent
          title="Address Information"
          description="Provide your permanent and correspondence address"
        >
          <Step4Address />
        </WizardContent>
      )}

      {/* Step 5: Employment Details */}
      {currentStep === 5 && (
        <WizardContent
          title="Employment Details"
          description="Complete your employment or business information"
        >
          <Step5Employment />
        </WizardContent>
      )}

      {/* Step 6: Financial Overview */}
      {currentStep === 6 && (
        <WizardContent title="Loan Summary" description="Review your loan details">
          <div className="space-y-6">
            <Card className="bg-primary/5 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  Loan Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Type</p>
                    <p className="font-semibold text-foreground capitalize">{loanDetails.loanType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="font-semibold text-foreground">
                      ₹{loanDetails.amount?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tenure</p>
                    <p className="font-semibold text-foreground">{loanDetails.tenure} months</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Purpose</p>
                    <p className="font-semibold text-foreground">{loanDetails.purpose || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  Applicant Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-semibold text-foreground">{personalInfo.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-semibold text-foreground">{personalInfo.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-semibold text-foreground">{personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-semibold text-foreground">{personalInfo.age} years</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent" />
                  Verification Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">KYC Document Verification</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      kycData.verificationStatus === 'verified'
                        ? 'bg-accent/10 text-accent'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {kycData.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Address Verification</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      addressData.permanentAddress ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {addressData.permanentAddress ? 'Provided' : 'Pending'}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Review Complete</p>
                <p className="text-sm text-blue-700 mt-1">
                  All information has been provided. Click Submit to complete your application.
                </p>
              </div>
            </div>
          </div>
        </WizardContent>
      )}

      {/* Step 7: Review & Confirm */}
      {currentStep === 7 && (
        <WizardContent
          title="Review & Confirm"
          description="Please verify all the information before submission"
        >
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">Almost Done!</h3>
              <p className="text-sm text-green-700">
                Review the summary above and click Submit to send your application for processing.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Application Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ChecklistItem label="Personal Information" completed={!!personalInfo.fullName} />
                <ChecklistItem label="Loan Details" completed={!!loanDetails.loanType} />
                <ChecklistItem label="KYC Verification" completed={kycData.verificationStatus === 'verified'} />
                <ChecklistItem label="Address Information" completed={!!addressData.permanentAddress} />
                <ChecklistItem label="Employment Details" completed={!!employmentInfo.employmentType} />
              </CardContent>
            </Card>
          </div>
        </WizardContent>
      )}

      {/* Step 8: Application Submitted */}
      {currentStep === 8 && (
        <WizardContent title="Application Submitted" description="Your loan application is being processed">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent rounded-lg p-8 text-center">
              <CheckCircle2 className="w-16 h-16 text-accent mx-auto mb-4 animate-bounce" />
              <h3 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground mb-4">
                Your loan application has been successfully submitted. We&apos;ll review it and get back to you shortly.
              </p>
              <p className="text-sm text-accent font-medium">Application ID: #LS-2024-{Math.random().toString(36).substring(7).toUpperCase()}</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>What&apos;s Next?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <StepItem number="1" title="Verification" description="We'll verify your documents and information" />
                <StepItem
                  number="2"
                  title="Credit Assessment"
                  description="Our team will assess your creditworthiness"
                />
                <StepItem number="3" title="Approval" description="You'll receive approval notification via email" />
                <StepItem number="4" title="Disbursement" description="Loan amount will be credited to your account" />
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                A confirmation email has been sent to <span className="font-semibold">{personalInfo.email}</span>
              </p>
            </div>
          </div>
        </WizardContent>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between mt-8 pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep()}
          className="gap-2"
        >
          Previous
        </Button>

        {isLastStep() ? (
        <Button onClick={resetWizard} className="gap-2 bg-accent hover:bg-accent/90">
          <CheckCircle2 className="w-4 h-4" />
            Start New Application
          </Button>
            ) : currentStep === 7 ? (
          <Button onClick={handleSubmit} className="gap-2 bg-green-600 hover:bg-green-700">
          <CheckCircle2 className="w-4 h-4" />
            Submit Application
          </Button>
          ) : (
        <Button onClick={handleNext} className="gap-2">
          Next
        <ArrowRight className="w-4 h-4" />
        </Button>
        )}
      </div>
    </WizardLayout>
  );
}

// Helper Components
interface ChecklistItemProps {
  label: string;
  completed: boolean;
}

function ChecklistItem({ label, completed }: ChecklistItemProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          completed ? 'bg-accent border-accent' : 'border-border'
        }`}
      >
        {completed && <CheckCircle2 className="w-4 h-4 text-white" />}
      </div>
      <span className={completed ? 'text-foreground font-medium' : 'text-muted-foreground'}>{label}</span>
    </div>
  );
}

interface StepItemProps {
  number: string;
  title: string;
  description: string;
}

function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 border border-accent text-accent font-semibold flex-shrink-0">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
