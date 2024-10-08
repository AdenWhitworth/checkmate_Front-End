<img width="80" src="https://github.com/AdenWhitworth/online_chess_with_friends_Front-End/raw/master/src/Images/King%20Logo%20Black.svg" alt="Online Chess With Friends Logo">

# Online Chess With Friends Front-End

Welcome to the **Online Chess With Friends Front-End**! This repository contains the code for the web-based user interface, allowing players to challenge friends to chess matches, chat during the game, and track their rankings. The project integrates seamlessly with the back-end to provide real-time multiplayer chess gameplay.

## Table of Contents
- [Overview](#overview)
- [Online Chess With Friends Live Demo](#online-chess-with-friends-live-demo)
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

The Online Chess With Friends Front-End is built using React and provides a responsive, real-time chess-playing experience. Users can create and join chess games, communicate through in-game chat, and track their performance using the integrated ranking system.

## Online Chess With Friends Live Demo

The Online Chess With Friends application is live and can be accessed here: [Online Chess With Friends Demo](https://online-chess-with-friends.web.app/). You can explore all features of the game, including real-time gameplay, chat, and rankings.

### Test User Credentials

Try out the app using the following demo accounts:

- **Emails:** demo1@gmail.com & demo2@gmail.com
- **Password:** PortfolioDemo1!

>**Note**: You can even play against yourself by opening the application in two separate browser windows.

## Features

- **Real-Time Gameplay**: Challenge your friends in a multiplayer chess game with real-time move updates.
- **In-Game Chat**: Communicate with your opponent during the game with the built-in chat feature.
- **Ranking System**: Track your performance and compare rankings with friends.
- **In-Game Statistics**: Monitor game statistics as you play.
- **Responsive Design**: Optimized for desktop and mobile devices, ensuring a great user experience on any screen size.

## Technologies Used

- **React**: A powerful JavaScript library for building user interfaces, enabling the development of dynamic and responsive web applications.
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
   git clone https://github.com/AdenWhitworth/online_chess_with_friends_Front-End.git
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
3. Se up Firebase in Your React App:
```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "your_firebase_api_key",
    authDomain: "your_firebase_auth_domain",
    projectId: "online-chess-with-friends",
    storageBucket: "your_firebase_storage_bucket",
    messagingSenderId: "your_firebase_messaging_sender_id",
    appId: "your_firebase_app_id",
    measurementId: "your_firebase_measurement_id"
};

const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
  ```
4. Set Up Firebase Authentication
  - In the Firebase Console, navigate to Firestore Database and create your database. Add collections for users, games, etc.
5. Set Up Firestore Database:
  -  In the Firebase Console, navigate to Firestore Database and create your database. Add collections for users, games, etc.

### Running the Application

Once the environment variables are configured and dependencies are installed, you can start the application with:
```bash
npm start
```

## Database Structure

The application uses Firebase Firestore to store user data and game information. Below is the structure of the **users** and **players** collections:

```json
{
  "users": {
    "$userID": {
      "email": "$email",             // User's email
      "loss": "$loss",               // Number of losses
      "playerID": "$playerID",       // Player's unique ID
      "rank": "$rank",               // Player's rank
      "uuid": "$uuid",               // Universally Unique Identifier
      "username": "$username",       // User's display name
      "win": "$win",                 // Number of wins
      "invites": {
        "$inviteID": {
          "requestLoss": "$requestLoss",           // Requester's loss count
          "requestPlayerID": "$requestPlayerID",   // Requester's player ID
          "requestRoom": "$requestRoom",           // Room associated with the request
          "requestUserID": "$requestUserID",       // Requester's user ID
          "requestUserName": "$requestUserName",   // Requester's username
          "requestWin": "$requestWin"              // Requester's win count
        }
      }
    }
  },
  "players": {
    "$playerID": {
      "userID": "$userID",             // User ID of the player
      "username": "$username"          // Username of the player
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
![image](https://github.com/user-attachments/assets/2c7bbb97-35f2-44b4-ae71-4cce44390acb)
