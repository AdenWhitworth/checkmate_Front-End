import React, { createContext, ReactNode, useContext, useState, useMemo, useCallback } from 'react';
import { Room } from './GameProviderTypes';
import { GameContextType, Opponent } from './GameProviderTypes';
import { Chess, Move } from "chess.js";
import { usePlayer } from '../PlayerProvider/PlayerProvider';
import { useSocket } from '../SocketProvider/SocketProvider';
import { db } from "../../firebase";
import { collection, deleteDoc, doc } from "firebase/firestore";

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const { player } = usePlayer();
    const { socketRef, sendForfeit } = useSocket();

    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
    const [opponent, setOpponent] = useState<Opponent | null>(null);
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [room, setRoom] = useState<Room | null>(null);

    const chess = useMemo<Chess>(() => new Chess(), [room]);
    const [fen, setFen] = useState<string>("start");
    const [gameOver, setGameOver] = useState<string | null>(null);

    const [forfeitGame, setForfeitGame] = useState<boolean>(false);
    const [loadingForfeit, setLoadingForfeit] = useState<boolean>(false);
    const [errorForfeit, setErrorForfeit] = useState<string | null>(null);

    const [exitGame, setExitGame] = useState<boolean>(false);
    const [loadingExit, setLoadingExit] = useState<boolean>(false);
    const [errorExit, setErrorExit] = useState<string | null>(null);

    const cleanup = useCallback(() => {
        setFen("start");
        setRoom(null);
        setOrientation("w");
        setOpponent(null);
        setHistory([]);
    }, []);

    const handleForfeit = useCallback(async () => {
        if (socketRef.current && room && player) {
            setLoadingForfeit(true);
            setErrorForfeit(null);
            try {
                const username = player.username;
                await sendForfeit({ room, username });
                cleanup();
            } catch (error) {
                setErrorForfeit("Unable to forfeit. Please try again.");
            } finally {
                setForfeitGame(false);
                setLoadingForfeit(false);
            }
        }
    }, [room, player, socketRef, sendForfeit, cleanup]);

    const handleExit = useCallback(async () => {
        setLoadingExit(true);
        setErrorExit(null);
        
        try {
            if (!opponent) throw new Error("Opponent required.");
            
            const userCollection = collection(db, "users");
            const DocRef = doc(userCollection, opponent.opponentUserId);
            const inviteCollection = collection(DocRef, "invites");
            const DocRef2 = doc(inviteCollection, opponent.opponentInviteId);
            
            await deleteDoc(DocRef2);
            cleanup();
        } catch (error) {
            setErrorExit("Unable to exit. Please try again.");
        } finally {
            setExitGame(false);
            setLoadingExit(false);
        }
    }, [opponent, cleanup]);

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
            fen,
            setFen,
            gameOver,
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
            handleExit,
        }}>
            {children}
        </GameContext.Provider>
    );
};