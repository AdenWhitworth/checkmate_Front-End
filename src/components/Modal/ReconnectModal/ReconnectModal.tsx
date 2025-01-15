import React from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import king_logo_black from '../../../Images/King Logo Black.svg';

/**
 * ReconnectModal component that displays a modal when an player is reconnecting to a game.
 *
 * @component
 * @returns {JSX.Element|null} The rendered ReconnectModal component, or null if not loading or no error.
 */
export default function ReconnectModal(): JSX.Element | null {
    const { loadingReconnectGame, errorReconnectGame, handleReconnectRoom, game, opponent} = useGame();

    const isOpponentPlayerA = game?.playerA.userId === opponent?.opponentUserId;
    const playerUsername = isOpponentPlayerA? game?.playerA?.username : game?.playerB?.username

    if (!(loadingReconnectGame && !game) || (errorReconnectGame && !game)) {
        return null;
    }

    return (
        <Modal
            addButton={!loadingReconnectGame}
            handleButtonClick={handleReconnectRoom}
            buttonLabel={"Try again"}
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title={playerUsername? `Reconnecting to active game against ${playerUsername}!` : "Reconnecting to active game..."}
            body={""}
            loading={loadingReconnectGame}
            error={errorReconnectGame}
        />
    );
};