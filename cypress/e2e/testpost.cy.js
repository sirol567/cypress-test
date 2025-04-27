import { mockStripeIntercepts, mockSuccessfulPayment } from '../support/helpers/stripeTestHelper';

describe('Login and Stripe Payment Flow', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    Cypress.on('uncaught:exception', () => false); // Ignore app errors

    // Mock Stripe APIs before interacting with payment flow
    mockStripeIntercepts();
    mockSuccessfulPayment();
  });

  it('logs in and completes a Stripe payment', () => {
    // Login
    cy.get('[data-cy="header-login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
    cy.wait(1000);

    // Navigate to dashboard > my-packages
    cy.get('[data-cy="user-menu-button"]').click();
    cy.get('[data-cy="my-dashboard-button"]').click();
    cy.url().should('include', '/dashboard');

    cy.request({
      url: 'https://test.adfox.saasforest.com/dashboard/my-packages',
      failOnStatusCode: false,
    }).then((response) => {
      if (response.status === 200) {
        cy.visit('https://test.adfox.saasforest.com/dashboard/my-packages');
        cy.get('[data-cy="go_to_packages"]').click();
        cy.wait(1000);

        cy.get('[data-cy="package-container-1"]').within(() => {
          cy.get('[data-cy="package-item"]').eq(1).click();
        });

        // Proceed with Stripe payment
        cy.get('[data-cy="proceed-with-payment"]').click();
        cy.get('#payment_method-stripe').click();
        cy.wait(1000);

        // Fill Stripe card details in iframe
        cy.frameLoaded('iframe[name^="__privateStripeFrame"]');
        cy.getIframeBody('iframe[name^="__privateStripeFrame"]').within(() => {
          cy.get('input[name="cardnumber"]').type('4242424242424242', { delay: 100 });
          cy.get('input[name="exp-date"]').type('1234', { delay: 100 });
          cy.get('input[name="cvc"]').type('123', { delay: 100 });
        });

        // Submit payment if there's a confirm button
        // cy.get('button[type="submit"]').click(); // Adjust based on your actual UI
        cy.wait('@confirmPayment');
        cy.contains('Payment successful').should('be.visible'); // Adjust message
      } else {
        cy.log('Packages not available');
      }
    });
  });
});
