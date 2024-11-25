import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { BotContextType } from './BotProviderTypes';
import { GameMoves } from '../../components/Dashboard/InGameStats/InGameStatsTypes';
import { Game } from '../GameProvider/GameProviderTypes';
import { Move, Chess } from 'chess.js';
import { useBotChessGame } from '../../Hooks/useBotChessGame/useBotChessGame';

const BotContext = createContext<BotContextType | undefined>(undefined);

/**
 * Provides the bot context to its child components, managing the state and logic for bot games and moves.
 *
 * @component
 * @param {Object} props - The props object.
 * @param {ReactNode} props.children - The child components to receive the game context.
 * @returns {JSX.Element} The rendered BotProvider component.
 */
export const BotProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    const [difficulty, setDifficulty] = useState<"novice" | "intermediate" | "advanced" | "master" >("novice");
    const [help, setHelp] = useState<"assisted" | "friendly" | "challenge">("friendly");
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
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
        return instance;
    }, [game]);
    const [fen, setFen] = useState<string>("start");
    const [errorMove, setErrorMove] = useState<string | null>(null);
    const [gameMoves, setGameMoves] = useState<GameMoves[]>([]);
    const [gameOver, setGameOver] = useState<string | null>(null);

    const { onDrop } = useBotChessGame({
        game,
        setGame, 
        setHistory, 
        setPlayerTurn, 
        orientation, 
        chess, 
        setFen,
        gameOver, 
        setGameOver,
        setErrorMove,
        setGameMoves,        
    });

    /**
     * Resets the game state to its initial values.
     */
    const cleanup = useCallback(() => {
        setFen("start");
        setGame(null);
        setOrientation("w");
        setHistory([]);
        setGameMoves([]);
        setPlayerTurn("w");
        setGameOver(null);
    }, []);

    return (
        <BotContext.Provider value={{
            difficulty,
            setDifficulty,
            help,
            setHelp,
            orientation,
            setOrientation,
            game,
            setGame, 
            fen,
            setFen,
            gameOver,
            setGameOver,
            cleanup,
            chess,
            playerTurn,
            setPlayerTurn,
            history,
            setHistory,
            errorMove,
            setErrorMove,
            gameMoves,
            setGameMoves,
            onDrop
        }}>
            {children}
        </BotContext.Provider>
    );
};

/**
 * Custom hook to access the game context and ensure it's used within a BotProvider.
 *
 * @returns {BotContextType} The current bot game context value.
 * @throws Will throw an error if used outside of a BotProvider.
 */
export const useBot = (): BotContextType => {
    const context = useContext(BotContext);
    if (context === undefined) {
        throw new Error('useBot must be used within a BotProvider');
    }
    return context;
};