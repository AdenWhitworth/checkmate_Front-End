import React from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';
import king_logo_black from '../../../Images/King Logo Black.svg';

/**
 * ExitModal component that displays a confirmation modal when a user attempts to exit a game.
 *
 * @component
 * @returns {JSX.Element|null} The rendered ExitModal component, or null if exitGame is false.
 */
export default function ExitModal(): JSX.Element | null {
    const { exitGame, setExitGame, handleExitRoom, opponent, errorExit, loadingExit } = useGame();
    if (!exitGame) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleExitRoom}
            buttonLabel="Confirm"
            styleType="primary"
            addClose={true}
            handleCloseClick={() => setExitGame(false)}
            logoSrc={king_logo_black}
            title="Exit the game!"
            body={`Are you sure you want to exit the game against ${opponent?.opponentUsername || 'Opponent'} while waiting for them to join?`}
            error={errorExit}
            loading={loadingExit}
        />
    );
};
