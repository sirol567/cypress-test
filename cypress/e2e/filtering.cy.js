describe('Category Selection and Filter Application', () => {
    const CATEGORY_TO_CLICK = 'Furniture';  // enter correct category name
    const SORT_OPTIONS = [
        'date',
        'Price Low to High',
        'Price High to Low',
        'Latest'
    ];

    beforeEach(() => {
        cy.visit('https://test.adfox.saasforest.com/');
        cy.get('body').should('be.visible');
        Cypress.on('uncaught:exception', () => false);  // to prevent uncaught exceptions
    });
    afterEach(() => {
        cy.pause(); // Manual resume via Cypress 
    });



    it('should select the specified category', () => {
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });

            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
                cy.log(`Clicked category: ${CATEGORY_TO_CLICK}`);
                cy.get('[data-cy="filter-subcategory"]').should('be.visible');
            } else {
                cy.log(`Category "${CATEGORY_TO_CLICK}" not found.`).then(() => {
                    expect(match.length).to.be.greaterThan(0);
                });
            }
        });
    });

    it('should select a subcategory after selecting the main category', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then select the subcategory
        cy.get('[data-cy="filter-subcategory"]').should('be.visible');
        cy.get('[data-cy="filter-subcategory"]').eq(1).click();
        cy.log('Applied subcategory filter');
    });

    it('should apply sorting option after category selection', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then select the sorting option
        cy.get('[data-cy="filter-sort-by"]').should('be.visible');
        const sortingOption = SORT_OPTIONS[2]; // Using 'Price High to Low'
        cy.get('[data-cy="filter-sort-by"]').select(sortingOption);
        cy.log(`Applied sorting: ${sortingOption}`);
    });
it('should apply sorting option after category selection', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then select the sorting option
        cy.get('[data-cy="filter-sort-by"]').should('be.visible');
        const sortingOption = SORT_OPTIONS[1]; // Using Low to high'
        cy.get('[data-cy="filter-sort-by"]').select(sortingOption);
        cy.log(`Applied sorting: ${sortingOption}`);
    });
    it('should apply sorting option after category selection', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then select the sorting option
        cy.get('[data-cy="filter-sort-by"]').should('be.visible');
        const sortingOption = SORT_OPTIONS[0]; // Using 'Date'
        cy.get('[data-cy="filter-sort-by"]').select(sortingOption);
        cy.log(`Applied sorting: ${sortingOption}`);
    });
    it('should apply sorting option after category selection', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then select the sorting option
        cy.get('[data-cy="filter-sort-by"]').should('be.visible');
        const sortingOption = SORT_OPTIONS[3]; // Using 'Latest'
        cy.get('[data-cy="filter-sort-by"]').select(sortingOption);
        cy.log(`Applied sorting: ${sortingOption}`);
    });

    it('should apply price filters after category selection', () => {
        // First select the category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });

        // Then apply price filters
        cy.get('[data-cy="filter-min-price"]').should('be.visible');
        cy.get('[data-cy="filter-min-price"]').clear();
        cy.get('[data-cy="filter-min-price"]').type('500');
        
        cy.get('[data-cy="filter-max-price"]').should('be.visible');
        cy.get('[data-cy="filter-max-price"]').clear();
        cy.get('[data-cy="filter-max-price"]').type('500');
        
        cy.get('[data-cy="filter-apply-button"]').should('be.visible');
        cy.get('[data-cy="filter-apply-button"]').click();
        cy.log('Applied price filters');
    });

    // This test combines all the steps if you want to test the entire flow
    it('should perform the complete filtering workflow', () => {
        // Select category
        cy.get('[data-cy="ad-category"]').then(($categories) => {
            const match = $categories.filter((i, el) => {
                return el.innerText.trim() === CATEGORY_TO_CLICK;
            });
            if (match.length > 0) {
                cy.wrap(match).eq(1).click();
            }
        });
        
        // Select subcategory
        cy.get('[data-cy="filter-subcategory"]').should('be.visible');
        cy.get('[data-cy="filter-subcategory"]').eq(1).click();
        
        // Apply sorting
        cy.get('[data-cy="filter-sort-by"]').should('be.visible');
        const sortingOption = SORT_OPTIONS[2];
        cy.get('[data-cy="filter-sort-by"]').select(sortingOption);
        
        // Apply price filters
        cy.get('[data-cy="filter-min-price"]').should('be.visible');
        cy.get('[data-cy="filter-min-price"]').clear();
        cy.get('[data-cy="filter-min-price"]').type('500');
        
        cy.get('[data-cy="filter-max-price"]').should('be.visible');
        cy.get('[data-cy="filter-max-price"]').clear();
        cy.get('[data-cy="filter-max-price"]').type('500');
        
        cy.get('[data-cy="filter-apply-button"]').should('be.visible');
        cy.get('[data-cy="filter-apply-button"]').click();
    });
});