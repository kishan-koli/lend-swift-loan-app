'use client';

import React from 'react';
import { StepStatus } from '@/lib/store/step-store';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  stepNumber: number;
  status: StepStatus;
  isActive?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StepIndicator({
  stepNumber,
  status,
  isActive = false,
  onClick,
  disabled = false,
  size = 'md',
}: StepIndicatorProps) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const baseClasses =
    'rounded-full flex items-center justify-center font-semibold transition-smooth font-sans';

  const statusClasses = isCompleted
    ? 'bg-accent text-white shadow-md hover:shadow-lg'
    : isCurrent
      ? 'bg-primary text-white ring-4 ring-primary/30'
      : disabled
        ? 'bg-muted text-muted-foreground opacity-50'
        : 'bg-muted text-muted-foreground';

  const buttonClasses = onClick && !disabled ? 'cursor-pointer hover:scale-110' : '';

  const Element = onClick && !disabled ? 'button' : 'div';

  return (
    <Element
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${statusClasses} ${buttonClasses}`}
      aria-label={`Step ${stepNumber}, status: ${status}`}
      type={Element === 'button' ? 'button' : undefined}
    >
      {isCompleted ? <Check size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} strokeWidth={3} /> : stepNumber}
    </Element>
  );
}
