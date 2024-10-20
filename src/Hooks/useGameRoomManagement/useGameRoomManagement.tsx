import { useCallback } from 'react';
import { collection, deleteDoc, doc, addDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { UseGameRoomManagementOutput, UseGameRoomManagementProps } from './useGameRoomManagementTypes';
import { useSocket } from '../../Providers/SocketProvider/SocketProvider';
import { usePlayer } from '../../Providers/PlayerProvider/PlayerProvider';
import { Opponent, Room } from '../../Providers/GameProvider/GameProviderTypes';
import { Player, Invite } from '../../Providers/PlayerProvider/PlayerProviderTypes';

/**
 * Custom hook for managing game room actions including creating, joining, forfeiting, exiting, and closing game rooms.
 *
 * @param {UseGameRoomManagementProps} props - The properties required by the useGameRoomManagement hook.
 * @returns {UseGameRoomManagementOutput} - An object containing functions to handle game room management such as creating, joining, exiting, forfeiting, and closing game rooms.
 */
export const useGameRoomManagement = ({
    cleanup,
    opponent,
    room,
    setRoom,
    setOrientation,
    setOpponent,
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
    handleWinLossChange,
}: UseGameRoomManagementProps): UseGameRoomManagementOutput => {
    
    const { 
        socketRef, 
        sendForfeit, 
        sendCreateRoom, 
        sendCloseRoom, 
        sendJoinRoom 
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
    }, [room, player, socketRef, sendForfeit, cleanup, setLoadingForfeit, setErrorForfeit, setForfeitGame]);

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
    }, [opponent, cleanup, setLoadingExit, setErrorExit, setExitGame]);

    /**
     * Sends an invitation to a potential opponent to join a game room.
     * 
     * @function
     * @param {Room} room - The game room to invite the opponent to.
     * @param {Player} potentialOpponent - The player object of the opponent to invite.
     * @returns {Promise<void>} - A promise that resolves when the invitation is complete.
     * @throws {Error} - Throws an error if the invitation fails.
     */
    const invitePlayer = useCallback(async (room: Room, potentialOpponent: Player): Promise<void> => {
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
        throw new Error("Invitation failed");
    }
    }, [player, setOpponent, setRoom]);


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
            if (!socketRef.current) throw new Error("No room created.");
    
            const newRoom = await sendCreateRoom();
            if (!newRoom) throw new Error("No room created.");
            
            setOrientation("w");
            await invitePlayer(newRoom.room, potentialOpponent);
            setSuccessCreateGame("Game created successfully! Waiting on opponent: " + potentialOpponent.username);
        } catch (error) {
            setErrorCreateGame("Unable to create game. Please try again.");
        } finally {
            setLoadingCreateGameOpponentUserId(null);
        }
    }, [socketRef, sendCreateRoom, setLoadingCreateGameOpponentUserId, setErrorCreateGame, setSuccessCreateGame, setOrientation, invitePlayer]);

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

            const updatedRoom = await sendJoinRoom({ room: invite.requestRoom });

            if (!updatedRoom) throw new Error("No updated room.");
            
            const userCollection = collection(db, 'users');
            const DocRef = doc(userCollection, player.userId);
            const inviteCollection = collection(DocRef, 'invites');
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
            setRoom(updatedRoom.room);
            setSuccessCreateGame("Game joined successfully! You are playing against: " + invite.requestUsername);
        } catch (error) {
            setErrorJoinGame("Unable to join game. Please try again.");
        } finally {
            setLoadingJoinGameOpponentUserId(null);
        }
    }, [socketRef, player, sendJoinRoom, setLoadingJoinGameOpponentUserId, setErrorJoinGame, setSuccessJoinGame, setOpponent, setOrientation, setRoom, setSuccessCreateGame]);

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
            if (winner !== "player" || !room) {
                cleanup();
                return;
            }
            
            await handleWinLossChange(winner);
            await sendCloseRoom({ room });
            
            cleanup();

        } catch (error) {
            setErrorOver("Unable to close game. Please try again.");
        } finally {
            setLoadingOver(false);
        }
    }, [findWinner, room, cleanup, handleWinLossChange, sendCloseRoom, setLoadingOver, setErrorOver]);

    return {
        handleForfeit,
        handleExitRoom,
        handleCreateRoom,
        handleJoinRoom,
        handleCloseRoom,
    };
};
