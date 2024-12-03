import React from 'react';
import Modal from '../Modal';
import king_logo_black from '../../../Images/King Logo Black.svg';
import { useBot } from '../../../Providers/BotProvider/BotProvider';

/**
 * ForfeitBotModal component renders a confirmation modal to forfeit the current bot game.
 * The modal displays the game difficulty and provides options to confirm or cancel the forfeit action.
 *
 * @component
 * @returns {JSX.Element | null} - The rendered ForfeitBotModal component if the `forfeitBotGame` flag is true,
 *                                 or `null` if the modal should not be displayed.
 */
export default function ForfeitBotModal(): JSX.Element | null {
    const {forfeitBotGame, setForfeitBotGame, handleForfeit, errorForfeit, loadingForfeit, difficulty} = useBot();
    if (!forfeitBotGame) return null;

    return (
        <Modal
            addButton={true}
            handleButtonClick={handleForfeit}
            buttonLabel="Confirm"
            styleType="primary"
            addClose={true}
            handleCloseClick={() => setForfeitBotGame(false)}
            logoSrc={king_logo_black}
            title="Forfeit the game!"
            body={`Are you sure you want to forfeit the game against ${difficulty} Bot?`}
            error={errorForfeit}
            loading={loadingForfeit}
        />
    );
};
