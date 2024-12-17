import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Puzzle, PuzzleContextType } from './PuzzleProviderTypes';
import { usePuzzleChessGame } from '../../Hooks/usePuzzleChessGame/usePuzzleChessGame';
import { usePuzzleManagement } from '../../Hooks/usePuzzleManagment/usePuzzleManagement';

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

/**
 * Provides the state and management functions for chess puzzles.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to the puzzle context.
 * @returns {JSX.Element} - The `PuzzleProvider` component wrapping child components.
 */
export const PuzzleProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
    const chess = useMemo(() => {
        const instance = new Chess();
        return instance;
    }, [puzzle]);
    const [fen, setFen] = useState<string>("start");

    const [puzzleOver, setPuzzleOver] = useState<string | null>(null);
    const [loadingPuzzleOver, setLoadingPuzzleOver] = useState<boolean>(false); 
    const [errorPuzzleOver, setErrorPuzzleOver] = useState<string | null>(null);

    const [loadingStartPuzzle, setLoadingStartPuzzle] = useState<boolean>(false);
    const [errorStartPuzzle, setErrorStartPuzzle] = useState<string | null>(null);
    const [successStartPuzzle, setSuccessStartPuzzle] = useState<string | null>(null);

    const [reconnectPuzzle, setReconnectPuzzle] = useState<boolean>(false);
    const [loadingReconnectPuzzle, setLoadingReconnectPuzzle] = useState<boolean>(false);
    const [errorReconnectPuzzle, setErrorReconnectPuzzle] = useState<string | null>(null);

    const [timer, setTimer] = useState<number>(0);
    
    const { onDrop, onPromotionPieceSelect, resetPuzzle } = usePuzzleChessGame({
        puzzle,
        orientation,
        setOrientation,
        chess,
        setFen,
        setPuzzleOver,
        setPlayerTurn,
        setTimer,
    });

    /**
     * Resets the game state to its initial values.
     */
    const cleanup = useCallback(() => {
        setFen("start");
        setPuzzle(null);
        setOrientation("w");
        setPlayerTurn("w");
        setPuzzleOver(null);
    }, []);

    const { 
        handleCreatePuzzle,
        handleClosePuzzle,
        handleReconnectPuzzle
    } = usePuzzleManagement({
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
        setDifficulty
    });

    return (
        <PuzzleContext.Provider value={{
            difficulty,
            setDifficulty,
            orientation,
            setOrientation,
            playerTurn,
            setPlayerTurn,
            puzzle,
            setPuzzle,
            fen,
            setFen,
            puzzleOver,
            setPuzzleOver,
            loadingPuzzleOver,
            setLoadingPuzzleOver,
            errorPuzzleOver,
            setErrorPuzzleOver,
            loadingStartPuzzle,
            setLoadingStartPuzzle,
            errorStartPuzzle,
            setErrorStartPuzzle,
            successStartPuzzle,
            setSuccessStartPuzzle,
            onDrop,
            onPromotionPieceSelect,
            handleCreatePuzzle,
            handleClosePuzzle,
            handleReconnectPuzzle,
            reconnectPuzzle,
            setReconnectPuzzle,
            loadingReconnectPuzzle,
            setLoadingReconnectPuzzle,
            errorReconnectPuzzle,
            setErrorReconnectPuzzle,
            timer,
            resetPuzzle
        }}>
            {children}
        </PuzzleContext.Provider>
    );
};

/**
 * Custom hook to access the puzzle context.
 *
 * @throws {Error} - Throws an error if used outside a `PuzzleProvider`.
 * @returns {PuzzleContextType} - The context value containing puzzle state and management functions.
 */
export const usePuzzle = (): PuzzleContextType => {
    const context = useContext(PuzzleContext);
    if (context === undefined) {
        throw new Error('usePuzzle must be used within a PuzzleProvider');
    }
    return context;
};