describe('HomeCard Interactions', () => {
  it('Home Card displays navigation buttons and player leaderboard', () => {
    cy.visit('/');

    //Ensure HomeCard is shown 
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");

    //Ensure play friends button is shown
    cy.get('[data-testid="playFriendsBtn"]').should("exist");

    //Ensure leaderboard shows top 10 players
    for (let index = 1; index <= 10; index++){
      cy.get('[data-testid="leaderboard-item-' + index + '"]').should("be.visible");
    }

    //Ensure leaderboard usernames are shown
    for (let index = 1; index <= 10; index++){
      cy.get('[data-testid="leaderboard-item-' + index + '-username"]').should("be.visible");
    }
  })

  it('Play Friends only when logged in', () => {
    cy.visit('/');

    //Ensure HomeCard is shown 
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");

    //Ensure user is not signed in
    cy.get('[data-testid="signUpBtn"]').should("be.visible");
    cy.get('[data-testid="logInBtn"]').should("be.visible");
    cy.get('[data-testid="logOutBtn"]').should("be.hidden");
    cy.get('[data-testid="notificationBtn"]').should("be.hidden");
    
    //Click play friends button and log into modal
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="logInModal"]').should("be.visible");
    cy.get('[data-testid="logInModal-email-input"]').type("demo1@gmail.com");
    cy.get('[data-testid="logInModal-password-input"]').type("PortfolioDemo1!");
    cy.get('[data-testid="logInModal-submit"]').click();
    cy.get('[data-testid="logInModal"]').should("be.hidden");

    //Ensure user is now signed in
    cy.get('[data-testid="signUpBtn"]').should("be.hidden");
    cy.get('[data-testid="logInBtn"]').should("be.hidden");
    cy.get('[data-testid="logOutBtn"]').should("be.visible");
    cy.get('[data-testid="notificationBtn"]').should("be.visible");
    
    //Clicking Play Friends Button navigates to DashboardCard screen
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="HomeCard-section"]').should("be.hidden");
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");

  })
})