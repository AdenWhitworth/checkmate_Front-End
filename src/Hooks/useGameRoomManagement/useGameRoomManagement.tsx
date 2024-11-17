import { useCallback, useEffect } from 'react';
import { collection, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UseGameRoomManagementOutput, UseGameRoomManagementProps } from './useGameRoomManagementTypes';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { Game, Opponent, InGamePlayer } from '../../Providers/GameProvider/GameProviderTypes';
import { Player, Invite } from '../../Providers/PlayerProvider/PlayerProviderTypes';
import { Move } from 'chess.js';

/*
 * Custom hook for managing game room actions including creating, joining, forfeiting, exiting, and closing game rooms.
 *
 * @param {UseGameRoomManagementProps} props - The properties required by the useGameRoomManagement hook.
 * @returns {UseGameRoomManagementOutput} - An object containing functions to handle game room management such as creating, joining, exiting, forfeiting, and closing game rooms.
 */
export const useGameRoomManagement = ({
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
}: UseGameRoomManagementProps): UseGameRoomManagementOutput => {
    
    const { 
        socketRef, 
        sendForfeit, 
        sendCreateRoom, 
        sendCloseRoom, 
        sendJoinRoom,
        sendReconnectRoom
    } = useSocket();
    const { player } = usePlayer();

    /**
     * Handles forfeiting the current game by notifying the server and resetting the state.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the forfeit operation is complete.
     */
    const handleForfeit = useCallback(async (): Promise<void> => {
        setLoadingForfeit(true);
        setErrorForfeit(null);
        try {
            if (!socketRef.current || !game || !player) throw new Error("Socket, room, and player required");

            const username = player.username;
            await sendForfeit({ game, username });
            cleanup();
        } catch (error) {
            setErrorForfeit("Unable to forfeit. Please try again.");
        } finally {
            setForfeitGame(false);
            setLoadingForfeit(false);
        }
    }, [game, player, socketRef, sendForfeit, cleanup, setLoadingForfeit, setErrorForfeit, setForfeitGame]);

    /**
     * Handles exiting the current game room by deleting the corresponding invitation document.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the exit operation is complete.
     */
    const handleExitRoom = useCallback(async (): Promise<void> => {
        setLoadingExit(true);
        setErrorExit(null);
        
        try {
            if(!game) throw Error("Game required to exit.");
            if (!opponent) throw new Error("Opponent required.");

            await sendCloseRoom({ game: game, inviteCancelled: true, opponent: opponent });

            cleanup();
        } catch (error) {
            setErrorExit("Unable to exit. Please try again.");
        } finally {
            setExitGame(false);
            setLoadingExit(false);
        }
    },  [setLoadingExit, setErrorExit, game, opponent, sendCloseRoom, cleanup, setExitGame]);

    /**
     * Sends an invitation to a potential opponent to join a game room.
     * 
     * @function
     * @param {Game} game - The game to invite the opponent to.
     * @param {Player} potentialOpponent - The player object of the opponent to invite.
     * @returns {Promise<void>} - A promise that resolves when the invitation is complete.
     * @throws {Error} - Throws an error if the invitation fails.
     */
    const invitePlayer = useCallback(async (game: Game, potentialOpponent: Player): Promise<void> => {
        try {
            if (!player) throw new Error("Player not found");

            const userCollection = collection(db, 'users');
            const docRefPlayer = doc(userCollection, potentialOpponent.userId);
            const docSnap = await getDoc(docRefPlayer);
            
            if (!docSnap.exists()) throw new Error("Player not found");

            const inviteCollection = collection(docRefPlayer, 'invites');

            const inviteDocRef = await addDoc(inviteCollection, {
                requestUserId: player.userId,
                requestUsername: player.username,
                requestPlayerId: player.playerId,
                requestGameId: game.gameId,
                requestElo: player.elo,
            });

            const newOpponent: Opponent = {
                opponentUsername: docSnap.data()?.username,
                opponentUserId: docSnap.id,
                opponentPlayerId: docSnap.data()?.playerId,
                opponentElo: docSnap.data()?.elo,
                opponentInviteId: inviteDocRef.id,
            };

            setOpponent(newOpponent);
            setGame(game);
        } catch (error) {
            throw new Error("Invitation failed");
        }
    }, [player, setOpponent, setGame]);

    /**
     * Handles creating a new game room and sending an invitation to the selected opponent.
     * 
     * @param {Player} potentialOpponent - The player object of the opponent to invite.
     * @async
     * @returns {Promise<void>} A promise that resolves when the room creation and invitation operations are complete.
     */
    const handleCreateRoom = useCallback(async (potentialOpponent: Player): Promise<void> => {
        setLoadingCreateGameOpponentUserId(potentialOpponent.userId);
        setErrorCreateGame(null);
        setSuccessCreateGame(null);
    
        try {
            if (!socketRef.current || !player) throw new Error("No game created.");
            
            const playerA: InGamePlayer = {
                userId: player.userId,
                playerId: player.playerId,
                username: player.username,
                elo: player.elo,
                connected: "pending",
                orientation: "w",
            };

            const playerB: InGamePlayer = {
                userId: potentialOpponent.userId,
                playerId: potentialOpponent.playerId,
                username: potentialOpponent.username,
                elo: potentialOpponent.elo,
                connected: "pending",
                orientation: "b",
            };

            const newGame = await sendCreateRoom({playerA: playerA, playerB: playerB});
            if (!newGame) throw new Error("No game created.");
            
            setOrientation("w");
            await invitePlayer(newGame.game, potentialOpponent);
            setSuccessCreateGame("Game created successfully! Waiting on opponent: " + potentialOpponent.username);
        } catch (error) {
            setErrorCreateGame("Unable to create game. Please try again.");
        } finally {
            setLoadingCreateGameOpponentUserId(null);
        }
    }, [player, socketRef, sendCreateRoom, setLoadingCreateGameOpponentUserId, setErrorCreateGame, setSuccessCreateGame, setOrientation, invitePlayer]);

    /**
     * Handles joining a game room using the provided invitation.
     * 
     * @param {Invite} invite - The invitation containing room information and opponent details.
     * @async
     * @returns {Promise<void>} A promise that resolves when the room joining operation is complete.
     */
    const handleJoinRoom = useCallback(async (invite: Invite): Promise<void> => {
        setLoadingJoinGameOpponentUserId(invite.requestUserId);
        setErrorJoinGame(null);
        setSuccessJoinGame(null);
        
        try {
            if (!socketRef.current || !player) throw Error("Unable to join room");

            const updatedGame = await sendJoinRoom({ gameId: invite.requestGameId });

            if (!updatedGame) throw new Error("No updated room.");
            
            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, player.userId);
            const inviteCollection = collection(DocRef, 'invites');
            const DocRef2 = doc(inviteCollection, invite.inviteId);
            deleteDoc(DocRef2);
            
            const newOpponent: Opponent = {
                opponentUsername: invite.requestUsername,
                opponentUserId: invite.requestUserId,
                opponentPlayerId: invite.requestPlayerId,
                opponentElo: invite.requestElo,
            };

            setOpponent(newOpponent);
            setOrientation("b");
            setGame(updatedGame.game);
            setSuccessCreateGame("Game joined successfully! You are playing against: " + invite.requestUsername);
        } catch (error) {
            setErrorJoinGame("Unable to join game. Please try again.");
        } finally {
            setLoadingJoinGameOpponentUserId(null);
        }
    }, [socketRef, player, sendJoinRoom, setLoadingJoinGameOpponentUserId, setErrorJoinGame, setSuccessJoinGame, setOpponent, setOrientation, setGame, setSuccessCreateGame]);

    /**
     * Handles closing the current game room and updating win/loss records if necessary.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the room closing operation is complete.
     */
    const handleCloseRoom = useCallback(async ():Promise<void> => {
        setErrorOver(null);
        setLoadingOver(true);

        const winner = findWinner();
        
        try {
            if(!game || !winner){
                throw new Error("Active game with winner required");
            }

            const updatedGame: Game = { ...game, winner };
            
            await sendCloseRoom({ game: updatedGame, inviteCancelled: false});
            
            cleanup();

        } catch (error) {
            setErrorOver("Unable to close game. Please try again.");
        } finally {
            setLoadingOver(false);
        }
    }, [findWinner, game, cleanup, sendCloseRoom, setLoadingOver, setErrorOver]);

    /**
     * Handles reconnecting to the current game.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the room closing operation is complete.
     */
    const handleReconnectRoom = useCallback(async () => {
        if (!game && player?.currentGameId) {
            try {
                const reconnectedGame = await sendReconnectRoom({ gameId: player.currentGameId });
                
                if (!reconnectedGame?.game) throw new Error("No game to reconnect to.")
                    
                const isPlayerA = player.userId === reconnectedGame.game.playerA.userId;

                setOrientation(isPlayerA? reconnectedGame.game.playerA.orientation : reconnectedGame.game.playerB.orientation);
                
                setOpponent(isPlayerA? {
                    opponentUsername: reconnectedGame.game.playerB.username,
                    opponentUserId: reconnectedGame.game.playerB.userId,
                    opponentPlayerId: reconnectedGame.game.playerB.playerId,
                    opponentElo: reconnectedGame.game.playerB.elo
                } : {
                    opponentUsername: reconnectedGame.game.playerA.username,
                    opponentUserId: reconnectedGame.game.playerA.userId,
                    opponentPlayerId: reconnectedGame.game.playerA.playerId,
                    opponentElo: reconnectedGame.game.playerA.elo
                });
                
                setFen(reconnectedGame.game.fen);
                
                const deserializedHistory: Move[] = reconnectedGame.game.history?.map((moveString: string) => {
                    try {
                        return JSON.parse(moveString);
                    } catch (error) {
                        console.error("Failed to parse move:", moveString);
                        return null;
                    }
                }).filter((move) => move !== null);

                setPlayerTurn(reconnectedGame.game.currentTurn);
                setHistory(deserializedHistory || []);
                setGame(reconnectedGame.game);
            } catch (error) {
                console.error("Failed to reconnect to game:", error);
            }
        }
    }, [game, player, sendReconnectRoom, setGame, setOpponent, setOrientation, setFen, setHistory, setPlayerTurn]);
    
    /**
     * Attempts to reconnect to a game when the component mounts or when `handleReconnectRoom` changes.
     */
    useEffect(() => {
        handleReconnectRoom();
    }, [handleReconnectRoom]);
    
    return {
        handleForfeit,
        handleExitRoom,
        handleCreateRoom,
        handleJoinRoom,
        handleCloseRoom,
    };
};
