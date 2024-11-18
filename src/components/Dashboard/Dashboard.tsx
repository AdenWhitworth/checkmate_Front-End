import React from 'react';
import Header from '../Header/Header';
import "./Dashboard.css";
import ActiveGame from './ActiveGame/ActiveGame';
import Lobby from './Lobby/Lobby';
import { useGame } from '../../Providers/GameProvider/GameProvider';
import InGameStats from './InGameStats/InGameStats';
import ForfeitModal from '../Modal/ForfeitModal/ForfeitModal';
import ExitModal from '../Modal/ExitModal/ExitModal';
import CreateRoomAlertBadge from '../AlertBadge/CreateRoomAlertBadge/CreateRoomAlertBadge';
import JoinRoomAlertBadge from '../AlertBadge/JoinRoomAlertBadge/JoinRoomAlertBadge';
import GameOverModal from '../Modal/GameOverModal/GameOverModal';
import GameChat from './GameChat/GameChat';
import MoveAlertBadge from '../AlertBadge/MoveAlertBadge/MoveAlertBadge';
import DisconnectModal from '../Modal/DisconnectModal/DisconnectModal';
import ReconnectRoomBadge from '../AlertBadge/ReconnectRoomBadge/ReconnectRoomBadge';
import ReconnectModal from '../Modal/ReconnectModal/ReconnectModal';
import OpponentReconnectRoomBadge from '../AlertBadge/OpponentReconnectRoomBadge/OpponentReconnectRoomBadge';

/**
 * Dashboard component that serves as the main container for the active game,
 * lobby, and various game-related modals and alerts.
 * 
 * @component
 * @returns {JSX.Element} - The rendered Dashboard component.
 */
export default function Dashboard(): JSX.Element {
    const { game } = useGame();

    return (
        <>  
            <Header />

            <section className="dashboard">
                <div className="dashboard-content">
                    <ActiveGame />
                    {game ? <InGameStats /> : <Lobby />}
                </div>
            </section>

            {game && <GameChat></GameChat>}
            <ForfeitModal />
            <ExitModal />
            <GameOverModal />
            <DisconnectModal />
            <ReconnectModal />
            <CreateRoomAlertBadge />
            <JoinRoomAlertBadge />
            <MoveAlertBadge />
            <ReconnectRoomBadge />
            <OpponentReconnectRoomBadge />
        </>
    );
}