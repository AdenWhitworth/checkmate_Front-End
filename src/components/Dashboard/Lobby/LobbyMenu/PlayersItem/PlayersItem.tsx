import React from 'react';
import user_white from "../../../../../Images/User White.svg";
import plane from "../../../../../Images/Paper Plane.svg";
import { useGame } from "../../../../../Providers/GameProvider/GameProvider";
import { PlayersItemProps } from './PlayerItemTypes';
import LoadingDots from '../../../../LoadingDots/LoadingDots';

export default function PlayersItem({ potentialOpponent, index }: PlayersItemProps) {
    const { handleCreateRoom, loadingCreateGameOpponentUserId } = useGame();

    const rowClassName = `player-line ${index % 2 === 0 ? "even-color" : "odd-color"}`;

    const handleOppentClick = () => {
        handleCreateRoom(potentialOpponent);
    };

    return (
        <li>
            <div className={rowClassName}>
                <img className="player-icon" src={user_white} alt="player icon" />
                <h3 className="player-username">{potentialOpponent.username}</h3>
                <div className="player-request" onClick={handleOppentClick}>
                    {loadingCreateGameOpponentUserId === potentialOpponent.userId ? (
                        <LoadingDots position={'center'} color={'black'} size={'small'} />
                    ) : (
                        <>
                            <img className="request-icon" src={plane} alt="invite icon" />
                            <h3 className="request-text">Invite</h3>
                        </>
                    )}
                </div>
            </div>
        </li>
    );
}
