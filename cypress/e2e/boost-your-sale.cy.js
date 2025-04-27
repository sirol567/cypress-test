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