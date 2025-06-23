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
      const link = $el.find('a:contains("My Feedback")');
      if (link.length > 0) {
        cy.wrap(link).click();
        cy.get('[data-cy="my-feedback-received"]' , {timeout:1000}).click();
        cy.wait(3000)
        cy.get('[data-cy="my-feedback-sent"]',{timeout:10000}).click();
        //search for feedback
        cy.get('[data-cy="feedback-search-input"]').type('a')
        cy.get('[data-cy="feedback-search"]').click()
//filter
cy.get('#sort-by').select('rating_high'); // This selects the "Highest Rating" option
//Like button
cy.get('[data-cy="feedback-like-button"]').eq(1).click();
//feedback reply button
cy.get('[data-cy="feedback-reply-button"]').eq(0).click();
cy.wait(1000)
cy.get('[data-cy="feedback-reply"]').type('qwerty')
cy.get('[data-cy="send-reply"]').click();
cy.screenshot('send-reply-debug')
cy.wait(1500)
   } })
    })
}) 