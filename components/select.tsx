'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { generateId, combineAriaDescribedBy } from '@/lib/a11y';
import { AlertCircle, ChevronDown } from 'lucide-react';
import { useId } from "react";

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  variant?: 'default' | 'filled';
}

/**
 * Select Component
 * Accessible dropdown with keyboard navigation and WCAG 2.1 AA compliance
 * Uses native HTML select for maximum accessibility
 */
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired,
      options,
      placeholder = 'Select an option',
      value = '',
      onChange,
      variant = 'default',
      className,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const selectId = id ?? reactId;
    const errorId = error ? `${selectId}-error` : undefined;
    const helperTextId = helperText ? `${selectId}-helper` : undefined;
    const ariaDescribedBy = combineAriaDescribedBy(errorId, helperTextId);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-60 cursor-not-allowed',
              isRequired && 'after:content-["*"] after:ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className={cn(
              'appearance-none w-full px-4 py-2.5 pr-10 rounded-lg',
              'border border-input bg-background text-foreground',
              'transition-smooth focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'cursor-pointer',
              error && 'border-destructive focus-visible:ring-destructive',
              variant === 'filled' && 'bg-secondary border-transparent',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={ariaDescribedBy}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={`${option.value}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        </div>

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

Select.displayName = 'Select';

export { Select, type SelectProps, type SelectOption };
