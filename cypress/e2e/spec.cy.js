/*
describe('HomeCard Interaction Tests', () => {
  it('Home Card displays navigation buttons and player leaderboard', () => {
    cy.clearAllSessionStorage();

    cy.visit('/');

    //Ensure HomeCard is shown 
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");

    //Ensure play friends button is shown
    cy.get('[data-testid="playFriendsBtn"]').should("exist");

    //Ensure leaderboard shows top 10 players
    for (let index = 0; index <= 4; index++){
      cy.get('[data-testid="leaderboard-item-' + index + '"]', { timeout: 100 }).should("be.visible");
    }

    //Ensure leaderboard usernames are shown
    for (let index = 0; index <= 4; index++){
      cy.get('[data-testid="leaderboard-item-' + index + '-username"]').should("be.visible");
    }
  })

  it('Dont allow Play Friends & notifications when not logged in', () => {
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
    cy.get('[data-testid="logInModal"]').should("not.exist");

    //Try clicking play friends button which should prompt user to sign in
    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="logInModal"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').should("be.visible");
    cy.get('[data-testid="logInModal-close"]').click();
    cy.get('[data-testid="logInModal"]').should("not.exist");
  })

  it('Test play friends and notification buttons when logged in', () => {
    //Log the user in
    cy.login('demo1@gmail.com','PortfolioDemo1!');
    cy.visit('/');
    
    
    
    //Clicking Play Friends Button navigates to DashboardCard screen
    cy.get('[data-testid="logOutBtn"]', { timeout: 1000 }).should("be.visible");

    cy.get('[data-testid="playFriendsBtn"]').click();
    cy.get('[data-testid="HomeCard-section"]').should("not.exist");
    cy.get('[data-testid="DashboardCard-section"]').should("be.visible");

    //Return user to home screen and try notifications button now
    cy.get('[data-testid="homeBtn"]').click();
    cy.get('[data-testid="DashboardCard-section"]').should("not.exist");
    cy.get('[data-testid="HomeCard-section"]').should("be.visible");
    cy.get('[data-testid="notificationBtn"]').click();
    cy.get('[data-testid="InfoCard-section"]').should("be.visible");
    cy.get('[data-testid="playersBtn"]').should("have.class","info-unselection");
    cy.get('[data-testid="invitesBtn"]').should("have.class","info-selection");

    //Toggle between players and notifications
    cy.get('[data-testid="playersBtn"]').click();
    cy.get('[data-testid="playersBtn"]').should("have.class","info-selection");
    cy.get('[data-testid="invitesBtn"]').should("have.class","info-unselection");
  })
})
*/

describe('DashboardCard Interation Tests', () => {

  /*
  it('Test searching for player and inviting them', () => {
    
    cy.visit('/');

    cy.playFriends();

    cy.invite('Demo2');

    //Have the player exit the game before the opponent joins
    cy.get('[data-testid="exitBtn"]').click();
    cy.get('[data-testid="GameCard-section"]', { timeout: 1000 }).should("be.hidden");
    cy.get('[data-testid="InfoCard-section"]').should("be.visible");

  })
  */

  it('Test opponent joining the game', () => {
    
    cy.visit('/');

    cy.playFriends();

    cy.invite('Demo2');

    cy.get('input[test]').invoke('attr', 'onPieceDrop', '{"d2","d3"}').should('have.attr', 'onPieceDrop', '{"d2","d3"}');
    
  })

})