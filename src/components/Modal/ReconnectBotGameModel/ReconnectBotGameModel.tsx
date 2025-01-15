import React from 'react';
import Modal from '../Modal';
import king_logo_black from '../../../Images/King Logo Black.svg';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * ReconnectBotGameModal component displays a modal to notify the user about the reconnection status
 * of an active bot game. It provides a retry button if reconnection fails.
 *
 * @component
 * @returns {JSX.Element | null} The rendered `ReconnectBotGameModal` component or `null` if no reconnect operation is in progress or there is no error.
 */
export default function ReconnectBotGameModal(): JSX.Element | null {
    const { loadingReconnectGame, errorReconnectGame, handleReconnectBotGame, botGame, difficulty} = useBot();
    
    if (!(loadingReconnectGame || errorReconnectGame || !botGame)) {
        return null;
    }

    return (
        <Modal
            addButton={!loadingReconnectGame}
            handleButtonClick={handleReconnectBotGame}
            buttonLabel={"Try again"}
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title={botGame? `Reconnecting to active game against ${difficulty} ${botGame?.playerB.username}!` : "Reconnecting to an active game..."}
            body={""}
            loading={loadingReconnectGame}
            error={errorReconnectGame}
        />
    );
};