
describe('Login and Packages Interaction', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    Cypress.on('uncaught:exception', () => false); // Ignore app errors
  });

  it('logs in, checks engagement, package availability, and mocks Stripe payment', () => {
    // Step 1: Login
    cy.get('[data-cy="post-ad-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
    cy.wait(1000);

    // Step 2: Navigate to Dashboard
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('[data-cy="my-dashboard-button"]').click();
    cy.url().should('include', '/dashboard');

    // Step 3: Check Engagements
    cy.get('[data-group-label="Engagements"]').then(($engagement) => {
      if ($engagement.length > 0) {
        cy.log(' Engagements exist');

        // Step 4: Check if "My Packages" submodule is available
        cy.request({
          url: 'https://test.adfox.saasforest.com/dashboard/my-packages',
          failOnStatusCode: false,
        }).then((response) => {
          if (response.status === 200) {
            cy.log('Packages submodule available');

            // Step 5: Visit Packages page and interact
            cy.visit('https://test.adfox.saasforest.com/dashboard/my-packages');
            cy.get('[data-cy="go_to_packages"]').click();
            cy.wait(1000);

            cy.get('body').then(($body) => {
              const $container = $body.find('[data-cy="package-container-1"]');

              if ($container.length > 0) {
                cy.log(' Package container found');

                if ($container.find('[data-cy="package-item"]').length > 0) {
                  cy.log('Packages listed inside the container');

                  // Step 6: Click second package and proceed with payment
                  cy.get('[data-cy="package-container-1"]')
                    .find('[data-cy="ad-count-packages"]')
                    .find('[data-cy="package-item"]')
                    .eq(1)
                    .click();

                  cy.get('[data-cy="proceed-with-payment"]').click();
                  cy.wait(1000)
                  cy.get('#payment_method-offline_advance\\ booking').check({ force: true });
                  cy.get('[data-cy="offline-payment-confirm"]').click();
                  cy.wait(3000)
                } else {
                  cy.log(' No packages found ');
                }
              } else {
                cy.log(' Package container not found');
              }
            });
          } else {
            cy.log(' My Packages submodule not available — packages disabled');
          }
        });
      } else {
        cy.log(' No engagements available');
      }
    });
  });
});
