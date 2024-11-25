import React from 'react';
import Header from '../Header/Header';
import "./BotDashboard.css";
import ActiveGame from '../Dashboard/ActiveGame/ActiveGame';
import BotLobby from './BotLobby/BotLobby';
import { useBot } from '../../Providers/BotProvider/BotProvider';
import InGameStats from '../Dashboard/InGameStats/InGameStats';

/**
 * BotDashboard component that serves as the main container for the active game,
 * lobby, and various game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Dashboard component.
 */
export default function BotDashboard(): JSX.Element {
    const { game, orientation, fen, onDrop } = useBot();

    return (
        <>  
            <Header />

            <section className="bot-dashboard">
                <div className="bot-dashboard-content">
                    <ActiveGame 
                        orientation={orientation}
                        fen={fen}
                        onDrop={onDrop}
                    />

                    {game ? <InGameStats /> : <BotLobby />}
                </div>
            </section>
        </>
    );
}