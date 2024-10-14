import React from 'react';
import Header from '../Header/Header';
import "./Dashboard.css";
import { GameProvider } from '../../Providers/GameProvider/GameProvider';
import ActiveGame from './ActiveGame/ActiveGame';
import Lobby from './Lobby/Lobby';

export default function Dashboard(): JSX.Element {

    return (
        <>  
            <GameProvider>
                <Header></Header>
                
                <section className="dashboard">
                    <div className="dashboard-content">
                        <ActiveGame></ActiveGame>

                       <Lobby></Lobby> 
                    </div>
                </section>
            </GameProvider>
        </>
    );
}