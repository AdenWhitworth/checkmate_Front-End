import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import check from "../../../../../Images/Check.svg"
import { InvitesItemProps } from './InvitesItemTypes';
import { db } from '../../../../../firebase';
import { collection, doc, deleteDoc } from "firebase/firestore";
import { useSocket } from "../../../../../Providers/SocketProvider/SocketProvider";
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import { usePlayer } from "../../../../../Providers/PlayerProvider/PlayerProvider";
import { Opponent } from '../../../../../Providers/GameProvider/GameProviderTypes';

export default function InvitesItem({invite, index}: InvitesItemProps) {

    const { socketRef, sendJoinRoom } = useSocket();
    const { setOrientation, setOpponent, setRoom } = useGame();
    const { player } = usePlayer();

    const handleJoinRoom = async () => {
        try {
            if (!socketRef.current || !player) throw Error("Unable to join room");

            await sendJoinRoom({ room: invite.requestRoom});
            
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
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    return (
        <li>
            <div className={rowClassName}>
                <img className="player-icon" src={user_white}></img>
                <h3 className="player-username">{invite.requestUsername}</h3>
                <div className="player-request" onClick={handleJoinRoom}>
                    <img className="request-icon" src={check}></img>
                    <h3 className="request-text">Join</h3>
                </div>
            </div>
        </li>
    );
}