'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { generateId, combineAriaDescribedBy, isArrowDownKey, isArrowUpKey } from '@/lib/a11y';
import { AlertCircle, LucideIcon } from 'lucide-react';
import { useId } from "react"

interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;

  icon?: LucideIcon
}

interface RadioGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  options: RadioOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

/**
 * RadioGroup Component
 * Accessible radio button group with keyboard navigation
 * Supports arrow keys for navigation, WCAG 2.1 AA compliant
 */
const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      label,
      error,
      helperText,
      isRequired,
      options,
      value = '',
      onChange,
      disabled = false,
      orientation = 'vertical',
      className,
      id,
      ...props
    },
    ref
  ) => {
    const reactId = useId();
    const groupId = id ?? reactId;
    const errorId = error ? `${groupId}-error` : undefined;
    const helperTextId = helperText ? `${groupId}-helper` : undefined;
    const ariaDescribedBy = combineAriaDescribedBy(errorId, helperTextId);

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
      if (isArrowDownKey(e) || isArrowUpKey(e)) {
        e.preventDefault();
        const direction = isArrowDownKey(e) ? 1 : -1;
        const nextIndex = (index + direction + options.length) % options.length;
        const nextOption = options[nextIndex];

        if (!nextOption.disabled) {
          onChange?.(nextOption.value);
        }
      }
    };

    return (
      <div
        ref={ref}
        className="flex flex-col gap-1.5 w-full"
        {...props}
      >
        {label && (
          <label
            className={cn(
              'text-sm font-medium text-foreground',
              disabled && 'opacity-60 cursor-not-allowed',
              isRequired && 'after:content-["*"] after:ml-1 after:text-destructive'
            )}
          >
            {label}
          </label>
        )}

        <div
          role="group"
          aria-labelledby={label ? `${groupId}-label` : undefined}
          aria-describedby={ariaDescribedBy}
          aria-invalid={!!error}
          className={cn(
            'flex gap-4',
            orientation === 'vertical' && 'flex-col',
            orientation === 'horizontal' && 'flex-row flex-wrap'
          )}
        >
          {options.map((option, index) => {
            const optionId = `${groupId}-${option.value}`;
            const isSelected = value === option.value;
            const isDisabled = disabled || option.disabled;

            return (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={optionId}
                  name={groupId}
                  value={option.value}
                  checked={isSelected}
                  onChange={() => !isDisabled && onChange?.(option.value)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  disabled={isDisabled}
                  className={cn(
                    'peer sr-only',
                    'focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent focus-visible:ring-offset-2'
                  )}
                  tabIndex={isSelected ? 0 : -1}
                  aria-label={option.label}
                  aria-describedby={option.description ? `${optionId}-desc` : undefined}
                />

                <label
                  htmlFor={optionId}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer',
                    isDisabled && 'opacity-60 cursor-not-allowed'
                  )}
                >
                  {/* Custom Radio Button */}
                  <div
                    className={cn(
                      'relative w-5 h-5 rounded-full border-2 transition-smooth',
                      'peer-focus-visible:ring-4 peer-focus-visible:ring-accent peer-focus-visible:ring-offset-2',
                      isSelected
                        ? 'border-primary bg-primary'
                        : 'border-input bg-background hover:border-primary',
                      error && 'border-destructive',
                      isDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {/* Inner Dot */}
                    {isSelected && (
                      <div className="absolute inset-1 rounded-full bg-white dark:bg-slate-900 scale-75 transition-transform duration-200" />
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-foreground">
                      {option.label}
                    </span>
                    {option.description && (
                      <span
                        id={`${optionId}-desc`}
                        className="text-xs text-muted-foreground"
                      >
                        {option.description}
                      </span>
                    )}
                  </div>
                </label>
              </div>
            );
          })}
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

RadioGroup.displayName = 'RadioGroup';

export { RadioGroup, type RadioGroupProps, type RadioOption };
