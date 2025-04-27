describe('Login and Upload Profile Image', () => {
    beforeEach(() => {
      cy.visit('https://test.adfox.saasforest.com/');
    });
  
    Cypress.on('uncaught:exception', () => false);
  
    it('logs in and uploads a profile image', () => {
      // Login process
      cy.get('[data-cy="header-login-button"]').should('be.visible').click();
      cy.url().should('include', '/login');
      cy.get('#email').should('be.visible').type('admin@adfox.com');
      cy.get('#password').type('password');
      cy.get('#remember-me').click();
      cy.get('.inline-flex').should('be.visible').click();
      cy.wait(1000);
      
      // Navigate to profile
      cy.get('[data-cy="user-menu-button"]').should('be.visible').click();
      cy.get('[data-cy="my-profile-button"]').should('be.visible').click();
      
      // Clear and update profile name
      cy.get('[data-cy="profile-name"] input').should('be.visible').clear().type('Taylor');
      
      // Clear and update about me
      cy.get('[data-cy="profile-about-me"]').should('be.visible').clear().type("I've always enjoyed interactions with people and helping them");
      
    // Check if profile image exists and handle accordingly
cy.get('body').then($body => {
    // Look specifically for the FilePond remove button
    cy.wait(1000)
    if ($body.find('.filepond--file-action-button.filepond--action-revert-item-processing').length > 0) {
      // Option 1: Remove existing image and upload new one
      cy.log('Image already exists. Removing existing image.');
      cy.get('.filepond--file-action-button.filepond--action-revert-item-processing').click();
      cy.wait(1000);
      
      // Now upload new image
      cy.get('[data-cy="profile-image"] input[type="file"]').should('exist');
      cy.fixture('cars.jpeg', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then(blob => {
          cy.get('[data-cy="profile-image"] input[type="file"]').then(input => {
            const testFile = new File([blob], 'cars.jpeg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            input[0].files = dataTransfer.files;
            cy.wrap(input).trigger('change', { force: true });
          });
        });
      cy.wait(2000);
    } else {
      // No image exists, proceed with upload
      cy.log('No image exists. Uploading new image.');
      cy.get('[data-cy="profile-image"] input[type="file"]').should('exist');
      cy.fixture('cars.jpeg', 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then(blob => {
          cy.get('[data-cy="profile-image"] input[type="file"]').then(input => {
            const testFile = new File([blob], 'cars.jpeg', { type: 'image/jpeg' });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(testFile);
            input[0].files = dataTransfer.files;
            cy.wrap(input).trigger('change', { force: true });
          });
        });
      cy.wait(2000);
    }
  });
      
      // Clear and set date of birth
      cy.get('[data-cy="profile-date-of-birth"] input').clear().click().type('1990-01-01');
      cy.get('[data-cy="profile-date-of-birth"] input').should('have.value', '1990-01-01');
      
      // Set gender
      cy.get('#data\\.gender').select('Female').should('have.value', 'female');
      
      // Clear and set email
      cy.get('[data-cy="profile-email"] input').clear().type('admin@adfox.com');
      
      // Handle phone number
      cy.get('[data-cy="profile-phone-number"] input[type="tel"]').clear();
      cy.get('[data-cy="profile-phone-number"] .iti__selected-flag').click();
      cy.wait(500);
      cy.get('.iti__search-input:visible').type('Brazil', { force: true });
      cy.wait(500);
      cy.contains('.iti__country-name', 'Brazil').first().click();
      cy.get('[data-cy="profile-phone-number"] input[type="tel"]').type('11987654321');
      
      // Fix WhatsApp number - with corrected selector and simplified approach
      cy.get('[data-cy="profile-whatsapp-number"] input[type="tel"]').clear();
      cy.get('[data-cy="profile-whatsapp-number"] .iti__selected-flag').click();
      cy.wait(500);
      // Using force true and making sure to target visible elements
      cy.get('.iti__search-input:visible').last().type('Brazil', { force: true });
      cy.wait(500); 
      cy.contains('.iti__country-name', 'Brazil').last().click({ force: true });
      cy.wait(500);
      cy.get('[data-cy="profile-whatsapp-number"] input[type="tel"]').type('11987654321', { force: true });
      cy.wait(500);
      
      // Verify data before saving
      cy.get('[data-cy="profile-name"] input').should('have.value', 'Taylor');
      cy.get('[data-cy="profile-email"] input').should('have.value', 'admin@adfox.com');
      
      // Click save with force option and longer timeout
      cy.get('[data-cy="profile-save-changes"]').should('be.visible').click({ force: true });
      cy.wait(3000); // Wait longer for save to complete
    });
  });