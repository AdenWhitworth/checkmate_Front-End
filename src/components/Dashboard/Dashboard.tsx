import React from 'react';
import Header from '../Header/Header';
import "./Dashboard.css";
import { GameProvider } from '../../Providers/GameProvider/GameProvider';
import ActiveGame from './ActiveGame/ActiveGame';
import Lobby from './Lobby/Lobby';
import { useGame } from '../../Providers/GameProvider/GameProvider';
import InGameStats from './InGameStats/InGameStats';

export default function Dashboard(): JSX.Element {

    //const { room } = useGame();

    return (
        <>  
            <GameProvider>
                <Header></Header>
                
                <section className="dashboard">
                    <div className="dashboard-content">
                        <ActiveGame></ActiveGame>
                        
                        <InGameStats></InGameStats>
                        {/*
                        {room? (
                            <InGameStats></InGameStats>
                        ):(
                            <Lobby></Lobby> 
                        )}
                        */}
                    </div>
                </section>
            </GameProvider>
        </>
    );
}