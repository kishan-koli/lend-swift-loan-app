'use client';

import React, { useState } from 'react';
import { FormInput } from './form-input';
import { RadioGroup, type RadioOption } from './radio-group';
import { VerificationLoader } from './verification-loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { useStepStore } from '@/lib/store/step-store';
import { validatePANChecksum, validateAadharChecksum } from '@/lib/utils/verhoeff-checksum';
import { CreditCard, FileText } from 'lucide-react';

export const Step3KYC = () => {
  const { kycData, updateKYCData } = useStepStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentTypeOptions: RadioOption[] = [
    {
      value: 'pan',
      label: 'PAN Card',
      description: 'Permanent Account Number for tax identification',
      icon: CreditCard,
    },
    {
      value: 'aadhar',
      label: 'Aadhar Card',
      description: 'Unique identification number issued by UIDAI',
      icon: FileText,
    },
  ];

  const validateDocumentNumber = (docType: string, docNumber: string): boolean => {
    if (docType === 'pan') {
      // PAN format: AAAPL5055K with Verhoeff checksum validation
      return validatePANChecksum(docNumber);
    }
    if (docType === 'aadhar') {
      // Aadhar format: 12 digits with Verhoeff checksum validation
      return validateAadharChecksum(docNumber);
    }
    return false;
  };

  const handleDocumentBlur = async () => {
    if (!kycData.documentType || !kycData.documentNumber) return;

    if (!validateDocumentNumber(kycData.documentType, kycData.documentNumber)) {
      setErrors((prev) => ({
        ...prev,
        documentNumber: `Invalid ${kycData.documentType === 'pan' ? 'PAN' : 'Aadhar'} - Verhoeff checksum failed`,
      }));
      return;
    }

    setIsVerifying(true);
    setErrors({});

    // Simulate 1.5 second verification process
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Simulate verification result (90% success rate)
    const isVerified = Math.random() > 0.1;
    updateKYCData({
      verificationStatus: isVerified ? 'verified' : 'failed',
    });

    setIsVerifying(false);
  };

  const panPlaceholder = 'AAAPL5055K';
  const aadharPlaceholder = '123456789012';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Step 3: KYC Verification</h3>
        <p className="text-sm text-muted-foreground">
          Verify your identity using government-issued documents
        </p>
      </div>

      <RadioGroup
        options={documentTypeOptions}
        value={kycData.documentType || ''}
        onChange={(value) => {
          updateKYCData({ documentType: value as any, documentNumber: '', verificationStatus: 'pending' });
          setIsVerifying(false);
          setErrors({});
        }}
        label="Document Type"
        required
      />

      {kycData.documentType && (
        <Card>
          <CardHeader>
            <CardTitle>
              {kycData.documentType === 'pan' ? 'PAN Card Verification' : 'Aadhar Card Verification'}
            </CardTitle>
            <CardDescription>
              Enter your {kycData.documentType === 'pan' ? 'PAN' : 'Aadhar'} number to verify your identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormInput
              label={`${kycData.documentType === 'pan' ? 'PAN' : 'Aadhar'} Number`}
              placeholder={kycData.documentType === 'pan' ? panPlaceholder : aadharPlaceholder}
              value={kycData.documentNumber || ''}
              onChange={(e) => {
                updateKYCData({ documentNumber: e.target.value.toUpperCase() });
              }}
              onBlur={handleDocumentBlur}
              error={errors.documentNumber}
              helperText={
                kycData.documentType === 'pan'
                  ? 'Format: AAAPL5055K (10 characters)'
                  : 'Format: 12-digit number'
              }
              required
            />

            {kycData.documentNumber && (
              <VerificationLoader
                isVerifying={isVerifying}
                verificationStatus={kycData.verificationStatus || 'pending'}
                message={
                  kycData.documentType === 'pan'
                    ? 'Verifying PAN card...'
                    : 'Verifying Aadhar card...'
                }
              />
            )}

            {kycData.verificationStatus === 'verified' && (
              <div className="p-4 bg-accent/5 border border-accent rounded-lg">
                <p className="text-sm font-medium text-accent">
                  Your {kycData.documentType === 'pan' ? 'PAN' : 'Aadhar'} has been verified successfully.
                </p>
              </div>
            )}

            {kycData.verificationStatus === 'failed' && (
              <div className="p-4 bg-destructive/5 border border-destructive rounded-lg">
                <p className="text-sm font-medium text-destructive">
                  Verification failed. Please check your details and try again.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
