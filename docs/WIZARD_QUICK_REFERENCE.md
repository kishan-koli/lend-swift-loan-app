# LendSwift Wizard - Quick Reference

## Access the Wizard

**URL**: `/wizard`

**From Home Page**: Click "Multi-Step Wizard" button in header

## File Locations

```
/lib/store/
  └── step-store.ts              # Zustand state (edit steps here)

/components/
  ├── wizard-layout.tsx          # Main container
  ├── progress-bar.tsx           # Top progress indicator
  ├── step-sidebar.tsx           # Desktop nav
  ├── mobile-navigation.tsx      # Mobile nav
  └── step-indicator.tsx         # Reusable step circle

/app/wizard/
  └── page.tsx                   # Full demo page (398 lines)
```

## API Quick Reference

### Using the Store

```typescript
import { useStepStore } from '@/lib/store/step-store';

const {
  steps,           // Step[]
  currentStep,     // 1-8
  nextStep,        // () => void
  previousStep,    // () => void
  goToStep,        // (id: number) => void
  completeStep,    // (id: number) => void
  resetWizard,     // () => void
  getCurrentStep,  // () => Step
  getProgress,     // () => number (0-100)
  isLastStep,      // () => boolean
  isFirstStep,     // () => boolean
} = useStepStore();
```

### Using Components

```typescript
// Main layout
<WizardLayout title="Your Title">
  {/* Content */}
</WizardLayout>

// Content wrapper
<WizardContent title="Section" description="Desc">
  {/* Form fields */}
</WizardContent>

// Step indicator
<StepIndicator
  stepNumber={1}
  status="current"
  size="md"
  onClick={() => goToStep(1)}
/>
```

## Step Statuses

```
'pending'    → Gray circle, disabled click
'current'    → Blue circle, pulsing indicator
'completed'  → Green checkmark, clickable
```

## Customization Examples

### Add a Custom Step

1. Edit `lib/store/step-store.ts`:
```typescript
const TOTAL_STEPS = 9; // Changed from 8

const initializeSteps = (): Step[] => [
  // ... existing steps ...
  { 
    id: 9, 
    title: 'Final Review', 
    description: 'Last chance to verify',
    status: 'pending' 
  },
];
```

2. Add UI in `app/wizard/page.tsx`:
```typescript
{currentStep === 9 && (
  <WizardContent title="Final Review">
    {/* Your content */}
  </WizardContent>
)}
```

### Change Colors

Edit `app/globals.css`:
```css
:root {
  --primary: oklch(0.35 0.15 260);    /* Current step */
  --accent: oklch(0.60 0.16 165);     /* Completed */
  --muted: oklch(0.92 0 0);           /* Pending */
}
```

### Modify Focus Ring

Edit `app/globals.css`:
```css
*:focus-visible {
  @apply ring-4 ring-accent ring-offset-2;
  /* Adjust ring size, offset, color */
}
```

## Responsive Breakpoints

```
Mobile:  < 768px  → Bottom nav + progress bar
Desktop: ≥ 768px  → Sidebar + progress bar
```

## Data Persistence

- **Auto-saves**: Every state change
- **Storage key**: `lendswift-wizard-store`
- **Clear data**: `localStorage.removeItem('lendswift-wizard-store')`

## Validation Pattern

```typescript
const validateStep = (): boolean => {
  const errors = {};
  
  if (currentStep === 1) {
    if (!formData.name) errors.name = 'Required';
  }
  
  setErrors(errors);
  return Object.keys(errors).length === 0;
};

const handleNext = () => {
  if (validateStep()) {
    completeStep(currentStep);
    nextStep();
  }
};
```

## Common Tasks

### Navigate Programmatically
```typescript
nextStep();           // Move to next
previousStep();       // Move to previous
goToStep(3);          // Jump to step 3
resetWizard();        // Go to step 1
```

### Check Current Status
```typescript
if (isFirstStep()) { /* Hide back button */ }
if (isLastStep()) { /* Show submit */ }
if (getProgress() === 100) { /* All done */ }
```

### Get Step Info
```typescript
const currentStepData = getCurrentStep();
console.log(currentStepData.title);
```

## Styling Classes Available

```
Primary:     bg-primary, text-primary, border-primary
Accent:      bg-accent, text-accent, border-accent
Muted:       bg-muted, text-muted-foreground
Background:  bg-background, text-foreground
Border:      border-border
```

## Accessibility Checklist

- [ ] Tab navigation works
- [ ] Focus ring visible (emerald)
- [ ] Screen reader reads step titles
- [ ] Keyboard can navigate form
- [ ] Touch targets ≥48px
- [ ] Color not only indicator

## Performance Tips

- Use `useCallback` for event handlers
- Use selector pattern for store subscriptions
- Lazy load step content if heavy
- Memoize form components

## Debugging

### Check Store State
```typescript
import { useStepStore } from '@/lib/store/step-store';

export default function Debug() {
  const { steps, currentStep } = useStepStore();
  return <pre>{JSON.stringify({ steps, currentStep }, null, 2)}</pre>;
}
```

### Check localStorage
```typescript
console.log(JSON.parse(localStorage.getItem('lendswift-wizard-store')));
```

## Mobile Test Dimensions

- iPhone 12: 390x844
- iPad: 768x1024
- Desktop: 1920x1080

## Browser DevTools Tips

1. Disable CSS to test semantic HTML
2. Check Accessibility Tree (a11y)
3. Throttle network to test perceived performance
4. Use Chrome DevTools Lighthouse
