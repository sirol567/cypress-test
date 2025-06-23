// describe the test scenario
describe('Login and Proceed with search input from homepage', () => {

  beforeEach(() => {
    // Visit homepage
    cy.visit('https://test.adfox.saasforest.com/');
    // Wait for page to load instead of fixed time
    cy.get('body').should('be.visible');
  });

  // Ignore any unexpected JS errors from the site
  Cypress.on('uncaught:exception', () => false);

  it('logs in and search', () => {
    //  CHANGE THIS WORD TO ANYTHING YOU WANT TO SEARCH
    const searchKeyword = 'zzzz';

    // Click on Login link
    cy.get('[data-cy="header-login-button"]')
      .should('be.visible')
      .click();

    // Login process
    cy.url().should('include', '/login');
    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
    
    // Wait for redirect after login - checking for search input instead of fixed wait
    cy.get('[data-cy="search-input"]', { timeout: 10000 }).should('be.visible');

    // Type the search keyword and press enter
    cy.get('[data-cy="search-input"]')
      .clear()
      .type(`${searchKeyword}{enter}`);

    // Wait for search results to load - check for any of the possible elements
    cy.get('body', { timeout: 15000 }).should(($body) => {
      const hasCategories = $body.find('[data-cy="search-category"]').length > 0;
      const hasSubcategories = $body.find('[data-cy="search-subcategory"]').length > 0;
      const hasAds = $body.find('[data-cy="search-ad"]').length > 0;
      expect(hasCategories || hasSubcategories || hasAds || $body.text().includes('No results')).to.be.true;
    });

    cy.get('body').then($body => {
      // First check if category is available
      if ($body.find('[data-cy="search-category"]').length > 0) {
        cy.get('[data-cy="search-category"]').eq(0).should('be.visible').click();
        // Wait for page transition after clicking category
        cy.url().should('not.include', '/search');
      } 
      // Then check if subcategory is available
      else if ($body.find('[data-cy="search-subcategory"]').length > 0) {
        cy.get('[data-cy="search-subcategory"]').eq(0).should('be.visible').click();
        // Wait for page transition after clicking subcategory
        cy.url().should('not.include', '/search');
      } 
      // If not, try clicking on an ad
      else if ($body.find('[data-cy="search-ad"]').length > 0) {
        cy.get('[data-cy="search-ad"]')
          .eq(0)
          .should('be.visible')
          .click();
        // Wait for page transition after clicking ad
        cy.url().should('contain', '/ad/');
      } 
      // If nothing is available, log it
      else {
        cy.log('No results found');
      }
    });
  });
});