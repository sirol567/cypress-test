describe('Login and Click Category from Homepage', () => {
  const CATEGORY_TO_CLICK = 'Bikes'; // <--- change this only

  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
  });

  Cypress.on('uncaught:exception', () => false);

  it('logs in and clicks selected category from homepage', () => {
    cy.get('[data-cy="header-login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');
    cy.get('#email').should('be.visible').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').should('be.visible').click();

    cy.get('[data-cy="all-category-button"]').should('be.visible').click();

    cy.get('[data-cy="ad-category"]').should('exist').then(($categories) => {
      const match = $categories.filter((i, el) => {
        return el.innerText.trim() === CATEGORY_TO_CLICK;
      });

      if (match.length > 0) {
        cy.wrap(match).first().click();
        cy.log(` Clicked category: ${CATEGORY_TO_CLICK}`);
      } else {
        cy.log(` Category "${CATEGORY_TO_CLICK}" not found.`);
      }
    });
  });
});
