import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { Game } from './GameProviderTypes';
import { GameContextType, Opponent } from './GameProviderTypes';
import { Chess, Move } from "chess.js";
import { useChessGame } from '../../Hooks/useChessGame/useChessGame';
import { GameMoves } from '../../components/Dashboard/InGameStats/InGameStatsTypes';
import { useGameRoomManagement } from '../../Hooks/useGameRoomManagement/useGameRoomManagement';

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Provides the game context to its child components, managing the state and logic for game rooms, players, and moves.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The child components to receive the game context.
 * @returns {JSX.Element} The rendered GameProvider component.
 */
export const GameProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
    const [opponent, setOpponent] = useState<Opponent | null>(null);
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [game, setGame] = useState<Game | null>(null);
    const chess = useMemo(() => {
        const instance = new Chess();
    
        if (!game?.history || game.history.length === 0) {
            return instance;
        }
    
        instance.reset();
    
        for (const moveString of game.history) {
            let move = typeof moveString === "string" ? JSON.parse(moveString) : moveString;
    
            if (move && move.from && move.to) {
                const result = instance.move(move);
                if (!result) {
                    console.error("Invalid move:", move);
                    console.error("Current FEN:", instance.fen());
                    break;
                }
            } else {
                console.error("Invalid move format:", move);
            }
        }
    
        if (instance.fen() !== game.fen) {
            console.warn("Game is out of sync");
        } else {
            console.log("Game is in sync");
        }
    
        return instance;
    }, [game]);
    const [fen, setFen] = useState<string>("start");
    const [errorMove, setErrorMove] = useState<string | null>(null);
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);
    
    const [gameOver, setGameOver] = useState<string | null>(null);
    const [loadingOver, setLoadingOver] = useState<boolean>(false);
    const [errorOver, setErrorOver] = useState<string | null>(null);

    const [forfeitGame, setForfeitGame] = useState<boolean>(false);
    const [loadingForfeit, setLoadingForfeit] = useState<boolean>(false);
    const [errorForfeit, setErrorForfeit] = useState<string | null>(null);

    const [exitGame, setExitGame] = useState<boolean>(false);
    const [loadingExit, setLoadingExit] = useState<boolean>(false);
    const [errorExit, setErrorExit] = useState<string | null>(null);

    const [loadingCreateGameOpponentUserId, setLoadingCreateGameOpponentUserId] = useState<string | null>(null);
    const [errorCreateGame, setErrorCreateGame] = useState<string | null>(null);
    const [successCreateGame, setSuccessCreateGame] = useState<string | null>(null);

    const [loadingJoinGameOpponentUserId, setLoadingJoinGameOpponentUserId] = useState<string | null>(null);
    const [errorJoinGame, setErrorJoinGame] = useState<string | null>(null);
    const [successJoinGame, setSuccessJoinGame] = useState<string | null>(null);

    const { onDrop, findWinner } = useChessGame({
        game,
        setGame, 
        setHistory, 
        setPlayerTurn, 
        orientation, 
        chess, 
        setFen,
        gameOver, 
        setGameOver,
        opponent,
        setErrorMove,
        setGameMoves 
    });

    /**
     * Resets the game state to its initial values.
     */
    const cleanup = useCallback(() => {
        setFen("start");
        setGame(null);
        setOrientation("w");
        setOpponent(null);
        setHistory([]);
        setGameMoves([]);
        setPlayerTurn("w");
        setGameOver(null);
    }, []);

    const { 
        handleCreateRoom, 
        handleJoinRoom, 
        handleExitRoom, 
        handleCloseRoom, 
        handleForfeit 
    } = useGameRoomManagement({
        cleanup,
        opponent,
        game,
        setGame,
        setFen,
        setHistory,
        setOrientation,
        setOpponent,
        setPlayerTurn,
        setLoadingOver,
        setErrorOver,
        setExitGame,
        setLoadingExit,
        setErrorExit,
        setForfeitGame,
        setLoadingForfeit,
        setErrorForfeit,
        setLoadingCreateGameOpponentUserId,
        setErrorCreateGame,
        setSuccessCreateGame,
        setLoadingJoinGameOpponentUserId,
        setErrorJoinGame,
        setSuccessJoinGame,
        findWinner,
    });

    return (
        <GameContext.Provider value={{
            playerTurn,
            setPlayerTurn,
            history,
            setHistory,
            opponent,
            setOpponent,
            orientation,
            setOrientation,
            game,
            setGame, 
            fen,
            setFen,
            gameOver,
            loadingOver,
            errorOver,
            setGameOver,
            cleanup,
            chess,
            forfeitGame,
            setForfeitGame,
            loadingForfeit,
            errorForfeit,
            handleForfeit,
            exitGame,
            setExitGame,
            loadingExit,
            errorExit,
            handleExitRoom,
            loadingCreateGameOpponentUserId,
            errorCreateGame,
            setErrorCreateGame,
            successCreateGame,
            setSuccessCreateGame,
            handleCreateRoom,
            loadingJoinGameOpponentUserId,
            errorJoinGame,
            setErrorJoinGame,
            successJoinGame,
            setSuccessJoinGame,
            handleJoinRoom,
            onDrop,
            handleCloseRoom,
            errorMove,
            setErrorMove,
            gameMoves,
            setGameMoves
        }}>
            {children}
        </GameContext.Provider>
    );
};

/**
 * Custom hook to access the game context and ensure it's used within a GameProvider.
 *
 * @returns {GameContextType} The current game context value.
 * @throws Will throw an error if used outside of a GameProvider.
 */
export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};