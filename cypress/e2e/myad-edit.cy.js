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

        cy.get('[data-cy="myad-actions"]').first().click();
        cy.get('[data-cy="myad-edit"]').first().click();

        // Optional wait or assertion for the edit page to load
        cy.url().should('include', '/post-ad');
        cy.wait(1000); // Can be replaced by a better wait (e.g., form field visible)
        cy.get('[data-cy="post-ad-cancel"]').click();
      } else {
        cy.log('Ad sidebar is not found');
      }
    });
  });
});
