import React from 'react';
import Modal from '../Modal';
import { usePuzzle } from '../../../Providers/PuzzleProvider/PuzzleProvider';
import checkmark from "../../../Images/checkmark green.svg";
import xmark from "../../../Images/xmark red.svg";

/**
 * PuzzleOverModal component that displays a modal when a puzzle has ended.
 *
 * @component
 * @returns {JSX.Element|null} The rendered PuzzleOverModal component, or null if puzzleOver is false.
 */
export default function PuzzleOverModal(): JSX.Element | null {
    const { puzzleOver, handleClosePuzzle, errorPuzzleOver, loadingPuzzleOver, resetPuzzle} = usePuzzle();

    if (!puzzleOver) return null;

    const isSuccessful = puzzleOver.includes("Congratulations");

    /**
     * Action function to either close the puzzle on success or reset the puzzle on failure.
     */
    const puzzleAction = () => {
        if(isSuccessful){
            handleClosePuzzle();
        } else {
            resetPuzzle();
        }
    }

    return (
        <Modal
            addButton={true}
            handleButtonClick={puzzleAction}
            buttonLabel={isSuccessful? "Next Puzzle" : "Retry Puzzle"}
            styleType="primary"
            addClose={false}
            logoSrc={isSuccessful? checkmark : xmark}
            title={isSuccessful? "Correct Puzzle!" : "Incorrect Puzzle !"}
            body={puzzleOver?? "Congratulations! You've completed the puzzle."}
            error={errorPuzzleOver}
            loading={loadingPuzzleOver}
        />
    );
};