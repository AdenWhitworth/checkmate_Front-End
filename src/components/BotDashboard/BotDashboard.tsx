import React from 'react';
import Header from '../Header/Header';
import "./BotDashboard.css";
import { useGame } from '../../Providers/GameProvider/GameProvider';
import ActiveGame from '../Dashboard/ActiveGame/ActiveGame';

/**
 * BotDashboard component that serves as the main container for the active game,
 * lobby, and various game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Dashboard component.
 */
export default function BotDashboard(): JSX.Element {
    const { game, orientation, fen, onDrop } = useGame();

    return (
        <>  
            <Header />

            <section className="dashboard">
                <div className="dashboard-content">
                    <ActiveGame 
                        orientation={orientation}
                        fen={fen}
                        onDrop={onDrop}
                    />
                </div>
            </section>
        </>
    );
}