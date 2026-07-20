'use client';

import React from 'react';
import { useStepStore } from '@/lib/store/step-store';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function MobileNavigation() {
  const { currentStep, nextStep, previousStep, isFirstStep, isLastStep, steps } = useStepStore();
  const currentStepData = steps[currentStep - 1];

  return (
    <div className="p-4 space-y-3">
      {/* Step Info */}
      <div className="px-2 py-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">
          Step {currentStep} of 8
        </p>
        <h3 className="text-sm font-semibold text-foreground">{currentStepData?.title}</h3>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-2">
        <button
          onClick={previousStep}
          disabled={isFirstStep()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm transition-smooth hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
          aria-label="Go to previous step"
        >
          <ChevronLeft size={18} />
          <span className="hidden xs:inline">Back</span>
        </button>

        <button
          onClick={nextStep}
          disabled={isLastStep()}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm transition-smooth hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed focus-ring"
          aria-label="Go to next step"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Step Indicator Dots */}
      <div className="flex justify-center gap-1.5 pt-2">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`h-1.5 rounded-full transition-smooth ${
              step.id === currentStep
                ? 'bg-primary w-6'
                : step.status === 'completed'
                  ? 'bg-accent w-2'
                  : 'bg-muted w-2'
            }`}
            aria-label={`Step ${step.id}: ${step.title}`}
          />
        ))}
      </div>
    </div>
  );
}
