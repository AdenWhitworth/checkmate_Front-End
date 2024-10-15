import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import plane from "../../../../../Images/Paper Plane.svg";
import { db } from '../../../../../firebase';
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { usePlayer } from "../../../../../Providers/PlayerProvider/PlayerProvider";
import { useSocket } from "../../../../../Providers/SocketProvider/SocketProvider";
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import { Opponent, Room } from '../../../../../Providers/GameProvider/GameProviderTypes';
import { PlayersItemProps } from './PlayerItemTypes';

export default function PlayersItem({ potentialPlayer, index }: PlayersItemProps) {
    const { socketRef, sendCreateRoom } = useSocket();
    const { setOrientation, setOpponent, setRoom } = useGame();
    const { player } = usePlayer();

    const handleCreateRoom = async () => {
        try {
            if (!socketRef.current) throw new Error("No room created.");

            const newRoom = await sendCreateRoom();
            if (!newRoom) throw new Error("No room created.");
            setOrientation("w");
            await invitePlayer(newRoom.room);
        } catch (error) {
            console.error("Error creating room:", error);
        }
    };

    const invitePlayer = async (room: Room) => {
        try {
            if (!player) throw new Error("Player not found");

            const userCollection = collection(db, 'users');
            const docRefPlayer = doc(userCollection, potentialPlayer.userId);
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

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    return (
        <li>
            <div className={rowClassName}>
                <img className="player-icon" src={user_white} alt="player icon" />
                <h3 className="player-username">{potentialPlayer.username}</h3>
                <div className="player-request" onClick={handleCreateRoom}>
                    <img className="request-icon" src={plane} alt="invite icon" />
                    <h3 className="request-text">Invite</h3>
                </div>
            </div>
        </li>
    );
}
