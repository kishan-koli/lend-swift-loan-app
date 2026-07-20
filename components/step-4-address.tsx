'use client';

import React, { useState } from 'react';
import { FormInput } from './form-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { useStepStore } from '@/lib/store/step-store';
import { lookupPINCode, validatePINCode } from '@/lib/services/pin-lookup';
import { Loader2 } from 'lucide-react';

export const Step4Address = () => {
  const { addressData, updateAddressData } = useStepStore();
  const [pinLookupLoading, setPinLookupLoading] = useState(false);
  const [correspondencePinLoading, setCorrespondencePinLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handlePermanentPinBlur = async (value: string) => {
    if (!value) return;

    if (!validatePINCode(value)) {
      setErrors((prev) => ({ ...prev, permanentPin: 'Invalid PIN code. Use 6 digits.' }));
      return;
    }

    setPinLookupLoading(true);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.permanentPin;
      return newErrors;
    });

    try {
      const result = await lookupPINCode(value);
      if (result.found) {
        updateAddressData({
          permanentPinCode: value,
          permanentCity: result.city,
          permanentState: result.state,
        });

        // If same as permanent is checked, auto-populate correspondence
        if (addressData.sameAsPerminent) {
          updateAddressData({
            correspondencePinCode: value,
            correspondenceCity: result.city,
            correspondenceState: result.state,
            correspondenceAddress: addressData.permanentAddress,
          });
        }
      } else {
        setErrors((prev) => ({
          ...prev,
          permanentPin: 'PIN code not found in our database',
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        permanentPin: 'Error looking up PIN code',
      }));
    } finally {
      setPinLookupLoading(false);
    }
  };

  const handleCorrespondencePinBlur = async (value: string) => {
    if (!value) return;

    if (!validatePINCode(value)) {
      setErrors((prev) => ({
        ...prev,
        correspondencePin: 'Invalid PIN code. Use 6 digits.',
      }));
      return;
    }

    setCorrespondencePinLoading(true);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.correspondencePin;
      return newErrors;
    });

    try {
      const result = await lookupPINCode(value);
      if (result.found) {
        updateAddressData({
          correspondencePinCode: value,
          correspondenceCity: result.city,
          correspondenceState: result.state,
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          correspondencePin: 'PIN code not found in our database',
        }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        correspondencePin: 'Error looking up PIN code',
      }));
    } finally {
      setCorrespondencePinLoading(false);
    }
  };

  const handleSameAsPerminent = (checked: boolean) => {
    updateAddressData({ sameAsPerminent: checked });
    if (checked) {
      updateAddressData({
        correspondencePinCode: addressData.permanentPinCode,
        correspondenceCity: addressData.permanentCity,
        correspondenceState: addressData.permanentState,
        correspondenceAddress: addressData.permanentAddress,
      });
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Step 4: Address Information</h3>
        <p className="text-sm text-muted-foreground">
          Enter your permanent and correspondence address details
        </p>
      </div>

      {/* Permanent Address */}
      <Card>
        <CardHeader>
          <CardTitle>Permanent Address</CardTitle>
          <CardDescription>Your residential address as per government records</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <FormInput
              label="PIN Code"
              placeholder="400001"
              value={addressData.permanentPinCode || ''}
              onChange={(e) => updateAddressData({ permanentPinCode: e.target.value })}
              onBlur={(e) => handlePermanentPinBlur(e.target.value)}
              error={errors.permanentPin}
              helperText="Enter 6-digit PIN code. City and State will auto-populate."
              required
            />
            {pinLookupLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 -translate-x-1 pt-5">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
              </div>
            )}
          </div>

          <FormInput
            label="City"
            placeholder="Mumbai"
            value={addressData.permanentCity || ''}
            onChange={(e) => updateAddressData({ permanentCity: e.target.value })}
            readOnly
            required
          />

          <FormInput
            label="State"
            placeholder="Maharashtra"
            value={addressData.permanentState || ''}
            onChange={(e) => updateAddressData({ permanentState: e.target.value })}
            readOnly
            required
          />

          <div className="min-h-24">
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Address <span className="text-destructive">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 transition-all duration-200 resize-none"
              placeholder="Enter your complete address (Building number, street name, etc.)"
              rows={4}
              value={addressData.permanentAddress || ''}
              onChange={(e) => updateAddressData({ permanentAddress: e.target.value })}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Same as Permanent Address Checkbox */}
      <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
        <input
          type="checkbox"
          id="sameAsPerminent"
          checked={addressData.sameAsPerminent || false}
          onChange={(e) => handleSameAsPerminent(e.target.checked)}
          className="mt-1 w-5 h-5 cursor-pointer accent-accent"
        />
        <label htmlFor="sameAsPerminent" className="cursor-pointer flex-1">
          <p className="font-medium text-foreground">Same as Permanent Address</p>
          <p className="text-sm text-muted-foreground">Use the same address for correspondence</p>
        </label>
      </div>

      {/* Correspondence Address */}
      {!addressData.sameAsPerminent && (
        <Card>
          <CardHeader>
            <CardTitle>Correspondence Address</CardTitle>
            <CardDescription>Where we will send your official correspondence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <FormInput
                label="PIN Code"
                placeholder="110001"
                value={addressData.correspondencePinCode || ''}
                onChange={(e) => updateAddressData({ correspondencePinCode: e.target.value })}
                onBlur={(e) => handleCorrespondencePinBlur(e.target.value)}
                error={errors.correspondencePin}
                helperText="Enter 6-digit PIN code. City and State will auto-populate."
                required
              />
              {correspondencePinLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 -translate-x-1 pt-5">
                  <Loader2 className="w-5 h-5 animate-spin text-accent" />
                </div>
              )}
            </div>

            <FormInput
              label="City"
              placeholder="Delhi"
              value={addressData.correspondenceCity || ''}
              onChange={(e) => updateAddressData({ correspondenceCity: e.target.value })}
              readOnly
              required
            />

            <FormInput
              label="State"
              placeholder="Delhi"
              value={addressData.correspondenceState || ''}
              onChange={(e) => updateAddressData({ correspondenceState: e.target.value })}
              readOnly
              required
            />

            <div className="min-h-24">
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Address <span className="text-destructive">*</span>
              </label>
              <textarea
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 transition-all duration-200 resize-none"
                placeholder="Enter your complete correspondence address"
                rows={4}
                value={addressData.correspondenceAddress || ''}
                onChange={(e) => updateAddressData({ correspondenceAddress: e.target.value })}
                required
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
