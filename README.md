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
Before designing any UI components, I first created the list of features found above. Keeping this list of features in mind, I created the below ruff Figma wire frame of each possible screen based on each user interactions. I concluded that I needed a home screen to prompt users to sign up or log in and to display the global leader board, dashboard screen for players to join or invite other players, and active game screen to house the chess board and in game statistics. Using modals, I would prompt users to sign up or log in, and I would use them for in game alerts. I played around with the colors and eventually landed on a yellow dark mode color pallet. Using this Figma design, I created each component in react using HTML and CSS. My focus here was to first get all the required elements styled and built before adding any user interaction to them. 

<img width="700" src="https://github.com/AdenWhitworth/online_chess_with_friends/raw/master/src/Images/Figma.JPG" alt="Figma">

#### Home Page UX Design
As the home page (App.js) is parent view, I initialized global react useState variables to be later used in the child views. Clicking the sign up or log in buttons will open the appropriate sign in modals. These modals take the user text inputs, authenticate with Firebase Authentication, and store the data for later with Firebase Firestore. It was important for the sign up modal to also check and see if the new players username is taken before the player signs up. Using react useEffect, I am able use Firebase Authentication to assess if a user is signed in. Actively signed in players are allowed to move to the dashboard child view, while unregistered players remain at the home screen. The leaderboard works by querying the Firestore database and returns the top ten players based on rank. Using the Firebase onSnapshot, the list of leaders will automatically be updated if any of the ranks change. The rank is a custom weighted value I created and it is assigned at the end of each chess match. Mapping over the array of leaders allowed me to display the leaders as a list. As a player is actively signed in for the first time, a single Firestore getDocs instance pulls all the player information from the database, and username socket emit creates the player within the backend. At this point, another react useEffect and Firebase onSnapshot queries the active player for all of the invites they currently have. An array of these invites is then created to be used later by the dashboard view, and a count of the individual invites is used to display the number of notifications the signed in player has currently. 

#### Dashboard UX Design
I decided that the dashboard view (DashboardCard.js) would contain the players/invites list, and the active game, and in game statistics child views. In the dashboard view, an active game is always shown to the user but is not interactive till a game begins. I toggle between the players/invites list and game statistics based on if a game room has been created or not. When a room has not been created, then the players/invites view (InfoCard.js) is shown. While a room is active, I show the user the in game statistics view (GameCard.js).

#### Dashboard InfoCard Child UX Design
The info card uses another react useEffect and Firebase onSnapshot to query all the players in the Firestore database excluding any players which have already sent the active player a game invite and excluding the active player themselves. By making a copy of both the player array and invite arrays queried previously in the home page, I filter the copies based on the search input field. Mapping over the filtered array of players allows for the list of players to be shown. Mapping over the filtered invites array allows for the list of invites to be shown. Whenever the notification badge is clicked, the react useState navigates the user to the list of invites. When the user selects to invite another player, the opponents information is stored locally, a create room socket emit is sent to the back-end, and the invitation information is stored in the opponents Firestore collection.  When the user selects to join another player, the opponents information is stored locally, a join room socket emit is sent to the back-end, and the old invitation is deleted from the users Firestore database. 

#### Dashboard ActiveGame Child UX Design
At this point, a game room has been created and the dashboard will now hide the players/invites view and instead show the in game statistics view. The in game statistics (GameCard.js) shows both players usernames, wins, losses, captured pieces, and moves history. When a user is waiting for the opponent to join the game, the game statistics indicate to continue waiting. Additionally, the chess board and chess game logic (ActiveGame.js) restricts any chess pieces from being moved. Upon successfully joining the game, white is able to make the first move. Using the react-chessboard.js API, I am able to manipulate the locations of each piece on the board through the use of the chess fen number. Using the chess.js API, I am able to check the rules of chess to ensure the game is being played appropriately. Using the react useMemo hook for efficiency, I create a new chess game instance with the chess.js API. The react-chessboard API has a function called onDrop which is triggered when a piece on the board is dropped on a new square. When this function is triggered, I check to see if it is the current players turn. If it is not their turn, then the piece is returned to the previous location. Using the react useCallback hook again for efficiency, I use the chess.js API to trigger an instance of a move. This instance checks if the move meets the rules of chess. If the move is valid, then I both update the history and player turn on the game statistics, and I use the chess.js API to determine if the game is over or in check. On a successful move, a move socket emit is sent to the backend to notify the opponent player that a move has been made. Using a react useEffect hook, I create a socket on connection to the backend to be notified whenever a move has been made by the opponent. Taking the move data passed through the socket, the useEffect triggers the same make a move function used by the on drop. The make a move function forces a re-render of the chess board which will show the piece being moved to the new location on the board. 

#### Dashboard GameCard Child UX Design
While the game is actively being played, I created a function in the GameCard.js which correlates each players turn to the orientation of the chess board. The UI is set up such that the user is always on the bottom and the opponent is always on the top. This means that the board orientation will be different depending on if the user is white or black. By using the player turn data from the active game session and the board orientation for each player, I am able to use the UI to highlight whose turn it currently is. The chess API has the ability to return all history moves of the active game. Through the use of reacts useContext hook, I am able to transfer the player turn and history object laterally through the child views. This allows for the game statistics to be re-rendered without re-rendering the active chess game. The history object that is received by the game statistics view is used to show all moves made during the game and any captured pieces. Taking the array of history game moves, I created a function which formats the moves into sets of two. This new array created in this function is then mapped and creates a list showing each players old moves. The history object also contains any captured pieces data. I created another function which pulls out the most recent captured piece and then adds to a new object containing all of the captured assigned to both players. From this new object, a second function corelates the piece type, player orientation, and amount captured. This allows for the UI to display the correct image of the number of pieces captured for each player in the game. 

When a player clicks the home or the forfeit button, a close room socket emit is used to notify the opponent player. Before a player leaves the game, a modal will confirm the action. Another react useEffect will be used to trigger a socket on close room event. This allows for the opponent player to be notified that the other player has left the game. The player who decides to quit the game will also trigger a function which determines the winner, calculates both players weighted rank, and updates the Firestore database with the results.  When a room is closed either from the chess game ending or a player leaving the game, the chess board is reset and the user is navigated back to the players/invites (InfoCard.js) view. 

#### Firebase Cloud Firestore Data Structure
I decided that I needed two separate Firestore collection for best performance. The first collection is the main set of data and is structured per the below. For each user that is created, I store all metadata here including the unique identifier playerID which is used in the second collection. Firebase Authentication creates a uuid which is also stored here in order to link the Firestore to the signed in user. When an invite is sent to a player, a child collection called invites is created for the player who has received the invite. The invitation metadata includes all the necessary information needed for the invited player to join the other players room. 

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

The second collection is a basic list of the players and looks like the following. This is a copy of the users collection, but it only houses the username and userID metadata. The purpose of this collection is to speed up querying needed to display all of the players you can invite to a game. Having the userID be in this collection allows for the users collection to be referenced only when necessary. 

{players: { 
<br>&emsp;($playerID): {
<br>&emsp;&emsp;userID: ($userID), 
<br>&emsp;&emsp;username: ($username),
<br>&emsp;}
<br>}

## Future Features
- Add in game chat between players
- Add custom A.I. bot to practice against

