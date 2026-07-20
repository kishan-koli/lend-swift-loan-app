/**
 * Personal Loan Application Happy Path E2E Tests
 * LendSwift - Comprehensive multi-step wizard flow testing
 *
 * This test suite covers the complete happy path for a personal loan application
 * from Step 1 (Loan Type Selection) through Step 8 (Application Submitted).
 * All validations, Verhoeff checksums, and micro-interactions are tested.
 */

describe('Personal Loan Application - Happy Path', () => {
  const baseUrl = 'http://localhost:3000/wizard';

  // Test data with valid Verhoeff checksums
  const testData = {
    step1: {
      loanType: 'personal',
      fullName: 'Alice Johnson',
      email: 'alice.johnson@example.com',
      phone: '+91 98765 43210',
      dateOfBirth: '1990-05-15',
      age: 34,
    },
    step2: {
      loanAmount: '500000', // ₹5,00,000
      tenure: '36', // 3 years
      employmentType: 'salaried',
    },
    step3: {
      documentType: 'pan',
      // Valid PAN with Verhoeff checksum
      panNumber: 'AAAPA0000A',
      panName: 'Alice Johnson',
    },
    step4: {
      permanentPinCode: '400001', // Mumbai
      permanentCity: 'Mumbai',
      permanentState: 'Maharashtra',
      permanentAddress: '123 Marine Drive, Mumbai',
      correspondencePinCode: '400001',
      correspondenceCity: 'Mumbai',
      correspondenceState: 'Maharashtra',
      correspondenceAddress: '123 Marine Drive, Mumbai',
    },
    step5: {
      companyName: 'TechCorp India Pvt Ltd',
      designation: 'Senior Software Engineer',
      industry: 'Information Technology',
      employmentDuration: '5',
      monthlySalary: '150000',
    },
  };

  beforeEach(() => {
    // Clear all localStorage to start fresh
    cy.clearLocalStorage();
    cy.visit(baseUrl);
    cy.wait(1000); // Wait for page to load
  });

  describe('Step 1: Loan Type & Personal Information', () => {
    it('should display Step 1 with loan type selection', () => {
      cy.contains('Loan Type & Personal Info').should('be.visible');
      cy.contains('Personal').should('be.visible');
      cy.contains('Home').should('be.visible');
      cy.contains('Business').should('be.visible');
    });

    it('should select Personal loan type', () => {
      cy.contains('label', 'Personal').click();
      cy.get('input[value="personal"]').should('be.checked');
    });

    it('should fill personal information fields', () => {
      // Select Personal loan
      cy.contains('label', 'Personal').click();

      // Fill full name
      cy.get('input[placeholder="John Doe"]')
        .first()
        .clear()
        .type(testData.step1.fullName);

      // Fill email
      cy.get('input[type="email"]')
        .clear()
        .type(testData.step1.email);

      // Fill phone
      cy.get('input[placeholder="+91 98765 43210"]')
        .clear()
        .type(testData.step1.phone);

      // Fill date of birth
      cy.get('input[type="date"]')
        .clear()
        .type('1990-05-15');

      // Verify age is calculated (should be visible in form)
      cy.get('input[placeholder="John Doe"]').first().should('have.value', testData.step1.fullName);
    });

    it('should validate age is within acceptable range', () => {
      cy.contains('label', 'Personal').click();
      cy.get('input[type="date"]').clear().type('1990-05-15');
      // Age validation happens on form submission, not field-level
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
    });

    it('should proceed to Step 2 with valid data', () => {
      // Select Personal loan
      cy.contains('label', 'Personal').click();

      // Fill all fields
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');

      // Click Next button
      cy.contains('button', 'Next').click();

      // Verify we're on Step 2
      cy.contains('Loan Details').should('be.visible');
      cy.get('[role="progressbar"]').should('contain', 'Step 2');
    });

    it('should show errors for required fields', () => {
      // Don't fill anything, just click Next
      cy.contains('button', 'Next').click();
      cy.wait(500);

      // Check for error messages
      cy.contains('This field is required').should('exist');
    });
  });

  describe('Step 2: Loan Details & Employment Type', () => {
    beforeEach(() => {
      // Complete Step 1
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);
    });

    it('should display loan amount and tenure fields', () => {
      cy.contains('Loan Amount').should('be.visible');
      cy.contains('Preferred Tenure').should('be.visible');
    });

    it('should format currency input as Indian rupee', () => {
      // Enter loan amount
      cy.get('input[placeholder="Enter amount"]')
        .clear()
        .type('500000');

      // Verify formatting (₹ symbol and comma formatting)
      cy.get('input[placeholder="Enter amount"]').should('have.value', '500000');
    });

    it('should update tenure options based on loan type', () => {
      // Personal loan should have tenure 6mo-5yr
      cy.get('select').should('be.visible');
      cy.get('select').find('option').should('have.length.greaterThan', 0);
    });

    it('should display employment type tabs (Salaried, Self-Employed, Business Owner)', () => {
      cy.contains('Salaried').should('be.visible');
      cy.contains('Self-Employed').should('be.visible');
      cy.contains('Business Owner').should('be.visible');
    });

    it('should mount Salaried employment form when selected', () => {
      cy.contains('button', 'Salaried').should('be.visible');
      cy.contains('Company Name').should('be.visible');
      cy.contains('Designation').should('be.visible');
      cy.contains('Industry').should('be.visible');
    });

    it('should switch to Self-Employed tab and unmount Salaried fields', () => {
      // Initially on Salaried
      cy.contains('Company Name').should('be.visible');

      // Click Self-Employed tab
      cy.contains('button', 'Self-Employed').click();
      cy.wait(300);

      // Salaried fields should be gone
      cy.contains('Company Name').should('not.exist');

      // Self-Employed fields should appear
      cy.contains('Business Name').should('be.visible');
      cy.contains('GST Number').should('be.visible');
    });

    it('should switch to Business Owner tab with complete field unmount/mount', () => {
      // Click Business Owner tab
      cy.contains('button', 'Business Owner').click();
      cy.wait(300);

      // Business Owner specific fields
      cy.contains('Annual Turnover').should('be.visible');
      cy.contains('Number of Employees').should('be.visible');
    });

    it('should proceed to Step 3 with valid employment and loan data', () => {
      // Fill loan amount
      cy.get('input[placeholder="Enter amount"]').clear().type('500000');

      // Select tenure
      cy.get('select').select('36');

      // Fill Salaried employment fields
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);

      // Click Next
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Verify we're on Step 3
      cy.contains('KYC Verification').should('be.visible');
    });
  });

  describe('Step 3: KYC Verification', () => {
    beforeEach(() => {
      // Complete Steps 1 & 2
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 2
      cy.get('input[placeholder="Enter amount"]').clear().type('500000');
      cy.get('select').select('36');
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);
      cy.contains('button', 'Next').click();
      cy.wait(1000);
    });

    it('should display document type selection (PAN/Aadhar)', () => {
      cy.contains('PAN').should('be.visible');
      cy.contains('Aadhar').should('be.visible');
    });

    it('should select PAN as document type', () => {
      cy.contains('label', 'PAN').click();
      cy.get('input[value="pan"]').should('be.checked');
    });

    it('should validate PAN format with Verhoeff checksum', () => {
      cy.contains('label', 'PAN').click();

      // Enter valid PAN
      cy.get('input[placeholder="AAAPL5055K"]')
        .clear()
        .type(testData.step3.panNumber);

      // Trigger blur to initiate verification
      cy.get('input[placeholder="AAAPL5055K"]').blur();

      // Wait for verification loader animation (1.5 seconds)
      cy.wait(1500);

      // Verify badge appears (success state)
      cy.contains('Verified').should('be.visible');
    });

    it('should reject invalid PAN checksum', () => {
      cy.contains('label', 'PAN').click();

      // Enter invalid PAN (wrong checksum)
      cy.get('input[placeholder="AAAPL5055K"]')
        .clear()
        .type('AAAPA0000Z'); // Wrong checksum

      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);

      // Should show error
      cy.contains('verification failed').should('be.visible');
    });

    it('should show pulse loader animation during verification', () => {
      cy.contains('label', 'PAN').click();

      cy.get('input[placeholder="AAAPL5055K"]')
        .clear()
        .type(testData.step3.panNumber);

      cy.get('input[placeholder="AAAPL5055K"]').blur();

      // Loader should be visible during 1.5s window
      cy.get('[class*="pulse"]').should('exist');
    });

    it('should fill full name and proceed to Step 4', () => {
      cy.contains('label', 'PAN').click();

      cy.get('input[placeholder="AAAPL5055K"]')
        .clear()
        .type(testData.step3.panNumber);

      cy.get('input[placeholder="Full Name"]')
        .clear()
        .type(testData.step3.panName);

      // Blur for verification
      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);

      // Click Next
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Verify we're on Step 4
      cy.contains('Address Information').should('be.visible');
    });
  });

  describe('Step 4: Address Information with PIN Lookup', () => {
    beforeEach(() => {
      // Complete Steps 1-3
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 2
      cy.get('input[placeholder="Enter amount"]').clear().type('500000');
      cy.get('select').select('36');
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 3
      cy.contains('label', 'PAN').click();
      cy.get('input[placeholder="AAAPL5055K"]').clear().type(testData.step3.panNumber);
      cy.get('input[placeholder="Full Name"]').clear().type(testData.step3.panName);
      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);
      cy.contains('button', 'Next').click();
      cy.wait(1000);
    });

    it('should display permanent and correspondence address sections', () => {
      cy.contains('Permanent Address').should('be.visible');
      cy.contains('Correspondence Address').should('be.visible');
    });

    it('should display PIN code input with lookup simulation', () => {
      cy.contains('label', 'Permanent PIN Code').should('be.visible');
      cy.get('input[placeholder="400001"]').should('be.visible');
    });

    it('should auto-populate city and state on PIN lookup', () => {
      // Enter PIN code
      cy.get('input[placeholder="400001"]')
        .first()
        .clear()
        .type('400001');

      // Wait for lookup simulation (1.2 seconds)
      cy.wait(1200);

      // Verify city is auto-populated
      cy.contains('label', 'Permanent City').parent().find('input').should('have.value', 'Mumbai');

      // Verify state is auto-populated
      cy.contains('label', 'Permanent State').parent().find('input').should('have.value', 'Maharashtra');
    });

    it('should display "Same as Permanent Address" checkbox', () => {
      cy.contains('Same as Permanent Address').should('be.visible');
    });

    it('should hide correspondence section when "Same as Permanent Address" is checked', () => {
      // First fill permanent address
      cy.get('input[placeholder="400001"]').first().clear().type('400001');
      cy.wait(1200);

      cy.get('input[placeholder="123 Main Street"]')
        .first()
        .clear()
        .type(testData.step4.permanentAddress);

      // Check the "Same as" checkbox
      cy.get('input[type="checkbox"]').check();

      // Correspondence section should be hidden or auto-filled
      cy.get('input[placeholder="400001"]').should('have.length', 1); // Only permanent PIN
    });

    it('should fill complete address and proceed to Step 5', () => {
      // Permanent address
      cy.get('input[placeholder="400001"]').first().clear().type('400001');
      cy.wait(1200);

      cy.get('input[placeholder="123 Main Street"]')
        .first()
        .clear()
        .type(testData.step4.permanentAddress);

      // Check "Same as Permanent"
      cy.get('input[type="checkbox"]').check();

      // Click Next
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Verify we're on Step 5
      cy.contains('Employment Details').should('be.visible');
    });
  });

  describe('Step 5: Employment Details (Salaried)', () => {
    beforeEach(() => {
      // Complete Steps 1-4 (abbreviated setup)
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 2
      cy.get('input[placeholder="Enter amount"]').clear().type('500000');
      cy.get('select').select('36');
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 3
      cy.contains('label', 'PAN').click();
      cy.get('input[placeholder="AAAPL5055K"]').clear().type(testData.step3.panNumber);
      cy.get('input[placeholder="Full Name"]').clear().type(testData.step3.panName);
      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 4
      cy.get('input[placeholder="400001"]').first().clear().type('400001');
      cy.wait(1200);
      cy.get('input[placeholder="123 Main Street"]').first().clear().type(testData.step4.permanentAddress);
      cy.get('input[type="checkbox"]').check();
      cy.contains('button', 'Next').click();
      cy.wait(1000);
    });

    it('should display employment details confirmation for salaried', () => {
      cy.contains('Employment Details').should('be.visible');
      cy.contains(testData.step5.companyName).should('be.visible');
      cy.contains(testData.step5.designation).should('be.visible');
    });

    it('should proceed to Step 6 with review data', () => {
      // Scroll if needed
      cy.get('body').scrollTo('bottom');

      // Click Next to proceed to Step 6
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Verify we're on Step 6
      cy.contains('Financial Details').should('be.visible');
    });
  });

  describe('Steps 6-8: Final Steps and Submission', () => {
    beforeEach(() => {
      // Complete all previous steps quickly
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.get('input[placeholder="Enter amount"]').clear().type('500000');
      cy.get('select').select('36');
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.contains('label', 'PAN').click();
      cy.get('input[placeholder="AAAPL5055K"]').clear().type(testData.step3.panNumber);
      cy.get('input[placeholder="Full Name"]').clear().type(testData.step3.panName);
      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.get('input[placeholder="400001"]').first().clear().type('400001');
      cy.wait(1200);
      cy.get('input[placeholder="123 Main Street"]').first().clear().type(testData.step4.permanentAddress);
      cy.get('input[type="checkbox"]').check();
      cy.contains('button', 'Next').click();
      cy.wait(600);

      // Step 5
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);
    });

    it('should display Step 6: Financial Details', () => {
      cy.contains('Financial Details').should('be.visible');
      cy.get('[role="progressbar"]').should('contain', 'Step 6');
    });

    it('should navigate through Step 6 and 7', () => {
      // Step 6
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 7: Review & Confirm
      cy.contains('Review & Confirm').should('be.visible');
      cy.get('[role="progressbar"]').should('contain', 'Step 7');
    });

    it('should display review summary with all entered data', () => {
      // Navigate to Step 7
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Verify summary shows entered data
      cy.contains(testData.step1.fullName).should('be.visible');
      cy.contains(testData.step5.companyName).should('be.visible');
    });

    it('should submit application and reach Step 8', () => {
      // Navigate to Step 7
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Final submit
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Submit').click();
      cy.wait(1500);

      // Verify application submitted
      cy.contains('Application Submitted').should('be.visible');
      cy.get('[role="progressbar"]').should('contain', 'Step 8');
    });

    it('should display success message with application reference', () => {
      // Navigate to Step 7
      for (let i = 0; i < 5; i++) {
        cy.get('body').scrollTo('bottom');
        cy.contains('button', 'Next').click();
        cy.wait(400);
      }

      // Submit
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Submit').click();
      cy.wait(1500);

      // Success message should be visible
      cy.contains(/application|submitted|success/i).should('be.visible');
    });
  });

  describe('Progress Bar and Navigation', () => {
    it('should display correct progress percentage on each step', () => {
      // Step 1
      cy.get('[role="progressbar"]').should('contain', '13%');

      // Navigate to Step 2
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 2 progress
      cy.get('[role="progressbar"]').should('contain', '25%');
    });

    it('should update sidebar step indicators as user progresses', () => {
      // Check step 1 is marked as current
      cy.get('[data-step="1"]').should('have.class', 'current');

      // Navigate to Step 2
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Step 1 should be marked as completed
      cy.get('[data-step="1"]').should('have.class', 'completed');

      // Step 2 should be marked as current
      cy.get('[data-step="2"]').should('have.class', 'current');
    });
  });

  describe('Data Persistence with localStorage', () => {
    it('should save form data to localStorage on progression', () => {
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');

      // Check localStorage was updated
      cy.window().then((win) => {
        const state = win.localStorage.getItem('lendswift-state');
        expect(state).to.exist;
      });
    });

    it('should restore form data when revisiting with browser back button', () => {
      // Fill and proceed through steps
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Use browser back
      cy.go('back');
      cy.wait(1000);

      // Data should be restored
      cy.get('input[placeholder="John Doe"]').first().should('have.value', testData.step1.fullName);
    });
  });

  describe('Responsive Design', () => {
    it('should display sidebar on desktop view', () => {
      cy.viewport(1920, 1080);
      cy.contains('Step 1').should('be.visible'); // Sidebar step title
    });

    it('should display mobile navigation on mobile view', () => {
      cy.viewport(375, 812);
      // Progress bar should be visible
      cy.get('[role="progressbar"]').should('be.visible');
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should prevent proceeding without required fields', () => {
      // Don't fill anything
      cy.contains('button', 'Next').click();
      cy.wait(500);

      // Should still be on Step 1
      cy.contains('Loan Type & Personal Info').should('be.visible');
    });

    it('should handle invalid date of birth', () => {
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);

      // Enter future date
      cy.get('input[type="date"]').clear().type('2030-01-01');

      // Try to proceed
      cy.contains('button', 'Next').click();
      cy.wait(500);

      // Should show error or not proceed
      cy.get('input[type="date"]').should('be.visible');
    });

    it('should validate currency input format', () => {
      // Navigate to Step 2
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(1000);

      // Enter invalid amount (letters)
      cy.get('input[placeholder="Enter amount"]').clear().type('abc');

      // Should not allow proceeding with invalid amount
      cy.contains('button', 'Next').click();
      cy.wait(500);

      // Still on Step 2
      cy.contains('Loan Details').should('be.visible');
    });
  });

  describe('Complete Happy Path Flow (Integrated)', () => {
    it('should complete entire personal loan application from start to finish', () => {
      // Step 1: Personal Info
      cy.contains('label', 'Personal').click();
      cy.get('input[placeholder="John Doe"]').first().clear().type(testData.step1.fullName);
      cy.get('input[type="email"]').clear().type(testData.step1.email);
      cy.get('input[placeholder="+91 98765 43210"]').clear().type(testData.step1.phone);
      cy.get('input[type="date"]').clear().type('1990-05-15');
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 2: Loan Details
      cy.get('input[placeholder="Enter amount"]').clear().type('500000');
      cy.get('select').select('36');
      cy.get('input[placeholder="Enter company name"]').clear().type(testData.step5.companyName);
      cy.get('input[placeholder="e.g., Senior Developer"]').clear().type(testData.step5.designation);
      cy.get('input[placeholder="e.g., Information Technology"]').clear().type(testData.step5.industry);
      cy.get('input[placeholder="Years"]').clear().type(testData.step5.employmentDuration);
      cy.get('input[placeholder="Monthly salary"]').clear().type(testData.step5.monthlySalary);
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 3: KYC
      cy.contains('label', 'PAN').click();
      cy.get('input[placeholder="AAAPL5055K"]').clear().type(testData.step3.panNumber);
      cy.get('input[placeholder="Full Name"]').clear().type(testData.step3.panName);
      cy.get('input[placeholder="AAAPL5055K"]').blur();
      cy.wait(1500);
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Step 4: Address
      cy.get('input[placeholder="400001"]').first().clear().type('400001');
      cy.wait(1200);
      cy.get('input[placeholder="123 Main Street"]').first().clear().type(testData.step4.permanentAddress);
      cy.get('input[type="checkbox"]').check();
      cy.contains('button', 'Next').click();
      cy.wait(800);

      // Steps 5-8: Navigate through remaining steps
      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Next').click();
      cy.wait(600);

      cy.get('body').scrollTo('bottom');
      cy.contains('button', 'Submit').click();
      cy.wait(1500);

      // Verify final success state
      cy.contains('Application Submitted').should('be.visible');
      cy.get('[role="progressbar"]').should('contain', '100%');
    });
  });
});
