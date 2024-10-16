import React from 'react';
import Modal from '../Modal';
import { useGame } from '../../../Providers/GameProvider/GameProvider';

export default function ForfeitModal() {
    const { forfeitGame, setForfeitGame, handleForfeit, opponent, errorForfeit, loadingForfeit } = useGame();
    if (!forfeitGame) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleForfeit}
            buttonLabel="Confirm"
            styleType="primary"
            addClose={true}
            handleCloseClick={() => setForfeitGame(false)}
            logoSrc="king_logo_black"
            title="Forfeit the game!"
            body={`Are you sure you want to forfeit the game against ${opponent?.opponentUsername || 'Opponent'}?`}
            error={errorForfeit}
            loading={loadingForfeit}
        />
    );
};
