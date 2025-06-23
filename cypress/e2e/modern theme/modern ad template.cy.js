describe('Login and Favorites Functionality', () => {
    
    beforeEach(() => {
      // Visit homepage
      cy.visit('https://test.adfox.saasforest.com/' ,{timeout:10000});
      // Wait for page to load instead of fixed time
      cy.get('body').should('be.visible');
    });
  
    // Ignore any unexpected JS errors from the site
    Cypress.on('uncaught:exception', () => false);
    it('logs in and search', () => {
      // Click on Login link
      cy.get('[data-cy="login-button"]')
             .should('be.visible')
        .click();
  
      // Login process
      cy.url().should('include', '/login');
      cy.get('#email').type('admin@adfox.com');
      cy.get('#password').type('password');
      cy.get('#remember-me').click();
      cy.get('.inline-flex').first().click();
      cy.wait(3000)
      // Scroll to center to ensure ads are in view
      cy.scrollTo('center',{timeout:10000});
      
      // Step 1: Add the second ad to favorites
      cy.get('[data-cy="ad-item"]:visible', { timeout: 10000 }).then($ads => {
        if ($ads.length > 1) {
          cy.get('[data-cy="ad-item"]:visible').eq(1).within(() => {
            cy.get('[data-cy="ad-favourite"]').click();
          });
          cy.wait(1000);
          cy.log('Successfully added ad to favorites');
        } else {
          cy.log('Not enough ads available to select the second one');
        }
      });
      
      // Step 2: Navigate to favorites page
      cy.get('[data-cy="user-menu-button"]').click();
      cy.get('[data-cy="my-favorites-button"]').click();
      
      // Verify we're on the favorites page
      cy.url().should('include', '/my-favorites');
      
      // Step 3: Remove the ad from favorites
      cy.get('[data-cy="ad-item"]:visible', { timeout: 10000 }).then($favoriteAds => {
        if ($favoriteAds.length > 0) {
          // If there are multiple ads, use the ad at index 1 (second ad)
          if ($favoriteAds.length > 1) {
            cy.get('[data-cy="ad-item"]:visible').eq(1).within(() => {
              cy.get('[data-cy="ad-favourite"]').click();
            });
            cy.log('Successfully removed ad from favorites');
          } else {
            // If there's only one ad, use that one
            cy.get('[data-cy="ad-item"]:visible').eq(0).within(() => {
              cy.get('[data-cy="ad-favourite"]').click();
            });
            cy.log('Successfully removed ad from favorites');
          }
          cy.wait(5000);
        } else {
          cy.log('No favorite ads found on the favorites page');
        }
      });
    });
  });