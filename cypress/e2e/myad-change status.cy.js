// Prevent test from failing on uncaught exceptions
Cypress.on('uncaught:exception', () => false);

describe('From homepage navigate to ad details page - Flow Test', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    cy.get('body').should('be.visible');
  });

  it('login and navigate to edit ad', () => {
    // Step 1: Login
    cy.get('[data-cy="header-login-button"]').click();
    cy.url().should('include', '/login');
    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
cy.wait(1000)
    // Step 2: Navigate to Dashboard
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('[data-cy="my-dashboard-button"]').click();
    cy.url().should('include', '/dashboard', { timeout: 10000 });

    // Step 3: Open Ad and Click Edit
    cy.get('[data-cy="ad-sidebar-group"]', { timeout: 10000 }).then(($ads) => {
      if ($ads.length > 0) {
        cy.log('Engagements exist');
        cy.get('[data-cy="ad-sidebar-group"]').eq(0).click();

        cy.get('[data-cy="myad-actions"]').eq(1).click();
      // Step 1: Click to open the popup
cy.get('[data-cy="myad-update-status"]').eq(1).click({force:true});

// Step 2: Wait for the select dropdown to be visible in the popup
cy.get('[data-cy="myad-status"]', { timeout: 100000 }).should('be.visible');

// Step 3:values are(draft,active,sold,expired,deactivated,pending,) 
//Select the value 'sold'
cy.get('#mountedTableActionsData\\.0\\.status').select('sold');
cy.get('[data-cy="confirm-update-status"]').click();
      } else {
        cy.log('Ad sidebar is not found');
      }
    });
  });
});
