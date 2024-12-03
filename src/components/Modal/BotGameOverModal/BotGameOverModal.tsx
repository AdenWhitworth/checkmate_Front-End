import React from 'react';
import Modal from '../Modal';
import king_logo_black from '../../../Images/King Logo Black.svg';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * BotGameOverModal component renders a modal to display the end of a bot chess game.
 * The modal includes the game result, a button to continue, and handles errors or loading states.
 *
 * @component
 * @returns {JSX.Element | null} - The rendered BotGameOverModal component if the game is over,
 *                                 or `null` if the game is still ongoing.
 */
export default function BotGameOverModal(): JSX.Element | null {
    const { gameOver, handleCloseBotGame, errorOver, loadingOver } = useBot();

    if (!gameOver) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleCloseBotGame}
            buttonLabel="Continue"
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title="Game over!"
            body={gameOver}
            error={errorOver}
            loading={loadingOver}
        />
    );
};