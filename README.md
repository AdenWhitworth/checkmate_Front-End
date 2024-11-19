<img width="80" src="https://github.com/AdenWhitworth/checkmate_Front-End/raw/master/src/Images/King%20Logo%20Black.svg" alt="Checkmate Logo">

# Checkmate Front-End

Welcome to the **Checkmate Front-End**! This repository contains the code for the web-based user interface, allowing players to challenge friends to chess matches, chat during the game, and track their rankings. The project integrates seamlessly with the back-end to provide real-time multiplayer chess gameplay.

## Table of Contents
- [Overview](#overview)
- [Checkmate Demo](#checkmate-demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Firebase Setup Guide](#firebase-setup-guide)
  - [Running the Application](#running-the-application)
- [Database Structure](#database-structure)
- [Future Features](#future-features)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Checkmate Front-End is built using React and provides a responsive, real-time chess-playing experience. Users can create and join chess games, communicate through in-game chat, and track their performance using the integrated ranking system.

## Checkmate Demo

The Checkmate application is live and can be accessed here: [Checkmate Demo](https://checkmateplay.com). You can explore all features of the game, including real-time gameplay, chat, and rankings.

### Test User Credentials

Try out the app using the following demo accounts:

- **Emails:** demo1@gmail.com & demo2@gmail.com
- **Password:** PortfolioDemo1!

>**Note**: You can even play against yourself by opening the application in two separate browser windows.

## Features

- **Real-Time Gameplay**: Challenge your friends in a multiplayer chess game with real-time move updates.
- **In-Game Chat**: Communicate with your opponent during the game with the built-in chat feature.
- **ELO Ranking System**: Track your performance and compare rankings with friends.
- **In-Game Statistics**: Monitor game statistics as you play.
- **Responsive Design**: Optimized for desktop and mobile devices, ensuring a great user experience on any screen size.
- **Game Persistence**: Stay in the game, even if you loose connection, with a reliable rejoin feature.

## Technologies Used

- **React**: A powerful JavaScript library for building user interfaces, enabling the development of dynamic and responsive web applications.
- **TypeScript**: A strongly typed superset of JavaScript that enhances code quality and provides better tooling and type safety during development.
- **HTML/JSX**: The foundational markup language used for structuring the components of the React application, ensuring semantic and accessible content.
- **CSS**: Styles the application with a modern aesthetic, allowing for flexible and maintainable design.
- **React Router**: A library that enables dynamic routing in the application, providing a seamless navigation experience for users.
- **MUI (Material-UI)**: A popular React component library that implements Google's Material Design, providing pre-designed components for charts, gauges, and more, enhancing visual consistency.
- **Socket.IO**: A library that facilitates real-time, bidirectional communication between clients and servers, crucial for features like live updates and notifications.
- **React-chessboard.js**: A lightweight and flexible chessboard library designed for React, providing an intuitive interface for displaying and interacting with chess positions in your React applications.
- **Chess.js**: A JavaScript library that implements chess mechanics, enabling the creation of legal move generation, validation, and game state management in a chess application.
- **uuid.js**: A library used to generate unique identifiers (UUIDs), essential for creating distinct and secure references for users, games, and various entities in web applications.
- **Firebase**:
  - **Authentication**: Provides secure sign-in via various methods, including email/password, Google, etc.
  - **Firestore**: A NoSQL database optimized for real-time data storage and synchronization.

## Getting Started

Follow the instructions below to set up the project on your local machine.

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AdenWhitworth/checkmate_Front-End.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Variables
Create a `.env` file in the root directory and define the following variables:

  ```plain text
  # Application Configuration
  REACT_APP_BASE_URL=your_back-end_url  # url for the server application
  REACT_APP_PORT=your_port # port for local development

  #Firebase Configuration
  REACT_APP_API_KEY=your_firebase_api_key # api key for firebase
  REACT_APP_AUTH_DOMAIN=your_firebase_auth_domain # authentication domain for firebase
  REACT_APP_PROJECT_ID=your_firebase_project_id # project id for firebase
  REACT_APP_STORAGE_BUCKET=your_firebase_storage_bucket # storage bucket for firebase
  REACT_APP_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id # messaging sender id for firebase
  REACT_APP_APP_ID=your_firebase_app_id # app id for firebase
  REACT_APP_MEASUREMENT_ID=your_firebase_measurement_id # measurement id for firebase
  ```

### Firebase Setup Guide

1. Create a Firebase Project:
  - Go to Firebase Console and sign in with your Google account.
  - Follow the steps to create a new Firebase project.
2. Install Firebase in Your Project:
  - In your project folder, install the Firebase SDK via npm:
 ```bash
   npm install firebase
   ```
3. Set up Firebase configuration variables in Your React App `.env`.
4. Set Up Firebase Authentication
  - In the Firebase Console, navigate to Firestore Database and create your database. Add collections for users, games, etc.
5. Set Up Firestore Database:
  -  In the Firebase Console, navigate to Firestore Database and create your database. Add collections for users, games, etc.

### Running the Application

After configuring your environment variables and installing all dependencies, you can start the application with:
```bash
npm start
```
#### Running Locally as Two Players

If you want to play as two players on your local machine, you can run two instances of the application concurrently:
  1. First, install the required tool:
  ```bash
  npm install concurrently
  ```
  2. Then, run both instances with:
  ```bash
  npm run start:both
  ```
This setup allows you to simulate a game between two players on separate browser tabs.

## Database Structure

The application uses Firebase Firestore to store user data and game information. Below is the structure of the **users** and **players** collections:

```json
{
  "users": {
    "$userID": {
      "email": "$email",                 // User's email
      "loss": "$loss",                   // Number of losses
      "elo": "$elo",                     // Elo rank of the player
      "uuid": "$uuid",                   // Universally Unique Identifier
      "username": "$username",           // User's display name
      "win": "$win",                     // Number of wins
      "draw": "$draw",                   // Number of draws
      "gamesPlayed": "$gamesPlayed",     // Number of games played by the player
      "invites": {
        "$inviteID": {
          "inviteId": "$inviteId",                 // Invitation ID
          "requestPlayerId": "$requestPlayerId",   // Requester's player ID
          "requestGameId": "$requestGameId",       // Game ID for the requester's active game
          "requestUserId": "$requestUserId",       // Requester's user ID
          "requestUsername": "$requestUsername",   // Requester's username
          "requestElo": "$requestElo"              // Requester's ELO rank
        }
      }
    }
  },
  "players": {
    "$playerId": {
      "userId": "$userId",             // User ID of the player
      "username": "$username",         // Username of the player
      "elo": "$elo",                   // Elo rank of the player
    }
  },
  "games": {
    "$gameId": {                               
      "createdAt": "$createdAt",               // Timestamp of when the game was created
      "currentTurn": "$currentTurn",           // Indicates whose turn it is ("w" for white, "b" for black)
      "fen": "$fen",                           // FEN (Forsyth-Edwards Notation) string representing the board state
      "gameId": "$gameId",                     // Unique identifier for the game
      "history": ["$move1", "$move2", "..."],  // Array of moves made during the game
      "lastMoveTime": "$lastMoveTime",         // Timestamp of when the last move was made
      "playerA": {                             
        "userId": "$userId",                   // User ID of player A
        "playerId": "$playerId",               // Player ID of player A
        "username": "$username",               // Username of player A
        "elo": "$elo",                         // Elo rank of player A
        "connected": "$connected",             // Connection status of player A (true, false, or "pending")
        "orientation": "$orientation"          // Board orientation of player A ("w" or "b")
      },
      "playerB": {                             
        "userId": "$userId",                   // User ID of player B
        "playerId": "$playerId",               // Player ID of player B
        "username": "$username",               // Username of player B
        "elo": "$elo",                         // Elo rank of player B
        "connected": "$connected",             // Connection status of player B (true, false, or "pending")
        "orientation": "$orientation",         // Board orientation of player B ("w" or "b")
        "inviteId": "$inviteId"                // Optional invitation ID for player B
      },
      "status": "$status",                     // Current status of the game ("in-progress", "completed", or "waiting")
      "winner": "$winner"                      // Winner of the game ("playerA", "playerB", "draw", or null if ongoing)
    }
  }
}
```

## Future Features

Here are a few exciting features that we are planning to add:

1. **Solo Practice**: Implement AI opponents for solo play.
2. **Competition Timing**: Add a timer feature for each game to enhance competitive gameplay.
3. **Live Stream**: Enable real-time streaming of friends' games so you can watch matches live.

## Contributing

If you want to contribute to this project, feel free to open an issue or submit a pull request. Any contributions, from bug fixes to new features, are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
