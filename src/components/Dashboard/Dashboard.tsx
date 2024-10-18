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
import GameChat from './ActiveGame/GameChat/GameChat';

export default function Dashboard(): JSX.Element {
    const { room } = useGame();

    return (
        <>  
            <Header />
            <section className="dashboard">
                <div className="dashboard-content">
                    <ActiveGame />
                    {room ? <InGameStats /> : <Lobby />}
                </div>
            </section>
            {room && <GameChat></GameChat>}
            <ForfeitModal />
            <ExitModal />
            <GameOverModal />
            <CreateRoomAlertBadge />
            <JoinRoomAlertBadge />
        </>
    );
}