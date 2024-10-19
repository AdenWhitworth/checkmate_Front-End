import React from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import king_logo_black from '../../../Images/King Logo Black.svg';

/**
 * GameOverModal component that displays a modal when a game has ended.
 *
 * @component
 * @returns {JSX.Element|null} The rendered GameOverModal component, or null if gameOver is false.
 */
export default function GameOverModal() {
    const { gameOver, handleCloseRoom, errorOver, loadingOver } = useGame();
    if (!gameOver) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleCloseRoom}
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