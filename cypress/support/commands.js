// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", (email, password) => {
    cy.session([username, password], () => {
        //Ensure user is not signed in
        cy.get('[data-testid="signUpBtn"]').should("be.visible");
        cy.get('[data-testid="logInBtn"]').should("be.visible");
        cy.get('[data-testid="logOutBtn"]').should("be.hidden");
        cy.get('[data-testid="logInBtn"]').click();

        //Sign the user in
        cy.get('[data-testid="logInModal-email-input"]').type(email);
        cy.get('[data-testid="logInModal-password-input"]').type(password);
        cy.get('[data-testid="logInModal-submit"]').click();
    }, { validate() {
                //ensure user is signed in
                cy.get('[data-testid="logInModal-error"]').should("be.hidden");
                cy.get('[data-testid="logInModal"]').should("be.hidden");
                cy.get('[data-testid="signUpBtn"]').should("be.hidden");
                cy.get('[data-testid="logInBtn"]').should("be.hidden");
                cy.get('[data-testid="logOutBtn"]').should("be.visible");
            },
        }
    )
});