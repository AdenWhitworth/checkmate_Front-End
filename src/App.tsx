import './App.css';
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Landing from './components/Landing/Landing';
import { AuthProvider } from './Providers/AuthProvider/AuthProvider';
import { PlayerProvider } from './Providers/PlayerProvider/PlayerProvider';
import { SocketProvider } from './Providers/SocketProvider/SocketProvider';
import PrivateRoute from './Routes/PrivateRoute';
import Authentication from './components/Authentication/Authentication';
import Dashboard from './components/Dashboard/Dashboard';
import { GameProvider } from './Providers/GameProvider/GameProvider';
import Profile from './components/Profile/Profile';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ResetPassword/ResetPassword';

/**
 * The main App component that sets up the routing and providers for the application.
 * This component wraps the application in necessary context providers like 
 * `AuthProvider`, `PlayerProvider`, `SocketProvider`, and `GameProvider`.
 * 
 * @component
 * @returns {JSX.Element} - The rendered App component containing all routes and providers.
 * 
 * @description
 * - `AuthProvider` provides authentication state and functions.
 * - `PlayerProvider` provides state and functions for managing player-related data.
 * - `SocketProvider` provides socket connection and communication functionality.
 * - `GameProvider` provides state and functions for managing the game logic.
 * 
 * @remarks
 * - The App uses `Routes` and `Route` from `react-router-dom` to define the routes of the application.
 * - The `/dashboard` and `profile` routes are protected by `PrivateRoute`, which checks if a user is authenticated before allowing access.
 * - Environment variable `REACT_APP_BASE_URL` is used for the SocketProvider's URL.
 */
function App(): JSX.Element {

  return (
    <div className="App">  
      <AuthProvider>
        <PlayerProvider>
          <SocketProvider url={process.env.REACT_APP_BASE_URL as string}>
            <GameProvider>
              <Routes>
                <Route path='/' element={<Landing></Landing>}></Route>
                <Route path='/auth' element={<Authentication></Authentication>}></Route>
                <Route path='/dashboard' element={<PrivateRoute><Dashboard></Dashboard></PrivateRoute>}></Route>
                <Route path='/profile' element={<PrivateRoute><Profile></Profile></PrivateRoute>}></Route>
                <Route path='/forgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
                <Route path='/resetPassword' element={<ResetPassword></ResetPassword>}></Route>
              </Routes>
            </GameProvider>
          </SocketProvider>
        </PlayerProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
