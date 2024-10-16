import React from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

export default function ExitModal() {
    const { exitGame, setExitGame, handleExit, opponent, errorExit, loadingExit } = useGame();
    if (!exitGame) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleExit}
            buttonLabel="Confirm"
            styleType="primary"
            addClose={true}
            handleCloseClick={() => setExitGame(false)}
            logoSrc="king_logo_black"
            title="Exit the game!"
            body={`Are you sure you want to exit the game against ${opponent?.opponentUsername || 'Opponent'} while waiting for them to join?`}
            error={errorExit}
            loading={loadingExit}
        />
    );
};
