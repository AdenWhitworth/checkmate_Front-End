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
              </Routes>
            </GameProvider>
          </SocketProvider>
        </PlayerProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
