# LendSwift Component Library - Quick Start Guide

## Installation & Setup

All components are already built and ready to use in `/components` and `/lib`:

```
components/
├── form-input.tsx
├── currency-input.tsx
├── select.tsx
├── radio-group.tsx
└── card.tsx

lib/
├── currency.ts (utilities for Indian rupee formatting)
└── a11y.ts (accessibility helpers)
```

## Quick Examples

### FormInput
```tsx
import { FormInput } from '@/components/form-input';

<FormInput
  label="Full Name"
  placeholder="Enter your name"
  isRequired
  value={fullName}
  onChange={(e) => setFullName(e.target.value)}
  error={errors.fullName}
  helperText="At least 2 characters"
/>
```

### CurrencyInput (Indian Rupees)
```tsx
import { CurrencyInput } from '@/components/currency-input';

<CurrencyInput
  label="Loan Amount"
  value={500000}
  onChange={(numValue, formatted) => {
    console.log(numValue); // 500000
    console.log(formatted); // ₹5,00,000
  }}
  min={100000}
  max={50000000}
/>
```

### Select Dropdown
```tsx
import { Select, type SelectOption } from '@/components/select';

const options: SelectOption[] = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
];

<Select
  label="Choose Option"
  options={options}
  value={selected}
  onChange={(value) => setSelected(value as string)}
  isRequired
/>
```

### RadioGroup
```tsx
import { RadioGroup, type RadioOption } from '@/components/radio-group';

const options: RadioOption[] = [
  {
    value: 'option-1',
    label: 'Option 1',
    description: 'Description for option 1',
  },
  {
    value: 'option-2',
    label: 'Option 2',
    description: 'Description for option 2',
  },
];

<RadioGroup
  label="Select One"
  options={options}
  value={selected}
  onChange={(value) => setSelected(value as string)}
  orientation="vertical"
/>
```

### Card Component
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
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content here</p>
  </CardContent>
  <CardFooter>
    <button>Action</button>
  </CardFooter>
</Card>
```

## Currency Utilities

```tsx
import {
  formatIndianCurrency,
  parseIndianCurrency,
  formatCurrencyAbbrev,
} from '@/lib/currency';

// Format number to ₹1,00,000 style
formatIndianCurrency(1000000); // ₹10,00,000

// Parse currency string to number
parseIndianCurrency('₹10,00,000'); // 1000000

// Format with abbreviations
formatCurrencyAbbrev(1000000); // 10L
formatCurrencyAbbrev(10000000); // 1Cr
```

## Accessibility Utilities

```tsx
import {
  generateId,
  isEnterKey,
  isEscapeKey,
  isArrowDownKey,
  announceToScreenReader,
} from '@/lib/a11y';

// Generate unique IDs
const id = generateId('form'); // form-1-1234567890

// Check keyboard events
const handleKeyDown = (e: React.KeyboardEvent) => {
  if (isEnterKey(e)) {
    // Submit form
  }
  if (isEscapeKey(e)) {
    // Close dialog
  }
};

// Announce to screen readers
announceToScreenReader('Form submitted successfully');
```

## Common Patterns

### Form with Validation
```tsx
'use client';

import { useState } from 'react';
import { FormInput } from '@/components/form-input';
import { CurrencyInput } from '@/components/currency-input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/card';
import { Button } from '@/components/ui/button';

export default function MyForm() {
  const [data, setData] = useState({ name: '', amount: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!data.name) newErrors.name = 'Name is required';
    if (data.amount < 1000) newErrors.amount = 'Minimum amount is ₹1,000';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form data:', data);
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Application Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Full Name"
            isRequired
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            error={errors.name}
          />
          <CurrencyInput
            label="Amount"
            isRequired
            value={data.amount}
            onChange={(amount) => setData({ ...data, amount })}
            error={errors.amount}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit}>Submit</Button>
      </CardFooter>
    </Card>
  );
}
```

## Accessibility Checklist

When using LendSwift components:

- ✅ All inputs have labels
- ✅ Required fields marked with asterisk
- ✅ Error messages connected via aria-describedby
- ✅ Focus visible on keyboard navigation (emerald ring)
- ✅ Keyboard navigation: Tab, Shift+Tab, Arrow keys, Enter
- ✅ Screen reader announcements for form state changes
- ✅ Color contrast ratios WCAG AA compliant
- ✅ No reliance on color alone to convey information

## Keyboard Navigation Guide

### FormInput & CurrencyInput
- **Tab**: Move to next field
- **Shift+Tab**: Move to previous field
- **Type**: Enter value

### Select
- **Tab**: Focus select
- **Enter/Space**: Open dropdown
- **Arrow Keys**: Navigate options
- **Enter**: Select option

### RadioGroup
- **Tab**: Focus first radio
- **Arrow Keys**: Navigate options
- **Space**: Select option

### Card
- **Tab**: Focus interactive elements within card
- **Enter/Space**: Activate buttons

## Color Usage

### Primary (Blue)
Use for main CTAs, primary text, active states:
```tsx
className="text-primary" // oklch(0.35 0.15 260)
className="bg-primary"
```

### Accent (Emerald)
Use for focus states, success messages, highlights:
```tsx
className="text-accent" // oklch(0.60 0.16 165)
className="focus:ring-accent"
```

### Destructive (Red)
Use for errors, warnings:
```tsx
className="text-destructive" // oklch(0.62 0.22 29)
className="border-destructive"
```

## Common Issues & Solutions

### Currency Input not formatting
- Ensure `onChange` callback is provided
- Check that value is a number (not string)
- Verify min/max constraints

### Focus ring not visible
- Check that element has `focus-visible:ring-4 focus-visible:ring-accent`
- Ensure CSS is loaded (globals.css)
- Test with keyboard navigation (Tab key)

### RadioGroup arrow keys not working
- Ensure all options are properly defined
- Check that onChange handler is provided
- Verify disabled options don't block navigation

### Form validation not showing
- Ensure error prop is passed to component
- Check that error message is not empty string
- Verify aria-describedby is connected

## Performance Tips

1. **Use useCallback** for event handlers to prevent re-renders
2. **Memoize select options** if fetched dynamically
3. **Lazy load large forms** with code splitting
4. **Debounce currency input** if validating against API

## TypeScript Support

All components are fully typed:

```tsx
import type { FormInputProps, SelectOption, RadioOption } from '@/components/form-input';

const myProps: FormInputProps = {
  label: 'Test',
  value: 'test',
  onChange: (e) => {},
};
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Need Help?

- See `LENDSWIFT_COMPONENTS.md` for detailed API reference
- Check `BUILD_SUMMARY.md` for architecture overview
- Review `app/page.tsx` for working examples

## Next Steps

1. Import components into your pages
2. Use TypeScript for type safety
3. Follow the accessibility checklist
4. Test with keyboard-only navigation
5. Run form validation before submission

Happy building with LendSwift!
