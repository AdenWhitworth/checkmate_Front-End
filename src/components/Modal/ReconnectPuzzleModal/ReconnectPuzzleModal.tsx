import React from 'react';
import Modal from '../Modal';
import king_logo_black from '../../../Images/King Logo Black.svg';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';

/**
 * ReconnectPuzzleModal component displays a modal to notify the user about the reconnection status
 * of an active puzzle game. It provides a retry button if reconnection fails.
 *
 * @component
 * @returns {JSX.Element | null} The rendered `ReconnectPuzzleModal` component or `null` if no reconnect operation is in progress or there is no error.
 */
export default function ReconnectPuzzleModal(): JSX.Element | null {
    const { loadingReconnectPuzzle, errorReconnectPuzzle, handleReconnectPuzzle, puzzle, difficulty} = usePuzzle();
    
    if (!loadingReconnectPuzzle && !errorReconnectPuzzle) return null;
    if (!puzzle) return null;

    return (
        <Modal
            addButton={!loadingReconnectPuzzle}
            handleButtonClick={handleReconnectPuzzle}
            buttonLabel={"Try again"}
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title={`Reconnecting to active ${difficulty} puzzle #${puzzle.puzzleTag}!`}
            body={""}
            loading={loadingReconnectPuzzle}
            error={errorReconnectPuzzle}
        />
    );
};