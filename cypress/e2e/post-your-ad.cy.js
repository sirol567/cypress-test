describe('Login and Proceed with ad posting', () => {
  beforeEach(() => {
    cy.visit('https://test.adfox.saasforest.com/');
    cy.wait(1000);
  });

  Cypress.on('uncaught:exception', () => false);

  it('logs in and posts ad', () => {
    cy.get('[data-cy="header-login-button"]').should('be.visible').click();
    cy.url().should('include', '/login');

    cy.get('#email').type('admin@adfox.com');
    cy.get('#password').type('password');
    cy.get('#remember-me').click();
    cy.get('.inline-flex').click();
    cy.wait(3000);

    cy.get('[data-cy="post-ad-button"]').click();
    cy.get('select#ad_type_id').select('Classified');
    cy.get('[data-cy="post-title-input"]').type('Breadcrumbs Ad1');
    cy.get('[data-cy="post-ad-next"]').click();

    // Category & Subcategory
    cy.get('[data-cy="select-category"]').eq(1).click();
    const subCatIndex = 3;

    cy.get('[data-cy="select-sub-category"]').then($select => {
      const option = $select.find('option')[subCatIndex];
      if (option) {
        cy.wrap($select).select(option.value);
      } else {
        cy.log(`Sub-category at index ${subCatIndex} not found.`);
      }
    });

    // Sale Type, Condition, Description
    cy.get('[data-cy="post-for-sale-by"] .fi-btn-label').contains('Business').click();
    cy.get('.tiptap').type('Your description goes here');
    cy.get('[data-cy="post-condition-toggle"] .fi-btn-label').contains('New').click();

    // Price
    cy.get('[data-cy="post-select-price-type"]').click();
    cy.get('#choices--price_type_id-item-choice-1').click();
    cy.get('[data-cy="post-price-input"]').type('1000');
    cy.get('[data-cy="post-offer-price-input"]').type('900');

    cy.get('[data-cy="post-display-phone-toggle"]').click();
    cy.wait(500);
     
// Handle the phone field which has the default value
cy.get('[data-cy="post-phone-number-input"] input')
.should('exist')
.click({ force: true })
.clear()
.type('{selectall}{backspace}{selectall}{backspace}{selectall}{backspace}', { force: true });

// Click the flag to open country list
cy.get('[data-cy="post-phone-number-input"] .iti__selected-flag').click();

// Search and select Brazil from the dropdown
cy.get('.iti__search-input')
.should('be.visible')
.type('Brazil');

cy.contains('.iti__country', '+55').click();

// Enter the phone number
cy.get('[data-cy="post-phone-number-input"] input')
.should('exist')
.wait(500);

cy.get('#phone_number').clear()
.type('{selectall}{backspace}{selectall}{backspace}{selectall}{backspace} 11987654321', { force: true });

  cy.screenshot('phone-input-debug');

  cy.wait(5000)
  cy.get('[data-cy="post-display-whatsapp-toggle"]').click();
  cy.wait(500);

    // Tags
    cy.get('#tags').type('new,new1{enter}' , {timeout:10000});
    cy.get('[data-cy="post-ad-next"]').should('be.visible').click();
    cy.wait(6000);

    // Image Upload
    cy.get('input[type="file"]').attachFile('cars.jpeg');
    cy.wait(7000);
    cy.get('[data-cy="post-ad-next"]').click();

// Try to detect current location
cy.get('[data-cy="post-use-current-location"]').click();

// Wait for auto-detection attempt
cy.wait(2000);

// Check if city field got auto-filled or still disabled
cy.get('[data-cy="post-city-select"]').then($city => {
  const isDisabled = $city.is(':disabled');
  const hasValue = !!$city.val();

  if (isDisabled || !hasValue) {
    cy.log('Current location not detected. Proceeding to manual selection.');

    // Select Country
    cy.get('[data-cy="post-country-select"] select' ,{timeout:10000})
      .should('be.visible')
      .select(1) // Index or value
      .then(() => {
        cy.get('body').then($body => {
          const stateExists = $body.find('[data-cy="post-state-select"] select',{timeout:15000}).length > 0;
          const cityExists = $body.find('[data-cy="post-city-select"] select',{timeout:15000}).length > 0;

          if (stateExists) {
            cy.get('[data-cy="post-state-select"] select')
              .should('be.visible')
              .select(1)
              .then(() => {
                if (cityExists) {
                  cy.get('[data-cy="post-city-select"] select')
                    .should('be.visible')
                    .select(1)
                    .then(() => {
                      cy.log('Manual location selection complete.');
                    });
                } else {
                  cy.log('City dropdown not available.');
                }
              });
          } else {
            cy.log('State dropdown not available.');
          }
        });
      });
  } else {
    cy.log('Location auto-detected. Proceeding...');
  }
});

// Proceed to post ad
cy.wait(1000);
cy.get('[data-cy="post-ad-publish"]').click();

// Wait for ad to publish
cy.wait(7000);
cy.get('[data-cy="success-ad-preview-button"] > .fi-btn-label').click();

cy.wait(1000);

  });
});