import React, { createContext, ReactNode, useContext, useState, useMemo, useCallback } from 'react';
import { Room } from './GameProviderTypes';
import { GameContextType, Opponent } from './GameProviderTypes';
import { Chess, Move } from "chess.js";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
    const [opponent, setOpponent] = useState<Opponent | null>(null);
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [room, setRoom] = useState<Room | null>(null);
    const [forfeitGame, setForfeitGame] = useState<boolean>(false);

    const chess = useMemo<Chess>(() => new Chess(), [room]);
    const [fen, setFen] = useState<string>("start");
    const [gameOver, setGameOver] = useState<string | null>(null);

    const cleanup = useCallback(() => {
        setFen("start");
        setRoom(null);
        setOrientation("w");
        setOpponent(null);
        setHistory([]);
    }, []);

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
            room,
            setRoom,
            forfeitGame,
            setForfeitGame,
            fen,
            setFen,
            gameOver,
            setGameOver,
            cleanup,
            chess
        }}>
            {children}
        </GameContext.Provider>
    );
};