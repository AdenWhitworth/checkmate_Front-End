import React, { createContext, ReactNode, useContext, useState, useMemo, useCallback } from 'react';
import { Room } from './GameProviderTypes';
import { GameContextType, Opponent } from './GameProviderTypes';
import { Chess, Move } from "chess.js";
import { usePlayer } from '../PlayerProvider/PlayerProvider';
import { useSocket } from '../SocketProvider/SocketProvider';
import { db } from "../../firebase";
import { collection, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { Invite, Player } from '../PlayerProvider/PlayerProviderTypes';
import { useChessGame } from '../../Hooks/useChessGame/useChessGame';

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
    const { socketRef, sendForfeit, sendCreateRoom, sendJoinRoom, sendCloseRoom } = useSocket();

    const [playerTurn, setPlayerTurn] = useState<"w" | "b">("w");
    const [history, setHistory] = useState<Move[]>([]);
    const [opponent, setOpponent] = useState<Opponent | null>(null);
    const [orientation, setOrientation] = useState<"w" | "b">("w");
    const [room, setRoom] = useState<Room | null>(null);

    const chess = useMemo<Chess>(() => new Chess(), [room]);
    const [fen, setFen] = useState<string>("start");
    
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

    const { onDrop, handleWinLossChange, findWinner } = useChessGame({
        room,
        setRoom, 
        setHistory, 
        setPlayerTurn, 
        orientation, 
        chess, 
        setFen,
        gameOver, 
        setGameOver,
        opponent 
    });

    const cleanup = useCallback(() => {
        setFen("start");
        setRoom(null);
        setOrientation("w");
        setOpponent(null);
        setHistory([]);
    }, []);

    const handleForfeit = useCallback(async () => {
        setLoadingForfeit(true);
        setErrorForfeit(null);
        try {
            if (!socketRef.current || !room || !player) throw new Error("Socket, room, and player required");

            const username = player.username;
            await sendForfeit({ room, username });
            cleanup();
        } catch (error) {
            setErrorForfeit("Unable to forfeit. Please try again.");
        } finally {
            setForfeitGame(false);
            setLoadingForfeit(false);
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

    const handleCreateRoom = async (potentialOpponent: Player) => {
        setLoadingCreateGameOpponentUserId(potentialOpponent.userId);
        setErrorCreateGame(null);
        setSuccessCreateGame(null);

        try {
            if (!socketRef.current) throw new Error("No room created.");

            const newRoom = await sendCreateRoom();
            if (!newRoom) throw new Error("No room created.");
            setOrientation("w");
            await invitePlayer(newRoom.room, potentialOpponent);
            setSuccessCreateGame("Game created successfully! Waiting on opponent: " + potentialOpponent.username);
        } catch (error) {
            setErrorCreateGame("Unable to create game. Please try again.")
        } finally {
            setLoadingCreateGameOpponentUserId(null);
        }
    };

    const invitePlayer = async (room: Room, potentialOpponent: Player) => {
        try {
            if (!player) throw new Error("Player not found");

            const userCollection = collection(db, 'users');
            const docRefPlayer = doc(userCollection, potentialOpponent.userId);
            const docSnap = await getDoc(docRefPlayer);
            
            if (!docSnap.exists()) throw new Error("Player not found");

            const inviteCollection = collection(docRefPlayer, 'invites');

            const roomData = {
                roomId: room.roomId,
                players: room.players.map(player => ({
                    id: player.id,
                    username: player.username
                }))
            };

            const inviteDocRef = await addDoc(inviteCollection, {
                requestUserID: player.userId,
                requestUserName: player.username,
                requestPlayerID: player.playerId,
                requestRoom: roomData,
                requestWin: player.win,
                requestLoss: player.loss,
            });

            const newOpponent: Opponent = {
                opponentUsername: docSnap.data()?.username,
                opponentUserId: docSnap.id,
                opponentPlayerId: docSnap.data()?.playerID,
                opponentWin: docSnap.data()?.win,
                opponentLoss: docSnap.data()?.loss,
                opponentInviteId: inviteDocRef.id,
            };

            setOpponent(newOpponent);
            setRoom(room);
        } catch (error) {
            throw new Error("Invitation failed")
        }
    };

    const handleJoinRoom = async (invite: Invite) => {
        setLoadingJoinGameOpponentUserId(invite.requestUserId);
        setErrorJoinGame(null);
        setSuccessJoinGame(null);
        
        try {
            if (!socketRef.current || !player) throw Error("Unable to join room");

            const updatedRoom = await sendJoinRoom({ room: invite.requestRoom});

            if (!updatedRoom) throw new Error("No updated room.");
            
            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, player.userId);
            const inviteCollection = collection(DocRef,'invites');
            const DocRef2 = doc(inviteCollection, invite.inviteId);
            deleteDoc(DocRef2);
            
            const newOpponent: Opponent = {
                opponentUsername: invite.requestUsername,
                opponentUserId: invite.requestUserId,
                opponentPlayerId: invite.requestPlayerId,
                opponentWin: invite.requestWin,
                opponentLoss: invite.requestLoss
            };

            setOpponent(newOpponent);
            setOrientation("b");
            setRoom(invite.requestRoom);
            setSuccessCreateGame("Game joined successfully! You are playing against: " + invite.requestUsername);
        } catch (error) {
            setErrorJoinGame("Enable to join game. Please try again.");
        } finally {
            setLoadingJoinGameOpponentUserId(null);
        }
    };

    const handleCloseRoom = async () => {
        setErrorOver(null);
        setLoadingOver(true);

        const winner = findWinner();
        
        try {
            if (winner !== "player" || !room) throw Error("Only winner closes the room.");
            
            await handleWinLossChange(winner);
            await sendCloseRoom({ room });
            
            cleanup();

        } catch (error) {
            setErrorOver("Enable to close game. Please try again.")
        } finally {
            setLoadingOver(false);
        }
    };

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
            handleExit,
            loadingCreateGameOpponentUserId,
            errorCreateGame,
            successCreateGame,
            handleCreateRoom,
            loadingJoinGameOpponentUserId,
            errorJoinGame,
            successJoinGame,
            handleJoinRoom,
            onDrop,
            handleCloseRoom
        }}>
            {children}
        </GameContext.Provider>
    );
};