describe('Ad Type & Category Flow Test', () => {
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
    // 1. First check if there are ad types available on the page
    cy.get('#sort-by option').then($adTypeOptions => {
      if ($adTypeOptions.length === 0) {
        // 2. If not available, log not available
        cy.log('No ad types available on the page.');
        return;
      }

      // 3. If available, give option to choose (we'll proceed with the first one for automation)
      cy.log('Available Ad Types:');
      const adTypeTexts = [];
      $adTypeOptions.each((index, option) => {
        const text = Cypress.$(option).text().trim();
        const value = Cypress.$(option).val();
        cy.log(`${index + 1}: ${text} (value: ${value})`);
        adTypeTexts.push({ text, value });
      });

      const selectedAdTypeIndex = 0; // Choose the first ad type
      const selectedAdType = adTypeTexts[selectedAdTypeIndex];
cy.wait(5000)
      // 4. Check if the selected option is available (it should be, as we fetched it)
      if (!selectedAdType) {
        // 5. If the option itself is not available, log
        cy.log(`Error: Selected Ad Type at index ${selectedAdTypeIndex} not found.`);
        return;
      }

      cy.log(`Selecting Ad Type: "${selectedAdType.text}" (value: ${selectedAdType.value})`);
      cy.get('#sort-by').select(selectedAdType.value);
      cy.get('#sort-by').should('have.value', selectedAdType.value);

      // Wait for categories to load
      cy.wait(2000); // Give time for categories to load

      // Check if category element exists for the selected ad type
      cy.document().then((doc) => {
        const categoryElementExists = doc.querySelector('a[data-cy="explore-category"]') !== null;
        if (!categoryElementExists) {
          cy.log(`Ad Type "${selectedAdType.text}" at index ${selectedAdTypeIndex} has no categories in it`);
          return;
        }
        
        // Continue with category handling if the element exists
        cy.get('a[data-cy="explore-category"]', { timeout: 10000 }).then($categoryLinks => {
          // 6. If the option is available and no categories, then log
          if ($categoryLinks.length === 0) {
            cy.log(`No categories available for Ad Type: "${selectedAdType.text}"`);
            cy.log(`Ad Type "${selectedAdType.text}" at index ${selectedAdTypeIndex} has no categories in it`);
            return;
          }

          // 7. If the option is available, check if there are categories inside it (we just did)
          cy.log(`Available Categories for "${selectedAdType.text}":`);
          const categoryNames = [];
          $categoryLinks.each((index, category) => {
            const name = Cypress.$(category).text().trim();
            cy.log(`${index + 1}: ${name}`);
            categoryNames.push(name);
          });

          // 8. Give option to choose categories (we'll proceed with the first one for automation)
          const selectedCategoryIndex = 9; // Choose the first category
          const selectedCategoryName = categoryNames[selectedCategoryIndex];

          // 9. Check if it is in range, else log
          if (selectedCategoryIndex >= $categoryLinks.length) {
            cy.log(`Category index ${selectedCategoryIndex} is out of range.`);
            return;
          }

          cy.log(`Clicking on category: "${selectedCategoryName}"`);
          cy.wrap($categoryLinks).eq(selectedCategoryIndex).click();

          // Wait for the ad container to load
          cy.get('.col-span-12', { timeout: 15000 }).should('exist');
          cy.wait(2000); // Wait for ads to load

          // 10. Check if ad item element exists, log if not available
          cy.document().then((doc) => {
            const adItemExists = doc.querySelector('[data-cy="ad-item"]') !== null;
            if (!adItemExists) {
              cy.log(`Ad item for this category is not available on the page`);
              return;
            }
            
            // 11. Check if the chosen category has ad items in it
            cy.get('[data-cy="ad-item"]', { timeout: 10000 }).then($adsInCategory => {
              if ($adsInCategory.length === 0) {
                cy.log(`No ad items found in the category: "${selectedCategoryName}"`);
                cy.log(`There are no ad items present in this category`);
              } else {
                // If ad items available, click the first ad
                cy.log(`Found ${$adsInCategory.length} ad items in the category: "${selectedCategoryName}"`);
                cy.log('Clicking on the first ad item.');
                cy.wrap($adsInCategory.eq(0)).scrollIntoView().click();
                cy.url().should('include', '/ad/'); // Verify navigation
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