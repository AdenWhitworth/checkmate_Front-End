import React from 'react';
import Header from '../Header/Header';
import "./BotDashboard.css";
import ActiveGame from '../Dashboard/ActiveGame/ActiveGame';
import BotLobby from './BotLobby/BotLobby';
import { useBot } from '../../Providers/BotProvider/BotProvider';
import BotInGameStats from './BotInGameStats/BotInGameStats';
import ForfeitBotModal from '../Modal/ForfeitBotModal/ForfeitBotModal';
import BotGameOverModal from '../Modal/BotGameOverModal/BotGameOverModal';
import CreateBotGameAlertBadge from '../AlertBadge/CreateBotGameAlertBadge/CreateBotGameAlertBadge';
import BotMoveAlertBadge from '../AlertBadge/BotMoveAlertBadge/BotMoveAlertBadge';

/**
 * BotDashboard component that serves as the main container for the active game,
 * lobby, and various bot game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Dashboard component.
 */
export default function BotDashboard(): JSX.Element {
    const { botGame, orientation, fen, onDrop, hint } = useBot();

    return (
        <>  
            <Header />

            <section className="bot-dashboard">
                <div className="bot-dashboard-content">
                    <ActiveGame 
                        orientation={orientation}
                        fen={fen}
                        onDrop={onDrop}
                        hint={hint}
                    />

                    {botGame ? <BotInGameStats /> : <BotLobby />}
                </div>
            </section>

            <ForfeitBotModal />
            <BotGameOverModal />
            <CreateBotGameAlertBadge />
            <BotMoveAlertBadge />
        </>
    );
}