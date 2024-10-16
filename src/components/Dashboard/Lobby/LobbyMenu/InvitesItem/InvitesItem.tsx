import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import check from "../../../../../Images/Check.svg"
import { InvitesItemProps } from './InvitesItemTypes';
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import LoadingDots from '../../../../LoadingDots/LoadingDots';

export default function InvitesItem({invite, index}: InvitesItemProps) {
    const { handleJoinRoom, loadingJoinGameOpponentUserId } = useGame();

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    const handleInviteClick = () => {
        handleJoinRoom(invite);
    };

    return (
        <li>
            <div className={rowClassName}>
                <img className="player-icon" src={user_white}></img>
                <h3 className="player-username">{invite.requestUsername}</h3>
                <div className="player-request" onClick={handleInviteClick}>
                    {loadingJoinGameOpponentUserId === invite.requestUserId ? (
                        <LoadingDots position={'center'} color={'black'} size={'small'} />
                    ):(
                        <>
                            <img className="request-icon" src={check}></img>
                            <h3 className="request-text">Join</h3>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}