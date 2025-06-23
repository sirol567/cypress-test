describe('Ad Type & Category Flow Test', () => {
    beforeEach(() => {
      cy.visit('https://test.adfox.saasforest.com/');
    })     
    Cypress.on('uncaught:exception', () => false);
    it('defines location test' ,() =>{
      cy.get('body').should('be.visible');
      cy.get('[data-cy="openstreetmap-location-button"]').click()
      cy.get('[data-cy="openstreetmap-location-input"]').type('delhi ')
      cy.wait(5000)
      cy.get('[data-cy="openstreetmap-location-result"]',{timeout:10000}).first().click();
    } )
})  