import React, { useEffect } from 'react';
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
import ReconnectBotGameModal from '../Modal/ReconnectBotGameModel/ReconnectBotGameModel';
import ReconnectBotGameBadge from '../AlertBadge/ReconnectBotGameBadge/ReconnectBotGameBadge';
import BotHintAlertBadge from '../AlertBadge/BotHintAlertBadge/BotHintAlertBadge';
import BotUndoAlertBadge from '../AlertBadge/BotUndoAlertBadge/BotUndoAlertBadge';

/**
 * BotDashboard component that serves as the main container for the active game,
 * lobby, and various bot game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered BotDashboard component.
 */
export default function BotDashboard(): JSX.Element {
    const { botGame, orientation, fen, onDrop, hint, onSquareClick, highlightedSquares, onPromotionPieceSelect, handleReconnectBotGame } = useBot();

    /**
     * Attempt to reconnect to an active bot game if present.
     */
    useEffect(() => {
        handleReconnectBotGame();
    },[handleReconnectBotGame])

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
                        onSquareClick={onSquareClick}
                        highlightedSquares={highlightedSquares}
                        onPromotionPieceSelect={onPromotionPieceSelect}
                    />

                    {botGame ? <BotInGameStats /> : <BotLobby />}
                </div>
            </section>

            <ForfeitBotModal />
            <BotGameOverModal />
            <ReconnectBotGameModal />
            <CreateBotGameAlertBadge />
            <BotMoveAlertBadge />
            <ReconnectBotGameBadge />
            <BotHintAlertBadge />
            <BotUndoAlertBadge />
        </>
    );
}