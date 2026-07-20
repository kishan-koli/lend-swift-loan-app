'use client';

import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
  hoverable?: boolean;
}

/**
 * Card Component
 * Premium card with smooth micro-interactions and hover effects
 * Supports elevated shadows and interactive states
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      interactive = false,
      hoverable = true,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg bg-card text-card-foreground transition-smooth',
          variant === 'default' && 'border border-border',
          variant === 'elevated' && 'shadow-sm',
          variant === 'outlined' && 'border-2 border-border',
          hoverable &&
            'hover:shadow-md hover:border-primary/20 focus-within:shadow-lg focus-within:border-primary/40',
          interactive && 'cursor-pointer active:scale-98 transition-transform duration-150',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

/**
 * CardHeader Component
 * Premium header section for cards with proper spacing
 */
const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col gap-1.5 border-b border-border p-6', className)}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

/**
 * CardTitle Component
 * Semantic title for card headers
 */
const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold text-foreground', className)}
      {...props}
    />
  )
);

CardTitle.displayName = 'CardTitle';

/**
 * CardDescription Component
 * Semantic description text for card headers
 */
const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

/**
 * CardContent Component
 * Content area with proper padding
 */
const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6', className)}
      {...props}
    />
  )
);

CardContent.displayName = 'CardContent';

/**
 * CardFooter Component
 * Footer section with proper spacing
 */
const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center justify-end gap-2 border-t border-border p-6', className)}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  type CardProps,
};
