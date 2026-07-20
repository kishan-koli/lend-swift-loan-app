'use client';

import React from 'react';
import { useStepStore } from '@/lib/store/step-store';
import { Check } from 'lucide-react';

export function StepSidebar() {
  const { steps, currentStep, goToStep } = useStepStore();

  return (
    <div className="sticky top-20 space-y-2">
      {/* Section Header */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Application Progress
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Step {currentStep} of {steps.length}
        </p>
      </div>

      {/* Steps Container with Vertical Progress Line */}
      <div className="relative space-y-0">
        {/* Dynamic Vertical Progress Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 transition-colors duration-500">
          {/* Active Progress Fill */}
          <div
            className="absolute left-0 top-0 w-full bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 dark:from-blue-500 dark:via-blue-400 dark:to-blue-500 transition-all duration-500 ease-in-out"
            style={{
              height: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps Mapping */}
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed';
          const isCurrent = step.status === 'current';
          const isPending = step.status === 'pending';
          const isLastStep = index === steps.length - 1;

          return (
            <div key={step.id} className="relative pb-8">
              {/* Step Button */}
              <button
                onClick={() => goToStep(step.id)}
                disabled={isPending && !isCompleted}
                className={`w-full text-left transition-all duration-300 ${
                  isPending && !isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
                aria-label={`Step ${step.id}: ${step.title}`}
              >
                <div className="flex items-start gap-4 pl-6">
                  {/* Premium Indicator Circle */}
                  <div className="flex-shrink-0 mt-0">
                    {isCompleted ? (
                      /* Completed State: Emerald Tick Mark */
                      <div className="relative">
                        <div className="absolute inset-0 bg-emerald-600 dark:bg-emerald-500 rounded-full animate-pulse opacity-20" />
                        <div className="relative w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 dark:shadow-emerald-500/40 transition-all duration-300 hover:scale-110 hover:shadow-xl">
                          <Check size={20} strokeWidth={3} />
                        </div>
                      </div>
                    ) : isCurrent ? (
                      /* Active State: Glowing Blue Circle with Ring */
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600 dark:bg-blue-500 rounded-full animate-pulse opacity-20 scale-125" />
                        <div className="relative w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center font-bold text-sm text-white ring-4 ring-blue-100 dark:ring-blue-900/40 shadow-lg shadow-blue-600/40 dark:shadow-blue-500/40 scale-110 transition-all duration-300">
                          {step.id}
                        </div>
                      </div>
                    ) : (
                      /* Pending State: Muted Disabled */
                      <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all duration-300 ${
                        isPending
                          ? 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 text-slate-400 dark:text-slate-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                      }">
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0 pt-1">
                    <h4
                      className={`text-sm font-semibold transition-all duration-300 ${
                        isCurrent
                          ? 'text-blue-600 dark:text-blue-400'
                          : isCompleted
                            ? 'text-foreground'
                            : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <p
                      className={`text-xs mt-0.5 line-clamp-2 transition-all duration-300 ${
                        isCurrent || isCompleted
                          ? 'text-muted-foreground'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {step.description}
                    </p>

                    {/* Status Badge */}
                    {isCurrent && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                        <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                          In Progress
                        </span>
                      </div>
                    )}
                    {isCompleted && (
                      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-2">
                        ✓ Completed
                      </div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Progress Summary */}
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground">Overall Progress</span>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {Math.round(((steps.filter(s => s.status === 'completed').length) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-500 dark:to-blue-400 transition-all duration-500 rounded-full"
              style={{
                width: `${((steps.filter(s => s.status === 'completed').length) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
