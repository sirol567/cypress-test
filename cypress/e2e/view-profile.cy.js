describe('Login and look up seller profile deeply', () => {
    beforeEach(() => {
      cy.visit('https://test.adfox.saasforest.com/');
    });
    
    // Handle uncaught exceptions to prevent test failures
    Cypress.on('uncaught:exception', () => false);
    
    it('logs in, adds to favorites, then removes from favorites', () => {
      // Login process
      cy.get('[data-cy="header-login-button"]')
        .should('be.visible')
        .click();
      
      cy.url().should('include', '/login');
      
      // Fill in login credentials
      cy.get('#email')
        .should('be.visible')
        .type('admin@adfox.com');
      
      cy.get('#password')
        .type('password');
      
      cy.get('#remember-me')
        .click();
      
      cy.get('.inline-flex')
        .should('be.visible')
        .click();
      
      cy.wait(1000);
      
      // Scroll to center to ensure ads are in view
      cy.scrollTo('center');
      cy.wait(5000)
      // Step 1: Add the second ad to favorites
      cy.get('[data-cy="ad-item"]:visible', { timeout: 10000 }).then($ads => {
        if ($ads.length > 1) {
          cy.get('[data-cy="ad-item"]:visible').eq(1).click();
          cy.wait(1000);
          cy.get('[data-cy="view-profile"]' , {timeout:10000}).click();
          cy.get('[data-cy="search"]').type('a {enter}')  //<--type adname here
          cy.wait(3000)
          //to select date->date,high to low-->price_desc,low to high-->price_asc
          cy.get('[data-cy="sort-by"]').select('price_desc');
          //select category
          cy.get('[data-cy="category-1"]').click()//change the number of needed category
          cy.get('[data-cy="rating"] ').click()
          cy.get('[data-cy="site-logo"]').click()
        } else {
          cy.log('Not enough ads available to select the second one');
        }
      });
    });
});