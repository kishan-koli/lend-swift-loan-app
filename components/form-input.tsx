'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { generateId, combineAriaDescribedBy, getErrorAttributes } from '@/lib/a11y';
import { AlertCircle } from 'lucide-react';
import { useId } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  variant?: 'default' | 'filled';
}

/**
 * FormInput Component
 * Premium accessible input with integrated label, error, and helper text
 * Supports WCAG 2.1 AA focus states and keyboard navigation
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired,
      variant = 'default',
      className,
      id,
      disabled,
      type = 'text',
      placeholder,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    const ariaDescribedBy = combineAriaDescribedBy(errorId, helperTextId);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-60 cursor-not-allowed',
              isRequired && 'after:content-["*"] after:ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'px-4 py-2.5 rounded-lg',
            'border border-input bg-background text-foreground placeholder:text-muted-foreground',
            'transition-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-destructive focus-visible:ring-destructive',
            variant === 'filled' && 'bg-secondary border-transparent',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />

        {error && (
          <div
            id={errorId}
            className="flex items-center gap-1.5 text-sm text-destructive mt-1"
            role="alert"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {helperText && !error && (
          <p
            id={helperTextId}
            className="text-sm text-muted-foreground mt-1"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput, type FormInputProps };
