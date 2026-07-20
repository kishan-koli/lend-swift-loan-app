'use client';

import React, { forwardRef, useState, useCallback, useId } from 'react';
import { cn } from '@/lib/utils';
import { generateId, combineAriaDescribedBy, getErrorAttributes } from '@/lib/a11y';
import { formatIndianCurrency, parseIndianCurrency, isValidCurrencyInput } from '@/lib/currency';
import { AlertCircle, IndianRupee } from 'lucide-react';


interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  value?: number | string;
  onChange?: (value: number, formattedValue: string) => void;
  min?: number;
  max?: number;
  variant?: 'default' | 'filled';
}

/**
 * CurrencyInput Component
 * Specialized input for Indian Rupee with automatic formatting
 * Supports: ₹1,00,000 (lakhs), ₹1,00,00,000 (crores)
 * Accessible with WCAG 2.1 AA compliance
 */
const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired,
      value = '',
      onChange,
      min,
      max,
      variant = 'default',
      className,
      id,
      disabled,
      placeholder = '₹0',
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const inputId = id ?? reactId;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperTextId = helperText ? `${inputId}-helper` : undefined;
    const ariaDescribedBy = combineAriaDescribedBy(errorId, helperTextId);

    const [displayValue, setDisplayValue] = useState(() => {
      if (value) {
        const numValue = typeof value === 'string' ? parseIndianCurrency(value) : value;
        return formatIndianCurrency(numValue);
      }
      return '';
    });

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        let inputValue = e.target.value;

        // Validate input contains only valid currency characters
        if (!isValidCurrencyInput(inputValue)) {
          return;
        }

        // Parse to number
        const numValue = parseIndianCurrency(inputValue);

        // Validate against min/max constraints
        if (min !== undefined && numValue < min) {
          return;
        }
        if (max !== undefined && numValue > max) {
          return;
        }

        // Format display value
        const formatted = formatIndianCurrency(numValue);
        setDisplayValue(formatted);

        // Call onChange with numeric and formatted values
        if (onChange) {
          onChange(numValue, formatted);
        }
      },
      [min, max, onChange]
    );

    const handleBlur = useCallback(() => {
      // Ensure display value is properly formatted on blur
      if (displayValue && displayValue !== '₹0') {
        const numValue = parseIndianCurrency(displayValue);
        setDisplayValue(formatIndianCurrency(numValue));
      }
    }, [displayValue]);

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

        <div className="relative">
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
            <IndianRupee className="w-4 h-4" />
          </div>

          <input
            ref={ref}
            id={inputId}
            type="text"
            placeholder={placeholder}
            value={displayValue}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={disabled}
            inputMode="decimal"
            className={cn(
              'w-full pl-9 pr-4 py-2.5 rounded-lg',
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

CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput, type CurrencyInputProps };
