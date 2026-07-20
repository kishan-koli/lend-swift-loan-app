# LendSwift Component Library

A premium, production-ready atomic component library for modern fintech applications built with React, TypeScript, Tailwind CSS, and Lucide icons. Fully compliant with WCAG 2.1 AA accessibility standards with excellent keyboard navigation and focus states.

## Features

- ✅ **WCAG 2.1 AA Compliant**: Full accessibility support with visible focus indicators (4px emerald ring with 8px offset)
- ✅ **Keyboard Navigation**: Tab, Arrow Keys, Enter, Escape support for all components
- ✅ **Indian Currency Support**: Auto-formatting for rupees (₹1,00,000 lakhs and ₹1,00,00,000 crores)
- ✅ **Micro-interactions**: Smooth 200ms transitions on all interactions (hover, focus, active)
- ✅ **React.forwardRef**: Full ref support for all components
- ✅ **TypeScript**: Complete type safety with exported interfaces
- ✅ **Color Palette**: Blue (primary) | White (background) | Emerald (accent) inspired by CRED & Groww

## Components

### FormInput
A premium form input with integrated label, error display, and helper text.

```tsx
import { FormInput } from '@/components/form-input';

<FormInput
  label="Full Name"
  placeholder="Enter your name"
  isRequired
  error={errors.fullName}
  helperText="Minimum 2 characters"
  value={formData.fullName}
  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
/>
```

**Features:**
- Label with required asterisk
- Error messages with alert icon
- Helper text support
- Disabled state with reduced opacity
- Focus ring: 4px emerald outline with 8px offset
- Filled variant for alternate styling

### CurrencyInput
Specialized input for Indian Rupee with automatic formatting.

```tsx
import { CurrencyInput } from '@/components/currency-input';

<CurrencyInput
  label="Loan Amount"
  value={500000}
  onChange={(numValue, formatted) => {
    console.log(`Amount: ${numValue} (${formatted})`);
  }}
  min={100000}
  max={50000000}
  helperText="Range: ₹1,00,000 to ₹5,00,00,000"
/>
```

**Features:**
- Auto-formatting: `2500000` → `₹25,00,000`
- Rupee icon with proper positioning
- Min/max validation
- Handles lakhs (₹1,00,000) and crores (₹1,00,00,000)
- Accessible error states
- Decimal support

### Select
Accessible dropdown with keyboard navigation.

```tsx
import { Select, type SelectOption } from '@/components/select';

const options: SelectOption[] = [
  { value: '6', label: '6 months' },
  { value: '12', label: '1 year' },
  { value: '24', label: '2 years' },
];

<Select
  label="Loan Duration"
  options={options}
  value={duration}
  onChange={(value) => setDuration(value as string)}
  isRequired
  error={errors.duration}
/>
```

**Features:**
- Native HTML select for maximum accessibility
- Placeholder option support
- Disabled options
- Error display with icon
- Focus ring: 4px emerald outline
- Chevron icon indicator

### RadioGroup
Accessible radio button group with arrow key navigation.

```tsx
import { RadioGroup, type RadioOption } from '@/components/radio-group';

const options: RadioOption[] = [
  {
    value: 'full-time',
    label: 'Full-time Employee',
    description: 'Stable monthly income',
  },
  {
    value: 'self-employed',
    label: 'Self-employed',
    description: 'Own business',
  },
];

<RadioGroup
  label="Employment Type"
  options={options}
  value={employment}
  onChange={(value) => setEmployment(value as string)}
  orientation="vertical"
/>
```

**Features:**
- Arrow key navigation (Up/Down)
- Custom radio button styling with filled center dot
- Optional descriptions for each option
- Disabled option support
- Vertical and horizontal orientations
- Fully keyboard accessible

### Card
Premium card component with micro-interactions and hover effects.

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/card';

<Card variant="elevated" hoverable>
  <CardHeader>
    <CardTitle>Application Status</CardTitle>
    <CardDescription>Your loan application</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Application submitted successfully</p>
  </CardContent>
  <CardFooter>
    <button>Continue</button>
  </CardFooter>
</Card>
```

**Features:**
- Variants: `default`, `elevated`, `outlined`
- Hoverable: shadow and border color transitions
- Interactive: active scale animation (98%)
- Semantic sub-components: Header, Title, Description, Content, Footer
- Smooth micro-interactions (200ms transitions)

## Accessibility

All components are built with accessibility as a core principle:

### Keyboard Navigation
- **Tab**: Move between form fields and interactive elements
- **Shift+Tab**: Move backwards through the focus order
- **Arrow Keys**: Navigate between options in RadioGroup
- **Enter**: Submit forms, activate buttons
- **Escape**: Cancel operations

### Focus States
- All interactive elements have visible focus rings (4px emerald outline)
- 8px offset from element for clear visibility
- Ring is shown on focus-visible (keyboard navigation only)
- Respects `prefers-reduced-motion` media query

### Screen Reader Support
- Proper `aria-label` and `aria-describedby` attributes
- Error messages with `role="alert"`
- Required field indicators with `isRequired` prop
- Semantic HTML elements (labels, buttons, etc.)
- Form validation messages are announced

### Color Contrast
- WCAG AA compliant contrast ratios (4.5:1 for normal text)
- Blue primary on white background
- Emerald accents on white background
- Error colors with sufficient contrast

## Color Palette

### Light Mode
- **Primary (Blue)**: `oklch(0.35 0.15 260)` - Deep blue inspired by CRED
- **Accent (Emerald)**: `oklch(0.60 0.16 165)` - Vibrant emerald inspired by Groww
- **Background**: `oklch(1 0 0)` - Pure white
- **Foreground**: `oklch(0.145 0 0)` - Near-black text
- **Muted**: `oklch(0.92 0 0)` - Light gray
- **Border**: `oklch(0.93 0 0)` - Subtle borders
- **Destructive**: `oklch(0.62 0.22 29)` - Warm red for errors

## Micro-interactions

All components feature smooth 200ms transitions:

1. **Hover States**: Card elevation increases, borders gain color
2. **Focus States**: Emerald ring appears with smooth animation
3. **Active States**: Scale animation (98%) for interactive elements
4. **Transitions**: `transition-smooth` class applies `duration-200 ease-out`

## API Reference

### FormInput Props
```tsx
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isRequired?: boolean;
  variant?: 'default' | 'filled';
}
```

### CurrencyInput Props
```tsx
interface CurrencyInputProps {
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
```

### Select Props
```tsx
interface SelectProps {
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

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

### RadioGroup Props
```tsx
interface RadioGroupProps {
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

interface RadioOption {
  value: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
}
```

### Card Props
```tsx
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  interactive?: boolean;
  hoverable?: boolean;
}
```

## Utility Functions

### Currency Utilities (`lib/currency.ts`)
- `formatIndianCurrency(value)` - Format number to ₹1,00,000 style
- `parseIndianCurrency(value)` - Parse currency string to number
- `formatCurrencyAbbrev(value)` - Format to "10L", "1Cr", etc.
- `isValidCurrencyInput(value)` - Validate currency input

### Accessibility Utilities (`lib/a11y.ts`)
- `generateId(prefix)` - Generate unique IDs for form fields
- `combineAriaDescribedBy(...ids)` - Combine multiple aria-describedby values
- `getErrorAttributes(hasError, errorId)` - Get error ARIA attributes
- `isEnterKey(event)` - Check if Enter key was pressed
- `isEscapeKey(event)` - Check if Escape key was pressed
- `isArrowUpKey(event)` - Check if Arrow Up was pressed
- `isArrowDownKey(event)` - Check if Arrow Down was pressed
- `isTabKey(event)` - Check if Tab was pressed
- `announceToScreenReader(message, priority)` - Announce message to screen readers

## Usage Example

```tsx
'use client';

import { useState } from 'react';
import { FormInput } from '@/components/form-input';
import { CurrencyInput } from '@/components/currency-input';
import { Select } from '@/components/select';
import { RadioGroup } from '@/components/radio-group';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';

export default function LoanApplicationForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    loanAmount: 500000,
    loanDuration: '',
    employmentType: 'full-time',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation logic here
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Apply for a Loan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormInput
            label="Full Name"
            isRequired
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            error={errors.fullName}
          />

          <CurrencyInput
            label="Desired Loan Amount"
            isRequired
            value={formData.loanAmount}
            onChange={(value) => setFormData({ ...formData, loanAmount: value })}
            error={errors.loanAmount}
          />

          <Select
            label="Loan Duration"
            isRequired
            options={[
              { value: '12', label: '1 year' },
              { value: '24', label: '2 years' },
              { value: '36', label: '3 years' },
            ]}
            value={formData.loanDuration}
            onChange={(value) => setFormData({ ...formData, loanDuration: value as string })}
          />

          <RadioGroup
            label="Employment Type"
            options={[
              { value: 'full-time', label: 'Full-time Employee' },
              { value: 'self-employed', label: 'Self-employed' },
            ]}
            value={formData.employmentType}
            onChange={(value) => setFormData({ ...formData, employmentType: value as string })}
          />
        </form>
      </CardContent>
      <CardFooter>
        <button className="bg-primary text-white px-6 py-2 rounded-lg">
          Submit Application
        </button>
      </CardFooter>
    </Card>
  );
}
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Components use React.forwardRef for optimal ref handling
- Memoized event handlers prevent unnecessary re-renders
- CSS transitions use GPU-accelerated properties (transform, opacity)
- Minimal DOM overhead with semantic HTML

## Contributing

When adding new components to LendSwift:

1. Use React.forwardRef for all components
2. Include proper TypeScript types
3. Implement WCAG 2.1 AA accessibility
4. Add focus states with emerald ring (4px)
5. Support keyboard navigation
6. Use Tailwind CSS with semantic tokens
7. Include proper ARIA attributes
8. Test with keyboard-only navigation

## License

Built for LendSwift fintech application.
