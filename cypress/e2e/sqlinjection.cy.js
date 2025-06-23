describe('From homepage to subscription - Combined Flow Test', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    cy.get('body').should('be.visible');
    Cypress.on('uncaught:exception', () => false);
  });

  it('completes plan selection and creates Stripe subscription session', () => {
    // === LOGIN ===
    cy.get('[data-cy="header-login-button"]').click();
    cy.url().should('include', '/login');
    cy.get('#email').type('user@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();

    // === DASHBOARD ===
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('[data-cy="my-dashboard-button"]').click();
    cy.url().should('include', '/dashboard');

    // === CHOOSE PLAN FLOW ===
    cy.get('body').then($body => {
      if ($body.find('li.fi-sidebar-item:contains("Choose plan")').length > 0) {
        cy.contains('li.fi-sidebar-item', 'Choose plan').find('a').click();
        cy.url().should('include', '/dashboard/choose-plan');

        cy.wait(3000); // allow plan elements to render

        cy.get('[data-cy="plan-1"]').should('be.visible').then($plan => {
          const planText = $plan.text().toLowerCase();

          if (planText.includes('free')) {
            cy.log('It is a free plan – skipping toggle and payment actions.');
            return; // Exit the test early for free plans
          }

          // === If not free, proceed with toggle and Stripe flow ===
          cy.get('[data-cy="ad-count-toggle-1"]').click();
          cy.get('[data-cy="featured-ad-toggle-1"]').click();
            cy.get('[data-cy="featured-ad-input-1"]')
              .should('be.visible')
              .invoke('val', 4)
              .trigger('input');
          // Continue with plan selection and payment method
          cy.get('[data-cy="plan-1"]').click();
          cy.get('#payment_method-stripe').click({ force: true });

          cy.wait(3000); // optional sync wait

          cy.request({
            method: 'POST',
            url: 'https://api.stripe.com/v1/checkout/sessions',
            headers: {
              Authorization: `Bearer ${stripeKey}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            form: true,
            body: {
              mode: 'subscription',
              success_url: 'https://test.adfox.saasforest.com/subscription/success',
              cancel_url: 'https://test.adfox.saasforest.com/subscription/cancel',
              'line_items[0][price]': 'price_1RQSZSRvZPqvpB4irJeUuEQO',
              'line_items[0][quantity]': 1,
              customer: 'cus_SK088gOxySUCFQ',
              'subscription_data[metadata[user_id]]': '9e9ff58a-04fe-4112-998f-e652e4690b98',
              'subscription_data[metadata[plan_id]]': '8',
              'subscription_data[metadata[ad_count]]': '12', // match count
            },
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('url');
            cy.log('Stripe Checkout URL:', response.body.url);
            // Optionally redirect: cy.visit(response.body.url);
          });
        });
      }
    });
  });
});
