# Online Chess With Friends
> A real-time online competitive chess game where you are able to challenge your friends.

Create an account and invite your friends to play a game. View the global leader board to see where you stand. To demo the game without creating an account, please sign in with the below demo accounts. Using two separate browser windows, you can even play against yourself.

Emails: demo1@gmail.com & demo2@gmail.com

Password: PortfolioDemo1!

[See Live Demo](https://online-chess-with-friends.web.app/)

This repository is just for the front-end. Use the link below to access the back end repository for this game. 

[See Back-End](https://github.com/AdenWhitworth/online_chess_with_friends_server)

## Features
- Create unique account for each player
- Returning players can log in
- View and invite registered players
- Manage all active game invites
- Recieve notifications when invited to a game
- Search player base and notifications
- Play a live chess game
- Real time statistics displayed in game
- Ability to leave or forfeit
- Responsive design for web and mobile

## Front-End Technology Stack
- React.js
- Node.js
- HTML
- CSS
- JavaScript
- Material UI
- React-chessboard.js
- Chess.js
- Firebase Authentication
- Firebase Cloud Firestore
- Socket.io
- uuid.js
- Figma

## Design Process & Considerations

#### Architecture
To better understand what technology stack I planned on using for this project, I created the below architecture diagram. The front-end will be hosted with Firebase Hosting and will utilize React.js. The back-end will be hosted in Glitch and will utilize Node.js and Express. The front-end will interact with the back-end through Socket.io. I decided to use Firebase to both store my data and authenticate users. To do this, I will use Firebase Cloud Function to store player metadata and I will authenticate player credentials with Firebase Authentication. The front-end will communicate to the Firebase backend as a service through https protocols.  

<img width="700" src="https://github.com/AdenWhitworth/online_chess_with_friends/raw/master/src/Images/Architecture.JPG" alt="Architecture">

#### UI Design
Before designing any UI components, I first created the list of features found above. Keeping this list of features in mind, I created the below rough Figma wire frame of each possible screen based on each user's interactions. I concluded that I needed a home screen to prompt users to sign up or log in and to display the global leader board, dashboard screen for players to join or invite other players, and active game screen to house the chess board and in-game statistics. Using modals, I will prompt users to sign up or log in, and I will also use them for in-game alerts. I played around with the colors and eventually landed on a yellow dark mode color pallet.

<img width="700" src="https://github.com/AdenWhitworth/online_chess_with_friends/raw/master/src/Images/Figma.JPG" alt="Figma">

#### Firebase Cloud Firestore Data Structure
I decided that I needed two separate Firestore collections for the best performance. The first collection is the main set of data and is structured per the below. For each user that is created, I store all metadata here including the unique identifier playerID which is referenced in the second collection. Firebase Authentication creates a uuid which is also stored here in order to link the Firestore to the signed in user. When an invite is sent to a player, a child collection called invites is created for the player who has received the invite. The invitation metadata includes all the necessary information needed for the invited player to join the other players room. 

{users: {
<br>&emsp;($userID): {
<br>&emsp;&emsp;email: ($email),
<br>&emsp;&emsp;loss: ($loss),
<br>&emsp;&emsp;playerID: ($playerID),
<br>&emsp;&emsp;rank: ($rank),
<br>&emsp;&emsp;uuid: ($uuid),
<br>&emsp;&emsp;username: ($username),
<br>&emsp;&emsp;win: ($win),
<br>&emsp;&emsp;invites: {
<br>&emsp;&emsp;&emsp;($inviteID): {
<br>&emsp;&emsp;&emsp;&emsp;requestLoss: ($requestLoss),
<br>&emsp;&emsp;&emsp;&emsp;requestPlayerID: ($requestPlayerID),
<br>&emsp;&emsp;&emsp;&emsp;requestRoom: ($requestRoom),
<br>&emsp;&emsp;&emsp;&emsp;requestUserID: ($requestUserID),
<br>&emsp;&emsp;&emsp;&emsp;requestUserName: ($requestUserName),
<br>&emsp;&emsp;&emsp;&emsp;requestWin:($requestWin),
<br>&emsp;&emsp;&emsp;}
<br>&emsp;&emsp;}
<br>&emsp;}
<br>}

The second collection is a basic list of the players and looks like the following. This is a copy of the users collection, but it only houses the username and userID metadata. The purpose of this collection is to speed up the querying needed to display all of the players you can invite to a game. Having the userID be in this collection allows for the users collection to be referenced only when necessary. 

{players: { 
<br>&emsp;($playerID): {
<br>&emsp;&emsp;userID: ($userID), 
<br>&emsp;&emsp;username: ($username),
<br>&emsp;}
<br>}

## Future Features
- Handle client Authentication middleware with server :heavy_check_mark: (feature/1)
- Add in game chat between players
- Add custom A.I. bot to practice against
- Add watch active game functionality

