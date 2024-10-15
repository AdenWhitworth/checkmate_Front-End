import React from 'react';
import Header from '../Header/Header';
import "./Dashboard.css";
import ActiveGame from './ActiveGame/ActiveGame';
import Lobby from './Lobby/Lobby';
import { useGame } from '../../Providers/GameProvider/GameProvider';
import InGameStats from './InGameStats/InGameStats';

export default function Dashboard(): JSX.Element {

    const { room } = useGame();

    return (
        <>  
            <Header></Header>
            
            <section className="dashboard">
                <div className="dashboard-content">
                    <ActiveGame></ActiveGame>
                    
                    {room? (
                        <InGameStats></InGameStats>
                    ):(
                        <Lobby></Lobby> 
                    )}
                </div>
            </section>
        </>
    );
}