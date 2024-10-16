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
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';

export default function Dashboard(): JSX.Element {

    const { loadingPlayer, loadingInvites, loadingPlayers} = usePlayer();
    const { room } = useGame();

    return (
        <>
            {(loadingPlayer || loadingInvites || loadingPlayers) ? (
                <LoadingSpinner />
            ) : (
                <>
                    <Header />
                    <section className="dashboard">
                        <div className="dashboard-content">
                            <ActiveGame />
                            {room ? <InGameStats /> : <Lobby />}
                        </div>
                    </section>
                    <ForfeitModal />
                    <ExitModal />
                    <CreateRoomAlertBadge />
                    <JoinRoomAlertBadge />
                </>
            )}
        </>
    );
}