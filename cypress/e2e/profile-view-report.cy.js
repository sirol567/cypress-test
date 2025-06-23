describe('report an profile', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    cy.get('body').should('be.visible');

    Cypress.on('uncaught:exception', () => false);

    // Login
    cy.get('[data-cy="header-login-button"]').click();
    cy.url().should('include', '/login');
    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
  });

  function selectAdTypeAndHandleCategories() {
    cy.get('#sort-by option').then($adTypeOptions => {
      if ($adTypeOptions.length === 0) {
        cy.log('No ad types available on the page.');
        return;
      }

      cy.log('Available Ad Types:');
      const adTypeTexts = [];
      $adTypeOptions.each((index, option) => {
        const text = Cypress.$(option).text().trim();
        const value = Cypress.$(option).val();
        cy.log(`${index + 1}: ${text} (value: ${value})`);
        adTypeTexts.push({ text, value });
      });

      const selectedAdTypeIndex = 0;
      const selectedAdType = adTypeTexts[selectedAdTypeIndex];
      cy.wait(5000);

      if (!selectedAdType) {
        cy.log(`Error: Selected Ad Type at index ${selectedAdTypeIndex} not found.`);
        return;
      }

      cy.log(`Selecting Ad Type: "${selectedAdType.text}" (value: ${selectedAdType.value})`);
      cy.get('#sort-by').select(selectedAdType.value);
      cy.get('#sort-by').should('have.value', selectedAdType.value);

      cy.wait(2000);

      cy.document().then((doc) => {
        const categoryElementExists = doc.querySelector('a[data-cy="explore-category"]') !== null;
        if (!categoryElementExists) {
          cy.log(`Ad Type "${selectedAdType.text}" at index ${selectedAdTypeIndex} has no categories in it`);
          return;
        }

        cy.get('a[data-cy="explore-category"]', { timeout: 10000 }).then($categoryLinks => {
          if ($categoryLinks.length === 0) {
            cy.log(`No categories available for Ad Type: "${selectedAdType.text}"`);
            return;
          }

          cy.log(`Available Categories for "${selectedAdType.text}":`);
          const categoryNames = [];
          $categoryLinks.each((index, category) => {
            const name = Cypress.$(category).text().trim();
            cy.log(`${index + 1}: ${name}`);
            categoryNames.push(name);
          });

          const selectedCategoryIndex = 0;
          const selectedCategoryName = categoryNames[selectedCategoryIndex];

          if (selectedCategoryIndex >= $categoryLinks.length) {
            cy.log(`Category index ${selectedCategoryIndex} is out of range.`);
            return;
          }

          cy.log(`Clicking on category: "${selectedCategoryName}"`);
          cy.wrap($categoryLinks).eq(selectedCategoryIndex).click();

          cy.get('.col-span-12', { timeout: 15000 }).should('exist');
          cy.wait(2000);

          cy.document().then((doc) => {
            const adItemExists = doc.querySelector('[data-cy="ad-item"]' , {timeout:20000}) !== null;
            if (!adItemExists) {
              cy.log(`Ad item for this category is not available on the page`);
              return;
            }

            cy.get('[data-cy="ad-item"]', { timeout: 10000 }).then($adsInCategory => {
              if ($adsInCategory.length === 0) {
                cy.log(`No ad items found in the category: "${selectedCategoryName}"`);
              } else {
                cy.log(`Found ${$adsInCategory.length} ad items in the category: "${selectedCategoryName}"`);
                cy.log('Clicking on the first ad item.');
                cy.wrap($adsInCategory.eq(0)).scrollIntoView().click();
                cy.url().should('include', '/ad/');

                cy.get('[data-cy="view-profile"]').click();

                cy.get('[data-cy="ad-item"]').then(($adElements) => {
                  if ($adElements.length > 0) {
                    cy.wrap($adElements[0]).click();
                    cy.log('Found an ad. Clicked the first one.');
                    cy.get('.py-6.hidden').scrollIntoView();
                    cy.get('[data-cy="report-ad"]').first().click({ force: true });
                    cy.get('#data\\.reason').type('test report');
                    cy.get('button[type="submit"]').contains('Report Ad').click();
                    cy.wait(2500);
                  } else {
                    cy.log('No ads found on the page.');
                  }
                });
              }
            });
          });
        });
      });
    });
  }

  it('Handles ad type and category flow', () => {
    selectAdTypeAndHandleCategories();
    cy.wait(5000);
  });
});