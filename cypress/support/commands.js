Cypress.Commands.add("login", (email, password) => {
    cy.session([email, password], () => {
        cy.visit('/');
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
                cy.get('[data-testid="logInModal-error"]').should("not.exist");
                cy.get('[data-testid="logInModal"]').should("not.exist");
                cy.get('[data-testid="signUpBtn"]').should("be.hidden");
                cy.get('[data-testid="logInBtn"]').should("be.hidden");
                cy.get('[data-testid="logOutBtn"]').should("be.visible");
            },
        }
    )
});

Cypress.Commands.add("playFriends", () => {

    //ensure player is signed in and click play friends button
    cy.get('[data-testid="logOutBtn"]', { timeout: 3000 }).should("be.visible");
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="HomeCard-section"]').should("not.exist");
    cy.get('[data-testid="DashboardCard-section"]').should("be.visible");
    cy.get('[data-testid="InfoCard-section"]').should("be.visible");
});

Cypress.Commands.add("invite", (username) => {
    //Type opponent username in search and make sure its filtered
    

    cy.get('[data-testid="search-players-input"]').type(username);
    cy.get('[class*="player-username"]').contains(username);

    //Invite Demo2 to a game and chech new game loads
    cy.get('[data-testid="player-list-request-' + username + '"]').click();
    

    cy.get('[data-testid="GameCard-section"]').should("be.visible");
    
    cy.get('[class*="game-username"]').contains("Waiting on " + username + "...");
    cy.get('[data-testid="exitBtn"]',{ timeout: 1000 }).should("be.visible");
    cy.get('[data-testid="notificationBtn"]').should("be.hidden");
    
});