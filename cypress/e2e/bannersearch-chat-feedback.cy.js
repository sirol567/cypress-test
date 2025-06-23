describe('Login and Proceed with bannersearch input and share feedback ', () => {
    beforeEach(() => {
      // Visit homepage
      cy.visit('https://test.adfox.saasforest.com/');
      // Wait for page to load instead of fixed time
      cy.get('body').should('be.visible');
    });
      
    // Ignore any unexpected JS errors from the site
    Cypress.on('uncaught:exception', () => false);
      
    it('logs in and search', () => {
      // CHANGE THIS WORD TO ANYTHING YOU WANT TO SEARCH
      const searchKeyword = 'smartphone';
          
      // Click on Login link
      cy.get('[data-cy="header-login-button"]', { timeout: 10000 })
        .should('be.visible')
        .click();
          
      // Login process
      cy.url().should('include', '/login');
      cy.get('#email').type('admin@adfox.com');
      cy.get('#password').type('password');
      cy.get('#remember-me').click();
      cy.get('.inline-flex').click();
          
      // Wait for redirect after login - checking for search input instead of fixed wait
      cy.get('[data-cy="perform-search-input"]', { timeout: 10000 }).should('be.visible');
          
      // Type the search keyword and press enter
      cy.get('[data-cy="perform-search-input"]')
        .clear()
        .type(`${searchKeyword}{enter}`);
          
      // Wait for search results container to load
      cy.get('.col-span-12', { timeout: 15000 }).should('exist');
      cy.wait(2000); // Short wait for ads to fully load
          
      // Check if ad items exist after search
      cy.get('body').then($body => {
        const adItemsExist = $body.find('[data-cy="ad-item"]').length > 0;
        
        if (!adItemsExist) {
          cy.log('No ads found for the search keyword: ' + searchKeyword);
        } else {
          cy.log('Ads found for the search keyword: ' + searchKeyword);
          
          // Get the number of ads found
          cy.get('[data-cy="ad-item"]').then($ads => {
            cy.log(`Found ${$ads.length} ad items`);
            
            // Click on the first ad
            cy.get('[data-cy="ad-item"]').first().scrollIntoView().click();
            
            // Verify navigation to ad detail page
            cy.url().should('include', '/ad/');
            cy.get('.border-t-0 > .text-center > [data-cy="chat-with-owner"]').click();
            cy.get('#live-chat-message-textarea').type('hi{enter}');
            cy.get('.relative > .cursor-pointer').click();
            cy.get('[data-cy="feedback"]').click();
            
            // Check if "leave-feedback" button is available before clicking
            cy.get('body').then($body => {
              if ($body.find('[data-cy="leave-feedback"]').length > 0) {
                // If the "leave-feedback" button is available, click it
                cy.get('[data-cy="leave-feedback"]', { timeout: 10000 }).click();
                cy.get('input[type="radio"][value="neutral"]').check({ force: true });
                cy.get('[data-cy="interaction"] select', { timeout: 10000 }).select('successful_purchase');
                cy.get('[data-cy="detailed-feedback"] textarea').type('test');
                cy.get('[data-cy="send-feedback"]').click();
              } else {
                cy.log('feedback already submitted.');
              }
            });
            
            cy.get('[data-cy="feedback-like-button"]').click();
          });
        }
      });
    });
  });
  