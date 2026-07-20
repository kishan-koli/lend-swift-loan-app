/**
 * Cypress Support File for E2E Tests
 * LendSwift - Global configuration and custom commands
 */

// Disable uncaught exception handling to allow app errors
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

// Custom command to fill form field by label
Cypress.Commands.add(
  'fillByLabel',
  (label: string, value: string) => {
    cy.contains('label', label).parent().find('input').clear().type(value);
  }
);

// Custom command to select by label
Cypress.Commands.add(
  'selectByLabel',
  (label: string, value: string) => {
    cy.contains('label', label).parent().find('select').select(value);
  }
);

// Custom command to wait for verification loader
Cypress.Commands.add(
  'waitForVerification',
  (timeout: number = 1500) => {
    cy.get('[class*="pulse"]', { timeout: 2000 }).should('exist');
    cy.wait(timeout);
  }
);

// Custom command to verify step completion
Cypress.Commands.add(
  'verifyStepCompleted',
  (stepNumber: number) => {
    cy.get(`[data-step="${stepNumber}"]`).should('have.class', 'completed');
  }
);

// Custom command to verify step is current
Cypress.Commands.add(
  'verifyStepCurrent',
  (stepNumber: number) => {
    cy.get(`[data-step="${stepNumber}"]`).should('have.class', 'current');
  }
);

// Custom command to navigate to next step
Cypress.Commands.add(
  'navigateToNextStep',
  () => {
    cy.contains('button', 'Next').click();
    cy.wait(1000);
  }
);

// Custom command to verify PIN lookup
Cypress.Commands.add(
  'verifyPINLookup',
  (pinCode: string, expectedCity: string, expectedState: string) => {
    cy.get('input[placeholder="400001"]').first().clear().type(pinCode);
    cy.wait(1200);
    cy.contains('label', 'City').parent().find('input').should('have.value', expectedCity);
    cy.contains('label', 'State').parent().find('input').should('have.value', expectedState);
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      fillByLabel(label: string, value: string): Chainable<void>;
      selectByLabel(label: string, value: string): Chainable<void>;
      waitForVerification(timeout?: number): Chainable<void>;
      verifyStepCompleted(stepNumber: number): Chainable<void>;
      verifyStepCurrent(stepNumber: number): Chainable<void>;
      navigateToNextStep(): Chainable<void>;
      verifyPINLookup(pinCode: string, city: string, state: string): Chainable<void>;
    }
  }
}

export {};
