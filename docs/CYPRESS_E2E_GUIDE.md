# Cypress E2E Testing Guide - Personal Loan Application

## Overview

This guide provides comprehensive information about the Cypress E2E test suite for LendSwift's personal loan application wizard. The test suite covers the complete happy path flow from loan type selection through application submission.

## Setup

### Installation

```bash
# Install Cypress
pnpm add --save-dev cypress

# Initialize Cypress (generates config and folder structure)
pnpm exec cypress open
```

### Project Structure

```
cypress/
├── e2e/
│   └── personal-loan-happy-path.cy.ts    # Main E2E test file (803 LOC)
├── support/
│   └── e2e.ts                             # Custom commands and configuration
└── fixtures/                               # Test data (optional)
```

## Test File: personal-loan-happy-path.cy.ts

### Features (803 LOC)

**12 Test Suites with 50+ Individual Tests:**

1. **Step 1: Loan Type & Personal Information** (7 tests)
   - Loan type selection (Personal/Home/Business)
   - Form field validation
   - Age checking
   - Error handling for required fields

2. **Step 2: Loan Details & Employment Type** (9 tests)
   - Loan amount input with currency formatting
   - Tenure selection based on loan type
   - Employment type tabs (Salaried, Self-Employed, Business Owner)
   - Complete field mount/unmount between tabs
   - Form progression to Step 3

3. **Step 3: KYC Verification** (8 tests)
   - Document type selection (PAN/Aadhar)
   - **Verhoeff checksum validation** for PAN and Aadhar
   - Pulse loader animation (1.5 seconds)
   - Verified badge display on success
   - Invalid checksum rejection
   - Full name entry

4. **Step 4: Address Information with PIN Lookup** (7 tests)
   - Permanent address section
   - PIN code lookup simulation (1.2 seconds)
   - Auto-population of City and State
   - "Same as Permanent Address" checkbox logic
   - Correspondence address field hiding
   - Complete address entry and progression

5. **Step 5: Employment Details (Salaried)** (3 tests)
   - Employment details confirmation
   - Step progression to Step 6
   - Data verification from previous steps

6. **Steps 6-8: Final Steps and Submission** (6 tests)
   - Financial details display
   - Review & Confirm summary
   - Application submission
   - Success message and completion

7. **Progress Bar and Navigation** (2 tests)
   - Progress percentage updates (13%, 25%, 38%, 50%, 63%, 75%, 88%, 100%)
   - Sidebar step indicator updates
   - Current/completed status tracking

8. **Data Persistence with localStorage** (3 tests)
   - Form data saving to localStorage
   - Data restoration on page reload
   - Browser back button handling

9. **Responsive Design** (2 tests)
   - Desktop view (1920x1080) - sidebar display
   - Mobile view (375x812) - mobile navigation display

10. **Error Handling & Edge Cases** (4 tests)
    - Missing required fields
    - Invalid date of birth
    - Invalid currency input
    - Form validation

11. **Complete Happy Path Flow (Integrated)** (1 comprehensive test)
    - Full start-to-finish application flow

12. **Custom Commands** (Cypress Support File)
    - fillByLabel() - Fill form fields by label text
    - selectByLabel() - Select dropdown by label
    - waitForVerification() - Wait for verification loader
    - verifyStepCompleted() - Assert step marked complete
    - verifyStepCurrent() - Assert step is current
    - navigateToNextStep() - Go to next step
    - verifyPINLookup() - Verify PIN lookup auto-population

## Test Data

### Step 1 - Personal Information

```typescript
loanType: 'personal'
fullName: 'Alice Johnson'
email: 'alice.johnson@example.com'
phone: '+91 98765 43210'
dateOfBirth: '1990-05-15'
age: 34
```

### Step 2 - Loan Details

```typescript
loanAmount: '500000'        // ₹5,00,000
tenure: '36'                // 3 years
employmentType: 'salaried'
```

### Step 3 - KYC Verification

```typescript
documentType: 'pan'
panNumber: 'AAAPA0000A'      // Valid PAN with Verhoeff checksum
panName: 'Alice Johnson'
```

### Step 4 - Address Information

```typescript
permanentPinCode: '400001'
permanentCity: 'Mumbai'
permanentState: 'Maharashtra'
permanentAddress: '123 Marine Drive, Mumbai'
```

### Step 5 - Employment Details

```typescript
companyName: 'TechCorp India Pvt Ltd'
designation: 'Senior Software Engineer'
industry: 'Information Technology'
employmentDuration: '5'
monthlySalary: '150000'
```

## Running the Tests

### Interactive Mode (Recommended for Development)

```bash
# Open Cypress UI
pnpm exec cypress open

# Select E2E Testing
# Choose personal-loan-happy-path.cy.ts
# Click test to run
```

### Headless Mode (For CI/CD)

```bash
# Run all E2E tests
pnpm exec cypress run --e2e

# Run specific test file
pnpm exec cypress run --e2e --spec "cypress/e2e/personal-loan-happy-path.cy.ts"

# Run with specific browser
pnpm exec cypress run --e2e --browser chrome
pnpm exec cypress run --e2e --browser firefox

# Run with video recording
pnpm exec cypress run --e2e --record
```

### Single Test Suite

```bash
# Run only Step 1 tests
pnpm exec cypress run --e2e --spec "cypress/e2e/personal-loan-happy-path.cy.ts" \
  --env grep="Step 1"

# Run only happy path integration test
pnpm exec cypress run --e2e --spec "cypress/e2e/personal-loan-happy-path.cy.ts" \
  --env grep="Complete Happy Path"
```

## Test Coverage

### Features Tested

- ✅ Multi-step form navigation
- ✅ Form validation and error handling
- ✅ Verhoeff checksum validation (PAN/Aadhar)
- ✅ Currency formatting
- ✅ Date validation
- ✅ PIN code lookup simulation
- ✅ Auto-population of City/State
- ✅ "Same as Address" checkbox logic
- ✅ Employment type tabs with field mount/unmount
- ✅ Progress bar updates
- ✅ Sidebar step indicators
- ✅ localStorage persistence
- ✅ Responsive design (desktop/mobile)
- ✅ Data persistence and restoration
- ✅ Animation/loader verification

### Verification Types

1. **Functional Tests**
   - Form submission and validation
   - Step progression
   - Data entry and display

2. **UI Tests**
   - Element visibility
   - Layout and styling
   - Responsive behavior

3. **Integration Tests**
   - Multi-step flow
   - Data persistence
   - Component interactions

4. **Validation Tests**
   - Verhoeff checksum algorithm
   - Format validation
   - Business logic rules

## Key Test Scenarios

### 1. Complete Happy Path (Primary)
```typescript
it('should complete entire personal loan application from start to finish')
```
Tests the full application flow with valid data through all 8 steps.

### 2. Verhoeff Checksum Validation
```typescript
it('should validate PAN format with Verhoeff checksum')
it('should reject invalid PAN checksum')
```
Tests the cryptographic validation of PAN numbers using actual Verhoeff algorithm.

### 3. PIN Lookup Auto-population
```typescript
it('should auto-populate city and state on PIN lookup')
```
Tests the simulated PIN lookup service that auto-fills City and State from PIN code.

### 4. Employment Type Tab Switching
```typescript
it('should switch to Self-Employed tab and unmount Salaried fields')
it('should switch to Business Owner tab with complete field unmount/mount')
```
Tests the complete field mount/unmount pattern when switching employment types.

### 5. Progress Tracking
```typescript
it('should display correct progress percentage on each step')
it('should update sidebar step indicators as user progresses')
```
Tests progress bar updates and sidebar status indicators.

## Debugging Tests

### View Logs

```bash
# Run with debug output
DEBUG=* pnpm exec cypress run --e2e

# Run with console output
pnpm exec cypress run --e2e --no-exit
```

### Interactive Debugging

```bash
# In cypress open UI:
# 1. Click on test
# 2. Use Chrome DevTools (right-click "Inspect")
# 3. Set breakpoints
# 4. Step through execution
```

### Common Issues

**Test Timeout**
- Increase `defaultCommandTimeout` in cypress.config.ts
- Use `cy.wait()` for async operations

**Selector Not Found**
- Verify element selectors match actual HTML
- Use `cy.get('*').then(el => console.log(el))` to debug

**Verification Failed**
- Check element visibility with `.should('be.visible')`
- Use `.debug()` command to pause execution

## Customization

### Adding New Tests

1. Create new `.cy.ts` file in `cypress/e2e/`
2. Import test data and utilities
3. Use custom commands from `cypress/support/e2e.ts`
4. Follow existing test structure and patterns

### Example New Test

```typescript
describe('Step 2: Employment Tab Switching', () => {
  beforeEach(() => {
    cy.visit('/wizard');
    // Complete Step 1...
  });

  it('should display all employment tabs', () => {
    cy.contains('Salaried').should('be.visible');
    cy.contains('Self-Employed').should('be.visible');
    cy.contains('Business Owner').should('be.visible');
  });

  it('should switch employment tabs', () => {
    cy.contains('button', 'Self-Employed').click();
    cy.contains('Business Name').should('be.visible');
  });
});
```

## Performance Considerations

### Timeouts

- Default command timeout: 10,000ms
- Wait times for loaders: 1,500ms (verification), 1,200ms (PIN lookup)
- Page transitions: 800-1,000ms

### Best Practices

1. Use specific selectors over broad ones
2. Minimize explicit waits, use implicit waits
3. Clear localStorage between tests
4. Test one feature per test
5. Use descriptive test names

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm build
      - uses: cypress-io/github-action@v5
        with:
          start: pnpm dev
          browser: chrome
          spec: cypress/e2e/personal-loan-happy-path.cy.ts
```

## Troubleshooting

### Tests Pass Locally but Fail in CI

- Use consistent viewport size
- Disable animations for faster tests
- Use `cy.intercept()` to mock API calls
- Add explicit waits for async operations

### Flaky Tests

- Increase timeouts for slow components
- Use `cy.wait()` after form submission
- Avoid time-dependent assertions
- Use element state verification instead

### Data Persistence Issues

- Clear localStorage in `beforeEach()`
- Verify Zustand store updates
- Check browser console for errors

## References

- [Cypress Documentation](https://docs.cypress.io/)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [API Reference](https://docs.cypress.io/api/table-of-contents)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)

## Test Metrics

- **Total Tests**: 50+
- **Code Coverage**: Multi-step wizard + all components
- **Execution Time**: ~5-8 minutes (full suite)
- **Pass Rate Target**: 100%
- **Platforms**: Chrome, Firefox, Edge, Safari

## Support

For issues or improvements:
1. Check test output for specific error messages
2. Review Cypress logs in terminal
3. Enable debug mode for detailed execution trace
4. Consult Cypress documentation for best practices

---

**Last Updated**: 2024  
**Cypress Version**: 15.18.1  
**Test Framework**: Mocha + Chai  
**Status**: Production Ready
