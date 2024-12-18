import { Puzzle } from "../../Providers/PuzzleProvider/PuzzleProviderTypes";

/**
 * Props for the `usePuzzleManagement` hook.
 *
 * @interface UsePuzzleManagementProps
 * @property {() => void} cleanup - Function to clean up the current puzzle state.
 * @property {Puzzle | null} puzzle - The current puzzle data, or `null` if no puzzle is active.
 * @property {(value: Puzzle | null) => void} setPuzzle - Function to update the current puzzle state.
 * @property {"easy" | "medium" | "hard"} difficulty - The difficulty level of the puzzle.
 * @property {(value: boolean) => void} setLoadingStartPuzzle - Function to set the loading state when starting a puzzle.
 * @property {(value: string | null) => void} setErrorStartPuzzle - Function to set an error message when starting a puzzle.
 * @property {(value: string | null) => void} setSuccessStartPuzzle - Function to set a success message when starting a puzzle.
 * @property {(value: boolean) => void} setLoadingPuzzleOver - Function to set the loading state when closing a puzzle.
 * @property {(value: string | null) => void} setErrorPuzzleOver - Function to set an error message when closing a puzzle.
 * @property {number} timer - The total time taken to complete the puzzle, in seconds.
 * @property {(value: boolean) => void} setReconnectPuzzle - Function to set the state indicating a successful reconnection to a puzzle.
 * @property {(value: boolean) => void} setLoadingReconnectPuzzle - Function to set the loading state when reconnecting to a puzzle.
 * @property {(value: string | null) => void} setErrorReconnectPuzzle - Function to set an error message when reconnecting to a puzzle.
 * @property {(value: "easy" | "medium" | "hard") => void} setDifficulty - Function to update the puzzle difficulty.
 */
export interface UsePuzzleManagementProps {
    cleanup: () => void;
    puzzle: Puzzle | null;
    setPuzzle: (value: Puzzle | null) => void;
    difficulty: "easy" | "medium" | "hard";
    setLoadingStartPuzzle: (value: boolean) => void;
    setErrorStartPuzzle: (value: string | null) => void;
    setSuccessStartPuzzle: (value: string | null) => void;
    setLoadingPuzzleOver: (value: boolean) => void;
    setErrorPuzzleOver: (value: string | null) => void;
    timer: number;
    setReconnectPuzzle: (value: boolean) => void;
    setLoadingReconnectPuzzle: (value: boolean) => void;
    setErrorReconnectPuzzle: (value: string | null) => void;
    setDifficulty: (value: "easy" | "medium" | "hard") => void;
}

/**
 * Output of the `usePuzzleManagement` hook.
 *
 * @interface UsePuzzleManagementOutput
 * @property {() => Promise<void>} handleCreatePuzzle - Function to handle starting a new puzzle.
 * @property {() => Promise<void>} handleClosePuzzle - Function to handle closing the current puzzle.
 * @property {() => Promise<void>} handleReconnectPuzzle - Function to handle reconnecting to an existing puzzle.
 */
export interface UsePuzzleManagementOutput {
    handleCreatePuzzle: () => Promise<void>;
    handleClosePuzzle: () => Promise<void>;
    handleReconnectPuzzle: () => Promise<void>;
}