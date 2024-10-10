import React from 'react';
import './LeaderBoard.css';
import { useLeaderBoard } from '../../../../Hooks/useLeaderBoard/useLeaderBoard'
import LeaderBoardItem from './LeaderBoardItem/LeaderBoardItem';

export default function LeaderBoard(): JSX.Element {
    
    const {leaderBoardPlayers } = useLeaderBoard();
    
    return (
        <div className="leaderboard">
            <h1>Leader Board</h1>
            <ul className="leader-list">
                {leaderBoardPlayers.map((player, index) => (
                    <LeaderBoardItem key={player.id} player={player} index={index} />
                ))}
            </ul>
        </div>
    );
}