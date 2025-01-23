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

    const puzzleInfo = puzzle?.puzzleTag;

    /*
    if (!(loadingReconnectPuzzle || errorReconnectPuzzle || !puzzle)) {
        return null;
    }*/

    if (!(loadingReconnectPuzzle && !puzzle) || (errorReconnectPuzzle && !puzzle)) {
        return null;
    }

    return (
        <Modal
            addButton={!loadingReconnectPuzzle}
            handleButtonClick={handleReconnectPuzzle}
            buttonLabel={"Try again"}
            styleType="primary"
            addClose={false}
            logoSrc={king_logo_black}
            title={puzzleInfo? `Reconnecting to active ${difficulty} puzzle #${puzzleInfo}!` : "Reconnecting to active puzzle..."}
            body={""}
            loading={loadingReconnectPuzzle}
            error={errorReconnectPuzzle}
        />
    );
};