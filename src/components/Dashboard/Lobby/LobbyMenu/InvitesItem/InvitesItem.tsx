import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import check from "../../../../../Images/Check.svg"
import { InvitesItemProps } from './InvitesItemTypes';
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import LoadingDots from '../../../../LoadingDots/LoadingDots';

/**
 * InvitesItem component displays an invitation to join a game room, with an option to accept the invite.
 * It includes a visual loading indicator when an invite is being processed.
 * 
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.invite - The invite object containing details about the invitation.
 * @param {string} props.invite.requestUserId - The ID of the user who sent the invite.
 * @param {string} props.invite.requestUsername - The username of the user who sent the invite.
 * @param {number} props.index - The index of the invite item in the list.
 * 
 * @returns {JSX.Element} The rendered InvitesItem component.
 */
export default function InvitesItem({invite, index}: InvitesItemProps): JSX.Element {
    const { handleJoinRoom, loadingJoinGameOpponentUserId } = useGame();

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;
    const isLoadingJoin = loadingJoinGameOpponentUserId === invite.requestUserId;

    /**
     * Attempt to join the room based on the invitation selected to join
     */
    const handleInviteClick = () => {
        handleJoinRoom(invite);
    };

    return (
        <li>
            <div className={rowClassName}>
                <img 
                    className="player-icon" 
                    src={user_white}
                    alt={`${invite.requestUsername} avatar`}
                ></img>
                <h3 className="player-username">{invite.requestUsername}</h3>
                <button 
                    className="player-request" 
                    onClick={handleInviteClick}
                    disabled={isLoadingJoin}
                >
                    {isLoadingJoin ? (
                        <LoadingDots position={'center'} color={'black'} size={'small'} />
                    ):(
                        <>
                            <img className="request-icon" src={check} alt={`${invite.requestUsername} check icon`}></img>
                            <h3 className="request-text">Join</h3>
                        </>
                    )}
                </button>
            </div>
        </li>
    );
}