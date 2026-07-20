'use client';

import React from 'react';
import { useStepStore } from '@/lib/store/step-store';

export function ProgressBar() {
  const { getProgress, currentStep } = useStepStore();
  const progress = getProgress();

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
      <div className="h-14 md:h-16 flex items-center px-4 md:px-8 max-w-7xl mx-auto">
        {/* Visible progress container */}
        <div className="flex-1 flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
            Step {currentStep} of 8
          </span>
          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-xs">
            {/* Animated progress bar */}
            <div
              className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-smooth"
              style={{
                width: `${progress}%`,
                transitionDuration: '400ms',
              }}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">{progress}%</span>
        </div>

        {/* Status indicator */}
        <div className="ml-4 hidden sm:flex items-center gap-2">
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">In Progress</span>
        </div>
      </div>
    </div>
  );
}
