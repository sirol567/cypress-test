describe('Login and Click AdType or Category from Homepage', () => {
    beforeEach(() => {
      cy.visit('https://test.adfox.saasforest.com/');
    });
  
    Cypress.on('uncaught:exception', () => false);
  
    it('logs in and clicks second AdType if present, otherwise logs absence', () => {
      cy.get('[data-cy="header-login-button"]').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.get('#email').type('admin@adfox.com');
      cy.get('#password').type('password');
      cy.get('#remember-me').click();
      cy.get('.inline-flex').click();
  
      cy.get('ul[x-ref="adTypeScrollContainer"] li a[data-cy="ad-type"]')
      .eq(0)
      .then($el => {
        if ($el.length > 0) {
          cy.wrap($el).click();
          cy.get('[data-cy="filter-grid-view"]').click();
          cy.wait(3000)
          cy.get('[data-cy="filter-list-view"]').click();
        } else {
          cy.log('No ad types available to select.');
        }
      });
      });
    
    })
  