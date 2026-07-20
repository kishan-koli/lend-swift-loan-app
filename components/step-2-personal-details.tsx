'use client';

import React, { useState } from 'react';
import { FormInput } from './form-input';
import { useStepStore } from '@/lib/store/step-store';

export default function Step2PersonalDetails() {
  const {
    personalInfo,
    updatePersonalInfo,
  } = useStepStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateAge = (dob: string) => {
    if (!dob) return 0;

    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();

    const monthDiff =
      today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleDateChange = (value: string) => {
    const age = calculateAge(value);

    if (age < 18) {
      setErrors({
        dateOfBirth:
          'You must be at least 18 years old',
      });
    } else if (age > 75) {
      setErrors({
        dateOfBirth:
          'Age cannot exceed 75 years',
      });
    } else {
      setErrors({});
    }

    updatePersonalInfo({
      dateOfBirth: value,
      age,
    });
  };

  return (
    <div className="space-y-6">

      <FormInput
        label="Full Name"
        placeholder="John Doe"
        value={personalInfo.fullName || ''}
        onChange={(e) =>
          updatePersonalInfo({
            fullName: e.target.value,
          })
        }
        required
      />

      <FormInput
        label="Email Address"
        type="email"
        placeholder="john@example.com"
        value={personalInfo.email || ''}
        onChange={(e) =>
          updatePersonalInfo({
            email: e.target.value,
          })
        }
        helperText="We'll send loan updates to this email"
        required
      />

      <FormInput
        label="Phone Number"
        placeholder="+91 9876543210"
        value={personalInfo.phone || ''}
        onChange={(e) =>
          updatePersonalInfo({
            phone: e.target.value,
          })
        }
        required
      />

      <FormInput
        label="Date of Birth"
        type="date"
        value={personalInfo.dateOfBirth || ''}
        onChange={(e) =>
          handleDateChange(e.target.value)
        }
        error={errors.dateOfBirth}
        required
      />

    </div>
  );
}