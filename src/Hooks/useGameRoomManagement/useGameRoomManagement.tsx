import { useCallback, useEffect } from 'react';
import { collection, deleteDoc, doc, writeBatch, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UseGameRoomManagementOutput, UseGameRoomManagementProps } from './useGameRoomManagementTypes';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { Game, Opponent, InGamePlayer } from '../../Providers/GameProvider/GameProviderTypes';
import { PlayerList, Invite } from '../../Providers/PlayerProvider/PlayerProviderTypes';
import { Move } from 'chess.js';
import { useNavigate } from "react-router-dom";

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
    setReconnectGame,
    setLoadingReconnectGame,
    setErrorReconnectGame
}: UseGameRoomManagementProps): UseGameRoomManagementOutput => {
    
    const { 
        socketRef, 
        sendForfeit, 
        sendCreateRoom, 
        sendCloseRoom, 
        sendJoinRoom,
        sendReconnectRoom
    } = useSocket();
    const { playerStatic, playerDynamic, setPlayerDynamic } = usePlayer();
    const navigate = useNavigate();

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
            if (!socketRef.current || !game || !playerStatic) throw new Error("Socket, room, and player required");

            const username = playerStatic.username;
            await sendForfeit({ game, username });
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  currentGameId: undefined,
                };
            });
            cleanup();
        } catch (error) {
            setErrorForfeit("Unable to forfeit. Please try again.");
        } finally {
            setForfeitGame(false);
            setLoadingForfeit(false);
        }
    }, [game, playerStatic, socketRef, setPlayerDynamic, sendForfeit, cleanup, setLoadingForfeit, setErrorForfeit, setForfeitGame]);

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
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  currentGameId: undefined,
                };
            });
            cleanup();
        } catch (error) {
            setErrorExit("Unable to exit. Please try again.");
        } finally {
            setExitGame(false);
            setLoadingExit(false);
        }
    },  [setLoadingExit, setErrorExit, game, opponent, sendCloseRoom, cleanup, setExitGame, setPlayerDynamic]);

    /**
     * Sends an invitation to a potential opponent to join a game room.
     * 
     * @function
     * @param {Game} game - The game to invite the opponent to.
     * @param {PlayerList} potentialOpponent - The PlayerList object of the opponent to invite.
     * @returns {Promise<void>} - A promise that resolves when the invitation is complete.
     * @throws {Error} - Throws an error if the invitation fails.
     */
    const invitePlayer = useCallback(async (game: Game, potentialOpponent: PlayerList): Promise<void> => {
        try {
            if (!playerStatic || !playerDynamic) {
                throw new Error("Player not found");
            }

            const userCollection = collection(db, 'users');
            const gamesCollection = collection(db, 'games');
            const docRefOpponent = doc(userCollection, potentialOpponent.userId);

            const docSnap = await getDoc(docRefOpponent);
            if (!docSnap.exists()) throw new Error("Opponent not found");

            const opponentData = docSnap.data();
            if (!opponentData) throw new Error("Invalid opponent data");

            const inviteCollection = collection(docRefOpponent, 'invites');
            const inviteId = doc(inviteCollection).id;

            const newOpponent: Opponent = {
                opponentUsername: opponentData.username,
                opponentUserId: docSnap.id,
                opponentPlayerId: opponentData.playerId,
                opponentElo: opponentData.elo,
                opponentInviteId: inviteId,
            };

            setOpponent(newOpponent);
            setGame(game);

            const batch = writeBatch(db);
            const inviteDocRef = doc(inviteCollection, inviteId);

            batch.set(inviteDocRef, {
                requestUserId: playerStatic.userId,
                requestUsername: playerStatic.username,
                requestPlayerId: playerStatic.playerId,
                requestGameId: game.gameId,
                requestElo: playerDynamic.elo,
            });

            const docRefUser = doc(userCollection, playerStatic.userId);
            batch.update(docRefUser, { currentGameId: game.gameId });

            const docRefGame = doc(gamesCollection, game.gameId);
            batch.update(docRefGame, { "playerB.inviteId": inviteId });

            await batch.commit();
        } catch (error) {
            setOpponent(null);
            setGame(null);
            throw new Error("Invitation failed.");
        }
    }, [playerStatic, playerDynamic, setOpponent, setGame]);

    /**
     * Handles creating a new game room and sending an invitation to the selected opponent.
     * 
     * @param {PlayerList} potentialOpponent - The PlayerList object of the opponent to invite.
     * @async
     * @returns {Promise<void>} A promise that resolves when the room creation and invitation operations are complete.
     */
    const handleCreateRoom = useCallback(async (potentialOpponent: PlayerList): Promise<void> => {
        setLoadingCreateGameOpponentUserId(potentialOpponent.userId);
        setErrorCreateGame(null);
        setSuccessCreateGame(null);
    
        try {
            if (!socketRef.current || !playerStatic || !playerDynamic) throw new Error("No game created.");
            
            const playerA: InGamePlayer = {
                userId: playerStatic.userId,
                playerId: playerStatic.playerId,
                username: playerStatic.username,
                elo: playerDynamic.elo,
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
    }, [playerStatic, playerDynamic, socketRef, sendCreateRoom, setLoadingCreateGameOpponentUserId, setErrorCreateGame, setSuccessCreateGame, setOrientation, invitePlayer]);

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
            if (!socketRef.current || !playerStatic) throw Error("Unable to join room");

            const updatedGame = await sendJoinRoom({ gameId: invite.requestGameId });

            if (!updatedGame) throw new Error("No updated room.");
            
            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, playerStatic.userId);
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
    }, [socketRef, playerStatic, sendJoinRoom, setLoadingJoinGameOpponentUserId, setErrorJoinGame, setSuccessJoinGame, setOpponent, setOrientation, setGame, setSuccessCreateGame]);

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
            setPlayerDynamic((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  currentGameId: undefined,
                };
            });
            cleanup();

        } catch (error) {
            setErrorOver("Unable to close game. Please try again.");
        } finally {
            setLoadingOver(false);
        }
    }, [findWinner, game, cleanup, sendCloseRoom, setLoadingOver, setErrorOver, setPlayerDynamic]);

    /**
     * Handles reconnecting to the current game.
     * 
     * @async
     * @returns {Promise<void>} A promise that resolves when the room closing operation is complete.
     */
    const handleReconnectRoom = useCallback(async () => {
        if (!game && playerDynamic?.currentGameId && playerStatic?.userId) {
            setErrorReconnectGame(null);
            setLoadingReconnectGame(true);
            
            try {
                const reconnectedGame = await sendReconnectRoom({ gameId: playerDynamic.currentGameId });
                
                if (!reconnectedGame?.game) throw new Error("No game to reconnect to.");
                    
                const isPlayerA = playerStatic.userId === reconnectedGame.game.playerA.userId;

                setOrientation(isPlayerA? reconnectedGame.game.playerA.orientation : reconnectedGame.game.playerB.orientation);

                setOpponent(isPlayerA? {
                    opponentUsername: reconnectedGame.game.playerB.username,
                    opponentUserId: reconnectedGame.game.playerB.userId,
                    opponentPlayerId: reconnectedGame.game.playerB.playerId,
                    opponentElo: reconnectedGame.game.playerB.elo,
                    opponentInviteId: reconnectedGame.game.playerB.inviteId || undefined
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
                        throw new Error("Unable to parse move");
                    }
                }).filter((move) => move !== null);

                setPlayerTurn(reconnectedGame.game.currentTurn);
                setHistory(deserializedHistory || []);
                setGame(reconnectedGame.game);
                setReconnectGame(true);
                navigate('/dashboard', { replace: true });
            } catch (error) {
                setOpponent(null);
                setFen("start");
                setErrorReconnectGame("Failed to reconnect to the active game. Please try again.")
            } finally {
                setLoadingReconnectGame(false);
            }
        }
    }, [game, playerDynamic, playerStatic, setErrorReconnectGame, setLoadingReconnectGame, setReconnectGame, sendReconnectRoom, setOrientation, setOpponent, setFen, setPlayerTurn, setHistory, setGame, navigate]);
    
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
        handleReconnectRoom,
    };
};
