import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import plane from "../../../../../Images/Paper Plane.svg";
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import { PlayersItemProps } from './PlayerItemTypes';
import LoadingDots from '../../../../LoadingDots/LoadingDots';

/**
 * PlayersItem component displays information about a potential opponent in a list format.
 * It handles creating a game room when a user selects an opponent.
 * 
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.potentialOpponent - An object representing the potential opponent.
 * @param {string} props.potentialOpponent.userId - The unique ID of the opponent.
 * @param {string} props.potentialOpponent.username - The username of the opponent.
 * @param {number} props.index - The index of this opponent in the list.
 * @returns {JSX.Element} The rendered PlayersItem component.
 */
export default function PlayersItem({ potentialOpponent, index }: PlayersItemProps): JSX.Element {
    const { handleCreateRoom, loadingCreateGameOpponentUserId } = useGame();

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;
    const isLoadingCreate = loadingCreateGameOpponentUserId === potentialOpponent.userId;

    /**
     * Attempt to create the room based on the player selected to invite
     */
    const handleOppentClick = () => {
        handleCreateRoom(potentialOpponent);
    };

    return (
        <li>
            <div className={rowClassName}>
                <img 
                    className="player-icon" 
                    src={user_white} 
                    alt={`${potentialOpponent.username} avatar`} 
                />
                <h3 className="player-username">{`${potentialOpponent.username} (${potentialOpponent.elo})`}</h3>
                <button 
                    className="player-request" 
                    onClick={handleOppentClick}
                    disabled={isLoadingCreate}
                >
                    {isLoadingCreate ? (
                        <LoadingDots position={'center'} color={'black'} size={'small'} />
                    ) : (
                        <>
                            <img className="request-icon" src={plane} alt="invite icon" />
                            <h3 className="request-text">Invite</h3>
                        </>
                    )}
                </button>
            </div>
        </li>
    );
}
