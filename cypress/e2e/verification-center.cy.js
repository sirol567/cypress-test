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

    // Step 2: Navigate to Dashboard
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('[data-cy="my-dashboard-button"]').click();
    cy.url({ timeout: 10000 }).should('include', '/dashboard');

    // Step 3: Check and click Verification Center if exists
    cy.get('[data-cy="insights-sidebar-group"]', { timeout: 10000 }).then(($el) => {
      const link = $el.find('a:contains("Verification Center")');
      if (link.length > 0) {
        cy.wrap(link).click();
        cy.get('#data\\.document_type-passport').click();
        cy.get('[data-cy="verification-front-side"] > .h-full > .filepond--root > .filepond--drop-label' ,{timeout:10000}).click();
        cy.get('[data-cy="verification-front-side"] input[type="file"]').attachFile('books.jpg');
        cy.get('[data-cy="verification-back-side"] > .h-full > .filepond--root > .filepond--drop-label').click();
        cy.get('[data-cy="verification-back-side"] input[type="file"]').attachFile('books.jpg');


        // cy.get('[data-cy="submit-verification"]', { timeout: 20000 })
        // .should('not.be.disabled') // Wait until the button becomes enabled
        // .click();
          }else{  
            cy.log('Verification Center link not found inside insights-sidebar-group');
      }
    });
  });
});
