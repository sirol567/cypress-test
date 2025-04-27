export function mockStripeIntercepts() {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_intents*', {
      statusCode: 200,
      body: {
        id: 'pi_mock_123',
        client_secret: 'pi_mock_secret_123',
        status: 'requires_payment_method'
      }
    }).as('createPaymentIntent');
  
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_pages*', {
      statusCode: 200,
      body: {
        id: 'pp_mock_123',
        status: 'requires_payment_method'
      }
    }).as('createPaymentPage');
  }
  
  export function mockSuccessfulPayment() {
    cy.intercept('POST', 'https://api.stripe.com/v1/payment_intents/*/confirm*', {
      statusCode: 200,
      body: {
        id: 'pi_mock_123',
        status: 'succeeded',
        charges: {
          data: [{
            id: 'ch_mock_123',
            amount: 4500,
            status: 'succeeded'
          }]
        }
      }
    }).as('confirmPayment');
  }
  