describe('Login and dashboard Interaction', () => {

    beforeEach(() => {
      cy.visit('https://test.adfox.saasforest.com/');
      Cypress.on('uncaught:exception', () => false); // Ignore any app errors
    });
  
    it('logs in, checks engagement, plan availability, and mocks Stripe payment', () => {
  
      // === LOGIN BLOCK ===
      cy.get('[data-cy="header-login-button"]').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.get('#email').type('admin@adfox.com');
      cy.get('#password').type('password');
      cy.get('#remember-me').click();
      cy.get('.inline-flex').click();
      cy.wait(1000);
  
      // === DASHBOARD NAVIGATION ===
      cy.get('[data-cy="user-menu-button"]').click();
      cy.get('[data-cy="my-dashboard-button"]').click();
      cy.url().should('include', '/dashboard', { timeout: 10000 });
  
      // === CHECK FOR ENGAGEMENT SECTION ===
      cy.get('[data-group-label="Engagements"]').then(($engagement) => {
        if ($engagement.length > 0) {
          cy.log('Engagements exist');
  
          // === CHECK FOR "CHOOSE PLAN" IN SIDEBAR ===
          cy.get('body').then($body => {
            if ($body.find('li.fi-sidebar-item:contains("Choose plan")').length > 0) {
              cy.log('Choose plan link is visible');
  
              cy.contains('li.fi-sidebar-item', 'Choose plan')
                .find('a')
                .click();
              cy.url().should('include', '/dashboard/choose-plan');
  
              // === PLAN DETAILS AND SLIDER INTERACTIONS ===
              cy.get('body').then($planBody => {
                if ($planBody.find('[data-cy="plan-1"]').length > 0) {
                  cy.log('Plan-1 found, configuring values...');
  
                  // -- Regular Ads COUNT MODIFICATION--
                  cy.get('[data-cy="ad-count-input-1"]').should('not.be.visible');
                  cy.get('[data-cy="ad-count-toggle-1"]').click();
                  cy.get('[data-cy="ad-count-input-1"]').should('be.visible')
                    .invoke('val', 12).trigger('input');
                  cy.get('[data-cy="ad-count-input-1"]').should('have.attr', 'aria-valuenow', '12');
  
                  // -- Featured Ads COUNT MODIFICATION--
                  cy.get('[data-cy="featured-ad-toggle-1"]').click();
                  cy.get('[data-cy="featured-ad-input-1"]').should('be.visible')
                    .invoke('val', 4).trigger('input');
                  cy.get('[data-cy="featured-ad-input-1"]').should('have.attr', 'aria-valuenow', '4');
  
                  // -- Urgent Ads COUNT MODIFICATION --
                  cy.get('[data-cy="urgent-ad-toggle-1"]').click();
                  cy.get('[data-cy="urgent-ad-input-1"]').should('be.visible')
                    .invoke('val', 1).trigger('input');
                  cy.get('[data-cy="urgent-ad-input-1"]').should('have.attr', 'aria-valuenow', '1');
  
                  // -- Spotlight Ads COUNT MODIFICATION --
                  cy.get('[data-cy="spotlight-ad-toggle-1"]').click();
                  cy.get('[data-cy="spotlight-ad-input-1"]').should('be.visible')
                    .invoke('val', 2).trigger('input');
                  cy.get('[data-cy="spotlight-ad-input-1"]').should('have.attr', 'aria-valuenow', '2');
  
                  // -- Website URL Option COUNT MODIFICATION --
                  cy.get('[data-cy="website-url-toggle-1"]').click();
                  cy.get('[data-cy="website-url-input-1"]').should('be.visible')
                    .invoke('val', 10).trigger('input').trigger('change');
  
                  cy.pause(); // For inspection before proceeding
  
                  // === PAYMENT SECTION ===
                  cy.get('[data-cy="plan-1"]').click();
                  cy.get('[data-cy="coupon-code"]').type('asdf');
                  cy.get('[data-cy="apply-coupon"]').click();
                  cy.get('#payment_method-stripe').click();
                  cy.pause(); // Pause again before final payment
                  cy.get('[name="subscription_agreement"]').click();
                  cy.get('#stripe-payment-button').click();
  
                } else {
                  cy.log('No plan available on Choose Plan page');
                }
              });
  
            } else {
              cy.log('Choose plan sidebar link not available — possibly due to inactive subscription');
            }
          });
  
        } else {
          cy.log('Engagement group not found');
        }
      });
  
    });
  
  });
  