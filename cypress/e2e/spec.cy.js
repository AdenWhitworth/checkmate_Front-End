describe('HomeCard Interaction Tests', () => {
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

  it('Play Friends & notifications only when logged in', () => {
    cy.visit('/');

    //Ensure HomeCard is shown 
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");

    //Ensure user is not signed in
    cy.get('[data-testid="signUpBtn"]').should("be.visible");
    cy.get('[data-testid="logInBtn"]').should("be.visible");
    cy.get('[data-testid="logOutBtn"]').should("be.hidden");
   
    //Try clicking notification which should prompt user to sign in
    cy.get('[data-testid="notificationBtn"]').click();
    cy.get('[data-testid="logInModal"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').click();
    cy.get('[data-testid="logInModal"]').should("be.hidden");

    //Try clicking play friends button which should prompt user to sign in
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="logInModal"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').click();
    cy.get('[data-testid="logInModal"]').should("be.hidden");
    
    //Log the user in
    login('demo1@gmail.com','PortfolioDemo1!');
    
    //Clicking Play Friends Button navigates to DashboardCard screen
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="HomeCard-section"]').should("be.hidden");
    cy.get('[data-testid="DashboardCard-section"]').should("be.visible");

    //Return user to home screen and try notifications button now
    cy.get('[data-testid="homeBtn"]').click();
    cy.get('[data-testid="DashboardCard-section"]').should("be.hidden");
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");
    cy.get('[data-testid="notificationBtn"]').click();
    cy.get('[data-testid="InfoCard-section"]').should("be.visible");
    cy.get('[data-testid="players-list"]').should("be.visible");
    cy.get('[data-testid="playersBtn"]').should("have.class","info-unselection");
    cy.get('[data-testid="invitesBtn"]').should("have.class","info-selection");
  })
})