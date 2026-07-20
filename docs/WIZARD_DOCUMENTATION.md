# LendSwift Multi-Step Wizard Documentation

## Overview

The LendSwift Multi-Step Wizard is a production-ready, fully responsive wizard layout container designed for complex, multi-step forms. It features sticky desktop sidebar navigation, mobile bottom navigation, and smooth micro-interactions with a Zustand-powered state management system.

## Features

- **Responsive Design**: Sticky sidebar on desktop (≥768px), bottom navigation on mobile (<768px)
- **8-Step Wizard**: Pre-configured with 8 steps for loan application workflow
- **Zustand State Management**: Persistent localStorage support for wizard progress
- **WCAG 2.1 AA Accessible**: Full keyboard navigation and focus ring support
- **Micro-interactions**: 200ms+ smooth transitions and animations
- **Progress Tracking**: Real-time progress bar and completion indicators
- **Form Validation**: Built-in validation skeleton ready for integration
- **Step Completion Status**: Visual indicators for pending, current, and completed steps

## Project Structure

```
components/
├── wizard-layout.tsx          # Main layout container
├── progress-bar.tsx           # Sticky progress bar (top)
├── step-sidebar.tsx           # Desktop sidebar navigation
├── mobile-navigation.tsx      # Mobile bottom navigation
└── step-indicator.tsx         # Reusable step indicator component

lib/store/
└── step-store.ts              # Zustand store for wizard state

app/wizard/
└── page.tsx                   # Full wizard demo page
```

## Zustand Store API

### Step Store

```typescript
import { useStepStore } from '@/lib/store/step-store';

const {
  // State
  steps,            // Array of all steps with status
  currentStep,      // Current step number (1-8)
  
  // Actions
  nextStep,         // Move to next step (validates completion)
  previousStep,     // Move to previous step
  goToStep,         // Jump to specific step (if allowed)
  completeStep,     // Mark step as completed
  resetWizard,      // Reset to step 1
  setSteps,         // Set custom steps
  
  // Getters
  getCurrentStep,   // Get current step object
  getProgress,      // Get progress percentage (0-100)
  isLastStep,       // Check if on final step
  isFirstStep,      // Check if on first step
  canProceedToStep, // Check if navigation to step is allowed
} = useStepStore();
```

### Step Object Structure

```typescript
interface Step {
  id: number;           // Step number (1-8)
  title: string;        // Step title
  description: string;  // Step description
  status: StepStatus;   // 'pending' | 'current' | 'completed'
}
```

## Components

### WizardLayout

Main container component that manages responsive layout.

```typescript
import { WizardLayout, WizardContent } from '@/components/wizard-layout';

<WizardLayout title="Loan Application">
  {/* Your step content here */}
</WizardLayout>
```

**Props:**
- `children`: React.ReactNode - Step content
- `title`: string (optional) - Wizard title

### WizardContent

Content wrapper with built-in spacing and styling.

```typescript
<WizardContent title="Step Title" description="Step description">
  {/* Your form fields here */}
</WizardContent>
```

**Props:**
- `children`: React.ReactNode - Content
- `title`: string (optional) - Section title
- `description`: string (optional) - Section description

### ProgressBar

Sticky progress bar showing current step and completion percentage.

**Features:**
- Sticky to top (z-index 40)
- Shows "Step X of 8" and percentage
- Gradient animation for progress fill

### StepSidebar

Desktop-only sticky sidebar showing all steps.

**Features:**
- Sticky positioning (top: 80px on desktop)
- Step completion indicators
- Progress summary card
- Click to navigate to completed/previous steps
- Current step indicator with pulse animation

### MobileNavigation

Mobile-only sticky bottom navigation.

**Features:**
- Sticky to bottom (z-index 50)
- Previous/Next buttons
- Step indicator dots
- Current step name display

### StepIndicator

Reusable circular step indicator component.

```typescript
import { StepIndicator } from '@/components/step-indicator';

<StepIndicator
  stepNumber={1}
  status="current"
  size="md"
  onClick={() => goToStep(1)}
  disabled={false}
/>
```

**Props:**
- `stepNumber`: number - Step number
- `status`: 'pending' | 'current' | 'completed'
- `isActive`: boolean (optional) - Whether this step is active
- `onClick`: () => void (optional) - Click handler
- `disabled`: boolean (optional) - Disable interaction
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

## Color Palette

The wizard uses the LendSwift blue-white-emerald theme:

- **Primary (Blue)**: `oklch(0.35 0.15 260)` - Current step indicator
- **Accent (Emerald)**: `oklch(0.60 0.16 165)` - Completed steps and focus rings
- **Muted (Gray)**: `oklch(0.92 0 0)` - Pending steps

## Responsive Breakpoints

- **Mobile** (`<768px`): 
  - Hides sidebar
  - Shows sticky progress bar (top)
  - Shows sticky bottom navigation
  - Full-width content

- **Desktop** (`≥768px`):
  - Shows sticky sidebar (280px fixed width)
  - Shows progress bar (top)
  - 2-column layout
  - Bottom navigation hidden

## Accessibility

### WCAG 2.1 AA Compliance

- **Focus Ring**: 4px emerald border with 8px offset
- **Keyboard Navigation**: 
  - Tab through interactive elements
  - Enter to select/activate
  - Arrow keys for radio buttons
- **Screen Reader**: 
  - Step status indicators
  - Aria labels on buttons
  - Semantic HTML structure

### Touch Targets

- Minimum 48px tap targets on mobile
- Adequate padding between interactive elements

## Micro-interactions

All transitions use 200ms `ease-out` timing:

- Step indicator scale: 1 → 1.1 on hover
- Progress bar fill: smooth width animation
- Sidebar connector: fade in/out
- Button states: hover and active transforms

## Usage Example

```typescript
'use client';

import { WizardLayout, WizardContent } from '@/components/wizard-layout';
import { useStepStore } from '@/lib/store/step-store';
import { FormInput } from '@/components/form-input';
import { Button } from '@/components/ui/button';

export default function MyWizard() {
  const { currentStep, nextStep, previousStep, isLastStep } = useStepStore();

  const handleNext = () => {
    // Your validation logic here
    nextStep();
  };

  return (
    <WizardLayout title="My Custom Wizard">
      {currentStep === 1 && (
        <WizardContent title="Step 1" description="Your details">
          <FormInput label="Name" placeholder="Enter your name" />
          <Button onClick={handleNext}>Next</Button>
        </WizardContent>
      )}
      {/* Additional steps... */}
    </WizardLayout>
  );
}
```

## Customization

### Adding Custom Steps

Modify `TOTAL_STEPS` and `initializeSteps()` in `lib/store/step-store.ts`:

```typescript
const TOTAL_STEPS = 10;

const initializeSteps = (): Step[] => [
  { id: 1, title: 'Step 1', description: 'Description', status: 'current' },
  { id: 2, title: 'Step 2', description: 'Description', status: 'pending' },
  // ... add more steps
];
```

### Custom Styling

All components use Tailwind CSS and respect the LendSwift design tokens:

```typescript
// Colors
--primary      // Blue
--accent       // Emerald
--muted        // Gray
--border       // Borders
--background   // White

// Spacing
--radius       // Border radius (0.625rem)
```

## localStorage Integration

The wizard state persists automatically via Zustand's `persist` middleware:

- **Key**: `lendswift-wizard-store`
- **Version**: 1
- **Data**: All steps and currentStep

To clear stored state:

```typescript
localStorage.removeItem('lendswift-wizard-store');
useStepStore.setState({ currentStep: 1, steps: initializeSteps() });
```

## Performance Considerations

- **Code Splitting**: Wizard page loaded separately from main showcase
- **CSS-in-JS**: All animations use CSS transitions (GPU-accelerated)
- **State Management**: Zustand minimizes re-renders with selector pattern
- **Lazy Loading**: Mobile navigation hidden via `display: none` on desktop

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14+
- Android Chrome 90+

## Future Enhancements

- [ ] Step skipping for conditional workflows
- [ ] Autosave form data per step
- [ ] Multi-tenant wizard configurations
- [ ] Analytics/tracking integration
- [ ] Progress recovery from localStorage
