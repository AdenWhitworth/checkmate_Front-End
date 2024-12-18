import { useCallback } from 'react';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { UsePuzzleManagementOutput, UsePuzzleManagementProps } from './usePuzzleManagementTypes';

/**
 * Custom hook for managing puzzle games. Handles puzzle creation, closing, and reconnection.
 *
 * @param {UsePuzzleManagementProps} props - The properties required for puzzle management.
 * @param {() => void} props.cleanup - Function to clean up the current puzzle state.
 * @param {Puzzle | null} props.puzzle - The current puzzle object, or `null` if no puzzle is active.
 * @param {(puzzle: Puzzle) => void} props.setPuzzle - Function to set the current puzzle state.
 * @param {"easy" | "medium" | "hard"} props.difficulty - The difficulty level of the puzzle.
 * @param {(value: boolean) => void} props.setLoadingStartPuzzle - Function to set the loading state during puzzle creation.
 * @param {(value: string | null) => void} props.setErrorStartPuzzle - Function to set the error message during puzzle creation.
 * @param {(value: string | null) => void} props.setSuccessStartPuzzle - Function to set the success message during puzzle creation.
 * @param {(value: boolean) => void} props.setLoadingPuzzleOver - Function to set the loading state when closing a puzzle.
 * @param {(value: string | null) => void} props.setErrorPuzzleOver - Function to set the error message when closing a puzzle.
 * @param {number} props.timer - The timer value representing the time taken to complete the puzzle.
 * @param {(value: boolean) => void} props.setReconnectPuzzle - Function to indicate if a puzzle was successfully reconnected.
 * @param {(value: boolean) => void} props.setLoadingReconnectPuzzle - Function to set the loading state during puzzle reconnection.
 * @param {(value: string | null) => void} props.setErrorReconnectPuzzle - Function to set the error message when reconnecting to a puzzle.
 * @param {(difficulty: "easy" | "medium" | "hard") => void} props.setDifficulty - Function to update the puzzle difficulty state.
 * @returns {UsePuzzleManagementOutput} - An object containing methods for puzzle creation, closing, and reconnection.
 */
export const usePuzzleManagement = ({
    cleanup,
    puzzle,
    setPuzzle,
    difficulty,
    setLoadingStartPuzzle,
    setErrorStartPuzzle,
    setSuccessStartPuzzle,
    setLoadingPuzzleOver,
    setErrorPuzzleOver,
    timer,
    setReconnectPuzzle,
    setLoadingReconnectPuzzle,
    setErrorReconnectPuzzle,
    setDifficulty,
}: UsePuzzleManagementProps): UsePuzzleManagementOutput => {
    
    const { 
        socketRef,
        sendStartPuzzle,
        sendClosePuzzle,
        sendReconnectPuzzle
    } = useSocket();
    const { playerStatic, playerDynamic, setPlayerDynamic } = usePlayer();

    /**
     * Starts a new puzzle. Sends a request to the server to create a puzzle and updates the game state.
     *
     * @async
     * @function handleCreatePuzzle
     * @returns {Promise<void>} - Resolves when the puzzle is successfully created, or sets an error message otherwise.
     */
    const handleCreatePuzzle = useCallback(async (): Promise<void> => {
        setLoadingStartPuzzle(true);
        setErrorStartPuzzle(null);
        setSuccessStartPuzzle(null);

        try {
            if (!socketRef.current || !playerStatic || !playerDynamic) throw new Error("No puzzle created.");
            const newPuzzle = await sendStartPuzzle({difficulty, lastPuzzle: playerDynamic.lastPuzzle});
            if (!newPuzzle) throw new Error("No puzzle created.");
            setPuzzle(newPuzzle.puzzle);
            setSuccessStartPuzzle("Puzzle started successfully! Play the best move.")
        } catch (error) {
            setErrorStartPuzzle("Unable to start puzzle. Please try again.")
        } finally {
            setLoadingStartPuzzle(false);
        }
    }, [difficulty, playerDynamic, playerStatic, sendStartPuzzle, setErrorStartPuzzle, setLoadingStartPuzzle, setPuzzle, setSuccessStartPuzzle, socketRef]);
    
    /**
     * Closes the current puzzle and notifies the server about completion.
     *
     * @async
     * @function handleClosePuzzle
     * @returns {Promise<void>} - Resolves when the puzzle is closed successfully, or sets an error message otherwise.
     */
    const handleClosePuzzle = useCallback(async ():Promise<void> => {
        setErrorPuzzleOver(null);
        setLoadingPuzzleOver(true);

        try {
            if (!socketRef.current || !playerStatic || !playerDynamic || !puzzle || !puzzle.puzzleId) throw new Error("No puzzle closed.");
            await sendClosePuzzle({ difficulty: puzzle.difficulty, timeToComplete: timer, puzzleId: puzzle.puzzleId});
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  activePuzzle: undefined,
                };
            });
            cleanup();
        } catch (error) {
            setErrorPuzzleOver("Unable to close the puzzle. Please try again.");
        } finally {
            setLoadingPuzzleOver(false);
        }

    }, [cleanup, playerDynamic, playerStatic, puzzle, sendClosePuzzle, setErrorPuzzleOver, setLoadingPuzzleOver, setPlayerDynamic, socketRef, timer]);
    
    /**
     * Reconnects to an active puzzle. Fetches the current puzzle state from the server and updates the local game state.
     *
     * @async
     * @function handleReconnectPuzzle
     * @returns {Promise<void>} - Resolves when the reconnection is successful, or sets an error message otherwise.
     */
    const handleReconnectPuzzle = useCallback(async (): Promise<void> => {
        if (!puzzle && playerDynamic?.activePuzzle && playerStatic?.userId) {
            setErrorReconnectPuzzle(null);
            setLoadingReconnectPuzzle(true);

            try {
                const reconnectedPuzzle = await sendReconnectPuzzle({ activePuzzle: playerDynamic.activePuzzle });
                
                if (!reconnectedPuzzle?.puzzle) throw new Error("No puzzle to reconnect to.");

                setDifficulty(reconnectedPuzzle.puzzle.difficulty);
                setPuzzle(reconnectedPuzzle.puzzle);
                setReconnectPuzzle(true);
            } catch (error) {
                setErrorReconnectPuzzle("Failed to reconnect to the active puzzle. Please try again.");
            } finally {
               setLoadingReconnectPuzzle(false);
            }
        }
    }, [playerDynamic, playerStatic, puzzle, sendReconnectPuzzle, setDifficulty, setErrorReconnectPuzzle, setLoadingReconnectPuzzle, setPuzzle, setReconnectPuzzle]);
    
    return {
        handleCreatePuzzle,
        handleClosePuzzle,
        handleReconnectPuzzle
    };
};